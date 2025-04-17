import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import ModalPanelBasic from './index.vue'

ModalPanelBasic.install = (app: App): void => {
  app.component(ModalPanelBasic.name, ModalPanelBasic)
}

export default ModalPanelBasic as SFCWithInstall<typeof ModalPanelBasic>
