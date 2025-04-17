<template>
  <div>
    <div>
      <div class="Server-content">
        <span>配方列表</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div v-if="!isConfigMode" class="Server-search-left">
            <label>配方名称</label>
            <input type="text" class="device-input" v-model="name" />
            <label>描述</label>
            <input type="text" class="device-input" v-model="description" />
            <label>是否共享</label>
            <div class="waring-input">
              <n-select style="width: 200px;" v-model:value="deviceShared" :options="deviceSharedOptions" />
            </div>
            <label>是否本项目</label>
            <div class="waring-input">
              <n-select style="width: 200px;" v-model:value="deviceSelf" :options="deviceSelfOptions" />
            </div>
          </div>
          <div v-if="isConfigMode" class="Server-search-left">
            <label>数据名称</label>
            <input type="text" class="Server-input" v-model="verName" />
            <label>显示名称</label>
            <input type="text" class="Server-input" v-model="verShowName" />
          </div>
          <div v-if="!isConfigMode" class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A" @click="formulaList">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span>
            </n-button>
            <n-button tertiary class="Server-button button-reset" @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon>
              <span class="button-reset-span">重置</span>
            </n-button>
            <n-button class="Server-button button-add" color="#0E62A9" @click="showModal = true">
              <n-icon>
                <IconServerAdd />
              </n-icon>
              <span>新建</span>
            </n-button>
          </div>
          <div v-else>
            <div class="Server-search-right">
              <n-button class="Server-button" color="#1D9F3A" @click="ServerformulaVerList">
                <n-icon>
                  <IconServerSearch />
                </n-icon>
                <span>查询</span>
              </n-button>
              <n-button tertiary class="Server-button button-reset" @click="Eliminate">
                <n-icon>
                  <IconServerReset />
                </n-icon>
                <span class="button-reset-span">重置</span>
              </n-button>
              <n-button v-if="!isSelfZero" class="Server-button button-add" color="#0E62A9"
                @click="formulaSeqVisible = true">
                <n-icon>
                  <IconServerAdd />
                </n-icon>
                <span>新建</span>
              </n-button>
            </div>
          </div>

        </div>
        <div style="display: flex;">
          <div style="cursor: pointer;" class="device-span" @click="resetToInitialState">
            <span v-if="selectedDeviceName" :style="{ color: showPointLocation ? '#7E7E7E' : '#0E62A9' }">{{
              selectedDeviceName }}</span>
          </div>
          <div class="device-span" v-if="showPointLocation">
            <span>数据记录</span>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table :remote="true" :columns="columns" :data="formulaData" :row-key="rowKey"
            :expanded-row-keys="expandedRowKeys" :children-key="'nodes'" :expandable="true"
            @update:expanded-row-keys="handleExpandedRowKeys" :pagination="pagination" :bordered="false"
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
    <!-- 新增修改 -->
    <n-modal v-model:show="showModal" :mask-closable="false">
      <n-card
        style="width: 900px;height:800px; padding-right: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title" style="margin-bottom: 25px;">
          <span>{{ formulaModel.id ? '编辑配方' : '新增配方' }}</span>
        </div>
        <div class="server-model">
          <n-form :model="formulaModel" :rules="rules" class="authority-from" ref="formRef" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" :style="{
              maxWidth: '640px'
            }">
            <div class="input-group">
              <n-form-item :span="200" label="配方名称" path="name">
                <div class="warning-input">
                  <n-input placeholder="" v-model:value="formulaModel.name" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="显示名称" path="showName">
                <div class="warning-input">
                  <n-input placeholder="" v-model:value="formulaModel.showName" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="描述" path="description">
                <div class="warning-input">
                  <n-input placeholder="" v-model:value="formulaModel.description" />
                </div>
              </n-form-item>
              <div class="waring-label" style="margin-left: 10px">
                <n-form-item>
                  <div class="warning-checkbox">
                    <label>是否共享</label>
                    <n-checkbox v-model:checked="formulaModel.isShared"></n-checkbox>
                  </div>
                </n-form-item>
              </div>
              <div class="formula" style="margin-left:100px;width:650px">
                <div class="formula-title">
                  <label>元素列表</label>
                </div>
                <n-data-table :columns="formulaColumns" :data="formulaModel.nodes" :style="{ height: `300px` }"
                  flex-height>
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
          </n-form>
          <div class="input-button" style="margin-left:200px;">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="closeShowModal"
              quaternary round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round class="button confirm-button"
              @click="Serverformula">确认
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>

    <n-modal v-model:show="formulaSeqVisible" :mask-closable="false">
      <n-card
        style="width: 900px;height:600px; padding-right:300px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title" style="margin-bottom: 25px;">
          <span>{{ formulaSeqModel.seq ? '编辑数据记录' : '新增数据记录' }}</span>
        </div>
        <div class="server-model">
          <n-form :model="formulaSeqModel" :rules="rulese" class="authority-from" ref="formRef2" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" :style="{
              maxWidth: '640px',
            }">
            <div class="input-group" :style="{
              maxHeight: '400px',
              maxWidth: '640px',
            }">
              <n-form-item :span="20" label="记录名称" path="name">
                <div class="warning-input">
                  <n-input placeholder="" v-model:value="formulaSeqModel.name" />
                </div>
              </n-form-item>
              <n-form-item :span="20" label="显示名称" path="showName">
                <div class="warning-input">
                  <n-input placeholder="" v-model:value="formulaSeqModel.showName" />
                </div>
              </n-form-item>
              <div v-for="item in formulaSeqModel.nodes" :key="item.showName">
                <n-form-item :span="20" :label="item.showName" :title="item.showName">
                  <div class="warning-input">
                    <n-input placeholder="" v-model:value="item.value" />
                  </div>
                </n-form-item>
              </div>
            </div>
          </n-form>

          <div class="input-button" style="margin-left:200px;">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="closeformulaSeqVisible"
              quaternary round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round class="button confirm-button"
              @click="formulaVarSubmit">确认
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
  <IcList :visible="icListVisibile" />
