<template>
  <div :style="wrapperStyle">
    <button :style="buttonStyle">{{ buttonContent }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef, CSSProperties,
  getCurrentInstance } from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { Button } from './button'
import { useEventCenter } from '@/mixins/event-center'

/*import { ElButton } from 'element-plus'*/

export default defineComponent({
  name: 'VButton',
  /*  components:{
      ElButton,
    },*/
  props: {
    com: {
      type: Object as PropType<Button>,
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
        borderWidth: `${config.value.borderStyle.borderWidth}px`,
        borderColor: `${config.value.borderStyle.borderColor}`,
        borderRadius: `${config.value.borderStyle.borderRadius}px`,
        borderStyle: `${config.value.borderStyle.borderStyle}`,
      } as CSSProperties
    })

    const buttonStyle = computed(() => {
      const imageRepeat = computed(() => {
        if (config.value.background.backgroundRepeat) {
          return 'repeat'
        } else {
          return 'no-repeat'
        }
      })

      const style = {
        width: `${attr.value.w - 2 * config.value.borderStyle.borderWidth}px`,
        height: `${attr.value.h - 2 * config.value.borderStyle.borderWidth}px`,
        fontSize: `${config.value.fontStyle.fontSize}px`,
        color: `${config.value.fontStyle.fontColor}`,
        backgroundImage: `url(${config.value.background.backgroundImage})`,
        backgroundRepeat: imageRepeat.value,
        backgroundSize: `${config.value.background.backgroundSize}%`,
        backgroundColor: `${config.value.background.backgroundColor}`,
        textAlign:config.value.fontStyle.textAlign,
        cursor: config.value.cursor,
      }
      return style as CSSProperties
    })

    const buttonContent = computed(() => {
      return config.value.content.buttonContent
    })

    return {
      wrapperStyle,
      buttonContent,
      buttonStyle,
    }
  },
})
</script>
