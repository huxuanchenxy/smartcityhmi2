import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import MappingControl from './src/index.vue'

MappingControl.install = (app: App): void => {
  app.component(MappingControl.name, MappingControl)
  app.component('VMappingControlProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default MappingControl as SFCWithInstall<typeof MappingControl>
