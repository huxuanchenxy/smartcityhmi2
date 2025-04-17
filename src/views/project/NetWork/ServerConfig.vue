<template>
  <div>
    <div>
      <div class="Server-content">
        <span>设备管理器配置</span>
      </div>
      <div class="server-hidden">

        <div class="Server-search">
          <div class="Server-search-left">
            <label>服务器名称</label>
            <input type="text" class="Server-input" placeholder="" v-model="serverName" />
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A" @click="ServerConfigSearch">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span></n-button>
            <n-button tertiary class="Server-button  button-reset" @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon><span>重置</span></n-button>
            <n-button @click="showModal = true" class="Server-button" color="#0E62A9">
              <n-icon>
                <IconServerAdd />
              </n-icon><span>新建</span></n-button>
            <n-tooltip trigger="hover" style="color: black; background-color: white; font-size: 15px;"
              :show-arrow="false">
              <template #trigger>
                <n-button class="Server-button3" color="#0E62A9">
                  <n-icon>
                    <serverConfigBell />
                  </n-icon>
                </n-button>
              </template>
              广播
            </n-tooltip>

          </div>
        </div>
        <div class="Server-table">
          <n-data-table :remote="true" :columns="columns" :data="dmserver" :pagination="pagination" :bordered="false"
            @update:page="handlePageChange" @update:sorter="handleSorterChange" @update:filters="handleFiltersChange">
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
    <n-modal v-model:show="showModal" class="modal-center" :mask-closable="false">
      <n-card
        style="width: 900px;height:602px; padding-right: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title">
          <span>新增设备服务器</span>
        </div>
        <div class="server-model">
          <n-form class="authority-from" ref="formRef" :model="serverData" :rules="rules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
            <div class="input-group">
              <!-- <n-grid> -->
              <n-form-item style="font-size: 20px;" :span="200" label="服务器编码" path="serverCode">
                <n-input v-model:value="serverData.serverCode" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="服务器名称" path="serverName">
                <n-input v-model:value="serverData.serverName" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="服务器IP" path="serverIp">
                <n-input v-model:value="serverData.serverIp" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="服务器端口" path="serverPort">
                <n-input v-model:value="serverData.serverPort" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="服务器URL" path="serverUrl">
                <n-input v-model:value="serverData.serverUrl" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="描述" path="description">
                <n-input v-model:value="serverData.description" placeholder="" />
              </n-form-item>
              <!-- </n-grid> -->
            </div>
          </n-form>
          <div class="input-button">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="closeLoading"
              quaternary round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round @click="ServerAdd"
              class="button confirm-button">新增</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>

    <!-- 修改 -->
    <n-modal v-model:show="updateModal" class="modal-center" :mask-closable="false">
      <n-card
        style="width: 900px;height:602px; padding-right:  150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title">
          <span>编辑设备服务器</span>
        </div>
        <div class="server-model">
          <n-form class="authority-from" ref="formRef" :model="serverData" :rules="rules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
            <div class="input-group">
              <!-- <n-grid> -->
              <n-form-item style="font-size: 20px;" :span="200" label="服务器编码" path="serverCode">
                <n-input readonly v-model:value="serverData.serverCode" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="服务器名称" path="serverName">
                <n-input v-model:value="serverData.serverName" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="服务器IP" path="serverIp">
                <n-input v-model:value="serverData.serverIp" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="服务器端口" path="serverPort">
                <n-input v-model:value="serverData.serverPort" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="服务器URL" path="serverUrl">
                <n-input v-model:value="serverData.serverUrl" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="描述" path="description">
                <n-input v-model:value="serverData.description" placeholder="" />
              </n-form-item>
              <!-- </n-grid> -->
            </div>
          </n-form>
          <div class="input-button">
            <n-button style="border: 1px solid #A8A8A8; " size="small" :focusable="false" @click="updateclose"
              quaternary round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round @click="updateserver"
              class="button confirm-button">编辑</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, ref, reactive } from 'vue'
