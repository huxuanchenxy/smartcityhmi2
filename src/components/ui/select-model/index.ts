import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import SelectModel from './src/index.vue'

SelectModel.install = (app: App): void => {
  app.component(SelectModel.name, SelectModel)
}

export default SelectModel as SFCWithInstall<typeof SelectModel>
