<template>
  <div :id="'div_' + comid" :style="wrapperStyle">
    <iframe :id="comid" :name="'City3dMap_' + comid" scrolling="“no”" :src="url" style="width:100%;height:100%"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef, watch, getCurrentInstance, onMounted } from 'vue'
import type { CSSProperties } from 'vue'
import { City3dMap } from './city-3d-map'
import { useDataCenter } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { ref } from 'vue'
import { useEventCenter } from '@/mixins/event-center'
import { HandleItemField } from '@/components/data-handle'
import request from '@/utils/request'
import { DatavError } from '@/domains/error'
import { LocalValueModule } from "@/store/modules/localvalue";
import dcRequest from '@/utils/dc-request'

interface mapPointSetting {
  name: string
  type: string
  apiUrl?: string
  dataJson?: any
  iconUrl: string
  params?: any
  iconWidth: number
  iconHeight: number
  lineColor?: any
  lineSize?: any
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
  featureName?: string
  lng?: number //经度
  lat?: number //维度
  params?: any
  //iconUrl: string
  tooltip?: string
  //iconWidth: number
  //iconHeight: number
}

interface mapHeat2d {
  lng?: number //经度
  lat?: number //维度
  num?: number
}

interface layModel {
  ExChangeRoot: ExChangeRoot
}

interface ExChangeRoot {
  Features: Features[]
}

interface Features {
  type: string
  featureName: string
  Feature: Feature[]
}

interface Feature {
  Geometry: Geometry
  ShowInfo?: string
  Attribute?: Attribute
  ToolTip?: string
  Color?: any
  Size?: string
  Style?: string
  ImgUrl?: string
  ImgWidth?: string
  ImgHeight?: string
}

interface Attribute {
  ID: string
  DeviceName?: string
  AbsTime?: string
}

interface Geometry {
  Points?: Point[]
  Paths?: Path[]
}

interface Point {
  Point: string
}

interface Path {
  Path: string
}


