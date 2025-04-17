import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'

/**
 * BasicCarousel
 */
export class BasicCarousel extends DatavComponent {
  config = {
    colNum:0,
    colColor:'',
    colIndexList:[],
    colIndexColorList:[],
    topicShow:true,
    topicData: [
      {
        topic0: '标题',
        topic1: '标题',
        topic2: '标题',
        topic3: '标题',
        topic4: '标题',
        topic5: '标题',
        topic6: '标题',
        topic7: '标题',
        topic8: '标题',
        topic9: '标题',
        topic10: '标题',
      },
    ],
    dataList: [],
    dataRowColInfoList1:[],
    dataRowColInfoList2:[],
    dataRowColInfoList3:[],
    widthList: [],
    topicLength:3,
    colIndex:0,
    direction: 'up',
    lineHeight: 70,
    interval: 1000,
    rowsNum: 4,
    transformFlag:true,
    backgroundOpacity:1,
    topicStyleConfig:{
      borderTopWidth: 3,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderRightWidth: 3,
      backgroundColor: 'rgba(5,211,219,0.1)',
      topicRowHeight:70,
      fontSize: 20,
      fontColor: `rgba(255, 255, 255, 1)`,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: `rgba(94, 96, 209, 1)`,
      paddingTop: 0,
      paddingLeft: 0,
      textAlign:'center',
      opacity:1,
    },
    alertContent:{
      highlightList1:[],
      highlightList2:[],
      highlightList3:[],
      highlightContent:'',
      color1:`rgba(255, 0, 0, 1)`,
      color2:`rgba(0, 255, 0, 1)`,
      color3:`rgba(255, 255, 0, 1)`,
    },
    limitContentLength:5,
    tableStyleConfig: {
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: 'rgba(0,255,255,0.1)',
      backgroundColor: 'rgba(5,211,219,0.1)',
      backgroundStripeColor: 'rgba(1,21,239,0.1)',
    },
    cellStyleConfig: {
      fontSize: 10,
      fontColor: `rgba(255, 255, 255, 1)`,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: `rgba(94, 96, 209, 1)`,
      paddingTop: 0,
      paddingLeft: 0,
      textAlign:'left',
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('BasicCarousel', { w: 1000, h: 350 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('value', { description: '', optional: true }),
    ]

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
      const path = 'carousel/basic-carousel'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default BasicCarousel
