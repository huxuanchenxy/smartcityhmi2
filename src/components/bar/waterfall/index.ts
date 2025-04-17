import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Waterfall from './src/index.vue'

Waterfall.install = (app: App): void => {
  app.component(Waterfall.name, Waterfall)
  app.component('VWaterfallProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Waterfall as SFCWithInstall<typeof Waterfall>
