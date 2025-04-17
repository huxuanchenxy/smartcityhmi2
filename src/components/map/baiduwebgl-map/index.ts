import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BaiduwebglMap from './src/index.vue'

BaiduwebglMap.install = (app: App): void => {
  app.component(BaiduwebglMap.name, BaiduwebglMap)
  app.component('VBaiduwebglMapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BaiduwebglMap as SFCWithInstall<typeof BaiduwebglMap>
