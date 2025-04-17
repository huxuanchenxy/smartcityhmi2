<template>
  <div>
    <div>
      <div class="Server-content">
        <span>上位机程序管理</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div class="Server-search-left">
            <label>程序名称</label>
            <input
              v-model="nameQueryParam"
              type="text"
              class="device-input"
              placeholder=""
            >
            <label>程序描述</label>
            <input
              v-model="descriptionQueryParam"
              type="text"
              class="device-input"
              placeholder=""
            >
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A" @click="handleSearchButtonClick">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span>
            </n-button>
            <n-button tertiary class="Server-button button-reset" @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon>
              <span class="button-reset-span">
                重置
              </span>
            </n-button>
            <n-button class="Server-button button-add" color="#0E62A9" @click="add">
              <n-icon>
                <IconServerAdd />
              </n-icon><span>新建</span>
            </n-button>
            <n-button class="Server-button button-add" color="#0E62A9">
              <n-icon>
                <IconDeploy />
              </n-icon><span>发布</span>
            </n-button>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table
            :remote="true"
            :columns="columns"
            :data="dataList"
            :pagination="pagination"
            :bordered="false"
            @update:page="handlePageChange"
            @update:sorter="handleSorterChange"
            @update:filters="handleFiltersChange"
          >
            <template #empty>
              <div class="empty-data">
                <n-icon>
                  <IconNodata />
                </n-icon>
                <p>当前无数据显示</p>
              </div>
            </template>
          </n-data-table>
        </div>
      </div>
    </div>
    <!-- 新增 修改 -->
    <n-modal v-model:show="showModal" style="width: 1000px;" :mask-closable="false">
      <n-card
        style="width: 900px; height: 600px; padding-right: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-center-title" style="margin-bottom: 25px;">
          <span>{{ submitData.id ? '编辑程序' : '新增程序' }}</span>
        </div>

        <div class="server-model">
          <n-form
            ref="formRef"
            class="authority-from"
            :model="submitData"
            :rules="rules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :style="{ maxWidth: '640px' }"
          >
            <div class="input-group">
              <n-form-item :span="200" label="程序名称" path="name">
                <div class="warning-input">
                  <n-input v-model:value="submitData.name" placeholder="" maxlength="255" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="描 述" path="description">
                <div class="warning-input">
                  <n-input v-model:value="submitData.description" placeholder="" maxlength="255" />
                </div>
              </n-form-item>
            </div>
          </n-form>
          <div class="input-button" style="margin-left:200px;">
            <n-button
              style="border: 1px solid #A8A8A8;"
              size="small"
              :focusable="false"
              quaternary
              round
              class="button cancel-button"
              @click="closeLoading"
            >
              取消
            </n-button>
            <n-button
              size="small"
              color="#0647a1"
              :focusable="false"
              round
              class="button confirm-button"
              @click="submit"
            >
              确认
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>
<script lang='ts'>
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import { NButton, useMessage, useDialog, FormInst } from 'naive-ui'
import { getProjectId } from '@/utils/token-util'

import {
  IconWarning,
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  IconNodata,
  IconDeploy,
} from '@/icons'

import { queryHostComputer,addHostComputer,updateHostComputer,deleteHostComputer } from '@/api/ic'

interface HostComputer {
    id:number|null
    projectId:number|null
    name:string
    description:string
}

