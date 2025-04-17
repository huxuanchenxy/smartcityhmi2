import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import UeMap from './src/index.vue'

UeMap.install = (app: App): void => {
  app.component(UeMap.name, UeMap)
  app.component('VUeMapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default UeMap as SFCWithInstall<typeof UeMap>
