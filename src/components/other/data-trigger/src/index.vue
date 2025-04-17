<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div style="color: #fff; font-size: 20px">数据触发器</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, toRef, computed, watchEffect } from 'vue'
import type { CSSProperties } from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { DataTrigger } from './data-trigger'
import { useEventCenter } from '@/mixins/event-center'

export default defineComponent({
  name: 'VDataTrigger',
  props: {
    com: {
      type: Object as PropType<DataTrigger>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      } as Partial<CSSProperties>
    })


    return {
      wrapperStyle,
    }
  },
})
</script>
