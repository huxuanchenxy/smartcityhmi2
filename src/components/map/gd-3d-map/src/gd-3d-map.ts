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
 * Iframe
 */
export class Gd3dMap extends DatavComponent {
  config = {
    key: "",
    center: {
      lng: 121.521699,
      lat: 31.295163
    },
    zooms: {
      min: 2,
      max: 20
    },
    wallColor: "rgba(0, 211, 252,0.3)",
    roofColor: "rgba(0, 178, 213,0.2)",
    features: ["bg", "road", "building", "point"],
    showRoad: true,
    showPoint: true,
    showPark: false,
    polygonSetting: {
      fillColor: "#ccebc5",
      strokeOpacity: 1,
      fillOpacity: 0.5,
      strokeColor: "#2b8cbe",
      strokeWeight: 1,
      strokeStyle: "solid"
    },
    zoom: 13.4,
    viewMode: "3D",
    rotateEnable: false,
    theme: "grey",
    trafficLayer: false,
    geoLayer: false,
    areaLayer: {
      district: "杨浦区",
      enable: false,
      hideOther: {
        enable: true,
        color: "rgba(14,42,66,1)"
      },
      border: {
        show: true,
        color: "rgba(0, 174, 255, 0.72)",
        width: 3
      }
    },
    pointConfigs: [
      {
        name: "",
        apiUrl: "",
        iconUrl: "",
        iconWidth: 0,
        iconHeight: 0,
        dataJson: ""
      }
    ],
    polylineConfigs: [
      {
        name: "",
        apiUrl: "",
        isOutline: true,
        outlineColor: "#3366FF",
        borderWeight: 1,
        strokeColor: "#3366FF",
        strokeOpacity: 1,
        strokeWeight: 3,
        strokeStyle: "solid",
        dataJson: ""
      }
    ],
    textConfigs: [
      {
        text: "纯文本标记",
        anchor: "center",
        draggable: false,
        cursor: "default",
        angle: 0,
        textStyle: {
          width: "20px",
          fontFamily: "Microsoft Yahei",
          fontSize: 14,
          color: "#fff",
          fontWeight: "normal"
        },
        position: {
          lng: 121.521699,
          lat: 31.295163
        }
      }
    ]
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;
  events: Record<string, DataEventConfig>;
  actions: Record<string, DataEventConfig>;

  constructor() {
    super("Gd3dMap", { w: 800, h: 600 });
    this.initData();
  }

  initData() {
    const fields = [createField("url", { description: "地图地址", optional: true })];
    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: "iframe接口"
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
      const path = "map/gd-3d-map";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
    } catch (error) {
      throw error;
    }
  }
}

export default Gd3dMap;
