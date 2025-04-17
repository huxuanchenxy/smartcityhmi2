import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import DynamicSingleBar from './src/index.vue'

DynamicSingleBar.install = (app: App): void => {
  app.component(DynamicSingleBar.name, DynamicSingleBar)
  app.component('VDynamicSingleBarProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default DynamicSingleBar as SFCWithInstall<typeof DynamicSingleBar>
