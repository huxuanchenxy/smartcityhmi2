import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import ThreedViewer from './src/index.vue'

ThreedViewer.install = (app: App): void => {
  app.component(ThreedViewer.name, ThreedViewer)
  app.component('VThreedViewerProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default ThreedViewer as SFCWithInstall<typeof ThreedViewer>
