import { createApp } from 'vue'

import i18n from '@/locales'
import ElementPlus from '@/components/element-plus'
import NaiveUI from '@/components/naive-ui'
import GUI from '@/components/ui'
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import '@/styles/index.scss'
import DatavCharts from '@/components'
import store from './store'
import router from './routes'
import App from './App.vue'
import { emitter } from './mitter'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
//需引入默认样式
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import CovidStreetMapDialog from './custom/covidStreetMapDialog/covidStreetMapDialog.vue'
//引入外部字体
import '@/assets/fonts/font.scss'

const app = createApp(App)
//挂载事务总线
app.config.globalProperties.mitter = emitter

app.use(i18n)
app.use(ElementPlus)
app.use(NaiveUI)
app.use(GUI)
app.use(DatavCharts)
app.use(store)
app.use(router)
app.use(OpenLayersMap)
app.use(Vue3DraggableResizable)

app.component('CovidStreetMapDialog', CovidStreetMapDialog)

app.mount('#app')
