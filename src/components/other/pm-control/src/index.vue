<template>
  <div class="datav-wrapper" :style="wraperStyle">
    <div style="color: #fff; font-size: 20px">PostMessage接收模块</div>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  PropType,
  computed,
  toRef,
  getCurrentInstance,
} from 'vue'
import { PmControl } from './pm-control'
import { useEventCenter } from '@/mixins/event-center'
import { HandleItemField } from '@/components/data-handle'
import { EditorModule } from '@/store/modules/editor'

export default defineComponent({
  name: 'VPmControl',
  props: {
    com: {
      type: Object as PropType<PmControl>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')
    const wraperStyle = computed(() => {
      return {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    useEventCenter(props.com)

    // 拿到mitter
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter;

    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case 'postmessage':
          if (window.parent) {
            window.parent.postMessage(field.params, '*');
          }
          console.log(field.params);
          break;
        case 'screenstatus':
          let params1 = JSON.parse(field.params);
          EditorModule.isChanged().then(r => {
            params1.changed = r;
            window.parent.postMessage(JSON.stringify(params1), '*');
          })
          break;
        case 'savescreen':
          let params2 = JSON.parse(field.params);
          EditorModule.saveScreen().then(r => {
            params2.saved = true;
            window.parent.postMessage(JSON.stringify(params2), '*');
          }).catch(r=>{
            params2.saved = false;
            window.parent.postMessage(JSON.stringify(params2), '*');
          })
          break;
        case 'onmessage':
          if (props.com.handles
            && props.com.handles.onmessage
            && props.com.handles.onmessage.fields
            && props.com.handles.onmessage.fields.length > 0) {
            props.com.handles.onmessage.fields.forEach(pmfield => {
              //pmfield.value = field.params;
              if (pmfield.hasDecideScript) {
                if (pmfield.decideScript) {
                  try {
                    const func = new Function("data,com", pmfield.decideScript);
                    const decideRes: boolean = func(field.params, props.com);
                    if (decideRes) {
                      // emit自定义事件
                      mitter.emit(pmfield.targetComId, pmfield);
                    } else {
                    }
                  } catch (error) {
                  }
                } else {
                }
              } else {
                mitter.emit(pmfield.targetComId, pmfield);
                //console.log("满足触发条件：" + field.targetComId);
              }
            })
          }
          break
      }
    })

    return {
      wraperStyle,
    }
  },
})
</script>
