import { DatavComponent } from "@/components/datav-component";
import { ApiConfigMap, ApiDataConfigMap } from "@/components/data-source";
import { DataEventConfig } from "@/components/data-event";

/**
 * SvgReservoir
 */
export class SvgReservoir extends DatavComponent {
  config = {
    maxValue: 100,
    currentValue: 66,
    text: {
      enable: true,
      fontSize: 30,
      color: '#000',
      fontWeight: 'normal',
    },
    shape: "rect", //shape = 'rect' | 'roundRect' | 'round'  | 'custom'
    wave: {
      waveNum: 1,
      waveHeight: 10, //Water wave height (px)
      waveOpacity: 1, //Wave opacity
      waveColor: {
        type: "solid",
        value: "#008DD0",
        from: "#008DD0",
        to: "#6ACFFF"
      },
      animate: {
        enable: true,
        dur: 1.5 //单位秒
      },
      maxWidth: 100,
      maxHeight: 100,
      top: 0,
      left: 0
    },
    bgColor: {
      type: "solid",
      value: "#fff",
      from: "#fff",
      to: "#6ACFFF"
    }, //Colors (hex|rgb|rgba|color keywords)
    imgStyle: {
      backgroundImage: "data/originPic/main-img.png",
      repeat: "no-repeat",
      radius: 1
    },
    border: {
      width: 10,
      color: "#E8E8E8FF"
    },
    formatter: "%"
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;
  events: Record<string, DataEventConfig>;
  actions: Record<string, DataEventConfig>;

  constructor() {
    super("SvgReservoir", { w: 200, h: 200 });

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

export default SvgReservoir;
