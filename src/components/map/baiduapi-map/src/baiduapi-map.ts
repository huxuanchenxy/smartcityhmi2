import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap,
  ApiDataConfigMap,
  initApiConfig,
  initApiData,
} from '@/components/data-source'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'
import { createField } from '@/components/data-field'

export class BaiduapiMap extends DatavComponent {
  config = {
    ak:'nWmuoIoRgG8RpGnL19sZtHrhhhShnYeq',
    x: 121.531921,
    y: 31.265522,
    zoom: 10,
    mapStyleName: 'default',
    mapStyleJson: [],
    dialogWidth: 800,
    dialogHeight: 600,
    dialogHeaderBackgroundColor: '#11C2EE',
    dialogHeaderBackgroundImgUrl: null,
    dialogHeaderHeight: 30,
    dialogHeaderFrontSize: 16,
    timeoutVal: 6000,
    heatmap : {
      ApiUrl:'',
      radius: 20,
      max: 100,
    },
    //heatmapApiUrl:'',

    // pointConfigs: [
    //   {
    //     name: '',
    //     type: '',
    //     apiUrl: '',
    //     iconUrl: '',
    //     iconWidth: 0,
    //     iconHeight: 0,
    //     dataJson: '',
    //   },
    // ],
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;

  events: Record<string, DataEventConfig>;

  actions: Record<string, DataEventConfig>;

  constructor() {
    super('BaiduapiMap', { w: 300, h: 180 })

    this.initData()
  }

  initData() {
    const fields = [createField('url', { description: '地图地址', optional: true })]
    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: 'iframe接口',
    })
    this.apiData = initApiData(this.id)
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

export default BaiduapiMap
