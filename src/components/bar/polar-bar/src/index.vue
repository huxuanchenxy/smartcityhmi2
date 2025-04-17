<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <v-chart :option="option" autoresize :update-options="{ notMerge: true }" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef } from 'vue'
import { groupBy } from 'lodash-es'
import dayjs from 'dayjs'
import VChart from 'vue-echarts'
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, PolarComponent, TitleComponent } from 'echarts/components'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { getAutoValue, getLimitValue, valueFormater } from '@/utils/echarts-utils'
import { PolarBar } from './polar-bar'
import { useEventCenter } from '@/mixins/event-center'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent
])

export default defineComponent({
  name: 'VPolarBar',
  components: {
    VChart,
  },
  props: {
    com: {
      type: Object as PropType<PolarBar>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
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
      const groups = groupBy(dv_data.value, item => item[dv_field.value.x])
      return {
        keys: Object.keys(groups),
        values: Object.values(groups),
      }
    })

    const getSeries = () => {
      const { global, label, series } = config.value
      const { values } = chartData.value
      return series.map((item, idx) => {
        return {
          type: 'bar',
          name: item.name,
          watchItem: {
            diffrentColor: config.value.global.diffrentColor,
            colorList: config.value.global.colorList,
            itemColor: {
              type: item.color.type,
              value: item.color.value,
              from: item.color.from,
              middle: item.color.middle,
              to: item.color.to
            },
          },
          label: {
            show: label.show,
            position: label.position,
            ...label.textStyle,
            offset: [label.offsetX, label.offsetY],
          },
          itemStyle: {
            color: function (params) {
              if (config.value.global.diffrentColor) {
                return config.value.global.colorList[params.dataIndex].value
              }
              else {
                let itemColor = item.color.type === 'gradient'
                  ? new graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: item.color.from,
                  }, {
                    offset: 0.5,
                    color: item.color.middle,
                  }, {
                    offset: 1,
                    color: item.color.to,
                  }])
                  : item.color.value;
                return itemColor;
              }
            }
          },
          coordinateSystem: 'polar',
          showBackground: global.background.show,
          backgroundStyle: {
            color: global.background.color,
          },
          data: values.map(v => {
            const obj = v[idx]
            return {
              value: obj ? obj[dv_field.value.y] : null,
              dataRef: obj ?? {},
              // itemStyle: {
              //   borderWidth: 3,
              //   borderColor: '#919191',
              //   borderType: 'solid'
              // }
            }
          }),
        }
      })
    }

    const option = computed(() => {
      const { global, radiusAxis, angleAxis, tooltip, legend, animation } = config.value
      const [legendTop, legendLeft] = legend.position.split('-')
      const pointerLineStyle = {
        type: tooltip.pointer.line.type === 'dashed'
          ? [tooltip.pointer.line.dashedLength, tooltip.pointer.line.dashedSpace]
          : tooltip.pointer.line.type,
        width: tooltip.pointer.line.width,
        color: tooltip.pointer.line.color,
      }

      const opts = {
        textStyle: {
          fontFamily: global.fontFamily,
        },
        tooltip: {
          show: tooltip.show,
          textStyle: {
            ...tooltip.textStyle,
          },
          padding: [tooltip.background.padding.v, tooltip.background.padding.h],
          backgroundColor: tooltip.background.color,
          trigger: tooltip.pointer.show ? 'axis' : 'item',
          axisPointer: {
            type: tooltip.pointer.show ? 'cross' : 'none',
            label: {
              show: false,
            },
            lineStyle: pointerLineStyle,
            crossStyle: pointerLineStyle,
          },
          borderWidth: 0,
        },
        legend: {
          show: legend.show,
          top: legendTop,
          left: legendLeft,
          orient: legend.orient,
          textStyle: {
            ...legend.textStyle,
          },
          icon: legend.symbol.show
            ? legend.symbol.icon === 'auto'
              ? null : legend.symbol.icon
            : 'none',
          itemWidth: legend.symbol.width,
          itemHeight: legend.symbol.height,
          itemGap: legend.symbol.gap,
          type: legend.page.enabled ? 'scroll' : 'plain',
          width: legend.page.enabled ? legend.page.size.width : 'auto',
          height: legend.page.enabled ? legend.page.size.height : 'auto',
          pageIconSize: legend.page.button.size,
          pageIconColor: legend.page.button.color,
          pageIconInactiveColor: legend.page.button.inactiveColor,
          pageTextStyle: {
            color: legend.page.pageNumColor,
          },
        },
        polar: {
          radius: [global.polarInsideRadius, global.polarOutsideRadius + '%']
        },
        radiusAxis: {
          show: radiusAxis.show,
          type: radiusAxis.type,
          name: radiusAxis.title.show ? radiusAxis.title.name : '',
          nameLocation: radiusAxis.title.location,
          nameRotate: radiusAxis.title.display.rotate,
          nameGap: radiusAxis.title.display.offset,
          nameTextStyle: {
            ...radiusAxis.title.textStyle,
          },
          axisLine: {
            show: radiusAxis.axisLine.show,
            lineStyle: {
              type: radiusAxis.axisLine.type,
              width: radiusAxis.axisLine.width,
              color: radiusAxis.axisLine.color,
            },
          },
          axisTick: {
            show: radiusAxis.axisTick.show,
            lineStyle: {
              type: radiusAxis.axisTick.type,
              width: radiusAxis.axisTick.width,
              color: radiusAxis.axisTick.color,
            },
            alignWithLabel: true,
          },
          axisLabel: {
            show: radiusAxis.axisLabel.show,
            boundaryGap: radiusAxis.axisLabel.boundaryGap,
            interval: getAutoValue(radiusAxis.axisLabel.interval),
            rotate: radiusAxis.axisLabel.display.rotate,
            margin: radiusAxis.axisLabel.display.margin,
            align: radiusAxis.axisLabel.align,
            ...radiusAxis.axisLabel.textStyle,
            formatter: (val: string) => {
              if (radiusAxis.type === 'time') {
                return dayjs(val).format(radiusAxis.axisLabel.timeFormat)
              }
              return val
            },
          },
          splitLine: {
            show: radiusAxis.grid.show,
            lineStyle: {
              type: radiusAxis.grid.line.type === 'dashed'
                ? [radiusAxis.grid.line.dashedLength, radiusAxis.grid.line.dashedSpace]
                : radiusAxis.grid.line.type,
              width: radiusAxis.grid.line.width,
              color: radiusAxis.grid.line.color,
            },
          },
          data: chartData.value.keys,
        },
        angleAxis: {
          startAngle: angleAxis.startAngle,
          clockwise: angleAxis.clockwise,
          axisLine: {
            show: angleAxis.axisLine.show,
            lineStyle: {
              type: angleAxis.axisLine.type,
              width: angleAxis.axisLine.width,
              color: angleAxis.axisLine.color,
            },
          },
          axisTick: {
            show: angleAxis.axisTick.show,
            lineStyle: {
              type: angleAxis.axisTick.type,
              width: angleAxis.axisTick.width,
              color: angleAxis.axisTick.color,
            },
            alignWithLabel: true,
          },
          boundaryGap: [`${angleAxis.axisLabel.boundaryGap}%`, `${angleAxis.axisLabel.boundaryGap}%`],
          axisLabel: {
            show: angleAxis.axisLabel.show,
            rotate: angleAxis.axisLabel.display.rotate,
            margin: angleAxis.axisLabel.display.margin,
            align: angleAxis.axisLabel.align,
            ...angleAxis.axisLabel.textStyle,
            formatter: (val: string) => {
              return valueFormater(val, angleAxis.axisLabel.valueFormat)
            },
          },
          splitLine: {
            show: angleAxis.grid.show,
            lineStyle: {
              type: angleAxis.grid.line.type === 'dashed'
                ? [angleAxis.grid.line.dashedLength, angleAxis.grid.line.dashedSpace]
                : angleAxis.grid.line.type,
              width: angleAxis.grid.line.width,
              color: angleAxis.grid.line.color,
            },
          },
          min: getLimitValue(angleAxis.extent.min),
          max: getLimitValue(angleAxis.extent.max),
          splitNumber: angleAxis.splitNumber > 0 ? angleAxis.splitNumber : null,
        },
        animation: animation.enabled,
        animationDuration: animation.duration,
        animationEasing: animation.easing as any,
        animationDelay: animation.delay,
        series: getSeries(),
      }
      return opts
    })

    return {
      wrapperStyle,
      option
    }
  },
})
</script>
