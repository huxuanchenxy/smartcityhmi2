import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import GdMap from './src/index.vue'

GdMap.install = (app: App): void => {
  app.component(GdMap.name, GdMap)
  app.component('VGdMapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default GdMap as SFCWithInstall<typeof GdMap>
