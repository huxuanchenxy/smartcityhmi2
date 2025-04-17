<template>
  <div>
    <div>
      <div class="Server-content">
        <span>用户管理</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div class="Server-search-left">
            <label>用户名</label>
            <input type="text" class="Server-input" placeholder="" v-model="searchParams.name" />
            <label>姓名</label>
            <input type="text" class="Server-input" placeholder="" v-model="searchParams.chineseName" />
            <label>角色</label>
            <select v-model="searchParams.roleId" class="Server-input">
              <option v-for="role in roleList" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A" @click="Search">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span></n-button>
            <n-button tertiary class="Server-button  button-reset" @click="Reset">
              <n-icon>
                <IconServerReset />
              </n-icon><span>重置</span></n-button>
            <n-button @click="CreateUser" class="Server-button" color="#0E62A9">
              <n-icon>
                <IconServerAdd />
              </n-icon><span>新建</span></n-button>
            <n-button @click="BatchCreate" style="width:135px" class="Server-button" color="#0E62A9">
              <n-icon>
                <IconServerAdd />
              </n-icon><span>批量创建</span></n-button>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table :columns="columns" :data="tableData" :pagination="pagination" @update:page="handlePageChange"
            :bordered="false" :remote="true">
            <template v-slot:empty>
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
    <!-- 用户维护 -->
    <n-modal v-model:show="showModal" class="modal-center" :mask-closable="false">
      <n-card
        style="width: 900px;height:602px; padding-right: 113px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title">
          <span>{{ action_title }}</span>
        </div>
        <div class="server-model">
          <n-form class="authority-from" ref="formRef" :model="model" :rules="model.id ? [] : rules"
            label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{
              maxWidth: '640px'
            }">
            <div class="input-group">
              <n-grid>
                <n-form-item-gi style="font-size: 20px;" :span="100" label="用户名" path="name">
                  <n-input v-model:value="model.name" placeholder="" :disabled="model.id ? true : false" />
                </n-form-item-gi>
                <n-form-item-gi :span="100" label="密码" path="password" v-if="!model.id">
                  <n-input v-model:value="model.password" placeholder="" />
                </n-form-item-gi>
                <n-form-item-gi :span="100" label="姓名" path="chineseName">
                  <n-input v-model:value="model.chineseName" placeholder="" />
                </n-form-item-gi>
                <n-form-item-gi :span="100" label="角色" path="roleId">
                  <n-select v-model:value="model.roleId" :options="roleList" label-field="name" value-field="id"
                    children-field="none" />
                </n-form-item-gi>
              </n-grid>
            </div>
          </n-form>
          <div class="input-button">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="handleCancle" quaternary
              round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round @click="handleSubmit"
              class="button confirm-button">{{ action_button }}</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
    <!-- 批量新增用户 -->
    <n-modal v-model:show="batchModal" class="modal-center">
      <n-card
        style="width: 900px;height:602px; padding-right: 113px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title">
          <span>批量新增用户</span>
        </div>
        <div class="server-model">
          <n-form class="authority-from" ref="batchformRef" :model="batchModel" :rules="batchRules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" :style="{
              maxWidth: '640px'
            }">
            <div class="input-group">
              <n-grid>
                <n-form-item-gi :span="100" label="用户名" path="name">
                  <n-input v-model:value="batchModel.name" placeholder="请输入批量新增用户名，批量账号会根据数量生成序号" />
                </n-form-item-gi>
                <n-form-item-gi :span="100" label="数量" path="count">
                  <n-input-number v-model:value="batchModel.count" style="width:100%" placeholder="请输入批量新增数量" :min="1"
                    :max="10" :step="1" />
                </n-form-item-gi>
                <n-form-item-gi :span="100" label="角色" path="roleId">
                  <n-select v-model:value="batchModel.roleId" :options="roleList" label-field="name" value-field="id"
                    children-field="none" />
                </n-form-item-gi>
              </n-grid>
            </div>
          </n-form>
          <div class="input-button">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="handleBatchCancle"
              quaternary round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round @click="handleBatchSubmit"
              class="button confirm-button">批量创建</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, ref, reactive, onMounted } from 'vue'
