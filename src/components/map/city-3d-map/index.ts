import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import City3dMap from './src/index.vue'

City3dMap.install = (app: App): void => {
  app.component(City3dMap.name, City3dMap)
  app.component('VCity3dMapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default City3dMap as SFCWithInstall<typeof City3dMap>
