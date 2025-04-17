import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  //initApiConfig, initApiData,
} from '@/components/data-source'
//import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'
//import { generateId } from '@/utils/util'

import { baseMapConfigModel } from '../../baseMapConfigModel'

export class TecentMapConfigModel extends baseMapConfigModel
{
  matrixSet = 'EPSG:3857'
  fixedMatrixSet = null
}

export class TecentMap extends DatavComponent {
  config =  new TecentMapConfigModel()

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('TecentMap', { w: 300, h: 180 })

    this.initData()
  }

  initData() {
    this.apis = {}
    this.apiData = {}

    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      const path = 'map/tecent-map'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default TecentMap
