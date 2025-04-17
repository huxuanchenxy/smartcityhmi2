<template>
  <div class="setting-panel-gui">

    <g-field-collapse v-model="config.titleConfig.titleStyle.show" label="标题栏显示" :toggle="true">
      <g-field :level="2" label="字体大小">
        <g-input-number v-model="config.titleConfig.titleStyle.fontSize" :min="0" :max="100" :step="1" />
      </g-field>
      <g-field :level="2" label="背景色">
        <g-color-picker v-model="config.titleConfig.titleStyle.background" />
      </g-field>
      <g-field :level="2" label="字体颜色">
        <g-color-picker v-model="config.titleConfig.titleStyle.color" />
      </g-field>
      <g-field :level="2" label="加粗">
        <g-select v-model="config.titleConfig.titleStyle.fontWeight" :data="fontWeightFamily" />
      </g-field>
      <g-field :level="2" label="标题框高度">
        <g-input-number v-model="config.titleConfig.titleStyle.height" :min="0" :max="9999" :step="1" />
      </g-field>
      <g-field :level="2" label="标题框宽占比">
        <g-input-number v-model="config.titleConfig.titleStyle.width" :min="0" :max="100" :step="1" />
      </g-field>
      <g-field :level="2" label="标题上边距">
        <g-input-number v-model="config.titleConfig.titleStyle.paddingTop" :min="0" :max="100" :step="1" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="图标按钮配置">
      <g-field :level="2" label="按钮高度">
        <g-input-number v-model="config.iconConfig.buttonHeight" :min="0" :max="9999" :step="1" />
      </g-field>
      <g-field :level="2" label="按钮宽度">
        <g-input-number v-model="config.iconConfig.buttonWidth" :min="0" :max="9999" :step="1" />
      </g-field>
      <g-field :level="2" label="图标颜色">
        <g-color-picker v-model="config.iconConfig.iconColor" />
      </g-field>
      <g-field :level="2" label="关闭图标">
        <g-select v-model="config.iconConfig.closeIcon" :data="closeIconFamily" />
        <span>
          <img :src="config.iconConfig.closeIcon">
        </span>
      </g-field>
    </g-field-collapse>
    <g-field label="标签宽度">
      <g-input-number v-model="config.labelWidth" :step="1" suffix="px" />
    </g-field>
    <g-field-collapse label="文本样式">
      <g-field :level="2" tooltip="请选择您系统有的字体,如果您系统无此字体,标题将会显示默认字体" label="字体">
        <g-select v-model="config.textStyle.fontFamily" :data="fontFamilys" />
      </g-field>
      <g-field :level="2" label="字号">
        <g-input-number v-model="config.textStyle.fontSize" :min="12" :max="100" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="颜色">
        <g-color-picker v-model="config.textStyle.color" />
      </g-field>
      <g-field :level="2" label="字体粗细">
        <g-select v-model="config.textStyle.fontWeight" :data="fontWeights" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse v-model="config.background.show" :toggle="true" label="背景样式">
      <g-field :level="2" label="背景色">
        <g-color-picker v-model="config.background.bgColor" />
      </g-field>
      <g-field :level="2" label="圆角">
        <g-input-number v-model="config.background.borderRadius" :min="0" :max="88888" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="边框颜色">
        <g-color-picker v-model="config.background.borderColor" />
      </g-field>
      <g-field :level="2" label="边框粗细">
        <g-select v-model="config.background.borderStyle" :data="lineStyles" />
      </g-field>
      <g-field :level="2" label="边框粗细">
        <g-input-number v-model="config.background.borderWidth" :min="0" :max="88888" :step="1" suffix="px" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="表单项" mode="layout" default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']" :list="config.items" :min="1" :max="100" tab="项目"
      :add-item="handleAddFormItem">
      <template #default="slotProps">
        <g-field :level="2" label="项目名称">
          <g-input v-model="slotProps.item.label" />
        </g-field>
        <g-field :level="2" label="项目编号">
          <g-input v-model="slotProps.item.code" />
        </g-field>
        <g-field :level="2" label="控件类型">
          <g-select v-model="slotProps.item.control.type" :data="controlTypes" />
        </g-field>
        <g-field :level="2" label="关联点位">
          <n-input v-model:value="slotProps.item.pt.propertyName" readonly="readonly" placeholder="请选择"
            :style="{ width: '61%', 'font-size': '12px' }" />
          <n-button type="primary" size="small" :focusable="false" ghost @click="openIcList(slotProps.item)">
            点位
          </n-button>
        </g-field>
        <g-field :level="2" label="占位信息">
          <g-input v-model="slotProps.item.control.placeholder" />
        </g-field>
        <g-field :level="2" label="是否必填">
          <n-switch v-model:value="slotProps.item.control.required" />
        </g-field>
        <!-- <g-field-collapse label="输入框配置"  v-if="slotProps.item.control.type==controlType.input">
        </g-field-collapse> -->

        <g-field-collapse v-if="slotProps.item.control.type == controlType.radio" label="单选框配置" mode="layout"
          default-layout="vertical" :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
          :list="slotProps.item.control.radioOptions.options" :min="1" :max="100" tab="选项"
          :add-item="handleAddOption(slotProps.item, 'radio')">
          <template #default="optionProps">
            <g-field :level="2" label="选项名称">
              <g-input v-model="optionProps.item.label" />
            </g-field>
            <g-field :level="2" label="选项数值">
              <g-input v-model="optionProps.item.value" />
            </g-field>
          </template>
        </g-field-collapse>

        <g-field :level="2" label="选中值" v-if="slotProps.item.control.type == controlType.checkbox">
          <g-input-number v-model="slotProps.item.control.checkBoxOptions.checkedValue" />
        </g-field>
        <g-field :level="2" label="未选值" v-if="slotProps.item.control.type == controlType.checkbox">
          <g-input-number v-model="slotProps.item.control.checkBoxOptions.uncheckedValue" />
        </g-field>
        <g-field-collapse v-if="slotProps.item.control.type == controlType.checkbox" label="复选框配置" mode="layout"
          default-layout="vertical" :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
          :list="slotProps.item.control.checkBoxOptions.options" :min="1" :max="100" tab="选项"
          :add-item="handleAddOption(slotProps.item, 'checkbox')">
          <template #default="optionProps">
            <g-field :level="2" label="选项名称">
              <g-input v-model="optionProps.item.label" />
            </g-field>
            <g-field :level="2" label="选项数值">
              <g-input v-model="optionProps.item.value" />
            </g-field>
          </template>
        </g-field-collapse>

        <g-field-collapse v-if="slotProps.item.control.type == controlType.select" label="下拉框配置" mode="layout"
          default-layout="vertical" :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
          :list="slotProps.item.control.selectOptions.options" :min="1" :max="100" tab="选项"
          :add-item="handleAddOption(slotProps.item, 'select')">
          <template #default="optionProps">
            <g-field :level="2" label="选项名称">
              <g-input v-model="optionProps.item.label" />
            </g-field>
            <g-field :level="2" label="选项数值">
              <g-input v-model="optionProps.item.value" />
            </g-field>
          </template>
        </g-field-collapse>
        <g-field-collapse label="数字输入框配置" v-if="slotProps.item.control.type == controlType.number">
          <g-field :level="2" label="最大值">
            <g-input-number v-model="slotProps.item.control.numberOptions.max" />
          </g-field>
          <g-field :level="2" label="最小值">
            <g-input-number v-model="slotProps.item.control.numberOptions.min" />
          </g-field>
          <g-field :level="2" label="步进值">
            <g-input-number v-model="slotProps.item.control.numberOptions.step" :min="0" :max="100" :step="1" />
          </g-field>
        </g-field-collapse>
        <g-field-collapse label="日期控件配置" v-if="slotProps.item.control.type == controlType.date">
          <g-field :level="2" label="日期格式">
            <g-input v-model="slotProps.item.control.dateOptions.dateFormat" />
          </g-field>
        </g-field-collapse>
        <!-- <g-field-collapse  label="时间控件配置" v-if="slotProps.item.control.type == controlType.time">
          <g-field :level="2" label="时间格式">
            <g-input v-model="slotProps.item.control.timeOptions.timeFormat" />
          </g-field>
        </g-field-collapse> -->
      </template>
    </g-field-collapse>
    <g-field-collapse label="按钮样式">
      <g-field :level="2" label="显示提交按钮">
        <n-switch v-model:value="config.buttonOptions.showSubmit" />
      </g-field>
      <g-field :level="2" label="提交按钮文字">
        <g-input v-model="config.buttonOptions.submitButtonText" />
      </g-field>
      <g-field :level="2" label="提交按钮样式">
        <g-select v-model="config.buttonOptions.submitButtonType" :data="buttonTypes" />
      </g-field>
      <g-field :level="2" label="显示取消按钮">
        <n-switch v-model:value="config.buttonOptions.showCancel" />
      </g-field>
      <g-field :level="2" label="取消按钮文字">
        <g-input v-model="config.buttonOptions.cancleButtonText" />
      </g-field>
      <g-field :level="2" label="取消按钮样式">
        <g-select v-model="config.buttonOptions.cancleButtonType" :data="buttonTypes" />
      </g-field>
    </g-field-collapse>

  </div>
  <IcList :visible="icListVisibile" />
