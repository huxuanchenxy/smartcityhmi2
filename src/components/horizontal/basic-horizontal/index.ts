import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BasicHorizontal from './src/index.vue'

BasicHorizontal.install = (app: App): void => {
  app.component(BasicHorizontal.name, BasicHorizontal)
  app.component('VBasicHorizontalProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BasicHorizontal as SFCWithInstall<typeof BasicHorizontal>
