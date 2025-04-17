<template>
  <div>
    <div>
      <div class="Server-content">
        <span>上位机变量管理</span>
      </div>
      <div class="server-hidden">

        <div class="Server-search">
          <div class="Server-search-left">
            <label>变量名称</label>
            <input type="text" class="device-input" placeholder="" v-model="variateName" />
            <label>显示名称</label>
            <input type="text" class="device-input" placeholder="" v-model="variateShowName" />
            <label>是否共享</label>
            <div class="waring-input">
              <n-select style="width: 200px;" v-model:value="deviceShared" :options="deviceSharedOptions" />
            </div>
            <label>是否本项目</label>
            <div class="waring-input">
              <n-select style="width: 200px;" v-model:value="deviceSelf" :options="deviceSelfOptions" />
            </div>
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A" @click="handleSearchButtonClick">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span></n-button>
            <n-button tertiary class="Server-button button-reset" @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon>
              <span class="button-reset-span">
                重置
              </span>
            </n-button>
            <n-button @click="showModal = true" class="Server-button button-add" color="#0E62A9">
              <n-icon>
                <IconServerAdd />
              </n-icon><span>新建</span></n-button>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table :remote="true" :columns="columns" :data="variateList" :pagination="pagination" :bordered="false"
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
    <!-- 新增 修改 -->
    <n-modal v-model:show="showModal" style="width: 1000px;" :mask-closable="false">
      <n-card
        style="width: 900px; height: 600px; padding-right: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title" style="margin-bottom: 25px;">
          <span>{{ variateData.id ? '编辑变量管理' : '新增变量管理' }}</span>
        </div>

        <div class="server-model">
          <n-form class="authority-from" ref="formRef" :model="variateData" :rules="rules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
            <div class="input-group">

              <n-form-item :span="200" label="变量名称" path="name">
                <div class="warning-input">
                  <n-input v-model:value="variateData.name" placeholder="" :readonly="!!variateData.id" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="显示名称" path="showName">
                <div class="warning-input">
                  <n-input v-model:value="variateData.showName" placeholder="" :readonly="!!variateData.id" />
                </div>
              </n-form-item>

              <n-form-item :span="200" label="变量类型" path="valueType">
                <div class="warning-input">
                  <n-select v-model:value="variateData.valueType" :options="variateTypeList" />
                </div>
              </n-form-item>

              <n-form-item v-if="variateData.valueType == ''" style="font-size: 20px;" :span="200" label="点位"
                path="nodeCode">
                <div class="warning-input" style="display:flex;">
                  <n-input style="width: 470px;" v-model:value="variateData.nodeCode" placeholder="" readonly="readonly"
                    :rules="{ required: true, message: '点位不能为空' }" />
                  <n-button style="margin-left:10px;" type="primary" size="small" :focusable="false" ghost
                    @click="openIcList()">
                    点位
                  </n-button>
                </div>
              </n-form-item>

              <n-form-item v-if="variateData.valueType == '数值'" :span="200" label="变量当前值" path="value">
                <div class="warning-input">
                  <n-input v-model:value="variateData.value" placeholder="" />
                </div>
              </n-form-item>


              <n-form-item :span="200" label="描述" path="description">
                <div class="warning-input">
                  <n-input v-model:value="variateData.description" placeholder="" />
                </div>
              </n-form-item>
              <div class="waring-label" style="margin-left: 10px">
                <n-form-item>
                  <div class="warning-checkbox">
                    <label>是否共享</label>
                    <n-checkbox v-model:checked="variateData.isShared"></n-checkbox>
                  </div>
                  <div class="warning-checkbox1" style="margin-left: 150px">
                    <label>是否记录</label>
                    <n-checkbox v-model:checked="variateData.isSave"></n-checkbox>
                  </div>
                </n-form-item>
              </div>
            </div>
          </n-form>
          <div class="input-button" style="margin-left:200px;">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="closeLoading" quaternary
              round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round class="button confirm-button"
              @click="confirmAction">确认</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
    <n-modal v-model:show="seeModal" class="modal-center" :mask-closable="false">
      <n-card
        style="width: 900px;height:600px; padding-right:  150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title">
          <span>查看变量管理</span>
        </div>
        <div class="server-model">
          <n-form class="authority-from" ref="formRef" :model="variateData" :rules="rules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
            <div class="input-group">
              <n-form-item :span="200" label="变量名称" path="name">
                <div class="warning-input">
                  <n-input readonly v-model:value="variateData.name" placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="显示名称" path="showName">
                <div class="warning-input">
                  <n-input readonly v-model:value="variateData.showName" placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="变量类型" path="valueType">
                <div class="warning-input">
                  <n-select disabled v-model:value="variateData.valueType" :options="variateTypeList" />
                </div>
              </n-form-item>
              <n-form-item v-if="variateData.valueType == ''" style="font-size: 20px;" :span="200" label="点位"
                path="nodeCode">
                <div class="warning-input">
                  <n-input readonly v-model:value="variateData.nodeCode" placeholder="请选择" />
                </div>
              </n-form-item>
              <n-form-item v-if="variateData.valueType == '数值'" :span="200" label="变量当前值" path="value">
                <div class="warning-input">
                  <n-input readonly v-model:value="variateData.value" placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="描述" path="description">
                <div class="warning-input">
                  <n-input readonly v-model:value="variateData.description" placeholder="" />
                </div>
              </n-form-item>
              <div class="waring-label" style="margin-left: 10px">
                <n-form-item>
                  <div class="warning-checkbox">
                    <label>是否共享</label>
                    <n-checkbox disabled v-model:checked="variateData.isShared"></n-checkbox>
                  </div>
                  <div class="warning-checkbox1" style="margin-left: 150px">
                    <label>是否记录</label>
                    <n-checkbox disabled v-model:checked="variateData.isSave"></n-checkbox>
                  </div>
                </n-form-item>
              </div>
            </div>
          </n-form>
          <div class="input-button">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="seeClose" quaternary
              round class="button cancel-button">关闭</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round class="button confirm-button"
              @click="seeClose">确认 </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
  <IcList :visible="icListVisibile" />