import { NButton, useMessage, useDialog, FormInst } from 'naive-ui'
import { dmServerList, dmServerSearch, dmServerAdd, dmServerDel, dmServerUpdate } from '@/api/ic'
import { IconWarning, IconServerAdd, IconServerReset, IconServerSearch, serverConfigBell, serverConfigData,IconNodata } from '@/icons'
interface PaginationInfo {
  page: number;
  pageSize: number;
  pageCount: number;
}
export default defineComponent({
  name: 'MyScreen',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    serverConfigBell,
    serverConfigData,
    IconNodata
  },
  setup() {
    const dmserver = ref([])
    const serverName = ref('');
    const message = useMessage()
    const showModal = ref(false)
    const updateModal = ref(false)

    const columns = ref([]);
    const nDialog = useDialog()
    const updateclose = () => {
      updateModal.value = false
      serverData.value = {
        id: '',
        serverCode: '',
        serverName: '',
        serverIp: '',
        serverPort: '',
        serverUrl: '',
        description: ''
      };
    }
    const closeLoading = () => {
      showModal.value = false;
      serverData.value = {
        id: '',
        serverCode: '',
        serverName: '',
        serverIp: '',
        serverPort: '',
        serverUrl: '',
        description: ''
      };
    }
    const serverData = ref({
      id: '',
      serverCode: '',
      serverName: '',
      serverIp: '',
      serverPort: '',
      serverUrl: '',
      description: ''
    });
    const formRef = ref<FormInst | null>(null)
    const Server = async () => {
      try {
        const res = await dmServerAdd(
          serverData.value.serverCode,
          serverData.value.serverName,
          serverData.value.serverIp,
          serverData.value.serverPort,
          serverData.value.serverUrl,
          serverData.value.description
        );
        if (res.data.code === 200) {
          message.success('新增成功');
          closeLoading();
          fetchProjects();
        } else {
          let errorMessage = '新增失败';
          if (res.data.msg.includes('服务器IP')) {
            errorMessage = `服务器IP已存在!`;
          } else if (res.data.msg.includes('服务器名称')) {
            errorMessage = `服务器名称已存在!`;
          } else if (res.data.msg.includes('服务器编码')) {
            errorMessage = `服务器编码已存在!`;
          } else {
            errorMessage = res.data.msg || '未知错误';
          }
          message.error(errorMessage);
        }
      } catch (error) {
        console.error('Error:', error);
        message.error('操作失败');
      }
    };


    // 定义编辑和删除操作的函数
    const edit = (row) => {
      updateModal.value = true;
      serverData.value = { ...row };
    };
    const update = async () => {
      try {
        const res = await dmServerUpdate(
          serverData.value.id,
          serverData.value.serverCode,
          serverData.value.serverName,
          serverData.value.serverIp,
          serverData.value.serverPort,
          serverData.value.serverUrl,
          serverData.value.description
        );

        if (res.data.code === 200) {
          message.success('编辑成功');
          updateclose();
          fetchProjects();
        } else {
          let errorMessage = '编辑失败';
          if (res.data.msg.includes('服务器IP')) {
            errorMessage = `服务器IP已存在!`;
          } else if (res.data.msg.includes('服务器名称')) {
            errorMessage = `服务器名称已存在!`;
          } else if (res.data.msg.includes('服务器编码')) {
            errorMessage = `服务器编码已存在!`;
          } else {
            errorMessage = res.data.msg || '未知错误';
          }
          message.error(errorMessage);
        }
      } catch (error) {
        // 捕获并打印错误信息
        console.error('Error adding server:', error);
      }
    };
    const deleteRow = async (id) => {
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
            await dmServerDel(id);
            message.success('已成功删除');
            fetchProjects()
            ServerConfigSearch()
          } catch (error) {
            message.error(error.message)
          }
        },
      })
    };

    const createColumns = () => {
      return columns.value = [
        {
          title: '服务器编码',
          key: 'serverCode',
        },
        {
          title: '服务器名称',
          key: 'serverName',
        },
        {
          title: '服务器IP',
          key: 'serverIp',
        },
        {
          title: '服务器端口',
          key: 'serverPort',
        },
        {
          title: '服务器URL',
          key: 'serverUrl',
        },
        {
          title: '描述',
          key: 'description',
        },
        {
          title: '操作',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
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
                  color: '#1D9F3A',
                  fontSize: '18px',
                  textAlign: 'left'
                },
                onClick: () => edit(row)
              }, { default: () => '编辑' }),
              h('span', {
                strong: true,
                tertiary: true,
                size: 'small',
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#FF4646',
                  border: 'none',
                  fontSize: '18px',
                  marginLeft: '36px',
                },
                onClick: () => deleteRow(row.id)
              }, { default: () => '删除' }),
            ]);
          }
        }
      ];
    };

    // const getRowKey = (row: PtModel) => row.propertyName;

    const ServerConfigSearch = async () => {
      try {
        const res = await dmServerSearch(serverName.value, pagination.page, pagination.pageSize);
        dmserver.value = res.data.data.records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await dmServerList(pagination.page, pagination.pageSize);

        dmserver.value = res.data.data.records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
        createColumns();
        if (dmserver.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page-1; 
          await fetchProjects(); 
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const pagination = reactive({
      page: 1,
      pageCount: 0,
      pageSize: 8,
      itemCount: 0,
      prefix({ itemCount }) {
        return `共 ${itemCount} 条`;
      }
    });

    const handleSorterChange = (sorter) => {
      if (!sorter || sorter.columnKey === 'propertyName') {
        pagination.page = 1;
        fetchProjects()

      }
    };

    const handleFiltersChange = (filters) => {
      pagination.page = 1;
      fetchProjects()
    };

    const handlePageChange = (currentPage) => {
      pagination.page = currentPage;
      fetchProjects()

    };
    const Eliminate = () => {
      serverName.value = null
      fetchProjects()
    }
    fetchProjects();
    return {
      closeLoading,
      updateclose,
      Eliminate,
      formRef,
      ServerAdd(e: MouseEvent) {
        try {
          e.preventDefault()
          formRef.value?.validate((errors) => {
            if (!errors) {
              Server()
            } else {
              message.error('请填写必填项')
            }
          })
        } catch {
        }
      },
      showModal,
      updateserver(e: MouseEvent) {
        try {
          e.preventDefault()
          formRef.value?.validate((errors) => {
            console.log(errors);

            if (!errors) {
              update()
            } else {
              message.error('请填写必填项')
            }
          })
        } catch {
        }
      },
      updateModal,
      // getRowKey,
      serverData,
      dmserver,
      serverName,
      ServerConfigSearch,
      columns,
      pagination,
      handleSorterChange,
      handleFiltersChange,
      handlePageChange,
      rules: {
        serverCode: {
          required: true,
          trigger: 'blur',
          message: '请输入服务器编码'
        },
        serverName: {
          required: true,
          trigger: 'blur',
          message: '请输入服务器名称'
        },
        serverIp: {
          required: true,
          trigger: 'blur',
          message: '请输入服务器IP'
        },
        serverPort: {
          required: true,
          trigger: 'blur',
          message: '请输入服务器端口'
        },
        serverUrl: {
          required: true,
          trigger: 'blur',
          message: '请输入服务器URL'
        },
      },
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/main-content.scss';

</style>
