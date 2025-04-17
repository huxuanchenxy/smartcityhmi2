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
import { defineComponent, PropType, computed, toRef } from 'vue'
import { groupBy, map, maxBy } from 'lodash-es'
import VChart from 'vue-echarts'
import { use, graphic, EChartsCoreOption } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, VisualMapComponent } from 'echarts/components'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { getAutoValue, getLimitValue, valueFormater } from '@/utils/echarts-utils'
import { MArcBar } from './m-arc-bar'
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
])

export default defineComponent({
  name: 'VMArcBar',
  components: {
    VChart,
  },
  props: {
    com: {
      type: Object as PropType<MArcBar>,
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

    const chartData = computed(() => {
      const groups = groupBy(dv_data.value, item => item[dv_field.value.category])
      return {
        keys: Object.keys(groups),
        values: Object.values(groups),
      }
    })

    const getSeries = computed(() => {
      const { graphical, series } = config.value
      const { values } = chartData.value


      const result = series.map((item, idx) => {
        let seriesItem = {
          type: item.type,
          name: item.name,
          label: {
            show: item.label.enabled,
            ...item.label.textStyle,
            padding: item.label.padding,
          },
          labelLine: {
            show: false,
          },
          data: map(values[idx], v => {
            const obj = v
            return {
              value: obj ? obj[dv_field.value.value] : null,
              name: obj ? obj[dv_field.value.label] : null,
            }
          }),
          radius: [`${item.radiusIn}%`, `${item.radiusOut}%`],
          itemStyle: {
            color: item.color,
            borderType: item.pieLine.type,
            borderWidth: item.pieLine.width,
            borderColor: item.pieLine.color,
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          top: graphical.margin.top,
          left: graphical.margin.left,
          right: graphical.margin.right,
          bottom: graphical.margin.bottom,
        }

        if (graphical.colour) {
          seriesItem.itemStyle = null
        }

        return seriesItem
      })
      return result
    })

    const option = computed(() => {
      const { graphical, tooltip, legend, animation } = config.value

      let colorTable = getChartColorTable()

      let seriesList = getSeries.value

      let legendOriginData = []

      let showValue=legend.showValue

      seriesList.forEach(serie => {
        serie.data.forEach(item => {
          legendOriginData.push(item)
        })
      })

      let legendData: Array<string> = []
      let maxLegendName = maxBy(legendOriginData, r => r.name.length)
      let maxNameLenght = 1
      if (maxLegendName) {
        maxNameLenght = maxLegendName.name.length + 1
      }


      legendOriginData.forEach(r => {
        legendData.push(r.name)
      })

      const opts = {
        color: colorTable,
        tooltip: {
          show: true,
          trigger: 'item',
          triggerOn: tooltip.triggerOn,
          textStyle: tooltip.textStyle,
          padding: tooltip.padding,
        },
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0.2, 1],
          },
        },
        legend: [{
          orient: config.value.legend.orient,
          align: config.value.legend.align,
          show: legend.show,
          top: legend.top,
          left: legend.left,
          textStyle: legend.textStyle,
          data: legendData,
          formatter: (name: string) => {
            if (showValue) {
              let title = name
              for (let i = 0; i < maxNameLenght - name.length; i++) {
                title += '   '
              }

              let item = legendOriginData.find(r => r.name == name)
              title += item.value
              return title
            }
            else {
              return name
            }
          },
        }],
        animation: animation.enabled,
        animationEasing: animation.easing as AnimationEasing,
        animationDuration: animation.duration,
        series: seriesList,
      }

      if (graphical.colour) {
        opts.visualMap = null
      }


      //console.log('opts:', JSON.stringify(opts))

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
