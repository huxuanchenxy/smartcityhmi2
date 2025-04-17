import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import OlMapWmts from './src/index.vue'

OlMapWmts.install = (app: App): void => {
  app.component(OlMapWmts.name, OlMapWmts)
  app.component('VOlMapWmtsProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default OlMapWmts as SFCWithInstall<typeof OlMapWmts>
