<template>

</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
} from '@/data/select-options'
import { MappingControl } from './mapping-control'

export default defineComponent({
  name: 'VMappingControlProp',
  props: {
    com: {
      type: Object as PropType<MappingControl>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,

    }
  },
})
</script>
