import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import IcPanel from './src/index.vue'

IcPanel.install = (app: App): void => {
  app.component(IcPanel.name, IcPanel)
  app.component('VIcPanelProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default IcPanel as SFCWithInstall<typeof IcPanel>
