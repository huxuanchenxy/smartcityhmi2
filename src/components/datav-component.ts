import { findComByName } from "@/data/system-components";
import { generateId } from "@/utils/util";
import { DataEventConfig } from "./data-event";
import { HandleItemConfig, IcHandleItemConfig } from "./data-handle";
import { ApiConfigMap, ApiDataConfigMap } from "./data-source";
import { getInitHandleConfig, getInitIcHandleConfig } from "./event-setting";

export enum ComType {
  com = "com",
  subCom = "subCom",
  layer = "layer"
}

export interface ComponentAttr {
  x: number;
  y: number;
  w: number;
  h: number;
  deg: number;
  opacity: number;
  filpV: boolean;
  filpH: boolean;
}

export abstract class DatavComponent {
  id: string;
  readonly name: string;
  readonly type: ComType;

  alias: string;
  icon: string;
  img: string;
  filePath: string;
  locked = false;
  hided = false;

  eventhub = false;

  //editing = true
  // 以下几个状态可以不进行持久化，为了操作方便在此声明
  selected = false;
  hovered = false;
  renameing = false;
  //特效
  special = "";

  attr: ComponentAttr = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    deg: 0,
    opacity: 1,
    filpV: false,
    filpH: false
  };

  projectId = 0;
  parentId?: string;
  // children: DatavComponent[] | null = null

  abstract config: Record<string, any>;

  abstract apis: Partial<ApiConfigMap>;
  abstract apiData: Partial<ApiDataConfigMap>;

  /**
   * 事件
   */
  abstract events: Record<string, DataEventConfig>;

  /**
   * 动作
   */
  abstract actions: Record<string, DataEventConfig>;

  handles: Record<string, HandleItemConfig>;

  ichandles: Record<string, IcHandleItemConfig>;

  subComs?: Array<string>;

  constructor(name: string, attr: Partial<ComponentAttr>, type = ComType.com) {
    this.id = generateId(name);
    this.name = `V${name}`;
    this.type = type;

    const obj = findComByName(this.name)!;
    this.alias = obj.com.alias;
    this.icon = obj.category.icon;
    this.img = obj.com.thum;
    this.filePath = obj.com.filePath;
    this.attr = { ...this.attr, ...attr };
    this.handles = getInitHandleConfig(this.name);

    this.ichandles = getInitIcHandleConfig(this.name);
  }

  /**
   * 初始化数据
   */
  abstract initData(): this;

  /**
   * 将静态数据和配置分离 减少 bundle size
   */
  abstract loadData(): Promise<void>;
}

export abstract class DatavChartSeries {
  readonly type: string;
  id: string;
  name: string;

  constructor(type: string, name: string) {
    this.type = type;
    this.id = generateId(name);
    this.name = name;
  }
}

export abstract class DatavFormItems {
  id: string;
  code: string;
  label: string;
  constructor(code: string, idx: number) {
    this.id = generateId(code);
    this.code = "item_" + idx;
    this.label = code;
  }
}

export abstract class DatavEChartsComponent extends DatavComponent {
  abstract config: Record<string, any> & {
    legend?: Record<string, any>;
    tooltip?: Record<string, any>;
    series: DatavChartSeries | DatavChartSeries[];
    animation: {
      enabled: boolean;
      duration?: number;
      easing?: string;
      delay?: number;
      threshold?: number;
      durationUpdate?: number;
      easingUpdate?: string;
      delayUpdate?: number;
    };
  };
}
