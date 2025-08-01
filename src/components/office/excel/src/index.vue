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
import {ApiModule} from '@/store/modules/api'
import { getStaticData } from '@/api/data'

export default defineComponent({
  name: "VExcel",
  props: {
    com: {
      type: Object as PropType<Excel>,
      required: true,
    },
  },
  setup(props) {
    console.log("SETUP:::",props.com.id, props.com);

    console.log("SETUP  source:::",props.com.apiData.source.config.data);
    // useDataCenter(props.com);
    const { datavEmit } = useDataCenter(props.com)
    useEventCenter(props.com);

    const formRef = ref<FormInst | null>(null);
    const excelContainer = ref<HTMLDivElement | null>(null);
    const spreadsheet = ref<any>(null);

    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter;

    // 监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      console.log("监听到自定义事件", field);
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
    // const initExcel = () => {
    //   if (excelContainer.value && !spreadsheet.value) {
    //     spreadsheet.value = new Spreadsheet(excelContainer.value, {
    //       mode: "edit",
    //       showToolbar: true,
    //       showGrid: true,
    //       view: {
    //         height: () => 800,
    //         width: () => 1200,
    //       },
    //     }).loadData([
    //       {
    //         name: "Sheet1",
    //         rows: {
    //           0: { cells: { 0: { text: "Hello" }, 1: { text: "Excel" } } },
    //           1: { cells: { 0: { text: "Vue3" }, 1: { text: "x-data-spreadsheet" } } },
    //         },
    //       },
    //     ]);
    //   }
    // };

    const initExcel = () => {
    // console.log('ApiModule.dataMap[props.com.id]?.source',ApiModule.dataMap[props.com.id])
    if (excelContainer.value && !spreadsheet.value) {
        spreadsheet.value = new Spreadsheet(excelContainer.value, {
          mode: "edit",
          showToolbar: true,
          showGrid: true,
          view: {
            height: () => 800,
            width: () => 1200,
          },
        }).loadData(config.value.data || []); // 动态加载配置中的数据
      }
    };

    watch(
      () => props.com.apiData.source.config.data, // 监听数据变化
      (newData) => {
        
        if (spreadsheet.value) {
          console.log("监听数据变化", newData);
//            var newd = [{
// 	"name": "Sheet1",
// 	"rows": {
// 		"0": {
// 			"cells": {
// 				"0": {
// 					"text": "Axxx"
// 				},
// 				"1": {
// 					"text": "B111"
// 				}
// 			}
// 		},
// 		"1": {
// 			"cells": {
// 				"0": {
// 					"text": "A222"
// 				},
// 				"1": {
// 					"text": "B222"
// 				}
// 			}
// 		}
// 	}
// }]

        var newd = JSON.parse(newData);
          // spreadsheet.value.loadData(newData || []);
          spreadsheet.value.loadData(newd || []);
        }
      },
      { deep: true }
    );

    const updateExcelData = (data: any[]) => {
      if (spreadsheet.value) {
        spreadsheet.value.loadData(data);
      }
    };

    // 监听事件动态更新
    mitter.on(`${props.com.id}-update-data`, (data: any[]) => {
      updateExcelData(data);
    });

    onMounted(() => {
      initExcel(); // 默认加载
    });

    const dv_data = computed(() => {
      console.log('dv_data', ApiModule.dataMap[props.com.id]?.source)
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    return {
      formRef,
      ctEnum: controlType,
      excelContainer,
      initExcel,
      dv_data,
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
