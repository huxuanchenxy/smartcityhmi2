<template>
  <base-config :com="comModel">
    <g-field
      label="Bing密钥"
    >
      <g-input
        v-model="config.key"
      />
    </g-field>
    <g-field
      :level="2"
      label="样式"
    >
      <g-select
        v-model="config.mapStyle"
        :data="[{ id:'Aerial',value:'Aerial' },{ id:'AerialWithLabelsOnDemand',value:'Aerial with labels' },{ id:'RoadOnDemand',value:'Road' },{ id:'CanvasDark',value:'Road dark' },{ id:'CanvasLight',value:'CanvasLight' },{ id:'CanvasGray',value:'CanvasGray' }]"
      />
    </g-field>
    <g-field
      label="坐标系"
    >
      <g-input
        v-model="config.matrixSet"
      />
    </g-field>
  </base-config>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef, computed } from 'vue'
import {
} from '@/data/select-options'
import { BingMap } from './bing-map'

import baseConfig from '../../baseConfig.vue'

export default defineComponent({
  name: 'VBingMapProp',
  components: {
    baseConfig,
  },
  props: {
    com: {
      type: Object as PropType<BingMap>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    const comModel = computed(()=>{
      return props.com
    })

    return {
      config,
      comModel,
    }
  },
})
</script>

<style scoped>
.actionTitle {
  font-size: 9pt;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 200px;
  float: left;
}
</style>
