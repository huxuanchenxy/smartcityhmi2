<template>
  <base-config :com="comModel">
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
import { TecentMap } from './tecent-map'

import baseConfig from '../../baseConfig.vue'

export default defineComponent({
  name: 'VTecentMapProp',
  components: {
    baseConfig,
  },
  props: {
    com: {
      type: Object as PropType<TecentMap>,
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
