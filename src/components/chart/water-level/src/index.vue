<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <water-level-pond ref="wlref" :config="wlConfig" :style="wrapperStyle" v-if="refreshCom" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed, toRef, CSSProperties, ref,
} from 'vue'
import { WaterLevel } from './water-level'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { useEventCenter } from '@/mixins/event-center'
import { WaterLevelPond } from '@kjgl77/datav-vue3'
import { nextTick} from 'vue'

export default defineComponent({
  name: 'VWaterLevel',
  components: {
    WaterLevelPond,
  },
  props: {
    com: {
      type: Object as PropType<WaterLevel>,
      required: true,
    },
  },
  setup(props) {
    const wlref = ref(null);

    const refreshCom = ref(true);

    useDataCenter(props.com)
    useEventCenter(props.com)

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const wlConfig = computed(() => {
      //let cfg = config
      //cfg.value.global.data = [ 55 ]//[ dv_data.value ]
      return {
        data: [dv_data.value.value ?? 55],
        shape: config.value.global.shape,
        waveNum: config.value.global.waveNum,
        waveHeight: config.value.global.waveHeight,
        waveOpacity: config.value.global.waveOpacity,
        formatter: config.value.global.formatter,
        colors: [config.value.global.color1, config.value.global.color2],
      }
    })

    const wrapperStyle = computed(() => {
      reactive();
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      } as CSSProperties
    })

    const reactive = ()=>{
      refreshCom.value = false
      nextTick(() => {
        refreshCom.value = true
      })
    }

    return {
      wrapperStyle,
      wlConfig,
      wlref,
      refreshCom
    }
  },
})
</script>

