<template>
  <baseMap :com="comSetting">
    <ol-source-wmts-cap
      :url="url"
      :layer-name="layer"
      :matrix-set="matrixSet"
      :extent="extent"
    />
  </baseMap>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, ref } from 'vue'
import { OlMapWmts } from './ol-map-wmts'
import baseMap from '../../baseMap.vue'


export default defineComponent({
  name: 'VOlMapWmts',
  components: {
    baseMap,
  },
  props: {
    com: {
      type: Object as PropType<OlMapWmts>,
      required: true,
    },
  },
  setup(props) {

    const config = toRef(props.com, 'config')

    const comSetting = computed(()=>{
      return props.com
    })

    const extent= ref([-28807.23315347148,-6057.317943455451 ,33270.755585839346,23576.074656663088])

    const url = computed(() => {
      return config.value.url
    })

    const layer = computed(() => {
      return config.value.layer
    })

    const matrixSet = computed(() => {
      return config.value.matrixSet
    })

    return {
      url,
      layer,
      matrixSet,
      extent,
      comSetting,
    }
  },
})
</script>

<style>
</style>
