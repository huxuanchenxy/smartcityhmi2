<template>
  <div class="datav-wrapper" :style="wraperStyle">
    <div style="color: #fff; font-size: 20px">通讯组件</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, getCurrentInstance, ref, onUnmounted } from 'vue'
import { WsControl } from './ws-control'
import { useEventCenter } from '@/mixins/event-center'
import { HandleItemField } from '@/components/data-handle'
import { EditorModule } from '@/store/modules/editor'
import { useDataCenter } from '@/mixins/data-center'
import { generateUUID } from '@/utils/util'
import { DatavError } from '@/domains/error'

export default defineComponent({
  name: 'VWsControl',
  props: {
    com: {
      type: Object as PropType<WsControl>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const ws = ref(null);
    let failCount = 0;
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter
    useDataCenter(props.com)
    useEventCenter(props.com)

    const reviceSocket = (data) => {
      if (config.value.mode == 'dev') {
        console.log("reviceSocket:结果如下");
        console.log(data);
      }
      if (props.com.handles
        && props.com.handles.reviceSocket
        && props.com.handles.reviceSocket.fields
        && props.com.handles.reviceSocket.fields.length > 0) {
        props.com.handles.reviceSocket.fields.forEach(field => {
          field.value = data;

          if (field.hasDecideScript) {
            if (field.decideScript) {
              try {
                const func = new Function("data,com", field.decideScript);
                const decideRes: boolean = func(field.value, props.com);
                if (decideRes) {
                  // emit自定义事件
                  mitter.emit(field.targetComId, field);
                  //console.log("满足触发条件：" + field.targetComId);
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
            //console.log("满足触发条件：" + field.targetComId);
            //console.log(field);
          }
        })
      }
    }

    // 实际调用的方法
    const sendSocket = (data) => {
      if (ws.value.readyState === ws.value.OPEN) {
        // 若是ws开启状态
        websocketsend(data);
      } else if (ws.value.readyState === ws.value.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(() => {
          sendSocket(data);
        }, 1000);
      } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(() => {
          sendSocket(data);
        }, 1000);
      }
    }

    const closeSocket = () => {
      try {
        ws.value.close();
        console.log('WebSocket已关闭');
      }
      catch (e) {

      }
    }

    // 失败重连的方法
    const reconnectSocket = (e) => {
      failCount++;// 连接失败的次数
      //连接三次
      if (failCount <= config.value.retryCounts) {
        setTimeout(() => {
          initSocket();
        }, 3000);
      } else {

      }
    }


    const initSocket = () => {
      if (config.value.uuid) {
        var ws_uuid = config.value.ws + "/" + generateUUID().replaceAll('-', '') + "/" + EditorModule.screen.groupId;
        ws.value = new WebSocket(ws_uuid);
      }
      else {
        ws.value = new WebSocket(config.value.ws + "/" + EditorModule.screen.groupId);
      }
      //连接成功建立的回调方法
      ws.value.onopen = function () {
        console.log("ws连接成功");
      }

      //连接关闭的回调方法
      ws.value.onclose = function () {
        console.log("ws连接关闭");
      }

      //发生错误
      ws.value.onerror = function (e) {
        console.log("ws连接发生错误");
        reconnectSocket(e);
      };

      //接收到消息的回调方法
      ws.value.onmessage = function (msg) {
        // 收到信息为Blob类型时
        let result = null;
        // debugger
        if (msg.data instanceof Blob) {
          const reader = new FileReader();
          reader.readAsText(msg.data, "UTF-8");
          reader.onload = (e) => {
            if (typeof reader.result === "string") {
              result = JSON.parse(reader.result);
            }
            reviceSocket(result);
          };
        } else {
          result = JSON.parse(msg.data);
          reviceSocket(result);
        }
      }
    }

    // 数据发送
    const websocketsend = (agentData) => {
      ws.value.send(agentData);
      if (config.value.mode == 'dev') {
        console.log("发送数据：" + agentData);
      }
    }

    const attr = toRef(props.com, 'attr')
    const wraperStyle = computed(() => {
      return {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      }
    })


    if (!EditorModule.editMode) {
      initSocket();
    }


    onUnmounted(() => {
      closeSocket();
    });


    //  监听自定义事件
    mitter.on(props.com.id, (field: HandleItemField) => {
      switch (field.targetMethodName) {
        case 'sendData':
          sendSocket(JSON.parse(field.params));
          break
        case 'closeSocket':
          closeSocket();
          break
      }
    })
    return {
      wraperStyle,
    }
  }
})
</script>
