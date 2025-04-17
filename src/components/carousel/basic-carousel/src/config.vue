<template>
  <div class="setting-panel-gui">
    <g-field
      label="滚动方向"
    >
      <g-select
        v-model="config.direction"
        :data="carouselDirectionFamily"
      />
    </g-field>
    <g-field
      label="行高"
    >
      <g-input-number
        v-model="config.lineHeight"
        :min="0"
        :max="9999"
        :step="1"
      />
    </g-field>
    <g-field-collapse
      label="列宽"
    >
      <g-field
        :level="2"
        label="列序号"
      >
        <g-input-number
          v-model="config.colIndex"
          :min="0"
          :max="10"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="列宽比例"
      >
        <g-input-number
          v-model="config.widthList[config.colIndex]"
          :min="0"
          :max="10"
          :step="1"
        />
      </g-field>
    </g-field-collapse>
    <g-field
      label="滚动周期"
    >
      <g-input-number
        v-model="config.interval"
        :min="0"
        :max="9999"
        :step="1"
      />
    </g-field>
    <g-field
      label="显示行数"
    >
      <g-input-number
        v-model="config.rowsNum"
        :min="0"
        :max="maxRow"
        :step="1"
      />
    </g-field>
    <g-field
      label="限制字数"
    >
      <g-input-number
        v-model="config.limitContentLength"
        :min="1"
        :max="999"
        :step="1"
      />
    </g-field>
    <g-field-collapse
      v-model="config.topicShow"
      :toggle="true"
      label="标题设置"
    >
      <g-field
        :level="2"
        label="标题列数"
      >
        <g-input-number
          v-model="config.topicLength"
          :min="0"
          :max="10"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="标题内容"
      >
        <g-input
          v-model="config.topicData[0].topic0"
          label="第一列"
        />
        <g-input
          v-model="config.topicData[0].topic1"
          label="第二列"
        />
        <g-input
          v-model="config.topicData[0].topic2"
          label="第三列"
        />
        <g-input
          v-model="config.topicData[0].topic3"
          label="第四列"
        />
        <g-input
          v-model="config.topicData[0].topic4"
          label="第五列"
        />
        <g-input
          v-model="config.topicData[0].topic5"
          label="第六列"
        />
        <g-input
          v-model="config.topicData[0].topic6"
          label="第七列"
        />
        <g-input
          v-model="config.topicData[0].topic7"
          label="第八列"
        />
        <g-input
          v-model="config.topicData[0].topic8"
          label="第九列"
        />
        <g-input
          v-model="config.topicData[0].topic9"
          label="第一列"
        />
      </g-field>
      <g-field
        :level="2"
        label="标题行高"
      >
        <g-input-number
          v-model="config.topicStyleConfig.topicRowHeight"
          :min="0"
          :max="9999"
          :step="1"
        />
      </g-field>
      <g-field
        :level="2"
        label="背景颜色"
      >
        <g-color-picker
          v-model="config.topicStyleConfig.backgroundColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="字体颜色"
      >
        <g-color-picker
          v-model="config.topicStyleConfig.fontColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="字体大小"
      >
        <g-input
          v-model="config.topicStyleConfig.fontSize"
        />
      </g-field>
      <g-field
        :level="2"
        label="文字上边距"
      >
        <g-input
          v-model="config.topicStyleConfig.paddingTop"
        />
      </g-field>
      <g-field
        :level="2"
        label="文字左边距"
      >
        <g-input
          v-model="config.topicStyleConfig.paddingLeft"
        />
      </g-field>
      <g-field
        :level="2"
        label="文字对齐方式"
      >
        <g-select
          v-model="config.topicStyleConfig.textAlign"
          :data="textAlignFamily"
        />
      </g-field>
      <g-field
        :level="2"
        label="单元格上线宽"
      >
        <g-input
          v-model="config.topicStyleConfig.borderTopWidth"
        />
      </g-field>
      <g-field
        :level="2"
        label="单元格下线宽"
      >
        <g-input
          v-model="config.topicStyleConfig.borderBottomWidth"
        />
      </g-field>
      <g-field
        :level="2"
        label="单元格左线宽"
      >
        <g-input
          v-model="config.topicStyleConfig.borderLeftWidth"
        />
      </g-field>
      <g-field
        :level="2"
        label="单元格右线宽"
      >
        <g-input
          v-model="config.topicStyleConfig.borderRightWidth"
        />
      </g-field>
      <g-field
        :level="2"
        label="单元格线型"
      >
        <g-select
          v-model="config.topicStyleConfig.borderStyle"
          :data="carouselLineTypeFamily"
        />
      </g-field>
      <g-field
        :level="2"
        label="单元格线框颜色"
      >
        <g-color-picker
          v-model="config.topicStyleConfig.borderColor"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="特殊显示"
    >
      <g-field-collapse
        label="特殊列"
        :level="2"
      >
        <g-field
          :level="3"
          label="列序号"
        >
          <g-input
            v-model="config.colNum"
          />
        </g-field>
        <g-field
          :level="3"
          label="列颜色"
        >
          <g-color-picker
            v-model="config.colColor"
          />
        </g-field>
        <n-button style="font-size: 10px;padding-left: 5px;padding-right: 5px" @click="addIntoColColorList()">
          提交
        </n-button>
        <n-button style="font-size: 10px;padding-left: 5px;padding-right: 5px" @click="clearColColorList()">
          重置
        </n-button>
      </g-field-collapse>
      <g-field-collapse
        label="特殊内容"
      >
        <g-field
          :level="2"
          label="文字"
        >
          <g-input
            v-model="config.alertContent.highlightContent"
          />
          <n-button style="font-size: 10px;padding-left: 5px;padding-right: 5px" @click="addIntoHighlight1()">
            添至1类
          </n-button>
          <n-button style="font-size: 10px;padding-left: 5px;padding-right: 5px" @click="addIntoHighlight2()">
            添至2类
          </n-button>
          <n-button style="font-size: 10px;padding-left: 5px;padding-right: 5px" @click="addIntoHighlight3()">
            添至3类
          </n-button>
          <n-button style="font-size: 10px;padding-left: 5px;padding-right: 5px" @click="clearHighlight()">重置</n-button>
        </g-field>
        <g-field
          :level="2"
          label="演示颜色1"
        >
          <g-color-picker
            v-model="config.alertContent.color1"
          />
        </g-field>
        <g-field
          :level="2"
          label="演示颜色2"
        >
          <g-color-picker
            v-model="config.alertContent.color2"
          />
        </g-field>
        <g-field
          :level="2"
          label="演示颜色3"
        >
          <g-color-picker
            v-model="config.alertContent.color3"
          />
        </g-field>
      </g-field-collapse>
    </g-field-collapse>
    <g-field-collapse
      label="表格整体样式"
    >
      <g-field
        :level="2"
        label="线宽"
      >
        <g-input
          v-model="config.tableStyleConfig.borderWidth"
        />
      </g-field>
      <g-field
        :level="2"
        label="线型"
      >
        <g-select
          v-model="config.tableStyleConfig.borderStyle"
          :data="carouselLineTypeFamily"
        />
      </g-field>
      <g-field
        :level="2"
        label="框线颜色"
      >
        <g-color-picker
          v-model="config.tableStyleConfig.borderColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="整体背景颜色"
      >
        <g-color-picker
          v-model="config.tableStyleConfig.backgroundColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="线纹背景颜色"
      >
        <g-color-picker
          v-model="config.tableStyleConfig.backgroundStripeColor"
        />
      </g-field>
    </g-field-collapse>
    <g-field-collapse
      label="单元格样式"
    >
      <g-field
        :level="2"
        label="字体颜色"
      >
        <g-color-picker
          v-model="config.cellStyleConfig.fontColor"
        />
      </g-field>
      <g-field
        :level="2"
        label="字体大小"
      >
        <g-input
          v-model="config.cellStyleConfig.fontSize"
        />
      </g-field>
      <g-field
        :level="2"
        label="文字上边距"
      >
        <g-input
          v-model="config.cellStyleConfig.paddingTop"
        />
      </g-field>
      <g-field
        :level="2"
        label="文字左边距"
      >
        <g-input
          v-model="config.cellStyleConfig.paddingLeft"
        />
      </g-field>
      <g-field
        :level="2"
        label="文字对齐方式"
      >
        <g-select
          v-model="config.cellStyleConfig.textAlign"
          :data="textAlignFamily"
        />
      </g-field>
      <g-field
        :level="2"
        label="单元格线宽"
      >
        <g-input
          v-model="config.cellStyleConfig.borderWidth"
        />
      </g-field>
      <g-field
        :level="2"
        label="单元格线型"
      >
        <g-select
          v-model="config.cellStyleConfig.borderStyle"
          :data="carouselLineTypeFamily"
        />
      </g-field>
      <g-field
        :level="2"
        label="单元格线框颜色"
      >
        <g-color-picker
          v-model="config.cellStyleConfig.borderColor"
        />
      </g-field>
    </g-field-collapse>
    <g-field
      label="是否滚动"
    >
      <n-switch
        v-model:value="config.transformFlag"
      />
    </g-field>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRef } from 'vue'
