import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Progress from './src/index.vue'

Progress.install = (app: App): void => {
  app.component(Progress.name, Progress)
  app.component('VProgressProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Progress as SFCWithInstall<typeof Progress>
