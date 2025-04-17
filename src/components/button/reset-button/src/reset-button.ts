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
 * ResetButton
 */
export class ResetButton extends DatavComponent {
  config = {
    state: "up",
    up: {
      image: "data/originPic/main-img.png"
    },
    down: {
      image: "data/originPic/main-img.png"
    },
    cursor: "pointer"
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;
  events: Record<string, DataEventConfig>;
  actions: Record<string, DataEventConfig>;

  constructor() {
    super("ResetButton", { w: 120, h: 60 });
    this.initData();
  }

  initData() {
    const fields = [createField("state", { description: "", optional: true })];

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
      const path = "button/reset-button";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
    } catch (error) {
      throw error;
    }
  }
}

export default ResetButton;
