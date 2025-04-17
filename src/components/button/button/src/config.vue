<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="按钮文字"
    >
      <g-field
        :level="2"
        label="文字"
      >
        <g-input
          v-model="config.content.buttonContent"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="边框"
    >
      <g-field
        :level="2"
        label="宽度"
      >
        <g-input-number
          v-model="config.borderStyle.borderWidth"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.borderStyle.borderColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="圆角半径"
      >
        <g-input-number
          v-model="config.borderStyle.borderRadius"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="样式"
      >
        <!-- <g-input
          v-model="config.borderStyle.borderStyle"
        /> -->
        <g-select
          v-model="config.borderStyle.borderStyle"
          :data="lineStyles"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="字体"
    >
      <g-field
        :level="2"
        label="大小"
      >
        <g-input-number
          v-model="config.fontStyle.fontSize"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.fontStyle.fontColor"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="背景"
    >
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.background.backgroundColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="图像"
      >
        <g-upload-image
          v-model="config.background.backgroundImage"
        />
        <!-- <g-input
          v-model="config.background.backgroundImage"
        /> -->
      </g-field>
      <g-field
        :level="2"
        label="背景图像大小"
      >
        <g-input-number
          v-model="config.background.backgroundSize"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="图像是否重复平铺"
      >
        <n-switch
          v-model:value="config.background.backgroundRepeat"
        />
      </g-field>
    </g-field-collapse>
    <g-field
      label="鼠标指针"
    >
      <g-select
        v-model="config.cursor"
        :data="cursorFamily"
      />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  lineStyles,
  cursorFamily,
} from '@/data/select-options'
import { Button } from './button'

export default defineComponent({
  name: 'VButtonProp',
  props: {
    com: {
      type: Object as PropType<Button>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,
      lineStyles,
      cursorFamily,
    }
  },
})
</script>
