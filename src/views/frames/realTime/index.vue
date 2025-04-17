<template>
  <div>
    <div>
      <div class="Server-content">
        <span>实时报警</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div class="Server-search-left">
            <n-button style="margin-right: 10px; border-radius: 8px; " type="primary" size="small" ghost
              @click="openIcList()">
              点位
            </n-button>
            <n-input style="width: 180px; margin-left:
            10px; margin-right: 10px;" v-model:value="nodeCode" placeholder="" readonly="readonly" />

            <label>报警内容</label>
            <input type="text" v-model="name" class="formula-input" placeholder="" />
            <!-- <label>状态</label>
            <input type="text" class="Server-input" placeholder="" /> -->
            <label>开始时间</label>
            <n-form-item>
              <n-date-picker v-model:value="timeStart" type="datetime" placeholder="请选择开始时间" />
            </n-form-item>
            <label style="margin-left: 10px;">结束时间</label>
            <form>
              <n-form-item>
                <n-date-picker v-model:value="timeEnd" type="datetime" placeholder="请选择结束时间" />
              </n-form-item>
            </form>
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A" @click="ServerConfigSearch">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span></n-button>
            <n-button class="Server-button" color="#ABC4F6" @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon><span>重置</span></n-button>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table :remote="true" :columns="columns" :data="alarmReal" :pagination="pagination" :bordered="false"
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
  </div>
  <IcList :visible="icListVisibile" />
</template>

<script lang='ts'>
import { h, defineComponent, ref, onMounted, reactive, computed, provide, watch } from 'vue'
import { NButton, useMessage, useDialog, FormInst } from 'naive-ui'
import { alarmRealTimeList, alarmRealSearch, setShelved, cancelShelved, confirmpolice } from '@/api/ic'
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
    const name = ref(null)
    const nodeCode = ref(null)
    const timeStart = ref(null)
    const timeEnd = ref(null)
    const columns = ref([]);
    const message = useMessage()
    const formRef = ref<FormInst | null>(null)

    const alarmReal = ref([])
    const createColumns = () => {
      return columns.value = [
        {
          title: '报警内容',

          key: 'name',
        },
        {
          title: '节点',
          key: 'nodeName',
        },
        {
          title: '触发时间',
          key: 'triggerTime',
        },
        {
          title: '搁置时间',
          key: 'shelvedTime',
          width: 500, // 设置固定宽度
        },
        {
          title: '操作',
          width: 200,
          render: (row, record) => {
            const color = row.shelvedTime === null ? '#0E62A9' : 'red';
            return h('div', [
              h('span', {
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  color: color,
                  fontSize: '18px',
                  textAlign: 'left'
                },
                onClick: () => {
                  if (row.shelvedTime === null) {
                    shelfAlarm(row);
                  } else {
                    unshelfAlarm(row);
                  }
                }
              }, row.shelvedTime === null ? '搁置' : '取消搁置'),
              h('span', {
                strong: true,
                tertiary: true,
                size: 'small',
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#1D9F3A',
                  border: 'none',
                  fontSize: '18px',
                  marginLeft: '20px',
                },
                onClick: () => confirm(row)
              }, { default: () => '确认报警' }),
            ]);
          }
        }
      ];
    };
    const shelfAlarm = async (row) => {
      try {
        const res = await setShelved(row.cacheKey);
        console.log(res);
        if (res.data.code === 200) {
          message.success('搁置成功');
          fetchProjects();
        } else {
          message.error('搁置失败');
        }

      } catch (error) {
        console.error('Error shelving alarm:', error);
      }
    };

    const unshelfAlarm = async (row) => {
      try {
        const res = await cancelShelved(row.cacheKey);
        console.log(res);

        if (res.data.code === 200) {
          message.success('取消搁置成功');
          fetchProjects();
        } else {
          message.error('取消搁置失败');
        }
      } catch (error) {
        console.error('Error unshelving alarm:', error);
      }
    };
    const confirm = async (row) => {
      try {
        const res = await confirmpolice(row.cacheKey);
        console.log(res);

        if (res.data.code === 200) {
          message.success('确认报警成功');
          fetchProjects();
        } else {
          message.error('确认报警失败');
        }
      } catch (error) {
        console.error('Error unshelving alarm:', error);
      }
    };
    const convertTimestampToLocalTime = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      // 组合成所需的格式
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    const fetchProjects = async () => {
      try {
        const projectIdString = getProjectId();
        const projectIdNumber = Number(projectIdString);
        const res = await alarmRealTimeList(projectIdNumber, pagination.page, pagination.pageSize);
        const records = res.data.data.records.map(record => {
          return {
            ...record, // 保留原记录的其他字段
            triggerTime: convertTimestampToLocalTime(record.triggerTime), // 将触发时间转换为本地时间
            shelvedTime: record.shelvedTime ? convertTimestampToLocalTime(record.shelvedTime) : null // 将搁置时间转换为本地时间，如果为null则显示为空
          };
        });

        alarmReal.value = records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
        createColumns();
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const convertTimestampToDate = (timestamp: number): string => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      const hours = `0${date.getHours()}`.slice(-2);
      const minutes = `0${date.getMinutes()}`.slice(-2);
      const seconds = `0${date.getSeconds()}`.slice(-2);

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const ServerConfigSearch = async () => {
      try {
        let formattedStart = null;
        let formattedEnd = null;
        if (timeStart.value) {
          formattedStart = convertTimestampToDate(timeStart.value);
        }
        if (timeEnd.value) {
          formattedEnd = convertTimestampToDate(timeEnd.value);
        }
        if (!formattedStart && !formattedEnd) {
          message.error('开始时间和结束时间不能为空！');
          return;
        }
        const projectIdString = getProjectId();
        const projectIdNumber = Number(projectIdString);
        const res = await alarmRealSearch(projectIdNumber, name.value, nodeCode.value, formattedStart, formattedEnd, pagination.page, pagination.pageSize)
        alarmReal.value = res.data.data.records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };


    const icListVisibile = ref(false);
    const openIcList = () => {
      icListVisibile.value = true
    }
    provide('closeIcList', () => { icListVisibile.value = false })
    provide('addPt', (item: PtModel) => {
      // deviceCode = item.extension.device
      nodeCode.value = item.extension.name
      icListVisibile.value = false
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


    const handleSorterChange = (sorter) => {
      pagination.page = 1;
      fetchProjects()
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
      timeStart.value = null;
      timeEnd.value = null;
      nodeCode.value = null;
      name.value = null;
      fetchProjects()
    }
    onMounted(() => {
      fetchProjects();
    })

    return {
      columns,
      handleSorterChange,
      handleFiltersChange,
      handlePageChange,
      formRef,
      ServerConfigSearch,
      Eliminate,
      pagination,
      alarmReal,
      timeStart,
      timeEnd,
      openIcList,
      nodeCode,
      name,
      icListVisibile
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/main-content.scss';


</style>
