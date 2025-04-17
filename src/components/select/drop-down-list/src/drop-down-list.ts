import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'
/**
 * dropDownList
 */
export class dropDownList extends DatavComponent {
  config = {
    backgroundStyle: {
      color: '#465558',
      opacity: 0.4,
      border:{
        radius: 5,
        color: '#fff',
        style: 'none',
        width: 1,
      },
    },
    input:{
      fontFamily: 'Microsoft Yahei',
      fontSize: 10,
      color: '#ffffff',
      fontWeight: 'normal',
      placeholder: '请选择',
    },
    option:{
      background: {
        color: '#465558',
        opacity: 0.8,
        border:{
          radius: 5,
          color: '#fff',
          style: 'none',
          width: 1,
        },
      },
      textStyle: {
        fontFamily: 'Microsoft Yahei',
        fontSize: 9,
        color: '#ffffff',
        fontWeight: 'normal',
      },
      hovered:{
        backgroundColor:'#ffffff',
        fontColor:'#000000',
      },
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('DropDownList', { w: 300, h: 56 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('label', { description: '标签' }),
      createField('value', { description: '值' }),
      createField('category', { description: '分类' }),
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
      const path = 'select/drop-down-list'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default dropDownList
