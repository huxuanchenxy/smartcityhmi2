<template>
  <div class="datav-wrapper" :style="wraperStyle">
    <video ref="videoNode" :src="config.src" :width="attr.w" :height="attr.h" :poster="config.poster"
      style=" object-fit: fill !important;">
      <!-- <source :src="config.src" type="video/mp4"> -->
    </video>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  PropType,
  computed,
  toRef,
  onMounted,
  watch,
  ref,
  getCurrentInstance,
} from 'vue'
import type { CSSProperties } from 'vue'
import { Video } from './video'
import { useEventCenter } from '@/mixins/event-center'
import { EditorModule } from '@/store/modules/editor'
import { DatavError } from '@/domains/error'
import { HandleItemField } from '@/components/data-handle'

export default defineComponent({
  name: 'VVideo',
  props: {
    com: {
      type: Object as PropType<Video>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')
    let videoNode = ref(null)
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter
    useEventCenter(props.com)

    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case 'play':
          videoPlay();
          break;
        case 'pause':
          videoPause();
          break;
        case 'load':
          videoLoad();
          break;
        case 'loadplay':
          videoLoadPlay();
          break;
      }
    })

    const wraperStyle = computed(() => {
      const style = {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }

      return style
    })

    let setAutoplay = () => {
      if (config.value.autoplay && !EditorModule.editMode) {
        videoNode.value.autoplay = 'autoplay'
      } else {
        delete videoNode.value.autoplay
      }
    }

    let setControls = () => {
      if (config.value.controls) {
        videoNode.value.controls = 'controls'
      } else {
        delete videoNode.value.controls
      }
    }

    let setMuted = () => {
      if (config.value.muted) {
        videoNode.value.muted = 'muted'
      } else {
        delete videoNode.value.muted
      }
    }

    let setLoop = () => {
      if (config.value.loop) {
        videoNode.value.loop = 'loop'
      } else {
        delete videoNode.value.loop
      }
    }

    let setpReload = () => {
      if (config.value.preload) {
        videoNode.value.preload = 'preload'
      } else {
        delete videoNode.value.preload
      }
    }
    // watch(
    //   () => config.value.autoplay,
    //   () => {
    //     setAutoplay()
    //   },
    // )

    // watch(
    //   () => config.value.controls,
    //   () => {
    //     setControls()
    //   },
    // )

    // watch(
    //   () => config.value.muted,
    //   () => {
    //     setMuted()
    //   },
    // )

    onMounted(() => {
      setAutoplay()
      setControls()
      setMuted()
      setLoop()
      setpReload()
      initEvent()
    })

    const initEvent = () => {
      videoNode.value.onplay = function () {
        videoPlayed();
        //console.log("video play");
      }

      videoNode.value.onpause = function () {
        //console.log("video pause");
      }

      videoNode.value.onended = function () {
        videoEnded(null);
        //console.log("video ended");
      }

      videoNode.value.oncanplay = function () {
        videoCanplay();
        console.log("video oncanplay");
      }
    }

    const videoPlay = () => {
      if (videoNode.value) {
        videoNode.value.play();
      }

    }

    const videoPause = () => {
      if (videoNode.value) {
        videoNode.value.pause();
      }
    }

    const videoLoad = (src?: string) => {
      if (videoNode.value) {
        if (src) {
          videoNode.value.src = src;
        }
        videoNode.value.load();
      }
    }

    const videoLoadPlay = (src?: string) => {
      if (videoNode.value) {
        if (src) {
          videoNode.value.src = src;
        }
        videoNode.value.load();
        videoNode.value.play();
      }
    }

    const videoPlayed = () => {
      if (props.com.handles
        && props.com.handles.videoPlayed
        && props.com.handles.videoPlayed.fields
        && props.com.handles.videoPlayed.fields.length > 0) {
        props.com.handles.videoPlayed.fields.forEach(field => {
          mitter.emit(field.targetComId, field);
        })
      }

      if (props.com.ichandles && props.com.ichandles.event && props.com.ichandles.event.fields.length > 0) {
        props.com.ichandles.event.fields.forEach(field => {
          if (field.targetMethodTriggle == 'event' && field.targetMethodName == 'videoPlayed') {
            mitter.emit(field.targetComId, field)
          }
        })
      }
    }

    const videoEnded = (data) => {
      if (props.com.handles
        && props.com.handles.videoEnded
        && props.com.handles.videoEnded.fields
        && props.com.handles.videoEnded.fields.length > 0) {
        props.com.handles.videoEnded.fields.forEach(field => {
          field.value = data;
          mitter.emit(field.targetComId, field);
        })
      }

      if (props.com.ichandles && props.com.ichandles.event && props.com.ichandles.event.fields.length > 0) {
        props.com.ichandles.event.fields.forEach(field => {
          if (field.targetMethodTriggle == 'event' && field.targetMethodName == 'videoEnded') {
            mitter.emit(field.targetComId, field)
          }
        })
      }
    }

    const videoCanplay = () => {
      if (props.com.handles
        && props.com.handles.videoCanplay
        && props.com.handles.videoCanplay.fields
        && props.com.handles.videoCanplay.fields.length > 0) {
        props.com.handles.videoCanplay.fields.forEach(field => {
          mitter.emit(field.targetComId, field);
        })
      }

      if (props.com.ichandles && props.com.ichandles.event && props.com.ichandles.event.fields.length > 0) {
        props.com.ichandles.event.fields.forEach(field => {
          if (field.targetMethodTriggle == 'event' && field.targetMethodName == 'videoCanplay') {
            mitter.emit(field.targetComId, field)
          }
        })
      }
    }



    return {
      config,
      attr,
      wraperStyle,
      videoNode,

    }
  },
})
</script>

<style lang="scss" scoped></style>
