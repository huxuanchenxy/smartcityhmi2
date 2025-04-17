<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="线条属性">
      <g-field :level="2" label="线条颜色">
        <g-color-picker v-model="config.props.stroke" />
      </g-field>
      <g-field :level="2" label="线条宽度">
        <g-input-number v-model="config.props.strokeWidth" :min="0" :max="100" :step="1" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="动画">
      <g-field :level="2" label="类型">
        <g-select v-model="config.animations.type" :data="svgLineType" />
      </g-field>
      <g-field v-if="config.animations.type === 'CustomTrack'" label="位图">
        <g-upload-image v-model="config.imgStyle.backgroundImage" />
      </g-field>
      <g-field v-if="config.animations.type === 'CustomTrack'" label="宽度">
        <g-input-number v-model="config.imgStyle.width" :min="0" :max="1000" :step="1" suffix="px" />
      </g-field>
      <g-field v-if="config.animations.type === 'CustomTrack'" label="高度">
        <g-input-number v-model="config.imgStyle.height" :min="0" :max="1000" :step="1" suffix="px" />
      </g-field>
      <g-field v-if="config.animations.type === 'CustomTrack'" label="圆角">
        <g-input-number v-model="config.imgStyle.radius" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field v-if="config.animations.type === 'CustomTrack'" label="是否自动旋转">
        <n-switch v-model:value="config.animations.rotate" />
      </g-field>
      <g-field v-if="config.animations.type === 'CustomTrack'" label="是否隐藏轨迹">
        <n-switch v-model:value="config.imgStyle.hideLine" />
      </g-field>
      <g-field :level="2" label="持续时间">
        <g-input-number v-model="config.animations.dur" :min="0" :max="100" :step="1" suffix="秒" />
      </g-field>
      <g-field-collapse v-model="config.animations.repeatCount.disabled" :toggle="true" label="是否循环">
        <g-field :level="2" label="循环次数">
          <g-input v-model="config.animations.repeatCount.val" />
        </g-field>
      </g-field-collapse>
      <g-field :level="2" label="色块颜色">
        <g-color-picker v-model="config.animations.color" />
      </g-field>
      <g-field :level="2" label="反转动画">
        <n-switch v-model:value="config.animations.reverse" />
      </g-field>
      <g-field :level="2" label="开启动画">
        <n-switch v-model:value="config.animations.enable" />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  svgLineType
} from '@/data/select-options'
import { SvgLine } from './svg-line'

export default defineComponent({
  name: 'VSvgLineProp',
  props: {
    com: {
      type: Object as PropType<SvgLine>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,
      svgLineType
    }
  },
})
</script>
