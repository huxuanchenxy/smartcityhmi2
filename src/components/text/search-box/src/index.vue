<template>
  <!-- <div style="width:100%;height:100%">
    <n-input-group class="inputbackground">
      <n-input-group-label v-if="iconStyle.show">
        <n-icon
          :size="24"
          color="#fffff"
          :style="{ paddingTop: '5px'}"
        >
          <IconSearch />
        </n-icon>
      </n-input-group-label>
      <n-input round :style="{ width: '100%' }" />
      <n-button type="primary" ghost>
        <span>搜索</span>
      </n-button>
    </n-input-group>
  </div> -->
  <div class="datav-wrapper" :style="wrapperStyle">
    <div class="seach-box-panel" :style="backgroundStyle">
    </div>
    <el-input
      v-model="inputValue"
      :placeholder="textBoxStyle.placeholder"
      style="margin:5px;"
      :input-style="textBoxStyle.textStyle"
      @change="textChange"
    >
      <template v-if="iconStyle.show" #prepend>
        <!-- <el-icon :size="12">
        <IconSearch />
      </el-icon> -->
        <n-icon
          :size="iconStyle.size"
          :color="iconStyle.color"
        >
          <IconSearch />
        </n-icon>
      </template>
      <template v-if="buttonStyle.show" #append>
        <el-button
          :style="{ borderStyle : buttonStyle.border.style, borderWidth: buttonStyle.border.width + 'px', borderColor: buttonStyle.border.color, backgroundColor: buttonStyle.color }"
          :round="buttonStyle.round"
          :circle="buttonStyle.circle"
          style="margin: -10px 0px;"
          @click="buttonClick"
        >
          <span
            :style="buttonTextStyle"
            style="{{ '--font-weight' : buttonStyle.value.textStyle.fontWeight }}"
          >
            {{ buttonStyle.text }}
          </span>
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts">
import { FontWeightProperty } from 'csstype'
import {} from 'csstype'
import { IconSearch } from '@/icons'
import { ElInput,ElButton } from 'element-plus'
import {
  defineComponent,
  PropType,
  computed,
  toRef,
  ref,
  getCurrentInstance,
} from 'vue'

import { searchBox } from './search-box'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { HandleItemField } from '@/components/data-handle'
import { useEventCenter } from '@/mixins/event-center'

export default defineComponent({
  name: 'VSearchBox',
  components: {
    IconSearch,
    ElInput,
    ElButton,
  },
  props: {
    com: {
      type: Object as PropType<searchBox>,
      required: true,
    },
  },
  setup(props) {

    const { datavEmit } = useDataCenter(props.com)
    useEventCenter(props.com)

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? []
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    // 拿到mitter
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    const comEvent = (fields: HandleItemField[]) => {
      fields.forEach(field => {
        // emit自定义事件
        mitter.emit(field.targetComId, field)
      })
    }

    //const config = toRef(props.com, 'config').value
    const inputValue = ref('')
    // const iconShow = computed(() => {
    //   return config.value.icon.show
    // })

    const iconStyle = computed(() => {
      return config.value.icon
    })

    const buttonStyle = computed(() => {
      return config.value.button
    })

    const buttonTextStyle = computed(() => {

      return {
        fontFamily: buttonStyle.value.textStyle.fontFamily,
        fontSize: `${ buttonStyle.value.textStyle.fontSize }pt`,
        color: buttonStyle.value.textStyle.color,
        fontWeight: buttonStyle.value.textStyle.fontWeight as FontWeightProperty,
      }
    })

    const textBoxStyle = computed(() => {
      return config.value.textBox
    })

    const backgroundStyle = computed(()=>{
      return {
        backgroundColor: config.value.backgroundStyle.color,
        opacity: config.value.backgroundStyle.opacity,
        borderRadius: `${config.value.backgroundStyle.border.radius.toString() }px`,
        borderStyle: config.value.backgroundStyle.border.style,
        borderWidth: `${config.value.backgroundStyle.border.width}px`,
        borderColor: config.value.backgroundStyle.border.color,
      }
    })

    const buttonClick = () => {
      let fileds = props.com.handles.buttonClick.fields
      fileds.forEach(r=>r.value=inputValue.value)
      console.log(fileds)
      comEvent(fileds)
    }

    const textChange = () => {
      let fileds = props.com.handles.textChange.fields
      fileds.forEach(r=>r.value=inputValue.value)
      comEvent(fileds)
    }



    return {
      //iconShow,
      inputValue,
      iconStyle,
      buttonStyle,
      buttonTextStyle,
      textBoxStyle,
      backgroundStyle,
      dv_data,
      dv_field,
      wrapperStyle,

      comEvent,
      buttonClick,
      textChange,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.el-input-group__append){
    background-color: transparent;
    border-style: none;
    /* padding-left: 0px;
    padding-right: 0px; */
}

:deep(.el-input-group__prepend){
    background-color: transparent;
    border-style: none;
    padding-left: 5px;
    padding-top:5px;
    padding-right: 0px;
}

:deep(.el-input__inner) {
    background-color: transparent;
    border-width: 0px;
}

:deep(.seach-box-panel){
    width:100%;
    height:100%;
    position:absolute;
}

:deep(.seach-box-button){
    font-weight: v-bind ('buttonStyle.textStyle.fontWeight');
}

</style>
