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
import { ScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { getAutoValue, getLimitValue, valueFormater } from '@/utils/echarts-utils'
import { PunchCardScatter } from './punch-card-scatter'
import { useEventCenter } from '@/mixins/event-center'

use([
  CanvasRenderer,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

export default defineComponent({
  name: 'VPunchCardScatter',
  components: {
    VChart,
  },
  props: {
    com: {
      type: Object as PropType<PunchCardScatter>,
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
      const groups_x = groupBy(dv_data.value, item => item[dv_field.value.x])
      const groups_y = groupBy(dv_data.value, item => item[dv_field.value.y])

      const xAxis_items = Object.keys(groups_x);
      const yAxis_items = Object.keys(groups_y);
      let valueList = [];
      let x: number = 0;
      let y: number = 0;

      for (let a = 0; a < dv_data.value.length; a++) {

        for (let b = 0; b < xAxis_items.length; b++) {
          if (dv_data.value[a][dv_field.value.x] === xAxis_items[b]) {
            x = b;
            break;
          }
        }

        for (let c = 0; c < yAxis_items.length; c++) {
          if (dv_data.value[a][dv_field.value.y] === yAxis_items[c]) {
            y = c;
            break;
          }
        }

        for (let d = 0; d < dv_data.value[a][dv_field.value.z].length; d++) {
          if (!valueList[d]) {
            valueList.push([]);
          }
          valueList[d].push([x, y, dv_data.value[a][dv_field.value.z][d]]);
        }
      }

      for (let e = 0; e < valueList.length; e++) {
        let avg: number = 0;
        for (let f = 0; f < valueList[e].length; f++) {
          avg += parseInt(valueList[e][f][2]);
        }

        avg = Math.round(avg / valueList[e].length);

        for (let g = 0; g < valueList[e].length; g++) {
          valueList[e][g][2] = Math.round(valueList[e][g][2] * 10 / avg);
        }
      }

      return {
        xAxis_items: xAxis_items,
        yAxis_items: yAxis_items,
        items: valueList
      }
    })

    const getSeries = () => {
      const { global, label, series } = config.value
      const { items } = chartData.value
      return series.map((item, idx) => {
        return {
          type: 'scatter',
          name: item.name,
          label: {
            show: label.show,
            position: label.position,
            ...label.textStyle,
            offset: [label.offsetX, label.offsetY],
          },
          itemStyle: {
            color: item.color.type === 'gradient'
              ? new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: item.color.from,
              }, {
                offset: 1,
                color: item.color.to,
              }])
              : item.color.value,
          },
          size: item.size,
          symbolSize: function (val) {
            return val[2] * item.size;
          },
          data: items[idx]
        }
      })
    }

    const option = computed(() => {
      const { global, xAxis, yAxis, tooltip, legend, animation } = config.value
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
        grid: {
          ...global.margin,
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
        xAxis: {
          show: xAxis.show,
          type: xAxis.type,
          name: xAxis.title.show ? xAxis.title.name : '',
          nameLocation: xAxis.title.location,
          nameRotate: xAxis.title.display.rotate,
          nameGap: xAxis.title.display.offset,
          nameTextStyle: {
            ...xAxis.title.textStyle,
          },
          axisLine: {
            show: xAxis.axisLine.show,
            lineStyle: {
              type: xAxis.axisLine.type,
              width: xAxis.axisLine.width,
              color: xAxis.axisLine.color,
            },
          },
          axisTick: {
            show: xAxis.axisTick.show,
            lineStyle: {
              type: xAxis.axisTick.type,
              width: xAxis.axisTick.width,
              color: xAxis.axisTick.color,
            },
            alignWithLabel: true,
          },
          axisLabel: {
            show: xAxis.axisLabel.show,
            boundaryGap: xAxis.axisLabel.boundaryGap,
            interval: getAutoValue(xAxis.axisLabel.interval),
            rotate: xAxis.axisLabel.display.rotate,
            margin: xAxis.axisLabel.display.margin,
            align: xAxis.axisLabel.align,
            ...xAxis.axisLabel.textStyle,
            formatter: (val: string) => {
              if (xAxis.type === 'time') {
                return dayjs(val).format(xAxis.axisLabel.timeFormat)
              }
              return val
            },
          },
          splitLine: {
            show: xAxis.grid.show,
            lineStyle: {
              type: xAxis.grid.line.type === 'dashed'
                ? [xAxis.grid.line.dashedLength, xAxis.grid.line.dashedSpace]
                : xAxis.grid.line.type,
              width: xAxis.grid.line.width,
              color: xAxis.grid.line.color,
            },
          },
          data: chartData.value.xAxis_items,
        },
        yAxis: {
          show: yAxis.show,
          type: 'category',
          name: yAxis.title.show ? yAxis.title.name : '',
          nameLocation: yAxis.title.location,
          nameRotate: yAxis.title.display.rotate,
          nameGap: yAxis.title.display.offset,
          nameTextStyle: {
            ...yAxis.title.textStyle,
          },
          axisLine: {
            show: yAxis.axisLine.show,
            lineStyle: {
              type: yAxis.axisLine.type,
              width: yAxis.axisLine.width,
              color: yAxis.axisLine.color,
            },
          },
          axisTick: {
            show: yAxis.axisTick.show,
            lineStyle: {
              type: yAxis.axisTick.type,
              width: yAxis.axisTick.width,
              color: yAxis.axisTick.color,
            },
            alignWithLabel: true,
          },
          boundaryGap: [`${yAxis.axisLabel.boundaryGap}%`, `${yAxis.axisLabel.boundaryGap}%`],
          axisLabel: {
            show: yAxis.axisLabel.show,
            rotate: yAxis.axisLabel.display.rotate,
            margin: yAxis.axisLabel.display.margin,
            align: yAxis.axisLabel.align,
            ...yAxis.axisLabel.textStyle,
            formatter: (val: string) => {
              return valueFormater(val, yAxis.axisLabel.valueFormat)
            },
          },
          splitLine: {
            show: yAxis.grid.show,
            lineStyle: {
              type: yAxis.grid.line.type === 'dashed'
                ? [yAxis.grid.line.dashedLength, yAxis.grid.line.dashedSpace]
                : yAxis.grid.line.type,
              width: yAxis.grid.line.width,
              color: yAxis.grid.line.color,
            },
          },
          data: chartData.value.yAxis_items,
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
