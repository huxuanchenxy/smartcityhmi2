<template>
  <baseMap :com="comSetting">
    <ol-source-baidu
      :ak="ak"
      :custom-id="customid"
      :seckey="seckey"
      :udt="udt"
    />
  </baseMap>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType, toRef } from 'vue'
import { BaiduMap } from './baidu-map'
import baseMap from '../../baseMap.vue'

export default defineComponent({
  name: 'VBaiduMap',
  components: {
    baseMap,
  },
  props: {
    com: {
      type: Object as PropType<BaiduMap>,
      required: true,
    },
  },
  setup(props) {
    const comSetting = computed(()=>{
      return props.com
    })

    const config = toRef(props.com, 'config')

    const ak = computed(() => {
      return config.value.ak
    })
    const udt = computed(() => {
      return config.value.udt
    })

    const seckey = computed(() => {
      return config.value.seckey
    })
    const customid = computed(() => {
      return config.value.theme
    })

    return {
      comSetting,
      ak,
      udt,
      seckey,
      customid,
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
