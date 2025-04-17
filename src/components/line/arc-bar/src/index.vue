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
import { PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, VisualMapComponent } from 'echarts/components'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { getAutoValue, getLimitValue, valueFormater } from '@/utils/echarts-utils'
import { ArcBar } from './arc-bar'
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
  name: 'VArcBar',
  components: {
    VChart,
  },
  props: {
    com: {
      type: Object as PropType<ArcBar>,
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
      console.log('dv_data', dv_data)
      console.log('dv_field', dv_field)
      console.log('groups', groups)
      return {
        keys: Object.keys(groups),
        values: Object.values(groups),
      }
    })

    const getSeries = () => {
      const { graphical, content, series } = config.value
      const { values } = chartData.value


      let dataSource = values[0]

      const result = series.map((item, idx) => {
        let _data = dataSource
        console.log('dataSource', values, dataSource)
        if (dataSource && dataSource.length > 0 && Array.isArray(dataSource[0])) {
          _data = dataSource[idx]
        }
        let seriesItem = {
          type: item.type,
          name: item.name,
          label: {
            show: config.value.content.enabled,
            ...content.textStyle,
            padding: content.padding,
          },
          labelLine: {
            show: config.value.content.labelLine.show,
            lineStyle: {
              color: config.value.content.labelLine.color,
              width: config.value.content.labelLine.width,
              type: config.value.content.labelLine.type,
            },
          },
          data: map(_data, v => {
            const obj = v
            return {
              value: obj ? obj[dv_field.value.value] : null,
              name: obj ? obj[dv_field.value.type] : null,
            }
          }),
          radius: [`${graphical.pieRadiusIn}%`, `${graphical.pieRadiusOut}%`],
          itemStyle: {
            color: graphical.pieColor,
            borderType: graphical.pieLine.type,
            borderWidth: graphical.pieLine.width,
            borderColor: graphical.pieLine.color,
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
    }

    const option = computed(() => {
      const { graphical, tooltip, legend, animation } = config.value

      let seriesList = getSeries()

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

      // if(config.value.legend.showValue){
      //   let maxName = maxBy(legendOriginData,r => r.name.length)
      //   if(maxName)
      //   {
      //     let maxNameLenght = maxName.name.length + 1

      //     legendOriginData.forEach(r => {
      //       let title = r.name as string
      //       for(let i = 0; i < maxNameLenght - r.name.length; i++){
      //         title += ' '
      //       }
      //       title += r.value
      //       legendData.push(title)
      //     })
      //   }

      // }
      // else{
      //   legendOriginData.forEach(r => {
      //     legendData.push(r.name)
      //   })
      // }


      // legendOriginData.forEach(r => {
      //   if(config.value.legend.showValue){
      //     let title = r.name as string
      //     for(let i = 0; i < maxNameLenght - r.name.length; i++){
      //       title += ' '
      //     }
      //     title += r.value
      //     legendData.push(title)
      //   }
      //   else{
      //     legendData.push(r.name)
      //   }
      // })

      legendOriginData.forEach(r => {
        legendData.push(r.name)
      })

      const opts = {
        color:  config.value.graphical.colorList.map(r=>r.value),
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
            colorLightness: [0, 1],
          },
        },
        legend: [{
          orient: config.value.legend.orient,
          align: config.value.legend.align,
          show: legend.show,
          top: legend.top,
          left: legend.left,
          textStyle: legend.textStyle,
          //formatter: '{name} {value}',
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
