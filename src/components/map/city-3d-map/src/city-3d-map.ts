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
export class City3dMap extends DatavComponent {
  config = {
    url: "http://map.3dgis.gis/YPGisShare/page/mapB.html",
    dialogWidth: 800,
    dialogHeight: 600,
    dialogHeaderBackgroundColor: "#11C2EE",
    dialogHeaderBackgroundImgUrl: null,
    dialogHeaderHeight: 30,
    dialogHeaderFrontSize: 16,
    zoomIn: 4,
    timeoutVal: 6000,
    pointConfigs: [
      {
        name: "",
        type: "",
        apiUrl: "",
        iconUrl: "",
        iconWidth: 0,
        iconHeight: 0,
        dataJson: ""
      }
    ],
    camera: {
      is3D: true,
      isAnimation: 0,
      pointX: 5840,
      pointY: 1410,
      pointZ: 200,
      headingValue: 350,
      tiltValue: 76,
      scaleValue: 1400
    }
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;
  events: Record<string, DataEventConfig>;
  actions: Record<string, DataEventConfig>;

  constructor() {
    super("City3dMap", { w: 800, h: 600 });
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
      const path = "map/city-3d-map";
      const res = await getStaticData(this.id, path);
      this.apiData.source.config.data = JSON.stringify(res.data);
    } catch (error) {
      throw error;
    }
  }
}

export default City3dMap;
