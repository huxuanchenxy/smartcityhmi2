<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <ol-map
      ref="map"
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      style="height:100%"
    >
      <ol-zoom-control />
      <ol-tile-layer ref="mapSourceLayer" :z-index="1000">
        <slot></slot>
      </ol-tile-layer>

      <ol-vector-layer
        v-for="(e,i) in circlePointList"
        :key="i"
        :position="[e.x,e.y]"
        :z-index="1001"
      >
        <ol-source-vector>
          <ol-feature>
            <ol-geom-point :coordinates="[e.x,e.y]" />
            <ol-style>
              <ol-style-circle :radius="e.radius">
                <ol-style-fill :color="e.fillColor" />
                <ol-style-stroke :color="e.lineColor" :width="e.lineWidth" />
              </ol-style-circle>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>

      <ol-tile-layer :z-index="1002">
        <ol-overlay
          v-for="(e,i) in mapPointList"
          :key="i"
          :position="[e.x,e.y]"
        >
          <template #default>
            <div class="overlay-content" @click="showDialog(e,i)">
              <img :src="e.iconUrl" :style="{ width: e.iconWidth+'px',height: e.iconHeight+'px' }">
            </div>
          </template>
        </ol-overlay>
      </ol-tile-layer>

      <ol-vector-layer
        v-for="(e,i) in airlineList"
        :key="i"
        :z-index="1003"
      >
        <ol-source-vector>
          <ol-feature
            :ref="setAirlineRef"
          >
            <ol-geom-line-string :coordinates="e.line" />
            <ol-style>
              <ol-style-stroke :color="e.lineColor" :width="e.lineWidth" />
            </ol-style>
          </ol-feature>
          <ol-animation-path
            v-if="getAirlineRef(i)"
            :path="getAirlineRef(i).feature"
            :duration="4000"
            :repeat="1000000000"
          >
            <ol-feature>
              <ol-geom-point :coordinates="e.line[0]" />
              <ol-style>
                <ol-style-circle :radius="e.ballRadius">
                  <ol-style-fill :color="e.ballColor" />
                  <!-- <ol-style-stroke color="blue" :width="0" /> -->
                </ol-style-circle>
              </ol-style>
            </ol-feature>
          </ol-animation-path>
        </ol-source-vector>
      </ol-vector-layer>

      <ol-vector-layer
        v-if="areaOutlineShow"
        class-name="areaOutline"
        :z-index="1004"
      >
        <ol-source-vector
          style="mix-blend-mode: overlay;"
          :url="areaOutlineUrl"
          :format="geoJson"
        />
        <ol-style>
          <!-- <ol-style-stroke :color="areaOutlineStyle.borderColor" :width="areaOutlineStyle.borderWidth" /> -->
          <ol-style-stroke :color="`${areaOutlineStyle.borderColor}`" :width="areaOutlineStyle.borderWidth" />
          <ol-style-fill
            ref="areaOutlineLayer"
            :color="`${areaOutlineStyle.backgroundColor}`"
          />
        </ol-style>
      </ol-vector-layer>

      <ol-heatmap-layer :z-index="1005">
        <!-- <ol-source-vector
          url="data/map/heatmap.json"
          :format="geoJson"
        /> -->
        <ol-source-vector>
          <ol-feature v-for="(e,i) in heatmapPointList" :key="i">
            <ol-geom-point :coordinates="[e.x,e.y]" />
          </ol-feature>
          <!-- <ol-feature>
            <ol-geom-point :coordinates="[121.51649,31.246951]" />
          </ol-feature>
          <ol-feature>
            <ol-geom-point :coordinates="[121.51549,31.246851]" />
          </ol-feature>
          <ol-feature>
            <ol-geom-point :coordinates="[121.52649,31.256951]" />
          </ol-feature> -->
        </ol-source-vector>
      </ol-heatmap-layer>

      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="viewMatrixSet"
        :constrain-resolution="true"
      />

      <ol-overviewmap-control v-if="overviewMap" :collapsed="false">
        <ol-tile-layer :z-index="1006">
          <slot></slot>
        </ol-tile-layer>
      </ol-overviewmap-control>
    </ol-map>
  </div>
  <Vue3DraggableResizable
    v-for="(eitem, idx) in dialogList"
    :key="idx"
    v-model:x="eitem.x"
    v-model:y="eitem.y"
    v-model:w="eitem.w"
    v-model:h="eitem.h"
    v-model:active="eitem.active"
    :init-w="eitem.w"
    :init-h="eitem.h"
    :draggable="eitem.draggable"
    :resizable="false"
    class-name-active="dialogActive"
    :identity="idx"
    @click="eitem.active=true"
  >
    <div
      class="dialogHeader"
      :style="dialogHeaderStyle"
      @mousedown="eitem.draggable=true"
    >
      <div style="width:90%;float:left;background-color:transparent">
        {{ dialogSetting.headerContent + eitem.title }}
      </div>
      <div style="width:10%;float:right;text-align:right;padding-top:2px;">
        <n-icon class="dialogClose" :size="dialogSetting.headerHeight-4" @click="closeDialog(idx)">
          <IconClose />
        </n-icon>
      </div>
    </div>
    <div
      class="dialogBody"
      :style="{ height: (dialogSetting.height - dialogSetting.headerHeight - 2) +'px' }"
      @mousedown="eitem.draggable=false"
    >
      <component
        :is="eitem.componentName"
        :width="dialogSetting.width"
        :height="(dialogSetting.height - dialogSetting.headerHeight - 2)"
        :data="eitem.data"
      />
    </div>
  </Vue3DraggableResizable>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, ref, onMounted, watch, reactive, getCurrentInstance, inject } from 'vue'
