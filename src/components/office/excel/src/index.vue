<template>
  <div class="datav-wrapper">
    <div>
      <n-button
        text
        type="normal"
        style="overflow: hidden"
      >
      office excel
      </n-button>

    </div>

  </div>
</template>

<script lang='ts'>
import { HandleItemField } from "@/components/data-handle";
import { useDataCenter } from "@/mixins/data-center";
import { useEventCenter } from "@/mixins/event-center";
import type { FormInst } from "naive-ui";
import type { CSSProperties } from "vue";
import {
  PropType,
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
  toRef,
} from "vue";
import { Excel, controlType } from "./excel";
import { watch } from 'vue'; 
import { DatavComponent } from '@/components/datav-component'

export default defineComponent({
  name: "VExcel",
  props: {
    com: {
      type: Object as PropType<Excel>,
      required: true,
    },
  },
  setup(props) {
    console.log("SETUP:::", props.com.config);
    useDataCenter(props.com);
    useEventCenter(props.com);
    //let filePath = ref(props.com.filePath);
    // console.log("props.com：：：", props.com);

    const formRef = ref<FormInst | null>(null);
    const mitter =
      getCurrentInstance()?.appContext.config.globalProperties.mitter;

    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case "open":
          props.com.hided = false;
          // initData();
          break;
        case "close":
          props.com.hided = true;
          break;
      }
    });

    const config = toRef(props.com, "config");
    const attr = toRef(props.com, "attr");

    onMounted(() => {
    });

    const wrapperStyle = computed(() => {
      const style = {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        "font-family": `${config.value.textStyle.fontFamily}, Arial, sans-serif`,
        "font-size": `${config.value.textStyle.fontSize}px`,
        "font-weight": config.value.textStyle.fontWeight,
        "background-color": "initial",
        border: "none",
        "border-radius": "0px",
        transform: "translateZ(0px)",
        "text-overflow": "ellipsis",
        "white-space": "nowrap",
        overflow: "hidden",
      };

      if (config.value.background.show) {
        const bgs = config.value.background;
        style["background-color"] = bgs.bgColor;
        style.border = `${bgs.borderWidth}px ${bgs.borderStyle} ${bgs.borderColor}`;
        style["border-radius"] = `${bgs.borderRadius}px`;
      }

      return style as CSSProperties;
    });

    const iframeStyle = computed(() => {
      const ts = config.value.titleConfig.titleStyle;
      let iframeHeight = attr.value.h - ts.height;
      const style = {
        width: `${attr.value.w}px`,
        height: `${iframeHeight}px`,
      };
      return style as CSSProperties;
    });
    const wordStyle = computed(() => {
      const style = {
        //'--n-blank-height': (config.value.textStyle.fontSize + 14) + 'px',
        //'--n-label-height': (config.value.textStyle.fontSize + 6) + 'px',
        //'--n-height': (config.value.textStyle.fontSize + 14) + 'px',
        "--n-label-text-color": config.value.textStyle.color,
        "--n-text-color": config.value.textStyle.color,
        "--n-label-font-size": `${config.value.textStyle.fontSize}px`,
        "--n-font-size": `${config.value.textStyle.fontSize}px`,
      };
      return style as CSSProperties;
    });

    const titleStyle = computed(() => {
      const ts = config.value.titleConfig.titleStyle;
      const style = {
        background: ts.background,
        color: ts.color,
        fontSize: `${ts.fontSize}px`,
        fontWeight: ts.fontWeight,
        height: `${ts.height}px`,
        width: `${ts.width}%`,
        display: ts.show ? "inline-block" : "none",
      };
      return style as CSSProperties;
    });

    const titleContentStyle = computed(() => {
      const ts = config.value.titleConfig.titleStyle;
      const style = {
        paddingTop: `${ts.paddingTop}px`,
        paddingLeft: `${ts.paddingLeft}px`,
        display: "inline-block",
      };
      return style as CSSProperties;
    });

    const ButtonStyle = computed(() => {
      const bs = config.value.iconConfig;
      const style = {
        paddingTop: "-10px",
        float: `right`,
        height: `${bs.buttonHeight}px`,
        width: `${bs.buttonWidth}px`,
      };
      return style as CSSProperties;
    });



    return {
      wrapperStyle,
      wordStyle,
      formRef,
      ctEnum: controlType,
      titleStyle,
      titleContentStyle,
      ButtonStyle,
      iframeStyle,
    };
  },
});
</script>