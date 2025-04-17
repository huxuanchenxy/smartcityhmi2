<template>
  <base-config :com="comModel">
    <g-field
      label="WMTS服务器地址"
    >
      <g-input
        v-model="config.url"
      />
    </g-field>
    <g-field
      label="图层"
    >
      <g-input
        v-model="config.layer"
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
import { OlMapWmts } from './ol-map-wmts'

import baseConfig from '../../baseConfig.vue'

export default defineComponent({
  name: 'VOlMapWmtsProp',
  components: {
    baseConfig,
  },
  props: {
    com: {
      type: Object as PropType<OlMapWmts>,
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
