import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'
//import { generateId } from '@/utils/util'


import { baseMapConfigModel } from '../../baseMapConfigModel'

export class OlMapWmtsConfigModel extends baseMapConfigModel
{
  url = 'http://saints-pc:8080/geoserver/gwc/service/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities'
  layer = 'tiger-ny'
  matrixSet = 'EPSG:2431'
  fixedMatrixSet = null
}

export class OlMapWmts extends DatavComponent {
  config = new OlMapWmtsConfigModel()

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('OlMapWmts', { w: 300, h: 180 })

    this.initData()
  }

  initData() {
    // const fields = [
    //   createField('url', { description: 'WMTS Capabilities xml文件地址' }),
    //   createField('layer', { description: 'WMTS 图层名称' }),
    //   createField('matrixSet', { description: 'WMTS 坐标系' }),
    // ]

    // this.apis = initApiConfig({
    //   fields: Object.assign({}, ...fields),
    // })
    this.apis = {}
    this.apiData = {} // initApiData(this.id)

    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      // 组件静态数据来源，当前项目统一管理目录：data/*
      // 如：data/demo/data.json 简写为 => demo/data
      const path = 'map/ol-map-wmts'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default OlMapWmts
