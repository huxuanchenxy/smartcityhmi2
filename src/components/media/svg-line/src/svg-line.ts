import { DatavComponent } from "@/components/datav-component";
import { ApiConfigMap, ApiDataConfigMap } from "@/components/data-source";
import { DataEventConfig } from "@/components/data-event";

/**
 * SvgLine
 */
export class SvgLine extends DatavComponent {
  config = {
    pointVisiable: false,
    mode: "svg",
    type: "ConnectionLine",
    props: {
      stroke: "#34FFF5",
      strokeWidth: 5,
      pointPosition: [
        {
          x: 20,
          y: 100
        },
        {
          x: 200,
          y: 100
        }
      ]
    },
    animations: {
      type: "Electricity",
      dur: 20,
      repeatCount: {
        val: "indefinite",
        disabled: true
      },
      color: "#0a7ae2",
      reverse: false,
      rotate: false,
      enable: true
    },
    action: {
      state: "None",
      index: -1
    },
    imgStyle: {
      width: 300,
      height: 180,
      backgroundImage: "data/originPic/main-img.png",
      repeat: "no-repeat",
      radius: 1,
      hideLine: false
    }
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;
  events: Record<string, DataEventConfig>;
  actions: Record<string, DataEventConfig>;

  constructor() {
    super("SvgLine", { w: 200, h: 200 });

    this.initData();
  }

  initData() {
    this.apis = {};
    this.apiData = {};
    this.events = {};
    this.actions = {};
    return this;
  }

  async loadData() {}
}

export default SvgLine;
