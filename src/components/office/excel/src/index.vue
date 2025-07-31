<template>
  <div class="datav-wrapper">
    <div>
      <n-button
        text
        type="normal"
        style="overflow: hidden"
        @click="initExcel"
      >
        office excel
      </n-button>
    </div>
    <!-- Excel 容器 -->
    <div ref="excelContainer" class="excel-container"></div>
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

// ✅ 引入 x-data-spreadsheet
import Spreadsheet from "x-data-spreadsheet";
import "x-data-spreadsheet/dist/xspreadsheet.css";

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
    const excelContainer = ref<HTMLDivElement | null>(null);
    const spreadsheet = ref<any>(null);

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

    // 初始化 Excel
    const initExcel = () => {
      if (excelContainer.value && !spreadsheet.value) {
        spreadsheet.value = new Spreadsheet(excelContainer.value, {
          mode: "edit",
          showToolbar: true,
          showGrid: true,
          view: {
            height: () => 800,
            width: () => 1200,
          },
        }).loadData([
          {
            name: "Sheet1",
            rows: {
              0: { cells: { 0: { text: "Hello" }, 1: { text: "Excel" } } },
              1: { cells: { 0: { text: "Vue3" }, 1: { text: "x-data-spreadsheet" } } },
            },
          },
        ]);
      }
    };

    onMounted(() => {
      initExcel(); // 默认加载
    });

    return {
      formRef,
      ctEnum: controlType,
      excelContainer,
      initExcel,
    };
  },
});
</script>

<style>
.datav-wrapper {
  position: relative;
}

.excel-container {
  margin-top: 10px;
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
}
</style>
