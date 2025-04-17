import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import PmControl from './src/index.vue'

PmControl.install = (app: App): void => {
  app.component(PmControl.name, PmControl)
  app.component('VPmControlProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default PmControl as SFCWithInstall<typeof PmControl>
