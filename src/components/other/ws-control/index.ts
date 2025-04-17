import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import WsControl from './src/index.vue'

WsControl.install = (app: App): void => {
  app.component(WsControl.name, WsControl)
  app.component('VWsControlProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default WsControl as SFCWithInstall<typeof WsControl>
