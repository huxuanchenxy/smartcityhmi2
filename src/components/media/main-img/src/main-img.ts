import { DatavComponent } from "@/components/datav-component";
import { ApiConfigMap, ApiDataConfigMap } from "@/components/data-source";
import { DataEventConfig } from "@/components/data-event";
import { getStaticData } from "@/api/data";

/**
 * MainImg
 */
export class MainImg extends DatavComponent {
  config = {
    show: true,
    imageType: "bitmap",
    backgroundImage: "data/originPic/main-img.png",
    vectorImage: "data/originPic/datav-vue-logo.svg",
    vectorFill: "#38ae70",
    repeat: "no-repeat",
    radius: 1,
    urlConfig: {
      url: "",
      ifBlank: false
    },
    animation: {
      enable: false,
      name: "Updown",
      duration: 1000,
      timing: "linear",
      delay: 0,
      iteration: "infinite",
      direction: "alternate",
      state:"running"
    },
    cursor: true
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;

  events: Record<string, DataEventConfig>;

  actions: Record<string, DataEventConfig>;

  constructor() {
    super("MainImg", { w: 300, h: 180 });

    this.initData();
  }

  initData() {
    this.apis = {};
    this.apiData = {};
    this.events = {};
    this.actions = {};

    return this;
  }

  async loadData() {
    try {
      // 组件静态数据来源，当前项目统一管理目录：data/*
      // 如：data/demo/data.json 简写为 => demo/data
      const path = "";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
    } catch (error) {
      throw error;
    }
  }
}

export default MainImg;