</template>


<script lang='ts'>
import { h, defineComponent, ref, onMounted, reactive, computed, provide, watch } from 'vue'
import { NButton, useMessage, useDialog, FormInst } from 'naive-ui'
import { variableList, variablequeryList, variableDelete, variableCreate, variableModify } from '@/api/ic'
import { getProjectId } from "@/utils/token-util";
import IcList from '@/views/screen-editor/config-panel/icevent-panel/ic-list.vue'
import { IcHandleItemField, PtModel } from '@/components/data-handle'
import {
  IconWarning,
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  serverConfigBell,
  serverConfigData,
  IconNodata
} from '@/icons'

export default defineComponent({
  name: 'MyScreen',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    serverConfigBell,
    serverConfigData,
    IcList,
    IconNodata
  },
  setup() {
    const variateList = ref([])
    const columns = ref([]);
    const showModal = ref(false)
    const message = useMessage()
    const variateName = ref(null)
    const variateShowName = ref(null)
    const nDialog = useDialog()
    const isSearching = ref(false);
    const seeModal = ref(false)
    const deviceShared = ref(null);
    const deviceSelf = ref(null);
    const closeLoading = () => {
      showModal.value = false;
      variateData.value = {
        id: null,
        deviceCode: null,
        nodeCode: null,
        name: null,
        showName: null,
        isShared: 0,
        isSave: 0,
        description: null,
        value: null,
        valueType: ""
      };
    }
    const deviceSharedOptions = ref([
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ]);
    const deviceSelfOptions = ref([
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ]);


    const variateTypeList = ref([
      { label: '数值', value: "数值" },
      { label: '点位', value: "" },
    ]);


    const seeClose = () => {
      seeModal.value = false
      variateData.value = {
        id: null,
        deviceCode: null,
        nodeCode: null,
        name: null,
        showName: null,
        isShared: 0,
        isSave: 0,
        description: null,
        value: null,
        valueType: ""
      };
    }
    const variateData = ref({
      id: null,
      deviceCode: null,
      nodeCode: null,
      name: null,
      showName: null,
      isShared: 0,
      isSave: 0,
      description: null,
      value: null,
      valueType: ""
    });
    const createColumns = () => {
      return columns.value = [
        {
          title: '变量名称',
          key: 'name',
          ellipsis: {
            tooltip: true
          },
        },
        {
          title: '显示名称',
          key: 'showName',
          ellipsis: {
            tooltip: true
          },
        },
        {
          title: '设备代码',
          key: 'deviceCode',
          ellipsis: {
            tooltip: true
          }
        },

        {
          title: '节点代码',
          key: 'nodeCode',
          ellipsis: {
            tooltip: true
          }
        },
        {
          title: '描述',
          key: 'description',
          ellipsis: {
            tooltip: true
          }
        },
        {
          title: '是否共享',
          key: 'isShared',
          width: 120,
          align: 'center',
          render(row) {
            const text = row.isShared === 1 ? '是' : '否';
            const color = row.isShared === 1 ? '#2885F0' : '#D03050';
            return h('span', { style: { color: color } }, text);
          }
        },
        {
          title: '是否记录',
          key: 'isSave',
          width: 120,
          align: 'center',
          render(row) {
            const text = row.isSave === 1 ? '是' : '否';
            const color = row.isSave === 1 ? '#2885F0' : '#D03050';
            return h('span', { style: { color: color } }, text);
          }
        },
        {
          title: '是否本项目',
          key: 'isSelf',
          width: 130,
          align: 'center',
          render(row) {
            const text = row.isSelf === 1 ? '是' : '否';
            const color = row.isSelf === 1 ? '#2885F0' : '#D03050';
            return h('span', { style: { color: color } }, text);
          }
        },
        {
          title: '操作',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render(row) {
            const actionMap = {
              see: { label: '查看', color: '#1D9F3A', onClick: () => see(row) },
              edit: { label: '编辑', color: '#0E62A9', onClick: () => edit(row) },
              delete: { label: '删除', color: '#FF4646', onClick: () => deleteRow(row.id) }
            };

            let actions = [];
            if (row.isSelf === 1) {
              actions = ['edit', 'delete'].map(key => actionMap[key]);
            } else {
              actions = ['see'].map(key => actionMap[key]);
            }

            return h('div', { class: 'action-buttons' }, actions.map((action, index) => {
              return h('span', {
                class: `action-button ${index < actions.length - 1 ? 'margin-right' : ''}`,
                style: { cursor: 'pointer', color: action.color, marginRight: index < actions.length - 1 ? '36px' : '0' },
                onClick: action.onClick
              }, action.label);
            }));
          }
        }
      ];
    };

    const edit = (row) => {
      if (!row.valueType) {
        row.valueType = '';
      }
      variateData.value = {
        ...row,
        isShared: row.isShared === 1,
        isSave: row.isSave === 1,
      }
      showModal.value = true;
    };
    const see = (row) => {
      if (!row.valueType) {
        row.valueType = '';
      }
      variateData.value = {
        ...row,
        isShared: row.isShared === 1,
        isSave: row.isSave === 1,
      }
      seeModal.value = true
    }
    // const rules = ref({
    //   nodeCode: {
    //     required: true,
    //     trigger: ['blur', 'change'],
    //     message: '请选择点位'
    //   },
    //   showName: {
    //     required: true,
    //     trigger: 'blur',
    //     message: '请输入显示名称'
    //   },
    //   name: {
    //     required: true,
    //     trigger: 'blur',
    //     message: '请输入变量名称',
    //     validator: (rule, value) => {
    //       if (variateData.value.id) return true;
    //       if (!value) return new Error('请输入变量名称');
    //       return true;
    //     }
    //   },
    // });

    const rules = computed(() => {
      if (variateData.value.valueType == '数值') {
        return {
          value: {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入数值'
          },
          showName: {
            required: true,
            trigger: 'blur',
            message: '请输入显示名称'
          },
          name: {
            required: true,
            trigger: 'blur',
            message: '请输入变量名称',
            validator: (rule, value) => {
              if (variateData.value.id) return true;
              if (!value) return new Error('请输入变量名称');
              return true;
            }
          }
        }
      }
      else {
        return {
          nodeCode: {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择点位'
          },
          showName: {
            required: true,
            trigger: 'blur',
            message: '请输入显示名称'
          },
          name: {
            required: true,
            trigger: 'blur',
            message: '请输入变量名称',
            validator: (rule, value) => {
              if (variateData.value.id) return true;
              if (!value) return new Error('请输入变量名称');
              return true;
            }
          }
        }
      }
    });

    const formRef = ref<FormInst | null>(null)

    const ServerAdd = () => {
      formRef.value?.validate((errors) => {
        if (!errors) {
          add();
        } else {
          message.error('请填写必填项');
        }
      });
    };

    const ServerUpdate = () => {
      formRef.value?.validate((errors) => {
        if (!errors) {
          update();
        } else {
          message.error('请填写必填项');
        }
      });
    };
    const confirmAction = () => {
      if (variateData.value.id) {
        ServerUpdate();
      } else {
        ServerAdd();
      }
    }
    const update = async () => {
      try {
        const projectIdString = getProjectId();
        const projectIdNumber = Number(projectIdString);
        if (variateData.value.valueType == '数值') {
          variateData.value.deviceCode = null;
          variateData.value.nodeCode = null;
        }
        const res = await variableModify(
          projectIdNumber,
          variateData.value.id,
          variateData.value.name,
          variateData.value.showName,
          variateData.value.deviceCode,
          variateData.value.nodeCode,
          variateData.value.description,
          variateData.value.isShared ? 1 : 0,
          variateData.value.isSave ? 1 : 0,
          variateData.value.value,
          variateData.value.valueType
        );
        if (res.data.code === 200) {
          message.success('编辑成功');
          closeLoading();
          fetchProjects();
        } else {
          message.error(res.data.msg);
        }
      } catch (error) {
        console.error('Error updating alarm rule:', error);
        message.error('编辑变量时出错');
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
            const projectIdString = getProjectId();
            const projectIdNumber = Number(projectIdString);
            const res = await variableDelete(projectIdNumber, id);
            if (res.data.code === 200) {
              message.success('已成功删除');
              fetchProjects();
            } else {
              message.error(res.data.msg);
            }

          } catch (error) {
            message.error(error.message)
          }
        },
      })
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

    const fetchProjects = async () => {
      try {
        const projectIdString = getProjectId();
        const projectIdNumber = Number(projectIdString);
        const res = await variableList(projectIdNumber, pagination.page, pagination.pageSize);
        variateList.value = res.data.data.records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
        createColumns();
        if (variateList.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page - 1;
          await fetchProjects();
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const ServerConfigSearch = async (page) => {
      try {
        const projectIdString = getProjectId();
        const projectIdNumber = Number(projectIdString);
        const res = await variablequeryList(
          projectIdNumber,
          variateName.value,
          variateShowName.value,
          deviceShared.value,
          deviceSelf.value,
          pagination.page,
          pagination.pageSize
        );
        variateList.value = res.data.data.records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        isSearching.value = false;
      }
    };

    const searchInitiated = ref(false);

    const handleSorterChange = (sorter) => {
      pagination.page = 1;
      fetchProjects();
    };

    const handleFiltersChange = (filters) => {
      pagination.page = 1;
      fetchProjects();
    };

    const handlePageChange = (page) => {
      pagination.page = page;
      if (searchInitiated.value) {
        ServerConfigSearch(page);
      } else {
        fetchProjects();
      }
    };

    // 搜索按钮点击事件处理函数
    const handleSearchButtonClick = () => {
      searchInitiated.value = true;
      pagination.page = 1;
      ServerConfigSearch(pagination.page);
    };

    const add = async () => {
      try {
        const projectIdString = getProjectId();
        const projectIdNumber = Number(projectIdString);
        if (variateData.value.valueType == '数值') {
          variateData.value.deviceCode = null;
          variateData.value.nodeCode = null;
        }
        const res = await variableCreate(
          projectIdNumber,
          variateData.value.name,
          variateData.value.showName,
          variateData.value.deviceCode,
          variateData.value.nodeCode,
          variateData.value.description,
          variateData.value.isShared ? 1 : 0,
          variateData.value.isSave ? 1 : 0,
        );

        if (res.data.code === 200) {
          message.success('新增成功');
          closeLoading();
          fetchProjects();
        } else {
          message.error(res.data.msg);
        }
      } catch (error) {
        console.error('Error:', error);
        message.error('操作失败');
      }
    };

    const icListVisibile = ref(false);
    const openIcList = () => {
      icListVisibile.value = true
    }

    // const formRef = ref(null);
    provide('closeIcList', () => { icListVisibile.value = false })
    provide('addPt', (item: PtModel) => {
      variateData.value.deviceCode = item.extension.device
      variateData.value.nodeCode = item.extension.name
      icListVisibile.value = false
    })

    const Eliminate = () => {
      variateShowName.value = null
      variateName.value = null
      deviceShared.value = null;
      deviceSelf.value = null;
      searchInitiated.value = false
      fetchProjects()
    }
    onMounted(() => {
      fetchProjects();
    })
    return {
      variateList,
      variateName,
      seeModal,
      variateShowName,
      variateData,
      columns,
      showModal,
      closeLoading,
      handleSorterChange,
      handleFiltersChange,
      handlePageChange,
      formRef,
      openIcList,
      icListVisibile,
      // triggerSearch,
      Eliminate,
      pagination,
      ServerAdd,
      ServerUpdate,
      confirmAction,
      rules,
      seeClose,
      handleSearchButtonClick,
      deviceShared,
      deviceSelf,
      deviceSharedOptions,
      deviceSelfOptions,
      variateTypeList
    }
  }
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
