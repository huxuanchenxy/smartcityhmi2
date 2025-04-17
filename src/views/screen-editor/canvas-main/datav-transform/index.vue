<template>
  <div class="datav-transform" :class="transformClass" :style="transformStyle">
    <refer-line v-if="referLine.enable && com.selected" :attr="com.attr" :scale="scale" />
    <div :class="['datav-scale', { hovered: com.hovered }]" :style="hideStyle" @mouseenter="onEnter" @mouseleave="onLeave"
      @mousedown.prevent.stop="onMove" v-if="!com.config.mode || com.config.mode !== 'svg'">
      <div class="transform-handler" :class="handlerClass" :style="handlerStyle">
        <div class="datav-com" :style="comStyle">
          <slot></slot>
          <div class="datav-wrapper-event-disable" :style="wrapperStyle" @contextmenu="showMenu"></div>
        </div>
        <template v-for="(v, k) in points" :key="k">
          <i v-if="v.rotateStyle" :class="`${v.name}-handler`" data-html2canvas-ignore>
            <span class="rotate-handler" :style="v.rotateStyle" @mousedown.prevent.stop="onRotate">
              <span class="control-point" :style="v.style" @mousedown.prevent.stop="onZoom($event, k)"></span>
            </span>
          </i>
          <i v-else :class="`${v.name}-handler`" data-html2canvas-ignore>
            <span class="control-point" :style="v.style" @mousedown.prevent.stop="onZoom($event, k)"></span>
          </i>
        </template>
        <div class="transform-bg"></div>
      </div>
    </div>

    <div :class="['datav-scale', { hovered: com.hovered }]" :style="hideStyle" @mouseenter="onEnter" @mouseleave="onLeave"
      @mousemove="onMouseMove" @mousedown.prevent.stop="onMouseDown" @mouseup="onMouseUp"
      v-if="com.config.mode && com.config.mode == 'svg'">
      <div class="transform-handler" :class="handlerClass" :style="handlerStyle">
        <div class="datav-com" :style="comStyle">
          <slot></slot>
        </div>
        <template v-for="(v, k) in points" :key="k">
          <i v-if="v.rotateStyle" :class="`${v.name}-handler`" data-html2canvas-ignore>
            <span class="rotate-handler" :style="v.rotateStyle" @mousedown.prevent.stop="onRotate">
              <span class="control-point" :style="v.style" @mousedown.prevent.stop="onZoom($event, k)"></span>
            </span>
          </i>
          <i v-else :class="`${v.name}-handler`" data-html2canvas-ignore>
            <span class="control-point" :style="v.style" @mousedown.prevent.stop="onZoom($event, k)"></span>
          </i>
        </template>
        <div class="transform-bg"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, getCurrentInstance, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import { EditorModule } from '@/store/modules/editor'
import {
  Direction, getCursors,
  handleMove, handleZoom, handleRotate,
} from './index'
import { useContextMenu } from '../../editor-context-menu/index'
import ReferLine from './refer-line.vue'
import { once } from '@/utils/dom'
import { ToolbarModule } from '@/store/modules/toolbar'

