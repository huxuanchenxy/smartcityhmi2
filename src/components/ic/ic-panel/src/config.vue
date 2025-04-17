<template>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, toRef, watch } from 'vue'
import { IcPanel } from './ic-panel'

export default defineComponent({
  name: 'VIcPanelProp',
  props: {
    com: {
      type: Object as PropType<IcPanel>,
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
<style>

</style>
