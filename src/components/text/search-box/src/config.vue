<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="背景"
    >
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.backgroundStyle.color"
        />
      </g-field>
      <g-field
        :level="2"
        label="透明度"
      >
        <g-input-number
          v-model="config.backgroundStyle.opacity"
          :min="0"
          :max="1"
          :step="0.1"
        />
      </g-field>
      <g-field-collapse
        label="边框"
      >
        <g-field
          :level="2"
          label="圆角"
        >
          <g-input-number
            v-model="config.backgroundStyle.border.radius"
            :step="1"
            suffix="px"
          />
        </g-field>
        <g-field
          :level="2"
          label="颜色"
        >
          <g-color-picker
            v-model="config.backgroundStyle.border.color"
          />
        </g-field>
        <g-field
          :level="2"
          label="样式"
        >
          <g-select
            v-model="config.backgroundStyle.border.style"
            :data="lineStyles"
          />
        </g-field>
        <g-field
          :level="2"
          label="宽度"
        >
          <g-input-number
            v-model="config.backgroundStyle.border.width"
            :min="0"
            :max="100"
            :step="1"
            suffix="px"
          />
        </g-field>
      </g-field-collapse>
    </g-field-collapse>
    <g-field-collapse
      v-model="config.icon.show"
      :toggle="true"
      label="图标"
    >
      <g-field
        :level="2"
        label="尺寸"
      >
        <g-input-number
          v-model="config.icon.size"
          :min="0"
          :max="100"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.icon.color"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      v-model="config.button.show"
      :toggle="true"
      label="按钮"
    >
      <g-field
        :level="2"
        label="文本内容"
      >
        <g-input
          v-model="config.button.text"
        />
      </g-field>
      <g-field
        :level="2"
        label="颜色"
      >
        <g-color-picker
          v-model="config.button.color"
        />
      </g-field>
      <g-field-collapse
        label="文本样式"
      >
        <g-field
          :level="2"
          label="字体"
        >
          <g-select
            v-model="config.button.textStyle.fontFamily"
            :data="fontFamilys"
          />
        </g-field>
        <g-field
          :level="2"
          label="大小"
        >
          <g-input-number
            v-model="config.button.textStyle.fontSize"
            :min="0"
            :max="100"
            :step="1"
            suffix="pt"
          />
        </g-field>
        <g-field
          :level="2"
          label="颜色"
        >
          <g-color-picker
            v-model="config.button.textStyle.color"
          />
        </g-field>
        <g-field
          :level="2"
          label="粗细"
        >
          <g-select
            v-model="config.button.textStyle.fontWeight"
            :data="fontWeights"
          />
        </g-field>
      </g-field-collapse>
      <g-field-collapse
        label="边框"
      >
        <g-field
          :level="2"
          label="颜色"
        >
          <g-color-picker
            v-model="config.button.border.color"
          />
        </g-field>
        <g-field
          :level="2"
          label="样式"
        >
          <g-select
            v-model="config.button.border.style"
            :data="lineStyles"
          />
        </g-field>
        <g-field
          :level="2"
          label="宽度"
        >
          <g-input-number
            v-model="config.button.border.width"
            :step="1"
            suffix="px"
          />
        </g-field>
      </g-field-collapse>
      <g-field
        :level="2"
        label="圆形按钮"
      >
        <n-switch
          v-model:value="config.button.circle"
        />
      </g-field>
      <g-field
        :level="2"
        label="圆角按钮"
      >
        <n-switch
          v-model:value="config.button.round"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="文本框"
    >
      <g-field
        :level="2"
        label="提示信息"
      >
        <g-input
          v-model="config.textBox.placeholder"
        />
      </g-field>
      <g-field-collapse
        label="文本样式"
      >
        <g-field
          :level="2"
          label="字体"
        >
          <g-select
            v-model="config.textBox.textStyle.fontFamily"
            :data="fontFamilys"
          />
        </g-field>
        <g-field
          :level="2"
          label="大小"
        >
          <g-input-number
            v-model="config.textBox.textStyle.fontSize"
            :min="0"
            :max="100"
            :step="1"
            suffix="pt"
          />
        </g-field>
        <g-field
          :level="2"
          label="颜色"
        >
          <g-color-picker
            v-model="config.textBox.textStyle.color"
          />
        </g-field>
        <g-field
          :level="2"
          label="粗细"
        >
          <g-select
            v-model="config.textBox.textStyle.fontWeight"
            :data="fontWeights"
          />
        </g-field>
        <g-field
          :level="2"
          label="对齐"
        >
          <g-select
            v-model="config.textBox.textStyle.textAlign"
            :data="hAligns"
          />
        </g-field>
      </g-field-collapse>
      <!-- <g-field
        :level="2"
        label="高度"
      >
        <g-input-number
          v-model="config.textBox.height"
          :step="1"
          suffix="px"
        />
      </g-field>
      <g-field
        :level="2"
        label="行高"
      >
        <g-input-number
          v-model="config.textBox.lineHeight"
          :step="1"
          suffix="px"
        />
      </g-field> -->
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, toRef, watch,watchEffect } from 'vue'
import {
  lineStyles,
  fontFamilys,
  fontWeights,
  hAligns,
} from '@/data/select-options'
import { searchBox } from './search-box'

export default defineComponent({
  name: 'VSearchBoxProp',
  props: {
    com: {
      type: Object as PropType<searchBox>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')


    watch(()=>config.value.button.circle,(newValue, oldValue)=>{
      if(!oldValue && newValue){
        config.value.button.round = false
      }
    })

    watch(()=>config.value.button.round,(newValue, oldValue)=>{
      if(!oldValue && newValue){
        config.value.button.circle = false
      }
    })

    // watch(round,(newValue, oldValue)=>{
    //   if(!oldValue && newValue){
    //     config.value.button.circle = false
    //   }
    // })

    // watch(config.value.button,(newValue,oldValue)=>{
    //   console.log('button',newValue.circle,oldValue.circle)
    //   if(!oldValue.circle && newValue.circle)
    //   {
    //     config.value.button.round=false
    //   }

    // })

    return {
      config,

      lineStyles,
      fontFamilys,
      fontWeights,
      hAligns,
    }
  },
})
</script>