import { OlMap, OlZoomControl, OlTileLayer, OlSourceWmtsCap,OlSourceBaidu,OlHeatmapLayer,OverviewMapControl } from 'vue3-openlayers'
//import { ApiModule } from '@/store/modules/api'
//import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { useDataCenter } from '@/mixins/data-center'
import { HandleItemField } from '@/components/data-handle'
import { IconClose,IconKey } from '@/icons'
import dcRequest from '@/utils/dc-request'
import * as turf from '@turf/turf'
import Img from '@/icons/img.vue'
import { mapPoint } from './mapPoint'
import { useEventCenter } from '@/mixins/event-center'
import { transform } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'
import { DatavComponent } from '../datav-component'

interface airline {
  name:string
  line:any[]
  lineColor:string
  lineWidth:number
  ballRadius:number
  ballColor:string
}

interface iAirline {
  name:string
  x1:number
  y1:number
  x2:number
  y2:number
  lineColor:string
  lineWidth:number
  ballRadius:number
  ballColor:string
}

interface circlePoint {
  name:string
  x: number
  y: number
  radius: number
  lineColor: string
  lineWidth: number
  fillColor: string
}

interface dialogFrom {
  id: number
  title: string
  x: number
  y: number
  w: number
  h: number
  type: string
  active: boolean
  draggable: boolean
  componentName:string
  data: mapPoint
}

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
  name: 'VBaseMap',
  components: {
    OlMap,
    OlZoomControl,
    OlTileLayer,
    OlSourceWmtsCap,
    OlSourceBaidu,
    IconClose,
    IconKey,
    Img,
    OlHeatmapLayer,
    OverviewMapControl,
  },
  props: {
    com: {
      type: Object as PropType<DatavComponent>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)

    const map = ref(null)
    const mapSourceLayer = ref(null)
    const areaOutlineLayer = ref(null)

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

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

    proj4.defs('EPSG:4008', '+proj=longlat +ellps=clrk66 +no_defs')
    proj4.defs('BD-MC', '+proj=merc +lon_0=0 +units=m +ellps=clrk66 +no_defs')
    register(proj4)

    const dialogSetting = reactive({
      width: config.value.dialogWidth,
      height: config.value.dialogHeight,
      headerHeight:config.value.dialogHeaderHeight,
      headerBackgroundColor:config.value.dialogHeaderBackgroundColor,
      headerContent:'',
      headerFontSize:config.value.dialogHeaderFrontSize,
    })

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    watch(()=>props.com.attr,()=>{
      map.value.updateSize()
    })

    // const filterSet = computed(() =>{
    //   console.log(config.value.filter)
    //   return config.value.filter
    // })

    watch(()=>props.com.config.filter,()=>{
      map.value.updateSize()
      //console.log('tileLayer' ,mapSourceLayer.value.tileLayer)
    },{ deep:true })

    // const url = computed(() => {
    //   return ``
    // })

    // const layer = computed(() => {
    //   return config.value.layer
    // })
    const viewMatrixSet = computed(() => {
      if(config.value.fixedMatrixSet)
      {
        return config.value.fixedMatrixSet
      }
      else
      {
        return config.value.matrixSet
      }
    })
    const ak = computed(() => {
      return config.value.ak
    })
    const udt = computed(() => {
      return config.value.udt
    })

    const seckey = computed(() => {
      return config.value.seckey
    })
    const customid = computed(() => {
      return config.value.theme
    })



    const theme = computed(() => {
      return config.value.theme
    })

    const center = computed(() => {
      if(config.value.fixedMatrixSet)
      {
        return transform([config.value.x, config.value.y],config.value.matrixSet,config.value.fixedMatrixSet)
      }
      else
      {
        return [config.value.x, config.value.y]
      }
    })

    const zoom = computed(() => {
      return config.value.zoom
    })

    const rotation = computed(() => {
      return config.value.rotation
    })

    onMounted(() => {
      //console.log('mapSourceLayer',mapSourceLayer.value)
      // map.value.map.on('postrender',evt=>{
      //   //let ctx = evt
      //   console.log('map postrender',evt)
      // })
      mapSourceLayer.value.tileLayer.on('postrender',evt=>{
        //let ctx = evt
        console.log('map postrender',evt)
        if(config.value.filter)
        {
          let filter = config.value.filter
          let setting = `grayscale(${ filter.grayscale }) sepia(${ filter.sepia }) saturate(${ filter.saturate }) hue-rotate(${ filter.hueRotate }deg) invert(${ filter.invert }) opacity(${ filter.opacity }) brightness(${ filter.brightness }) contrast(${ filter.contrast }) blur(${ filter.blur }px)`
          console.log(setting)
          evt.context.filter = setting
        }
      })
    })

    const comEvent = (fields: HandleItemField[],e:mapPoint) => {
      //fileds.forEach(r=>r.value=inputValue.value)
      fields.forEach(field => {
        field.value=e
        field.params=JSON.stringify(e)
        // emit自定义事件
        mitter.emit(field.targetComId, field)
      })
    }

    const dialogList = ref<dialogFrom[]>([])

    const showDialog=(e:mapPoint,idx:number)=>{

      if(props.com.handles
        && props.com.handles.clickPoint
        && props.com.handles.clickPoint.fields
        && props.com.handles.clickPoint.fields.length > 0)
      {
        comEvent(props.com.handles.clickPoint.fields,e)
      }

      if(!e.dialogComponent)
      {
        return
      }

      let dialog=dialogList.value.find(r=>r.id==idx)
      if(dialog)
      {
        dialog.active=true
        return
      }

      const x = (document.body.clientWidth - dialogSetting.width)/2-props.com.attr.x+dialogList.value.length*10
      const y = (document.body.clientHeight - dialogSetting.height)/2-props.com.attr.y+dialogList.value.length*10

      dialogList.value.push({
        id:idx,
        title:e.name,
        x:x,
        y:y,
        w:dialogSetting.width,
        h:dialogSetting.height,
        type:'Camera',
        active:true,
        draggable:false,
        componentName:e.dialogComponent,
        data: e,
      })
    }

    const closeDialog = (idx:number) =>{
      dialogList.value.splice(idx,1)
    }

    const mapPointList = ref<mapPoint[]>([])

    const getMapPointList = () =>{
      mapPointList.value = []
      config.value.pointConfigs.forEach(pc=>{
        if(pc.apiUrl) {
          dcRequest.post(pc.apiUrl,{ days: 7 }).then(r=>{
            let result= r.data as mapPoint[]
            if(result && result.length>0){
              result.forEach(r=>{
                r.iconUrl=pc.iconUrl
                r.dialogComponent=pc.dialogComponent
              })
              mapPointList.value.push(...result)
            }
          })
        }
      })
    }

    getMapPointList()

    const clearMapPoint = () => {
      mapPointList.value = []
    }

    const setMapPoint = (settings:mapPointSetting[]) =>{
      settings.forEach(setting => {

        dcRequest.post(setting.apiUrl, setting.params? setting.params : {} ).then(r => {
          let result = r.data as mapPoint[]

          for(let i = mapPointList.value.length - 1 ;i >=0 ; i--)
          {
            if(mapPointList.value[i].type == setting.type){
              mapPointList.value.splice(i, 1)
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
            mapPointList.value.push(...result)
          }
        })

      })
    }



    const circlePointList = ref<circlePoint[]>([])

    const getCircleList = () => {
      circlePointList.value=[]
      if(config.value.circleApiUrl)
      {
        dcRequest.post(config.value.circleApiUrl).then(r=>{
          let result= r.data as circlePoint[]
          if(result && result.length > 0){
            circlePointList.value.push(...result)
          }
        })
      }
    }

    getCircleList()

    watch(()=>config.value.circleApiUrl,()=>{ getCircleList() })

    const airlineList = ref<airline[]>([])
    const airlineRefs = ref([])

    const setAirlineRef = el => {
      if (el) {
        airlineRefs.value.push(el)
      }
    }

    const getAirlineRef = index =>{
      //console.log('getItemRef',index,airlineRefs.value[index])
      return airlineRefs.value[index]
    }


    const getLineCoordinate = () => {
      airlineList.value=[]
      airlineRefs.value=[]

      if(config.value.filghtApiUrl) {
        dcRequest.post(config.value.filghtApiUrl).then(r=>{
          let result = r.data as iAirline[]
          if(result && result.length > 0){
            let list = result.map(a => {
              return {
                name : a.name,
                line : getTurfArcFeature([a.x1,a.y1],[a.x2,a.y2]),
                lineColor : a.lineColor,
                lineWidth : a.lineWidth,
                ballRadius: a.ballRadius,
                ballColor : a.ballColor,
              }
            })
            airlineList.value.push(...list)
          }
        })
      }
    }
    getLineCoordinate()

    watch(()=>config.value.filghtApiUrl,()=>{ getLineCoordinate() })

    const getTurfArcFeature = (start:Array<number>, end:Array<number>) => {
      var line = turf.lineString([
        start,
        [ start[0] > end[0] ? end[0] + (start[0]-end[0]) * 0.5 : start[0] + (end[0]-start[0]) * 0.5 ,
          start[1] > end[1] ? start[1] + (start[1]-end[1]) * 0.5 : end[1] + (end[1]-start[1]) * 0.5],
        end,
      ])
      console.log('line',line)
      var curved = turf.bezierSpline(line)
      return curved.geometry.coordinates
    }

    const dialogHeaderStyle= ref<any>({})

    dialogHeaderStyle.value = {
      height:`${dialogSetting.headerHeight}px`,
      backgroundColor:dialogSetting.headerBackgroundColor,
      fontSize:`${dialogSetting.headerFontSize}pt`,
      lineHeight:`${dialogSetting.headerHeight}px`,
    }

    if(config.value.dialogHeaderBackgroundImgUrl)
    {
      dialogHeaderStyle.value.backgroundImage = `url(${config.value.dialogHeaderBackgroundImgUrl})`
      dialogHeaderStyle.value.backgroundRepeat = 'no-repeat'
      dialogHeaderStyle.value.backgroundAttachment = 'fixed'
      dialogHeaderStyle.value.backgroundSize = '100% 100%'
    }



    const format = inject('ol-format') as any
    console.log('ol-format',format)
    const geoJson = new format.GeoJSON()

    const areaOutlineUrl = computed(()=>{
      return config.value.AreaOutline.url
    })

    const areaOutlineShow = computed(()=>{
      return config.value.AreaOutline.show
    })

    const areaOutlineStyle= computed(()=>{
      return {
        backgroundColor:config.value.AreaOutline.InnerbackgroundColor,
        borderWidth:config.value.AreaOutline.broder.width,
        borderColor:config.value.AreaOutline.broder.color,
      }
    })

    const areaOutlineOutBackgroundColor= computed(()=>{
      return config.value.AreaOutline.outerbackgroundColor
    })


    watch(()=>config.value.AreaOutline.broder.width,()=>{
      //map.value.refresh()
      console.log(areaOutlineLayer.value)
    })

    const heatmapPointList = ref([])
    const getHeatmapPointList = () => {
      if(config.value.heatmapApiUrl){
        dcRequest.get(config.value.heatmapApiUrl).then(res=>{
          heatmapPointList.value = res as unknown as []
        })
      }
    }
    getHeatmapPointList()

    watch(()=>config.value.heatmapApiUrl,()=>{
      getHeatmapPointList()
    })

    const overviewMap = computed(() => {
      return config.value.overviewMap
    })

    return {
      map,
      mapSourceLayer,
      areaOutlineLayer,
      theme,
      ak,
      udt,
      customid,
      seckey,
      //url,
      //layer,
      viewMatrixSet,
      wrapperStyle,
      center,
      config,
      zoom,
      rotation,
      showDialog,
      dialogList,
      closeDialog,
      dialogSetting,
      mapPointList,
      circlePointList,
      airlineList,
      setMapPoint,
      clearMapPoint,
      dialogHeaderStyle,
      //animationPath,
      setAirlineRef,
      getAirlineRef,
      areaOutlineUrl,
      geoJson,
      areaOutlineShow,
      areaOutlineStyle,
      areaOutlineOutBackgroundColor,

      getHeatmapPointList,
      heatmapPointList,
      overviewMap,
    }
  },
})
</script>

<style lang="scss" scoped>
.overlay-content {
  background-color:transparent;
  cursor: pointer;
  width:40px;
  height:20px;
}

.dialogClose
{
  cursor: pointer;
  color: white;
}

.dialogActive
{
  z-index: 1000000000;
}

.dialogBody
{
  width:100%;
  margin:0px;
  padding:0px;
  background-color:transparent;
  border-color: rgb(0, 94, 164);
  border-width:1px;
  border-style: solid;
  /* border:none;*/
}

.dialogHeader
{
  width:100%;
  margin:0px;
  padding:0px 5px
}


:deep(.areaOutline)
{
  background-color: v-bind('areaOutlineOutBackgroundColor');
  //mix-blend-mode: exclusion;
}

</style>
