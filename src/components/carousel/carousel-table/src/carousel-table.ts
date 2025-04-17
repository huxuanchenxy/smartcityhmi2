import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'
import { FontWeightProperty } from 'csstype'

export interface CarouselColumn
{
  title:string
  width:number
  align:string
  fontSize:number
  fontColor:string
  fontStyle:string
  fontWeight:FontWeightProperty
  fontFamily:string
}

export interface SpecialCharacters
{
  text:string
  color:string
}


/**
 * CarouselTable
 */
export class CarouselTable extends DatavComponent {
  config = {
    common:{
      waitTime:2000,
      rowNum:5,
      showIndex:false,
      carousel:'single',
      hoverPause:true,
      oddRowBGC:'#003B51',
      evenRowBGC:'#0A2732',
    },
    header:{
      show:false,
      indexHeader:'#',
      headerHeight:35,
      headerBGC:'#00BAFF',
      fontSize:20,
      fontColor:'#fff',
      fontStyle:'normal',
      fontWeight:'normal',
      fontFamily:'微软雅黑',
    },
    // body:{
    //   columnWidth:[],
    //   align:[],
    // },
    columns: [] as Array<CarouselColumn>,
    SpecialCharactersList: [] as Array<SpecialCharacters>,
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('CarouselTable', { w: 1000, h: 350 })

    this.initData()
  }

  initData() {
    const fields = []

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
    })

    this.apiData = initApiData(this.id)

    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      // 组件静态数据来源，当前项目统一管理目录：data/*
      // 如：data/demo/data.json 简写为 => demo/data
      const path = 'carousel/carousel-table'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default CarouselTable
