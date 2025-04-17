<template>
  <n-modal
    v-model:show="visible"
    preset="dialog"
    :show-icon="false"
    title="发布"
    style="width: 435px;"
    :on-mask-click="closeDialog"
    :auto-focus="false"
    @close="closeDialog"
  >
    <n-spin :show="loading" class="share-setting">
      <div>
        <n-input-group>
          <n-input-group-label :style="{ width: '30%', textAlign: 'right' }">选择快照：</n-input-group-label>
          <n-select
            v-model:value="selectSnapshot"
            :style="{ width: '70%'}"
            :options="snapshotList"
            placeholder="请选择"
          >
            <template #empty>
              <n-empty description="无数据" />
            </template>
          </n-select>
        </n-input-group>
      </div>
      <div style="margin:10px 0px">
        <n-input-group>
          <n-input-group-label :style="{ width: '30%', textAlign: 'right' }">发布地址：</n-input-group-label>
          <n-input
            ref="publishInput"
            v-model:value="publishUrl"
            type="text"
            :style="{ width: '50%' }"
            placeholder=""
          /><n-button
            type="primary"
            :style="{ width : '20%'}"
            ghost
            @click="copyPublishText()"
          >
            复制
          </n-button>
        </n-input-group>
      </div>
      <div class="initial-dialog">
        <n-button
          type="primary"
          :focusable="false"
          class="publish-btn"
          @click="submitPublish"
        >
          设为发布
        </n-button>
        <n-button :focusable="false" class="delete-btn" @click="delSnapshot">
          删除快照
        </n-button>
      </div>
    </n-spin>
  </n-modal>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, inject } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
//import { EditorModule } from '@/store/modules/editor'
import { getAllSnapshot, deleteSnapshot, publishScreen } from '@/api/screen'
import { ProjectModule } from '@/store/modules/project'

interface snapshotItem {
  ID: string
  NAME: string
}


export default defineComponent({
  name: 'PublishProject',
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
    const nDialog = useDialog()

    const visible = ref(false)
    const loading = ref(false)
    const snapshotList = ref<any>([])
    const selectSnapshot = ref<string>(null)

    const publishInput = ref(null)
    const publishUrl = ref<string>(null)

    const closePublish = inject('closePublish') as Function


    const refrashSnapshotList = async () => {
      if (props.projectId == 0)
        return

      loading.value = true
      const res = await getAllSnapshot(props.projectId)
      loading.value = false
      if (res.data.code == 200) {
        snapshotList.value = (res.data.data as snapshotItem[]).map(r => ({ label: decodeURIComponent(r.NAME), value: r.ID }))
        publishUrl.value = `${window.location.origin}/#/publish/${props.projectId}`
        selectSnapshot.value=null
      }
      else {
        nMessage.warning(res.data.msg)
      }

    }

    refrashSnapshotList()

    const closeDialog = () => {
      visible.value = false
      closePublish()
    }

    watch(() => props.modelValue, val => {
      if (val) {
        visible.value = true
        refrashSnapshotList()
      } else {
        visible.value = false
      }
    })

    const submitPublish = async () => {
      if (!selectSnapshot.value) {
        nMessage.warning('请选择要发布的快照')
        return
      }

      try {
        const res = await publishScreen(props.projectId, selectSnapshot.value)
        if (res.data.code == 200) {
          nMessage.success('发布成功')
          ProjectModule.getProjects()
          if(res.data.data)
          {
            publishUrl.value = `${window.location.origin}/#/publish/${props.projectId}?token=${encodeURIComponent(res.data.data)}`
          }

        }
        else {
          nMessage.warning(res.data.msg)
        }
      }
      catch (error) {
        nMessage.error('提交数据错误')
      }
    }

    const delSnapshot = async () => {
      if (!selectSnapshot.value) {
        nMessage.warning('请选择要删除的快照')
        return
      }

      nDialog.warning({
        title: '你确定要删除的快照吗？',
        content: null,
        positiveText: '确定',
        negativeText: '取消',
        autoFocus:false,
        onPositiveClick: async () => {
          try {
            const res = await deleteSnapshot(props.projectId, selectSnapshot.value)
            if (res.data.code == 200) {
              nMessage.success('删除成功')
              refrashSnapshotList()
              selectSnapshot.value = null
            }
            else {
              nMessage.warning(res.data.msg)
            }
          }
          catch (error) {
            nMessage.error('提交数据错误')
          }
        },
        onNegativeClick: () => {
        },
      })
    }

    const copyPublishText = async () =>{
      publishInput.value.select()
      document.execCommand('copy')
      nMessage.success('复制成功')
    }


    return {
      visible,
      loading,
      snapshotList,
      selectSnapshot,
      closeDialog,
      submitPublish,
      delSnapshot,
      publishUrl,
      copyPublishText,
      publishInput,
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
    width: 30%;
    margin: 0px 10px;
  }

  .delete-btn {
    width: 30%;
    //margin-top:11px;
  }
}
</style>
