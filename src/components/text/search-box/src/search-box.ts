import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
//import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'
/**
 * SearchBox
 */
export class searchBox extends DatavComponent {
  config = {
    backgroundStyle: {
      color: '#465558',
      opacity: 0.2,
      border:{
        radius: 5,
        color: '#fff',
        style: 'none',
        width: 1,
      },
    },
    icon:{
      show:true,
      size:20,
      color:'#ffffff',
    },
    button:{
      show: true,
      text:'搜索',
      color: 'transparent',
      textStyle: {
        fontFamily: 'Microsoft Yahei',
        fontSize: 9,
        color: '#ffffff',
        fontWeight: 'normal',
      },
      border:{
        color: '#ffffff',
        style: 'solid',
        width: 1,
      },
      circle:false,
      round:false,
    },
    textBox:{
      textStyle: {
        fontFamily: 'Microsoft Yahei',
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'normal',
        textAlign: 'left',
      },
      placeholder:'请输入要搜索的内容',
    },

  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('SearchBox', { w: 300, h: 56 })

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
      const path = 'text/search-box'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default searchBox
