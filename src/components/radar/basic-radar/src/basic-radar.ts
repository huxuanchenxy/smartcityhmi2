import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'


/**
 * BasicPie
 */
export class BasicRadar extends DatavComponent {
  config = {
    color:'#fff',
    startAngle:90,
    splitNumber: 4,
    shape: 'polygon',
    splitAreaStyle: {
      color: '#FFFFFF00',
      shadowColor: 'rgba(0, 0, 0, 0)',
      shadowBlur: 0,
    },
    axisName: {
      formatter: '{value}',
      color: '#FFFFFFFF',
      show : true,
      fontStyle:'normal',
      fontWeight: 'normal',
      fontFamily: 'sans-serif',
      fontSize: 14,
    },
    axisLine: {
      show : true,
      //symbol: ['none','none'],//arrow
      lineStyle: {
        color: 'rgb(123, 123, 123)',
        width: 2,
        type: 'solid',
        opacity : 0.6,
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(123, 123, 123, 1)',
        width: 2,
        type : 'solid',
      },
      show : true,
    },
    dataArea: {
      symbolSize: '10',
      symbol: 'circle',
      areaStyle: {
        color: 'rgba(117,156,122,1)',
      },
      lineStyle:{
        //colorBy: 'series',
        color: '#fff',
        width:1,
        type:'solid',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 0,
      },
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('BasicRadar', { w: 500, h: 300 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('name', { description: '分类' }),
      createField('max', { description: '最大值' }),
      createField('value', { description: '值' }),
    ]

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: '基本雷达图接口',
    })

    this.apiData = initApiData(this.id)

    this.events = {
      click: {
        description: '当点击数据项时',
        fields: Object.assign({}, ...fields),
      },
    }

    this.actions = {}
    return this
  }

  async loadData() {
    try {
      const path = 'radar/basic-radar'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default BasicRadar
