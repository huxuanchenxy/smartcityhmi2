import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import LineBar from './src/index.vue'

LineBar.install = (app: App): void => {
  app.component('VLineBar', LineBar)
  app.component('VLineBarProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default LineBar as SFCWithInstall<typeof LineBar>
