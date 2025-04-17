import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import DynamicLine from './src/index.vue'

DynamicLine.install = (app: App): void => {
  app.component('VDynamicLine', DynamicLine)
  app.component('VDynamicLineProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default DynamicLine as SFCWithInstall<typeof DynamicLine>
