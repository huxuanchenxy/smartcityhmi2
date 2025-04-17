import { DatavEChartsComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'


/**
 * 比例环
 */
export class DashboardPie extends DatavEChartsComponent {
  config = {
    graphical:
    {
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      min:0,
      max:240,
      startAngle: 180,
      endAngle: 0,
    },
    pointer: {
      show:true,
      length: 75,
      width: 16,
      horizontal: 0,
      vertical: 5,
    },
    progress:{
      show:false,
      roundCap:false,
      color:'#3dabff',
      border:{
        type: 'solid',
        width: 1,
        color: '#464646',
      },
    },
    axisLine: {
      width: 12,
      color: '#55585b',
    },
    splitLine: {
      length: 12,
      lineStyle: {
        width: 3,
        color: '#999',
      },
    },
    axisTick: {
      show:true,
      splitNumber: 2,
      lineStyle: {
        width: 2,
        color: '#999',
      },
    },
    axisLabel: {
      show: false,
      distance: 20,
      color:'#464646',
      fontFamily:'Microsoft YaHei',
      fontWeight:'normal',
      fontSize:20,
    },
    title:{
      show: false,
      horizontal: 0,
      vertical: -30,
      text:'',
      textStyle:
      {
        fontFamily:'Microsoft YaHei',
        fontWeight: 'normal',
        fontSize: 30,
        color: '#fff',
      },
    },
    content:{
      show:false,
      horizontal: 0,
      vertical: 30,
      //   width:50,
      //   height:40,
      textStyle:
      {
        fontFamily:'Microsoft YaHei',
        fontWeight: 'normal',
        fontSize: 30,
        color: 'rgba(255, 255, 255, 0.3)',
      },
    },
    animation: {
      enabled: false,
      easing: 'cubicOut',
      duration: 1000,
    },
    series: [],
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('DashboardPie', { w: 500, h: 300 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('value', { description: '值' }),
    ]

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: '仪表饼图接口',
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
      const path = 'pie/dashboard-pie'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default DashboardPie
