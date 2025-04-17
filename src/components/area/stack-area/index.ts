import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import StackArea from './src/index.vue'

StackArea.install = (app: App): void => {
  app.component('VStackArea', StackArea)
  app.component('VStackAreaProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default StackArea as SFCWithInstall<typeof StackArea>
