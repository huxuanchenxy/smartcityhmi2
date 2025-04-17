<template>
  <div class="setting-panel-gui">
    <g-field label="尺寸">
      <g-select v-model="config.size" :data="sizeFamily" />
    </g-field>
    <g-field label="缩放比例">
      <g-input-number v-model="config.scale" :min="0.1" :max="10" :step="0.1"/>
    </g-field>
    <g-field label="开启颜色">
      <g-color-picker v-model="config.checkedColor" />
    </g-field>
    <g-field label="关闭颜色">
      <g-color-picker v-model="config.uncheckedColor" />
    </g-field>
    <g-field-collapse label="开启状态">
      <g-field :level="2" label="文本">
        <g-input v-model="config.checkedText.content" />
      </g-field>
      <g-field :level="2" label="文本样式" :is-flat="true">
        <g-input-number v-model="config.checkedText.textStyle.fontSize" :min="12" :max="100" :step="1" suffix="px"
          inline="inline" label="字号" />
        <g-color-picker v-model="config.checkedText.textStyle.color" inline="inline" label="字体颜色" />
        <g-select v-model="config.checkedText.textStyle.fontWeight" :data="fontWeights" inline="inline-single"
          label="字体粗细" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="关闭状态">
      <g-field :level="2" label="文本">
        <g-input v-model="config.uncheckedText.content" />
      </g-field>
      <g-field :level="2" label="文本样式" :is-flat="true">
        <g-input-number v-model="config.uncheckedText.textStyle.fontSize" :min="12" :max="100" :step="1" suffix="px"
          inline="inline" label="字号" />
        <g-color-picker v-model="config.uncheckedText.textStyle.color" inline="inline" label="字体颜色" />
        <g-select v-model="config.uncheckedText.textStyle.fontWeight" :data="fontWeights" inline="inline-single"
          label="字体粗细" />
      </g-field>
    </g-field-collapse>
    <g-field label="鼠标手势">
      <g-select v-model="config.cursor" :data="cursorFamily" />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  cursorFamily,
  sizeFamily,
  fontWeights
} from '@/data/select-options'
import { Switch } from './switch'

export default defineComponent({
  name: 'VSwitchProp',
  props: {
    com: {
      type: Object as PropType<Switch>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,
      cursorFamily,
      sizeFamily,
      fontWeights
    }
  },
})
</script>
