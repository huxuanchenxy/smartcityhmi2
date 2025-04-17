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
import { groupBy } from 'lodash-es'
import dayjs from 'dayjs'
import VChart from 'vue-echarts'
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { FunnelChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { getAutoValue, getLimitValue, valueFormater } from '@/utils/echarts-utils'
import { Funnel } from './funnel'
import { useEventCenter } from '@/mixins/event-center'

use([
  CanvasRenderer,
  FunnelChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

export default defineComponent({
  name: 'VFunnel',
  components: {
    VChart,
  },
  props: {
    com: {
      type: Object as PropType<Funnel>,
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
          type: item.type,
          name: item.name,
          label: {
            show: label.show,
            position: label.position,
            ...label.textStyle,
            offset: [label.offsetX, label.offsetY],
          },
          data: values.map(v => {
            const obj = v[idx]
            return {
              value: obj ? obj[dv_field.value.y] : null,
              name: obj ? obj[dv_field.value.x] : null,
            }
          }),
        }
      })
    }

    const option = computed(() => {
      const { global, tooltip, legend, animation } = config.value
      const [legendTop, legendLeft] = legend.position.split('-')
      const pointerLineStyle = {
        type: tooltip.pointer.line.type === 'dashed'
          ? [tooltip.pointer.line.dashedLength, tooltip.pointer.line.dashedSpace]
          : tooltip.pointer.line.type,
        width: tooltip.pointer.line.width,
        color: tooltip.pointer.line.color,
      }
      const { keys } = chartData.value


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
          data: keys,
        },
        animation: animation.enabled,
        animationDuration: animation.duration,
        animationEasing: animation.easing as any,
        animationDelay: animation.delay,
        series: getSeries(),
      }
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
    }
  },
})
</script>
