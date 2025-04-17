<template>
  <div id="datav-loading" :style="{
    background: 'rgb(15, 42, 66)',
    display: loading ? 'block' : 'none',
  }">
    <a target="_blank" href="javascript:;">
      <img class="datav-logo" :src="`data/originPic/datav-loading.gif`">
    </a>
  </div>
  <div class="datav-layout" :style="{ visibility: loading ? 'hidden' : 'visible' }">
    <a v-if="pageConfig.useWatermark" href="/" target="_blank" class="datav-watermark">
      <img :src="LOGO">
    </a>
    <div class="scene">
      <div v-for="com in coms" :key="com.id" :style="{
        left: com.attr.x + 'px',
        top: com.attr.y + 'px',
        width: com.attr.w + 'px',
        height: com.attr.h + 'px',
        opacity: com.attr.opacity,
        transform: `rotate(${com.attr.deg}deg) ${com.attr.filpH ? 'scaleX(-1)' : ''
          } ${com.attr.filpV ? 'scaleY(-1)' : ''}`,
        filter: styleFilter,
        //animation: (com.special != '' ? com.special : getAnimation(com.config.animation)),
        animation: (com.special != '' ? com.special:'none'),
        display: com.hided ? 'none' : 'block',
      }" class="-datav-com absolute" @click="checkEvents(com, 'click')" @mouseenter="checkEvents(com, 'mouseEnter')"
        @mouseleave="checkEvents(com, 'mouseLeave')">
        <component :is="com.name" :com="com" />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  getCurrentInstance,
  PropType,
  watch,
} from 'vue'
import { globalConfig } from '@/config'
import { EditorModule } from '@/store/modules/editor'
import { FilterModule } from '@/store/modules/filter'
import { PageConfig } from '@/domains/editor'
import { ZoomMode } from '@/utils/enums'
import { setStyle, on } from '@/utils/dom'
import { HandleItemField, IcHandleItemField } from '@/components/data-handle'
import { DatavComponent } from '@/components/datav-component'
import { useRoute } from 'vue-router'
import { getRandomInt } from '@/utils/util'

const cdn = import.meta.env.VITE_APP_CDN

