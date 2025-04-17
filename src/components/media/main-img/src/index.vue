<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <a v-if="config.urlConfig.url" :href="config.urlConfig.url" :target="config.urlConfig.ifBlank ? '_blank' : '_self'"
      style="display: block; width: 100%; height: 100%;"></a>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef} from 'vue'
import type { CSSProperties } from 'vue'
import { MainImg } from './main-img'
import { useEventCenter } from '@/mixins/event-center'

export default defineComponent({
  name: 'VMainImg',
  props: {
    com: {
      type: Object as PropType<MainImg>,
      required: true,
    },
  },
  setup(props) {

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    useEventCenter(props.com)

    const show = computed(() => {
      return config.value.show
    })

    const wrapperStyle = computed(() => {
      const isVector = config.value.imageType === 'vector'
      let background = `url(${config.value.backgroundImage}) 0% 0% / `
      let maskSize = ''
      if (config.value.repeat === 'repeat') {
        background += 'auto repeat'
        maskSize = 'auto'
      } else if (config.value.repeat === 'repeat-x') {
        background += 'auto 100% repeat-x'
        maskSize = 'auto 100%'
      } else if (config.value.repeat === 'repeat-y') {
        background += '100% repeat-y'
        maskSize = '100%'
      } else {
        background += '100% 100% no-repeat'
        maskSize = '100% 100%'
      }

      let animation = 'none';
      if (!config.value.animation) {
        config.value.animation = {
          enable: false,
          name: "Updown",
          duration: 1000,
          timing: "linear",
          delay: 0,
          iteration: "infinite",
          direction: "alternate",
          state: "running"
        }
      }

      if (config.value.animation.enable) {
        animation = config.value.animation.name + ' '
          + config.value.animation.duration + 'ms '
          + config.value.animation.timing + ' '
          + config.value.animation.delay + 'ms '
          + config.value.animation.iteration + ' '
          + config.value.animation.direction + ' '
      }

      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        'image-rendering': '-webkit-optimize-contrast',
        background: isVector ? config.value.vectorFill : background,
        '-webkit-mask-image': isVector ? `url(${config.value.vectorImage})` : 'none',
        '-webkit-mask-repeat': isVector ? config.value.repeat : 'initial',
        '-webkit-mask-size': isVector ? maskSize : 'initial',
        'border-radius': `${config.value.radius}px`,
        cursor: config.value.cursor ? 'pointer' : 'default',
        animation: animation,
        '-webkit-animation-play-state': config.value.animation.state,
        '-moz-animation-play-state': config.value.animation.state
      } as CSSProperties
    })

    return {
      show,
      config,
      wrapperStyle,
    }
  },
})
</script>
