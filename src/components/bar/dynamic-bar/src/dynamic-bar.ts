import { DatavComponent, DatavChartSeries } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  ApiRequestMethod,
  ApiType,
  PostBodyType,
  initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'

export class DynamicBarSeries extends DatavChartSeries {
  constructor(name: string) {
    super('bar', name)
  }

    point = {
      icon: 'roundRect',
      color: '#0a73ff',
      borderColor: 'rgba(0, 0, 0, 0.44)',
      borderWidth: 1,
      borderType: 'solid',
      opacity: 1,
    }

    label = {
      show: false,
      field: 'x',
      valueFormat: 'auto',
      describe: {
        prefix: '',
        suffix: '',
      },
      offset: {
        x: 0,
        y: 0,
      },
      rotate: 0,
      textStyle: {
        fontSize: 12,
        color: '#ddd',
        fontWeight: 'normal',
      },
      stroke: {
        color: '#000',
        width: 0,
      },
    }

    ic = {
      deviceCode: '',
      nodeCode : '',
    }
}

/**
 * BasicLine
 */
export class DynamicBar extends DatavComponent {
    config = {
      global: {
        fontFamily: 'Microsoft Yahei',
        margin: {
          top: 40,
          bottom: 50,
          left: 50,
          right: 10,
        },
        innerPadding: 20,
        outerPadding: 40,
        barWidth: 'auto',
        background: {
          show: true,
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      xAxis: {
        show: true,
        type: 'category',
        extent: {
          min: 'auto',
          max: 'auto',
        },
        boundaryGap: true,
        title: {
          show: false,
          name: 'X轴',
          location: 'center',
          display: {
            rotate: 0,
            offset: 30,
          },
          textStyle: {
            fontSize: 12,
            color: '#90a0ae',
            fontWeight: 'normal',
          },
        },
        axisLine: {
          show: true,
          type: 'solid',
          width: 1,
          color: 'rgba(255, 255, 255, 0.5)',
        },
        axisTick: {
          show: true,
          type: 'solid',
          width: 1,
          color: 'rgba(255, 255, 255, 0.5)',
        },
        axisLabel: {
          show: true,
          valueFormat: 'd',
          timeFormat: 'MM/DD',
          interval: 'auto',
          display: {
            rotate: 0,
            margin: 25,
          },
          align: 'center',
          textStyle: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 'normal',
          },
        },
        grid: {
          show: true,
          line: {
            type: 'dashed',
            width: 1,
            color: 'rgba(233, 228, 228, 0.1)',
            dashedLength: 4,
            dashedSpace: 4,
          },
        },
      },
      yAxis: {
        show: true,
        type: 'value',
        extent: {
          min: 'auto',
          max: 'auto',
        },
        title: {
          show: false,
          name: 'Y轴',
          location: 'center',
          display: {
            rotate: 90,
            offset: 20,
          },
          textStyle: {
            fontSize: 12,
            color: '#90a0ae',
            fontWeight: 'normal',
          },
        },
        axisLine: {
          show: true,
          type: 'solid',
          width: 1,
          color: 'rgba(255, 255, 255, 0.5)',
        },
        axisTick: {
          show: true,
          type: 'solid',
          width: 1,
          color: 'rgba(255, 255, 255, 0.5)',
        },
        axisLabel: {
          show: true,
          valueFormat: 'auto',
          timeFormat: 'MM/DD',
          boundaryGap: 0,
          display: {
            rotate: 0,
            margin: 8,
          },
          align: 'right',
          textStyle: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 'normal',
          },
        },
        grid: {
          show: true,
          line: {
            type: 'dashed',
            width: 1,
            color: 'rgba(233, 228, 228, 0.1)',
            dashedLength: 4,
            dashedSpace: 4,
          },
        },
      },
      tooltip: {
        show: true,
        triggerOn: 'mousemove',
        textStyle: {
          fontSize: 14,
          color: '#fff',
          fontWeight: 'normal',
        },
        background: {
          padding: {
            h: 5,
            v: 5,
          },
          color: 'rgba(0, 0, 0, 0.65)',
          borderColor: 'rgba(0, 0, 0, 0.25)',
          borderWidth: 1,
        },
        pointer: {
          show: true,
          line: {
            type: 'dashed',
            width: 1,
            color: '#f5dc69',
            dashedLength: 4,
            dashedSpace: 4,
          },
        },
      },
      legend: {
        show: true,
        position: 'top-center',
        orient: 'horizontal',
        textStyle: {
          fontSize: 12,
          color: '#90a0ae',
          fontWeight: 'normal',
        },
        symbol: {
          show: true,
          icon: 'auto',
          width: 25,
          height: 14,
          gap: 10,
        },
        page: {
          enabled: false,
          size: {
            width: 100,
            height: 100,
          },
          button: {
            size: 15,
            color: '#000',
            inactiveColor: '#000',
          },
          pageNumColor: '#90a0ae',
        },
      },
      series: [new DynamicBarSeries('')],
      animation: {
        enabled: true,
        duration: 1000,
        easing: 'cubicOut',
        delay: 0,
      },
      control:{
        //deviceCode: '',
        //nodeCode : '',
        //interval : 60,
        startCount: 20,
      },
    }

    apis: Partial<ApiConfigMap>
    apiData: Partial<ApiDataConfigMap>

    events: Record<string, DataEventConfig>

    actions: Record<string, DataEventConfig>

    constructor() {
      super('DynamicBar', { w: 500, h: 300 })

      this.initData()
    }

    initData() {
      const fields = [
        createField('x', { description: '类目' }),
        createField('y', { description: '值' }),
        createField('s', { description: '系列' }),
      ]

      this.apis = initApiConfig({
        fields: Object.assign({}, ...fields),
        description: '垂直分组柱状图接口',
      })

      this.apiData = initApiData(this.id)

      // this.apiData.source.type = ApiType.api
      // this.apis.source.useAutoUpdate = true
      this.apis.source.autoUpdate = 60
      // this.apiData.source.config.isAppendDataList = true

      // this.apiData.source.config.apiMethod = ApiRequestMethod.POST
      // this.apiData.source.config.api = 'http://10.235.116.5:39019/device/deviceManagement/chart'
      // this.apiData.source.config.postBodyType = PostBodyType.function
      // this.apiData.source.config.postBodyfunc = (postBodyJsTemplate.default as any).value


      this.events = {
        click: {
          description: '当点击数据项时',
          fields: Object.assign({}, ...fields),
        },
      }
      this.actions = {}

      const series2 = new DynamicBarSeries('')
      series2.point.color = '#34FFF5'

      const series3 = new DynamicBarSeries('')
      series3.point.color = '#79daff'

      const series4 = new DynamicBarSeries('')
      series4.point.color = '#3dabff'

      const series5 = new DynamicBarSeries('')
      series5.point.color = '#2469E4'
      this.config.series.push(series2, series3, series4, series5)

      return this
    }

    async loadData() {
      try {
        // 组件静态数据来源，当前项目统一管理目录：data/*
        // 如：data/demo/data.json 简写为 => demo/data
        const path = 'bar/dynamic-bar'
        const res = await getStaticData(this.id, path)
        this.apiData.source.config.data = JSON.stringify(res.data)
      } catch (error) {
        throw error
      }
    }
}

export default DynamicBar
