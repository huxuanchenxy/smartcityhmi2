<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <Vue3DraggableResizable v-model:w="groupDiv.w" v-model:h="groupDiv.h" v-model:active="active" :init-w="groupDiv.w"
      :init-h="groupDiv.h" :draggable="config.header.draggable && draggable" :resizable="false" :style="borderStyle"
      @click="toActive()" @drag-end="NonDraggable()">
      <div v-if="config.header.show" class="dialogHeader" :style="dialogHeaderStyle" @mousedown="toDraggable()">
        <div :style="headerTextStyle" style="width:90%;float:left;background-color:transparent">
          {{ config.header.title }}&nbsp;
        </div>
        <div v-if="config.header.closeButton.show" class="dialogCloseDiv"
          :style="{ height: `${config.header.height}px`, lineHeight: `${config.header.height - config.header.closeButton.size}px` }">
          <n-icon class="dialogClose" :color="config.header.closeButton.color" :size="config.header.closeButton.size"
            :style="closeButtonStyle" @click="!editing && closeDialog()">
            <IconClose />
          </n-icon>
        </div>
      </div>
      <div class="groupBody">
        <div v-for="com in subComList" :key="com.id" :style="{
          left: com.attr.x + 'px',
          top: (com.attr.y + (config.header.show ? config.header.height : 0)) + 'px',
          width: com.attr.w + 'px',
          height: com.attr.h + 'px',
          opacity: com.attr.opacity,
          transform: `rotate(${com.attr.deg}deg) ${com.attr.filpH ? 'scaleX(-1)' : ''
            } ${com.attr.filpV ? 'scaleY(-1)' : ''}`,
          display: com.hided ? 'none' : 'block',
        }" class="-datav-com absolute" @click="
  !editing &&
  com.handles &&
  com.handles.click &&
  com.handles.click.fields.length > 0 &&
  comEvent(com.handles.click.fields)
  " @mouseenter="
    !editing &&
    com.handles &&
    com.handles.mouseEnter &&
    com.handles.mouseEnter.fields.length > 0 &&
    comEvent(com.handles.mouseEnter.fields)
    " @mouseleave="
    !editing &&
    com.handles &&
    com.handles.mouseLeave &&
    com.handles.mouseLeave.fields.length > 0 &&
    comEvent(com.handles.mouseLeave.fields)
    ">
          <component :is="com.name" :com="com" />
        </div>
      </div>
    </Vue3DraggableResizable>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  toRef,
  getCurrentInstance,
  ref,
  watch,
} from 'vue'

import { group } from './group'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { useEventCenter } from '@/mixins/event-center'
import { ApiModule } from '@/store/modules/api'
import { HandleItemField } from '@/components/data-handle'

import { EditorModule } from '@/store/modules/editor'

import DatavTransform from '@/views/screen-editor/canvas-main/datav-transform/index.vue'

import { IconClose } from '@/icons'
import { FontWeightProperty, TextAlignProperty } from 'csstype'

export default defineComponent({
  name: 'VGroup',
  components: {
    DatavTransform,
    IconClose,
  },
  props: {
    com: {
      type: Object as PropType<group>,
      required: true,
    },
    // editing:{
    //   type: Boolean,
    //   required:false,
    //   default :()=> {
    //     return false
    //   },
    // },
  },
  setup(props) {

    //const { datavEmit } = useDataCenter(props.com)
    useDataCenter(props.com)
    useEventCenter(props.com)


    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? []
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const editing = computed(() => {
      return EditorModule.editMode
    })




    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')
    // 拿到mitter
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter
    //  监听自定义事件

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`
      }
    })


    const borderStyle = computed(() => {
      return {
        borderWidth: `${config.value.borderStyle.borderWidth}px`,
        borderColor: config.value.borderStyle.borderColor,
        borderRadius: config.value.borderStyle.borderRadius,
        borderStyle: config.value.borderStyle.borderStyle,
        overflow: 'hidden',
      }
    })

    const comEvent = (fields: HandleItemField[]) => {
      fields.forEach(field => {
        // emit自定义事件
        mitter.emit(field.targetComId, field)
      })
    }

    const subComList = ref([])

    watch(dv_data, () => {
      if (subComList.value.length == 0) {
        loadSubComs()
      }
    })

    watch(props.com.subComs, () => {
      loadSubComs()
    })

    const loadSubComs = () => {
      subComList.value = []
      props.com.subComs.forEach(subComId => {
        const subCom = EditorModule.coms.find(r => r.id == subComId)
        subComList.value.push(subCom)
      })
    }

    const closeDialog = () => {
      props.com.hided = true
    }

    const draggable = ref(false)

    const toDraggable = () => {
      if (!editing.value) {
        draggable.value = true
      }
    }

    const NonDraggable = () => {
      draggable.value = false
    }

    const active = ref(false)

    const toActive = () => {
      active.value = true
    }

    const groupDiv = computed(() => {
      return {
        w: props.com.attr.w,
        h: props.com.attr.h,
      }
    })

    watch(() => props.com.config.header.show, (newValue, oldValue) => {
      if (newValue && !oldValue) {
        props.com.attr.h += props.com.config.header.height
        return
      }
      if (!newValue && oldValue) {
        props.com.attr.h -= props.com.config.header.height
        return
      }
    })


    const dialogHeaderStyle = computed(() => {
      const style: any = {
        width: `${attr.value.w - config.value.borderStyle.borderWidth * 2}px`,
        height: `${config.value.header.height}px`,
        backgroundColor: config.value.header.color,
        fontSize: `${config.value.header.fontStyle.fontSize}pt`,
        lineHeight: `${config.value.header.height}px`,
      }

      if (config.value.header.image) {
        style.backgroundImage = `url(${config.value.header.image})`
        style.backgroundRepeat = 'no-repeat'
        style.backgroundAttachment = 'fixed'
        style.backgroundSize = '100% 100%'
      }
      return style
    })

    const headerTextStyle = computed(() => {
      return {
        fontSize: `${config.value.header.fontStyle.fontSize}pt`,
        color: config.value.header.fontStyle.fontColor,
        fontStyle: config.value.header.fontStyle.fontStyle,
        fontWeight: config.value.header.fontStyle.fontWeight as FontWeightProperty,
        fontFamily: config.value.header.fontStyle.fontFamily,
        textAlign: config.value.header.fontStyle.textAlign as TextAlignProperty,
      }
    })

    const closeButtonStyle = computed(() => {
      return {
        marginTop: `${config.value.header.closeButton.top}px`,
        marginBottom: `${config.value.header.closeButton.bottom}px`,
        marginLeft: `${config.value.header.closeButton.left}px`,
        marginRight: `${config.value.header.closeButton.right}px`,
      }
    })

    return {
      editing,
      dv_data,
      dv_field,
      groupDiv,
      draggable,
      active,
      wrapperStyle,
      config,
      dialogHeaderStyle,
      borderStyle,
      comEvent,
      closeDialog,
      toDraggable,
      toActive,
      NonDraggable,
      subComList,
      headerTextStyle,
      closeButtonStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.-datav-com.absolute {
  position: absolute !important;
  margin: 0 !important;
}

.dialogHeader {
  width: 100%;
  margin: 0px;
  padding: 0px 5px;
}

.dialogClose {
  cursor: pointer;
  color: white;
}

.dialogCloseDiv {
  width: 10%;
  float: right;
  text-align: right;
  vertical-align: middle;
}

.groupBody {
  padding: 0px;
  margin: 0px;
}
</style>
