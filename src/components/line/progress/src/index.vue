<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <n-progress
      type="line"
      :percentage="percentage"
      :height="options.height"
      :border-radius="options.radius"
      :fill-border-radius="0"
      :color="options.barColor"
      :rail-color="options.railColor"
      :indicator-placement="options.indicator.placement"
    >
      <span v-if="options.indicator.show" :style="textStyle">{{ percentage+options.indicator.unit }}</span>
    </n-progress>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef } from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { Progress } from './progress'
import { useEventCenter } from '@/mixins/event-center'
import { FontWeightProperty } from 'csstype'


export default defineComponent({
  name: 'VProgress',
  props: {
    com: {
      type: Object as PropType<Progress>,
      required: true,
    },
  },
  setup(props) {
    const { datavEmit } = useDataCenter(props.com)
    useEventCenter(props.com)

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? []
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const percentage = computed(()=>{
      return dv_data.value[dv_field.value.value] ?? 0
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    const options = computed(() => {
      return {
        height: attr.value.h,
        barColor:config.value.barColor,
        railColor:config.value.railColor,
        radius:config.value.radius,
        indicator:config.value.indicator,
      }
    })

    const textStyle = computed(() => {
      return {
        fontFamily:config.value.indicator.fontFamily,
        fontWeight: config.value.indicator.fontWeight as FontWeightProperty,
        fontSize: `${config.value.indicator.fontSize}pt`,
        color: config.value.indicator.color,
      }
    })


    const onClick = (params: any) => {
      datavEmit(
        'click',
        {
          ...params.data.dataRef,
          x: params.name,
          y: params.value,
        })
    }

    return {
      wrapperStyle,
      onClick,
      config,
      options,
      percentage,
      textStyle,
    }
  },
})
</script>
