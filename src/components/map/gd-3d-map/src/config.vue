<template>
  <div class="setting-panel-gui">
    <g-field label="高德地图Key">
      <g-input v-model="config.key" />
    </g-field>
    <g-field-collapse label="初始化设置">
      <g-field :level="2" label="地图主题">
        <g-select v-model="config.theme" :data="[{ id: 'normal', value: '标准' }, { id: 'dark', value: '幻影黑' }, { id: 'light', value: '月光银' }, { id: 'whitesmoke', value: '远山黛' },
        { id: 'fresh', value: '草色青' }, { id: 'grey', value: '雅士灰' }, { id: 'graffiti', value: '涂鸦' }, { id: 'macaron', value: '马卡龙' },
        { id: 'blue', value: '靛青蓝' }, { id: 'darkblue', value: '极夜蓝' }, { id: 'wine', value: '酱籽' }]" />
      </g-field>
      <g-field :level="2" label="缩放数值">
        <g-input-number v-model="config.zoom" :step="0.1" :min="1" :max="22" />
      </g-field>
      <g-field :level="2" label="经度">
        <g-input-number v-model="config.center.lng" :step="1" />
      </g-field>
      <g-field :level="2" label="纬度">
        <g-input-number v-model="config.center.lat" :step="1" />
      </g-field>
      <g-field :level="2" label="楼块侧面颜色">
        <g-color-picker v-model="config.wallColor" />
      </g-field>
      <g-field :level="2" label="楼块顶面颜色">
        <g-color-picker v-model="config.roofColor" />
      </g-field>
      <g-field :level="2" label="显示道路">
        <n-switch v-model:value="config.showRoad" />
      </g-field>
      <g-field :level="2" label="显示标柱">
        <n-switch v-model:value="config.showPoint" />
      </g-field>
      <g-field-collapse v-model="config.showPark" :toggle="true" label="共青森林高亮">
        <g-field :level="2" label="遮罩层颜色">
          <g-color-picker v-model="config.polygonSetting.fillColor" :alpha="false"/>
        </g-field>
        <g-field :level="2" label="遮罩层透明度">
          <g-input-number v-model="config.polygonSetting.fillOpacity" :min="0" :max="1" :step="0.01" />
        </g-field>
        <g-field :level="2" label="边缘颜色">
          <g-color-picker v-model="config.polygonSetting.strokeColor" :alpha="false"/>
        </g-field>
        <g-field :level="2" label="边缘粗细">
          <g-input-number v-model="config.polygonSetting.strokeWeight" :min="1" :max="100" :step="1" />
        </g-field>
        <g-field :level="2" label="边缘透明度">
          <g-input-number v-model="config.polygonSetting.strokeOpacity" :min="0" :max="1" :step="0.01" />
        </g-field>
      </g-field-collapse>

      <g-field :level="2" label="交通图层">
        <n-switch v-model:value="config.trafficLayer" />
      </g-field>
      <g-field :level="2" label="网格图层">
        <n-switch v-model:value="config.geoLayer" />
      </g-field>
      <g-field-collapse v-model="config.areaLayer.enable" :toggle="true" label="地区图层">
        <g-field :level="2" label="地区名称">
          <g-input v-model="config.areaLayer.district" />
        </g-field>
        <g-field-collapse v-model="config.areaLayer.hideOther.enable" :toggle="true" label="遮罩周边">
          <g-field :level="2" label="背景色">
            <g-color-picker v-model="config.areaLayer.hideOther.color" />
          </g-field>
        </g-field-collapse>
        <g-field-collapse v-model="config.areaLayer.border.show" :toggle="true" label="地区边框">
          <g-field :level="2" label="粗细">
            <g-input-number v-model="config.areaLayer.border.width" :min="0" :max="100" :step="1" suffix="px" />
          </g-field>
          <g-field :level="2" label="颜色">
            <g-color-picker v-model="config.areaLayer.border.color" />
          </g-field>
        </g-field-collapse>
      </g-field-collapse>
    </g-field-collapse>
    <g-field-collapse label="撒点设置" mode="layout" default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']" :list="config.pointConfigs" :min="1" :max="20"
      tab="撒点" :add-item="addPoint">
      <template #default="slotProps">
        <g-field label="名称">
          <g-input v-model="slotProps.item.name" />
        </g-field>
        <g-field label="Api地址">
          <g-input v-model="slotProps.item.apiUrl" />
        </g-field>
        <g-field label="点位JSON">
          <g-input v-model="slotProps.item.dataJson" />
        </g-field>
        <g-field label="图标地址">
          <g-upload-image v-model="slotProps.item.iconUrl" />
        </g-field>
        <g-field label="图标宽度">
          <g-input-number v-model="slotProps.item.iconWidth" :min="0" :max="100" :step="1" />
        </g-field>
        <g-field label="图标高度">
          <g-input-number v-model="slotProps.item.iconHeight" :min="0" :max="100" :step="1" />
        </g-field>
      </template>
    </g-field-collapse>
    <g-field-collapse label="绘制折线" mode="layout" default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']" :list="config.polylineConfigs ?? []" :min="1"
      :max="20" tab="折线" :add-item="addPolyline">
      <template #default="slotProps">
        <g-field label="名称">
          <g-input v-model="slotProps.item.name" />
        </g-field>
        <g-field label="Api地址">
          <g-input v-model="slotProps.item.apiUrl" />
        </g-field>
        <g-field label="数据JSON">
          <g-input v-model="slotProps.item.dataJson" />
        </g-field>
        <g-field label="折线粗细">
          <g-input-number v-model="slotProps.item.strokeWeight" :min="0" :max="100" :step="1" suffix="px" />
        </g-field>
        <g-field label="折线颜色">
          <g-color-picker v-model="slotProps.item.strokeColor" :alpha="false"/>
        </g-field>
        <g-field label="折线透明度">
          <g-input-number v-model="slotProps.item.strokeOpacity" :min="0" :max="1" :step="0.01" />
        </g-field>
        <g-field-collapse v-model="slotProps.item.isOutline" :toggle="true" label="显示边框">
          <g-field :level="2" label="粗细">
            <g-input-number v-model="slotProps.item.borderWeight" :min="0" :max="100" :step="1" suffix="px" />
          </g-field>
          <g-field :level="2" label="颜色">
            <g-color-picker v-model="slotProps.item.outlineColor" :alpha="false"/>
          </g-field>
        </g-field-collapse>

      </template>
    </g-field-collapse>

    <g-field-collapse label="绘制文本" mode="layout" default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']" :list="config.textConfigs ?? []" :min="1" :max="50"
      tab="文本" :add-item="addText">
      <template #default="slotProps">
        <g-field label="文本内容">
          <g-input v-model="slotProps.item.text" />
        </g-field>
        <g-field label="倾斜角度">
          <g-input-number v-model="slotProps.item.angle" :min="0" :max="360" :step="1" suffix="°" />
        </g-field>
        <g-field label="文本宽度">
          <g-input v-model="slotProps.item.textStyle.width" />
        </g-field>
        <g-field-collapse label="文本样式">
          <g-field :level="2" tooltip="请选择您系统有的字体,如果您系统无此字体,标题将会显示默认字体" label="字体">
            <g-select v-model="slotProps.item.textStyle.fontFamily" :data="fontFamilys" />
          </g-field>
          <g-field :level="2" label="字号">
            <g-input-number v-model="slotProps.item.textStyle.fontSize" :min="12" :max="100" :step="1" suffix="px" />
          </g-field>
          <g-field :level="2" label="颜色">
            <g-color-picker v-model="slotProps.item.textStyle.color" :alpha="false"/>
          </g-field>
          <g-field :level="2" label="字体粗细">
            <g-select v-model="slotProps.item.textStyle.fontWeight" :data="fontWeights" />
          </g-field>
        </g-field-collapse>
        <g-field label="经度">
          <g-input-number v-model="slotProps.item.position.lng" :step="1" />
        </g-field>
        <g-field label="纬度">
          <g-input-number v-model="slotProps.item.position.lat" :step="1" />
        </g-field>
        <g-field label="鼠标指针">
          <g-select v-model="slotProps.item.cursor" :data="cursorFamily" />
        </g-field>
      </template>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef, ref } from 'vue'
