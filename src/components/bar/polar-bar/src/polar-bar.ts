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
import { getChartColorTable } from '@/components/chart-color-table'

export class PolarBarSeries extends DatavChartSeries {
  constructor(name: string) {
    super("bar", name);
  }

  color = {
    type: "solid",
    value: "#00baff",
    from: "#537FA9",
    middle:"#74C3CE",
    to: "#589899"
  };
}

export class colorItem
{
  constructor(_value: string) {
    this.value=_value
  }
  value = '#fff'
}


/**
 * PolarBar
 */
export class PolarBar extends DatavEChartsComponent {
  config = {
    global: {
      fontFamily: "Microsoft Yahei",
      polarInsideRadius:30,
      polarOutsideRadius:90,
      background: {
        show: true,
        color: "rgba(255, 255, 255, 0.1)"
      },
      diffrentColor:true,
      colorList:getChartColorTable().map(r=>new colorItem(r)),
    },
    label: {
      show: false,
      position: "top",
      textStyle: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.6)",
        fontWeight: "normal"
      },
      offsetX: 0,
      offsetY: 0
    },

    radiusAxis: {
      show: true,
      type: "category",
      title: {
        show: false,
        name: "径向轴",
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
        show: true,
        line: {
          type: "dashed",
          width: 1,
          color: "rgba(233, 228, 228, 0.1)",
          dashedLength: 4,
          dashedSpace: 4
        }
      }
    },
    angleAxis: {
      show: true,
      extent: {
        min: 'auto',
        max: 'auto',
      },
      startAngle: 0,
      clockwise: true,
      splitNumber: 0,
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
        show: false,
        valueFormat: "auto",
        boundaryGap: 0,
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
        show: true,
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
      show: true,
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
      show: false,
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
    series: [new PolarBarSeries("系列1")],
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
    super("PolarBar", { w: 300, h: 300 });

    this.initData();
  }

  initData() {
    const fields = [
      createField("x", { description: "类目" }),
      createField("y", { description: "值" }),
    ];

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: "极坐标柱状图接口"
    });

    this.apiData = initApiData(this.id);

    this.events = {
      click: {
        description: "当点击数据项时",
        fields: Object.assign({}, ...fields)
      }
    };

    this.actions = {};
    return this;
  }

  async loadData() {
    try {
      const path = "bar/polar-bar";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
    } catch (error) {
      throw error;
    }
  }
}

export default PolarBar;
