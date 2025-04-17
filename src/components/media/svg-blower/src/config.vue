<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="风扇设置">
      <g-field :level="2" label="播放动画">
        <n-switch v-model:value="config.fan.animate.enable" />
      </g-field>
      <g-field :level="2" label="旋转方向">
        <n-radio-group v-model:value="config.fan.direction" size="small">
          <n-radio-button v-for="em in rotateDirection" :key="em.id" :value="em.id">
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field :level="2" label="转速(圈/秒)">
        <g-input-number v-model="config.fan.animate.dur" :min="0" :step="1" suffix="" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="主体颜色">
      <g-field :level="2" label="填充类型">
        <n-radio-group v-model:value="config.color1.type" size="small">
          <n-radio-button v-for="em in fillTypes" :key="em.id" :value="em.id">
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field v-if="config.color1.type === 'solid'" :level="2" label="颜色">
        <g-color-picker v-model="config.color1.value" />
      </g-field>
      <g-field v-if="config.color1.type === 'gradient'" :level="2" label="开始颜色">
        <g-color-picker v-model="config.color1.from" />
      </g-field>
      <g-field v-if="config.color1.type === 'gradient'" :level="2" label="结束颜色">
        <g-color-picker v-model="config.color1.to" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="管体颜色">
      <g-field :level="2" label="填充类型">
        <n-radio-group v-model:value="config.color2.type" size="small">
          <n-radio-button v-for="em in fillTypes" :key="em.id" :value="em.id">
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field v-if="config.color2.type === 'solid'" :level="2" label="颜色">
        <g-color-picker v-model="config.color2.value" />
      </g-field>
      <g-field v-if="config.color2.type === 'gradient'" :level="2" label="开始颜色">
        <g-color-picker v-model="config.color2.from" />
      </g-field>
      <g-field v-if="config.color2.type === 'gradient'" :level="2" label="结束颜色">
        <g-color-picker v-model="config.color2.to" />
      </g-field>
    </g-field-collapse>

    <g-field-collapse label="风扇边框色">
      <g-field :level="2" label="填充类型">
        <n-radio-group v-model:value="config.color3.type" size="small">
          <n-radio-button v-for="em in fillTypes" :key="em.id" :value="em.id">
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field v-if="config.color3.type === 'solid'" :level="2" label="颜色">
        <g-color-picker v-model="config.color3.value" />
      </g-field>
      <g-field v-if="config.color3.type === 'gradient'" :level="2" label="开始颜色">
        <g-color-picker v-model="config.color3.from" />
      </g-field>
      <g-field v-if="config.color3.type === 'gradient'" :level="2" label="结束颜色">
        <g-color-picker v-model="config.color3.to" />
      </g-field>
    </g-field-collapse>

    <g-field-collapse label="风扇背景色">
      <g-field :level="2" label="填充类型">
        <n-radio-group v-model:value="config.color4.type" size="small">
          <n-radio-button v-for="em in fillTypes" :key="em.id" :value="em.id">
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field v-if="config.color4.type === 'solid'" :level="2" label="颜色">
        <g-color-picker v-model="config.color4.value" />
      </g-field>
      <g-field v-if="config.color4.type === 'gradient'" :level="2" label="开始颜色">
        <g-color-picker v-model="config.color4.from" />
      </g-field>
      <g-field v-if="config.color4.type === 'gradient'" :level="2" label="结束颜色">
        <g-color-picker v-model="config.color4.to" />
      </g-field>
    </g-field-collapse>

    <g-field-collapse label="圆盘点缀颜色">
      <g-field :level="2" label="填充类型">
        <n-radio-group v-model:value="config.color5.type" size="small">
          <n-radio-button v-for="em in fillTypes" :key="em.id" :value="em.id">
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field v-if="config.color5.type === 'solid'" :level="2" label="颜色">
        <g-color-picker v-model="config.color5.value" />
      </g-field>
      <g-field v-if="config.color5.type === 'gradient'" :level="2" label="开始颜色">
        <g-color-picker v-model="config.color5.from" />
      </g-field>
      <g-field v-if="config.color5.type === 'gradient'" :level="2" label="结束颜色">
        <g-color-picker v-model="config.color5.to" />
      </g-field>
    </g-field-collapse>

    <g-field-collapse label="圆心颜色">
      <g-field :level="2" label="填充类型">
        <n-radio-group v-model:value="config.color6.type" size="small">
          <n-radio-button v-for="em in fillTypes" :key="em.id" :value="em.id">
            {{ em.value }}
          </n-radio-button>
        </n-radio-group>
      </g-field>
      <g-field v-if="config.color6.type === 'solid'" :level="2" label="颜色">
        <g-color-picker v-model="config.color6.value" />
      </g-field>
      <g-field v-if="config.color6.type === 'gradient'" :level="2" label="开始颜色">
        <g-color-picker v-model="config.color6.from" />
      </g-field>
      <g-field v-if="config.color6.type === 'gradient'" :level="2" label="结束颜色">
        <g-color-picker v-model="config.color6.to" />
      </g-field>
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
  shapeTypes,
  rotateDirection
} from '@/data/select-options'
import { SvgBlower } from './svg-blower'

export default defineComponent({
  name: 'VSvgBlowerProp',
  props: {
    com: {
      type: Object as PropType<SvgBlower>,
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
      shapeTypes,
      rotateDirection
    }
  },
})
</script>
