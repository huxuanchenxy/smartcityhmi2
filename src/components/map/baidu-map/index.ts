import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BaiduMap from './src/index.vue'

BaiduMap.install = (app: App): void => {
  app.component(BaiduMap.name, BaiduMap)
  app.component('VBaiduMapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BaiduMap as SFCWithInstall<typeof BaiduMap>
