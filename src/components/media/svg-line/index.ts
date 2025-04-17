import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import SvgLine from './src/index.vue'

SvgLine.install = (app: App): void => {
  app.component(SvgLine.name, SvgLine)
  app.component('VSvgLineProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default SvgLine as SFCWithInstall<typeof SvgLine>
