<template>
  <div :id="'div_'" :style="wrapperStyle">
    <!-- <div :id="com.id + 'container'"></div> -->
    <baidu-map
      ref="mapContainer"
      class="map"
      :ak="config.ak"
      v="1.0"
      type="WebGL"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      :map-style="mapStyle"
      @ready="onMapReady"
    >
      <!-- <bml-heatmap
        :data="heatmapPointList"
        :max="100"
        :radius="20"
      /> -->
      <bm-marker
        v-for="(e,i) in mapPointList"
        :key="i"
        :position="{lng: e.x, lat: e.y}"
        :dragging="false"
        :icon="{url: e.iconUrl, size: {width: e.iconWidth, height: e.iconHeight}}"
        @click="showDialog(e,i)"
      />
      <bm-boundary
        v-if="config.boundary.enable"
        :name="config.boundary.name"
        :stroke-weight="config.boundary.strokeWeight"
        :stroke-color="config.boundary.strokeColor"
        :stroke-opacity="config.boundary.strokeOpacity"
        :fill-color="config.boundary.fillColor"
        :fill-opacity="config.boundary.fillOpacity"
        :stroke-style="config.boundary.strokeStyle"
      />
    </baidu-map>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef,ref, onMounted, onBeforeMount, watch, getCurrentInstance } from 'vue'
//import type { CSSProperties } from 'vue'
import { BaiduwebglMap } from './baiduwebgl-map'
import { useDataCenter } from '@/mixins/data-center'
import { HandleItemField } from '@/components/data-handle'
//import { ref } from 'vue'
import { useEventCenter } from '@/mixins/event-center'
//import { HandleItemField } from '@/components/data-handle'
import { BaiduMap,BmMarker,BmBoundary } from 'vue-baidu-map-3x'
//import { BmMarker,BmlHeatmap } from 'vue-baidu-map-3x'

import dcRequest from '@/utils/dc-request'
import { mapPoint } from '../../mapPoint'


interface mapPointSetting {
  name: string
  type: string
  apiUrl: string
  iconUrl: string
  dialogComponent: string
  params?: any
  iconWidth: number
  iconHeight: number
}

