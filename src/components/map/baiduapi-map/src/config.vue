<template>
  <div class="setting-panel-gui">
    <g-field label="AK">
      <g-input v-model="config.ak" />
    </g-field>
    <g-field label="经度">
      <g-input-number v-model="config.x" :step="1" />
    </g-field>
    <g-field label="纬度">
      <g-input-number v-model="config.y" :step="1" />
    </g-field>
    <g-field label="地图缩放">
      <g-input-number
        v-model="config.zoom"
        :step="1"
        :min="0"
        :max="100"
      />
    </g-field>
    <g-field label="样式">
      <g-select
        v-model="config.mapStyleName"
        :data="[{ id:'default',value:'默认' },{ id:'autumn',value:'中秋' },{ id:'eye',value:'眼眸' },{ id:'green',value:'绿野仙踪' },{ id:'logistics',value:'物流' },{ id:'tea',value:'茶田' }]"
        :change="styleChange"
      />
    </g-field>
    <!-- <g-field-collapse label="弹出框设置">
      <g-field label="弹出框宽度">
        <g-input-number
          v-model="config.dialogWidth"
          :min="100"
          :max="2000"
          :step="1"
        />
      </g-field>
      <g-field label="弹出框高度">
        <g-input-number
          v-model="config.dialogHeight"
          :min="100"
          :max="2000"
          :step="1"
        />
      </g-field>
      <g-field label="标题背景颜色">
        <g-input v-model="config.dialogHeaderBackgroundColor" />
      </g-field>
      <g-field label="标题高度">
        <g-input-number
          v-model="config.dialogHeaderHeight"
          :min="10"
          :max="1000"
          :step="1"
        />
      </g-field>
      <g-field label="标题字体大小">
        <g-input-number
          v-model="config.dialogHeaderFrontSize"
          :min="12"
          :max="100"
          :step="1"
        />
      </g-field>
    </g-field-collapse> -->
    <!-- <g-field-collapse
      label="撒点设置"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
      :list="config.pointConfigs"
      :min="1"
      :max="20"
      tab="撒点"
      :add-item="addPoint"
    >
      <template #default="slotProps">
        <g-field label="名称">
          <g-input v-model="slotProps.item.name" />
        </g-field>
        <g-field label="类型">
          <g-input v-model="slotProps.item.type" />
        </g-field>
        <g-field label="Api地址">
          <g-input v-model="slotProps.item.apiUrl" />
        </g-field>
        <g-field label="图标地址">
          <g-upload-image v-model="slotProps.item.iconUrl" />
        </g-field>
        <g-field label="图标宽度">
          <g-input-number
            v-model="slotProps.item.iconWidth"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
        <g-field label="图标高度">
          <g-input-number
            v-model="slotProps.item.iconHeight"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
      </template>
    </g-field-collapse> -->
    <g-field-collapse label="热力图设置">
      <g-field label="Api地址">
        <g-input
          v-model="config.heatmap.ApiUrl"
        />
      </g-field>
      <g-field label="最大值">
        <g-input-number
          v-model="config.heatmap.max"
          :min="0"
          :max="100000000"
          :step="1"
        />
      </g-field>
      <g-field label="半径">
        <g-input-number
          v-model="config.heatmap.radius"
          :min="0"
          :max="1000"
          :step="1"
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import { BaiduapiMap } from './baiduapi-map'

import autumnStyle from '@/../public/data/baiduapimapstyle/autumn.json'
import eyeStyle from '@/../public/data/baiduapimapstyle/eye.json'
import greenStyle from '@/../public/data/baiduapimapstyle/green.json'
import logisticsStyle from '@/../public/data/baiduapimapstyle/logistics.json'
import teaStyle from '@/../public/data/baiduapimapstyle/tea.json'


export default defineComponent({
  name: 'VBaiduapiMapProp',
  props: {
    com: {
      type: Object as PropType<BaiduapiMap>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    // const addPoint = () => {
    //   if (config.value.pointConfigs.some(r => r.name == '')) {
    //     return
    //   }
    //   config.value.pointConfigs.push({
    //     name: '',
    //     type: '',
    //     apiUrl: '',
    //     iconUrl: '',
    //     iconWidth: 20,
    //     iconHeight: 20,
    //     dataJson: '',
    //   })
    // }

    const styleChange = () =>{
      switch(config.value.mapStyleName)
      {
        case 'autumn':
          config.value.mapStyleJson = autumnStyle as unknown as any[] //JSON.parse(autumnStyle)
          break
        case 'eye':
          config.value.mapStyleJson = eyeStyle as unknown as any[]//JSON.parse(eyeStyle)
          break
        case 'green':
          config.value.mapStyleJson = greenStyle as unknown as any[]//JSON.parse(greenStyle)
          break
        case 'logistics':
          config.value.mapStyleJson = logisticsStyle as unknown as any[]//JSON.parse(logisticsStyle)
          break
        case 'tea':
          config.value.mapStyleJson = teaStyle as unknown as any[]//JSON.parse(teaStyle)
          break
        default:
          config.value.mapStyleJson = []
          break
      }
    }

    return {
      config,
      //addPoint,
      styleChange,
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
