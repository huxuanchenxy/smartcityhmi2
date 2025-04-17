<template>
  <div class="setting-panel-gui">
    <g-field
      label="自动播放"
    >
      <n-switch
        v-model:value="config.autoplay"
      />
    </g-field>
    <g-field
      label="显示操控面板"
    >
      <n-switch
        v-model:value="config.controls"
      />
    </g-field>
    <g-field
      label="循环播放"
    >
      <n-switch
        v-model:value="config.loop"
      />
    </g-field>
    <g-field
      label="静音"
    >
      <n-switch
        v-model:value="config.muted"
      />
    </g-field>
    <g-field
      label="显示图片"
    >
      <g-upload-image
        v-model="config.poster"
      />
    </g-field>
    <g-field
      label="预加载"
    >
      <n-switch
        v-model:value="config.preload"
      />
    </g-field>
    <g-field
      label="视频地址"
    >
      <g-input
        v-model="config.src"
      />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
} from '@/data/select-options'
import { Video } from './video'

export default defineComponent({
  name: 'VVideoProp',
  props: {
    com: {
      type: Object as PropType<Video>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    return {
      config,

    }
  },
})
</script>
