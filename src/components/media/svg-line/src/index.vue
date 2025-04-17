<template>
  <!-- <div class="datav-wrapper" > -->
  <svg xmlns="http://www.w3.org/2000/svg" :style="wraperStyle" @contextmenu="showContextMenu" ref="svgElement"
    @mouseenter="onSvgMouseEnter" @mouseleave="onSvgMouseLeave">
    <g>
      <path :id="com.id" :d="positionArrarToPath(config.props.pointPosition)" fill="none"
        :stroke="config.animations?.type === 'Electricity' ? config.animations.color : config.props.stroke"
        :stroke-width="(config.animations?.type === 'CustomTrack' && config.imgStyle.hideLine) ? 0 : config.props.strokeWidth"
        stroke-dashoffset="0"
        :stroke-dasharray="config.animations?.type === 'Electricity' ? config.props.strokeWidth * 3 : 0">
        <animate v-if="config.animations?.type === 'Electricity'" attributeName="stroke-dashoffset"
          :from="config.animations.reverse ? 0 : 1000" :to="config.animations.reverse ? 1000 : 0"
          :dur="`${config.animations.dur}s`" :repeatCount="config.animations.repeatCount.val" />
      </path>
      <!-- 水珠 -->
      <path v-if="config.animations?.type === 'WaterDrop'" :d="positionArrarToPath(config.props.pointPosition)"
        fill="none" fill-opacity="0" :stroke="config.animations.color" :stroke-width="config.props.strokeWidth"
        :stroke-dasharray="config.props.strokeWidth * 3" stroke-dashoffset="0" stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" :from="config.animations.reverse ? 0 : 1000"
          :to="config.animations.reverse ? 1000 : 0" :dur="`${config.animations.dur}s`"
          :repeatCount="config.animations.repeatCount.val" fill="freeze" />
      </path>
      <!-- 轨迹 -->
      <circle v-else-if="config.animations?.type === 'Track'" cx="0" cy="0" :r="config.props.strokeWidth * 2"
        :fill="config.animations.color">
        <animateMotion :path="
          positionArrarToPath(
            config.animations.reverse
              ? [...config.props.pointPosition].reverse()
              : config.props.pointPosition
          )
        " :dur="`${config.animations.dur}s`" :repeatCount="config.animations.repeatCount.val">
        </animateMotion>
      </circle>
      <g v-else-if="config.animations?.type === 'CustomTrack'">
        <foreignObject :x="-config.imgStyle.width / 2" :y="-config.imgStyle.height / 2" :width="config.imgStyle.width"
          :height="config.imgStyle.height">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%">
            <div class="datav-wrapper" :style="imgStyle">
            </div>
          </div>
        </foreignObject>
        <animateMotion :path="
          positionArrarToPath(
            config.animations.reverse
              ? [...config.props.pointPosition].reverse()
              : config.props.pointPosition
          )
        " :dur="`${config.animations.dur}s`" :repeatCount="config.animations.repeatCount.val"
          :rotate="config.animations.rotate ? 'auto' : 0" fill="freeze">
        </animateMotion>
      </g>
      <!-- 更改线段 -->
      <g v-if="config.pointVisiable">
        <circle v-for="(item, index) in config.props.pointPosition" :key="index" :cx="item.x" :cy="item.y" r="8"
          stroke-width="1" :stroke="config.props.stroke" fill="#fff" style="cursor: pointer"
          @mousedown="setConnectionLineNode(index, $event, item.x, item.y)" @dblclick="deleteNode(index)" />
      </g>
    </g>
  </svg>
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef, ref, getCurrentInstance, onMounted, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { SvgLine } from './Svg-line'
import { useEventCenter } from '@/mixins/event-center'
import { EditorModule } from '@/store/modules/editor'
import { useContextMenu } from '../../../../../src/views/screen-editor/editor-context-menu';
import { HandleItemField } from '@/components/data-handle'


export default defineComponent({
  name: 'VSvgLine',
  props: {
    com: {
      type: Object as PropType<SvgLine>,
      required: true,
    },
  },
  setup(props) {
    useEventCenter(props.com)
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')
    const { showMenu, hideMenu } = useContextMenu()

    const svgElement = ref(null);
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    onMounted(() => {
      if (config.value.animations.enable) {
        play();
      }
      else {
        pause();
      }
    })

    watch(() => config.value.animations.enable, (newVal, oldVal) => {
      if (newVal) {
        play();
      }
      else {
        pause();
      }
    })

    const wraperStyle = computed(() => {
      const style = {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }

      return style
    })

    const positionArrarToPath = (position_arr: { x: number; y: number }[]) => {
      let path_str = '';
      for (let index = 0; index < position_arr.length; index++) {
        if (index === 0) {
          path_str += `M ${position_arr[index].x} ${position_arr[index].y}`;
        } else {
          path_str += ` L ${position_arr[index].x} ${position_arr[index].y}`;
        }
      }
      return path_str;
    };

    const setConnectionLineNode = (point_index: number, e: MouseEvent, x: number, y: number) => {

      props.com.config.action.state = "Down";
      props.com.config.action.index = point_index;

    };

    const deleteNode = (point_index: number) => {
      if (props.com.config.props.pointPosition.length > 1) {
        props.com.config.props.pointPosition.splice(point_index, 1);
      }

    }

    const onSvgMouseEnter = (e: MouseEvent) => {
      if (EditorModule.editMode) {
        config.value.pointVisiable = true;
      }

      e.preventDefault();
      e.stopPropagation();

    };
    const onSvgMouseLeave = (e: MouseEvent) => {
      if (EditorModule.editMode) {
        config.value.pointVisiable = false;
      }

      e.preventDefault();
      e.stopPropagation();

    };

    const showContextMenu = (ev: MouseEvent) => {
      if (props.com.config.action.state === 'None') {
        showMenu(ev);
      }
      else {
        hideMenu();
      }
    }

    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case 'pause':
          pause();
          break
        case 'play':
          play();
          break
      }
    })

    const pause = () => {
      svgElement.value.pauseAnimations();
    }

    const play = () => {
      svgElement.value.unpauseAnimations();
    }

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
        width: `${config.value.imgStyle.width}px`,
        height: `${config.value.imgStyle.height}px`,
        'image-rendering': '-webkit-optimize-contrast',
        background: background,
        '-webkit-mask-image': 'none',
        '-webkit-mask-repeat': 'initial',
        '-webkit-mask-size': 'initial',
        'border-radius': `${config.value.imgStyle.radius}px`,
        cursor: 'default'
      } as CSSProperties
    })

    return {
      config,
      wraperStyle,
      imgStyle,
      svgElement,
      positionArrarToPath,
      setConnectionLineNode,
      onSvgMouseEnter,
      onSvgMouseLeave,
      showContextMenu,
      deleteNode
    }
  }
})
</script>
