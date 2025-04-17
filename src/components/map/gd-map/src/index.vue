<template>
  <baseMap :com="comSetting">
    <ol-source-xyz :url="url" />
  </baseMap>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef } from 'vue'
import { GdMap } from './gd-map'
import baseMap from '../../baseMap.vue'

export default defineComponent({
  name: 'VGdMap',
  components: {
    baseMap,
  },
  props: {
    com: {
      type: Object as PropType<GdMap>,
      required: true,
    },
  },
  setup(props) {

    const config = toRef(props.com, 'config')
    const comSetting = computed(()=>{
      return props.com
    })

    const url = computed(() => {
      return config.value.url
    })

    return {
      url,
      comSetting,
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
