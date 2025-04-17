import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BaiduapiMap from './src/index.vue'

BaiduapiMap.install = (app: App): void => {
  app.component(BaiduapiMap.name, BaiduapiMap)
  app.component('VBaiduapiMapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BaiduapiMap as SFCWithInstall<typeof BaiduapiMap>
