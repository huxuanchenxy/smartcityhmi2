<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="地图设置"
    >
      <g-field
        label="中心点X"
      >
        <g-input-number
          v-model="config.x"
          :min="-100000"
          :max="100000"
          :step="1"
        />
      </g-field>
      <g-field
        label="中心点Y"
      >
        <g-input-number
          v-model="config.y"
          :min="-100000"
          :max="100000"
          :step="1"
        />
      </g-field>
      <g-field
        label="缩放"
      >
        <g-input-number
          v-model="config.zoom"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        label="旋转"
      >
        <g-input-number
          v-model="config.rotation"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>

      <slot></slot>
    </g-field-collapse>
    <g-field-collapse
      label="滤镜"
    >
      <g-field label="灰度">
        <g-slider
          v-model="config.filter.grayscale"
          :min="0"
          :max="1"
          :step="0.05"
        />
      </g-field>
      <g-field label="褐色">
        <g-slider
          v-model="config.filter.sepia"
          :min="0"
          :max="1"
          :step="0.05"
        />
      </g-field>
      <g-field label="饱和度">
        <g-slider
          v-model="config.filter.saturate"
          :min="0"
          :max="2"
          :step="0.05"
        />
      </g-field>
      <g-field label="色相旋转">
        <g-slider
          v-model="config.filter.hueRotate"
          :min="0"
          :max="360"
          :step="1"
        />
      </g-field>
      <g-field label="反色">
        <g-slider
          v-model="config.filter.invert"
          :min="0"
          :max="1"
          :step="0.05"
        />
      </g-field>
      <g-field label="透明度">
        <g-slider
          v-model="config.filter.opacity"
          :min="0"
          :max="1"
          :step="0.05"
        />
      </g-field>
      <g-field label="亮度">
        <g-slider
          v-model="config.filter.brightness"
          :min="0"
          :max="2"
          :step="0.05"
        />
      </g-field>
      <g-field label="对比度">
        <g-slider
          v-model="config.filter.contrast"
          :min="0"
          :max="2"
          :step="0.05"
        />
      </g-field>
      <g-field
        label="模糊"
      >
        <g-input-number
          v-model="config.filter.blur"
          :min="0"
          :max="1000"
          :step="1"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="弹出框设置"
    >
      <g-field
        label="整体宽度"
      >
        <g-input-number
          v-model="config.dialogWidth"
          :min="0"
          :max="10000"
          :step="1"
        />
      </g-field>
      <g-field
        label="整体高度"
      >
        <g-input-number
          v-model="config.dialogHeight"
          :min="0"
          :max="10000"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="标题背景颜色"
      >
        <g-color-picker
          v-model="config.dialogHeaderBackgroundColor"
        />
      </g-field>

      <g-field
        label="图标地址"
      >
        <g-upload-image
          v-model="config.dialogHeaderBackgroundImgUrl"
        />
      </g-field>
      <g-field
        label="标题栏高度"
      >
        <g-input-number
          v-model="config.dialogHeaderHeight"
          :min="0"
          :max="1000"
          :step="1"
        />
      </g-field>
      <g-field
        label="标题栏字体大小"
      >
        <g-input-number
          v-model="config.dialogHeaderFrontSize"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="撒点设置"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical','horizontal','copy','add','remove']"
      :list="config.pointConfigs"
      :min="1"
      :max="20"
      tab="撒点"
      :add-item="addPoint"
    >
      <template #default="slotProps">
        <g-field
          label="名称"
        >
          <g-input
            v-model="slotProps.item.name"
          />
        </g-field>
        <g-field
          label="代码"
        >
          <g-input
            v-model="slotProps.item.code"
          />
        </g-field>
        <g-field
          label="Api地址"
        >
          <g-input
            v-model="slotProps.item.apiUrl"
          />
        </g-field>
        <g-field
          label="图标地址"
        >
          <g-upload-image
            v-model="slotProps.item.iconUrl"
          />
        </g-field>
        <g-field
          label="组件名称"
        >
          <g-input
            v-model="slotProps.item.dialogComponent"
          />
        </g-field>
        <g-field
          label="宽度"
        >
          <g-input-number
            v-model="slotProps.item.iconWidth"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
        <g-field
          label="高度"
        >
          <g-input-number
            v-model="slotProps.item.iconHeight"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
      </template>
    </g-field-collapse>


    <g-field-collapse label="圆圈设置">
      <g-field label="Api地址">
        <g-input
          v-model="config.circleApiUrl"
        />
      </g-field>
      <!-- <g-field label="颜色">
        <g-color-picker
          v-model="config.circleColor"
        />
      </g-field>
      <g-field label="宽度">
        <g-input-number
          v-model="config.circleWidth"
          :min="0"
          :max="10000"
          :step="1"
        />
      </g-field> -->
    </g-field-collapse>
    <g-field-collapse label="航班线设置">
      <g-field label="Api地址">
        <g-input
          v-model="config.filghtApiUrl"
        />
      </g-field>
      <!-- <g-field label="颜色">
        <g-color-picker
          v-model="config.filghtLineColor"
        />
      </g-field>
      <g-field label="宽度">
        <g-input-number
          v-model="config.filghtLineWidth"
          :min="0"
          :max="10000"
          :step="1"
        />
      </g-field> -->
    </g-field-collapse>
    <g-field-collapse
      v-model="config.AreaOutline.show"
      :toggle="true"
      label="区域轮廓线"
    >
      <g-field
        :level="2"
        label="区域数据Url"
      >
        <g-input
          v-model="config.AreaOutline.url"
        />
      </g-field>
      <g-field
        :level="2"
        label="内部背景颜色"
      >
        <g-color-picker
          v-model="config.AreaOutline.InnerbackgroundColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="外部背景颜色"
      >
        <g-color-picker
          v-model="config.AreaOutline.outerbackgroundColor"
        />
      </g-field>
      <g-field-collapse
        label="边框"
      >
        <g-field
          :level="2"
          label="宽度"
        >
          <g-input-number
            v-model="config.AreaOutline.broder.width"
            :min="0"
            :max="100"
            :step="1"
            suffix="px"
          />
        </g-field>
        <g-field
          :level="2"
          label="颜色"
        >
          <g-color-picker
            v-model="config.AreaOutline.broder.color"
          />
        </g-field>
      </g-field-collapse>
    </g-field-collapse>
    <g-field-collapse label="热力图设置">
      <g-field label="Api地址">
        <g-input
          v-model="config.heatmapApiUrl"
        />
      </g-field>
    </g-field-collapse>
    <g-field
      label="鹰眼"
    >
      <n-switch
        v-model:value="config.overviewMap"
      />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef,ref, computed } from 'vue'
