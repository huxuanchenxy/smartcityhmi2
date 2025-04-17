import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Gd3dMap from './src/index.vue'

Gd3dMap.install = (app: App): void => {
  app.component(Gd3dMap.name, Gd3dMap)
  app.component('VGd3dMapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Gd3dMap as SFCWithInstall<typeof Gd3dMap>
