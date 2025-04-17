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
 * FlexTextBox
 */
export class FlexTextBox extends DatavComponent {
  config = {
    flex: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      alignContent: "flex-start"
    },
    flexItem: {
      width: 100,
      height: 50,
      padding: "5px",
      margin: "0px",
    },
    textStyle: {
      fontFamily: "Microsoft Yahei",
      fontSize: 24,
      color: "#fff",
      fontWeight: "normal",
      textAlign: "center",
      writingMode: "horizontal-tb",
      letterSpacing: 0,
      ellipsis: false
    },
    itemBackgroundStyle: {
      show: false,
      bgColor: "#008bff",
      borderRadius: 15,
      borderColor: "#fff",
      borderStyle: "solid",
      borderWidth: 1
    },
    selectedStyle: {
      fontFamily: "Microsoft Yahei",
      fontSize: 24,
      color: "#fff",
      fontWeight: "normal",
      textAlign: "center",
      writingMode: "horizontal-tb",
      letterSpacing: 0,
      ellipsis: false,
      show: false,
      bgColor: "#008bff",
      borderRadius: 15,
      borderColor: "#fff",
      borderStyle: "solid",
      borderWidth: 1
    },
    iconStyle: {
      show: false,
      width: 20,
      height: 20,
      repeat: "no-repeat"
    },
    backgroundStyle: {
      show: false,
      bgColor: "#008bff",
      borderRadius: 15,
      borderColor: "#fff",
      borderStyle: "solid",
      borderWidth: 1
    },
    urlConfig: {
      show: false,
      isLocationHref: false,
      isBlank: false
    },
    multiSelected:false,
    cursor: 'pointer'
  };
  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;
  events: Record<string, DataEventConfig>;
  actions: Record<string, DataEventConfig>;

  constructor() {
    super("FlexTextBox", { w: 500, h: 300 });

    this.initData();
  }

  initData() {
    const fields = [
      createField("icon", { description: "图标", optional: true }),
      createField("text", { description: "文字描述", optional: true }),
      createField("value", { description: "数值", optional: true }),
      createField("url", { description: "超链接", optional: true })
    ];

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
      const path = "text/flex-text-box";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
    } catch (error) {
      throw error;
    }
  }
}

export default FlexTextBox;
