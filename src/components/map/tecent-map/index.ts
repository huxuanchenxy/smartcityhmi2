import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import TecentMap from './src/index.vue'

TecentMap.install = (app: App): void => {
  app.component(TecentMap.name, TecentMap)
  app.component('VTecentMapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default TecentMap as SFCWithInstall<typeof TecentMap>