</template>

<script lang='ts'>
import { defineComponent, PropType, provide, ref, toRef } from 'vue'
import { controlTypes, fontFamilys, fontWeights, lineStyles, buttonTypes, fontWeightFamily, closeIconFamily } from '@/data/select-options'
import { BasicForm, BasicFormItems, controlType } from './basic-form'
import IcList from '../../../../views/screen-editor/config-panel/icevent-panel/ic-list.vue'
import { PtModel } from '@/components/data-handle'

export default defineComponent({
  name: 'VBasicFormProp',
  props: {
    com: {
      type: Object as PropType<BasicForm>,
      required: true,
    },
  },
  components: {
    IcList
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const icListVisibile = ref(false);

    const handleAddFormItem = () => {
      return new BasicFormItems(`项目${config.value.items.length + 1}`, config.value.items.length + 1)
    }

    const handleAddOption = (item: BasicFormItems, type: string) => {
      let option = {};
      switch (type) {
        case 'select':
          option = { label: `选项${item.control.selectOptions.options.length + 1}`, value: item.control.selectOptions.options.length + 1 };
          break;
        case 'checkbox':
          option = { label: `选项${item.control.checkBoxOptions.options.length + 1}`, value: item.control.checkBoxOptions.options.length + 1 };
          break;
        case 'radio':
          option = { label: `选项${item.control.radioOptions.options.length + 1}`, value: item.control.radioOptions.options.length + 1 };
          break;
      }
      return option;
    }

    var currentField: BasicFormItems = null;

    const openIcList = (item: BasicFormItems) => {
      currentField = item;
      icListVisibile.value = true
    }

    provide('closeIcList', () => { icListVisibile.value = false })

    provide('addPt', (item: PtModel) => {
      if (item != null && item.extension && item.extension.device && item.extension.name) {
        currentField.pt = item;
        icListVisibile.value = false
      }
    })

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
      closeIconFamily
    }
  },
})
</script>
