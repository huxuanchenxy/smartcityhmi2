<template>
  <div>
    <div>
      <div class="Server-content">
        <span>设备管理</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div class="Server-search-left">
            <label>设备管理器</label>
            <input type="text" class="Server-input" placeholder="" v-model="name" />
            <label>设备名称</label>
            <input type="text" class="Server-input" placeholder="" v-model="name" />
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span></n-button>
            <n-button tertiary class="Server-button  button-reset"  @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon><span>重置</span></n-button>

          </div>
        </div>
        <div class="Server-table">
          <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="false" >
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
    <n-modal v-model:show="showname" class="modal-center" :mask-closable="false"> 
      <n-card
        style="width: 900px;height:402px; padding-right: 113px; display: flex;  flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title">
          <span style="margin-left: 200px;">设备控制器变更</span>
        </div>
        <div class="server-model">
          <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" :size="size" :style="{
              maxWidth: '640px'
            }">
            <div class="input-group">
              <n-form-item style="width: 558px;" label="当前服务器名称" path="selectValue">
                <n-select  v-model:value="model.selectValue" placeholder="" :options="generalOptions" />
              </n-form-item>
            </div>
          </n-form>
          <div class="input-button" style="margin-top: 30px;">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false"
              @click="handleUsernameClickLoading" quaternary round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round @click="handleValidateButtonClick"
              class="button confirm-button">确认</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, ref, onMounted, reactive, computed } from 'vue'
import { NButton, useMessage, FormInst } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import {
  IconWarning,
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  IconNodata
} from '@/icons'


type Song = {
  name: string
  xxxx: string
  xxxx1: string
  ip: string
  status: boolean
  username: string

}




export default defineComponent({
  name: 'MyScreen',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    IconNodata
  },
  setup() {
    const name = ref('')
    const message = useMessage()



    const data: Song[] = [
      {
        name: "11111",
        ip: '123admin',
        xxxx: 'admin',
        xxxx1: 'xxxx.cn',
        status: true,
        username: '管理器1'
      },
      {
        name: "131",
        ip: '123admin',
        xxxx: 'admin',
        xxxx1: 'xxxx.cn',
        status: false,
        username: '管理器2'
      },
      {
        name: "1411",
        ip: '123admin',
        xxxx: 'admin',
        xxxx1: 'xxxx.cn',
        status: false,
        username: '管理器1'
      },
    ]
    const createColumns = ({
      edit,
    }: {
      edit: (row: Song) => void;
    }): DataTableColumns<Song> => {
      return [
        {
          title: '设备名称',
          key: 'name',
        },
        {
          title: '设备代码',
          key: 'ip',
        },
        {
          title: '显示名称',
          key: 'xxxx',
        },
        {
          title: '设备类型',
          key: 'xxxx1',
        },
        {
          title: '在线状态',
          key: 'status',
          render: (row) => {
            const isBoolean = typeof row.status === 'boolean';
            const status = isBoolean ? (row.status ? '在线' : '离线') : '状态未知';
            const statusColor = isBoolean ? (row.status ? '#1D9F3A' : 'red') : 'black'; // 使用黑色作为未知状态的颜色

            return h('span', {
              style: {
                color: statusColor,
              }
            }, status);
          }
        },
        {
          title: '所属设备管理器',
          key: 'username',
          render: (row, index) => {
            return h('span', {
              style: {
                cursor: 'pointer', // 鼠标悬停时显示为手形图标
                color: '#0E62A9'
              },
              onClick: () => {
                handleUsernameClick(row); // 假设 showModal 是显示模态框的函数
              }
            }, row.username);
          }
        },
        {
          title: '操作',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render(row) {
            return h(
              'div', [
              h('span', {
                strong: true,
                tertiary: true,
                size: 'small',
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  fontSize: '18px',
                  color: "#0E62A9",

                },
                onClick: () => edit(row) // 假设edit是处理编辑操作的函数
              },
                { default: () => '移动' },
              ),
              h('span', {
                strong: true,
                tertiary: true,
                size: 'small',
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  fontSize: '18px',
                  color: "#0E62A9",
                  marginLeft: '36px',
                },
                onClick: () => edit(row) // 假设edit是处理编辑操作的函数
              },
                { default: () => '编辑' },
              ),
            ]
            );

          }
        }
      ]
    }
    const showname = ref(false)
    const handleUsernameClick = (row) => {
      showname.value = true
    }
    const handleUsernameClickLoading = () => {
      model.selectValue=null 
      showname.value = false;
    }
    const formRef = ref<FormInst | null>(null)
    const Eliminate = () => {
      name.value = null
    }
    const model = reactive({
      selectValue: null
    })
    return {
      data,
      Eliminate,
      handleUsernameClickLoading,
      handleUsernameClick,
      columns: createColumns({
        edit(row: Song) {
          message.info(`编辑`)
        },
      }),
      pagination: false as const,
      updateserver(e: MouseEvent) {
        try {
          e.preventDefault()
          formRef.value?.validate((errors) => {
            if (!errors) {
            } else {
              message.error('请填写必填项')
            }
          })
        } catch {
        }
      },
      name,
      showname,
      formRef,
      size: ref('medium'),
      model,
      generalOptions: ['groode', 'veli good', 'emazing', 'lidiculous'].map(
        (v) => ({
          label: v,
          value: v
        })
      ),
      rules: {
        selectValue: {
          required: true,
          trigger: ['blur', 'change'],
          message: '请选择当前服务器名称'
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
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/main-content.scss';

</style>
