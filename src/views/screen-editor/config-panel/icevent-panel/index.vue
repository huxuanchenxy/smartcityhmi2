<template>
  <div class="icevent-panle">
    <div>
      <config-title :com-name="com.name" :com-alias="com.alias" />
    </div>
    <div v-if="eventKeys.length > 0">
      <div class="com-events">
        <div class="event-list">
          <n-icon class="addIcon" @click="addField(tabName)">
            <IconPlus />
          </n-icon>
          <el-tabs v-model="tabName" type="card">
            <el-tab-pane v-for="(eitem, idx) in icEventList" :key="idx" :name="eitem.eventName"
              :label="eitem.description">
              <handle-item :key="eitem.eventName" :item="eitem" :coms="coms" :com="com" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <empty-panel v-else content="该组件没有点位互动事件" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, ComputedRef, inject, ref, provide, onMounted, watch } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import { IcHandleItemConfig } from '@/components/data-handle'
import ConfigTitle from '../components/config-title.vue'
import EmptyPanel from '../components/empty-panel.vue'
import HandleItem from './handle-item.vue'
import { IconPlus } from '@/icons'
import { generateId } from '@/utils/util'

export default defineComponent({
  name: 'IcEventPanel',
  components: {
    ConfigTitle,
    EmptyPanel,
    HandleItem,
    IconPlus
  },
  setup() {
    const com = inject('com') as ComputedRef<DatavComponent>
    const coms = inject('coms') as ComputedRef<DatavComponent[]>

    const visible = ref(true)
    const tabName = ref('')

    const eventKeys = computed(() => {
      if (com && com.value && com.value.ichandles) {
        return Object.keys(com.value.ichandles)
      }
      else {
        return []
      }
    })
    //const icEventList = ref<IcHandleItemConfig[]>(Object.values(com.value.ichandles))

    const icEventList = computed(() => {
      let eventList = [];
      // Object.keys(com.value.ichandles).forEach((key) => {
      //   let isTemp = false;
      //   if (com.value.ichandles[key].events) {
      //     if (com.value.ichandles[key].events.length > 0) {
      //       isTemp = true;
      //     }
      //   }
      //   if (com.value.ichandles[key].properties) {
      //     if (com.value.ichandles[key].properties.length > 0) {
      //       isTemp = true;
      //     }
      //   }
      //   if (isTemp) {
      //     eventList.push(com.value.ichandles[key]);
      //   }
      // });
      if (com && com.value && com.value.ichandles) {
        if (com.value.ichandles['property']) {
          eventList.push(com.value.ichandles['property']);
        }

        if (com.value.ichandles['event']) {
          eventList.push(com.value.ichandles['event']);
        }
      }

      return eventList;
    })

    if (icEventList.value.length > 0) {
      if (icEventList.value[0] && icEventList.value[0].eventName) {
        tabName.value = icEventList.value[0].eventName
      }
    }

    const createField = (_targetComId?: string, _targetMethodName?: string, _script?: string) => {
      return {
        name: generateId('icevent'),
        targetComId: _targetComId,
        targetMethodName: _targetMethodName,
        script: _script,
        showDeleteConfirm: false,

      }
    }

    const addField = (eventName: string) => {
      const icEventItem = icEventList.value.find(m => m.eventName === eventName)
      if (!icEventItem.fields.some(m => m.pt == null && m.formula == null)) {
        let targetMethodName = eventName == 'property' ? 'property' : null;
        let item = createField(com.value.id, targetMethodName, '')
        icEventItem.fields.push(item)
        icEventItem.lastTargetName = item.name
      }
    }

    const deleteField = (eventName: string, idx: number) => {
      const icEventItem = icEventList.value.find(m => m.eventName === eventName)
      icEventItem.fields.splice(idx, 1)
    }

    provide('addField', addField)
    provide('deleteField', deleteField)

    return {
      com,
      coms,
      eventKeys,
      visible,
      icEventList,
      tabName,
      addField
    }
  },
})
</script>

<style lang="scss">
@import './style.scss';
</style>
