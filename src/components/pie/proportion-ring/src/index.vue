<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <v-chart
      :option="option"
      autoresize
      :update-options="{ notMerge: true }"
      @click="onClick"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, getCurrentInstance } from 'vue'
import { groupBy, map } from 'lodash-es'
import VChart from 'vue-echarts'
import { use, graphic, EChartsCoreOption } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, GaugeChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, VisualMapComponent } from 'echarts/components'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { getAutoValue, getLimitValue, valueFormater } from '@/utils/echarts-utils'
import { ProportionRing } from './proportion-ring'
import { getChartColorTable } from '@/components/chart-color-table'
import { AnimationEasing } from '@/utils/types'
import { useEventCenter } from '@/mixins/event-center'

use([
  CanvasRenderer,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  GaugeChart,
])

export default defineComponent({
  name: 'VProportionRing',
  components: {
    VChart,
  },
  props: {
    com: {
      type: Object as PropType<ProportionRing>,
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

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    // const chartData = computed(() => {
    //   const groups = groupBy(dv_data.value, item => item[dv_field.value.x])

    //   return {
    //     keys: Object.keys(groups),
    //     values: Object.values(groups),
    //   }
    // })

    const getSeries = () => {
      const { graphical, progress, title, content } = config.value
      //const { values } = chartData.value

      let _value = dv_data.value[dv_field.value.value]

      let gaugeData = [
        {
          value: _value,
          name: title.text,
          title: {
            offsetCenter: [`${title.horizontal}%`, `${title.vertical}%`],
          },
          detail: {
            valueAnimation: true,
            offsetCenter: [`${content.horizontal}%`, `${content.vertical}%`],
          },
        },
      ]

      let seriesItem = {
        type: 'gauge',
        data: gaugeData,
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: progress.roundCap,
          clip: false,
          itemStyle: {
            color: progress.color,
            borderWidth: progress.border.width,
            borderColor: progress.border.color,
            borderType: progress.border.type,
          },
        },
        axisLine: {
          lineStyle: {
            width: progress.lineWidth,
            color: [
              [1, progress.incompleteColor],
            ],
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        title: {
          show: title.show,
          fontSize: title.textStyle.fontSize,
          color: title.textStyle.color,
          fontFamily: title.textStyle.fontFamily,
          fontWeight: title.textStyle.fontWeight,
        },
        detail: {
          // width: 50,
          // height: 40,
          show: content.show,
          fontSize: content.textStyle.fontSize,
          fontFamily: content.textStyle.fontFamily,
          fontWeight: content.textStyle.fontWeight,
          color: content.textStyle.color,
          borderColor: 'auto',
          borderRadius: 20,
          borderWidth: 0,
          formatter: '{value}%',
        },
        // itemStyle:{
        //   color:graphical.color,
        //   borderType: graphical.line.type,
        //   borderWidth:graphical.line.width,
        //   borderColor:graphical.line.color,
        //   shadowBlur: 200,
        //   shadowColor: 'rgba(0, 0, 0, 0.5)',
        // },
        top: graphical.margin.top,
        left: graphical.margin.left,
        right: graphical.margin.right,
        bottom: graphical.margin.bottom,
      }
      return [seriesItem]
    }

    const option = computed(() => {
      const { animation } = config.value

      let colorTable = getChartColorTable()

      const opts = {
        color: colorTable,
        animation: animation.enabled,
        animationEasing: animation.easing as AnimationEasing,
        animationDuration: animation.duration,
        series: getSeries(),
      }



      console.log(opts)

      return opts
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
      option,
      onClick,
      config,
    }
  },
})
</script>
