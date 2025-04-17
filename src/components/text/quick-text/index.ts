import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import QuickText from './src/index.vue'

QuickText.install = (app: App): void => {
  app.component(QuickText.name, QuickText)
  app.component('VQuickTextProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default QuickText as SFCWithInstall<typeof QuickText>
