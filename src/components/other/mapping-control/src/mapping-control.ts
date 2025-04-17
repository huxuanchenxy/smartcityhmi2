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

export class MappingControl extends DatavComponent {
  config = {
    idFilterEnable:true,
    idFilter:"name",
    valueFilterEnable:true,
    valueFilter:"value",
    testModel:"[{'name':'XX','value':'123'}]"
  };
  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;
  events: Record<string, DataEventConfig>;
  actions: Record<string, DataEventConfig>;

  constructor() {
    super("MappingControl", { w: 200, h: 50 });
    this.initData();
  }

  initData() {
    const fields = [createField("value", { description: "传输数据", optional: true })];

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
      const path = 'other/mapping-control'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default MappingControl;
