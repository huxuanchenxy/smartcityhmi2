<template>
  <baseMap :com="comSetting">
    <ol-source-tecent />
  </baseMap>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed } from 'vue'
import { TecentMap } from './tecent-map'

import baseMap from '../../baseMap.vue'

export default defineComponent({
  name: 'VTecentMap',
  components: {
    baseMap,
  },
  props: {
    com: {
      type: Object as PropType<TecentMap>,
      required: true,
    },
    style:{
      type: Object as PropType< any>,
      required: false,
    },
  },
  setup(props) {

    const comSetting = computed(()=>{
      return props.com
    })

    return {
      comSetting,
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
