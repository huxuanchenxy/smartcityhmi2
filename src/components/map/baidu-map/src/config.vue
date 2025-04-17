<template>
  <base-config :com="comModel">
    <g-field
      :level="2"
      label="样式"
    >
      <g-select
        v-model="config.theme"
        :data="[{ id:'normal',value:'默认' },{ id:'light',value:'清新蓝' },{ id:'dark',value:'黑夜' },{ id:'redalert',value:'红色警戒' },{ id:'googlelite',value:'精简' },{ id:'grassgreen',value:'自然绿' },{ id:'midnight',value:'午夜蓝' },{ id:'pink',value:'浪漫粉' },{ id:'darkgreen',value:'青春绿' },{ id:'bluish',value:'清新蓝绿' },{ id:'grayscale',value:'高端灰' },{ id:'hardedge',value:'强边界' }]"
      />
    </g-field>
    <g-field
      label="坐标系"
    >
      <g-input
        v-model="config.matrixSet"
      />
    </g-field>
    <g-field
      label="AK"
    >
      <g-input
        v-model="config.ak"
      />
    </g-field>
    <g-field
      label="seckey"
    >
      <g-input
        v-model="config.seckey"
      />
    </g-field>
    <g-field
      label="udt"
    >
      <g-input
        v-model="config.udt"
      />
    </g-field>
  </base-config>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef, computed } from 'vue'
import {
} from '@/data/select-options'
import { BaiduMap } from './baidu-map'

import baseConfig from '../../baseConfig.vue'


export default defineComponent({
  name: 'VBaiduMapProp',
  components: {
    baseConfig,
  },
  props: {
    com: {
      type: Object as PropType<BaiduMap>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    const comModel = computed(()=>{
      return props.com
    })

    return {
      config,
      comModel,
    }
  },
})
</script>

<style scoped>
.actionTitle {
  font-size: 9pt;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 200px;
  float: left;
}
</style>
