import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Group from './src/index.vue'

Group.install = (app: App): void => {
  app.component('VGroup', Group)
  app.component('VGroupProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Group as SFCWithInstall<typeof Group>
