<template>
  <div class="datav-wrapper">
    <span :style="style">{{ text }}</span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, CSSProperties } from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { QuickText } from './quick-text'
import { useEventCenter } from '@/mixins/event-center'

export default defineComponent({
  name: 'VQuickText',
  props: {
    com: {
      type: Object as PropType<QuickText>,
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

    const text =computed(() => {
      return config.value.content
    })

    const fontSize =computed(() => {
      return config.value.fontSize
    })

    const fontColor =computed(() => {
      return config.value.fontColor
    })

    const style = computed(() => {
      const style = {
        color: `${fontColor.value}`,
        fontSize: ` ${fontSize.value}px`,
      }
      return style as CSSProperties
    })

    return {
      text,
      fontColor,
      fontSize,
      style,
    }
  },
})
</script>
