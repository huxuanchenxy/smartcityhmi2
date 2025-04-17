<template>
  <div class="datav-wrapper" :style="boxStyle">
    <div :style="p.selected ? selectedItemStyle : itemStyle" v-for="(p, index) in flexBoxData" :key="index">
      <img :src="p.icon" :style="iconStyle" />
      <template v-if="urlConfig.show">
        <a :href="p.url" :target="urlConfig.isBlank ? '_blank' : '_self'" :style="urlStyle">
          {{ p.text }}
        </a>
      </template>
      <template v-else>
        <span :style="p.selected ? selectedWordStyle : wordStyle" @click="itemClick(p, index)">
          {{ p.text }}
        </span>
      </template>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  PropType,
  computed,
  toRef,
} from 'vue'
import type { CSSProperties } from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { FlexTextBox } from './flex-text-box'
import { useEventCenter } from '@/mixins/event-center'
import { getCurrentInstance } from 'vue'
import { HandleItemField } from '@/components/data-handle'
import { DatavError } from '@/domains/error'

export default defineComponent({
  name: 'VFlexTextBox',
  props: {
    com: {
      type: Object as PropType<FlexTextBox>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)

    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case 'clearSelected':
          flexBoxData.value.forEach((r, idx) => {
            r.selected = false;
          });
          break
      }
    })

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const boxStyle = computed(() => {
      const style = {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        display: 'flex',
        'flex-direction': config.value.flex.flexDirection,
        'flex-wrap': config.value.flex.flexWrap,
        'justify-content': config.value.flex.justifyContent,
        'align-items': config.value.flex.alignItems,
        'align-content': config.value.flex.alignContent,
        transform: 'translateZ(0px)',
        'background-color': 'initial',
        border: 'none',
        'border-radius': '0px',
        overflow: 'auto'
      }
      if (config.value.backgroundStyle.show) {
        const bgs = config.value.backgroundStyle
        style['background-color'] = bgs.bgColor
        style.border = `${bgs.borderWidth}px ${bgs.borderStyle} ${bgs.borderColor}`
        style['border-radius'] = `${bgs.borderRadius}px`
      }

      return style as CSSProperties
    })

    const itemStyle = computed(() => {
      const style = {
        display: 'flex',
        'flex-direction': 'row',
        'align-items': 'center',
        'justify-content': config.value.textStyle.textAlign,
        width: `${config.value.flexItem.width}px`,
        height: `${config.value.flexItem.height}px`,
        padding: config.value.flexItem.padding,
        margin: config.value.flexItem.margin,
        'background-color': 'initial',
        border: 'none',
        'border-radius': '0px',
      };

      if (config.value.itemBackgroundStyle.show) {
        const bgs = config.value.itemBackgroundStyle
        style['background-color'] = bgs.bgColor
        style.border = `${bgs.borderWidth}px ${bgs.borderStyle} ${bgs.borderColor}`
        style['border-radius'] = `${bgs.borderRadius}px`
      }

      return style as CSSProperties
    })

    const selectedItemStyle = computed(() => {
      const style = {
        display: 'flex',
        'flex-direction': 'row',
        'align-items': 'center',
        'justify-content': config.value.selectedStyle.textAlign,
        width: `${config.value.flexItem.width}px`,
        height: `${config.value.flexItem.height}px`,
        padding: config.value.flexItem.padding,
        margin: config.value.flexItem.margin,
        'background-color': 'initial',
        border: 'none',
        'border-radius': '0px',
      };

      if (config.value.selectedStyle.show) {
        const bgs = config.value.selectedStyle
        style['background-color'] = bgs.bgColor
        style.border = `${bgs.borderWidth}px ${bgs.borderStyle} ${bgs.borderColor}`
        style['border-radius'] = `${bgs.borderRadius}px`
      }

      return style as CSSProperties
    })

    const iconStyle = computed(() => {
      const style = {
        width: `${config.value.iconStyle.width}px`,
        height: `${config.value.iconStyle.height}px`,
        repeat: "no-repeat",
        display: 'unset',
        'margin-right': '8px'
      };

      if (!config.value.iconStyle.show) {
        style.display = 'none';
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
        'font-family': `${config.value.textStyle.fontFamily}, Arial, sans-serif`,
        'font-size': `${config.value.textStyle.fontSize}px`,
        'font-weight': config.value.textStyle.fontWeight,
        // 'justify-content': config.value.textStyle.textAlign,
        'writing-mode': config.value.textStyle.writingMode,
        'letter-spacing': `${config.value.textStyle.letterSpacing}px`,
        'line-height': `${config.value.iconStyle.height}px`,
        cursor: config.value.cursor,
      }

      if (config.value.textStyle.ellipsis) {
        style.overflow = 'hidden'
        style['text-overflow'] = 'ellipsis'
        style['white-space'] = 'nowrap'
      }

      return style as CSSProperties
    })

    const selectedWordStyle = computed(() => {
      const style = {
        color: config.value.selectedStyle.color,
        overflow: 'unset',
        'text-overflow': 'unset',
        'white-space': 'unset',
        'background-image': 'none',
        'background-clip': 'unset',
        '-webkit-text-fill-color': 'initial',
        'font-family': `${config.value.selectedStyle.fontFamily}, Arial, sans-serif`,
        'font-size': `${config.value.selectedStyle.fontSize}px`,
        'font-weight': config.value.selectedStyle.fontWeight,
        // 'justify-content': config.value.selectedStyle.textAlign,
        'writing-mode': config.value.selectedStyle.writingMode,
        'letter-spacing': `${config.value.selectedStyle.letterSpacing}px`,
        'line-height': `${config.value.iconStyle.height}px`,
        cursor: config.value.cursor,
      }

      if (config.value.selectedStyle.ellipsis) {
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

      if (config.value.textStyle.ellipsis) {
        style.overflow = 'hidden'
        style['text-overflow'] = 'ellipsis'
        style['white-space'] = 'nowrap'
      }

      return style as CSSProperties
    })


    const urlConfig = computed(() => {
      return config.value.urlConfig;
    })

    const flexBoxData = computed(() => {
      return dv_data.value;
    })

    const comEvent = (fields: HandleItemField[]) => {
      fields.forEach(field => {
        // emit自定义事件
        mitter.emit(field.targetComId, field)
      })
    }

    const itemClick = (item: any, index: number) => {
      if (props.com.config.multiSelected) {
        flexBoxData.value[index].selected = true;
      }
      else {
        flexBoxData.value.forEach((r, idx) => {
          r.selected = false;
        });
        flexBoxData.value[index].selected = true;
      }


      if (urlConfig.value.show && urlConfig.value.isLocationHref) {
        if (item.url) {
          window.location.href = item.url;
        }
      }
      else {
        // let fileds = props.com.handles.itemClick.fields
        // fileds.forEach(r => r.value = item)
        // comEvent(fileds)

        //如果有载入事件
        props.com.handles.itemClick.fields.forEach(field => {
          field.value = item;

          if (field.hasDecideScript) {
            if (field.decideScript) {
              try {
                const func = new Function("data,com", field.decideScript);
                const decideRes: boolean = func(field.value, props.com);
                if (decideRes) {
                  // emit自定义事件
                  mitter.emit(field.targetComId, field);
                } else {
                  //console.log("未满足触发条件：" + field.targetComId);
                }
              } catch (error) {
                throw new DatavError("过滤条件执行失败", error.toString(), {
                  targetId: props.com.id,
                  origin: error
                });
              }
            } else {
              //console.log("未编写执行语句");
            }
          } else {
            mitter.emit(field.targetComId, field);
          }
        });
      }
    }
    return {
      boxStyle,
      itemStyle,
      selectedItemStyle,
      iconStyle,
      wordStyle,
      selectedWordStyle,
      urlStyle,
      urlConfig,
      flexBoxData,
      itemClick
    }
  },
})
</script>
