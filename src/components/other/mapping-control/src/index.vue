<template>
  <div class="datav-wrapper" :style="wraperStyle">
    <div style="color: #fff; font-size: 20px">逻辑映射组件</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, getCurrentInstance, ref } from 'vue'
import { MappingControl } from './mapping-control'
import { useEventCenter } from '@/mixins/event-center'
import { HandleItemField } from '@/components/data-handle'
import { EditorModule } from '@/store/modules/editor'
import { useDataCenter } from '@/mixins/data-center'

export default defineComponent({
  name: 'VMappingControl',
  props: {
    com: {
      type: Object as PropType<MappingControl>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter
    useDataCenter(props.com)
    useEventCenter(props.com)

    const attr = toRef(props.com, 'attr')
    const wraperStyle = computed(() => {
      return {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case 'refreshData':

          break
      }
    })

    return {
      wraperStyle,
    }
  }
})
</script>
