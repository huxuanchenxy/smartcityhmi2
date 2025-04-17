import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import SvgReservoir from './src/index.vue'

SvgReservoir.install = (app: App): void => {
  app.component(SvgReservoir.name, SvgReservoir)
  app.component('VSvgReservoirProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default SvgReservoir as SFCWithInstall<typeof SvgReservoir>
