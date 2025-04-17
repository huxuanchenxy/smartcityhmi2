import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import dropDownList from './src/index.vue'

dropDownList.install = (app: App) => {
  app.component(dropDownList.name, dropDownList)
  app.component('VDropDownListProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default dropDownList as SFCWithInstall<typeof dropDownList>
