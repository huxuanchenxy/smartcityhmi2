import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import NegativeHorizontal from './src/index.vue'

NegativeHorizontal.install = (app: App): void => {
  app.component(NegativeHorizontal.name, NegativeHorizontal)
  app.component('VNegativeHorizontalProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default NegativeHorizontal as SFCWithInstall<typeof NegativeHorizontal>
