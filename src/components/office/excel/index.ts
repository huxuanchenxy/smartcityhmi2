import { loadAsyncComponent } from '@/utils/async-component'
import type { SFCWithInstall } from '@/utils/types'
import type { App } from 'vue'
import Excel from './src/index.vue'

Excel.install = (app: App) => {
  app.component(Excel.name, Excel)
  app.component('VCustomerCompProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Excel as SFCWithInstall<typeof Excel>