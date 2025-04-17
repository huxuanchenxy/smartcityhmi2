<template>
  <div>
    <div>
      <div class="Server-content">
        <span>历史报警</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div class="Server-search-left">
            <n-button style="margin-right: 10px; border-radius: 8px;" type="primary" size="small"  :focusable="false" ghost @click="openIcList()">
              点位
            </n-button>
            <input class="Server-input"  v-model="nodeCode" placeholder="" readonly />
            <label>报警内容</label>
            <input type="text" v-model="name" class="Server-input" placeholder="" />
            <label style="margin-left: 10px;">开始时间</label>
            <n-form-item>
              <n-date-picker v-model:value="timeStart" type="datetime" placeholder="请选择开始时间" />
            </n-form-item>
            <label style="margin-left: 10px;">结束时间</label>
            <n-form-item>
              <n-date-picker v-model:value="timeEnd" type="datetime" placeholder="请选择结束时间" />
            </n-form-item>
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A" @click="handleSearch">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span>
            </n-button>
            <n-button tertiary class="Server-button button-reset" @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon>
              <span>重置</span>
            </n-button>
          </div>
        </div>
        <div class="Server-table" style="margin-top: -20px;">
          <n-data-table :remote="true" :columns="columns" :data="alarmhistory" :pagination="pagination"
            :bordered="false" @update:page="handlePageChange" @update:sorter="handleSorterChange"
            @update:filters="handleFiltersChange">
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
import { defineComponent, ref, onMounted, reactive,provide } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { alarmHistoryList, alarmHistorySearch } from '@/api/ic'
import { getProjectId } from "@/utils/token-util";
import IcList from '@/views/screen-editor/config-panel/icevent-panel/ic-list.vue'
import {
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  serverConfigData,
  IconNodata
} from '@/icons'

export default defineComponent({
  name: 'MyScreen',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    serverConfigData,
    IcList,
    IconNodata
  },
  setup() {
    const name = ref('')
    const nodeCode = ref(null)
    const timeStart = ref(null)
    const timeEnd = ref(null)
    const columns = ref([]);
    const alarmhistory = ref([])
    const message = useMessage()
    const searchConditions = reactive({
      name: '',
      nodeCode: '',
      timeStart: null,
      timeEnd: null,
    });

    onMounted(() => {
      const now = new Date();
      timeEnd.value = now;

      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      if (isValidDate(sevenDaysAgo)) {
        timeStart.value = sevenDaysAgo;
      }
      fetchProjects();
    });

    const isValidDate = (d) => {
      return d instanceof Date && !isNaN(d.getTime());
    }

    const createColumns = () => {
      columns.value = [
        { title: '报警内容', key: 'name' },
        { title: '节点', key: 'nodeName' },
        { title: '触发时间', key: 'triggerTime' },
        { title: '值', key: 'value' },
      ];
    };

    const convertTimestampToDate = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      const hours = `0${date.getHours()}`.slice(-2);
      const minutes = `0${date.getMinutes()}`.slice(-2);
      const seconds = `0${date.getSeconds()}`.slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const fetchProjects = async () => {
      try {
        const projectIdString = getProjectId();
        const projectIdNumber = Number(projectIdString);
        const res = await alarmHistoryList(projectIdNumber, pagination.page, pagination.pageSize);
        alarmhistory.value = res.data.data.records;

        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
        createColumns();
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const ServerConfigSearch = async (isPaging = false) => {
      try {
        let formattedStart = null;
        let formattedEnd = null;

        if (!isPaging) {
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

          // 保存搜索条件
          searchConditions.name = name.value;
          searchConditions.nodeCode = nodeCode.value;
          searchConditions.timeStart = formattedStart;
          searchConditions.timeEnd = formattedEnd;
        } else {
          // 使用保存的搜索条件
          formattedStart = searchConditions.timeStart;
          formattedEnd = searchConditions.timeEnd;
        }
        const sort = ref('triggerTime')
        const order = ref('DESC')
        const projectIdString = getProjectId();
        const projectIdNumber = Number(projectIdString);
        const res = await alarmHistorySearch(projectIdNumber, searchConditions.name, searchConditions.nodeCode, formattedStart, formattedEnd,sort.value,order.value, pagination.page, pagination.pageSize);

        alarmhistory.value = res.data.data.records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
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
      pagination.page = 1;
      fetchProjects();
    };

    const handleFiltersChange = (filters) => {
      pagination.page = 1;
      fetchProjects();
    };

    const handlePageChange = (currentPage) => {
      pagination.page = currentPage;
      if (searchConditions.name || searchConditions.nodeCode || searchConditions.timeStart || searchConditions.timeEnd) {
        ServerConfigSearch(true);
      } else {
        fetchProjects();
      }
    };

    const initPagination = () => {
      pagination.page = 1;
      pagination.pageCount = 0;
      pagination.itemCount = 0;
    };

    const handleSearch = () => {
      initPagination();
      ServerConfigSearch();
    };

    const icListVisibile = ref(false);
    const openIcList = () => {
      icListVisibile.value = true
    }
    provide('closeIcList', () => { icListVisibile.value = false })
    provide('addPt', (item) => {
      nodeCode.value = item.extension.name
      icListVisibile.value = false
    })

    const Eliminate = () => {
      timeStart.value = null;
      timeEnd.value = null;
      nodeCode.value = null;
      name.value = null;
      searchConditions.name = null;
      searchConditions.nodeCode =null;
      searchConditions.timeStart = null;
      searchConditions.timeEnd = null;
      initPagination();
      fetchProjects();
    }

    return {
      columns,
      handleSorterChange,
      handleFiltersChange,
      handlePageChange,
      handleSearch,
      ServerConfigSearch,
      Eliminate,
      pagination,
      alarmhistory,
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
:deep(.n-input__state-border){
  border: 1px solid #E4E7EC;

}

</style>
