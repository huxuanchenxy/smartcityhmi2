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
            <input type="text" class="Server-input" placeholder="" v-model="name" />
            <label>角色</label>
            <div class="waring-input" >
              <n-select style="width: 200px;"/>
            </div>
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span></n-button>
            <n-button tertiary class="Server-button  button-reset" @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon><span>重置</span></n-button>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table :columns="columns" :data="data" :bordered="false">
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
    <!-- 新增 -->
    <n-modal v-model:show="showModal" class="modal-center">
      <n-card
        style="width: 900px;height:602px; padding-right: 113px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title" style="margin-bottom: 20px;">
          <span>新增角色</span>
        </div>
        <div class="server-model">
          <n-form class="authority-from" ref="formRef" :model="model" :rules="rules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" :style="{
              maxWidth: '640px'
            }">
            <n-form-item :span="200" label="角色名称" path="username">
              <div class="warning-input">
                <n-input v-model:value="model.username" v-model="model.username" placeholder="" />
              </div>
            </n-form-item>
            <n-form-item :span="200" label="启动画面" path="clz">
              <div class="warning-input">
                <n-select placeholder="" />
              </div>
            </n-form-item>

          </n-form>
          <div class="input-button">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="closeLoading"
              quaternary round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round class="button confirm-button"
              @click="handleValidateButtonClick">新增</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, ref, onMounted, nextTick } from 'vue'
import { NButton, useMessage, FormInst } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { menuDefault } from '@/api/ic'
import {
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  serverConfigData,
  IconNodata
} from '@/icons'


type RowData = {
  name: string
  username: string
  rolename: string
  onlineTime: string
  createTime: string
}

const data: RowData[] = [
  {
    name: 'admin',
    username: 'username',
    rolename: 'rolename',
    onlineTime: '2022-02-02',
    createTime: '2022-02-02',
  },
  {
    name: 'admin',
    username: 'username',
    rolename: 'rolename',
    onlineTime: '2022-02-02',
    createTime: '2022-02-02',
  },
  {
    name: 'admin',
    username: 'username',
    rolename: 'rolename',
    onlineTime: '2022-02-02',
    createTime: '2022-02-02',
  },
]
const createColumns = ({
  edit,
  deleteRow,

}: {
  edit: (row: RowData) => void;
  deleteRow: (row: RowData) => void;
}): DataTableColumns<RowData> => {
  return [

    {
      title: '姓名',
      key: 'name'
    },
    {
      title: '用户名',
      key: 'username'
    },
    {
      title: '角色',
      key: 'rolename'
    },
    {
      title: '最近在线时间',
      key: 'onlineTime'
    },
    {
      title: '创建时间',
      key: 'createTime'
    },
    // {
    //   title: '操作',
    //   key: 'actions',
    //   width: 150,
    //   fixed: 'right',
    //   align: 'center',
    //   render(row) {
    //     return h('div', [
    //       h('span', {
    //         strong: true,
    //         tertiary: true,
    //         size: 'small',
    //         type: 'error',
    //         style: {
    //           backgroundColor: 'transparent',
    //           color: '#1D9F3A',
    //           cursor: 'pointer',
    //           border: 'none', 
    //           fontSize: '18px',
    //           marginLeft: '36px',
    //         },
    //         onClick: () => deleteRow(row)
    //       }, { default: () => '账号管理' }),
    //     ]);
    //   }
    // }
  ];
};


export default defineComponent({
  name: 'MyScreen',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    serverConfigData,
    IconNodata
  },
  setup() {
    const message = useMessage()
    const showModal = ref(false)
    const createModal = ref(false)
    const name = ref(null)
    const treeData = ref([]);
    const defaultExpandedKeys = ref([])
    const defaultCheckedKeys = ref([]);
    const rootNode = ref({})
    const closecreate = () => {
      createModal.value = false
    }
    const closeLoading = () => {
      showModal.value = false;

    }
    const formRef = ref<FormInst | null>(null)
    const Eliminate = () => {
      name.value = null
    }
    const openShowModal = async () => {
      showModal.value = true
    }

    const handleCheckChange = (checkedKeys, info) => {
      defaultCheckedKeys.value = checkedKeys;
    };



    onMounted(() => {

    })
    return {
      data,
      name,
      Eliminate,
      showModal,
      createModal,
      openShowModal,
      defaultCheckedKeys,
      defaultExpandedKeys,
      treeData,
      closeLoading,
      handleCheckChange,
      closecreate,
      columns: createColumns({
        edit(row: RowData) {
          message.info(`edit ${row.createTime}`)
        },
        deleteRow(row: RowData) {
          message.info(`deleteRow ${row.createTime}`)
        },

      }),
      formRef,
      model: ref({
        username: null,
      }),

      generalOptions: ['groode', 'veli good', 'emazing', 'lidiculous'].map(
        (v) => ({
          label: v,
          value: v
        })
      ),
      cascaderOptions: [
        {
          label: 'groode',
          value: 'groode',
          children: [
            {
              label: 'veli good',
              value: 'veli good'
            }
          ]
        }
      ],
      rules: {
        username: {
          required: true,
          trigger: 'blur',
          message: '请输入角色名称'
        },

      },
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            message.success('验证成功')
          } else {
            console.log(errors)
            message.error('验证失败')
          }
        })
      }


    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/main-content.scss';

</style>
