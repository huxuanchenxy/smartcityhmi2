<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div class="drop-down-list-panel" :style="backgroundStyle">
    </div>
    <el-select
      v-model="selectedValue"
      :placeholder="inputStyle.placeholder"
      :popper-append-to-body="false"
      :teleported="false"
      :fit-input-width="true"
      :style="{ width: '100%',height: '100%' }"
      popper-class="popperPanel"
      @change="optionSelect"
    >
      <el-option
        v-for="item in optionList"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { ElSelect,ElOption } from 'element-plus'
import { groupBy } from 'lodash-es'
import {
  defineComponent,
  PropType,
  computed,
  toRef,
  ref,
  getCurrentInstance,
} from 'vue'

import { dropDownList } from './drop-down-list'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { HandleItemField } from '@/components/data-handle'
import { useEventCenter } from '@/mixins/event-center'


export default defineComponent({
  name: 'VDropDownList',
  components: {
    ElSelect,
    ElOption,
  },
  props: {
    com: {
      type: Object as PropType<dropDownList>,
      required: true,
    },
  },
  setup(props) {

    const { datavEmit } = useDataCenter(props.com)
    useEventCenter(props.com)

    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    const dv_data = computed(() => {
      //console.log('ApiModule.dataMap[props.com.id]',ApiModule.dataMap[props.com.id])
      return ApiModule.dataMap[props.com.id]?.source ?? []
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const filterParam = ref('')

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    const chartData = computed(() => {
      const groups = groupBy(dv_data.value, item => item[dv_field.value.label])
      //console.log('dv_data',dv_data)
      //console.log('chartData.groups',groups)
      return {
        keys: Object.keys(groups),
        values: Object.values(groups),
      }
    })

    const options = ref(Array<{ value:string;label:string;category:string;}>())

    const optionList = computed(()=>{
      updateOptions()
      return options.value
    })
    const updateOptions = () => {
      const { values } = chartData.value
      //console.log('values type',values,chartData.value,chartData)
      let valueSet=values
      if(filterParam.value != '' && filterParam.value !=null){
        //console.log('values',valueSet)
        valueSet=valueSet.filter(r=> {
          //console.log('r',r[0],r[0][dv_field.value.category])
          const item = r[0]
          return item ?  item[dv_field.value.category].indexOf(filterParam.value)>=0 : false
        })
      }
      let list= valueSet.map(v => {
        const obj = v[0]
        return {
          value: obj ? obj[dv_field.value.value] : null,
          label: obj ? obj[dv_field.value.label] : null,
          category: obj ? obj[dv_field.value.category] : null,
        }
      })
      //console.log('dropdownlist-list',list)

      options.value = list
    }

    updateOptions()

    const comEvent = (fields: HandleItemField[]) => {
      fields.forEach(field => {
        // emit自定义事件
        mitter.emit(field.targetComId, field)
      })
    }

    const optionSelect = () => {
      let fileds = props.com.handles.optionSelect.fields
      fileds.forEach(r=>r.value=selectedValue.value)
      comEvent(fileds)
    }

    const backgroundStyle = computed(()=>{
      return {
        backgroundColor: config.value.backgroundStyle.color,
        opacity: config.value.backgroundStyle.opacity,
        borderRadius: `${config.value.backgroundStyle.border.radius.toString()}px`,
        borderStyle: config.value.backgroundStyle.border.style,
        borderWidth: `${config.value.backgroundStyle.border.width}px`,
        borderColor: config.value.backgroundStyle.border.color,
      }
    })

    const inputStyle = computed(()=>{
      return config.value.input
    })

    const optionStyle = computed(()=>{
      return config.value.option
    })

    const selectedValue=ref('')

    // const optionColor='white'

    return {
      dv_data,
      dv_field,

      wrapperStyle,
      backgroundStyle,
      inputStyle,
      optionStyle,

      comEvent,

      selectedValue,
      options,
      optionList,
      filterParam,

      optionSelect,
      //updateOptions,
    //   optionColor,
    }
  },
})
</script>

<style lang="scss" scoped>

:deep(.el-input-group__append){
    background-color: transparent;
    border-style: none;
}

:deep(.el-input-group__prepend){
    background-color: transparent;
    border-style: none;
    padding-left: 5px;
    padding-top:5px;
    padding-right: 0px;
}

:deep(.el-input__inner){
    background-color: transparent;
    border-width: 0px;
    font-family: v-bind("inputStyle.fontFamily");
    font-size: v-bind("inputStyle.fontSize + 'pt'");
    color: v-bind("inputStyle.color");
    font-weight: v-bind("inputStyle.fontWeight");
}


:deep(.drop-down-list-panel){
    width:100%;
    height:100%;
    position:absolute;
}

:deep(.el-popper__arrow){
    display: none;
}

:deep(.el-select__popper.el-popper[role=tooltip])
{
    background-color:transparent;
    border-style: none;
}

:deep(.el-popper.is-light)
{
    border-style: none;
}

:deep(.popperPanel){
    /* background-color: var(--backgroundStyle.color); */
    background-color: v-bind("optionStyle.background.color");
    border-style: none;
    opacity: v-bind("optionStyle.background.opacity");
    border-radius: v-bind("optionStyle.background.border.radius");
    border-color: v-bind("optionStyle.background.border.color");
    border-style: v-bind("optionStyle.background.border.style");
    border-width: v-bind("optionStyle.background.border.width + 'px'");
}

:deep(.el-select-dropdown__item:not(.is-disabled))
{
    /* color:var(--optionColor); */
    color: v-bind("optionStyle.textStyle.color");
    font-family: v-bind("optionStyle.textStyle.fontFamily");
    font-size: v-bind("optionStyle.textStyle.fontSize+'pt'");
    font-weight: v-bind("optionStyle.textStyle.fontWeight");
}

:deep(.el-select-dropdown__item:not(.is-disabled):hover)
{
    /* background-color: var(--optionColor); */
    // background-color:v-bind(optionColor);
    background-color:v-bind("optionStyle.hovered.backgroundColor");
    color:v-bind("optionStyle.hovered.fontColor");
}

// :deep(.el-select-dropdown__item:not(.is-disabled):focus)
// {
//     // color:v-bind("inputStyle.color");
//     font-weight: 600;
// }

/*
::v-deep .el-scrollbar__view
{
    border-image-width:0px;
} */

</style>
