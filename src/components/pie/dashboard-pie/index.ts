import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import DashboardPie from './src/index.vue'

DashboardPie.install = (app: App): void => {
  app.component(DashboardPie.name, DashboardPie)
  app.component('VDashboardPieProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default DashboardPie as SFCWithInstall<typeof DashboardPie>
