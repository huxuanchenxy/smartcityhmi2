import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Table from './src/index.vue'

Table.install = (app: App): void => {
  app.component('VTable', Table)
  app.component('VTableProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Table as SFCWithInstall<typeof Table>
