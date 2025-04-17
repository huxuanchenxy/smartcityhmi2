import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'

/**
 * Button
 */
export class Button extends DatavComponent {
  config = {
    content: {
      buttonContent: '按钮',
    },
    borderStyle: {
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.8)',
      borderRadius: 5,
      borderStyle: 'solid',
    },
    fontStyle: {
      fontSize: 30,
      fontColor: 'white',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontFamily:'Times New Roman',
      textAlign:'center',
    },
    background: {
      backgroundColor: 'rgba(1,21,239,0.1)',
      backgroundImage: '',
      backgroundSize: 100,
      backgroundRepeat: false,
    },
    cursor: 'pointer',
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('Button', { w: 120, h: 60 })

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
      const path = 'button/button'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default Button
