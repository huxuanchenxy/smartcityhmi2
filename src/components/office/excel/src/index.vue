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

    const formRef = ref<FormInst | null>(null);
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter;

    // 监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case "open":
          props.com.hided = false;
          break;
        case "close":
          props.com.hided = true;
          break;
      }
    });

    const config = toRef(props.com, "config");
    const attr = toRef(props.com, "attr");





    // 其他原有计算属性...

    return {
      formRef,
      ctEnum: controlType,
    };
  },
});
</script>

<style>
.datav-wrapper {
  position: relative;
}

</style>