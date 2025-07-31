import { loadAsyncComponent } from '@/utils/async-component'
import type { SFCWithInstall } from '@/utils/types'
import type { App } from 'vue'
import CustomerComp from './src/index.vue'

CustomerComp.install = (app: App) => {
  app.component(CustomerComp.name, CustomerComp)
  app.component('VCustomerCompProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default CustomerComp as SFCWithInstall<typeof CustomerComp>