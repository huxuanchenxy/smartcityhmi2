<template>
  <div>
    <div>
      <div class="Server-content">
        <span>报表管理</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div class="Server-search-left">
            <label>报表名称</label>
            <input type="text" class="Server-input" placeholder="" v-model="searchParams.name" />
            <label>报表描述</label>
            <input type="text" class="Server-input" placeholder="" v-model="searchParams.description" />
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
            <n-button @click="CreateReport" class="Server-button" color="#0E62A9">
              <n-icon>
                <IconServerAdd />
              </n-icon><span>新建</span></n-button>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table :columns="columns" :data="list" :pagination="pagination" @update:page="handlePageChange"
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
    <n-modal v-model:show="showModal" class="modal-center" :mask-closable="false" :z-index="1000">
      <n-card
        style="width: 1000px;height:800px; padding-right: 113px; display: flex;  flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title">
          <span style="margin-left: 328px;">报表维护</span>
        </div>
        <div class="server-model">
          <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" size="medium" :style="{ maxWidth: '640px' }">
            <div class="input-group">
              <n-form-item style="font-size: 20px;" :span="200" label="报表名称" required path="name">
                <n-input v-model:value="model.name" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="报表描述" required path="description">
                <n-input v-model:value="model.description" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="数据源" required path="dataSourceType">
                <n-select v-model:value="model.dataSourceType" :options="dataSourceTypes"
                  @update:value="dataSourceChange" />
              </n-form-item>
              <n-form-item :span="200" label="Api地址" required path="dataSource.remote.read.url">
                <n-input v-model:value="model.dataSource.remote.read.url" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="调用方式" required path="dataSource.remote.read.method">
                <n-select v-model:value="model.dataSource.remote.read.method" :options="methodTypes" />
              </n-form-item>
              <n-form-item :span="200" label="请求参数"
                v-if="model.dataSourceType && model.dataSourceType.length > 0 && model.dataSourceType == '0' && model.dataSource.remote.read.method == 'POST'">
                <g-monaco-editor language="json" :height="120" :auto-format="true"
                  :code="JSON.stringify(model.dataSource.remote.read.body)" @blur="updateApiBody" />
              </n-form-item>
              <n-form-item :span="200" label="数据路径" path="dataSource.schema.dataPath"
                v-if="model.dataSourceType && model.dataSourceType.length > 0 && (model.dataSourceType == '1' || model.dataSourceType == '0')">
                <n-input v-model:value="model.dataSource.schema.dataPath" placeholder="" />
              </n-form-item>
              <n-form-item :span="200" label="开始时间"
                v-if="model.dataSourceType && model.dataSourceType.length > 0 && model.dataSourceType == '1'">
                <n-date-picker v-model:formatted-value="model.dataSource.remote.read.body.triggerTimeStart"
                  type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间" style="width: 100%;" />
              </n-form-item>
              <n-form-item :span="200" label="结束时间"
                v-if="model.dataSourceType && model.dataSourceType.length > 0 && model.dataSourceType == '1'">
                <n-date-picker v-model:formatted-value="model.dataSource.remote.read.body.triggerTimeEnd" type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间" style="width: 100%;" />
              </n-form-item>
              <n-form-item :span="200" label="点位列表"
                v-if="model.dataSourceType && model.dataSourceType.length > 0 && model.dataSourceType == '2'">
                <n-tree-select v-model:value="icList" multiple checkable filterable :clear-filter-after-select="false"
                  :options="icRootOptions" key-field="id" :check-strategy="'child'" :on-load="handleLoadIc"
                  @update:value="icListChange" :allow-checking-not-loaded="true" :default-value="icList">
                  <template #empty>
                    <n-empty description="无点位数据" />
                  </template>
                </n-tree-select>
              </n-form-item>
              <n-form-item :span="200" label="开始时间"
                v-if="model.dataSourceType && model.dataSourceType.length > 0 && model.dataSourceType == '2'">
                <n-date-picker v-model:formatted-value="model.dataSource.remote.read.body.start" type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间" style="width: 100%;" />
              </n-form-item>
              <n-form-item :span="200" label="结束时间"
                v-if="model.dataSourceType && model.dataSourceType.length > 0 && model.dataSourceType == '2'">
                <n-date-picker v-model:formatted-value="model.dataSource.remote.read.body.end" type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间" style="width: 100%;" />
              </n-form-item>
              <n-form-item :span="200" label="采集间隔"
                v-if="model.dataSourceType && model.dataSourceType.length > 0 && model.dataSourceType == '2'">
                <n-input-number :min="0" :max="10000" v-model:value="model.dataSource.remote.read.body.interval"
                  style="width: 100%;">
                  <template #suffix>
                    <span style="margin-right:8px"> 秒 </span>
                  </template>
                </n-input-number>
              </n-form-item>
            </div>
          </n-form>
          <div class="input-button">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="handleCancle" quaternary
              round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round @click="handleSubmit"
              class="button confirm-button">确认</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showDesigner" style="width:100vw;height:100vh;" :mask-closable="false" :z-index="1000">
      <div style="position:relative;">
        <div style="margin:0;padding:0;width:100%;height:100%;">
          <report-designer :model="model" ref="rdCom" :key="componentKey"></report-designer>
        </div>
        <div style="position:absolute;top:0;right:0;width:100px;height:32px;padding: 3px 5px;">
          <div
            style="width:100%;height:100%;display: flex;flex-direction: row;align-items:center;justify-items: center;justify-content: space-between;">
            <n-icon size="24px" @click="printTpl" title="打印">
              <IconPrint />
            </n-icon>
            <n-icon size="24px" @click="saveTpl" title="保存模板">
              <IconSave />
            </n-icon>
            <n-icon size="21px" @click="() => { showDesigner = false }" title="关闭">
              <IconClose />
            </n-icon>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, ref, onMounted, reactive, toRefs } from 'vue'
