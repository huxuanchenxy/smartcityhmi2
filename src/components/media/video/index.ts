import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Video from './src/index.vue'

Video.install = (app: App): void => {
  app.component(Video.name, Video)
  app.component('VVideoProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Video as SFCWithInstall<typeof Video>
