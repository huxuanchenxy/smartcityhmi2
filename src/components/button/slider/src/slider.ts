import { DatavComponent } from "@/components/datav-component";
import {
  ApiConfigMap,
  ApiDataConfigMap,
  initApiConfig,
  initApiData
} from "@/components/data-source";
import { createField } from "@/components/data-field";
import { DataEventConfig } from "@/components/data-event";
import { getStaticData } from "@/api/data";

/**
 * Slider
 */
export class Slider extends DatavComponent {
  config = {
    button: {
      url: "/public/images/sliderbutton.png",
      width: 30,
      height: 30
    },
    max: 100,
    min: 0,
    defaultValue: 0,
    disabled: false,
    reverse: false,
    step: 1,
    vertical: false,
    tooltip: false,
    placement: "top-start",
    cursor: "pointer",
    debounceTime:200
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;

  events: Record<string, DataEventConfig>;

  actions: Record<string, DataEventConfig>;

  constructor() {
    super("Slider", { w: 120, h: 60 });

    this.initData();
  }

  initData() {
    const fields = [createField("value", { description: "", optional: true })];

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields)
    });

    this.apiData = initApiData(this.id);

    this.events = {};
    this.actions = {};

    return this;
  }

  async loadData() {
    try {
      // 组件静态数据来源，当前项目统一管理目录：data/*
      // 如：data/demo/data.json 简写为 => demo/data
      const path = "button/slider";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
    } catch (error) {
      throw error;
    }
  }
}

export default Slider;
