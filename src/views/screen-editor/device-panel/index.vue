<template>
  <n-drawer v-model:show="visible" :width="1200" placement="right" :auto-focus="false" to="#edit-main-wp">
    <n-drawer-content title="设备状态" closable>
      <div class="device-dialog">
        <div class="device-main">
          <div class="ic-main-search">
            <n-button @click="refreshDeviceList" :auto-focus="false">
              刷新状态
            </n-button>
          </div>
          <div class="device-main-table">
            <n-data-table :columns="columnse" :data="tableData" :bordered="false" :pagination="pagination">
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
</template>

<script lang="ts">
import { h, defineComponent, reactive, ref, watch, inject, onMounted, computed, provide } from 'vue'
import { NButton, useMessage, NInput, useDialog, NIcon } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { getAllDeviceStatus } from '@/api/ic'
import { IconNodata } from '@/icons'
import { ToolbarModule } from '@/store/modules/toolbar'
import { getProjectId } from "@/utils/token-util";

export default defineComponent({
  name: 'Device',
  components: {
    IconNodata
  },
  setup(props) {
    // 表单引用
    const message = useMessage()
    const visible = ref(false)
    const tableData = ref([]);
    const projectIdNumber = parseInt(getProjectId(), 10);
    const pagination = reactive({
      pageSize: 10});

    onMounted(() => {
      //getDeviceList();
    })

    // 创建列配置
    const columnse = computed(() => {
      let columnseList = [];
      columnseList.push({
        title: '序号',
        key: 'key',
        align: 'center',
        render: (_, index) => {
          return `${index + 1}`
        },
      }, {
        title: '设备名称',
        key: 'showName',
        align: 'center',
      }, {
        title: '设备编号',
        key: 'code',
        align: 'center',
      }, {
        title: '运行状态',
        key: 'isRunning',
        align: 'center',
        render(row) {
          // 根据 enabled 的值改变文本和颜色
          const text = row.isRunning === 1 ? '运行' : '断开'
          const color = row.isRunning === 1 ? '#2885F0' : '#D03050'
          return h('span', { style: { color: color } }, text)
        },
      })
      return columnseList;
    });


    // 配方数据接口
    const getDeviceList = () => {
      getAllDeviceStatus(projectIdNumber).then(res => {
        tableData.value = res.data.data.records;
      })
    };

    const refreshDeviceList=()=>{
      getDeviceList();
      message.success("设备状态已更新");
    }

    watch(() => ToolbarModule.device.show, (nv: boolean) => {
      visible.value = nv
      if(nv){
        getDeviceList()
      }
    })

    watch(visible, (nv: boolean) => {
      if (!nv) {
        ToolbarModule.device.show = false
      }
    })


    return {
      tableData,
      columnse,
      visible,
      getDeviceList,
      pagination,
      refreshDeviceList
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

.device-dialog {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgb(250, 250, 250);

  .device-tree {
    width: 240px;
    color: var(--datav-font-color);
    position: sticky;
    top: 90px;
    font-size: 14px;
    overflow-y: hidden;
    height: 100%;
    box-shadow: 0px 0px 10px 5px #e5e5e5;
    z-index: 3;

    .device-head-panel {
      line-height: 36px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 15px;
    }

    .device-tree-panel {
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

    .main-device {
      position: relative;
      height: 36px;
      padding: 0 15px 0 20px;
      display: flex;
      font-size: 12px;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: color 0.2s;



      .device-name {
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

    .device-checked-color {
      background-color: #e6eff6;
      color: #0b61aa;
      //background-repeat: round;

      &:hover {
        color: #0b61aa !important;
      }

      .device-name {
        color: #000;
      }
    }
  }

  .device-main {
    min-width: 600px;
    flex-grow: 1;
    padding: 10px;

    .device-main-search {
      padding: 0 10px;
    }

    .device-main-table {
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

.device-icon {
  width: 2rem;
}

.head-btn-icon {
  font-size: 1.5rem;

  &:not(:first-child) {
    border-left: 1px solid rgba(255, 235, 235, 0.1);
  }
}

.device-tree-panel-b {
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
  background-color: #F0F4FD;
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
