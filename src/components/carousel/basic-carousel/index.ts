import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BasicCarousel from './src/index.vue'

BasicCarousel.install = (app: App): void => {
  app.component(BasicCarousel.name, BasicCarousel)
  app.component('VBasicCarouselProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BasicCarousel as SFCWithInstall<typeof BasicCarousel>
