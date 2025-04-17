<template>
  <div :style="wrapperStyle">
    <n-switch v-model:value="switchValue" @update:value="handleChange" :rail-style="railStyle" :style="switchStyle"
      :disabled="config.disabled" :size="config.size" :loading="config.loading">
      <template #checked>
        <span :style="checkedStyle">{{ config.checkedText.content }}</span>
      </template>
      <template #unchecked>
        <span :style="uncheckedStyle">{{ config.uncheckedText.content }}</span>
      </template>
    </n-switch>
  </div>
</template>

<script lang="ts">
import { ElSwitch } from 'element-plus'
import { defineComponent, PropType, computed, toRef, ref, CSSProperties, watch, getCurrentInstance } from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { Switch } from './switch'
import { useEventCenter } from '@/mixins/event-center'

export default defineComponent({
  name: 'VSwitch',
  components: {
    ElSwitch
  },
  props: {
    com: {
      type: Object as PropType<Switch>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)

    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const switchValue = ref(false);
    const checkedValue = ref();
    const uncheckedValue = ref();
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      } as CSSProperties
    })

    const switchStyle = computed(() => {
      return {
        width: '100%',
        height: '100%',
        transform: 'scale(' + config.value.scale + ')',
      } as CSSProperties
    })

    const railStyle = computed(() => {
      return ({
        focused,
        checked
      }: {
        focused: boolean
        checked: boolean
      }) => {
        const style: CSSProperties = {}
        if (checked) {
          style.background = config.value.checkedColor
          if (focused) {
            style.boxShadow = '0 0 0 2px #d0305040'
          }
        } else {
          style.background = config.value.uncheckedColor
          if (focused) {
            style.boxShadow = '0 0 0 2px #2080f040'
          }
        }
        return style
      }
    })

    watch(() => dv_data.value, () => {
      switchValue.value = dv_data.value[dv_field.value.value];
    })

    const handleChange = (value: any) => {
      if (value) {
        if (props.com.handles
          && props.com.handles.on
          && props.com.handles.on.fields
          && props.com.handles.on.fields.length > 0) {
          props.com.handles.on.fields.forEach(field => {
            field.value = true;
            mitter.emit(field.targetComId, field)
          })
        }

        if (props.com.ichandles && props.com.ichandles.event &&  props.com.ichandles.event.fields.length > 0) {
          props.com.ichandles.event.fields.forEach(field => {
            if (field.targetMethodTriggle == 'event' && field.targetMethodName == 'on') {
              field.value = true;
              mitter.emit(field.targetComId, field)
            }
          })
        }
      }
      else {
        if (props.com.handles
          && props.com.handles.off
          && props.com.handles.off.fields
          && props.com.handles.off.fields.length > 0) {
          props.com.handles.off.fields.forEach(field => {
            field.value = false;
            mitter.emit(field.targetComId, field)
          })
        }

        if (props.com.ichandles && props.com.ichandles.event &&  props.com.ichandles.event.fields.length > 0) {
          props.com.ichandles.event.fields.forEach(field => {
            if (field.targetMethodTriggle == 'event' && field.targetMethodName == 'off') {
              field.value = false;
              mitter.emit(field.targetComId, field)
            }
          })
        }
      }
    }

    const checkedStyle = computed(() => {
      const { checkedText } = config.value
      return {
        color: checkedText.textStyle.color,
        fontSize: `${checkedText.textStyle.fontSize}px`,
        fontWeight: checkedText.textStyle.fontWeight
      } as CSSProperties
    })

    const uncheckedStyle = computed(() => {
      const { uncheckedText } = config.value
      return {
        color: uncheckedText.textStyle.color,
        fontSize: `${uncheckedText.textStyle.fontSize}px`,
        fontWeight: uncheckedText.textStyle.fontWeight
      } as CSSProperties
    })

    return {
      wrapperStyle,
      railStyle,
      switchStyle,
      checkedStyle,
      uncheckedStyle,
      switchValue,
      config,
      checkedValue,
      uncheckedValue,
      handleChange
    }
  },
})
</script>
<style></style>
