import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import CartesianHeatmap from './src/index.vue'

CartesianHeatmap.install = (app: App): void => {
  app.component(CartesianHeatmap.name, CartesianHeatmap)
  app.component('VCartesianHeatmapProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default CartesianHeatmap as SFCWithInstall<typeof CartesianHeatmap>
