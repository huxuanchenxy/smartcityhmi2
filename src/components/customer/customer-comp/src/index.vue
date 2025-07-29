<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div :style="titleStyle">
      <span :style="titleContentStyle">{{ com.alias }}</span>
      <n-button
        text
        type="info"
        :style="ButtonStyle"
        style="overflow: hidden"
        @click="handleCancleClick"
      >
        <img
          :src="com.config.iconConfig.closeIcon"
          style="height: 20px"
          :style="{
            position: 'relative',
            left: '-80px',
            filter:
              'drop-shadow(' + com.config.iconConfig.iconColor + ' 80px 0)',
          }"
        />
      </n-button>

<div
      style="
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <n-button
        v-if="com.config.buttonOptions.showSubmit"
        :type="com.config.buttonOptions.submitButtonType"
        focusable="false"
        @click="handleValidateClick"
      >
        {{ com.config.buttonOptions.submitButtonText }}
      </n-button>
      <span style="color:black;">
      额外：
      {{ com.config.extendData }}
      </span>
      <n-button @click="checkEvents">把内容传出去</n-button>
    </div>
    <div>
      <button @click="sendToChild">发送给子iframe</button><span style="color: black;">来自子页面的消息:{{ sonMessage }}</span>
      <span style="color: black;">来外部组件的消息:{{ outMessage }}</span>
    </div>
    </div>
    <div :style="iframeStyle">
      <iframe 
        ref="iframeRef" 
        src="http://localhost:8800/#/sysconfig2/rule"  
        style="width: 100%; height: 100%"
      ></iframe>
      
    </div>

        
  </div>
</template>

<script lang='ts'>
import { readNode, writeNode } from "@/api/ic";
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
import { CustomerComp, controlType } from "./customer-comp";
import { watch } from 'vue'; 
import { DatavComponent } from '@/components/datav-component'

export default defineComponent({
  name: "VCustomerComp",
  props: {
    com: {
      type: Object as PropType<CustomerComp>,
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
          initData();
          break;
        case "close":
          props.com.hided = true;
          break;
      }
    });

    const config = toRef(props.com, "config");
    const attr = toRef(props.com, "attr");

    onMounted(() => {
      // console.log("onMounted……", props.com);
      initData();
    });

    const iframeRef = ref<HTMLIFrameElement | null>(null)
    const sonMessage = ref('无');
    const outMessage = ref('无');
    
    const sendToChild = () => {
      // if (!iframeRef.value?.contentWindow) {
      //   console.error('iframe未加载或contentWindow不可用');
      //   return;
      // }
      iframeRef.value.contentWindow.postMessage({
        type: 'PARENT_MESSAGE',
        data: { content: 'Hello from parent' }
      },'*');
    };

    // 监听子iframe发来的消息
    const handleMessage = (event: MessageEvent) => {
      // 安全检查
      // if (event.origin !== 'http://localhost:8800') return;
      
      console.log('收到子iframe消息:', event.data);
      sonMessage.value = event.data.data.content;
      // 处理消息逻辑...
    };

    onMounted(() => {
      window.addEventListener('message', handleMessage);
    });

    const initData = () => {
      let list = [];
      props.com.config.items.forEach((r) => {
        if (r.pt.extension && r.pt.extension.device && r.pt.extension.name) {
          list.push({
            device: r.pt.extension.device,
            name: r.pt.extension.name,
          });
        }
      });
      if (list.length > 0) {
        readNode(list).then((r) => {
          if (r.data.code == 200) {
            let result = r.data.data;
            if (result.length > 0) {
              result.forEach((item) => {
                props.com.config.items.forEach((formItem) => {
                  if (
                    formItem.pt.extension.device == item.device &&
                    formItem.pt.extension.name == item.name
                  ) {
                    formItem.control.value = item.value;
                  }
                });
              });
            }
          }
        });
      }
    };

    const strToNum = (str) => {
      const num = Number(str);
      if (isNaN(num)) {
        if (str && str.length > 0) {
          if (str == "true") {
            return true;
          } else if (str == "false") {
            return false;
          } else {
            return `'${str}'`;
          }
        } else {
          return null;
        }
      }
      return num;
    };

    const handleValidateClick = (e: MouseEvent) => {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          //逻辑代码
          let list = [];
          props.com.config.items.forEach((r) => {
            if (
              r.pt.extension &&
              r.pt.extension.name &&
              r.pt.extension.device
            ) {
              var cValue = strToNum(r.control.value);
              list.push({
                device: r.pt.extension.device,
                name: r.pt.extension.name,
                value: cValue,
              });
            }
          });
          writeNode(list, [], []).then((r) => {
            if (r.data.code == 200) {
              //提交按钮事件互动
              if (
                props.com.handles &&
                props.com.handles.submit &&
                props.com.handles.submit.fields &&
                props.com.handles.submit.fields.length > 0
              ) {
                props.com.handles.submit.fields.forEach((pmfield) => {
                  mitter.emit(pmfield.targetComId, pmfield);
                });
              }
            } else {
              console.log(r.msg);
            }
          });
        } else {
          console.log(errors);
        }
      });
    };

    const handleCancleClick = (e: MouseEvent) => {
      e.preventDefault();
      props.com.hided = true;
      //取消按钮事件互动
      if (
        props.com.handles &&
        props.com.handles.cancle &&
        props.com.handles.cancle.fields &&
        props.com.handles.cancle.fields.length > 0
      ) {
        props.com.handles.cancle.fields.forEach((pmfield) => {
          mitter.emit(pmfield.targetComId, pmfield);
        });
      }
    };

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

    watch(() => props.com.config.extendData, (newVal, oldVal) => {
      if (iframeRef.value?.contentWindow) {
        iframeRef.value.contentWindow.postMessage({
          type: 'PARENT_MESSAGE',
          data: { 
            content: 'Data changed',
            extendData: newVal 
          }
        }, '*');
      }
    }, { deep: true });


    const checkEvents = (value: any) => {
      console.log('checkEvents', value)
      console.log('props.com', props.com)
      if (value) {
        if (props.com.handles
          && props.com.handles.customclick
          && props.com.handles.customclick.fields
          && props.com.handles.customclick.fields.length > 0) {
          props.com.handles.customclick.fields.forEach(field => {
            field.value = '来自自定义组件的值';
            mitter.emit(field.targetComId, field)
          })
        }
      }
      
    }

    return {
      wrapperStyle,
      wordStyle,
      handleValidateClick,
      handleCancleClick,
      formRef,
      ctEnum: controlType,
      titleStyle,
      titleContentStyle,
      ButtonStyle,
      iframeStyle,
      sendToChild,
      iframeRef,
      sonMessage,
      outMessage,
      checkEvents,
    };
  },
});
</script>