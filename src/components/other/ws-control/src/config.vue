<template>
  <div class="setting-panel-gui">
    <g-field label="ws地址">
      <g-input v-model="config.ws" />
    </g-field>
    <g-field label="随机id">
      <n-switch v-model:value="config.uuid" />
    </g-field>
    <g-field label="关联点位信息">
      <n-switch v-model:value="config.ic" />
    </g-field>
    <g-field label="重连次数">
      <g-input-number v-model="config.retryCounts" :min="0" :max="100" :step="1" suffix="次" />
    </g-field>
    <g-field label="重连间隔">
      <g-input-number v-model="config.retryTimeSpan" :min="0" :max="10000" :step="1" suffix="ms" />
    </g-field>
    <g-field label="模式">
      <g-select v-model="config.mode" :data="[{ id: 'dev', value: '调试模式' }, { id: 'pro', value: '发布模式' }]" />
    </g-field>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef, watch } from 'vue'
import {
} from '@/data/select-options'
import { WsControl } from './ws-control'
import { EditorModule } from "@/store/modules/editor";
import { createComponent } from '@/components/datav';
import { generateId } from '@/utils/util';

export default defineComponent({
  name: 'VWsControlProp',
  props: {
    com: {
      type: Object as PropType<WsControl>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')

    watch(() => config.value.ic, async () => {
      if (config.value.ic) {
        let icPanelCom = EditorModule.coms.find(r => r.alias === '点位信息');
        if (!icPanelCom) {
          icPanelCom = await createComponent('VIcPanel')
          icPanelCom.attr.x = 200
          icPanelCom.attr.y = EditorModule.pageConfig.height
          icPanelCom.projectId = EditorModule.screen.id
          icPanelCom.eventhub = true;
          icPanelCom.hided = true;
          await EditorModule.addCom(icPanelCom)
        }

        if (props.com.handles && props.com.handles.reviceSocket) {
          let fields = props.com.handles.reviceSocket.fields;
          let item = fields.find(r => r.targetComId.includes('IcPanel'));
          if (!item) {
            item = {
              name: generateId('event'),
              targetComId: icPanelCom.id,
              targetMethodName: 'sync',
              targetMethodTitle: '点位数据同步',
              targetComAlias: icPanelCom.alias,
              script: null,
              showDeleteConfirm: false,
              hasDecideScript: false
            }
            props.com.handles.reviceSocket.fields.push(item);
            props.com.handles.reviceSocket.lastTargetName = item.name;
          }
        }
      }
      else {
        if (props.com.handles && props.com.handles.reviceSocket) {
          let fields = props.com.handles.reviceSocket.fields;
          let idx = fields.findIndex(r => r.targetComId.includes('IcPanel'));
          if (idx > -1) {
            props.com.handles.reviceSocket.fields.splice(idx, 1);
            props.com.handles.reviceSocket.lastTargetName = null;
          }
        }
      }
    })

    return {
      config,

    }
  },
})
</script>
