import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import PunchCardScatter from './src/index.vue'

PunchCardScatter.install = (app: App): void => {
  app.component('VPunchCardScatter', PunchCardScatter)
  app.component('VPunchCardScatterProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default PunchCardScatter as SFCWithInstall<typeof PunchCardScatter>
