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
import { groupBy, map, max, maxBy } from 'lodash-es'
import VChart from 'vue-echarts'
import { use, graphic, EChartsCoreOption } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { getAutoValue, getLimitValue, valueFormater } from '@/utils/echarts-utils'
import { BasicRadar } from './basic-radar'
import { AnimationEasing } from '@/utils/types'
import { useEventCenter } from '@/mixins/event-center'

use([
  CanvasRenderer,
  RadarChart,
])

export default defineComponent({
  name: 'VBasicRadar',
  components: {
    VChart,
  },
  props: {
    com: {
      type: Object as PropType<BasicRadar>,
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


    const option = computed(() => {
      const { color, startAngle, splitNumber, shape,splitAreaStyle,axisName,axisLine,splitLine,dataArea } = config.value
      const { values } = chartData.value

      if(!values[0])
      {
        return {}
      }

      let titleData = (values[0] as Array<any>).map(item => {
        return {
          name: item[dv_field.value.name],
          max: item[dv_field.value.max],
        }
      })

      let valueData = (values[0] as Array<any>).map(item => {
        return item[dv_field.value.value]
      })



      const opts = {
        color,
        radar: {
          indicator: titleData,
          radius: '80%',
          startAngle,
          splitNumber,
          shape,
          splitArea: {
            areaStyle: splitAreaStyle,
          },
          axisName: axisName,
          axisLine: axisLine,
          splitLine: splitLine,
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: valueData,
                //name: 'Allocated Budget',
                symbolSize: dataArea.symbolSize,
                symbol:  dataArea.symbol, //'circle',//'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                areaStyle: dataArea.areaStyle,
                lineStyle:dataArea.lineStyle,
              },
            ],
          },
        ],
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
      config,
    }
  },
})
</script>

