import { DatavComponent, ComType } from "@/components/datav-component";
import {
  ApiConfigMap,
  ApiDataConfigMap,
  initApiConfig,
  initApiData
} from "@/components/data-source";
import { DataEventConfig } from "@/components/data-event";
import { getStaticData } from "@/api/data";
/**
 * dropDownList
 */
export class group extends DatavComponent {
  config = {
    borderStyle: {
      borderWidth: 0,
      borderColor: "rgba(255,255,255,0.8)",
      borderRadius: 5,
      borderStyle: "solid"
    },
    header: {
      show: false,
      draggable: false,
      closeButton: {
        show: true,
        color: "#fff",
        size: 20,
        top: 5,
        bottom: 5,
        left: 0,
        right: 0
      },
      title: "",
      height: 26,
      color: "#11C2EE",
      image: "",
      fontStyle: {
        fontSize: 30,
        fontColor: "white",
        fontStyle: "normal",
        fontWeight: "normal",
        fontFamily: "Times New Roman",
        textAlign: "left"
      }
    }
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;

  events: Record<string, DataEventConfig>;

  actions: Record<string, DataEventConfig>;

  constructor() {
    super("Group", { w: 300, h: 56 }, ComType.layer);

    this.initData();
  }

  initData() {
    const fields = [];

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields)
    });

    this.apiData = initApiData(this.id);

    this.events = {};
    this.actions = {};
    this.subComs = [];

    return this;
  }

  async loadData() {
    try {
      const path = "group/group";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
      console.log(res);
    } catch (error) {
      throw error;
    }
  }
}

export default group;
