import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'

/**
 * WaterLevel
 */
export class WaterLevel extends DatavComponent {
  config = {
    global: {
      shape: 'round',
      waveNum: 3,
      waveHeight: 20,
      waveOpacity: 0.4,
      formatter: '{value}%',
      color1 : '#00BAFF',
      color2 : '#3DE7C9',
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('WaterLevel', { w: 150, h: 150 })

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
      const path = 'other/water-level'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default WaterLevel
