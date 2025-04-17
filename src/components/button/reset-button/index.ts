import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import ResetButton from './src/index.vue'

ResetButton.install = (app: App): void => {
  app.component(ResetButton.name, ResetButton)
  app.component('VResetButtonProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default ResetButton as SFCWithInstall<typeof ResetButton>
