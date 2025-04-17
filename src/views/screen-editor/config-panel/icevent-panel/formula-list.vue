<template>
  <n-modal v-model:show="dialogVisible" preset="dialog" :show-icon="false" title="配方列表" style="width: 1200px"
    :on-mask-click="closeDialog" @close="closeDialog" :autoFocus="false">
    <div class="formula-dialog">
      <div class="formula-tree">
        <div class="formula-tree-panel">
          <div v-for="item in formulaData" :key="item.id" class="main-formula"
            :class="{ 'formula-checked-color': selectedFormulaId === item.id }" @click="formulaVarList(item)">
            <span class="formula-name">{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="formula-main">
        <div class="formula-main-table">
          <n-data-table :columns="columnse" :data="columnData" :bordered="false" >
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
    <template #action>
      <n-button :focusable="false" @click="closeDialog">
        关闭
      </n-button>
    </template>
  </n-modal>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, computed, inject, h, reactive } from 'vue'
import { DataTableColumns, NButton, } from 'naive-ui'
import { FormulaSecModel } from '@/components/data-handle'
import { formulaNode, formulaVerNode } from '@/api/ic'
import { getProjectId } from "@/utils/token-util";
import { IconNodata } from '@/icons'
export default defineComponent({
  name: 'FormulaList',
  props: {
    visible: Boolean,
  },
  components: {
    IconNodata
  },
  setup(props) {
    //筛选
    const loading = ref(false)
    const formulaData = ref([]); //配方数据
    const tableData = ref([]); //配方集列表数据
    const seqdata = ref([]) //配方集动态字段数据

    const selectedFormulaId = ref(-1);

    const dialogVisible = computed(() => {
      if(props.visible){
        initFormulaList();
      }
      return props.visible
    })
    const closeDialog = inject('closeFormulaList') as Function
    const addFormula = inject('addFormula') as (item: FormulaSecModel) => void

    // 将行数据转换为列数据
    const columnData = computed(() => {
      let list = [];
      tableData.value.forEach(item => {
        let column = {
          name: item.name,
          showName: item.showName,
          seq: item.seq,
          formulaId: item.formulaId,
          id: item.id
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
        title: '操作',
        key: 'actions',
        align: 'center',
        width: 120,
        render(row) {
          return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => addFormula(row)
            },
            { default: () => '选择' }
          )
        }
      })
      return columnseList;
    });

    onMounted(() => {
      initFormulaList();
    })

    const initFormulaList = () => {
      const projectId = getProjectId();
      const projectIdNumber = parseInt(projectId, 10);
      formulaNode(projectIdNumber,pagination.page,
      pagination.pageSize).then(res => {
        formulaData.value = res.data.data.records;
      });
    };

    // 配方集数据接口
    const formulaVarList = async (formula: any) => {
      selectedFormulaId.value = formula.id;
      try {
        const response = await formulaVerNode(formula.id,pagination.page, pagination.pageSize)
        tableData.value = response.data.data.records;//表格数据
        seqdata.value = formula.nodes//表单数据
      } catch (error) {
      }
    };

    const getRowKey = (row: FormulaSecModel) => row.id;

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
      pattern: ref(''),
      loading,
      dialogVisible,
      closeDialog,
      columnse,
      getRowKey,
      formulaData,
      selectedFormulaId,
      formulaVarList,
      columnData
    };
  }
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
  height: 600px;
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
</style>
