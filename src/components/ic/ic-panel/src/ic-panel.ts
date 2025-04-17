import { DatavComponent } from "@/components/datav-component";
import { ApiConfigMap, ApiDataConfigMap } from "@/components/data-source";

import { DataEventConfig } from "@/components/data-event";
import { PtEventModel } from "@/components/data-handle";

/**
 * Iframe
 */
export class IcPanel extends DatavComponent {
  config: { ptList: PtEventModel[] } = {
    ptList: [] //点位事件关联模型
  };

  apis: Partial<ApiConfigMap>;

  apiData: Partial<ApiDataConfigMap>;

  events: Record<string, DataEventConfig>;

  actions: Record<string, DataEventConfig>;

  constructor() {
    super("IcPanel", { w: 200, h: 50 });

    this.initData();
  }

  initData() {
    //this.id = "IcPanel"; //只能放一个该控件
    this.apis = {};
    this.apiData = {};
    this.events = {};
    this.actions = {};
    return this;
  }

  async loadData() {}
}

export default IcPanel;
