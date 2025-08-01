import { DataEventConfig } from "@/components/data-event";
import { ApiConfigMap, ApiDataConfigMap } from "@/components/data-source";
import { DatavComponent, DatavFormItems } from "@/components/datav-component";
import { CSSProperties } from "vue";

export class ExcelItems extends DatavFormItems {
  constructor(code: string, idx: number) {
    super(code, idx);
  }

  pt = {
    extension: {
      device: null,
      name: null
    }
  }; //对应点位

  control = {
    value: null,
    type: controlType.input, //组件类型
    required: false, //必填
    placeholder: "",
    inputOptions: {},
    radioOptions: {
      options: [
        { label: "选项一", value: "1" },
        { label: "选项二", value: "2" },
        { label: "选项三", value: "3" }
      ],
      labelKey: "label",
      valueKey: "value"
    },
    checkBoxOptions: {
      options: [
        { label: "选项一", value: 0 },
        { label: "选项二", value: 0 },
        { label: "选项三", value: 0 }
      ],
      labelKey: "label",
      valueKey: "value",
      checkedValue: 1,
      uncheckedValue: 0
    },
    selectOptions: {
      options: [
        { label: "选项一", value: "1", style: {} as CSSProperties },
        { label: "选项二", value: "2", style: {} as CSSProperties },
        { label: "选项三", value: "3", style: {} as CSSProperties }
      ],
      labelKey: "label",
      valueKey: "value"
    },
    numberOptions: {
      min: null,
      max: null,
      step: 1
    },
    dateOptions: {
      dateFormat: "yyyy-MM-dd"
    },
    timeOptions: {
      timeFormat: "HH:mm"
    }
  };
}

export enum controlType {
  input = "input",
  select = "select",
  checkbox = "checkbox",
  number = "number",
  date = "date",
  time = "time",
  radio = "radio"
}
/**
 *
 */
export class Excel extends DatavComponent {
  config = {
    labelWidth: 80,
    titleConfig: {
      title: "自定义组件",
      titleStyle: {
        paddingTop: 0,
        paddingLeft: 20,
        fontSize: 20,
        background: `rgba(0, 84, 151, 1)`,
        color: `rgba(255, 255, 235, 1)`,
        fontWeight: "normal",
        height: 30,
        width: 100,
        show: true
      }
    },
    iconConfig: {
      buttonHeight: 30,
      buttonWidth: 50,
      iconColor: "#ffffff",
      closeBackgroundColor: `rgba(255, 0, 0, 1)`,
      closeIcon: "images/close-o.svg"
    },
    textStyle: {
      fontFamily: "Microsoft Yahei",
      fontSize: 20,
      color: "#000",
      fontWeight: "normal"
    },
    background: {
      show: true,
      bgColor: "#fff",
      borderRadius: 10,
      borderColor: "#000",
      borderStyle: "solid",
      borderWidth: 1
    },
    buttonOptions: {
      showSubmit: true,
      submitButtonType: "primary",
      submitButtonText: "提交",
      showCancel: true,
      cancleButtonType: "default",
      cancleButtonText: "取消"
    },
    items: [new ExcelItems("组件", 1)],
    data:[
  {
    name: "Sheet1",
    rows: {
      0: { cells: { 0: { text: "A1" }, 1: { text: "B1" } } },
      1: { cells: { 0: { text: "A2" }, 1: { text: "B2" } } },
    },
  },
],
  };

  apis: Partial<ApiConfigMap>;
  apiData: Partial<ApiDataConfigMap>;

  events: Record<string, DataEventConfig>;

  actions: Record<string, DataEventConfig>;

  constructor() {
    super("Excel", { w: 1200, h: 800 });
    this.initData();
  }

  initData() {
    this.apis = {};
    this.apiData = {};
    this.events = {};
    this.actions = {};
    return this;
  }

  async loadData() {}
}

export default Excel;
