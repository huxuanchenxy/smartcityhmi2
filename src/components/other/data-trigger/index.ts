import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import DataTrigger from './src/index.vue'

DataTrigger.install = (app: App): void => {
  app.component(DataTrigger.name, DataTrigger)
  app.component('VDataTriggerProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default DataTrigger as SFCWithInstall<typeof DataTrigger>
