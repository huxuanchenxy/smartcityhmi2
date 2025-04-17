import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
} from '@/components/data-source'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'
//import { generateId } from '@/utils/util'
import { baseMapConfigModel } from '../../baseMapConfigModel'

export class BaiduMapConfigModel extends baseMapConfigModel
{
  ak = 'E4805d16520de693a3fe707cdc962045'
  theme = 'normal'
  seckey = 'OA7Pj5W2XQtunLqrRAm%2FnniHlHnF4noMJ2AfbQJJ95Q%3D%2CibNfOKRdOSrUbhnynrtY-u0SJNA43LU_68bZAVPE1nfm9yJKJHNQQlZR8iiVgYsCE_WgxC0QgPUmJfmtAne8XdG3IwVlhAhzN0o0IDiwtSsj-Yq0GyRD9Cj0y0tQeeV834b7ABcB9wUj1Qc_Ya1UztWBf6Wg8CVCOaCLLVgn5trE5Zcg1zJW5nWDuK6GPfg9'
  udt = '20220804'
  matrixSet = 'EPSG:4326'
  fixedMatrixSet ='BD-MC'
}


export class BaiduMap extends DatavComponent {
  config = new BaiduMapConfigModel()

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('BaiduMap', { w: 300, h: 180 })

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
      const path = 'map/baidu-map'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default BaiduMap
