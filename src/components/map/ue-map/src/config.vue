<template>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import { UeMap } from './ue-map'

export default defineComponent({
  name: 'VUeMapProp',
  props: {
    com: {
      type: Object as PropType<UeMap>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config
    }
  },
})
</script>
