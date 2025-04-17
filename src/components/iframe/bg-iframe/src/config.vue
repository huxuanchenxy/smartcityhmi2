<template>
  <div class="setting-panel-gui">
    <g-field label="布局方式">
      <g-select v-model="config.position" :data="position" />
    </g-field>
    <g-field label="上边距">
      <g-input-number v-model="config.top" :min="0" :max="100" :step="1" />
    </g-field>
    <g-field label="左边距">
      <g-input-number v-model="config.left" :min="0" :max="100" :step="1" />
    </g-field>
    <g-field label="右边距">
      <g-input-number v-model="config.right" :min="0" :max="100" :step="1" />
    </g-field>
    <g-field label="下边距">
      <g-input-number v-model="config.bottom" :min="0" :max="100" :step="1" />
    </g-field>
    <g-field label="z-index">
      <g-input-number v-model="config.zIndex" :min="0" :max="100" :step="1" />
    </g-field>
    <g-field label="边框">
      <g-input-number v-model="config.border" :min="0" :max="100" :step="1" />
    </g-field>
    <g-field label="超过边界">
      <g-input v-model="config.overflow" />
    </g-field>
    <g-field label="缩放">
          <g-input-number v-model="config.scale" :min="0" :max="100" :step="1" />
        </g-field>
    <g-field-collapse label="iframe设置">
      <g-field-collapse label="iframe样式">
        <g-field :level="2" label="宽度">
          <g-input-number v-model="config.srcConfig.srcStyle.width" :min="0" :max="100" :step="1" />
        </g-field>
        <g-field :level="2" label="高度">
          <g-input-number v-model="config.srcConfig.srcStyle.height" :min="0" :max="100" :step="1" />
        </g-field>
        <g-field :level="2" label="边框">
          <g-input-number v-model="config.srcConfig.srcStyle.border" :min="0" :max="100" :step="1" />
        </g-field>
        <g-field :level="2" label="margin">
          <g-input-number v-model="config.srcConfig.srcStyle.margin" :min="0" :max="100" :step="1" />
        </g-field>
        <g-field :level="2" label="padding">
          <g-input-number v-model="config.srcConfig.srcStyle.padding" :min="0" :max="100" :step="1" />
        </g-field>
      </g-field-collapse>
      <g-field :level="2" label="url地址">
        <g-input v-model="config.srcConfig.src" />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import { position } from '@/data/select-options'
import { BgIframe } from './bg-iframe'

export default defineComponent({
  name: 'VBgIframeProp',
  props: {
    com: {
      type: Object as PropType<BgIframe>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,
      position
    }
  },
})
</script>
