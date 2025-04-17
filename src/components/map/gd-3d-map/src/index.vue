<template>
  <div :id="'div_' + comid" :style="wrapperStyle">
    <div style="width:100%;height:100%; padding:0;margin:0" :id="comid"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef, ref, getCurrentInstance, onUnmounted, onMounted, watch, reactive } from 'vue'
import type { CSSProperties } from 'vue'
import { Gd3dMap } from './gd-3d-map'
import { useDataCenter } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { useEventCenter } from '@/mixins/event-center'
import { HandleItemField } from '@/components/data-handle'
import request from '@/utils/request'
import { DatavError } from '@/domains/error'
import dcRequest from '@/utils/dc-request'
import AMapLoader from '@amap/amap-jsapi-loader'
import * as yangpuGeo from './yangpu.json'
import { LocalValueModule } from '@/store/modules/localvalue'
import { DatavComponent } from '@/components/datav-component'



interface mapPointSetting {
  name: string
  apiUrl?: string
  dataJson?: any
  iconUrl: string
  params?: any
  iconWidth: number
  iconHeight: number
}

interface mapPolylineSetting {
  name: string
  apiUrl?: string
  dataJson?: any
  isOutline: boolean
  outlineColor: string
  borderWeight: number
  strokeColor: string
  strokeOpacity: number
  strokeWeight: number
  strokeStyle: string

}

interface mapTextSetting {
  text: string
  anchor: string
  draggable: boolean
  cursor: string
  angle: number
  textStyle: {
    width: string
    fontFamily: string
    fontSize: number
    color: string
    fontWeight: string
  },
  position: {
    lng: number
    lat: number
  }
}

interface mapHeatSetting {
  dataJson?: any
  apiUrl?: string
  colorStops?: any[]
  blurRadius?: number
  maxPixelIntensity?: number
  minPixelIntensity?: number
  field?: string
}

interface mapPoint3d {
  lng?: number //经度
  lat?: number //维度
  params?: any
}

interface mapHeat2d {
  lng?: number //经度
  lat?: number //维度
  count?: number
}

interface mapCenterZoom {
  lng?: number //经度
  lat?: number //维度
  zoom?: number //缩放
}


