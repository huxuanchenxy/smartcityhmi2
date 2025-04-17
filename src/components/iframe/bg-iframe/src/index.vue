<template>
  <div :id="'div_' + comid" :style="wrapperStyle">
    <iframe :key="key" :id="comid" :name="'bgiframeSrcName_' + comid" scrolling="“no”" :src="url" :style="srcStyle"
      allowfullscreen="true"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { BgIframe } from './bg-iframe'
import { getFieldMap, useDataCenter } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { ref } from 'vue'
import { useEventCenter } from '@/mixins/event-center'

export default defineComponent({
  name: 'VBgIframe',
  props: {
    com: {
      type: Object as PropType<BgIframe>,
      required: true,
    },
  },

  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)

    const config = toRef(props.com, 'config')
    const comid = toRef(props.com, 'id').value

    const key = ref(new Date().getTime())

    const dv_data = computed(() => {
      //dv_data api返回的json
      //?可选链，不为空则计算下一级别，返回不为空的最后一层
      //??或，类似与||
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })


    const url = computed(() => {
      return dv_data.value.src ?? config.value.srcConfig.src
    })

    watch(() => url.value, (newUrl: string) => {
      key.value = new Date().getTime();
      //const iframeSrcDoc = (document.getElementById(comid) as HTMLIFrameElement)
      //iframeSrcDoc.src = newUrl;
      //iframeSrcDoc.contentWindow.location.reload();
    })

    const srcStyle = computed(() => {
      const ss = config.value.srcConfig.srcStyle
      const style = {
        height: `${ss.height}%`,
        width: `${ss.width}%`,
        overflow: `${config.value.overflow}`,
        border: `${ss.border}px`,
        margin: `${ss.margin}px`,
        padding: `${ss.padding}px`,
      }
      return style as CSSProperties
    })

    const wrapperStyle = computed(() => {
      return {
        width: '100%',
        height: '100%',
        position: `${config.value.position}`,
        top: config.value.top,
        left: config.value.left,
        bottom: config.value.bottom,
        right: config.value.right,
        zIndex: config.value.zIndex,
        overflow: `${config.value.overflow}`,
        transform: `scale(${config.value.scale ?? 1}) `
      } as CSSProperties
    })

    return {
      url,
      wrapperStyle,
      srcStyle,
      comid,
      key
    }
  },
})
</script>

