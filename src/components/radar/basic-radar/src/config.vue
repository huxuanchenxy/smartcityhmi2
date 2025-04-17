<template>
  <div class="setting-panel-gui">
    <g-field label="初始角度">
      <g-input-number
        v-model="config.startAngle"
        :min="0"
        :max="360"
        :step="1"
        suffix="度"
      />
    </g-field>
    <g-field label="雷达链数量">
      <g-input-number
        v-model="config.splitNumber"
        :min="1"
        :max="100"
        :step="1"
      />
    </g-field>
    <g-field label="雷达形状">
      <g-select
        v-model="config.shape"
        :data="[
          { id: 'polygon', value: '多边形' },
          { id: 'circle', value: '圆形' }
        ]"
      />
    </g-field>
    <!-- <g-field label="雷达颜色">
      <g-color-picker v-model="config.splitAreaStyle.color" />
    </g-field> -->
    <g-field-collapse label="雷达样式">
      <g-field :level="2" label="颜色">
        <g-color-picker v-model="config.splitAreaStyle.color" />
      </g-field>
      <g-field :level="2" label="阴影颜色">
        <g-color-picker v-model="config.splitAreaStyle.shadowColor" />
      </g-field>
      <g-field :level="2" label="阴影长度">
        <g-input-number
          v-model="config.splitAreaStyle.shadowBlur"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field-collapse v-model="config.splitLine.show" :toggle="true" label="间隔线">
        <g-field :level="2" label="颜色">
          <g-color-picker v-model="config.splitLine.lineStyle.color" />
        </g-field>
        <g-field :level="2" label="宽度">
          <g-input-number
            v-model="config.splitLine.lineStyle.width"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
        <g-field :level="2" label="类型">
          <g-select v-model="config.splitLine.lineStyle.type" :data="lineStyles" />
        </g-field>
      </g-field-collapse>
    </g-field-collapse>
    <g-field-collapse v-model="config.axisName.show" :toggle="true" label="刻度名称">
      <g-field :level="2" label="格式">
        <g-input v-model="config.axisName.formatter" />
      </g-field>
      <g-field :level="2" label="颜色">
        <g-color-picker v-model="config.axisName.color" />
      </g-field>
      <g-field :level="2" label="风格">
        <g-select v-model="config.axisName.fontStyle" :data="fontStyles" />
      </g-field>
      <g-field :level="2" label="粗细">
        <g-select v-model="config.axisName.fontWeight" :data="fontWeights" />
      </g-field>
      <g-field :level="2" label="字体">
        <g-select v-model="config.axisName.fontFamily" :data="fontFamilys" />
      </g-field>
      <g-field :level="2" label="大小">
        <g-input-number
          v-model="config.axisName.fontSize"
          :min="7"
          :max="100"
          :step="1"
          suffix="pt"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse v-model="config.axisLine.show" :toggle="true" label="刻度线">
      <g-field :level="2" label="颜色">
        <g-color-picker v-model="config.axisLine.lineStyle.color" />
      </g-field>
      <g-field :level="2" label="宽度">
        <g-input-number
          v-model="config.axisLine.lineStyle.width"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field :level="2" label="类型">
        <g-select v-model="config.axisLine.lineStyle.type" :data="lineStyles" />
      </g-field>
      <g-field :level="2" label="透明度">
        <g-input-number
          v-model="config.axisLine.lineStyle.opacity"
          :min="0"
          :max="1"
          :step="0.1"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="区域">
      <g-field :level="2" label="数据点颜色">
        <g-color-picker v-model="config.color" />
      </g-field>
      <g-field :level="2" label="数据点大小">
        <g-input-number
          v-model="config.dataArea.symbolSize"
          :min="0"
          :max="100"
          :step="1"
        />
        <!-- <g-input v-model="config.dataArea.symbolSize" /> -->
      </g-field>
      <g-field :level="2" label="数据点类型">
        <g-select
          v-model="config.dataArea.symbol"
          :data="[
            { id: 'circle', value: '圆形' },
            { id: 'rect', value: '方形' },
            { id: 'roundRect', value: '圆形方形' },
            { id: 'triangle', value: '三角形' },
            { id: 'diamond', value: '钻石' },
            { id: 'pin', value: '针' },
            { id: 'arrow', value: '箭头' },
            { id: 'none', value: '无' }
          ]"
        />
      </g-field>
      <g-field :level="2" label="区域颜色">
        <g-color-picker v-model="config.dataArea.areaStyle.color" />
      </g-field>
      <g-field-collapse label="轮廓线样式">
        <g-field :level="2" label="颜色">
          <g-color-picker v-model="config.dataArea.lineStyle.color" />
        </g-field>
        <g-field :level="2" label="宽度">
          <g-input-number
            v-model="config.dataArea.lineStyle.width"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
        <g-field :level="2" label="类型">
          <g-select v-model="config.dataArea.lineStyle.type" :data="lineStyles" />
        </g-field>
        <g-field :level="2" label="阴影颜色">
          <g-color-picker v-model="config.dataArea.lineStyle.shadowColor" />
        </g-field>
        <g-field :level="2" label="阴影长度">
          <g-input-number
            v-model="config.dataArea.lineStyle.shadowBlur"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
      </g-field-collapse>
    </g-field-collapse>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from 'vue'
import { fontStyles, fontWeights, fontFamilys, lineStyles } from '@/data/select-options'
import { BasicRadar } from './basic-radar'

export default defineComponent({
  name: 'VBasicRadarProp',
  props: {
    com: {
      type: Object as PropType<BasicRadar>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,
      fontStyles,
      fontWeights,
      fontFamilys,
      lineStyles,
    }
  },
})
</script>
