<template>
  <svg :width="com.attr.w" :height="com.attr.h">
    <defs>
      <linearGradient :id="'wave_' + com.id" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop :key="config.wave.waveColor.from" offset="0%" :stop-color="config.wave.waveColor.from" />
        <stop :key="config.wave.waveColor.to" offset="100%" :stop-color="config.wave.waveColor.to" />
      </linearGradient>
      <linearGradient :id="'bg_' + com.id" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop :key="config.bgColor.from" offset="0%" :stop-color="config.bgColor.from" />
        <stop :key="config.bgColor.to" offset="100%" :stop-color="config.bgColor.to" />
      </linearGradient>

      <mask :id="'mask_' + com.id" x="0" y="0" :width="com.attr.w" :height="com.attr.h">
        <rect x="0" y="0" :width="com.attr.w" :height="com.attr.h" fill="white">
        </rect>
        <ellipse v-if="!config.shape || config.shape === 'round'" :cx="com.attr.w / 2" :cy="com.attr.h / 2"
          :rx="com.attr.w / 2" :ry="com.attr.h / 2" fill="black"
          :stroke-width="config.border.width" :stroke="config.border.color" :mask="`url(#${'mask_' + com.id})`"/>
        <rect v-else="" x="0" y="0" :rx="config.shape === 'roundRect' ? 20 : 0"
          :ry="config.shape === 'roundRect' ? 20 : 0" :width="com.attr.w" :height="com.attr.h" fill="black"
          :stroke-width="config.border.width" :stroke="config.border.color" :mask="`url(#${'mask_' + com.id})`">
        </rect>
      </mask>
    </defs>
    <g>
      <foreignObject v-if="config.shape === 'custom'" x="0" y="0" :width="com.attr.w" :height="com.attr.h">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%">
          <div class="datav-wrapper" :style="imgStyle">
          </div>
        </div>
      </foreignObject>
      <rect v-else="" x="0" y="0" :width="com.attr.w" :height="com.attr.h" :fill="config.bgColor.type == 'solid' ? config.bgColor.value : `url(#${'bg_' + com.id})`">
      </rect>
    </g>
    <g>
      <path :d="wave"
        :fill="config.wave.waveColor.type == 'solid' ? config.wave.waveColor.value : `url(#${'wave_' + com.id})`"
        :fill-opacity="config.wave.waveOpacity" />
      <animateTransform v-if="config.wave.animate.enable" attributeName="transform" attributeType="XML" type="translate"
        from="0" :to="-animationWidth" :dur="config.wave.animate.dur + 's'" repeatCount="indefinite">
      </animateTransform>
    </g>
    <g>
      <rect x="0" y="0" :width="com.attr.w" :height="com.attr.h"
        :fill="config.bgColor.type == 'solid' ? config.bgColor.value : `url(#${'bg_' + com.id})`"
        :mask="`url(#${'mask_' + com.id})`">
      </rect>
      <ellipse v-if="!config.shape || config.shape === 'round'" :cx="com.attr.w / 2" :cy="com.attr.h / 2"
          :rx="com.attr.w / 2" :ry="com.attr.h / 2" fill="none"
          :stroke-width="config.border.width" :stroke="config.border.color"/>
        <rect v-else="" x="0" y="0" :rx="config.shape === 'roundRect' ? 20 : 0"
          :ry="config.shape === 'roundRect' ? 20 : 0" :width="com.attr.w" :height="com.attr.h" fill="none"
          :stroke-width="config.border.width" :stroke="config.border.color">
        </rect>

      <text v-if="config.text.enable" :fill="config.text.color" :x="com.attr.w / 2" :y="com.attr.h / 2"
        text-anchor="middle" dominant-baseline="middle"
        :style="textTypeStyle">
        {{ config.currentValue + ' ' + config.formatter }}
      </text>
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef, ref, getCurrentInstance, CSSProperties } from 'vue'
import { SvgReservoir } from './svg-reservoir'
import { useEventCenter } from '@/mixins/event-center'
import { FontWeightProperty } from 'csstype'


export default defineComponent({
  name: 'VSvgReservoir',
  props: {
    com: {
      type: Object as PropType<SvgReservoir>,
      required: true,
    },
  },
  setup(props) {
    useEventCenter(props.com)
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')
    const svgElement = ref(null)
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    const viewBox = computed(() => {
      return '0 0 ' + props.com.attr.w + ' ' + props.com.attr.h;
    })

    const wraperStyle = computed(() => {
      const style = {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }

      return style
    })

    const imgStyle = computed(() => {
      let background = `url(${config.value.imgStyle.backgroundImage}) 0% 0% / `
      if (config.value.imgStyle.repeat === 'repeat') {
        background += 'auto repeat'
      } else if (config.value.imgStyle.repeat === 'repeat-x') {
        background += 'auto 100% repeat-x'
      } else if (config.value.imgStyle.repeat === 'repeat-y') {
        background += '100% repeat-y'
      } else {
        background += '100% 100% no-repeat'
      }

      return {
        width: `${props.com.attr.w}px`,
        height: `${props.com.attr.h}px`,
        'image-rendering': '-webkit-optimize-contrast',
        background: background,
        '-webkit-mask-image': 'none',
        '-webkit-mask-repeat': 'initial',
        '-webkit-mask-size': 'initial',
        'border-radius': `${config.value.imgStyle.radius}px`,
        borderWidth: `${config.value.border.width}`,
        borderColor: `${config.value.border.color}`,
        cursor: 'default'
      } as CSSProperties
    })

    const animationWidth = computed(() => {
      return 6 * Math.ceil(props.com.attr.w / (props.com.config.wave.waveNum * 6))
    })

    const wave = computed(() => {
      let startY = Math.round((props.com.attr.h * (props.com.config.maxValue - props.com.config.currentValue)) / props.com.config.maxValue)
      let lineHeight = Math.round((props.com.attr.h * props.com.config.currentValue) / props.com.config.maxValue)

      let stepWidth = Math.ceil(props.com.attr.w / (props.com.config.wave.waveNum * 6))

      let lineLength = stepWidth * 6 * (props.com.config.wave.waveNum + 1)

      let waveTop = props.com.config.wave.waveHeight
      let waveBottom = -props.com.config.wave.waveHeight
      let d = "M 0 " + startY
      for (let i = 0; i < props.com.config.wave.waveNum; i++) {
        d += "c " + stepWidth + " " + waveBottom + " " + 2 * stepWidth + " " + waveBottom + " " + 3 * stepWidth + " " + 0
        d += "c " + stepWidth + " " + waveTop + " " + 2 * stepWidth + " " + waveTop + " " + 3 * stepWidth + " " + 0
      }
      if (props.com.config.wave.waveNum > 0) {
        d += "c " + stepWidth + " " + waveBottom + " " + 2 * stepWidth + " " + waveBottom + " " + 3 * stepWidth + " " + 0
        d += "c " + stepWidth + " " + waveTop + " " + 2 * stepWidth + " " + waveTop + " " + 3 * stepWidth + " " + 0
      }
      d += "l 0 " + lineHeight
      d += "l " + (-lineLength) + " 0"
      d += "Z";
      return d;
    })

    const textTypeStyle = computed(() => {
      let style = {
        'font-size': `${config.value.text.fontSize}px`,
        'font-weight': config.value.text.fontWeight,
      }
      return style as CSSProperties
    })


    return {
      config,
      wraperStyle,
      svgElement,
      viewBox,
      wave,
      animationWidth,
      imgStyle,
      textTypeStyle
    }
  },
})
</script>
