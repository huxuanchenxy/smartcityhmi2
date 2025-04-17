<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="容器布局">
      <g-field :level="2" label="flex-direction">
        <g-select v-model="config.flex.flexDirection"
          :data="[{ id: 'row', value: 'row' }, { id: 'row-reverse', value: 'row-reverse' }, { id: 'column', value: 'column' }, { id: 'column-reverse', value: 'column-reverse' }]" />
      </g-field>
      <g-field :level="2" label="flex-wrap">
        <g-select v-model="config.flex.flexWrap"
          :data="[{ id: 'nowrap', value: 'nowrap' }, { id: 'wrap', value: 'wrap' }, { id: 'wrap-reverse', value: 'wrap-reverse' }]" />
      </g-field>
      <g-field :level="2" label="justify-content">
        <g-select v-model="config.flex.justifyContent"
          :data="[{ id: 'flex-start', value: 'flex-start' }, { id: 'flex-end', value: 'flex-end' }, { id: 'center', value: 'center' }, { id: 'space-between', value: 'space-between' }, { id: 'space-around', value: 'space-around' }]" />
      </g-field>
      <g-field :level="2" label="align-items">
        <g-select v-model="config.flex.alignItems"
          :data="[{ id: 'flex-start', value: 'flex-start' }, { id: 'flex-end', value: 'flex-end' }, { id: 'center', value: 'center' }, { id: 'baseline', value: 'baseline' }, { id: 'stretch', value: 'stretch' }]" />
      </g-field>
      <g-field :level="2" label="align-content">
        <g-select v-model="config.flex.alignContent"
          :data="[{ id: 'flex-start', value: 'flex-start' }, { id: 'flex-end', value: 'flex-end' }, { id: 'center', value: 'center' }, { id: 'space-between', value: 'space-between' }, { id: 'space-around', value: 'space-around' }, { id: 'stretch', value: 'stretch' }]" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse v-model="config.backgroundStyle.show" :toggle="true" label="容器背景样式">
      <g-field :level="2" label="背景颜色">
        <g-color-picker v-model="config.backgroundStyle.bgColor" />
      </g-field>
      <g-field :level="2" label="边框圆角">
        <g-input-number v-model="config.backgroundStyle.borderRadius" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="边框颜色">
        <g-color-picker v-model="config.backgroundStyle.borderColor" />
      </g-field>
      <g-field :level="2" label="边框样式">
        <g-select v-model="config.backgroundStyle.borderStyle" :data="lineStyles" />
      </g-field>
      <g-field :level="2" label="边框宽度">
        <g-input-number v-model="config.backgroundStyle.borderWidth" :min="0" :step="1" suffix="px" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="组件布局">
      <g-field :level="2" label="宽度">
        <g-input-number v-model="config.flexItem.width" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="高度">
        <g-input-number v-model="config.flexItem.height" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="padding">
        <g-input v-model="config.flexItem.padding" />
      </g-field>
      <g-field :level="2" label="margin">
        <g-input v-model="config.flexItem.margin" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse v-model="config.itemBackgroundStyle.show" :toggle="true" label="组件背景样式">
      <g-field :level="2" label="背景颜色">
        <g-color-picker v-model="config.itemBackgroundStyle.bgColor" />
      </g-field>
      <g-field :level="2" label="边框圆角">
        <g-input-number v-model="config.itemBackgroundStyle.borderRadius" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="边框颜色">
        <g-color-picker v-model="config.itemBackgroundStyle.borderColor" />
      </g-field>
      <g-field :level="2" label="边框样式">
        <g-select v-model="config.itemBackgroundStyle.borderStyle" :data="lineStyles" />
      </g-field>
      <g-field :level="2" label="边框宽度">
        <g-input-number v-model="config.itemBackgroundStyle.borderWidth" :min="0" :step="1" suffix="px" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="文本属性">
      <g-field :level="2" tooltip="请选择您系统有的字体，如果您系统无此字体，标题将会显示默认字体" label="字体">
        <g-select v-model="config.textStyle.fontFamily" :data="fontFamilys" />
      </g-field>
      <g-field :level="2" label="字体大小">
        <g-input-number v-model="config.textStyle.fontSize" :min="12" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="字体颜色">
        <g-color-picker v-model="config.textStyle.color" />
      </g-field>
      <g-field :level="2" label="字体粗细">
        <g-select v-model="config.textStyle.fontWeight" :data="fontWeights" />
      </g-field>
      <g-field :level="2" label="文本位置">
        <!-- <g-select v-model="config.textStyle.textAlign" :data="aligns" /> -->
        <g-select v-model="config.textStyle.textAlign"
          :data="[{ id: 'flex-start', value: 'flex-start' }, { id: 'flex-end', value: 'flex-end' }, { id: 'center', value: 'center' }, { id: 'space-between', value: 'space-between' }, { id: 'space-around', value: 'space-around' }]" />
      </g-field>
      <g-field :level="2" label="文本方向">
        <g-select v-model="config.textStyle.writingMode" :data="writingModes" />
      </g-field>
      <g-field :level="2" label="文本间隔">
        <g-input-number v-model="config.textStyle.letterSpacing" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="超限省略">
        <n-switch v-model:value="config.textStyle.ellipsis" />
      </g-field>
    </g-field-collapse>

    <g-field-collapse v-model="config.selectedStyle.show" :toggle="true" label="组件选中背景">
      <g-field :level="2" label="背景颜色">
        <g-color-picker v-model="config.selectedStyle.bgColor" />
      </g-field>
      <g-field :level="2" label="边框圆角">
        <g-input-number v-model="config.selectedStyle.borderRadius" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="边框颜色">
        <g-color-picker v-model="config.selectedStyle.borderColor" />
      </g-field>
      <g-field :level="2" label="边框样式">
        <g-select v-model="config.selectedStyle.borderStyle" :data="lineStyles" />
      </g-field>
      <g-field :level="2" label="边框宽度">
        <g-input-number v-model="config.selectedStyle.borderWidth" :min="0" :step="1" suffix="px" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="选中文本属性">
      <g-field :level="2" tooltip="请选择您系统有的字体，如果您系统无此字体，标题将会显示默认字体" label="字体">
        <g-select v-model="config.selectedStyle.fontFamily" :data="fontFamilys" />
      </g-field>
      <g-field :level="2" label="字体大小">
        <g-input-number v-model="config.selectedStyle.fontSize" :min="12" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="字体颜色">
        <g-color-picker v-model="config.selectedStyle.color" />
      </g-field>
      <g-field :level="2" label="字体粗细">
        <g-select v-model="config.selectedStyle.fontWeight" :data="fontWeights" />
      </g-field>
      <g-field :level="2" label="文本位置">
        <!-- <g-select v-model="config.selectedStyle.textAlign" :data="aligns" /> -->
        <g-select v-model="config.selectedStyle.textAlign"
        :data="[{ id: 'flex-start', value: 'flex-start' }, { id: 'flex-end', value: 'flex-end' }, { id: 'center', value: 'center' }, { id: 'space-between', value: 'space-between' }, { id: 'space-around', value: 'space-around' }]" />
      </g-field>
      <g-field :level="2" label="文本方向">
        <g-select v-model="config.selectedStyle.writingMode" :data="writingModes" />
      </g-field>
      <g-field :level="2" label="文本间隔">
        <g-input-number v-model="config.selectedStyle.letterSpacing" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="超限省略">
        <n-switch v-model:value="config.selectedStyle.ellipsis" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse v-model="config.iconStyle.show" :toggle="true" label="图标样式">
      <g-field :level="2" label="宽度">
        <g-input-number v-model="config.iconStyle.width" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="高度">
        <g-input-number v-model="config.iconStyle.height" :min="0" :step="1" suffix="px" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse v-model="config.urlConfig.show" :toggle="true" label="跳转设置">
      <g-field :level="2" label="是否脚本跳转">
        <n-switch v-model:value="config.urlConfig.isLocationHref" />
      </g-field>
      <g-field :level="2" label="是否打开新窗口">
        <n-switch v-model:value="config.urlConfig.isBlank" />
      </g-field>
    </g-field-collapse>
    <g-field label="是否多选">
      <n-switch v-model:value="config.multiSelected" />
    </g-field>
    <g-field label="手势">
      <g-select v-model="config.cursor" :data="cursorFamily" />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  fontFamilys,
  fontWeights,
  aligns,
  writingModes,
  lineStyles,
  cursorFamily
} from '@/data/select-options'
import { FlexTextBox } from './flex-text-box'

export default defineComponent({
  name: 'VFlexTextBoxProp',
  props: {
    com: {
      type: Object as PropType<FlexTextBox>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,
      fontFamilys,
      fontWeights,
      aligns,
      writingModes,
      lineStyles,
      cursorFamily
    }
  },
})
</script>
