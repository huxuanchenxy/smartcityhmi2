import { DatavComponent } from "@/components/datav-component";
import { ApiConfigMap, ApiDataConfigMap } from "@/components/data-source";
import { DataEventConfig } from "@/components/data-event";

/**
 * SvgBlower
 */
export class SvgBlower extends DatavComponent {
  config = {
    color1: {
      type: "solid",
      value: "#7191CA",
      from: "#7191CA",
      to: "#7191CA"
    },
    color2: {
      type: "solid",
      value: "#6C98B8",
      from: "#6C98B8",
      to: "#6C98B8"
    },
    color3: {
      type: "solid",
      value: "#3A566D",
      from: "#3A566D",
      to: "#3A566D"
    },
    color4: {
      type: "solid",
      value: "#A4E2FF",
      from: "#A4E2FF",
      to: "#A4E2FF"
    },
    color5: {
      type: "solid",
      value: "#FFFFFF",
      from: "#FFFFFF",
      to: "#FFFFFF"
    },
    color6: {
      type: "solid",
      value: "#3D3D3D",
      from: "#3D3D3D",
      to: "#3D3D3D"
    },
    fan: {
      direction: "clockwise",//顺时针 clockwise  逆时针 anticlockwise
      animate: {
        enable: true,
        dur: 1 //转速
      }
    }
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;
  events: Record<string, DataEventConfig>;
  actions: Record<string, DataEventConfig>;

  constructor() {
    super("SvgBlower", { w: 200, h: 200 });

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

export default SvgBlower;
