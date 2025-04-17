<template>
  <n-modal v-model:show="visible" preset="dialog" :show-icon="false" title="快照" style="width: 435px;"
    :on-after-leave="closeDialog" @close="closeDialog" :autoFocus="false">
    <n-spin :show="loading" class="share-setting">
      <div>
        <n-input v-model:value="snapshotName" type="text" placeholder="请输入快照名称" />
      </div>
      <div class="initial-dialog">
        <n-button type="primary" :focusable="false" class="publish-btn" @click="submitSnapshot">
          提交
        </n-button>
      </div>
    </n-spin>
  </n-modal>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, inject } from 'vue'
import { useMessage } from 'naive-ui'
import { EditorModule } from '@/store/modules/editor'

export default defineComponent({
  name: 'Snapshot',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const nMessage = useMessage()
    const snapshotName = ref('')

    const visible = ref(false)
    const loading = ref(false)

    const closeSnapshot = inject('closeSnapshot') as Function

    const closeDialog = () => {
      visible.value = false
      closeSnapshot()
    }

    watch(() => props.modelValue, val => {
      if (val) {
        visible.value = true
      } else {
        visible.value = false
      }
    })

    const submitSnapshot = async () => {
      try {
        loading.value = true
        await EditorModule.saveSnapshot(snapshotName.value)
        loading.value = false
        nMessage.success('快照成功')
        snapshotName.value = ''
        closeDialog()
      }
      catch (error) {
        loading.value = false
        nMessage.error('提交数据错误')
      }
    }

    return {
      visible,
      loading,
      snapshotName,

      closeDialog,
      submitSnapshot,
    }
  },
})
</script>

<style lang="scss" scoped>
.initial-dialog {
  width: 368px;
  margin: 22px auto 8px;
  text-align: center;

  .publish-btn {
    width: 80%;
  }
}
</style>
