<template>
  <n-drawer v-model:show="visible" :width="1200" placement="right" :auto-focus="false" to="#edit-main-wp">
    <n-drawer-content title="配方管理" closable>
      <div class="formula-dialog">
        <div class="formula-tree">
          <div class="formula-head-panel">
            <span style="margin-left: 10px;font-size: 18px;">配方列表</span>
            <n-icon class="btn-add-icon" @click="addFormula" :auto-focus="false">
              <IconPlus />
            </n-icon>
          </div>
          <div class="formula-tree-panel">
            <div v-for="item in formulaData" :key="item.id" class="main-formula"
              :class="{ 'formula-checked-color': selectedFormulaId === item.id }" @click="formulaVarList(item)">
              <span class="formula-name">{{ item.name }}</span>
              <span class="group-btns">
                <n-icon :size="14" @click="editFormula(item)">
                  <IconEdit />
                </n-icon>
                <n-icon :size="14" class="btn-add-icon" @click="deleteFormula(item.id)">
                  <IconDelete />
                </n-icon>
              </span>
            </div>
          </div>
        </div>
        <div class="formula-main">
          <div class="ic-main-search">
            <n-button @click="addforSeq" :auto-focus="false">
              新增数据记录
            </n-button>
          </div>
          <div class="formula-main-table">
            <n-data-table :columns="columnse" :data="columnData" :bordered="false">
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
    </n-drawer-content>
  </n-drawer>

  <n-modal preset="dialog" :title="formulaModel.id ? '编辑配方' : '新增配方'" v-model:show="formulaVisible" style="width: 1200px;"
    :autoFocus="false" :show-icon="false" :mask-closable="false" @after-leave="closeFormulaDialog"
    @close="closeFormulaDialog">
    <div class="create-dialog">
      <p class="name-title"><span class="required">*</span>配方名称：</p>
      <new-input v-model="formulaModel.name" placeholder="请输入配方名称" spellcheck="false" class="name-input" />
      <p class="name-title"><span class="required">*</span>显示名称</p>
      <new-input v-model="formulaModel.showName" placeholder="请输入显示名称" spellcheck="false" class="name-input" />
      <p class="name-title"><span class="required">*</span>描述</p>
      <new-input v-model="formulaModel.description" placeholder="请输入描述" spellcheck="false" class="name-input" />
      <p class="name-title">元素列表</p>
      <n-data-table :columns="formulaColumns" :data="formulaModel.nodes" :style="{ height: `400px` }" flex-height>
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
    <template #action>
      <n-button :focusable="false" @click="closeFormulaDialog">
        取消
      </n-button>
      <n-button type="primary" :focusable="false" @click="formulaSubmit">
        {{ formulaModel.id ? '保存' : '新增' }}
      </n-button>
    </template>
  </n-modal>

  <n-modal preset="dialog" :title="formulaSeqModel.seq ? '编辑数据记录' : '新增数据记录'" v-model:show="formulaSeqVisible"
    style="width: 1000px;" :autoFocus="false" :show-icon="false" :mask-closable="false" @after-leave="closeDialog"
    @close="closeDialog">
    <div class="create-dialog">
      <p class="name-title"><span class="required">*</span>数据记录名称</p>
      <new-input v-model="formulaSeqModel.name" placeholder="请输入数据记录名称" spellcheck="false" class="name-input" />
      <p class="name-title"><span class="required">*</span>显示名称</p>
      <new-input v-model="formulaSeqModel.showName" placeholder="请输入显示名称" spellcheck="false" class="name-input" />
      <div v-for="item in formulaSeqModel.nodes" :key="item.showName">
        <p class="name-title">{{ item.showName }}</p>
        <new-input v-model="item.value" placeholder="请输入数值" spellcheck="false" class="name-input" />
      </div>
    </div>
    <template #action>
      <n-button :focusable="false" @click="closeDialog">
        取消
      </n-button>
      <n-button type="primary" :focusable="false" @click="formulaVarSubmit">
        {{ formulaSeqModel.seq ? '保存' : '新增' }}
      </n-button>
    </template>
  </n-modal>
  <IcList :visible="icListVisibile" />