export default defineComponent({
  name: 'Preview',
  props: {
    screenData: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  setup(props) {
    // 拿到mitter
    const mitter =
      getCurrentInstance()?.appContext.config.globalProperties.mitter
    const route = useRoute();
    //const loading = ref(true)
    const loading = ref(false)
    const pageConfig = computed(() => EditorModule.pageConfig)
    const coms = computed(() => {
      let list = EditorModule.coms.filter(r => !r.parentId)
      //console.log('list',list)
      return list
    })
    const styleFilter = computed(() => {
      const sf = pageConfig.value.styleFilterParams
      let filter = ''
      if (sf.enable) {
        filter = `hue-rotate(${sf.hue}deg) contrast(${sf.contrast}%) opacity(${sf.opacity}%) saturate(${sf.saturate}%) brightness(${sf.brightness}%)`
      }
      return filter
    })

    const comEvent = (fields: HandleItemField[]) => {
      fields.forEach(field => {
        // emit自定义事件
        mitter.emit(field.targetComId, field)
      })
    }

    const checkEvents = (com: DatavComponent, type: string) => {
      switch (type) {
        case "click":
          if (com.handles &&
            com.handles.click &&
            com.handles.click.fields.length > 0) {
            comEvent(com.handles.click.fields)
          }
          if (com.ichandles && com.ichandles.event && com.ichandles.event.fields.length > 0) {
            com.ichandles.event.fields.forEach(field => {
              if (field.targetMethodTriggle == 'event' && field.targetMethodName == 'click') {
                mitter.emit(field.targetComId, field)
              }
            })
          }
          break;
        case "mouseEnter":
          if (com.handles &&
            com.handles.mouseEnter &&
            com.handles.mouseEnter.fields.length > 0) {
            comEvent(com.handles.mouseEnter.fields)
          }
          if (com.ichandles && com.ichandles.event &&  com.ichandles.event.fields.length > 0) {
            com.ichandles.event.fields.forEach(field => {
              if (field.targetMethodTriggle == 'event' && field.targetMethodName == 'mouseEnter') {
                mitter.emit(field.targetComId, field)
              }
            })
          }
          break;
        case "mouseLeave":
          if (com.handles &&
            com.handles.mouseLeave &&
            com.handles.mouseLeave.fields.length > 0) {
            comEvent(com.handles.mouseLeave.fields)
          }
          if (com.ichandles && com.ichandles.event &&  com.ichandles.event.fields.length > 0) {
            com.ichandles.event.fields.forEach(field => {
              if (field.targetMethodTriggle == 'event' && field.targetMethodName == 'mouseLeave') {
                mitter.emit(field.targetComId, field)
              }
            })
          }
          break;
      }
    }

    const resizeAuto = (width: number, height: number) => {
      const cw = document.documentElement.clientWidth
      const ch = document.documentElement.clientHeight
      const ratioX = cw / width
      const ratioY = ch / height
      setStyle(document.body, {
        transform: `scale(${ratioX}, ${ratioY})`,
        transformOrigin: 'left top',
        backgroundSize: '100% 100%',
      } as CSSStyleDeclaration)
    }

    const resizeWidth = (width: number) => {
      const ratio = document.documentElement.clientWidth / width
      setStyle(document.body, {
        transform: `scale(${ratio})`,
        transformOrigin: 'left top',
        backgroundSize: '100%',
      } as CSSStyleDeclaration)
    }

    const resizeHeight = (width: number, height: number) => {
      const cw = document.documentElement.clientWidth
      const ch = document.documentElement.clientHeight
      const ratio = ch / height
      const gap = (cw - width * ratio) / 2
      setStyle(document.body, {
        transform: `scale(${ratio})`,
        transformOrigin: 'left top',
        backgroundSize: `${(width / cw) * ratio * 100}% 100%`,
        backgroundPosition: `${gap.toFixed(3)}px top`,
        marginLeft: `${gap.toFixed(3)}px`,
      } as CSSStyleDeclaration)
    }

    const resizeFull = (width: number, height: number) => {
      const cw = document.documentElement.clientWidth
      const ch = document.documentElement.clientHeight
      const ratio = ch / height
      const gap = (cw - width * ratio) / 2
      setStyle(document.body, {
        transform: `scale(${ratio})`,
        transformOrigin: 'left top',
        backgroundSize: `${(width / cw) * ratio * 100}% 100%`,
        backgroundPosition: `${gap.toFixed(3)}px top`,
        // marginLeft: `${gap.toFixed(3)}px`,
      } as CSSStyleDeclaration)

      document.documentElement.style.overflowX = 'scroll'
    }

    const resizeNone = () => {
      setStyle(document.body, {
        overflow: 'hidden',
        position: 'relative',
      } as CSSStyleDeclaration)
    }

    const resize = (config: PageConfig) => {
      switch (config.zoomMode) {
        case ZoomMode.auto:
          resizeAuto(config.width, config.height)
          break
        case ZoomMode.width:
          resizeWidth(config.width)
          break
        case ZoomMode.height:
          resizeHeight(config.width, config.height)
          break
        case ZoomMode.full:
          resizeFull(config.width, config.height)
          break
        default:
          resizeNone()
          break
      }
    }

    const initPageInfo = (config: PageConfig) => {
      document.title = EditorModule.screen.name
      document
        .querySelector('meta[name="viewport"]')
        .setAttribute('content', `width=${config.width}`)

      setStyle(document.documentElement, {
        overflowX: 'hidden',
        overflowY: 'visible',
      } as CSSStyleDeclaration)

      setStyle(document.body, {
        width: `${config.width}px`,
        height: `${config.height}px`,
        backgroundImage: `url(${pageConfig.value.bgimage})`,
        backgroundColor: pageConfig.value.bgcolor,
      } as CSSStyleDeclaration)

      resize(config)
    }

    const getAnimation = (animation: any) => {
      if (animation && animation.enable) {
        return animation.name + ' '
          + animation.duration + 'ms '
          + animation.timing + ' '
          + animation.delay + 'ms '
          + animation.iteration + ' '
          + animation.direction;
      }
      else {
        return 'none';
      }
    }


    onMounted(() => {
      initData(props.screenData);
    })

    const initData = async (screenData: any) => {
      try {
        const data = screenData as any
        if (data) {
          EditorModule.setEditorOption({
            screen: data.screen,
            config: data.config,
            coms: data.coms,
            variables: data.variables,
          })

          initPageInfo(data.config)

          FilterModule.setFilterOption({
            dataFilters: data.dataFilters,
          })

          setTimeout(() => {
            loading.value = false
          }, 500)

          on(window, 'resize', () => {
            resize(pageConfig.value)
          })
        } else {
          throw new Error('404')
        }
      } catch (error) {
        console.log(error)
      }
    }

    watch(() => props.screenData, (newId, oldId) => {
      EditorModule.setEditorOption({
        coms: []
      })
      initData(props.screenData);
    })

    return {
      cdn,
      LOGO: globalConfig.logo,
      loading,
      pageConfig,
      coms,
      styleFilter,
      comEvent,
      checkEvents,
      getAnimation
    }
  },
})
</script>

<style lang="scss">
html,
body {
  min-width: auto;
}

#datav-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0f2a42;
  z-index: 2;

  .datav-logo,
  .text-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .datav-logo {
    width: 120px;
  }

  .text-logo {
    margin-top: 73px;
    width: 100px;
  }
}

.datav-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;

  .-datav-com.absolute {
    position: absolute !important;
    margin: 0 !important;
  }
}

.datav-watermark {
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 99999999;
  width: 50px;

  img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
}
</style>
