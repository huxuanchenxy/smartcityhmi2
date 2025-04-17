<template>
  <div :id="'div_'" :style="wrapperStyle">
    <!-- <div :id="com.id + 'container'"></div> -->
    <baidu-map
      ref="mapContainer"
      class="map"
      :ak="config.ak"
      v="2.0"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      :map-style="mapStyle"
      @ready="handler"
    >
      <bml-heatmap
        v-for="(e,i) in heatmapPointList"
        :key="i"
        :data="e.data"
        :max="e.max"
        :radius="e.radius"
      />
      <!-- <bml-heatmap
        v-if="heatmapPointList.length > 0"
        :data="heatmapPointList"
        :max="config.heatmap.max"
        :radius="config.heatmap.radius"
      /> -->
      <!-- <bm-marker
        v-for="(e,i) in mapPointList"
        :key="i"
        :position="{lng: e.x, lat: e.y}"
        :dragging="false"
        :icon="{url: e.iconUrl, size: {width: e.iconWidth, height: e.iconHeight}}"
        @click="showDialog(e,i)"
      /> -->
    </baidu-map>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef,ref, onMounted, onBeforeMount, watch, getCurrentInstance } from 'vue'
//import type { CSSProperties } from 'vue'
import { BaiduapiMap } from './baiduapi-map'
import { useDataCenter } from '@/mixins/data-center'
import { HandleItemField } from '@/components/data-handle'
//import { ref } from 'vue'
import { useEventCenter } from '@/mixins/event-center'
//import { HandleItemField } from '@/components/data-handle'
import { BaiduMap,BmMarker,BmlHeatmap } from 'vue-baidu-map-3x'
//import { BmMarker,BmlHeatmap } from 'vue-baidu-map-3x'

import dcRequest from '@/utils/dc-request'
//import { mapPoint } from '../../mapPoint'


// interface mapPointSetting {
//   name: string
//   type: string
//   apiUrl: string
//   iconUrl: string
//   dialogComponent: string
//   params?: any
//   iconWidth: number
//   iconHeight: number
// }

interface mapHeatmapApi {
  url:string
  data:Array<any>
  max:number
  radius:number
}



