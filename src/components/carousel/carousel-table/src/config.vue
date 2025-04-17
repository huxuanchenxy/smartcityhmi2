<template>
  <div class="setting-panel-gui">
    <g-field-collapse
      label="表格整体"
    >
      <g-field
        :level="2"
        label="轮播时间间隔"
      >
        <g-input-number
          v-model="config.common.waitTime"
          :min="0"
          :max="1000000"
          :step="1"
          suffix="ms"
        />
      </g-field>
      <g-field
        :level="2"
        label="表行数"
      >
        <g-input-number
          v-model="config.common.rowNum"
          :min="0"
          :max="1000000"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="显示行号"
      >
        <n-switch
          v-model:value="config.common.showIndex"
        />
      </g-field>
      <g-field
        :level="2"
        label="轮播方式"
      >
        <g-select
          v-model="config.common.carousel"
          :data="[{ id:'single',value:'整行'},{ id:'page',value:'整页'}]"
        />
      </g-field>
      <g-field
        :level="2"
        label="悬浮暂停轮播"
      >
        <n-switch
          v-model:value="config.common.hoverPause"
        />
      </g-field>
      <g-field
        :level="2"
        label="奇数行背景色"
      >
        <g-color-picker
          v-model="config.common.oddRowBGC"
        />
      </g-field>
      <g-field
        :level="2"
        label="偶数行背景色"
      >
        <g-color-picker
          v-model="config.common.evenRowBGC"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      v-model="config.header.show"
      :toggle="true"
      label="表头"
    >
      <g-field
        :level="2"
        label="行号表头"
      >
        <g-input
          v-model="config.header.indexHeader"
        />
      </g-field>
      <g-field
        :level="2"
        label="表头高度"
      >
        <g-input-number
          v-model="config.header.headerHeight"
          :min="0"
          :max="10000"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="表头背景色"
      >
        <g-color-picker
          v-model="config.header.headerBGC"
        />
      </g-field>
      <g-field-collapse
        label="字体设置"
      >
        <g-field
          :level="2"
          label="大小"
        >
          <g-input-number
            v-model="config.header.fontSize"
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
            v-model="config.header.fontColor"
          />
        </g-field>
        <g-field
          :level="2"
          label="样式"
        >
          <g-select
            v-model="config.header.fontStyle"
            :data="fontStyles"
          />
        </g-field>
        <g-field
          :level="2"
          label="粗细"
        >
          <g-select
            v-model="config.header.fontWeight"
            :data="fontWeights"
          />
        </g-field>
        <g-field
          :level="2"
          label="字体"
        >
          <g-select
            v-model="config.header.fontFamily"
            :data="fontFamilys"
          />
        </g-field>
      </g-field-collapse>
    </g-field-collapse>

    <g-field-collapse
      label="列设置"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical','horizontal','copy','add','remove']"
      :list="config.columns"
      :min="0"
      :max="20"
      tab="列"
      :add-item="addColumns"
    >
      <template #default="slotProps">
        <g-field
          label="标题"
        >
          <g-input
            v-model="slotProps.item.title"
          />
        </g-field>
        <g-field
          label="列宽"
        >
          <g-input-number
            v-model="slotProps.item.width"
            :min="0"
            :max="10000"
            :step="1"
          />
        </g-field>
        <g-field
          label="对齐"
        >
          <g-select
            v-model="slotProps.item.align"
            :data="[{ id:'left',value:'左对齐'},{ id:'center',value:'居中'},{ id:'right',value:'右对齐'}]"
          />
        </g-field>
        <g-field-collapse
          label="文本设置"
        >
          <g-field
            :level="2"
            label="大小"
          >
            <g-input-number
              v-model="slotProps.item.fontSize"
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
              v-model="slotProps.item.fontColor"
            />
          </g-field>
          <g-field
            :level="2"
            label="样式"
          >
            <g-select
              v-model="slotProps.item.fontStyle"
              :data="fontStyles"
            />
          </g-field>
          <g-field
            :level="2"
            label="粗细"
          >
            <g-select
              v-model="slotProps.item.fontWeight"
              :data="fontWeights"
            />
          </g-field>
          <g-field
            :level="2"
            label="字体"
          >
            <g-select
              v-model="slotProps.item.fontFamily"
              :data="fontFamilys"
            />
          </g-field>
        </g-field-collapse>
      </template>
    </g-field-collapse>
    <g-field-collapse
      label="特殊文字"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical','horizontal','copy','add','remove']"
      :list="config.SpecialCharactersList"
      :min="0"
      :max="20"
      tab="文字"
      :add-item="addSpecialCharacters"
    >
      <template #default="slotProps">
        <g-field
          label="文本"
        >
          <g-input
            v-model="slotProps.item.text"
          />
        </g-field>
        <g-field
          label="颜色"
        >
          <g-color-picker
            v-model="slotProps.item.color"
          />
        </g-field>
      </template>
    </g-field-collapse>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef } from 'vue'
import {
} from '@/data/select-options'
import { CarouselTable, CarouselColumn } from './carousel-table'
import {
  lineStyles,
  fontStyles,
  fontWeights,
  fontFamilys,
  hAligns,
} from '@/data/select-options'
//import { generateId } from '@/utils/util'

export default defineComponent({
  name: 'VCarouselTableProp',
  props: {
    com: {
      type: Object as PropType<CarouselTable>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    const addColumns = () => {

      return {
        title:'',
        width:100,
        align:'left',
        fontSize:30,
        fontColor:'#fff',
        fontStyle:'normal',
        fontWeight:'normal',
        fontFamily:'微软雅黑',
      }
      //console.log('addColumns', config.value.columns)
    }


    const addSpecialCharacters = () => {
      return {
        text:'',
        color:'#fff',
      }
    }

    return {
      config,
      addColumns,
      addSpecialCharacters,
      lineStyles,
      fontStyles,
      fontWeights,
      fontFamilys,
      hAligns,
    }
  },
})
</script>
