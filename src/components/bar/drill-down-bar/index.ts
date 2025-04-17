import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import DrillDownBar from './src/index.vue'

DrillDownBar.install = (app: App): void => {
  app.component(DrillDownBar.name, DrillDownBar)
  app.component('VDrillDownBarProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default DrillDownBar as SFCWithInstall<typeof DrillDownBar>
