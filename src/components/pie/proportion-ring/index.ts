import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import ProportionRing from './src/index.vue'

ProportionRing.install = (app: App): void => {
  app.component(ProportionRing.name, ProportionRing)
  app.component('VProportionRingProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default ProportionRing as SFCWithInstall<typeof ProportionRing>
