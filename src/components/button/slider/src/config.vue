<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="按钮配置">
      <g-field :level="2" label="按钮素材">
        <g-upload-image v-model="config.button.url" />
      </g-field>
      <g-field label="重置">
        <n-button size="tiny" :focusable="false" @click="resetUrl">
          恢复默认图片
        </n-button>
      </g-field>
      <g-field :level="2" label="按钮宽度">
        <g-input-number v-model="config.button.width" :min="0" :max="100" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="按钮高度">
        <g-input-number v-model="config.button.height" :min="0" :max="100" :step="1" suffix="px" />
      </g-field>
    </g-field-collapse>
    <g-field label="最大值">
      <g-input-number v-model="config.max" :min="0" :max="100" :step="1" />
    </g-field>
    <g-field label="最小值">
      <g-input-number v-model="config.min" :min="0" :max="100" :step="1" />
    </g-field>
    <g-field label="初始值">
      <g-input-number v-model="config.defaultValue" :min="0" :max="100" :step="1" />
    </g-field>
    <g-field label="禁用">
      <n-switch v-model:value="config.disabled" />
    </g-field>
    <g-field label="倒转">
      <n-switch v-model:value="config.reverse" />
    </g-field>
    <!-- <g-field
      label="步长"
    >
      <g-input-number
        v-model="config.step"
        :min="0"
        :max="100"
        :step="1"
      />
    </g-field> -->
    <g-field label="竖向">
      <n-switch v-model:value="config.vertical" />
    </g-field>
    <g-field label="提示框">
      <n-switch v-model:value="config.tooltip" />
    </g-field>
    <g-field label="提示框位置">
      <g-select v-model="config.placement" :data="placementFamily" />
    </g-field>
    <g-field label="防抖间隔">
        <g-input-number v-model="config.debounceTime" :min="0" :max="1000" :step="1" suffix="ms" />
      </g-field>
    <g-field label="鼠标手势">
      <g-select v-model="config.cursor" :data="cursorFamily" />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  cursorFamily,
  placementFamily
} from '@/data/select-options'
import { Slider } from './slider'

export default defineComponent({
  name: 'VSliderProp',
  props: {
    com: {
      type: Object as PropType<Slider>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    const resetUrl = () => {
      config.value.button.url = `/public/images/sliderbutton.png`
    }

    return {
      config,
      cursorFamily,
      placementFamily,
      resetUrl
    }
  },
})
</script>