export default defineComponent({
  name: 'VCity3dMap',
  props: {
    com: {
      type: Object as PropType<City3dMap>,
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

    onMounted(() => {
      //事件监听
      window.addEventListener('message', (e: MessageEvent) => {
        var data = e.data;
        console.log(data);
        switch (data.method) {
          case "mapOnclickCallback": {
            if (data.data && data.data.length > 1 && data.data[1].length > 0 && data.data[0].length > 1 && data.data[0][1].layerId) {
              mapOnclickCallback(data);
            }
          }
          case "maploadCallback": {
            maploadCallback();
            break;
          }
          case "measureLengthCallback": {
            //measureLengthCallback(data.data[0]);
            break;
          }
          case "identifyTaskcallbackfun": {
            //identifyTaskcallbackfun(data.data[0]);
            break;
          }
          case "addressdataCallback": {
            //addressdataCallback(data.data[0]);
            break;
          }
          case "dragendCallback": {
            //dragendCallback();
            break;
          }
          case "queryByGeometryAndLayer": {
            //queryByGeometryAndLayer(data.data[0]);
            break;
          }
          case "mapCenterCallback": {
            //mapCenterCallback(data.data[0]);
            break;
          }
          case "mapLevelCallback": {
            //mapLevelCallback(data.data[0]);
            break;
          }
          case "resizeCallback": {
            //resizeCallback();
            break;
          }
          case "XYbyAddressCallback": {
            //XYbyAddressCallback(data.data[0]);
            break;
          }
          case "mapAnimationInProgressCallback": {
            //mapAnimationInProgressCallback();
            break;
          }
          case "mapDragingCallback": {
            //mapDragingCallback();
            break;
          }
        }
      }, false);
    })

    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      let pointSource: mapPointSetting[] = [];
      let heatSource: mapHeatSetting = {};
      switch (field.targetMethodName) {
        case 'clearMapPoint':
          clearMapPoint();
          break
        case 'setMapPoint':
          try {
            const func = new Function(
              "data,getLocalValue,setLocalValue,com",
              field.script
            );
            const jsonData = func(
              field.value,
              LocalValueModule.getLocalData,
              LocalValueModule.setLocalData,
              props.com
            );
            setMapPoints(jsonData)
          } catch (error) {
            throw new DatavError("脚本执行失败", error.toString(), {
              targetId: props.com.id,
              origin: error
            });
          }
          break;
        case 'setMapPointAndClear':
          clearMapPoint();
          try {
            const func = new Function(
              "data,getLocalValue,setLocalValue,com",
              field.script
            );
            const jsonData = func(
              field.value,
              LocalValueModule.getLocalData,
              LocalValueModule.setLocalData,
              props.com
            );
            setMapPoints(jsonData)
          } catch (error) {
            throw new DatavError("脚本执行失败", error.toString(), {
              targetId: props.com.id,
              origin: error
            });
          }
        case 'setLine':
          clearMapPoint();
          pointSource = JSON.parse(field.params) as mapPointSetting[];
          setMapLines(pointSource);
          break;

        case 'setLineAndClear':
          clearMapPoint();
          pointSource = JSON.parse(field.params) as mapPointSetting[];
          setMapLines(pointSource);
          break;

        case 'setHeatMapAndClear':
          clearHeatMap();

          try {
            const func = new Function(
              "data,getLocalValue,setLocalValue,com",
              field.script
            );
            const jsonData = func(
              field.value,
              LocalValueModule.getLocalData,
              LocalValueModule.setLocalData,
              props.com
            );
            setHeatmap(jsonData)
          } catch (error) {
            throw new DatavError("脚本执行失败", error.toString(), {
              targetId: props.com.id,
              origin: error
            });
          }
          break;
        case 'setHeatMap':
          try {
            const func = new Function(
              "data,getLocalValue,setLocalValue,com",
              field.script
            );
            const jsonData = func(
              field.value,
              LocalValueModule.getLocalData,
              LocalValueModule.setLocalData,
              props.com
            );
            setHeatmap(jsonData)
          } catch (error) {
            throw new DatavError("脚本执行失败", error.toString(), {
              targetId: props.com.id,
              origin: error
            });
          }
          break;
        case 'clearHeatMap':
          clearHeatMap();
          break;
      }
    })

    const dv_data = computed(() => {
      //dv_data api返回的json
      //?可选链，不为空则计算下一级别，返回不为空的最后一层
      //??或，类似与||
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })


    const url = computed(() => {
      return dv_data.value.src ?? config.value.url
    })

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })


    // watch((config) => {

    // })


    const postToIframeMethed = (methedName: string, data?: any, backFun?: any) => {
      var win = (document.getElementById(comid) as HTMLIFrameElement).contentWindow;
      //console.log(win);
      win.postMessage(JSON.stringify({ method: methedName, data: data, backfun: backFun }), '*');
      window.onmessage = function (e) {
        if (e.origin != 'http://localhost') return;
        console.log(JSON.parse(e.data).name);
      };
    }

    const clearMapPoint = () => {
      postToIframeMethed("Clear", "drawLayer");
    }

    const doGetGraphicByJson = (jsonStr: string, isGoTo: boolean, isPopup: boolean) => {
      postToIframeMethed("doGetGraphicByJson", [jsonStr, isGoTo, isPopup]);
    }

    const doMakeHeatmap = (data: any, colorStops: any, blurRadius: any, maxPixelIntensity: any, minPixelIntensity: any, field: any) => {
      postToIframeMethed("makeHeatmap", [data, colorStops, blurRadius, maxPixelIntensity, minPixelIntensity, field]);
    }
    const clearHeatMap = () => {
      postToIframeMethed("removeHeatmap");
    }


    const mapOnclickCallback = (data) => {
      if (props.com.handles
        && props.com.handles.clickPoint
        && props.com.handles.clickPoint.fields
        && props.com.handles.clickPoint.fields.length > 0) {

        //data.data [2][0]
        props.com.handles.clickPoint.fields.forEach(field => {
          field.value = data.data
          //field.params = JSON.stringify(data.data)
          // emit自定义事件
          mitter.emit(field.targetComId, field)
        })
      }
    }
    //地图加载完成回调
    const maploadCallback = () => {
      if (isInit.value == true) {
        isInit.value = false;

        let timeoutVal = 6000;
        if (props.com.config.timeoutVal) {
          timeoutVal = props.com.config.timeoutVal;
        }

        if (props.com.config) {
          setZoomIn(props.com.config);
        }
        setTimeout(() => {
          if (props.com.config.camera.is3D) {
            //初始化视角
            setCamera(props.com.config.camera);
          }
          else {
            setCenter(props.com.config.camera);
          }
          //初始化撒点图层
          initMapPoints();

        }, timeoutVal)
      }
      else {

      }
    }

    //设置视角
    const setCamera = (camera: any) => {
      postToIframeMethed("setCamera", [camera.isAnimation, camera.pointX, camera.pointY, camera.pointZ, camera.headingValue, camera.tiltValue, camera.scaleValue]);
    }

    //设置2D中心点
    const setCenter = (camera: any) => {
      postToIframeMethed("GotoPositionByPoint", [camera.pointX, camera.pointY]);

    }

    //设置2D中心点
    const setZoomIn = (config: any) => {
      postToIframeMethed("ZoomIn", [config.zoomIn]);
    }
    const initMapPoints = () => {
      config.value.pointConfigs.forEach(pc => {
        const mps: mapPointSetting = {
          name: pc.name,
          type: pc.type,
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
      let layModel: layModel = {
        ExChangeRoot: {
          Features: []
        }
      };
      points.forEach((point, index) => {
        if (point.lng && point.lat) {
          let feature = {
            type: "point",
            featureName: setting.type,
            Feature: [{
              Geometry: {
                Points: [{
                  Point: point.lng + "," + point.lat
                }]
              },
              Attribute: point.params, //自定义参数
              ToolTip: point.tooltip,
              ImgUrl: setting.iconUrl,
              ImgWidth: setting.iconWidth + 'px',
              ImgHeight: setting.iconHeight + "px"
            }]
          }
          layModel.ExChangeRoot.Features.push(feature);
        }
      })

      doGetGraphicByJson(JSON.stringify(layModel), false, false);
    }

    const setMapLines = (settings: mapPointSetting[]) => {
      settings.forEach(setting => {

        if (setting.apiUrl != null) {
          request.get(setting.apiUrl).then(r => {
            let points = r.data as mapPoint3d[]
            setCityMapPoints(setting, points)
            setCityMapLines(setting, points);
          })
        }
        else {
          try {
            if (setting.dataJson != null) {
              let points = setting.dataJson as mapPoint3d[]
              setCityMapPoints(setting, points)
              setCityMapLines(setting, points);
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

    const setCityMapLines = async (setting: mapPointSetting, points: mapPoint3d[]) => {
      for (let i = 0; i < points.length - 1; i++) {
        var res = await getPaths(points[i], points[i + 1])
        let paths: [] = res.routes.features[0].geometry.paths[0];
        createLine(paths, setting);
      }
    }

    const createLine = (paths: any[], setting: mapPointSetting) => {
      let pathStr = "";
      paths.forEach((item, index) => {
        pathStr += item[0] + ',' + item[1] + '|'
      });

      if (pathStr.length > 0) {
        pathStr = pathStr.substring(0, pathStr.length - 1);
      }

      let layModel: layModel = {
        ExChangeRoot: {
          Features: [{
            type: "polyline",
            featureName: setting.type ?? "line",
            Feature: [{
              Geometry: {
                Paths: [{
                  Path: pathStr
                }]
              },
              ToolTip: setting.name ?? 'line',
              Color: setting.lineColor ?? [155, 245, 102, 1],
              Size: setting.lineSize ?? "2"
            }]
          }]
        }
      };
      doGetGraphicByJson(JSON.stringify(layModel), false, false);
    }

    const getPaths = async (point1: mapPoint3d, point2: mapPoint3d): Promise<any> => {
      var stops = "stops%3D" + point1.lng + "%2C+" + point1.lat + "%3B+" + point2.lng + "%2C+" + point2.lat;
      return await dcRequest.get(`http://10.89.7.234:6080/arcgis/rest/services/ypdl_route103/NAServer/Route/solve?stops=${stops}&barriers=&polylineBarriers=&polygonBarriers=&outSR=&ignoreInvalidLocations=true&accumulateAttributeNames=&impedanceAttributeName=Length&restrictionAttributeNames=&attributeParameterValues=&restrictUTurns=esriNFSBAllowBacktrack&useHierarchy=false&returnDirections=false&returnRoutes=true&returnStops=false&returnBarriers=false&returnPolylineBarriers=false&returnPolygonBarriers=false&directionsLanguage=en&directionsStyleName=&outputLines=esriNAOutputLineTrueShapeWithMeasure&findBestSequence=false&preserveFirstStop=true&preserveLastStop=true&useTimeWindows=false&startTime=0&startTimeIsUTC=false&outputGeometryPrecision=&outputGeometryPrecisionUnits=esriMeters&directionsOutputType=esriDOTComplete&directionsTimeAttributeName=&directionsLengthUnits=esriNAUMeters&returnZ=false&travelMode=&f=json`);
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
      let hData = { heatData: data };
      let colorStops = setting.colorStops ?? [
        { ratio: 0, color: "rgba(255, 255, 255, 0)" },
        { ratio: 0.45, color: "rgba(0, 0, 255, 1)" },
        { ratio: 0.55, color: "rgba(0, 255, 255, 1)" },
        { ratio: 0.65, color: "rgba(0, 255, 0, 1)" },
        { ratio: 0.8, color: "rgba(255, 255, 0, 1)" },
        { ratio: 1, color: "rgba(255, 0, 0, 1)" }];
      let blurRadius = setting.blurRadius ?? 20;
      let maxPixelIntensity = setting.maxPixelIntensity ?? 180;
      let minPixelIntensity = setting.minPixelIntensity ?? 10;
      let field = setting.field ?? "num";

      doMakeHeatmap(hData, colorStops, blurRadius, maxPixelIntensity, minPixelIntensity, field);
    }


    return {
      url,
      comid,
      wrapperStyle
    }
  },
})
</script>

