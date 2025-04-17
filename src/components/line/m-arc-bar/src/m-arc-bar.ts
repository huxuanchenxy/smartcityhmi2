import { DatavEChartsComponent, DatavChartSeries } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'
import { number } from 'echarts/core'

export class MArcBarSeries extends DatavChartSeries {
  constructor(name: string,radiusin:number,radiusout:number) {
    super('pie', name)
    this.radiusIn=radiusin
    this.radiusOut=radiusout
  }

  radiusIn = 50
  radiusOut = 70
  color = '#c23531'
  pieLine = {
    type: 'solid',
    width: 0,
    color: '#c23531',
  }

  label = {
    enabled:true,
    padding:5,
    textStyle:
    {
      fontFamily:'Microsoft YaHei',
      fontWeight: 'normal',
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.3)',
    },
  }
}

/**
 * ArcBar
 */
export class MArcBar extends DatavEChartsComponent {

  config = {
    graphical:
    {
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      colour : true,
    },
    legend: {
      show: false,
      top:'top',
      left:'left',
      textStyle:
      {
        fontFamily:'Microsoft YaHei',
        fontWeight: 'normal',
        fontSize: 12,
        color: '#fff',
      },
      orient: 'vertical',
      align: 'left',
      showValue: false,
    },
    tooltip: {
      triggerOn: 'mousemove' ,
      textStyle:
      {
        fontFamily:'Microsoft YaHei',
        fontWeight: 'normal',
        fontSize: 12,
        color: '#333',
      },
      padding:5,
    },
    frameBackground:{
      horizontal:12,
      vertical:12,
      backgroundColor:'#333',
      borderStyle:{
        type: 'dashed',
        width: 1,
        color: '#f5dc69',
        radius:4,
      },
    },
    animation: {
      enabled: false,
      easing: 'cubicOut',
      duration: 1000,
    },
    series: [ new MArcBarSeries('系列1',15,35), new MArcBarSeries('系列2',50,70)],

  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('MArcBar', { w: 500, h: 300 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('label', { description: '项目' }),
      createField('value', { description: '值' }),
      createField('category', { description: '系列' }),
    ]

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: '多维环图接口',
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
      const path = 'line/m-arc-bar'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default MArcBar