export default defineComponent({
  name: 'VGd3dMap',
  props: {
    com: {
      type: Object as PropType<Gd3dMap>,
      required: true,
    },
  },

  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)

    const config = toRef(props.com, 'config')
    const comid = toRef(props.com, 'id').value
    const attr = toRef(props.com, 'attr')
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter
    const isInit = ref(true);
    let map: any = null;
    let AmapModel: any = null;
    let heatmap = null;
    let trafficLayer = null;
    let areaLayer = null;
    let geoLayer = null;
    const layerGroups = reactive([]);
    var heatmapData = [{
      "lng": 121.5174,
      "lat": 31.2962,
      "count": 10
    }, {
      "lng": 121.5171,
      "lat": 31.2963,
      "count": 11
    }, {
      "lng": 121.5172,
      "lat": 31.2964,
      "count": 12
    }, {
      "lng": 121.5172,
      "lat": 31.2964,
      "count": 13
    }, {
      "lng": 121.5172,
      "lat": 31.2964,
      "count": 14
    }, {
      "lng": 121.5172,
      "lat": 31.2964,
      "count": 15
    }, {
      "lng": 121.5172,
      "lat": 31.2964,
      "count": 16
    }, {
      "lng": 121.5172,
      "lat": 31.2964,
      "count": 17
    }, {
      "lng": 121.5172,
      "lat": 31.2964,
      "count": 18
    }, {
      "lng": 121.5172,
      "lat": 31.2964,
      "count": 19
    }];

    onMounted(() => {
      AMapLoader.load({
        key: config.value.key.length > 0 ? config.value.key : "e945b021b459b34f5a5ade7a30e0b351", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.HeatMap', 'AMap.GeoJSON', 'AMap.DistrictSearch'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          AmapModel = AMap;

          map = new AMap.Map(comid, {
            // 设置地图容器id
            viewMode: "3D", // 是否为3D地图模式
            zoom: config.value.zoom, // 初始化地图级别
            rotateEnable: config.value.rotateEnable,//是否可旋转
            zooms: [config.value.zooms.min, config.value.zooms.max],//缩放级别范围
            center: [config.value.center.lng, config.value.center.lat], // 初始化地图中心点位置
            features: config.value.features,
            wallColor: config.value.wallColor,
            roofColor: config.value.roofColor
          });

          setMapStyle(config.value.theme);
          //实时路况图层
          trafficLayer = new AMap.TileLayer.Traffic({
            zIndex: 10,
            zooms: [7, 22],
            tileSize: 128,
            visible: false
          });

          trafficLayer.setMap(map);

          if (config.value.trafficLayer) {
            trafficLayer.show();
          }

          geoLayer = new AMap.GeoJSON({
            geoJSON: yangpuGeo,
            // 还可以自定义getMarker和getPolyline
            getPolygon: (geojson, lnglats) => {
              // 计算面积
              return new AMap.Polygon({
                path: lnglats,
                fillOpacity: 0.05, // 面积越大透明度越高
                strokeColor: "rgba(0, 174, 255, 0.72)",
                strokeWeight: 1.2,
                fillColor: "rgba(0 ,174 ,255,0.1)",
              });
            },
          });

          if (config.value.geoLayer) {
            map.add(geoLayer);
          }

          if (config.value.showPark) {
            initMapPolygon();
          }

          initMapPoints();

          initMapPolylines();

          initMapTexts();

          var opts = {
            subdistrict: 0,
            extensions: 'all',
            level: 'district'
          };
          //利用行政区查询获取边界构建mask路径
          //也可以直接通过经纬度构建mask路径
          if (config.value.areaLayer.enable) {
            var district = new AMap.DistrictSearch(opts);
            district.search(config.value.areaLayer.district, (status, result) => {
              var bounds = result.districtList[0].boundaries;
              if (config.value.areaLayer.hideOther.enable) {
                areaLayer = []
                for (var i = 0; i < bounds.length; i += 1) {
                  areaLayer.push([bounds[i]])
                }
                map.setMask(areaLayer);

                let maskBg = document.getElementsByClassName('amap-layers')[0];
                maskBg.setAttribute('style', 'background-color:' + config.value.areaLayer.hideOther.color + ';');
              }

              if (config.value.areaLayer.border.show) {
                //添加描边
                for (var i = 0; i < bounds.length; i += 1) {
                  new AMap.Polyline({
                    path: bounds[i],
                    strokeColor: config.value.areaLayer.border.color,
                    strokeWeight: config.value.areaLayer.border.width,
                    map: map
                  })
                }
              }
            });
          }

          heatmap = new AMap.HeatMap(map, {
            radius: 25, //给定半径
            opacity: [0, 0.8],
            //3d 相关的参数
            '3d': {
              //热度转高度的曲线控制参数，可以利用左侧的控制面板获取
              heightBezier: [0.4, 0.2, 0.4, 0.8],
              //取样精度，值越小，曲面效果越精细，但同时性能消耗越大
              gridSize: 2,
              heightScale: 1
            }
          });

        })
        .catch((e) => {
          console.log(e);
        });
    })


    const setMapPoints = (settings: mapPointSetting[]) => {

      settings.forEach(setting => {

        if (setting.apiUrl != null) {
          request.get(setting.apiUrl).then(r => {
            let points = r.data as mapPoint3d[]
            setCityMapPoints(setting, points);
          })
        }
        else {
          try {
            if (setting.dataJson != null) {
              let points = setting.dataJson as mapPoint3d[]
              setCityMapPoints(setting, points);
            }
          } catch (error) {
            throw new DatavError('散点数据转化失败', error.toString(), {
              targetId: props.com.id,
              origin: error,
            })
          }

        }
      })
    }

    const setCityMapPoints = (setting: mapPointSetting, points: mapPoint3d[]) => {

      var markers = [];

      points.forEach((point, index) => {
        if (point.lng && point.lat) {
          var marker = new AmapModel.Marker({
            position: new AmapModel.LngLat(point.lng, point.lat),
            icon: new AmapModel.Icon({
              size: new AmapModel.Size(setting.iconWidth, setting.iconHeight),
              image: setting.iconUrl,
              imageSize: new AmapModel.Size(setting.iconWidth, setting.iconHeight),
              imageOffset: new AmapModel.Pixel(0, 0)
            }),
            anchor: 'bottom-center',
            extData: point.params
          });
          marker.on('click', function (e) {
            //console.log("e", e.target.getExtData());
            if (props.com.handles
              && props.com.handles.clickPoint
              && props.com.handles.clickPoint.fields
              && props.com.handles.clickPoint.fields.length > 0) {
              props.com.handles.clickPoint.fields.forEach(field => {
                field.value = e.target.getExtData()
                if (field.hasDecideScript) {
                  if (field.decideScript) {
                    try {
                      const func = new Function("data,com", field.decideScript);
                      const decideRes: boolean = func(field.value, props.com);
                      if (decideRes) {
                        // emit自定义事件
                        mitter.emit(field.targetComId, field);
                      } else {
                        //console.log("未满足触发条件：" + field.targetComId);
                      }
                    } catch (error) {
                      throw new DatavError("过滤条件执行失败", error.toString(), {
                        targetId: props.com.id,
                        origin: error
                      });
                    }
                  } else {
                    //console.log("未编写执行语句");
                  }
                } else {
                  mitter.emit(field.targetComId, field);
                }


                // field.value = e.target.getExtData();
                // mitter.emit(field.targetComId, field)
              })
            }
          });
          //map.add(marker);
          markers.push(marker);
        }

        var overlayGroups = new AmapModel.OverlayGroup(markers);
        layerGroups.push({ name: setting.name, points: overlayGroups });
        map.add(overlayGroups);
      })
    }

    watch(() => config.value.areaLayer.district, () => {
      if (map) {
        map.clearMap();
        var opts = {
          subdistrict: 0,
          extensions: 'all',
          level: 'district'
        };

        var district = new AmapModel.DistrictSearch(opts);
        district.search(config.value.areaLayer.district, (status, result) => {
          var bounds = result.districtList[0].boundaries;
          if (config.value.areaLayer.hideOther.enable) {
            areaLayer = []
            for (var i = 0; i < bounds.length; i += 1) {
              areaLayer.push([bounds[i]])
            }
            map.setMask(areaLayer);

            let maskBg = document.getElementsByClassName('amap-layers')[0];
            maskBg.setAttribute('style', 'background-color:' + config.value.areaLayer.hideOther.color + ';');
          }

          if (config.value.areaLayer.border.show) {
            //添加描边
            for (var i = 0; i < bounds.length; i += 1) {
              new AmapModel.Polyline({
                path: bounds[i],
                strokeColor: config.value.areaLayer.border.color,
                strokeWeight: config.value.areaLayer.border.width,
                map: map
              })
            }
          }

          map.setFitView();
        });
      }

    })

    watch(() => config.value.theme, () => {
      setMapStyle(config.value.theme);
    })

    watch(() => config.value.trafficLayer, () => {
      if (config.value.trafficLayer) {
        trafficLayer.show();
      }
      else {
        trafficLayer.hide();
      }
    })

    watch(() => config.value.geoLayer, () => {
      if (config.value.geoLayer) {
        map.add(geoLayer);
      }
      else {
        map.remove(geoLayer);
      }
    })

    watch(() => config.value.showPoint, () => {
      let features = ["bg"];

      if (config.value.features.find(r => r == 'road')) {
        features.push("road");
      }

      features.push("building");

      if (config.value.showPoint) {
        features.push("point");
      }

      config.value.features = features;
      map.setFeatures(config.value.features);
    })

    watch(() => config.value.showRoad, () => {
      let features = ["bg"];
      if (config.value.showRoad) {
        features.push("road");
      }

      features.push("building");
      if (config.value.features.find(r => r == 'point')) {
        features.push("point");
      }


      config.value.features = features;
      map.setFeatures(config.value.features);
    })


    const setMapStyle = (theme: string) => {
      var styleName = "amap://styles/" + theme;
      map.setMapStyle(styleName);
    }

    onUnmounted(() => {
      map?.destroy();
    });

    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      let pointSource: mapPointSetting[] = [];
      let heatSource: mapHeatSetting = {};
      let groupName: string = "";
      let mapCenterZoom: mapCenterZoom = {};
      switch (field.targetMethodName) {
        case 'clearMapPoint':
          clearMapPoint();
          break
        case 'setMapPoint':
          const setMapPoint_jsonData = runJsCode(field.script, field.value, props.com);
          setMapPoints(setMapPoint_jsonData)
          break
        case 'setMapPointAndClear':
          clearMapPoint();
          const setMapPointAndClear_jsonData = runJsCode(field.script, field.value, props.com);
          setMapPoints(setMapPointAndClear_jsonData)
          break
        case 'setHeatMapAndClear':
          clearHeatMap();
          const setHeatMapAndClear_jsonData = runJsCode(field.script, field.value, props.com);
          setHeatmap(setHeatMapAndClear_jsonData)
          break
        case 'setHeatMap':
          const setHeatMap_jsonData = runJsCode(field.script, field.value, props.com);
          setHeatmap(setHeatMap_jsonData)
          break
        case 'clearHeatMap':
          clearHeatMap();
          break;
        case 'clearGroupPoint':
          groupName = JSON.parse(field.params).name;
          clearGroupPoint(groupName);
          break;
        case 'setCenterAndZoom':
          const setCenterAndZoom_jsonData = runJsCode(field.script, field.value, props.com);
          setMapCenterAndZoom(setCenterAndZoom_jsonData)
          break;
      }
    })


    const runJsCode = (script: string, fieldValue: any, com: DatavComponent): any => {
      try {
        const func = new Function(
          "data,getLocalValue,setLocalValue,com",
          script
        );
        return func(
          fieldValue,
          LocalValueModule.getLocalData,
          LocalValueModule.setLocalData,
          com
        );
      } catch (error) {
        throw new DatavError("脚本执行失败", error.toString(), {
          targetId: com.id,
          origin: error
        });
      }
    }

    const dv_data = computed(() => {
      //dv_data api返回的json
      //?可选链，不为空则计算下一级别，返回不为空的最后一层
      //??或，类似与||
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })


    const url = computed(() => {
      //return dv_data.value.src ?? config.value.url
    })

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    const setMapCenterAndZoom = (setting: mapCenterZoom) => {
      if (setting.lng && setting.lat && setting.zoom) {
        map.setZoomAndCenter(setting.zoom, [setting.lng, setting.lat]);
        return;
      }
      if (setting.lng && setting.lat) {
        map.setCenter([setting.lng, setting.lat]);
      }
      if (setting.zoom) {
        map.setZoom(setting.zoom);
      }
    }


    const clearMapPoint = () => {
      var markers = map.getAllOverlays("marker");
      markers.forEach((marker) => {
        map.remove(marker);
      })

    }

    const clearGroupPoint = (name: string) => {
      var overlayGroups = layerGroups.find(r => r.name == name);
      if (overlayGroups) {
        var idx = layerGroups.findIndex(r => r.name == name);
        map.remove(overlayGroups.points);
        try {
          overlayGroups.points.hide();
        } catch (error) { }
        layerGroups.splice(idx, 1);
      }
    }


    const clearHeatMap = () => {
      heatmap.hide();
    }

    const initMapPoints = () => {
      config.value.pointConfigs.forEach(pc => {
        const mps: mapPointSetting = {
          name: pc.name,
          iconUrl: pc.iconUrl,
          iconWidth: pc.iconWidth,
          iconHeight: pc.iconHeight
        }
        if (pc.apiUrl && pc.apiUrl.length > 0) {
          request.get(pc.apiUrl).then(r => {
            let points = (r.data ?? r) as mapPoint3d[]
            setCityMapPoints(mps, points);
          })
        }
        else {
          try {
            if (pc.dataJson && pc.dataJson.length > 0) {
              let points = JSON.parse(pc.dataJson) as mapPoint3d[]
              setCityMapPoints(mps, points);
            }
          } catch (error) {
            throw new DatavError('初始散点数据转化失败', error.toString(), {
              targetId: props.com.id,
              origin: error,
            })
          }
        }
      })
    }

    const initMapPolylines = () => {
      config.value.polylineConfigs.forEach(pc => {
        const mpls: mapPolylineSetting = {
          name: pc.name,
          isOutline: pc.isOutline,
          outlineColor: pc.outlineColor,
          borderWeight: pc.borderWeight,
          strokeColor: pc.strokeColor,
          strokeOpacity: pc.strokeOpacity,
          strokeWeight: pc.strokeWeight,
          strokeStyle: pc.strokeStyle
        }
        if (pc.apiUrl && pc.apiUrl.length > 0) {
          request.get(pc.apiUrl).then(r => {
            let polylines = (r.data ?? r) as [number, number][]
            setMapPolylines(mpls, polylines);
          })
        }
        else {
          try {
            if (pc.dataJson && pc.dataJson.length > 0) {
              let polylines = JSON.parse(pc.dataJson) as [number, number][]
              setMapPolylines(mpls, polylines);
            }
          } catch (error) {
            throw new DatavError('初始折线覆盖物失败', error.toString(), {
              targetId: props.com.id,
              origin: error,
            })
          }
        }
      })
    }

    const setMapPolylines = (setting: mapPolylineSetting, polylines: [number, number][]) => {

      var polyline = new AmapModel.Polyline({
        path: polylines,
        isOutline: setting.isOutline,
        outlineColor: setting.outlineColor,
        borderWeight: setting.borderWeight,
        strokeColor: setting.strokeColor,
        strokeOpacity: setting.strokeOpacity,
        strokeWeight: setting.strokeWeight,
        strokeStyle: setting.strokeStyle,
        zIndex: 50,
      })
      layerGroups.push({ name: setting.name, points: polyline });
      map.add(polyline);
    }


    const initMapPolygon = () => {
      if (!config.value.polygonSetting) {
        config.value.polygonSetting = {
          fillColor: "#ccebc5",
          strokeOpacity: 1,
          fillOpacity: 0.5,
          strokeColor: "#2b8cbe",
          strokeWeight: 1,
          strokeStyle: "solid"
        }
      }
      var polygon = new AmapModel.Polygon({
        path: [
          [121.546543, 31.324446],
          [121.555577, 31.325151],
          [121.556065, 31.318837],
          [121.559047, 31.318901],
          [121.558924, 31.316151],
          [121.557846, 31.315968],
          [121.557835, 31.315835],
          [121.55794, 31.313724],
          [121.557554, 31.313633],
          [121.557661, 31.312743],
          [121.556792, 31.312707],
          [121.556567, 31.312945],
          [121.554582, 31.313119],
          [121.552115, 31.313614],
          [121.551932, 31.315227],
          [121.548746, 31.314705],
          [121.548746, 31.314155],
          [121.546224, 31.314182],
          [121.545259, 31.31839],
          [121.545634, 31.32119]
        ],
        fillColor: config.value.polygonSetting.fillColor,
        strokeOpacity: config.value.polygonSetting.strokeOpacity,
        fillOpacity: config.value.polygonSetting.fillOpacity,
        strokeColor: config.value.polygonSetting.strokeColor,
        strokeWeight: config.value.polygonSetting.strokeWeight,
        strokeStyle: 'solid',
      })
      layerGroups.push({ name: '共青森林公园', points: polygon });
      map.add(polygon);
    }

    const initMapTexts = () => {
      config.value.textConfigs.forEach(tc => {
        if (tc.text && tc.text.length > 0) {
          // 创建纯文本标记
          var text = new AmapModel.Text({
            text: tc.text,
            anchor: 'center', // 设置文本标记锚点
            draggable: false,
            cursor: tc.cursor,
            angle: tc.angle,
            style: {
              'width': tc.textStyle.width,
              'border': 'none',
              'text-align': 'center',
              'font-size': tc.textStyle.fontSize,
              'font-weight': tc.textStyle.fontWeight,
              'color': tc.textStyle.color,
              'background-color': ' rgba(255, 255, 255, 0)'
            },
            position: [tc.position.lng, tc.position.lat]
          });
          text.setMap(map);
        }
      })
    }

    const setHeatmap = (setting: mapHeatSetting) => {
      if (setting.apiUrl != null) {
        request.get(setting.apiUrl).then(r => {
          let points = r.data as mapHeat2d[]
          setCityHeatMap(setting, points);
        })
      }
      else {
        try {
          if (setting.dataJson != null) {
            let points = setting.dataJson as mapHeat2d[]
            setCityHeatMap(setting, points);
          }
        } catch (error) {
          throw new DatavError('热力图数据转化失败', error.toString(), {
            targetId: props.com.id,
            origin: error,
          })
        }

      }
    }

    const setCityHeatMap = (setting: mapHeatSetting, data: mapHeat2d[]) => {
      //设置数据集：该数据为北京部分“公园”数据
      heatmap.setDataSet({
        data: data,
        max: setting.maxPixelIntensity ?? 100
      });
      heatmap.show();
    }

    return {
      url,
      comid,
      wrapperStyle
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.amap-logo) {
  display: none !important;
}

:deep(.amap-copyright) {
  display: none !important;
}
</style>
