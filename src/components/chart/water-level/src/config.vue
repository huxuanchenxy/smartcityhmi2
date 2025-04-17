<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="全局">
      <g-field :level="2" label="形状">
        <g-select v-model="config.global.shape" :data="[ { id:'rect',value:'长方形'},{ id:'round',value:'圆形'},{id:'roundRect',value:'圆角矩形'}]" />
      </g-field>
      <g-field :level="2" label="波浪数量">
        <g-input-number
          v-model="config.global.waveNum"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field :level="2" label="波浪高度">
        <g-input-number
          v-model="config.global.waveHeight"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field :level="2" label="波浪透明度">
        <g-input-number
          v-model="config.global.waveOpacity"
          :min="0"
          :max="1"
          :step="0.1"
        />
      </g-field>
      <g-field :level="2" label="信息格式化">
        <g-input v-model="config.global.formatter" />
      </g-field>
      <g-field :level="2" label="起始颜色">
        <g-color-picker v-model="config.global.color1" :alpha="false" />
      </g-field>
      <g-field :level="2" label="终止颜色">
        <g-color-picker v-model="config.global.color2" :alpha="false" />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
} from '@/data/select-options'
import { WaterLevel } from './water-level'

export default defineComponent({
  name: 'VWaterLevelProp',
  props: {
    com: {
      type: Object as PropType<WaterLevel>,
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

