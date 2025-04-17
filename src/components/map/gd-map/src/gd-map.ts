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


export class GdMapConfigModel extends baseMapConfigModel
{
  url = 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  layer = 'tiger-ny'
  matrixSet = 'EPSG:4326'
  fixedMatrixSet = null
}

export class GdMap extends DatavComponent {
  config = new GdMapConfigModel()

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('GdMap', { w: 300, h: 180 })

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
      const path = 'map/gd-map'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default GdMap
