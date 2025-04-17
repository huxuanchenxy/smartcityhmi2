import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import DynamicBar from './src/index.vue'

DynamicBar.install = (app: App): void => {
  app.component('VDynamicBar', DynamicBar)
  app.component('VDynamicBarProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default DynamicBar as SFCWithInstall<typeof DynamicBar>
