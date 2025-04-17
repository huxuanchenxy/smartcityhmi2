<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div style="color: #fff; font-size: 20px">飘视底图通讯模块</div>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  PropType,
  computed,
  toRef,
} from 'vue'
import { UeMap } from './ue-map'
import { useEventCenter } from '@/mixins/event-center'

export default defineComponent({
  name: 'VUeMap',
  props: {
    com: {
      type: Object as PropType<UeMap>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')
    const wrapperStyle = computed(() => {
      return {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    useEventCenter(props.com)

    return {
      wrapperStyle,
    }
  },
})
</script>
