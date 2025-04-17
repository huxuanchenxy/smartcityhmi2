import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import SvgBlower from './src/index.vue'

SvgBlower.install = (app: App): void => {
  app.component(SvgBlower.name, SvgBlower)
  app.component('VSvgBlowerProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default SvgBlower as SFCWithInstall<typeof SvgBlower>