</template>

<script lang="ts">
import { defineComponent, ref, h, reactive, provide, computed, onMounted } from 'vue'
import { NButton, NIcon, NDataTable, NInput, useMessage, useDialog, FormInst, logDark } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import IcList from '@/views/screen-editor/config-panel/icevent-panel/ic-list.vue'
import { formulaNode, formulaCreate, formulaDelete, formulaUpdate, formulaVerNode, formulaSeqUpdate, formulaSeqCreate, formulaSeqDelete, formulaNodeList, formulaVerNodeList } from '@/api/ic'
import { PtModel } from '@/components/data-handle'
import { getProjectId } from "@/utils/token-util";
import {
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  serverConfigBell,
  serverConfigData,
  IconDeviceManagement,
  IcondeviceLocation,
  IconFormulaAdd,
  IconDelete,
  IconWarning,
  IconNodata
} from '@/icons'
interface FormulaData {
  id: number
  name: string
  showName: string
  description: string
  isShared: number
  deviceCode?: string
  nodeCode?: string
  defaultValue?: string
  nodes?: FormulaData[]
}
interface FormulaRowData {
  id?: number
  deviceCode: string,
  nodeCode: string,
  name: string,
  showName: string,
  defaultValue: string,
  description: string,
}
export default defineComponent({
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    serverConfigBell,
    serverConfigData,
    IconDeviceManagement,
    IcondeviceLocation,
    IconFormulaAdd,
    IconDelete,
    IconWarning,
    IcList,
    IconNodata
  },
  setup() {
    const formulaData = ref<FormulaData[]>([])
    const columns = ref([])
    const showModal = ref(false)
    const tableData = ref([]);
    const seqdata = ref([])
    const expandedRowKeys = ref<string[]>([])
    const nMessage = useMessage()
    const message = useMessage()
    const nDialog = useDialog()
    const name = ref('')
    const description = ref('')
    const deviceSelf = ref(null)
    const isConfigMode = ref(false);
    const showPointLocation = ref(false);
    const verName = ref('')
    const verShowName = ref('')
    const searchInitiated = ref(false);
    const isSearching = ref(false);
    const searchNodeList = ref(false)
    const deviceNodeLIst = ref(false)
    const formulaSeqVisible = ref(false)
    const deviceShared = ref(null);
    const closeShowModal = () => {
      formulaModel.id = null;
      formulaModel.projectId = 0;
      formulaModel.name = null;
      formulaModel.showName = null;
      formulaModel.description = null;
      formulaModel.nodes = [];
      showModal.value = false;
      initFormulaList()
    };
    const closeformulaSeqVisible = () => {
      formulaSeqModel.seq = null;
      formulaSeqModel.name = null;
      formulaSeqModel.showName = null;
      formulaSeqModel.nodes.forEach(node => {
        node.value = null;
      });
      formulaSeqVisible.value = false;
    };
    const deviceSharedOptions = ref([
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ]);
    const deviceSelfOptions = ref([
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ]);
    const formulaModel = reactive({
      id: null,
      projectId: null,
      name: null,
      showName: null,
      description: null,
      isShared: true,
      nodes: [] as FormulaRowData[]
    });

    const initFormulaList = async () => {
      try {
        const projectId = getProjectId();
        const projectIdNumber = parseInt(projectId, 10);
        const res = await formulaNode(
          projectIdNumber,
          pagination.page,
          pagination.pageSize
        );
        formulaData.value = res.data.data.records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);

        pagination.itemCount = res.data.data.total;
        createColumns();
        if (formulaData.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page - 1;
          await initFormulaList();
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
      },
    });
    const handleSorterChange = (sorter) => {
      pagination.page = 1;
      if (JSON.stringify(formulaData.value) === JSON.stringify(columnData.value)) {
        refreshData();
      } else {
        initFormulaList();
      }
    };

    const handleFiltersChange = (filters) => {
      pagination.page = 1;
      if (JSON.stringify(formulaData.value) === JSON.stringify(columnData.value)) {
        refreshData();
      } else {
        initFormulaList();
      }
    };

    const handlePageChange = async (page) => {
      pagination.page = page;
      if (JSON.stringify(formulaData.value) === JSON.stringify(columnData.value)) {
        if (searchNodeList.value) {
          ServerformulaVer(page)
        } else {
          refreshData();
        }
      } else {
        if (deviceNodeLIst.value) {
          ServerConfigSearch(page)
        }
        else {
          initFormulaList()
        }
      }
    };

    const ServerConfigSearch = async (page) => {
      const projectId = getProjectId();
      const projectIdNumber = parseInt(projectId, 10);
      try {
        const res = await formulaNodeList(
          projectIdNumber,
          name.value,
          description.value,
          deviceShared.value,
          deviceSelf.value,
          pagination.page,
          pagination.pageSize
        );
        formulaData.value = res.data.data.records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        isSearching.value = false;
      }
    };
    const ServerformulaVer = async (page) => {
      try {
        const res = await formulaVerNodeList(
          showformulaid.value,
          verName.value,
          verShowName.value,
          pagination.page,
          pagination.pageSize
        );
        tableData.value = res.data.data.records;
        formulaData.value = columnData.value;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        isSearching.value = false;
      }
    };
    const ServerformulaVerList = async () => {
      pagination.page = 1;
      ServerformulaVer(pagination.page)
    }
    const formulaList = async () => {
      searchInitiated.value = true;
      pagination.page = 1;
      ServerConfigSearch(pagination.page);
    }
    const isSelfZero = ref(false);
    const createColumns = () => {
      columns.value = [
        {
          title: '配方名称',
          key: 'name',
          width: 350,
          render(row) {
            const icon = row.nodes && row.nodes.length > 0 ? IconDeviceManagement : IcondeviceLocation;

            return h('a', { style: { cursor: 'pointer' }, onClick: () => toggleRowExpansion(row) }, [
              h(NIcon, { style: { marginRight: '25px', } }, { default: () => h(icon) }),
              row.name,
            ]
            );
          },
        },
        {
          title: '显示名称',
          key: 'showName',
          width: 150,
          ellipsis: {
            tooltip: true
          }

        },
        {
          title: '描述',
          key: 'description',
          width: 250
        },
        {
          title: '是否共享',
          key: 'isShared',
          width: 100,
          render(row) {
            if (row.isShared === undefined || row.isShared === null) {
              return null;
            }
            const text = row.isShared === 1 ? '是' : '否';
            const color = row.isShared === 1 ? '#2885F0' : '#D03050';
            return h('span', { style: { color } }, text);
          }
        },
        {
          title: '是否本项目',
          key: 'isSelf',
          width: 100,
          render(row) {
            if (row.isSelf === undefined || row.isSelf === null) {
              return null;
            }
            const text = row.isSelf === 1 ? '是' : '否';
            const color = row.isSelf === 1 ? '#2885F0' : '#D03050';
            return h('span', { style: { color } }, text);
          }
        },
        {
          title: '操作',
          key: 'actions',
          width: 200,
          fixed: 'right',
          align: 'center',
          render(row) {
            const editClick = () => { editFormula(row); };
            const deleteClick = () => { deleteFormula(row.id); };
            const configClick = () => { formulaVarList(row); };
            const buttons = row.isSelf === 1 ? [
              { label: '编辑', onClick: editClick, color: '#0E62A9' },
              { label: '删除', onClick: deleteClick, color: '#FF4646' },
              { label: '配置', onClick: configClick, color: '#1D9F3A' }
            ] : row.isSelf === 0 ? [
              { label: '配置', onClick: configClick, color: '#1D9F3A' }
            ] : [];

            return h('div', buttons.map((button, index) => {
              return h('span', {
                style: {
                  cursor: 'pointer',
                  color: button.color,
                  fontSize: '18px',
                  marginLeft: index > 0 ? '36px' : '0'
                },

                onClick: button.onClick
              }, button.label);
            }));
          }
        }
      ];
    };
    const createFormulaColumns = (): DataTableColumns<FormulaRowData> => [
      {
        title: () => {
          return h('span', [
            '名称',
            h('span', { style: { color: 'red', marginLeft: '6px' } }, '*')
          ]);
        },
        key: 'name',
        render(row, index) {
          return h(NInput, {
            value: row.name,
            placeholder: "名称",
            onUpdateValue(v) {
              formulaModel.nodes[index].name = v;
            }
          });
        }
      },
      {
        title: () => {
          return h('span', [
            '显示名称',
            h('span', { style: { color: 'red', marginLeft: '6px' } }, '*')
          ]);
        },
        key: 'showName',
        render(row, index) {
          return h(NInput, {
            value: row.showName,
            placeholder: "显示名称",
            onUpdateValue(v) {
              formulaModel.nodes[index].showName = v;
            }
          });
        }
      },
      {
        title: () => {
          return h('span', [
            '关联点位',
            h('span', { style: { color: 'red', marginLeft: '6px' } }, '*')
          ]);
        },
        key: 'nodeCode',
        render(row, index) {
          return h('div', {}, [
            h(NButton, {
              type: 'primary',
              size: 'small',
              ghost: true,
              onClick: () => { openIcList(row) }
            }, row.nodeCode && row.nodeCode.length > 0 ? row.nodeCode : '点位')
          ]);
        }
      },

      {
        title: '默认值',
        key: 'defaultValue',
        render(row, index) {
          return h(NInput, {
            value: row.defaultValue,
            placeholder: "默认值",
            onUpdateValue(v) {
              formulaModel.nodes[index].defaultValue = v;
            }
          });
        }
      },
      {
        title: '描述',
        key: 'description',
        render(row, index) {
          return h(NInput, {
            value: row.description,
            placeholder: "描述",
            onUpdateValue(v) {
              formulaModel.nodes[index].description = v;
            }
          });
        }
      },
      {
        title() {
          return h('div', {
            class: 'formula-icon',
            style: {
              cursor: 'pointer'
            },
            onClick: () => { addNewRecord() }
          }, [
            h(IconFormulaAdd, {})
          ]);
        },
        key: 'key',
        width: 40,
        render(row, index) {
          return h(NIcon, {
            class: 'head-btn-icon',
            style: {
              cursor: 'pointer'
            },
            onClick: () => {
              deleteRecord(index)
            }
          }, [
            h(IconDelete, {})
          ]
          );
        }
      }
    ];
    const rulese = ref({
      name: {
        required: true,
        trigger: 'blur',
        message: '请输入记录名称'
      },
      showName: {
        required: true,
        trigger: 'blur',
        message: '请输入显示名称'
      },
    })
    const rules = ref({
      name: {
        required: true,
        trigger: 'blur',
        message: '请输入配方名称'
      },

      showName: {
        required: true,
        trigger: 'blur',
        message: '请输入显示名称'
      },
      description: {
        required: true,
        trigger: 'blur',
        message: '请输入描述'
      },
    });
    const showformulaid = ref()
    const showrow = ref(null)
    const formulaVarList = async (row) => {
      const name = row.name ?? '';
      selectedDeviceName.value = name.length > 4 ? name.slice(0, 4) + '...' : name;
      showPointLocation.value = true;
      isConfigMode.value = true;
      showformulaid.value = row.id
      showrow.value = row
      isSelfZero.value = (row.isSelf === 0);
      try {
        refreshData()
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    }
    const refreshData = async () => {
      try {
        pagination.page = 1;
        const res = await formulaVerNode(showformulaid.value, pagination.page, pagination.pageSize)
        tableData.value = res.data.data.records;
        formulaSeqModel.formulaId = showformulaid.value;
        formulaSeqModel.nodes = [];
        showrow.value.nodes.forEach(node => {
          formulaSeqModel.nodes.push({
            deviceCode: node.deviceCode,
            nodeCode: node.nodeCode,
            value: node.value,
            showName: node.showName,
            name: node.name
          })
        })
        seqdata.value = showrow.value.nodes
        formulaData.value = columnData.value;
        columns.value = columnse.value;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
        if (columnData.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page - 1;
          await refreshData();
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    const columnData = computed(() => {
      let list = [];
      tableData.value.forEach(item => {
        let column = {
          name: item.name,
          showName: item.showName,
          seq: item.seq
        };

        item.nodes.forEach((node) => {
          column[node.name] = node.value;
        })

        list.push(column);
      });
      return list;
    });
    const columnse = computed(() => {
      let columnseList = [];
      columnseList.push({
        title: '数据名称',
        key: 'name',
      }, {
        title: '显示名称',
        key: 'showName',
      })

      seqdata.value.forEach((item, index) => {
        columnseList.push({
          title: item.showName,
          key: item.name,
          align: 'center'
        })
      });
      if (!isSelfZero.value) {
        columnseList.push({
          title: '操作',
          key: 'actions',
          align: 'center',
          fixed: 'right',
          width: 150,
          render(row) {
            if (row.isSelf === 0) {
              return null;
            }
            return h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-around' } },
              [
                h('span', {
                  style: { cursor: 'pointer', color: '#0E62A9', fontSize: '18px' },
                  onClick: () => editforSeq(row)
                }, '编辑'),
                h('span', {
                  style: { cursor: 'pointer', color: '#FF4646', fontSize: '18px', marginLeft: '36px' },
                  onClick: () => deleteforSeq(row)
                }, '删除'),
              ]
            );
          }
        });
      }
      return columnseList;
    });
    const formulaSeqModel = reactive({
      formulaId: null,
      name: null,
      seq: null,
      showName: null,
      nodes: []
    });
    const formulaVarSubmit = async () => {
      try {

        formRef2.value?.validate(async(errors) => {
          if (!errors) {
            let response = null;
            if (formulaSeqModel.seq) {
              response = await formulaSeqUpdate(formulaSeqModel);
            }
            else {
              response = await formulaSeqCreate(formulaSeqModel);
            }

            if (response.data.code === 200) {
              message.success('操作成功');
              refreshData()
              formulaSeqVisible.value = false;
              formulaSeqModel.seq = null;
              formulaSeqModel.name = null;
              formulaSeqModel.showName = null;
              formulaSeqModel.nodes.forEach(node => {
                node.value = null;
              });
            } else {
              message.error(response.data.msg);
            }

          } else {
            message.error('请填写必填项');
          }
        });


      } catch (error) {
        console.error('配方集操作失败', error);
      }
    };
    const editforSeq = (row: any) => {
      formulaSeqModel.name = row.name;
      formulaSeqModel.seq = row.seq;
      formulaSeqModel.showName = row.showName;
      formulaSeqModel.nodes.forEach(node => {
        node.value = row[node.name];
      })
      formulaSeqVisible.value = true
    }
    const deleteforSeq = (row: any) => {
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
            await formulaSeqDelete({ formulaId: formulaSeqModel.formulaId, seq: row['seq'] })
            message.success('已成功删除');
            refreshData()

          } catch (error) {
            nMessage.error(error.message)
          }
        },
      })
    }


    const deleteFormula = async (id: number) => {
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
            const response = await formulaDelete(id);
            if (response.data.code === 204 || response.data.code === 200) {
              formulaData.value = formulaData.value.filter(r => r.id !== id);
              message.success('配方删除成功！');
              initFormulaList()
            } else {
              message.error(response.data.msg);
            }
          } catch (error) {
            console.error('删除时发生错误:', error);
          }
        },
      })
    };
    // 添加新行的方法
    const addNewRecord = () => {
      const newRow: FormulaRowData = {
        deviceCode: null,
        nodeCode: null,
        name: null,
        showName: null,
        defaultValue: null,
        description: null
      };
      formulaModel.nodes.push(newRow);
    };
    const selectedDeviceName = ref('配方');
    const resetToInitialState = () => {
      selectedDeviceName.value = '配方';
      showPointLocation.value = false;
      isConfigMode.value = false
      pagination.page = 1
      initFormulaList();
    };
    const formulaSubmit = async () => {
      const nodes = formulaModel.nodes;
      for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].deviceCode || !nodes[i].nodeCode) {
          message.error('请补全表格信息');
          return;
        }
      }
      try {
        let isSharedValue = formulaModel.isShared ? 1 : 0;
        const projectId = getProjectId();
        const projectIdNumber = parseInt(projectId, 10);
        let res = null;
        if (formulaModel.id) {
          res = await formulaUpdate({
            ...formulaModel,
            isShared: isSharedValue,
            projectId: projectIdNumber
          });
        } else {
          res = await formulaCreate({
            ...formulaModel,
            isShared: isSharedValue,
            projectId: projectIdNumber
          });
          console.log(res);

        }
        if (res.data.code === 200) {
          message.success('操作成功');
          formulaModel.id = null;
          formulaModel.projectId = 0;
          formulaModel.name = null;
          formulaModel.showName = null;
          formulaModel.description = null;
          formulaModel.nodes = [];
          showModal.value = false;
          initFormulaList();
        } else {
          message.error(res.data.msg);
          initFormulaList()
        }
      } catch (error) {
        console.error('配方维护时发生错误:', error);
      }
    };
    const formRef = ref<FormInst | null>(null)
    const formRef2 = ref<FormInst | null>(null)

    const Serverformula = () => {
      formRef.value?.validate((errors) => {
        if (!errors) {
          formulaSubmit();
        } else {
          message.error('请填写必填项');

        }
      });
    };

    // 配方修改数据回填·
    const editFormula = (row) => {
      formulaModel.id = row.id;
      formulaModel.projectId = row.projectId;
      formulaModel.name = row.name;
      formulaModel.showName = row.showName;
      formulaModel.description = row.description;
      formulaModel.isShared = row.isShared === 1;
      formulaModel.nodes = row.nodes;
      showModal.value = true
    };
    const deleteRecord = (idx: number) => {
      let allRecord = formulaModel.nodes[idx].name +
        formulaModel.nodes[idx].defaultValue +
        formulaModel.nodes[idx].description +
        formulaModel.nodes[idx].deviceCode +
        formulaModel.nodes[idx].nodeCode +
        formulaModel.nodes[idx].showName;
      if (allRecord.length > 0 || formulaModel.nodes[idx].id) {
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
              formulaModel.nodes.splice(idx, 1);
            } catch (error) {
              nMessage.error(error.message)
            }
          },
        })
      }
      else {
        formulaModel.nodes.splice(idx, 1);
      }
    }
    const rowKey = (row: FormulaData) => {
      if (row && row.id !== undefined) {
        return row.id.toString();
      } else {
        return '';
      }
    };

    const handleExpandedRowKeys = (keys: string[]) => {
      expandedRowKeys.value = keys
    }

    const toggleRowExpansion = (row: FormulaData) => {
      const rowIndex = expandedRowKeys.value.indexOf(rowKey(row))
      if (rowIndex >= 0) {
        expandedRowKeys.value.splice(rowIndex, 1)
      } else {
        expandedRowKeys.value.push(rowKey(row))
      }
    }

    const icListVisibile = ref(false);
    var currentRow: FormulaRowData = null;

    const openIcList = (row: FormulaRowData) => {
      currentRow = row;
      icListVisibile.value = true
    }
    provide('closeIcList', () => { icListVisibile.value = false })
    provide('addPt', (item: PtModel) => {
      if (item != null && item.extension && item.extension.device && item.extension.name) {
        currentRow.deviceCode = item.extension.device
        currentRow.nodeCode = item.extension.name;
        icListVisibile.value = false
      }
    })
    const Eliminate = () => {
      name.value = null;
      description.value = null;
      verName.value = null;
      deviceSelf.value = null;
      deviceShared.value = null;
      verShowName.value = null;
      if (JSON.stringify(formulaData.value) === JSON.stringify(columnData.value)) {
        refreshData();
      } else {
        initFormulaList();
      }
    };
    onMounted(() => {
      initFormulaList();
    })

    return {
      formulaData,
      columns,
      expandedRowKeys,
      rowKey,
      handleExpandedRowKeys,
      closeShowModal,
      showModal,
      formulaColumns: createFormulaColumns(),
      formulaModel,
      icListVisibile,
      openIcList,
      formulaSubmit,
      editFormula,
      rules,
      Serverformula,
      formRef,
      formRef2,
      deviceSelfOptions,
      name,
      description,
      deviceSelf,
      Eliminate,
      columnse,
      columnData,
      resetToInitialState,
      selectedDeviceName,
      showPointLocation,
      isConfigMode,
      formulaSeqModel,
      formulaSeqVisible,
      closeformulaSeqVisible,
      formulaVarSubmit,
      rulese,
      formulaList,
      verName,
      verShowName,
      ServerformulaVerList,
      pagination,
      handleSorterChange,
      handleFiltersChange,
      handlePageChange,
      isSelfZero,
      deviceShared,
      deviceSharedOptions,
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/main-content.scss';

:deep(.n-icon) {
  svg {
    font-size: 20px;
    margin-top: 10px;
  }
}

:deep(.n-base-icon) {
  margin-bottom: 3px;
}

:deep(.n-data-table-base-table) {
  margin-left: 00px;
}

.formula-title {
  font-size: 24px;
  color: #7E7E7E;
  font-family: '思源黑体Normal';
}

.device-span {
  background-image: url('../images/device-management.png');
  background-repeat: no-repeat;
  margin-bottom: 12px;
  width: 127px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.device-span span {
  color: #0E62A9;
  font-size: 18px;
  display: flex;
}

:deep(.n-data-table-base-table) {
  overflow-y: auto;
  max-height: 545px;
}

:deep(.n-form-item-label) {
  display: inline-block;
  max-width: 200px;
  /* 设置固定宽度 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
