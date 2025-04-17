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
import { DashboardPie } from './dashboard-pie'
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
  name: 'VDashboardPie',
  components: {
    VChart,
  },
  props: {
    com: {
      type: Object as PropType<DashboardPie>,
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
      const { graphical, progress, title, content, axisLine, splitLine, axisTick, axisLabel, pointer } = config.value
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
        startAngle: graphical.startAngle,
        endAngle: graphical.endAngle,
        min: graphical.min,
        max: graphical.max,
        pointer: {
          show: pointer.show,
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: `${pointer.length}%`,
          width: pointer.width,
          offsetCenter: [`${pointer.horizontal}%`, `${pointer.vertical}%`],
        },
        progress: {
          show: progress.show,
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
            width: axisLine.width,
            color: [
              [1, axisLine.color],
            ],
          },
        },
        splitLine: splitLine,
        axisTick: axisTick,
        axisLabel: axisLabel,
        title: {
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
          formatter: '{value}',
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
      console.log('seriesItem', seriesItem)
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