import {
} from '@/data/select-options'

import { generateId } from '@/utils/util'
//import { IconPlus,IconDelete } from '@/icons'
//import { pointConfig } from '@/components/map/ol-map-wmts/pointConfig'

export default defineComponent({
  name: 'VBaiduMapProp',
  components: {
    // IconPlus,
    // IconDelete,
  },
  props: {
    com: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  setup(props) {
    //const config = toRef(props.com, 'config')

    const config = computed(()=>{
      let _config = (props.com as any).config
      if(!_config.filter)
      {
        _config.filter={
          grayscale : 0,
          sepia : 0,
          saturate : 0,
          hueRotate : 0,
          invert : 0,
          opacity : 1,
          brightness : 1,
          contrast : 0,
          blur : 0,
        }
      }
      return _config
    })

    const addPoint = () => {
      if(config.value.pointConfigs.some(r=>r.name==''))
      {
        return
      }
      config.value.pointConfigs.push({
        id:generateId('point'),
        name:'',
        code:'',
        apiUrl:'',
        iconUrl:'',
        dialogComponent:'',
        iconWidth: 20,
        iconHeight: 20,
      })
    }

    let lastTargetName = ref<string>(' ')

    const eventCollapseHeaderClick = (data: {
      name: string
      expanded: boolean
    }) => {
      console.log(data.name,lastTargetName.value)
      if (lastTargetName.value == data.name) {
        lastTargetName.value = ''
      } else {
        lastTargetName.value = data.name
      }
    }

    return {
      config,
      addPoint,
      lastTargetName,
      eventCollapseHeaderClick,
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
