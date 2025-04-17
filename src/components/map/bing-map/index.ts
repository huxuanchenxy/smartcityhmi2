import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BingMap from './src/index.vue'

BingMap.install = (app: App): void => {
  app.component(BingMap.name, BingMap)
  app.component('VBingMapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BingMap as SFCWithInstall<typeof BingMap>
