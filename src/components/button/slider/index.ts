import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Slider from './src/index.vue'

Slider.install = (app: App): void => {
  app.component(Slider.name, Slider)
  app.component('VSliderProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Slider as SFCWithInstall<typeof Slider>
