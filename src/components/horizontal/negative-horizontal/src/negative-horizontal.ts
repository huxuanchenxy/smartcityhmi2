import { DatavEChartsComponent, DatavChartSeries } from "@/components/datav-component";
import {
  ApiConfigMap,
  ApiDataConfigMap,
  initApiConfig,
  initApiData
} from "@/components/data-source";
import { createField } from "@/components/data-field";
import { DataEventConfig } from "@/components/data-event";
import { getStaticData } from "@/api/data";
import shapeTriangleVue from "@/icons/shape-triangle.vue";

export class NegativeHorizontalSeries extends DatavChartSeries {
  constructor(name: string) {
    super("bar", name);
  }

  color = {
    type: "solid",
    value: "#00baff",
    from: "#fff",
    to: "#000"
  };

  label= {
    show: true,
    position: "right",
    textStyle: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: "normal",
    },
    offsetX: 0,
    offsetY: 0
  };
}

/**
 * NegativeHorizontal
 */
export class NegativeHorizontal extends DatavEChartsComponent {
  config = {
    global: {
      fontFamily: "Microsoft Yahei",
      margin: {
        top: 40,
        bottom: 50,
        left: 50,
        right: 10
      },
      innerPadding: 20,
      outerPadding: 50,
      barWidth: "auto",
      background: {
        show: false,
        color: "rgba(255, 255, 255, 0.1)"
      }
    },
    xAxis: {
      show: false,
      type: "value",
      title: {
        show: false,
        name: "X轴",
        location: "center",
        display: {
          rotate: 0,
          offset: 20
        },
        textStyle: {
          fontSize: 12,
          color: "#90a0ae",
          fontWeight: "normal"
        }
      },
      axisLine: {
        show: true,
        type: "solid",
        width: 1,
        color: "rgba(255, 255, 255, 0.5)"
      },
      axisTick: {
        show: false,
        type: "solid",
        width: 1,
        color: "rgba(255, 255, 255, 0.5)"
      },
      axisLabel: {
        show: false,
        timeFormat: "MM/DD",
        boundaryGap: true,
        interval: "auto",
        display: {
          rotate: 0,
          margin: 10
        },
        align: "center",
        textStyle: {
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.6)",
          fontWeight: "normal"
        }
      },
      grid: {
        show: false,
        line: {
          type: "dashed",
          width: 1,
          color: "rgba(233, 228, 228, 0.1)",
          dashedLength: 4,
          dashedSpace: 4
        }
      }
    },
    yAxis: {
      show: true,
      type: "category",
      extent: {
        min: "auto",
        max: "auto"
      },
      splitNumber: 0,
      title: {
        show: false,
        name: "Y轴",
        location: "center",
        display: {
          rotate: 90,
          offset: 20
        },
        textStyle: {
          fontSize: 12,
          color: "#90a0ae",
          fontWeight: "normal"
        }
      },
      axisLine: {
        show: false,
        type: "solid",
        width: 1,
        color: "rgba(255, 255, 255, 0.5)"
      },
      axisTick: {
        show: false,
        type: "solid",
        width: 1,
        color: "rgba(255, 255, 255, 0.5)"
      },
      axisLabel: {
        show: shapeTriangleVue,
        valueFormat: "auto",
        boundaryGap: 0,
        display: {
          rotate: 0,
          margin: 10
        },
        align: "center",
        textStyle: {
          fontSize: 16,
          color: "rgba(255, 255, 255, 0.8)",
          fontWeight: "normal"
        }
      },
      grid: {
        show: false,
        line: {
          type: "dashed",
          width: 1,
          color: "rgba(233, 228, 228, 0.1)",
          dashedLength: 4,
          dashedSpace: 4
        }
      }
    },
    tooltip: {
      show: false,
      textStyle: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "normal"
      },
      background: {
        padding: {
          h: 5,
          v: 5
        },
        color: "rgba(0, 0, 0, 0.65)"
      },
      pointer: {
        show: true,
        line: {
          type: "dashed",
          width: 1,
          color: "#f5dc69",
          dashedLength: 4,
          dashedSpace: 4
        }
      }
    },
    legend: {
      show: true,
      position: "top-center",
      orient: "horizontal",
      textStyle: {
        fontSize: 12,
        color: "#90a0ae",
        fontWeight: "normal"
      },
      symbol: {
        show: true,
        icon: "auto",
        width: 25,
        height: 14,
        gap: 10
      },
      page: {
        enabled: false,
        size: {
          width: 100,
          height: 100
        },
        button: {
          size: 15,
          color: "#000",
          inactiveColor: "#000"
        },
        pageNumColor: "#90a0ae"
      }
    },
    series: [new NegativeHorizontalSeries('')],
    animation: {
      enabled: true,
      duration: 1000,
      easing: "cubicOut",
      delay: 0
    }
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;

  events: Record<string, DataEventConfig>;

  actions: Record<string, DataEventConfig>;

  constructor() {
    super("NegativeHorizontal", { w: 500, h: 300 });

    this.initData();
  }

  initData() {
    const fields = [
      createField("x", { description: "类目" }),
      createField("y", { description: "值" }),
      createField('s', { description: '系列' }),
    ];

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: "正负条形图接口"
    });

    this.apiData = initApiData(this.id);

    this.events = {
      click: {
        description: "当点击数据项时",
        fields: Object.assign({}, ...fields)
      }
    };

    this.actions = {};

    const series2 = new NegativeHorizontalSeries('')
    series2.color.value = '#34FFF5';
    series2.label.position='left';
    this.config.series.push(series2)

    return this;
  }

  async loadData() {
    try {
      const path = "horizontal/negative-horizontal";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
    } catch (error) {
      throw error;
    }
  }
}

export default NegativeHorizontal;
