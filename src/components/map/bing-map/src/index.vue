<template>
  <baseMap :com="comSetting">
    <ol-source-bingmaps :api-key="key" :imagery-set="mapStyle" culture="zh-CN" />
  </baseMap>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef } from 'vue'
import { BingMap } from './bing-map'
import baseMap from '../../baseMap.vue'

export default defineComponent({
  name: 'VBingMap',
  components: {
    baseMap,
  },
  props: {
    com: {
      type: Object as PropType<BingMap>,
      required: true,
    },
  },
  setup(props) {

    const config = toRef(props.com, 'config')
    const comSetting = computed(()=>{
      return props.com
    })

    const key = computed(() => {
      return config.value.key
    })

    const mapStyle = computed(() => {
      return config.value.mapStyle
    })

    return {
      key,
      mapStyle,
      comSetting,
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