import { NButton, useMessage, FormInst, FormRules, useDialog, TreeSelectOption } from 'naive-ui'
import type { DataTableColumns, SelectOption } from 'naive-ui'
import {
  IconWarning,
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  IconSave,
  IconClose,
  IconPrint,
  IconNodata
} from '@/icons'
import { getProjectId } from '@/utils/token-util'
import { toJson } from '@/utils/util'

import { queryAllReport, createReport, modifyReport, deleteReport } from '@/api/report'

import ReportDesigner from './template/index.vue'
import { icListNode, icTreeNode } from '@/api/ic'

export default defineComponent({
  name: 'report',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    ReportDesigner,
    IconSave,
    IconClose,
    IconPrint,
    IconNodata
  },
  setup() {
    const componentKey = ref(0);
    const message = useMessage();
    const nDialog = useDialog();
    const showModal = ref(false);
    const showDesigner = ref(false);
    const rdCom = ref(null);
    const searchParams = reactive({
      name: null,
      description: null,
      projectId: 0,
      pageNo: 1,
      pageSize: 8
    })

    const icList = ref(null);
    const icRootOptions = ref([]);

    const dataSourceTypes = [{ label: '告警信息', value: "1" }, { label: '点位历史信息', value: "2" }, { label: '自定义', value: "0" }]

    const methodTypes = [{ label: 'GET', value: "GET" }, { label: 'POST', value: "POST" }]

    const list = ref<ReportModel[]>([]);
    const model = reactive<ReportModel>({
      projectId: 0,
      name: "",
      description: "",
      isShare: false,
      dataSourceType: "",
      dataSource: {
        remote: { read: { url: "", method: "", body: {} } },
        schema: { type: "json", dataPath: "", columns: {} }
      }
    })

    const createColumns = (): DataTableColumns<ReportModel> => {
      return [
        {
          title: '报表名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'description'
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
                onClick: () => EditTpl(row)
              }, { default: () => '模板' }),
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
                onClick: () => EditReport(row)
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
                onClick: () => DeleteReport(row)
              }, { default: () => '删除' }),

            ]);
          }
        }
      ]
    }

    const rules: FormRules = {
      name: [
        {
          required: true,
          message: '请输入报表名称',
          trigger: ['input', 'blur'],
        },
      ],
      description: [
        {
          required: true,
          message: '请输入报表描述',
          trigger: ['input', 'blur'],
        },
      ],
      dataSourceType: [
        {
          required: true,
          message: '请选择数据源'
        },
      ],
      "dataSource.remote.read.url": [
        {
          required: true,
          message: '请输入Api地址',
          trigger: ['input', 'blur'],
        },
      ],
      "dataSource.remote.read.method": [
        {
          required: true,
          message: '请选择调用方式'
        },
      ],
      // "dataSource.schema.dataPath": [
      //   {
      //     required: true,
      //     message: '请输入数据路径',
      //     trigger: ['input', 'blur'],
      //   }
      // ]
    }

    const pagination = reactive({
      page: 1,
      pageCount: 0,
      pageSize: 8,
      itemCount: 0,
      prefix({ itemCount }) {
        return `共 ${itemCount} 条`;
      }
    });

    onMounted(() => {
      const projectId = Number(getProjectId())
      searchParams.projectId = projectId;
      model.projectId = projectId;
      Search();
      getOptionList();
    })

    const Search = () => {
      pagination.page = 1;
      initData();
    }

    const initData = () => {
      try {
        searchParams.pageNo = pagination.page;
        searchParams.pageSize = pagination.pageSize;
        queryAllReport(searchParams).then(res => {
          list.value = res.data.data.records;
          pagination.pageCount = res.data.data.pages;
          pagination.itemCount = res.data.data.total;
          if (list.value.length === 0 && pagination.page > 1) {
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

    const Reset = () => {
      searchParams.name = null;
      searchParams.description = null;
      Search()
    }

    const CreateReport = () => {
      model.id = null;
      model.reportTplJson = null;
      model.name = "";
      model.description = "";
      model.isShare = true;
      model.dataSourceType = "";
      model.dataSource = {
        remote: { read: { url: "", method: "", body: {} } },
        schema: { type: "json", dataPath: "", columns: {} }
      }
      model.reportTpl = null;
      model.reportTplJson = null;
      icList.value = null;
      showModal.value = true;
    }

    const EditReport = (row: ReportModel) => {
      Object.assign(model, JSON.parse(JSON.stringify(row)))

      if (model.icList && model.icList.length > 0) {
        let icListVal = model.icList.map(r => { return r.id });
        icList.value = icListVal;
      }
      if (!model.dataSource.remote.read) {
        model.dataSource.remote.read = { url: "", method: "", body: {} };
      }


      showModal.value = true;
    }

    const DeleteReport = async (row: ReportModel) => {
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
            await deleteReport(row.id);
            message.success('已成功删除');
            initData()
          } catch (error) {
            message.error(error.message)
          }
        },
      })
    }

    const EditTpl = (row: ReportModel) => {
      componentKey.value++;
      //Object.assign(model, {})
      Object.assign(model, JSON.parse(JSON.stringify(row)))
      showDesigner.value = true;
    }

    const dataSourceChange = (value: string, option: SelectOption | null) => {
      const baseUrl = `${window.location.protocol}//${import.meta.env.VITE_APP_IC_HOST}:${import.meta.env.VITE_APP_IC_PORT}`;
      switch (value) {
        case "1"://告警信息
          model.dataSource.remote.read.url = baseUrl + "/device/server/mgt/alarmHistory/query";
          model.dataSource.remote.read.method = "POST";
          model.dataSource.remote.read.body = {
            projectId: Number(getProjectId()),
            pageNo: 1,
            pageSize: 10000
          }
          model.dataSource.schema.type = "json";
          model.dataSource.schema.dataPath = "data.records";
          model.dataSource.schema.columns = {
            name: { dataName: "name" },
            triggerTime: { dataType: "date", dataPattern: "yyyy-MM-dd hh:mm:ss" },
            resolveTime: { dataType: "date", dataPattern: "yyyy-MM-dd hh:mm:ss" },
          }
          break;
        case "2"://点位历史信息
          model.dataSourceType = "2";
          model.dataSource.remote.read.url = baseUrl + "/device/deviceManagement/chart";
          model.dataSource.remote.read.method = "POST";
          model.dataSource.remote.read.body = {
            projectId: Number(getProjectId()),
          }
          model.dataSource.schema.type = "json";
          model.dataSource.schema.dataPath = "";
          model.dataSource.schema.columns = {}
          break;
        case "0"://自定义
          model.dataSourceType = "0";
          model.dataSource.remote.read.url = "";
          model.dataSource.remote.read.method = "GET";
          model.dataSource.remote.read.body = {};

          model.dataSource.schema.type = "json";
          model.dataSource.schema.dataPath = "";
          model.dataSource.schema.columns = {}
          break;
      }
    }

    const updateApiBody = (data: any) => {
      model.dataSource.remote.read.body = toJson(data.value, {});
    }

    const handleCancle = () => {
      showModal.value = false;
    }

    const handleSubmit = () => {
      console.log(model);
      try {
        if (model.icList && model.icList.length > 0) {
          let nodesList = model.icList.map(r => {
            return {
              deviceCode: r.extension.device,
              nodeCode: r.extension.name
            }
          });
          model.dataSource.remote.read.body.nodes = nodesList;
        }

        if (model.id) {
          modifyReport(model).then(res => {
            if (res.data.code === 200) {
              //message.success('操作成功');
              showModal.value = false;
              Search();
            } else {
              message.error(res.data.msg);
            }
          })
        }
        else {
          createReport(model).then(res => {
            if (res.data.code === 200) {
              //message.success('操作成功');
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

    const saveTpl = async () => {
      if (rdCom.value) {
        await rdCom.value.saveTpl();
        showDesigner.value = false;
        initData();
      }
    }

    const printTpl = () => {
      if (rdCom.value) {
        rdCom.value.printTpl();
        //showDesigner.value = false;
      }
    }

    const getOptionList = () => {
      let projectId = getProjectId();
      icTreeNode(projectId).then(r => {
        if (r.data.code = 200) {
          icRootOptions.value = r.data.data;
          icRootOptions.value.forEach(m => {
            m.isLeaf = false;
            if (m.children && m.children.length > 0) {
              m.children.forEach(n => {
                n.isLeaf = false;
              })
            }
          })
        }
      })
    }

    const handleLoadIc = (option: TreeSelectOption) => {
      let projectId = getProjectId();
      let children = [];
      return icListNode(projectId, option, 1, 1000000, null, null, null, null).then(r => {
        let list = r.data.data.records;
        list.forEach(m => {
          children.push(convertToLeaf(m));
        })
        option.children = children;
      })
    }

    const convertToLeaf = (item: any): TreeSelectOption => {
      let node: TreeSelectOption = {};
      node.id = item.extension.name;
      node.label = item.extension.name;
      node.extension = item.extension;
      return node;
    }

    const icListChange = (value: string, option: TreeSelectOption | null | Array<TreeSelectOption | null> | any) => {
      model.icList = option;
      //console.log(icList.value);
      //console.log(option.extension);
    }

    return {
      searchParams,
      pagination,
      list,
      Search,
      Reset,
      columns: createColumns(),
      handleCancle,
      handleSubmit,
      showModal,
      rules,
      model,
      dataSourceTypes,
      dataSourceChange,
      methodTypes,
      updateApiBody,
      handlePageChange,
      CreateReport,
      DeleteReport,
      showDesigner,
      saveTpl,
      printTpl,
      rdCom,
      componentKey,
      icList,
      icRootOptions,
      handleLoadIc,
      icListChange
    }
  }
})

export interface ReportModel {
  projectId: number
  id?: number
  name?: string
  description?: string
  isShare?: boolean
  dataSourceType?: string
  dataSource?: ReportDataSource
  reportTpl?: any
  reportTplJson?: string
  createTime?: string
  createByName?: string
  updateTime?: string
  updateByName?: string
  icList?: any[]
}
export interface ReportDataSource {
  data?: any  //静态数据
  remote?: IRemoteTransportOption
  schema?: ISchemaOption
}

export interface IRemoteTransportOption {
  read: IRemoteReadRequestOption
}

export interface IRemoteReadRequestOption {
  url: string
  method?: string
  body?: any
  adapter?: string
}

export interface ISchemaOption {
  columns?: any	//当前表的所有列的定义
  countPath?: string	//数据读取器使用此路径获取数据源集合的长度，如果未指定，则返回当前数据源集合的长度
  dataPath?: string	//数据读取器使用此路径获取经解析后的数据源集合，如果未指定，则返回整个解析后的对象
  hierarchy?: any	//层次结构选项的定义
  type?: string	//支持 'json'、'csv'、'xml'、'columnJson'
}
</script>

<style lang="scss" scoped>
@import '@/styles/main-content.scss';

:deep(.datav-editor) {
  width: 100%;
}

:deep(.n-tree-select-menu) {
  border: 1px solid #999999;
  border-radius: 5px;
}

:deep(.n-tag__content) {
  color: #000;
}
</style>
