import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import MArcBar from './src/index.vue'

MArcBar.install = (app: App): void => {
  app.component(MArcBar.name, MArcBar)
  app.component('VMArcBarProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default MArcBar as SFCWithInstall<typeof MArcBar>