export default defineComponent({
  name: 'VBaiduwebglMap',
  components: {
    BaiduMap,
    BmMarker,
    BmBoundary,
  },
  props: {
    com: {
      type: Object as PropType<BaiduwebglMap>,
      required: true,
    },
  },

  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)
    //heatmap.init()
    const attr = toRef(props.com, 'attr')
    const config = toRef(props.com, 'config')

    // 拿到mitter
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter
    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case 'setMapPoint':
          const pointSource = JSON.parse(field.params) as mapPointSetting[]
          setMapPoint(pointSource)
          break
        case 'clearMapPoint':
          clearMapPoint()
          break
      }
    })

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    // const traffic = computed(() => {
    //   return config.value.traffic
    // })

    var mapContainer = ref(null)

    var hasMask = ref(false)
    var maskInside = ref(null)
    var maskOutside = ref(null)
    var maskBorder = ref(null)

    onMounted(()=>{
      console.log('This is baidu webgl Map',mapContainer)
    })

    onMounted(()=>{
      //var map = new BMapGL.Map(`${props.com.id}container`)
    })

    watch(() => config.value.traffic, ()=>{
      if(config.value.traffic){
        mapContainer.value.map.setTrafficOn()
      }
      else{
        mapContainer.value.map.setTrafficOff()
      }
      //console.log('watch traffic',mapContainer,config.value.traffic)
    })


    const center = computed(() =>{
      return { lng: config.value.x, lat: config.value.y }
    })

    const zoom = computed(() =>{
      return config.value.zoom
    })

    let hasInit = false

    setTimeout(()=>{
      if(!hasInit) {
        onMapReady()
      }
    },6000)


    const onMapReady = () => {
      //console.log(BMap, map){ BMap, map }
      // center.value.lng = 121.531921
      // center.value.lat = 31.265522
      // zoom.value = 14

      if(hasInit){
        return
      }

      hasInit = true

      const BMap = mapContainer.value.BMap
      const map = mapContainer.value.map

      map.setCenter({ lng:config.value.x,lat:config.value.y })
      if(config.value.traffic){
        map.setTrafficOn()
      }
      else{
        map.setTrafficOff()
      }

      getMapPointList()

      // let mapBoundary = new BMap.Boundary()
      // mapBoundary.get('上海市杨浦区',rs => {

      //   const strRs = rs.boundaries as String[]
      //   let path = []

      //   strRs[0].split(';').forEach(item => {
      //     let arr = item.split(',')
      //     path.push(new BMap.Point(arr[0],arr[1]))
      //   })

      //   var border = new BMap.Polyline(path, {
      //     strokeColor: '#000',
      //     strokeWeight: 3,
      //     strokeOpacity: 1,
      //   })
      //   map.addOverlay(border)

      //   let mapMask = new BMap.MapMask(path, {
      //     showRegion: 'inside', // 显示区域范围以内部分
      //     isBuildingMask: true, // 楼块是否参与掩膜
      //     isPoiMask: true, // poi标注是否参与掩膜
      //     isMapMask: false, // 底图是否参与掩膜
      //   })
      //   map.addOverlay(mapMask)

      //   var maskPoints = path
      //   var EN_JW = new BMap.Point(170.672126, 81.291804) // 东北角
      //   var NW_JW = new BMap.Point(-169.604276, 81.291804) // 西北角
      //   var WS_JW = new BMap.Point(-169.604276, -68.045308) // 西南角
      //   var SE_JW = new BMap.Point(170.672126, -68.045308) // 东南角
      //   // 添加环形遮罩层
      //   if (path.length > 0) {
      //     maskPoints.push(maskPoints[0])
      //   }
      //   maskPoints.push(EN_JW)
      //   maskPoints.push(SE_JW)
      //   maskPoints.push(WS_JW)
      //   maskPoints.push(NW_JW)
      //   maskPoints.push(EN_JW)
      //   var mask = new BMap.Polygon(maskPoints, { strokeWeight:0,strokeColor: 'none', fillColor: '#0d131e', strokeOpacity: 1, fillOpacity: 0.85 })
      //   mask.disableMassClear()
      //   map.addOverlay(mask)
      // })

      if(config.value.mask.enable){
        initMask()
      }
    }

    const initMask = () => {
      const BMap = mapContainer.value.BMap
      const map = mapContainer.value.map
      if(hasMask.value)
      {
        map.removeOverlay(maskInside.value)
        map.removeOverlay(maskOutside.value)
        map.removeOverlay(maskBorder.value)
      }

      let mapBoundary = new BMap.Boundary()
      mapBoundary.get('上海市杨浦区',rs => {

        const strRs = rs.boundaries as String[]
        let path = []

        strRs[0].split(';').forEach(item => {
          let arr = item.split(',')
          path.push(new BMap.Point(arr[0],arr[1]))
        })

        maskBorder.value = new BMap.Polyline(path, {
          strokeColor: config.value.mask.strokeColor,
          strokeWeight: config.value.mask.strokeWeight,
          strokeOpacity: config.value.mask.strokeOpacity,
          strokeStyle: config.value.mask.strokeStyle,
        })
        map.addOverlay(maskBorder.value)

        maskInside.value = new BMap.MapMask(path, {
          showRegion: 'inside', // 显示区域范围以内部分
          isBuildingMask: true, // 楼块是否参与掩膜
          isPoiMask: true, // poi标注是否参与掩膜
          isMapMask: false, // 底图是否参与掩膜
        })
        map.addOverlay(maskInside.value)

        var maskPoints = path
        var EN_JW = new BMap.Point(170.672126, 81.291804) // 东北角
        var NW_JW = new BMap.Point(-169.604276, 81.291804) // 西北角
        var WS_JW = new BMap.Point(-169.604276, -68.045308) // 西南角
        var SE_JW = new BMap.Point(170.672126, -68.045308) // 东南角
        // 添加环形遮罩层
        if (path.length > 0) {
          maskPoints.push(maskPoints[0])
        }
        maskPoints.push(EN_JW)
        maskPoints.push(SE_JW)
        maskPoints.push(WS_JW)
        maskPoints.push(NW_JW)
        maskPoints.push(EN_JW)
        maskOutside.value = new BMap.Polygon(maskPoints, { strokeWeight:0,strokeColor: 'none', fillColor: config.value.mask.fillColor, strokeOpacity: 1, fillOpacity: config.value.mask.fillOpacity })
        maskOutside.value.disableMassClear()
        map.addOverlay(maskOutside.value)
        hasMask.value = true
      })
    }

    const clearMask = () => {
      const map = mapContainer.value.map
      map.removeOverlay(maskBorder.value)
      map.removeOverlay(maskInside.value)
      map.removeOverlay(maskOutside.value)
      hasMask.value = false
    }

    watch(()=>config.value.mask,()=>{
      if(config.value.mask.enable){
        initMask()
      }
      else{
        clearMask()
      }
    },{ deep:true })

    const mapStyle = computed(() =>
    {
      return { styleJson: config.value.mapStyleJson }
    })

    const _mapPointList = ref<mapPoint[]>([])

    const mapPointList = computed(() => {
      return _mapPointList.value
    })


    const getMapPointList = () =>{
      _mapPointList.value = []
      config.value.pointConfigs.forEach(pc=>{
        if(pc.apiUrl) {
          dcRequest.post(pc.apiUrl,{ days: 7 }).then(r=>{
            let result= r.data as mapPoint[]
            if(result && result.length>0){
              result.forEach(r=>{
                r.iconUrl=pc.iconUrl
                r.iconWidth=pc.iconWidth
                r.iconHeight=pc.iconHeight
                //r.dialogComponent=pc.dialogComponent
              })
              _mapPointList.value.push(...result)
            }
          })
        }
      })
      console.log('mapPointList',_mapPointList)
    }


    const clearMapPoint = () => {
      _mapPointList.value = []
    }

    const setMapPoint = (settings:mapPointSetting[]) =>{
      settings.forEach(setting => {

        dcRequest.post(setting.apiUrl, setting.params? setting.params : {} ).then(r => {
          let result = r.data as mapPoint[]

          for(let i = _mapPointList.value.length - 1 ;i >=0 ; i--)
          {
            if(_mapPointList.value[i].type == setting.type){
              _mapPointList.value.splice(i, 1)
            }
          }

          if(result && result.length > 0) {
            result.forEach(r => {
              r.iconUrl = setting.iconUrl
              r.dialogComponent = setting.dialogComponent
              r.params = setting.params
              r.iconWidth = setting.iconWidth
              r.iconHeight = setting.iconHeight
            })
            _mapPointList.value.push(...result)
          }
        })

      })
    }

    const showDialog=(e:mapPoint,idx:number)=>{
      if(props.com.handles
        && props.com.handles.clickPoint
        && props.com.handles.clickPoint.fields
        && props.com.handles.clickPoint.fields.length > 0)
      {
        comEvent(props.com.handles.clickPoint.fields,e)
      }
    }

    const comEvent = (fields: HandleItemField[],e:mapPoint) => {
      //fileds.forEach(r=>r.value=inputValue.value)
      fields.forEach(field => {
        field.value=e
        field.params=JSON.stringify(e)
        // emit自定义事件
        mitter.emit(field.targetComId, field)
      })
    }



    return {
      center,
      zoom,
      onMapReady,
      config,
      wrapperStyle,
      mapStyle,
      mapContainer,
      clearMapPoint,
      setMapPoint,
      mapPointList,
      showDialog,
    }
  },
})
</script>

<style>
.map {
  width: 100%;
  height: 100%;
}

.anchorBL
{
  opacity: 0;
}

</style>