export default defineComponent({
  name: 'VBaiduapiMap',
  components: {
    BaiduMap,
    //BmMarker,
    BmlHeatmap,
    // BmTraffic,
  },
  props: {
    com: {
      type: Object as PropType<BaiduapiMap>,
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
        case 'setHeatMap':
          const source = JSON.parse(field.params) as mapHeatmapApi
          setHeatMap(source)
          break
        case 'clearHeatMap':
          clearHeatMap()
          break
      }

      // switch (field.targetMethodName) {
      //   case 'setMapPoint':
      //     const pointSource = JSON.parse(field.params) as mapPointSetting[]
      //     setMapPoint(pointSource)
      //     break
      //   case 'clearMapPoint':
      //     clearMapPoint()
      //     break
      // }
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

    onMounted(()=>{

      console.log('This is baidu api Map')
      // let scriptDom= window.document.getElementById('baiduApiScript')
      // if(!scriptDom)
      // {
      //   //window.BMap = {}

      //   window._initBaiduMap = function () {
      //     console.log('call _initBaiduMap',window.BMapGL,`${props.com.id}container`)
      //     // resolve(window.BMap)
      //     // window.document.body.removeChild($script)
      //     // window.BMap._preloader = null
      //     // window._initBaiduMap = null
      //     mapContainer = new window.BMapGL.Map(`${props.com.id}container`)
      //     mapContainer.reset();
      //     var centerPoint = new window.BMapGL.Point(116.414, 39.915)
      //     console.log('centerPoint',centerPoint)
      //     mapContainer.centerAndZoom(centerPoint, 13)
      //     mapContainer.enableScrollWheelZoom(true)
      //     console.log('mapContainer',mapContainer)
      //   }


      //   const $script = document.createElement('script')
      //   $script.id = 'baiduApiScript'
      //   $script.src =`https://api.map.baidu.com/api?type=webgl&v=1.0&ak=${config.value.ak}&callback=_initBaiduMap`
      //   window.document.body.appendChild($script)
      // }
    })

    onMounted(()=>{
      //var map = new BMapGL.Map(`${props.com.id}container`)
    })


    const center = computed(() =>{
      return { lng: config.value.x, lat: config.value.y }
    })

    const zoom = computed(() =>{
      return config.value.zoom
    })

    const handler = ({ BMap, map }) => {
      //console.log(BMap, map)
      // center.value.lng = 121.531921
      // center.value.lat = 31.265522
      // zoom.value = 14
      map.setCenter({ lng:config.value.x,lat:config.value.y })
      map.setZoom(config.value.zoom)
      // if(config.value.traffic){
      //   map.setTrafficOn()
      // }
      // else{
      //   map.setTrafficOff()
      // }
      // let scriptDom= window.document.getElementById('baiduHeatmapScript')
      // if(!scriptDom)
      // {
      //   const $script = document.createElement('script')
      //   $script.id = 'baiduHeatmapScript'
      //   $script.src = 'https://api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js'
      //   window.document.body.appendChild($script)
      // }

      //getMapPointList()
      getHeatmapPointList()
    }

    const mapStyle = computed(() =>
    {
      return { styleJson: config.value.mapStyleJson }
    })

    // const _mapPointList = ref<mapPoint[]>([])

    // const mapPointList = computed(() => {
    //   return _mapPointList.value
    // })


    // const getMapPointList = () =>{
    //   _mapPointList.value = []
    //   config.value.pointConfigs.forEach(pc=>{
    //     if(pc.apiUrl) {
    //       dcRequest.post(pc.apiUrl,{ days: 7 }).then(r=>{
    //         let result= r.data as mapPoint[]
    //         if(result && result.length>0){
    //           result.forEach(r=>{
    //             r.iconUrl=pc.iconUrl
    //             r.iconWidth=pc.iconWidth
    //             r.iconHeight=pc.iconHeight
    //             //r.dialogComponent=pc.dialogComponent
    //           })
    //           _mapPointList.value.push(...result)
    //         }
    //       })
    //     }
    //   })
    //   console.log('mapPointList',_mapPointList)
    // }


    // const clearMapPoint = () => {
    //   _mapPointList.value = []
    // }

    // const setMapPoint = (settings:mapPointSetting[]) =>{
    //   settings.forEach(setting => {

    //     dcRequest.post(setting.apiUrl, setting.params? setting.params : {} ).then(r => {
    //       let result = r.data as mapPoint[]

    //       for(let i = _mapPointList.value.length - 1 ;i >=0 ; i--)
    //       {
    //         if(_mapPointList.value[i].type == setting.type){
    //           _mapPointList.value.splice(i, 1)
    //         }
    //       }

    //       if(result && result.length > 0) {
    //         result.forEach(r => {
    //           r.iconUrl = setting.iconUrl
    //           r.dialogComponent = setting.dialogComponent
    //           r.params = setting.params
    //           r.iconWidth = setting.iconWidth
    //           r.iconHeight = setting.iconHeight
    //         })
    //         _mapPointList.value.push(...result)
    //       }
    //     })

    //   })
    // }

    // const showDialog=(e:mapPoint,idx:number)=>{
    //   if(props.com.handles
    //     && props.com.handles.clickPoint
    //     && props.com.handles.clickPoint.fields
    //     && props.com.handles.clickPoint.fields.length > 0)
    //   {
    //     comEvent(props.com.handles.clickPoint.fields,e)
    //   }
    // }

    // const comEvent = (fields: HandleItemField[],e:mapPoint) => {
    //   //fileds.forEach(r=>r.value=inputValue.value)
    //   fields.forEach(field => {
    //     field.value=e
    //     field.params=JSON.stringify(e)
    //     // emit自定义事件
    //     mitter.emit(field.targetComId, field)
    //   })
    // }


    const _heatmapPointList = ref([])

    const heatmapPointList = computed(()=>_heatmapPointList.value)

    const getHeatmapPointList = () => {
      if(config.value.heatmap.ApiUrl){
        dcRequest.get(config.value.heatmap.ApiUrl).then(res=>{

          let item :mapHeatmapApi = {
            url:config.value.heatmap.ApiUrl,
            data:res as unknown as [],
            max: config.value.heatmap.max,
            radius: config.value.heatmap.radius,
          }

          _heatmapPointList.value.push(item)

          // let heatmapOverlay = new BMapLib.HeatmapOverlay({ radius:20 })

          // console.log('heatmapPointList',_heatmapPointList.value,heatmapOverlay,mapContainer.value)

          // mapContainer.value.map.addOverlay(heatmapOverlay)
	        // heatmapOverlay.setDataSet({ data:_heatmapPointList.value, max:100 })
          // heatmapOverlay.show()
        })
      }
    }

    const setHeatMap = (data:mapHeatmapApi) =>{
      if(data.url)
      {
        //config.value.heatmap.max = data.max
        //config.value.heatmap.radius = data.radius

        dcRequest.get(data.url).then(res=>{

          let item :mapHeatmapApi = {
            url:config.value.heatmap.ApiUrl,
            data:res as unknown as [],
            max: data.max,
            radius: data.radius,
          }

          _heatmapPointList.value.push(item)
        })
      }
    }

    const clearHeatMap = () =>{
      console.log('clearHeatMap')
      _heatmapPointList.value = []
    }


    watch(()=>config.value.heatmap.ApiUrl,()=>{
      getHeatmapPointList()
    })

    return {
      center,
      zoom,
      handler,
      config,
      wrapperStyle,
      mapStyle,
      mapContainer,
      // clearMapPoint,
      // setMapPoint,
      // mapPointList,
      //showDialog,
      heatmapPointList,
      setHeatMap,
      clearHeatMap,
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