import {
  fontFamilys,
  fontWeights,
  justifyContents,
  writingModes,
  lineStyles,
  cursorFamily,
} from '@/data/select-options'
import { Gd3dMap } from './gd-3d-map'

export default defineComponent({
  name: 'VGd3dMapProp',
  props: {
    com: {
      type: Object as PropType<Gd3dMap>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    const addPoint = () => {
      if (config.value.pointConfigs.some(r => r.name == '')) {
        return
      }
      config.value.pointConfigs.push({
        name: '',
        apiUrl: '',
        iconUrl: '',
        iconWidth: 20,
        iconHeight: 20,
        dataJson: '',
      })
    }

    const addPolyline = () => {
      if (!config.value.polylineConfigs) {
        config.value.polylineConfigs = [];
      }

      if (config.value.polylineConfigs.some(r => r.name == '')) {
        return
      }

      config.value.polylineConfigs.push({
        name: '',
        apiUrl: '',
        isOutline: true,
        outlineColor: '#3366FF',
        borderWeight: 1,
        strokeColor: "#3366FF",
        strokeOpacity: 1,
        strokeWeight: 3,
        strokeStyle: "solid",
        dataJson: '',
      })
    }

    const addText = () => {
      if (!config.value.textConfigs) {
        config.value.textConfigs = [];
      }

      config.value.textConfigs.push({
        text: "纯文本标记",
        anchor: "center",
        draggable: false,
        cursor: "default",
        angle: 0,
        textStyle: {
          width: "20px",
          fontFamily: 'Microsoft Yahei',
          fontSize: 14,
          color: '#fff',
          fontWeight: 'normal',
        },
        position: {
          lng: 121.521699,
          lat: 31.295163
        }
      })
    }

    return {
      config,
      cursorFamily,
      fontFamilys,
      fontWeights,
      justifyContents,
      writingModes,
      lineStyles,
      addPoint,
      addPolyline,
      addText
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
