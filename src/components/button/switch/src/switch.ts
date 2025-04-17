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
 * Switch
 */
export class Switch extends DatavComponent {
  config = {
    disabled: false,
    loading: false,
    size: "large", //'' | 'large' | 'medium' | 'small',
    scale: 1,
    checkedColor: "#409eff", //当在 on 状态时的背景颜色
    uncheckedColor: "#dcdfe6", //off 状态时的背景颜色

    checkedText: {
      //switch 打开时的文字描述
      content: "开",
      textStyle: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "normal"
      }
    },
    uncheckedText: {
      //switch 的状态为 off 时的文字描述
      content: "关",
      textStyle: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "normal"
      }
    },
    cursor: "pointer"
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;

  events: Record<string, DataEventConfig>;

  actions: Record<string, DataEventConfig>;

  constructor() {
    super("Switch", { w: 120, h: 60 });

    this.initData();
  }

  initData() {
    const fields = [
      createField("value", { description: "当前值" })
      // createField('on', { description: '开启值' }),
      // createField('off', { description: '关闭值' }),
    ];

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: "开关接口"
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
      const path = "button/switch";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
    } catch (error) {
      throw error;
    }
  }
}

export default Switch;
