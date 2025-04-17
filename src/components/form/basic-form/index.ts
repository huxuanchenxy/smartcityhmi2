import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BasicForm from './src/index.vue'

BasicForm.install = (app: App) => {
  app.component(BasicForm.name, BasicForm)
  app.component('VBasicFormProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BasicForm as SFCWithInstall<typeof BasicForm>
