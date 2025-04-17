import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import WaterLevel from './src/index.vue'

WaterLevel.install = (app: App): void => {
  app.component(WaterLevel.name, WaterLevel)
  app.component('VWaterLevelProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default WaterLevel as SFCWithInstall<typeof WaterLevel>