import { NButton, useMessage, FormInst, FormRules, useDialog, NSwitch } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { IconServerAdd, IconServerReset, IconServerSearch, IconNodata, IconWarning } from '@/icons'
import { queryUser, createUser, modifyUser, enableUser, disableUser, queryRole, resetPwd, batchCreateUser } from '@/api/user'

export default defineComponent({
  name: 'user',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    IconNodata
  },
  setup() {
    const message = useMessage()
    const nDialog = useDialog();
    const searchParams = reactive({
      name: null,
      chineseName: null,
      roleId: null,
      isAdmin: null,
      pageNo: 1,
      pageSize: 10
    })

    const roleList = ref([])
    const tableData = ref([])

    const action_title = ref('新建用户')
    const action_button = ref('新建')

    const pagination = reactive({
      page: 1,
      pageCount: 0,
      pageSize: 10,
      itemCount: 0,
      prefix({ itemCount }) {
        return `共 ${itemCount} 条`;
      }
    });

    const showModal = ref(false)

    const batchModal = ref(false)

    const updateclose = () => {
      model.name = null
      model.chineseName = null
      model.password = null
      model.roleId = null
      batchModal.value = false
    }
    const formRef = ref<FormInst | null>(null)

    const batchformRef = ref<FormInst | null>(null)

    const model = reactive({
      id: null,
      name: null,
      chineseName: null,
      password: null,
      roleId: null,
      roles: []
    })

    const batchModel = reactive({
      name: null,
      count: null,
      roleId: null,
      roles: []
    })


    onMounted(() => {
      Search();
      getOptionList();
    })

    const getOptionList = () => {
      queryRole({}).then(r => {
        roleList.value = r.data.data.records;
      })
    }

    const Search = () => {
      pagination.page = 1;
      initData();
    }

    const Reset = () => {
      searchParams.name = null
      searchParams.roleId = null
      Search();
    }

    const initData = () => {
      try {
        searchParams.pageNo = pagination.page;
        searchParams.pageSize = pagination.pageSize;
        queryUser(searchParams).then(res => {
          tableData.value = res.data.data.records;
          pagination.pageCount = res.data.data.pages;
          pagination.itemCount = res.data.data.total;
          if (tableData.value.length === 0 && pagination.page > 1) {
            pagination.page = pagination.page - 1;
            initData();
          }
        })
      } catch (error) {
        console.error('Error initData:', error);
      }
    }

    const handlePageChange = (currentPage) => {
      pagination.page = currentPage;
      initData();
    };

    const CreateUser = (row: UserModel) => {
      action_title.value = '新建用户'
      action_button.value = '新建'
      model.id = null
      model.name = null
      model.chineseName = null
      model.password = null
      model.roleId = null
      model.roles = []
      showModal.value = true;
    }

    const BatchCreate = () => {
      batchModal.value = true
    }

    const EditUser = (row: UserModel) => {
      let roleId = null;
      if (row.roles && row.roles.length > 0) {
        roleId = row.roles[0].id;
      }
      action_title.value = '编辑用户'
      action_button.value = '保存'
      model.id = row.id
      model.name = row.name
      model.chineseName = row.chineseName
      model.password = row.password
      model.roleId = roleId
      model.roles = row.roles
      showModal.value = true;
    }

    const ResetPwd = (row: UserModel) => {
      const d = nDialog.create({
        content: `确定重置密码？`,
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
        onPositiveClick: () => {
          d.loading = true
          try {
            resetPwd(row.name).then(r => {
              if (r.data.code == 200) {
                message.success('密码已重置');
              }
              else {
                message.error(r.data.msg);
              }
            });


          } catch (error) {
            message.error(error.message)
          }
        },
      })

    }

    const createColumns = (): DataTableColumns<UserModel> => {
      return [
        {
          title: '用户名',
          key: 'name'
        },
        {
          title: '姓名',
          key: 'chineseName'
        },
        {
          title: '角色',
          key: 'roleName'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          width: 240
        },
        {
          title: '修改时间',
          key: 'updateTime',
          align: 'center',
          width: 240
        },
        {
          title: '是否禁用',
          key: 'roleName',
          width: 100,
          render(row) {
            return h(
              NSwitch,
              {
                value: row.isForbidden,
                checkedValue: 1,
                uncheckedValue: 0,
                size: 'large',
                onUpdateValue(v) {
                  if (v) {
                    disableUser(row.id).then(r => {
                      initData();
                    })
                  } else {
                    enableUser(row.id).then(r => {
                      initData();
                    })
                  }
                }
              },
              {}
            )
          }
        },
        {
          title: '操作',
          key: 'actions',
          align: 'center',
          width: 120,
          render(row) {
            return h('div', [
              h('span', {
                strong: true,
                tertiary: true,
                size: 'small',
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#0E62A9',
                  fontSize: '18px',
                  textAlign: 'left'
                },
                onClick: () => EditUser(row)
              }, { default: () => '编辑' }),
              h('span', {
                strong: true,
                tertiary: true,
                size: 'small',
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#1D9F3A',
                  fontSize: '18px',
                  textAlign: 'left',
                  marginLeft: '36px',
                },
                onClick: () => ResetPwd(row)
              }, { default: () => '重置密码' }),
            ]);
          }
        }
      ]
    }

    const rules: FormRules = {
      name: [
        {
          required: true,
          message: '请输入用户名',
          trigger: ['input', 'blur'],
        },
      ],
      password: [
        {
          required: true,
          message: '请选择密码',
          trigger: ['input', 'blur'],
        },
      ],
      roleId: [
        {
          required: true,
          type: 'number',
          message: '请选择角色',
          trigger: ['change'],
        },
      ],
    }

    const batchRules: FormRules = {
      name: [
        {
          required: true,
          message: '请输入用户名',
          trigger: ['input', 'blur'],
        },
      ],
      count: [
        {
          required: true,
          type: 'number',
          message: '请输入数量',
          trigger: ['input', 'blur'],
        },
      ],
      roleId: [
        {
          required: true,
          type: 'number',
          message: '请选择角色',
          trigger: ['change'],
        },
      ],
    }

    const handleCancle = () => {
      formRef.value?.restoreValidation()
      showModal.value = false;
    }

    const handleSubmit = (e: MouseEvent) => {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          if (model.roleId != null) {
            model.roles = [];
            model.roles.push({ id: model.roleId });
          }
          try {
            if (model.id) {
              modifyUser(model).then(res => {
                if (res.data.code === 200) {
                  message.success('操作成功');
                  formRef.value?.restoreValidation()
                  showModal.value = false;
                  Search();
                } else {
                  message.error(res.data.msg);
                }
              })
            }
            else {
              createUser(model).then(res => {
                if (res.data.code === 200) {
                  message.success('操作成功');
                  formRef.value?.restoreValidation()
                  showModal.value = false;
                  Search();
                } else {
                  message.error(res.data.msg);
                }
              })
            }
          }
          catch (error) {
            console.error('Error submit:', error);
          }
        }
      })
    }

    const handleBatchCancle = () => {
      batchformRef.value?.restoreValidation()
      batchModal.value = false;
    }

    const handleBatchSubmit = (e: MouseEvent) => {
      e.preventDefault();
      batchformRef.value?.validate((errors) => {
        if (!errors) {
          batchCreateUser(batchModel.name, batchModel.count, [{ id: batchModel.roleId }]).then(res => {
            if (res.data.code === 200) {
              message.success('操作成功');
              batchformRef.value?.restoreValidation()
              batchModal.value = false;
              Search();
            } else {
              message.error(res.data.msg);
            }
          })
        }
      })
    }

    return {
      searchParams,
      roleList,
      Search,
      tableData,
      handlePageChange,
      pagination,
      handleCancle,
      handleSubmit,
      action_title,
      action_button,
      updateclose,
      showModal,
      Reset,
      CreateUser,
      BatchCreate,
      batchModal,
      columns: createColumns(),
      formRef,
      batchformRef,
      model,
      rules,
      handleBatchCancle,
      handleBatchSubmit,
      batchModel,
      batchRules
    }
  },
})


export interface UserModel {
  createTime: string
  createByName: string
  updateTime: string
  updateByName: string
  deleted: number
  id: number
  userId: string
  name: string
  chineseName: string
  isAdmin: number
  isForbidden: number
  password: string
  roles: any[],
  roleName: string
}
</script>

<style lang="scss" scoped>
@import '@/styles/main-content.scss';
</style>
