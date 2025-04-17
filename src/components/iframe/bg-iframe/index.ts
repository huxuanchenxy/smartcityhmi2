import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BgIframe from './src/index.vue'

BgIframe.install = (app: App): void => {
  app.component(BgIframe.name, BgIframe)
  app.component('VBgIframeProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BgIframe as SFCWithInstall<typeof BgIframe>
