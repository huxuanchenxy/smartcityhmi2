import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import searchBox from './src/index.vue'

searchBox.install = (app: App) => {
  app.component(searchBox.name, searchBox)
  app.component('VSearchBoxProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default searchBox as SFCWithInstall<typeof searchBox>
