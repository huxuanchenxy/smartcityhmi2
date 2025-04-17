import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import CameraNavigator from './src/index.vue'

CameraNavigator.install = (app: App): void => {
  app.component(CameraNavigator.name, CameraNavigator)
}

export default CameraNavigator as SFCWithInstall<typeof CameraNavigator>
