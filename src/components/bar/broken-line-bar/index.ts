import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BrokenLineBar from './src/index.vue'

BrokenLineBar.install = (app: App): void => {
  app.component('VBrokenLineBar', BrokenLineBar)
  app.component('VBrokenLineBarProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BrokenLineBar as SFCWithInstall<typeof BrokenLineBar>
