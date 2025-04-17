import { DatavEChartsComponent, DatavChartSeries } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'
import { getChartColorTable } from '@/components/chart-color-table'

export class BasicPieSeries extends DatavChartSeries {
  constructor(name: string) {
    super('pie', name)
  }

  column:string = null

  color = {
    type: 'solid',
    value: '#00baff',
    from: '#fff',
    to: '#000',
  }
}

export class colorItem
{
  constructor(_value: string) {
    this.value=_value
  }
  value = '#fff'
}


/**
 * BasicPie
 */
export class BasicPie extends DatavEChartsComponent {
  config = {
    graphical:
    {
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      pieRadius:50,
      pieColor:'#c23531',
      pieLine:{
        type: 'solid',
        width: 0,
        color: '#c23531',
      },
      Nightingale: true,
      colour:true,
      colorList:getChartColorTable().map(r=>new colorItem(r)),
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
    content:{
      enabled:true,
      padding:5,
      textStyle:
      {
        fontFamily:'Microsoft YaHei',
        fontWeight: 'normal',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.3)',
      },
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
    series: [ new BasicPieSeries('系列1')],

  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('BasicPie', { w: 500, h: 300 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('type', { description: '分类' }),
      createField('value', { description: '值' }),
    ]

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: '基本饼图接口',
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
      const path = 'pie/basic-pie'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default BasicPie
