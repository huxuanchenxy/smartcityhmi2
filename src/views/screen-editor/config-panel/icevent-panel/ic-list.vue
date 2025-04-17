<template>
  <n-modal v-model:show="dialogVisible" preset="dialog" :show-icon="false" title="点位列表" style="width: 1300px"
    :on-mask-click="closeDialog" @close="closeDialog" :autoFocus="false">
    <div class="ic-dialog">
      <div class="ic-tree">
        <!-- <n-input v-model:value="pattern" placeholder="搜索" /> -->
        <div class="ic-tree-panel">
          <n-tree block-line :data="treeData" :default-expanded-keys="defaultExpandedKeys" key-field="id"
            label-field="label" children-field="children" :node-props="handleNodeClick" selectable />
        </div>
      </div>
      <div class="ic-main">
        <div class="ic-main-search">
          <n-form label-placement="left" inline>
            <n-grid :cols="24" :x-gap="24">
              <n-form-item-gi :span="6" label="点位名称">
                <n-input v-model:value="propertyName" type="text" placeholder="点位名称" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="控制器">
                <n-input v-model:value="device" type="text" placeholder="控制器" />
              </n-form-item-gi>
              <n-form-item-gi :span="6" label="点位代码">
                <n-input v-model:value="nodeCode" type="text" placeholder="点位代码" />
              </n-form-item-gi>
              <n-form-item-gi :span="3">
                <n-button attr-type="button" @click="handlevalue">
                  查询
                </n-button>
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </div>
        <div class="ic-main-table">
          <n-data-table :row-key="getRowKey" :columns="columns" :data="list2Data" :bordered="false" :remote="true"
            :loading="loading" :pagination="pagination" @update:sorter="handleSorterChange"
            @update:filters="handleFiltersChange" @update:page="handlePageChange" :scroll-x="scrollX">
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
import { TreeOption } from 'naive-ui'
import { icTreeNode, icListNode } from '@/api/ic'
import { EditorModule } from '@/store/modules/editor'
import { PtModel } from '@/components/data-handle'
import { getProjectId } from '@/utils/token-util'
import { NodeCode } from 'three/examples/jsm/nodes/Nodes'
import { IconNodata } from '@/icons'
export default defineComponent({
  name: 'IcList',
  props: {
    visible: Boolean,
  },
  components: {
    IconNodata
  },
  setup(props) {

    const treeData = ref([]);
    const list2Data = ref<PtModel[]>([]);
    const defaultExpandedKeys = ref<string[]>(['IDE.dev1']);

    const isIDE = ref(false)
    const scrollX = ref(undefined)

    const propertyName = ref('');
    const nodeCode = ref('')
    const device = ref('')
    const loading = ref(false)
    const dialogVisible = computed(() => props.visible)

    const saveLoading = ref(false)
    const closeDialog = inject('closeIcList') as Function
    const addPt = inject('addPt') as (item: PtModel) => void

    // const createColumns = (): DataTableColumns<PtModel> => {
    //   return [
    //     {
    //       title: '点位名称',
    //       key: 'propertyName'
    //     },
    //     {
    //       title: '描述',
    //       key: 'description'
    //     },
    //     {
    //       title: '控制器',
    //       key: 'device'
    //     },
    //     {
    //       title: '操作',
    //       key: 'actions',
    //       align: 'center',
    //       width: 120,
    //       render(row) {
    //         return h(
    //           NButton,
    //           {
    //             strong: true,
    //             tertiary: true,
    //             size: 'small',
    //             onClick: () => addPt(row)
    //           },
    //           { default: () => '选择' }
    //         )
    //       }
    //     }
    //   ]
    // }

    // 创建列配置
    const columns = computed(() => {
      let columnseList = [];
      if (isIDE.value) {
        columnseList.push({
          title: '控制器',
          key: 'ideExtension.device',
          width:130
         },
          {
            title: '资源',
            key: 'ideExtension.resource',
            width:130
          },
          {
            title: '应用程序',
            key: 'ideExtension.app',
            width:130
          },
          {
            title: '功能块名',
            key: 'ideExtension.function',
            width:130
          },
          {
            title: '变量',
            key: 'propertyName',
          },
          {
            title: '变量类型',
            key: 'ideExtension.type',
            width: 120
          },
          {
            title: '输入/输出',
            key: 'ideExtension.inOut',
            width: 120
          },
          {
            title: '描述',
            key: 'ideExtension.description',
            width: 200,
            ellipsis: {
              tooltip: true
            }
          })
      }
      else {
        columnseList.push({
          title: '点位名称',
          key: 'propertyName'
        },
          {
            title: '描述',
            key: 'description'
          },
          {
            title: '控制器',
            key: 'device'
          })
      }

      columnseList.push({
        title: '操作',
        key: 'actions',
        align: 'center',
        width: 90,
        fixed: 'right',
        render(row) {
          return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => addPt(row)
            },
            { default: () => '选择' }
          )
        }
      })

      return columnseList;
    });

    onMounted(() => {
      initIctreeList();
    })

    const initIctreeList = () => {
      let porjectId = EditorModule.screen?.groupId > 0 ? EditorModule.screen.groupId : getProjectId();
      icTreeNode(porjectId).then(res => {
        treeData.value = res.data.data;
      });
    };

    const handlevalue = async () => {
      try {
        loading.value = true;
        let porjectId = EditorModule.screen?.groupId > 0 ? EditorModule.screen.groupId : getProjectId();
        const res = await icListNode(porjectId, copytreenode?.option ?? null, pagination.page, pagination.pageSize, EditorModule.screen.id, device.value, propertyName.value, nodeCode.value, null);

        list2Data.value = res.data.data.records;

        if (list2Data.value && list2Data.value.length > 0) {
          if (list2Data.value[0].ideExtension) {
            isIDE.value = true;
            scrollX.value = 1400;
          }
          else {
            isIDE.value = false;
            scrollX.value = undefined;
          }
        }

        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
        if (list2Data.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page - 1;
          await handlevalue();
        }
        loading.value = false;
      } catch (error) {
        console.error(error);
        loading.value = false;
      }
    };

    let copytreenode: TreeOption | undefined = null;

    const pagination = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 8,
      itemCount: 0,
      prefix({ itemCount }) {
        return `共 ${itemCount} 条`;
      }
    });

    const getRowKey = (row: PtModel) => row.propertyName;

    const handleNodeClick = (node: TreeOption) => ({
      async onClick() {
        pagination.page = 1;
        copytreenode = node;
        await handlevalue();
      },
    });

    const handleSorterChange = (sorter) => {
      pagination.page = 1;
      handlevalue();
    };

    const handleFiltersChange = (filters) => {
      pagination.page = 1;
      handlevalue();
    };

    const handlePageChange = (currentPage) => {
      pagination.page = currentPage;
      handlevalue();
    };

    return {
      pattern: ref(''),
      loading,
      dialogVisible,
      saveLoading,
      closeDialog,
      pagination,
      treeData,
      list2Data,
      propertyName,
      nodeCode,
      device,
      defaultExpandedKeys,
      columns,
      handlevalue,
      handleNodeClick,
      getRowKey,
      handleSorterChange,
      handleFiltersChange,
      handlePageChange,
      scrollX
    };
  }
})
</script>

<style lang="scss" scoped>
.ic-dialog {
  display: flex;
  width: 100%;
  height: 640px;
  background-color: rgb(250, 250, 250);

  .ic-tree {
    width: 300px;
    min-width: 250px;
    border: 1px solid #c8c8c8;

    .ic-tree-panel {
      // height: calc(100% - 32px);
      height: calc(100%);
      overflow-y: scroll;
    }
  }

  .ic-main {
    min-width: 600px;
    flex-grow: 1;
    padding: 10px;

    .ic-main-search {
      padding: 0 10px;
    }

    .ic-main-table {
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
