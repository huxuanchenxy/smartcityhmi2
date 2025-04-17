<template>
  <div class="datav-wrapper" :style="titleStyle">
    <template v-if="urlText">
      <a :href="urlText" :target="urlTarget" :style="urlStyle">
        {{ titleText }}
      </a>
    </template>
    <template v-else>
      <span :style="wordStyle">
        {{ titleText }}
      </span>
    </template>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  PropType,
  computed,
  toRef,
  getCurrentInstance,
} from 'vue'
import type { CSSProperties } from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { MainTitle } from './main-title'
import { useEventCenter } from '@/mixins/event-center'
import { IcHandleItemField } from '@/components/data-handle'
import { JSONPath } from 'jsonpath-plus'
import { setNP } from '@/utils/util'
import { DatavError } from '@/domains/error'

export default defineComponent({
  name: 'VMainTitle',
  props: {
    com: {
      type: Object as PropType<MainTitle>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)

    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    // //点位联动事件 ic_event
    // mitter.on(props.com.id, (field: IcHandleItemField) => {
    //   switch (field.targetMethodName) {
    //     case 'property':
    //       if (field.bindType == "bind") {
    //         setNP(props.com, field.targetProperty, field.value);
    //       }
    //       else{ // bindType = condition
    //         if (field.hasDecideScript && field.decideScript) {
    //           try {
    //             const func = new Function("data,com,path,setNP", field.decideScript);
    //             func(field.value, props.com, field.targetProperty, setNP);
    //           } catch (error) {
    //             throw new DatavError("过滤条件执行失败", error.toString(), {
    //               targetId: props.com.id,
    //               origin: error
    //             });
    //           }
    //         } else {
    //           //console.log("未编写执行语句");
    //         }
    //       }
    //       break
    //   }
    //   //TODO
    // })

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const titleStyle = computed(() => {
      let animation = 'none';
      if (!config.value.animation) {
        config.value.animation = {
          enable: false,
          name: "Updown",
          duration: 1000,
          timing: "linear",
          delay: 0,
          iteration: "infinite",
          direction: "alternate"
        }
      }

      if (config.value.animation.enable) {
        animation = config.value.animation.name + ' '
          + config.value.animation.duration + 'ms '
          + config.value.animation.timing + ' '
          + config.value.animation.delay + 'ms '
          + config.value.animation.iteration + ' '
          + config.value.animation.direction;
      }


      const style = {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        'font-family': `${config.value.textStyle.fontFamily}, Arial, sans-serif`,
        'font-size': `${config.value.textStyle.fontSize}px`,
        'font-weight': config.value.textStyle.fontWeight,
        'justify-content': config.value.textAlign,
        'writing-mode': config.value.writingMode,
        'letter-spacing': `${config.value.letterSpacing}px`,
        'background-color': 'initial',
        border: 'none',
        'border-radius': '0px',
        transform: 'translateZ(0px)',
        display: 'flex',
        'align-items': 'center',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
        overflow: 'hidden',
        cursor: config.value.cursor,
        animation: animation
      }

      if (config.value.backgroundStyle.show) {
        const bgs = config.value.backgroundStyle
        style['background-color'] = bgs.bgColor
        style.border = `${bgs.borderWidth}px ${bgs.borderStyle} ${bgs.borderColor}`
        style['border-radius'] = `${bgs.borderRadius}px`
      }

      return style as CSSProperties
    })

    const wordStyle = computed(() => {
      const style = {
        color: config.value.textStyle.color,
        overflow: 'unset',
        'text-overflow': 'unset',
        'white-space': 'unset',
        'background-image': 'none',
        'background-clip': 'unset',
        '-webkit-text-fill-color': 'initial',
      }

      if (config.value.ellipsis) {
        style.overflow = 'hidden'
        style['text-overflow'] = 'ellipsis'
        style['white-space'] = 'nowrap'
      }

      return style as CSSProperties
    })

    const urlStyle = computed(() => {
      const style = {
        display: 'block',
        'text-decoration': 'none',
        color: config.value.textStyle.color,
        overflow: 'unset',
        'text-overflow': 'unset',
        'white-space': 'unset',
        'background-image': 'none',
        'background-clip': 'unset',
        '-webkit-text-fill-color': 'initial',
      }

      if (config.value.ellipsis) {
        style.overflow = 'hidden'
        style['text-overflow'] = 'ellipsis'
        style['white-space'] = 'nowrap'
      }

      return style as CSSProperties
    })

    const titleText = computed(() => {
      return dv_data.value[dv_field.value.title] ?? config.value.title
    })

    const urlText = computed(() => {
      return dv_data.value[dv_field.value.url] ?? config.value.urlConfig.url
    })

    const urlTarget = computed(() =>
      config.value.urlConfig.isBlank ? '_blank' : '_self',
    )

    return {
      titleStyle,
      wordStyle,
      urlStyle,
      titleText,
      urlText,
      urlTarget,
    }
  },
})
</script>
