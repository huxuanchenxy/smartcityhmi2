import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import SvgBox from './src/index.vue'

SvgBox.install = (app: App): void => {
  app.component(SvgBox.name, SvgBox)
  app.component('VSvgBoxProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default SvgBox as SFCWithInstall<typeof SvgBox>
