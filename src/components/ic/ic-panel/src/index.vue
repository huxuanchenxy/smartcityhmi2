<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div style="color: #fff; font-size: 20px">点位配置组件</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef, watch, getCurrentInstance, onUnmounted, onMounted, ref, WatchStopHandle } from 'vue'
import { IcPanel } from './ic-panel'
import { useDataCenter } from '@/mixins/data-center'
import { useEventCenter } from '@/mixins/event-center'
import { readNode } from '@/api/ic'
import { HandleItemField } from '@/components/data-handle'
import { DatavError } from '@/domains/error'

export default defineComponent({
  name: 'VIcPanel',
  props: {
    com: {
      type: Object as PropType<IcPanel>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)
    useEventCenter(props.com)

    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')
    const watchList = ref([]);


    const wrapperStyle = computed(() => {
      return {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })

    async function initData() {
      let postData = [];
      config.value.ptList?.forEach(pt => {
        postData.push(pt.extension);
      })
      if (postData.length > 0) {
        let ret = await readNode(postData);
        if (ret.data.code == 200) {
          let asyncData = ret.data.data;
          if (asyncData && asyncData.length > 0) {
            asyncData.forEach(r => {
              if (r.status) {
                let changePt = config.value.ptList.find(t => t.device == r.device && t.propertyName == r.name);
                if (changePt) {
                  changePt.value = r.value;
                }
              }
            })
          }
        }
      }
    }

    onMounted(() => {
      initData();
      //点位联动事件 ic_event
      mitter.on(props.com.id, (field: HandleItemField) => {
        switch (field.targetMethodName) {
          case 'sync'://点位数据同步
            if (field.value && field.value.length > 0) {
              field.value.forEach(r => {
                let changePt = config.value.ptList.find(t => t.device == r.device && t.propertyName == r.name);
                if (changePt) {
                  changePt.value = r.value;
                }
              })
            }
        }
      })

      // 为每个项设置watcher
      config.value.ptList?.forEach((item) => {
        let watchItem = watch(() => item.value, (newVal, oldVal) => {
          item.fields.forEach(field => {
            if (field.targetMethodName != 'click' && field.targetMethodName != 'mouseEnter' && field.targetMethodName != 'mouseLeave'
            && field.targetMethodName != 'on' && field.targetMethodName != 'off' && field.targetMethodName != 'videoPlayed'
            && field.targetMethodName != 'videoEnded' && field.targetMethodName != 'videoCanplay') {
              field.value = newVal;

              if (field.targetMethodName == 'property') {
                mitter.emit(field.targetComId, field);
              } else {
                if (field.hasDecideScript) {
                  if (field.decideScript) {
                    try {
                      const func = new Function("data,com", field.decideScript);
                      const decideRes: boolean = func(field.value, props.com);
                      if (decideRes) {
                        // emit自定义事件
                        mitter.emit(field.targetComId, field);
                      } else {
                        //console.log("未满足触发条件：" + field.targetComId);
                      }
                    } catch (error) {
                      throw new DatavError("过滤条件执行失败", error.toString(), {
                        targetId: props.com.id,
                        origin: error
                      });
                    }
                  } else {
                    //console.log("未编写执行语句");
                  }
                } else {
                  mitter.emit(field.targetComId, field);
                }
              }
            }
          })
        });

        watchList.value.push(watchItem);
      });
    })

    onUnmounted(() => {
      mitter.off(props.com.id);

      if (watchList.value && watchList.value.length > 0) {
        (watchList.value as WatchStopHandle[]).forEach(watchEvent => {
          watchEvent();
        })
      }
    });

    return {
      wrapperStyle
    }
  },
})
</script>