export default defineComponent({
  name: 'HostComputer',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    IconNodata,
    IconDeploy,
  },
  setup() {
    const dataList = ref([])
    const columns = ref([])
    const showModal = ref(false)
    const message = useMessage()

    const nameQueryParam = ref<string>(null)
    const descriptionQueryParam = ref<string>(null)

    const nDialog = useDialog()
    const isSearching = ref(false)

    const projectIdStr = getProjectId()
    const currentProjectId = Number(projectIdStr)

    const submitData = ref<HostComputer>({
      id: null,
      projectId: currentProjectId,
      name: '',
      description: '',
    })

    const Eliminate = () => {
      nameQueryParam.value = null
      descriptionQueryParam.value = null
      fetchProjects()
    }

    const createColumns = () => {
      return columns.value = [
        {
          title: '程序名称',
          key: 'name',
          ellipsis: {
            tooltip: true,
          },
          render(row) {
            return h('a',{ href:row.url,target:'_blank',style:{ 'text-decoration': 'underline' } }, row.name)
          },
        },
        {
          title: '描 述',
          key: 'description',
          ellipsis: {
            tooltip: true,
          },
        },
        {
          title: '操作',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render(row) {
            const actionMap = {
              edit: { label: '编辑', color: '#0E62A9', onClick: () => edit(row) },
              delete: { label: '删除', color: '#FF4646', onClick: () => deleteRow(row.id) },
            }

            let actions = ['edit', 'delete'].map(key => actionMap[key])

            return h('div', { class: 'action-buttons' }, actions.map((action, index) => {
              return h('span', {
                class: `action-button ${index < actions.length - 1 ? 'margin-right' : ''}`,
                style: { cursor: 'pointer', color: action.color, marginRight: index < actions.length - 1 ? '36px' : '0' },
                onClick: action.onClick,
              }, action.label)
            }))
          },
        },
      ]
    }

    const add = () => {
      submitData.value = {
        id: null,
        projectId: currentProjectId,
        name: '',
        description: '',
      }
      showModal.value = true
    }

    const edit = row => {
      submitData.value = row
      showModal.value = true
    }

    const rules = computed(() => {
      return {
        description: {
          required: true,
          trigger: 'blur',
          message: '请输入描述',
        },
        name: {
          required: true,
          trigger: 'blur',
          message: '请输入名称',
        },
      }
    })

    const formRef = ref<FormInst | null>(null)

    const submit = () => {
      formRef.value?.validate(errors => {
        if (!errors) {
          if(!submitData.value.id)
          {
            submitData.value.projectId = currentProjectId
            try{
              addHostComputer(submitData.value).then(res => {
                if (res.data.code === 200) {
                  message.success('添加成功')
                  showModal.value = false
                  fetchProjects()
                }
                else {
                  message.error(res.data.msg)
                }
              })
            }
            catch (error) {
              message.error(error.message)
            }
          }
          else {
            try{
              updateHostComputer(submitData.value).then(res => {
                if (res.data.code === 200) {
                  message.success('添加成功')
                  showModal.value = false
                  fetchProjects()
                }
                else {
                  message.error(res.data.msg)
                }
              })
            }
            catch (error) {
              message.error(error.message)
            }
          }
        } else {
          message.error('请填写必填项')
        }
      })
    }


    const deleteRow = async id => {
      const d = nDialog.create({
        content: `删除后无法恢复，确认删除？`,
        negativeText: '取消',
        negativeButtonProps: {
          round: true,
          ghost: true,
          color: '#7E7E7E',
          focusable: false,
        },
        positiveText: '确定',
        positiveButtonProps: {
          round: true,
          color: '#0647a1',
        },
        iconPlacement: 'top',
        autoFocus: false,
        icon: () => h(IconWarning),
        onPositiveClick: async () => {
          d.loading = true
          try {
            const res = await deleteHostComputer(id)
            if (res.data.code === 200) {
              message.success('已成功删除')
              fetchProjects()
            } else {
              message.error(res.data.msg)
            }

          } catch (error) {
            message.error(error.message)
          }
        },
      })
    }

    const pagination = reactive({
      page: 1,
      pageCount: 0,
      pageSize: 8,
      itemCount: 0,
      prefix({ itemCount }) {
        return `共 ${itemCount} 条`
      },
    })

    const fetchProjects = async () => {
      try {
        const res = await queryHostComputer({ projectId:currentProjectId, name: nameQueryParam.value, description:descriptionQueryParam.value, pageNo:pagination.page, pageSize:pagination.pageSize })
        dataList.value = res.data.data.records
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize)
        pagination.itemCount = res.data.data.total
        createColumns()
        if (dataList.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page - 1
          await fetchProjects()
        }
      } catch (error) {
        console.error('Error fetching project data:', error)
      }
    }

    const handleSorterChange = sorter => {
      pagination.page = 1
      fetchProjects()
    }

    const handleFiltersChange = filters => {
      pagination.page = 1
      fetchProjects()
    }

    const handlePageChange = page => {
      pagination.page = page
      fetchProjects()
    }

    //搜索按钮点击事件处理函数
    const handleSearchButtonClick = () => {
      pagination.page = 1
      fetchProjects()
    }

    const closeLoading = () => {
      showModal.value = false
    }

    onMounted(() =>{
      fetchProjects()
    })

    return {
      showModal,
      nameQueryParam,
      descriptionQueryParam,

      columns,
      dataList,
      pagination,
      rules,
      submit,
      formRef,

      submitData,
      Eliminate,
      handleSearchButtonClick,
      handleSorterChange,
      handleFiltersChange,
      handlePageChange,

      closeLoading,

      add,
    }

  },
})
</script>
<style lang="scss" scoped>
@import '@/styles/main-content.scss';

:deep(.n-base-selection.n-base-selection--disabled .n-base-selection-label) {
  background-color: #fff;

}

:deep(.n-base-selection-input__content) {
  color: #000;
  font-family: '思源黑体Normal';
}

.table-name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #fff;
  background: 0 0;
  max-width: 200px;
  cursor: default;

  &:hover {
    color: #fff;
  }
}

.device-input {
  width: 150px;
  height: 36px;
  border: 1px solid #E4E7EC;
  border-radius: 8px;
  margin-right: 5px;
  font-size: 18px;
  color: #7E7E7E;
  padding: 0 10px;
}
</style>
