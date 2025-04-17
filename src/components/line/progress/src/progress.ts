import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'

/**
 * Progress
 */
export class Progress extends DatavComponent {
  config = {
    barColor:'rgb(32,128,240)',
    railColor:'rgb(235,235,235)',
    radius:0,
    indicator:{
      show:false,
      placement:'outside',
      unit:'%',
      fontFamily:'Microsoft YaHei',
      fontWeight: 'normal',
      fontSize: 12,
      color: '#fff',
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('Progress', { w: 500, h: 300 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('type', { description: '分类' }),
      createField('value', { description: '值' }),
    ]

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: '进度条接口',
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
      const path = 'line/progress'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default Progress
