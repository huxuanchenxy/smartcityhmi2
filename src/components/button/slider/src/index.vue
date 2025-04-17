<template>
  <div :style="wrapperStyle">
    <n-space style="width:100%;height:100%;justify-content: center" v-if="com.config.vertical">
      <n-slider v-model:value="sliderValue" :default-value="com.config.defaultValue" :step="com.config.step"
        :reverse="com.config.reverse" :tooltip="com.config.tooltip" vertical @update:value="handleChange">
        <template #thumb>
          <img :src="com.config.button.url" :style="imgStyle">
        </template>
      </n-slider>
    </n-space>
    <n-space style="width:100%;height:100%;justify-content: center" vertical v-if="!com.config.vertical">
      <n-slider v-model:value="sliderValue" :default-value="com.config.defaultValue" :step="com.config.step"
        :reverse="com.config.reverse" :tooltip="com.config.tooltip" @update:value="handleChange">
        <template #thumb>
          <img :src="com.config.button.url" :style="imgStyle">
        </template>
      </n-slider>
    </n-space>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed, toRef, CSSProperties,
  getCurrentInstance,
  ref,
  watch
} from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { Slider } from './slider'
import { useEventCenter } from '@/mixins/event-center'
import { debounce } from 'lodash-es';

export default defineComponent({
  name: 'VSlider',
  components: {
    // Slider,
  },
  props: {
    com: {
      type: Object as PropType<Slider>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const sliderValue = ref(0);

    const sbtton = "./public/images/sliderbutton.png";

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    watch(() => dv_data.value, () => {
      sliderValue.value = dv_data.value[dv_field.value.value];
      handleChange(sliderValue.value);
    })

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        padding: `20px`,
      } as CSSProperties
    })

    const imgStyle = computed(() => {
      return {
        'user-select': 'none',
        width: `${config.value.button.width}px`,
        height: `${config.value.button.height}px`,
      } as CSSProperties
    })


    const handleChange = debounce((value: any) => {
      if (props.com.handles
        && props.com.handles.change
        && props.com.handles.change.fields
        && props.com.handles.change.fields.length > 0) {
        props.com.handles.change.fields.forEach(field => {
          field.value = value;
          mitter.emit(field.targetComId, field)
        })
      }
    }, config.value.debounceTime ?? 200)


    return {
      sliderValue,
      wrapperStyle,
      imgStyle,
      sbtton,
      handleChange
    }
  },
})
</script>
