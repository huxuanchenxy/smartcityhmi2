<template>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import { PmControl } from './pm-control'

export default defineComponent({
  name: 'VPmControlProp',
  props: {
    com: {
      type: Object as PropType<PmControl>,
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
