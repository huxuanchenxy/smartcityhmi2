import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import FlexTextBox from './src/index.vue'

FlexTextBox.install = (app: App) => {
  app.component(FlexTextBox.name, FlexTextBox)
  app.component('VFlexTextBoxProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default FlexTextBox as SFCWithInstall<typeof FlexTextBox>