export default defineComponent({
  name: 'DatavTransform',
  components: {
    ReferLine,
  },
  props: {
    com: {
      type: Object as PropType<DatavComponent>,
      required: true,
    },
  },
  setup(props) {
    const canvas = computed(() => EditorModule.canvas)
    const instance = getCurrentInstance()
    const referLine = computed(() => EditorModule.referLine)
    const scale = computed(() => EditorModule.canvas.scale)

    const { showMenu, hideMenu } = useContextMenu()
    const isMoveing = ref(false)

    const transformClass = computed(() => ({
      selected: props.com.selected,
      hided: props.com.hided,
      locked: props.com.locked,
    }))

    const transformStyle = computed(() => ({
      top: `${props.com.attr.y}px`,
      left: `${props.com.attr.x}px`,
      width: `${props.com.attr.w}px`,
      height: `${props.com.attr.h}px`,
      transform: `scale(${props.com.config.scale ?? 1})`
      //transform: `translate(${props.com.attr.x}px, ${props.com.attr.y}px)`,
    }))

    const hideStyle = computed(() => ({
      display: props.com.hided ? 'none' : 'block',
    }))

    const handlerClass = computed(() => ({
      hided: !props.com.selected || props.com.locked,
    }))

    const handlerStyle = computed(() => ({
      cursor: 'move',
      transform: `rotate(${props.com.attr.deg}deg)`,
    }))

    const comStyle = computed(() => {
      const { hided, attr } = props.com
      const sf = EditorModule.pageConfig.styleFilterParams
      let filter = ''
      if (sf.enable) {
        filter = `hue-rotate(${sf.hue}deg) contrast(${sf.contrast}%) opacity(${sf.opacity}%) saturate(${sf.saturate}%) brightness(${sf.brightness}%)`
      }
      return {
        display: hided ? 'none' : 'block',
        transform: `scaleX(${attr.filpH ? -1 : 1}) scaleY(${attr.filpV ? -1 : 1}) rotateZ(360deg)`,
        filter,
      }
    })

    const wrapperStyle = computed(() => ({
      width: `${props.com.attr.w}px`,
      height: `${props.com.attr.h}px`,
    }))

    const cursor = computed(() => getCursors(props.com.attr.deg))

    const points = computed<{
      [k in Direction]: {
        name: string
        style: Partial<CSSProperties>
        rotateStyle?: Partial<CSSProperties>
      }
    }>(() => {
      const transform = `scale(${1 / scale.value}, ${1 / scale.value})`
      return {
        t: {
          name: 'top',
          style: { cursor: cursor.value.t, transform },
        },
        rt: {
          name: 'top-right',
          style: { cursor: cursor.value.rt },
          rotateStyle: { 'transform-origin': '25% 75%', transform },
        },
        r: {
          name: 'right',
          style: { cursor: cursor.value.r, transform },
        },
        rb: {
          name: 'bottom-right',
          style: { cursor: cursor.value.rb },
          rotateStyle: { 'transform-origin': '25% 25%', transform },
        },
        b: {
          name: 'bottom',
          style: { cursor: cursor.value.b, transform },
        },
        lb: {
          name: 'bottom-left',
          style: { cursor: cursor.value.lb },
          rotateStyle: { 'transform-origin': '75% 25%', transform },
        },
        l: {
          name: 'left',
          style: { cursor: cursor.value.l, transform },
        },
        lt: {
          name: 'top-left',
          style: { cursor: cursor.value.lt },
          rotateStyle: { 'transform-origin': '75% 75%', transform },
        },
      }
    })

    const selectCom = (ctrl?: boolean) => {
      if (props.com.selected) {
        return
      }

      EditorModule.selectCom({ id: props.com.id, ctrl: ctrl })
    }

    const onEnter = () => {
      props.com.hovered = true
    }

    const onLeave = () => {
      props.com.hovered = false
    }

    const onMove = (ev: MouseEvent) => {
      if (EditorModule.contextMenu.show) {
        hideMenu()
        return false
      }

      if (!props.com.selected) {
        selectCom(ev.ctrlKey)
        once(ev.target as HTMLElement, 'mouseup', selectCom)
        return false
      }

      EditorModule.selectedComs.forEach(m => {
        handleMove(
          ev,
          m,
          scale.value,
          EditorModule.pageConfig.grid,
          () => {
            if (props.com.id === m.id) {
              isMoveing.value = true
              EditorModule.calcAlignLine(props.com)
            }
          },
          () => {
            if (props.com.id === m.id) {
              if (isMoveing.value) {
                isMoveing.value = false
                EditorModule.hideAlignLine(props.com.id)
                // const ps = getParentProps()
                // if (ps.coms.length > 0) {
                //   comStore.resizeParents(ps.coms)
                // }
              } else if (ev.button === 0) {
                EditorModule.select(props.com.id)
              }
            }
          },
        )
      })
    }


    // const onMove = (ev: MouseEvent) => {
    //   selectCom(ev.ctrlKey)
    //   handleMove(ev, props.com, scale.value, EditorModule.pageConfig.grid)

    // }

    const onZoom = (ev: MouseEvent, dir: Direction) => {
      selectCom()
      handleZoom(ev, dir, props.com, scale.value)
    }

    const onRotate = (ev: MouseEvent) => {
      handleRotate(ev, instance.vnode.el as HTMLElement, props.com)
    }

    const onMouseMove = (ev: MouseEvent) => {
      if (props.com.config.action && props.com.config.action.state == 'Down') {
        const offsetX = Math.round((ev.clientX - ToolbarModule.getPanelOffsetLeft + EditorModule.eyeView.x) / scale.value)
        const offsetY = Math.round((ev.clientY - ToolbarModule.getPanelOffsetTop + EditorModule.eyeView.y) / scale.value)
        if (props.com.config.action.index > -1) {

          if (offsetX >= props.com.attr.x + props.com.attr.w) {
            props.com.attr.w = offsetX - props.com.attr.x + 5;
          }
          if (offsetX < props.com.attr.x) {
            props.com.attr.x = offsetX - 5;
            props.com.attr.w
          }
          if (offsetY >= props.com.attr.y + props.com.attr.h - 20) {
            props.com.attr.h = offsetY - props.com.attr.y + 25;
          }



          props.com.config.props.pointPosition[props.com.config.action.index] = {
            x: offsetX - props.com.attr.x,
            y: offsetY - props.com.attr.y
          }
        }
      }
      else {

      }
    }

    const onMouseUp = (e: MouseEvent) => {

      if (props.com.config.action && props.com.config.action.state == 'Down') {
        const offsetX = Math.round((e.clientX - ToolbarModule.getPanelOffsetLeft + EditorModule.eyeView.x) / scale.value)
        const offsetY = Math.round((e.clientY - ToolbarModule.getPanelOffsetTop + EditorModule.eyeView.y) / scale.value)
        if (e.button === 0) {
          //鼠标左键结束线段绘制
          props.com.config.action.state = 'None';
        }
        if (e.button === 2) {
          //鼠标右键创建新线段
          props.com.config.props.pointPosition.push({
            x: offsetX - props.com.attr.x,
            y: offsetY - props.com.attr.y
          });

          props.com.config.action.index = props.com.config.props.pointPosition.length - 1;
        }
      }
      else {
        // if (!props.com.selected) {
        //   selectCom();
        // }
      }
    }

    const onMouseDown = (ev: MouseEvent) => {

      if (props.com.config.action && props.com.config.action.state == 'Down') {

      }
      else {
        if (EditorModule.contextMenu.show) {
          hideMenu()
          return false
        }

        if (!props.com.selected) {
          selectCom(ev.ctrlKey)
          once(ev.target as HTMLElement, 'mouseup', selectCom)
          return false
        }

        EditorModule.selectedComs.forEach(m => {
          handleMove(
            ev,
            m,
            scale.value,
            EditorModule.pageConfig.grid,
            () => {
              if (props.com.id === m.id) {
                isMoveing.value = true
                EditorModule.calcAlignLine(props.com)
              }
            },
            () => {
              if (props.com.id === m.id) {
                if (isMoveing.value) {
                  isMoveing.value = false
                  EditorModule.hideAlignLine(props.com.id)
                  // const ps = getParentProps()
                  // if (ps.coms.length > 0) {
                  //   comStore.resizeParents(ps.coms)
                  // }
                } else if (ev.button === 0) {
                  EditorModule.select(props.com.id)
                }
              }
            },
          )
        })

      }
    }


    return {
      referLine,
      scale,
      transformClass,
      transformStyle,
      hideStyle,
      handlerClass,
      handlerStyle,
      comStyle,
      wrapperStyle,
      points,
      onEnter,
      onLeave,
      onMove,
      onZoom,
      onRotate,
      showMenu,
      onMouseMove,
      onMouseUp,
      onMouseDown
    }
  },
})
</script>

<style lang="scss" scoped>
@import "./style";
</style>
