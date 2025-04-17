<template>
  <div class="setting-panel-gui">
    <g-field
      label="进度条颜色"
    >
      <g-color-picker
        v-model="config.barColor"
      />
    </g-field>
    <g-field
      label="轨道颜色"
    >
      <g-color-picker
        v-model="config.railColor"
      />
    </g-field>
    <g-field
      label="边框圆角"
    >
      <g-input-number
        v-model="config.radius"
        :min="0"
        :max="100"
        :step="1"
        suffix="px"
      />
    </g-field>
    <g-field-collapse
      v-model="config.indicator.show"
      :toggle="true"
      label="指示标签"
    >
      <!-- <g-field
        :level="2"
        label="位置"
      >
        <g-select
          v-model="config.indicator.placement"
          :data="[{ value: '内部', id : 'inside' }, { value: '外部', id : 'outside' }]"
        />
      </g-field> -->
      <g-field
        :level="2"
        label="单位"
      >
        <g-input
          v-model="config.indicator.unit"
        />
      </g-field>
      <g-field
        :level="2"
        label="字体"
      >
        <g-select
          v-model="config.indicator.fontFamily"
          :data="fontFamilys"
        />
      </g-field>
      <g-field
        :level="2"
        label="粗细"
      >
        <g-select
          v-model="config.indicator.fontWeight"
          :data="fontWeights"
        />
      </g-field>
      <g-field
        :level="2"
        label="大小"
      >
        <g-input-number
          v-model="config.indicator.fontSize"
          :min="1"
          :max="100"
          :step="1"
          suffix="pt"
        />
      </g-field>
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.indicator.color"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  fontFamilys,
  fontWeights,
} from '@/data/select-options'
import { Progress } from './progress'

export default defineComponent({
  name: 'VProgressProp',
  props: {
    com: {
      type: Object as PropType<Progress>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,

      fontFamilys,
      fontWeights,
    }
  },
})
</script>
