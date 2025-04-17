<template>
  <div class="interaction-panle">
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
            <el-tab-pane v-for="(eitem, idx) in eventList" :key="idx" :name="eitem.eventName" :label="eitem.description">
              <handle-item :key="eitem.eventName" :item="eitem" :coms="coms" :com="com" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <empty-panel v-else content="该组件没有交互事件" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, ComputedRef, inject, ref, provide, onMounted, watch } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import { HandleItemConfig } from '@/components/data-handle'
import ConfigTitle from '../components/config-title.vue'
import EmptyPanel from '../components/empty-panel.vue'
import HandleItem from './handle-item.vue'
import { IconPlus } from '@/icons'
import { generateId } from '@/utils/util'

export default defineComponent({
  name: 'InteractionPanel',
  components: {
    ConfigTitle,
    EmptyPanel,
    HandleItem,
    IconPlus,
  },
  setup() {
    const com = inject('com') as ComputedRef<DatavComponent>
    const coms = inject('coms') as ComputedRef<DatavComponent[]>

    const visible = ref(true)
    const tabName = ref('')

    const eventKeys = computed(() => {

      if (com && com.value && com.value.handles) {
        return Object.keys(com.value.handles)
      }
      else {
        return []
      }
    })
    const eventList = ref<HandleItemConfig[]>(Object.values(com.value.handles))

    if (eventList.value.length > 0) {
      tabName.value = eventList.value[0].eventName
    }

    const createField = (_targetComId?: string, _targetMethodName?: string, _script?: string) => {
      return {
        name: generateId('event'),
        targetComId: _targetComId,
        targetMethodName: _targetMethodName,
        script: _script,
        showDeleteConfirm: false,
      }
    }

    const addField = (eventName: string) => {
      const eventItem = eventList.value.find(m => m.eventName === eventName)
      if (!eventItem.fields.some(m => m.targetComId == null)) {
        let item = createField(null, null, '')
        eventItem.fields.push(item)
        eventItem.lastTargetName = item.name
      }
    }

    const deleteField = (eventName: string, idx: number) => {
      const eventItem = eventList.value.find(m => m.eventName === eventName)
      eventItem.fields.splice(idx, 1)
    }

    provide('addField', addField)
    provide('deleteField', deleteField)

    return {
      com,
      coms,
      eventKeys,
      visible,
      eventList,
      tabName,
      addField,
    }
  },
})
</script>

<style lang="scss">
@import './style.scss';
</style>
