<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div :style="titleStyle">
      <span :style="titleContentStyle">{{ com.config.titleConfig.title }}</span>
      <n-button text type="info" :style="ButtonStyle" @click="handleCancleClick" style="overflow:hidden;">
        <img :src="com.config.iconConfig.closeIcon" style="height: 20px;" :style="{
          'position': 'relative',
          'left': '-80px', 'filter': 'drop-shadow(' + com.config.iconConfig.iconColor + ' 80px 0)'
        }">
      </n-button>
    </div>
    <n-form ref="formRef" label-placement="left" :label-width="com.config.labelWidth" :model="com.config"
      style="padding:20px 40px 0 20px">
      <n-form-item :label="item.label" :path="`items[${index}].control.value`" v-for="(item, index) in com.config.items"
        :style="wordStyle" :rule="{
          required: item.control.required,
          message: item.label + '不能为空',
          trigger: ['input', 'blur'],
        }">
        <n-input v-if="item.control.type == ctEnum.input" type="text" :name="item.code" v-model:value="item.control.value"
          :placeholder="item.control.placeholder" :style="wordStyle" />
        <n-input-number style="width:100%" v-if="item.control.type == ctEnum.number" v-model:value="item.control.value"
          :placeholder="item.control.placeholder" :min="item.control.numberOptions.min"
          :max="item.control.numberOptions.max" :step="item.control.numberOptions.step" :style="wordStyle" />
        <n-radio-group v-if="item.control.type == ctEnum.radio" v-model:value="item.control.value" :name="item.code"
          size="large">
          <n-space>
            <n-radio v-for="option in item.control.radioOptions.options" :key="option.value" :value="option.value"
              :style="wordStyle">
              {{ option.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
        <n-select v-if="item.control.type == ctEnum.select" :name="item.code" v-model:value="item.control.value"
          :label-field="item.control.selectOptions.labelKey" :value-field="item.control.selectOptions.valueKey" filterable
          :options="item.control.selectOptions.options" :style="wordStyle" />
        <n-checkbox-group :name="item.code" v-if="item.control.type == ctEnum.checkbox"
          v-model:value="item.control.value">
          <n-space item-style="display: flex;">
            <n-checkbox v-for="option in item.control.checkBoxOptions.options" :value="option.value" :label="option.label"
              :checked-value="item.control.checkBoxOptions.checkedValue"
              :unchecked-value="item.control.checkBoxOptions.uncheckedValue" size="large" :style="wordStyle" />
          </n-space>
        </n-checkbox-group>
        <n-date-picker :name="item.code" v-if="item.control.type == ctEnum.date" v-model:value="item.control.value"
          type="date" :format="item.control.dateOptions.dateFormat" :style="wordStyle" style="width:100%" />
        <n-time-picker :name="item.code" v-if="item.control.type == ctEnum.time" v-model:value="item.control.value"
          :format="item.control.timeOptions.timeFormat" :style="wordStyle" style="width:100%" />
      </n-form-item>
      <n-form-item style="display:flex;align-items: center;justify-content: center">
        <div style="width:200px;height:100%;display:flex;align-items: center;justify-content: space-around">
          <n-button v-if="com.config.buttonOptions.showSubmit" :type="com.config.buttonOptions.submitButtonType"
            focusable="false" @click="handleValidateClick">
            {{ com.config.buttonOptions.submitButtonText }}
          </n-button>
          <n-button v-if="com.config.buttonOptions.showCancel" :type="com.config.buttonOptions.cancleButtonType"
            focusable="false" @click="handleCancleClick">
            {{ com.config.buttonOptions.cancleButtonText }}
          </n-button>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  PropType,
  computed,
  toRef,
  getCurrentInstance,
  ref,
  onMounted,
} from 'vue'
import type { CSSProperties } from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { BasicForm } from './basic-form'
import { useEventCenter } from '@/mixins/event-center'
import type { FormInst, FormRules } from 'naive-ui'
import { controlType } from './basic-form'
import { readNode, writeNode } from '@/api/ic'
import { nextDay } from 'date-fns'
import { HandleItemField } from '@/components/data-handle'


export default defineComponent({
  name: 'VBasicForm',
  props: {
    com: {
      type: Object as PropType<BasicForm>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)


    const formRef = ref<FormInst | null>(null)

    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case 'open':
          props.com.hided = false;
          initData();
          break;
        case 'close':
          props.com.hided = true;
          break
      }
    })


    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    onMounted(() => {
      initData();
    })

    const initData = () => {
      let list = [];
      props.com.config.items.forEach(r => {
        if (r.pt.extension && r.pt.extension.device && r.pt.extension.name) {
          list.push({ device: r.pt.extension.device, name: r.pt.extension.name });
        }
      })
      if (list.length > 0) {
        readNode(list).then(r => {
          if (r.data.code == 200) {
            let result = r.data.data;
            if (result.length > 0) {
              result.forEach(item => {
                props.com.config.items.forEach(formItem => {
                  if (formItem.pt.extension.device == item.device && formItem.pt.extension.name == item.name) {
                    formItem.control.value = item.value;
                  }
                })
              })
            }
          }
        })
      }
    }

    const strToNum = (str) => {
      const num = Number(str);
      if (isNaN(num)) {
        if (str && str.length > 0) {
          if (str == 'true') {
            return true
          } else if (str == 'false') {
            return false
          }
          else {
            return '\'' + str + '\'';
          }
        }
        else {
          return null;
        }
      }
      return num;
    }


    const handleValidateClick = (e: MouseEvent) => {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          //逻辑代码
          let list = [];
          props.com.config.items.forEach(r => {
            if (r.pt.extension && r.pt.extension.name && r.pt.extension.device) {
              var cValue = strToNum(r.control.value);
              list.push({ device: r.pt.extension.device, name: r.pt.extension.name, value: cValue })
            }
          })
          writeNode(list, [], []).then(r => {
            if (r.data.code == 200) {
              //提交按钮事件互动
              if (props.com.handles
                && props.com.handles.submit
                && props.com.handles.submit.fields
                && props.com.handles.submit.fields.length > 0) {
                props.com.handles.submit.fields.forEach(pmfield => {
                  mitter.emit(pmfield.targetComId, pmfield);
                })
              }
            }
            else {
              console.log(r.msg);
            }
          });
        }
        else {
          console.log(errors)
        }
      })
    }

    const handleCancleClick = (e: MouseEvent) => {
      e.preventDefault();
      props.com.hided = true;
      //取消按钮事件互动
      if (props.com.handles
        && props.com.handles.cancle
        && props.com.handles.cancle.fields
        && props.com.handles.cancle.fields.length > 0) {
        props.com.handles.cancle.fields.forEach(pmfield => {
          mitter.emit(pmfield.targetComId, pmfield);
        })
      }
    }

    const wrapperStyle = computed(() => {
      const style = {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        'font-family': `${config.value.textStyle.fontFamily}, Arial, sans-serif`,
        'font-size': `${config.value.textStyle.fontSize}px`,
        'font-weight': config.value.textStyle.fontWeight,
        'background-color': 'initial',
        border: 'none',
        'border-radius': '0px',
        transform: 'translateZ(0px)',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
        overflow: 'hidden',
      }

      if (config.value.background.show) {
        const bgs = config.value.background
        style['background-color'] = bgs.bgColor
        style.border = `${bgs.borderWidth}px ${bgs.borderStyle} ${bgs.borderColor}`
        style['border-radius'] = `${bgs.borderRadius}px`
      }

      return style as CSSProperties
    })

    const wordStyle = computed(() => {
      const style = {
        //'--n-blank-height': (config.value.textStyle.fontSize + 14) + 'px',
        //'--n-label-height': (config.value.textStyle.fontSize + 6) + 'px',
        //'--n-height': (config.value.textStyle.fontSize + 14) + 'px',
        '--n-label-text-color': config.value.textStyle.color,
        '--n-text-color': config.value.textStyle.color,
        '--n-label-font-size': config.value.textStyle.fontSize + 'px',
        '--n-font-size': config.value.textStyle.fontSize + 'px',
      }
      return style as CSSProperties
    })

    const titleStyle = computed(() => {
      const ts = config.value.titleConfig.titleStyle
      const style = {
        background: ts.background,
        color: ts.color,
        fontSize: `${ts.fontSize}px`,
        fontWeight: ts.fontWeight,
        height: `${ts.height}px`,
        width: `${ts.width}%`,
        display: ts.show ? 'inline-block' : 'none',
      }
      return style as CSSProperties
    })

    const titleContentStyle = computed(() => {
      const ts = config.value.titleConfig.titleStyle
      const style = {
        paddingTop: `${ts.paddingTop}px`,
        paddingLeft: `${ts.paddingLeft}px`,
        display: 'inline-block',
      }
      return style as CSSProperties
    })

    const ButtonStyle = computed(() => {
      const bs = config.value.iconConfig
      const style = {
        paddingTop: '-10px',
        float: `right`,
        height: `${bs.buttonHeight}px`,
        width: `${bs.buttonWidth}px`,
      }
      return style as CSSProperties
    })

    return {
      wrapperStyle,
      wordStyle,
      handleValidateClick,
      handleCancleClick,
      formRef,
      ctEnum: controlType,
      titleStyle,
      titleContentStyle,
      ButtonStyle
    }
  },
})
</script>