import { carouselDirectionFamily, carouselLineTypeFamily, textAlignFamily } from '@/data/select-options'
import { BasicCarousel } from './basic-carousel'
import GSelect from '@/components/ui/select/src/index.vue'
import { ApiModule } from '@/store/modules/api'
import { useDataCenter } from '@/mixins/data-center'
import GColorPicker from '@/components/ui/color-picker/src/index.vue'
import GInput from '@/components/ui/input/src/index.vue'
import GInputNumber from '@/components/ui/input-number/src/index.vue'
import GField from '@/components/ui/field/src/index.vue'
import GFieldCollapse from '@/components/ui/field-collapse/src/index.vue'

export default defineComponent({
  name: 'VBasicCarouselProp',
  components: { GFieldCollapse, GField, GInputNumber, GInput, GColorPicker, GSelect },
  props: {
    com: {
      type: Object as PropType<BasicCarousel>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
    const config = toRef(props.com, 'config')
    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    const highlightList1 = computed(() => {
      return config.value.alertContent.highlightList1
    })

    const highlightList2 = computed(() => {
      return config.value.alertContent.highlightList2
    })

    const highlightList3 = computed(() => {
      return config.value.alertContent.highlightList3
    })

    const colIndexList = computed(() => {
      return config.value.colIndexList
    })

    const colIndexColorList = computed(() => {
      return config.value.colIndexColorList
    })

    const colNum = computed(() => {
      return config.value.colNum
    })

    const colColor = computed(() => {
      return config.value.colColor
    })

    //调整行数时，限制最大为json返回值的表长
    const maxRow = computed(() => {
      if (dv_data.value.length > 0) {
        return dv_data.value.length ?? config.value.dataList.length
      }
      return 0
    })
    //限制行高不允许低于padding+fontSize
    const minRowHeight = computed(() => {
      return config.value.cellStyleConfig.paddingTop
        + config.value.cellStyleConfig.fontSize
    })

    function addIntoHighlight1() {
      console.log(highlightList1.value)
      highlightList1.value.push(config.value.alertContent.highlightContent)
      config.value.alertContent.highlightContent=null
      console.log(highlightList1.value)
    }

    function addIntoHighlight2() {
      console.log(highlightList2.value)
      highlightList2.value.push(config.value.alertContent.highlightContent)
      config.value.alertContent.highlightContent=null
      console.log(highlightList2.value)
    }

    function addIntoHighlight3() {
      console.log(highlightList3.value)
      highlightList3.value.push(config.value.alertContent.highlightContent)
      config.value.alertContent.highlightContent=null
      console.log(highlightList3.value)
    }

    function clearHighlight() {
      config.value.alertContent.highlightList1=[]
      config.value.alertContent.highlightList2=[]
      config.value.alertContent.highlightList3=[]
      config.value.dataRowColInfoList1 = []
      config.value.dataRowColInfoList2 = []
      config.value.dataRowColInfoList3 = []
    }

    function addIntoColColorList(){
      colIndexList.value.push(colNum.value)
      colIndexColorList.value.push(colColor.value)
    }

    function clearColColorList(){
      config.value.colIndexList=[]
      config.value.colIndexColorList=[]
    }

    return {
      clearColColorList,
      addIntoColColorList,
      addIntoHighlight1,
      addIntoHighlight2,
      addIntoHighlight3,
      clearHighlight,
      carouselDirectionFamily,
      carouselLineTypeFamily,
      textAlignFamily,
      config,
      maxRow,
      minRowHeight,
    }
  },
})
</script>
