<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="数值设置">
      <g-field label="最大值">
        <g-input-number v-model="config.maxValue" :min="0" :step="1" />
      </g-field>
      <g-field label="当前值">
        <g-input-number v-model="config.currentValue" :min="0" :step="1" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse v-model="config.text.enable" :toggle="true" label="数值显示">
      <g-field :level="2" label="文本样式" :is-flat="true">
        <g-input-number v-model="config.text.fontSize" :min="12" :max="100" :step="1" suffix="px" inline="inline"
          label="字号" />
        <g-color-picker v-model="config.text.color" inline="inline" label="颜色" />
        <g-select v-model="config.text.fontWeight" :data="fontWeights" inline="inline" label="字体粗细" />
      </g-field>
      <g-field :level="2" label="数值单位">
        <g-input v-model="config.formatter" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="容器设置">
      <g-field :level="2" label="容器形状">
        <g-select v-model="config.shape" :data="shapeTypes" />
      </g-field>
      <g-field :level="2" label="填充类型" v-if="config.shape !== 'custom'">
        <n-radio-group v-model:value="config.bgColor.type" size="small">
          <n-radio-button v-for="em in fillTypes" :key="em.id" :value="em.id">
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field v-if="config.bgColor.type === 'solid' && config.shape !== 'custom'" :level="2" label="颜色">
        <g-color-picker v-model="config.bgColor.value" />
      </g-field>
      <g-field v-if="config.bgColor.type === 'gradient' && config.shape !== 'custom'" :level="2" label="开始颜色">
        <g-color-picker v-model="config.bgColor.from" />
      </g-field>
      <g-field v-if="config.bgColor.type === 'gradient' && config.shape !== 'custom'" :level="2" label="结束颜色">
        <g-color-picker v-model="config.bgColor.to" />
      </g-field>

      <g-field :level="2" label="位图" v-if="config.shape === 'custom'">
        <g-upload-image v-model="config.imgStyle.backgroundImage" />
      </g-field>
      <g-field :level="2" label="圆角" v-if="config.shape === 'custom'">
        <g-input-number v-model="config.imgStyle.radius" :min="0" :step="1" suffix="px" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="容器边框">
      <g-field :level="2" label="颜色">
        <g-color-picker v-model="config.border.color" />
      </g-field>
      <g-field :level="2" label="宽度">
        <g-input-number v-model="config.border.width" :min="0" :max="100" :step="1" suffix="px" />
      </g-field>
    </g-field-collapse>
    <!-- <g-field-collapse v-if="config.shape !== 'custom'" label="容器背景">

    </g-field-collapse>
    <g-field-collapse v-if="config.shape === 'custom'" label="自定义背景">

    </g-field-collapse> -->
    <g-field-collapse label="水位参数">
      <g-field :level="2" label="波浪数量">
        <g-input-number v-model="config.wave.waveNum" :min="1" :step="1" />
      </g-field>
      <g-field :level="2" label="波浪高度">
        <g-input-number v-model="config.wave.waveHeight" :min="0" :max="100" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="透明度">
        <g-slider v-model="config.wave.waveOpacity" :min="0" :max="1" :step="0.01" />
      </g-field>
      <!-- <g-field :level="2" label="最大宽度">
        <g-input-number v-model="config.wave.maxWidth" :min="0" :step="1" suffix="%" />
      </g-field>
      <g-field :level="2" label="最大高度">
        <g-input-number v-model="config.wave.maxHeight" :min="0" :step="1" suffix="%" />
      </g-field>
      <g-field :level="2" label="顶部偏移量">
        <g-input-number v-model="config.wave.top" :min="0" :step="1" suffix="px" />
      </g-field>
      <g-field :level="2" label="左侧偏移量">
        <g-input-number v-model="config.wave.left" :min="0" :step="1" suffix="px" />
      </g-field> -->
      <g-field-collapse label="波浪颜色">
        <g-field :level="2" label="填充类型">
          <n-radio-group v-model:value="config.wave.waveColor.type" size="small">
            <n-radio-button v-for="em in fillTypes" :key="em.id" :value="em.id">
              {{ em.value }}
            </n-radio-button>
          </n-radio-group>
        </g-field>
        <g-field v-if="config.wave.waveColor.type === 'solid'" :level="2" label="颜色">
          <g-color-picker v-model="config.wave.waveColor.value" />
        </g-field>
        <g-field v-if="config.wave.waveColor.type === 'gradient'" :level="2" label="开始颜色">
          <g-color-picker v-model="config.wave.waveColor.from" />
        </g-field>
        <g-field v-if="config.wave.waveColor.type === 'gradient'" :level="2" label="结束颜色">
          <g-color-picker v-model="config.wave.waveColor.to" />
        </g-field>
      </g-field-collapse>
      <g-field-collapse label="波浪动画">
        <g-field :level="2" label="播放动画">
          <n-switch v-model:value="config.wave.animate.enable" />
        </g-field>
        <g-field :level="2" label="播放频率">
          <g-input-number v-model="config.wave.animate.dur" :min="0" :max="100" :step="0.1" suffix="秒" />
        </g-field>
      </g-field-collapse>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
  fontFamilys,
  selectSuggests,
  echartsLablePositions,
  fontWeights,
  axisTypes,
  titleLocations,
  lineStyles,
  timeFormats,
  hAligns,
  valueFormats,
  legendLocations,
  orients,
  legendIcons,
  fillTypes,
  animationEasings,
  shapeTypes
} from '@/data/select-options'
import { SvgReservoir } from './svg-reservoir'

export default defineComponent({
  name: 'VSvgReservoirProp',
  props: {
    com: {
      type: Object as PropType<SvgReservoir>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,
      fontFamilys,
      selectSuggests,
      echartsLablePositions,
      fontWeights,
      axisTypes,
      titleLocations,
      lineStyles,
      timeFormats,
      hAligns,
      valueFormats,
      legendLocations,
      orients,
      legendIcons,
      fillTypes,
      animationEasings,
      shapeTypes
    }
  },
})
</script>
