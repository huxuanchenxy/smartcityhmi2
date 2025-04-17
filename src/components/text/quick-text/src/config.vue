<template>
  <div class="setting-panel-gui">
    <g-field
      label="文本"
    >
      <g-input
        v-model="config.content"
      />
    </g-field>
    <g-field
      label="字体大小"
    >
      <g-input-number
        v-model="config.fontSize"
        :min="0"
        :max="100"
        :step="1"
      />
    </g-field>
    <g-field
      label="字体颜色"
    >
      <g-color-picker
        v-model="config.fontColor"
      />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
} from '@/data/select-options'
import { QuickText } from './quick-text'

export default defineComponent({
  name: 'VQuickTextProp',
  props: {
    com: {
      type: Object as PropType<QuickText>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,

    }
  },
})
</script>
