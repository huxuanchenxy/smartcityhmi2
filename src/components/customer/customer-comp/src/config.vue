<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      v-model="config.titleConfig.titleStyle.show"
      label="标题栏显示"
      :toggle="true"
    >
      <g-field :level="2" label="字体大小">
        <g-input-number
          v-model="config.titleConfig.titleStyle.fontSize"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field :level="2" label="背景色">
        <g-color-picker v-model="config.titleConfig.titleStyle.background" />
      </g-field>
      <g-field :level="2" label="字体颜色">
        <g-color-picker v-model="config.titleConfig.titleStyle.color" />
      </g-field>
      <g-field :level="2" label="加粗">
        <g-select
          v-model="config.titleConfig.titleStyle.fontWeight"
          :data="fontWeightFamily"
        />
      </g-field>
      <g-field :level="2" label="标题框高度">
        <g-input-number
          v-model="config.titleConfig.titleStyle.height"
          :min="0"
          :max="9999"
          :step="1"
        />
      </g-field>
      <g-field :level="2" label="标题框宽占比">
        <g-input-number
          v-model="config.titleConfig.titleStyle.width"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field :level="2" label="标题上边距">
        <g-input-number
          v-model="config.titleConfig.titleStyle.paddingTop"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
    </g-field-collapse>
    <!-- <g-field-collapse label="图标按钮配置">
      <g-field :level="2" label="按钮高度">
        <g-input-number
          v-model="config.iconConfig.buttonHeight"
          :min="0"
          :max="9999"
          :step="1"
        />
      </g-field>
      <g-field :level="2" label="按钮宽度">
        <g-input-number
          v-model="config.iconConfig.buttonWidth"
          :min="0"
          :max="9999"
          :step="1"
        />
      </g-field>
      <g-field :level="2" label="图标颜色">
        <g-color-picker v-model="config.iconConfig.iconColor" />
      </g-field>
      <g-field :level="2" label="关闭图标">
        <g-select
          v-model="config.iconConfig.closeIcon"
          :data="closeIconFamily"
        />
        <span>
          <img :src="config.iconConfig.closeIcon" />
        </span>
      </g-field>
    </g-field-collapse>
    <g-field label="标签宽度">
      <g-input-number v-model="config.labelWidth" :step="1" suffix="px" />
    </g-field>
    <g-field-collapse label="文本样式">
      <g-field
        :level="2"
        tooltip="请选择您系统有的字体,如果您系统无此字体,标题将会显示默认字体"
        label="字体"
      >
        <g-select v-model="config.textStyle.fontFamily" :data="fontFamilys" />
      </g-field>
      <g-field :level="2" label="字号">
        <g-input-number
          v-model="config.textStyle.fontSize"
          :min="12"
          :max="100"
          :step="1"
          suffix="px"
        />
      </g-field>
      <g-field :level="2" label="颜色">
        <g-color-picker v-model="config.textStyle.color" />
      </g-field>
      <g-field :level="2" label="字体粗细">
        <g-select v-model="config.textStyle.fontWeight" :data="fontWeights" />
      </g-field>
    </g-field-collapse> -->
    <g-field-collapse
      v-model="config.background.show"
      :toggle="true"
      label="背景样式"
    >
      <g-field :level="2" label="背景色">
        <g-color-picker v-model="config.background.bgColor" />
      </g-field>
      <g-field :level="2" label="圆角">
        <g-input-number
          v-model="config.background.borderRadius"
          :min="0"
          :max="88888"
          :step="1"
          suffix="px"
        />
      </g-field>
      <g-field :level="2" label="边框颜色">
        <g-color-picker v-model="config.background.borderColor" />
      </g-field>
      <g-field :level="2" label="边框粗细">
        <g-select v-model="config.background.borderStyle" :data="lineStyles" />
      </g-field>
      <g-field :level="2" label="边框粗细">
        <g-input-number
          v-model="config.background.borderWidth"
          :min="0"
          :max="88888"
          :step="1"
          suffix="px"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="按钮样式">
      <g-field :level="2" label="显示提交按钮">
        <n-switch v-model:value="config.buttonOptions.showSubmit" />
      </g-field>
      <g-field :level="2" label="提交按钮文字">
        <g-input v-model="config.buttonOptions.submitButtonText" />
      </g-field>
      <g-field :level="2" label="提交按钮样式">
        <g-select
          v-model="config.buttonOptions.submitButtonType"
          :data="buttonTypes"
        />
      </g-field>
      <g-field :level="2" label="显示取消按钮">
        <n-switch v-model:value="config.buttonOptions.showCancel" />
      </g-field>
      <g-field :level="2" label="取消按钮文字">
        <g-input v-model="config.buttonOptions.cancleButtonText" />
      </g-field>
      <g-field :level="2" label="取消按钮样式">
        <g-select
          v-model="config.buttonOptions.cancleButtonType"
          :data="buttonTypes"
        />
      </g-field>
    </g-field-collapse>
  </div>
  <IcList :visible="icListVisibile" />
</template>

<script lang='ts'>
import { PtModel } from "@/components/data-handle";
import {
  buttonTypes,
  closeIconFamily,
  controlTypes,
  fontFamilys,
  fontWeightFamily,
  fontWeights,
  lineStyles,
} from "@/data/select-options";
import { PropType, defineComponent, provide, ref, toRef } from "vue";
import IcList from "../../../../views/screen-editor/config-panel/icevent-panel/ic-list.vue";
import { CustomerComp, CustomerCompItems, controlType } from "./customer-comp";

export default defineComponent({
  name: "VCustomerCompProp",
  props: {
    com: {
      type: Object as PropType<CustomerComp>,
      required: true,
    },
  },
  components: {
    IcList,
  },
  setup(props) {
    const config = toRef(props.com, "config");
    const icListVisibile = ref(false);

    const handleAddFormItem = () => {
      return new CustomerCompItems(
        `自定义组件-${config.value.items.length + 1}`,
        config.value.items.length + 1
      );
    };

    const handleAddOption = (item: CustomerCompItems, type: string) => {
      let option = {};
      switch (type) {
        case "select":
          option = {
            label: `选项${item.control.selectOptions.options.length + 1}`,
            value: item.control.selectOptions.options.length + 1,
          };
          break;
        case "checkbox":
          option = {
            label: `选项${item.control.checkBoxOptions.options.length + 1}`,
            value: item.control.checkBoxOptions.options.length + 1,
          };
          break;
        case "radio":
          option = {
            label: `选项${item.control.radioOptions.options.length + 1}`,
            value: item.control.radioOptions.options.length + 1,
          };
          break;
      }
      return option;
    };

    var currentField: CustomerCompItems = null;

    const openIcList = (item: CustomerCompItems) => {
      currentField = item;
      icListVisibile.value = true;
    };

    provide("closeIcList", () => {
      icListVisibile.value = false;
    });

    provide("addPt", (item: PtModel) => {
      if (
        item != null &&
        item.extension &&
        item.extension.device &&
        item.extension.name
      ) {
        currentField.pt = item;
        icListVisibile.value = false;
      }
    });

    return {
      config,
      controlType,
      handleAddFormItem,
      handleAddOption,
      openIcList,
      icListVisibile,
      controlTypes,
      fontFamilys,
      fontWeights,
      fontWeightFamily,
      lineStyles,
      buttonTypes,
      closeIconFamily,
    };
  },
});
</script>
