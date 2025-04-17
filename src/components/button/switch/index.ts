import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Switch from './src/index.vue'

Switch.install = (app: App): void => {
  app.component(Switch.name, Switch)
  app.component('VSwitchProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Switch as SFCWithInstall<typeof Switch>