</template>

<script lang="ts">
import { h, defineComponent, reactive, ref, watch, inject, onMounted, computed, provide } from 'vue'
import { NButton, useMessage, NInput, useDialog, NIcon } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import IcList from '@/views/screen-editor/config-panel/icevent-panel/ic-list.vue'
import { formulaNode, formulaCreate, formulaDelete, formulaUpdate, formulaVerNode, formulaSeqUpdate, formulaSeqCreate, formulaSeqDelete } from '@/api/ic'
import {
  IconDelete,
  IconFormulaAdd,
  IconFormulaEdit,
  IconWarning,
  IconPlus,
  IconEdit,
  IconNodata
} from '@/icons'
import { ToolbarModule } from '@/store/modules/toolbar'
import { PtModel } from '@/components/data-handle'
import { EditorModule } from '@/store/modules/editor'
import { getProjectId } from "@/utils/token-util";
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
  name: 'Formula',
  components: {
    IconDelete,
    IconFormulaAdd,
    IconFormulaEdit,
    IconPlus,
    IconEdit,
    IcList,
    IconNodata
  },
  setup(props) {
    const formulaModel = reactive({
      id: '',
      projectId: 0,
      name: '',
      showName: '',
      description: '',
      nodes: [] as FormulaRowData[]
    });

    const newNode = reactive({
      nodes: [
        {
          deviceCode: '',
          nodeCode: '',
          value: '',
          description: ''
        }
      ]
    });
    // 表格
    const message = useMessage()
    // 抽屉
    const formulaSeqModel = reactive({
      formulaId: null,
      name: "",
      seq: null,
      showName: "",
      nodes: []
    });

    const formulaVisible = ref(false)
    const formulaSeqVisible = ref(false)
    const icListVisibile = ref(false)
    const formulaData = ref([]); //配方数据
    const tableData = ref([]); //配方集列表数据
    const seqdata = ref([]) //配方集动态字段数据

    const selectedFormulaId = ref(-1);

    // 表单引用
    const formRef = ref();
    const visible = ref(false)

    const nDialog = useDialog()
    const nMessage = useMessage()

    onMounted(() => {
      initFormulaList();
    })

    const closeFormulaDialog = () => {
      formulaVisible.value = false
    }

    const closeDialog = () => {
      formulaSeqVisible.value = false
    }

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
              vShow: row.nodeCode.length == 0,
              onClick: () => { openIcList(row) }
            }, row.nodeCode.length > 0 ? row.nodeCode : '点位')
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
            style: 'cursor: pointer',
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
            style: 'cursor: pointer',
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
    // 将行数据转换为列数据
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

    // 创建列配置
    const columnse = computed(() => {
      let columnseList = [];
      columnseList.push({
        title: '数据记录',
        key: 'name',
        align: 'center',
      }, {
        title: '显示名称',
        key: 'showName',
        align: 'center',
      })

      seqdata.value.forEach((item, index) => {
        columnseList.push({
          title: item.showName,
          key: item.name,
          align: 'center'
        })
      });

      columnseList.push({
        title: '编辑',
        key: 'actions',
        align: 'center',
        width: 80,
        render(row) {
          return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => editforSeq(row)
            },
            { default: () => '编辑' }
          )
        }
      })

      columnseList.push({
        title: '删除',
        key: 'actions',
        align: 'center',
        width: 80,
        render(row) {
          return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => deleteforSeq(row)
            },
            { default: () => '删除' }
          )
        }
      })

      return columnseList;
    });

    // 添加新行的方法
    const addNewRecord = () => {
      const newRow: FormulaRowData = {
        deviceCode: "",
        nodeCode: "",
        name: "",
        showName: "",
        defaultValue: "",
        description: ""
      };
      formulaModel.nodes.push(newRow);
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

    // 配方集数据接口
    const formulaVarList = async (formula: any) => {
      selectedFormulaId.value = formula.id;
      try {
        const response = await formulaVerNode(formula.id, pagination.page, pagination.pageSize)
        tableData.value = response.data.data.records;//表格数据
        seqdata.value = formula.nodes//表单数据
        formulaSeqModel.formulaId = formula.id;
        formulaSeqModel.nodes = [];
        formula.nodes.forEach(node => {
          formulaSeqModel.nodes.push({
            deviceCode: node.deviceCode,
            nodeCode: node.nodeCode,
            value: node.value,
            showName: node.showName,
            name: node.name
          })
        })
      } catch (error) {
      }
    };

    const refreshFormulaVarList = async (id: any) => {
      const formula = formulaData.value.find(r => r.id == id);
      if (formula) {
        formulaVarList(formula);
      }
    }

    // 配方集维护
    const formulaVarSubmit = async () => {
      try {
        if (formulaSeqModel.name.length == 0 || formulaSeqModel.showName.length == 0) {
          message.error("请填写必填项!");
          return
        }
        let response = null;
        if (formulaSeqModel.seq) {
          response = await formulaSeqUpdate(formulaSeqModel);
        }
        else {
          response = await formulaSeqCreate(formulaSeqModel);
        }

        if (response.data.code === 200) {
          message.success('操作成功');
          refreshFormulaVarList(formulaSeqModel.formulaId);
          formulaSeqVisible.value = false;
        } else {
          message.error(response.data.msg);
        }
      } catch (error) {
        console.error('配方集操作失败', error);
      }
    };

    // 配方数据接口
    const initFormulaList = () => {
      const projectId = getProjectId();
      const projectIdNumber = parseInt(projectId, 10);
      formulaNode(projectIdNumber, pagination.page,
        pagination.pageSize).then(res => {
          formulaData.value = res.data.data.records;
        });
    };

    // 配方维护
    const formulaSubmit = async () => {
      const nodes = formulaModel.nodes;
      for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].deviceCode || !nodes[i].nodeCode) {
          message.error('请补全表格信息');
          return;
        }
      }
      try {
        let response = null;
        if (formulaModel.id) {
          response = await formulaUpdate(formulaModel);
        }
        else {
          response = await formulaCreate(formulaModel);
        }
        initFormulaList()
        if (response.data.code === 200) {
          message.success('操作成功');
          formulaVisible.value = false;
        } else {
          message.error(response.data.msg);
        }
      } catch (error) {
        console.error('配方维护时发生错误:', error);
      }
    };

    const addFormula = () => {
      formulaModel.id = null;
      formulaModel.name = "";
      formulaModel.showName = "";
      formulaModel.description = "";
      formulaModel.projectId = EditorModule.screen.groupId ?? 1;
      formulaModel.nodes = [];
      addNewRecord();
      formulaVisible.value = true
    }

    // 配方修改数据回填
    const editFormula = (item) => {
      let model = JSON.parse(JSON.stringify(item));
      formulaModel.id = model.id;
      formulaModel.projectId = model.projectId;
      formulaModel.name = model.name;
      formulaModel.showName = model.showName;
      formulaModel.description = model.description;
      formulaModel.nodes = model.nodes;
      formulaVisible.value = true
    };

    // 配方删除
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
            } else {
              message.error(response.data.msg);
            }
          } catch (error) {
            console.error('删除时发生错误:', error);
          }
        },
      })
    };

    watch(() => ToolbarModule.formula.show, (nv: boolean) => {
      visible.value = nv
    })

    watch(visible, (nv: boolean) => {
      if (!nv) {
        ToolbarModule.formula.show = false
      }
    })

    const addforSeq = () => {
      if (formulaSeqModel.formulaId) {
        formulaSeqModel.name = "";
        formulaSeqModel.seq = null;
        formulaSeqModel.showName = "";
        formulaSeqModel.nodes.forEach(node => {
          node.value = null;
        })
        formulaSeqVisible.value = true
      }
      else {
        message.warning("未选中配方");
      }
    }

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
      console.log(row.seq);
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
            refreshFormulaVarList(formulaSeqModel.formulaId);
          } catch (error) {
            nMessage.error(error.message)
          }
        },
      })
    }

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
    const pagination = reactive({
      page: 1,
      pageCount: 0,
      pageSize: 8,
      itemCount: 0,
      prefix({ itemCount }) {
        return `共 ${itemCount} 条`;
      }
    });
    return {
      formulaSeqModel,
      columnData,
      seqdata,
      addNewRecord,
      formulaColumns: createFormulaColumns(),
      pagination: {
        pageSize: 10
      },
      columnse,
      formulaModel,
      newNode,
      formulaVarSubmit,
      formRef,
      formulaSubmit,
      editFormula,
      tableData,
      formulaVarList,
      visible,
      closeDialog,
      closeFormulaDialog,
      deleteFormula,
      formulaData,
      defaultExpandedKeys: ref(['40', '41']),
      // 抽屉
      formulaVisible,
      formulaSeqVisible,
      icListVisibile,
      addFormula,
      addforSeq,
      openIcList,
      selectedFormulaId
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

.formula-dialog {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgb(250, 250, 250);

  .formula-tree {
    width: 240px;
    color: var(--datav-font-color);
    position: sticky;
    top: 90px;
    font-size: 14px;
    overflow-y: hidden;
    height: 100%;
    box-shadow: 0px 0px 10px 5px #e5e5e5;
    z-index: 3;

    .formula-head-panel {
      line-height: 36px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 15px;
    }

    .formula-tree-panel {
      // height: calc(100% - 32px);
      height: calc(100%);
      overflow-y: scroll;
    }

    .group-btns {
      display: none;
      color: var(--datav-main-color);

      i+i {
        margin-left: 10px;
      }
    }

    .main-formula {
      position: relative;
      height: 36px;
      padding: 0 15px 0 20px;
      display: flex;
      font-size: 12px;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: color 0.2s;



      .formula-name {
        width: 160px;
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        pointer-events: none;
        font-size: 16px;
      }

      &:hover {
        .project-name {
          color: var(--datav-main-color);
        }

        .group-btns {
          display: inline-block;
        }
      }
    }

    .formula-checked-color {
      background-color: #e6eff6;
      color: #0b61aa;
      //background-repeat: round;

      &:hover {
        color: #0b61aa !important;
      }

      .formula-name {
        color: #000;
      }
    }
  }

  .formula-main {
    min-width: 600px;
    flex-grow: 1;
    padding: 10px;

    .formula-main-search {
      padding: 0 10px;
    }

    .formula-main-table {
      padding: 0 10px;
    }
  }

  :deep(.n-form-item .n-form-item-label) {
    color: #000;
  }

  :deep(.n-data-table .n-data-table-th) {
    color: #000;
  }
}

.formula-icon {
  width: 2rem;
}

.btn-add-icon {
  cursor: pointer;
}

.head-btn-icon {
  font-size: 1.5rem;

  &:not(:first-child) {
    border-left: 1px solid rgba(255, 235, 235, 0.1);
  }
}

.formula-tree-panel-b {
  margin-top: 1rem;
}

.create-dialog {
  .required {
    display: inline-block;
    margin-right: 6px;
    color: var(--datav-red-color);
  }

  .template-desc {
    margin-bottom: 20px;
    opacity: 0.8;
    overflow: hidden;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .name-title {
    margin-bottom: 10px;
    color: var(--datav-font-color)
  }

  .name-input {
    margin-bottom: 15px;
    height: 28px;
    line-height: 26px;
  }


  :deep(.n-form-item .n-form-item-label) {
    color: #000;
  }

  :deep(.n-data-table .n-data-table-th) {
    color: #000;
  }
}

:deep(.n-drawer .n-drawer-content .n-drawer-body-content-wrapper) {
  padding: 0px !important;
}




:deep(.empty-data) {
  .n-icon {
    svg {
      width: 107px;
      height: 107px;
    }
  }

  p {
    font-size: 18px;
  }
}
</style>
