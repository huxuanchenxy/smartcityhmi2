import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import StackHorizontal from './src/index.vue'

StackHorizontal.install = (app: App): void => {
  app.component('VStackHorizontal', StackHorizontal)
  app.component('VStackHorizontalProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default StackHorizontal as SFCWithInstall<typeof StackHorizontal>
