<template>
  <div>
    <div>
      <div class="Server-content">
        <span>设备管理</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div class="Server-search-left">
            <label v-if="!showNodeSearch">设备名称</label>
            <input
              v-if="!showNodeSearch"
              v-model="devicename"
              class="device-input"
              placeholder=""
            >
            <label v-if="!showNodeSearch">设备代码</label>
            <input
              v-if="!showNodeSearch"
              v-model="devicecode"
              class="device-input"
              placeholder=""
            >
            <label v-if="showNodeSearch">点位名称</label>
            <input
              v-if="showNodeSearch"
              v-model="nodeNamequery"
              class="device-input"
              placeholder=""
            >
            <label v-if="showNodeSearch">点位代码</label>
            <input v-if="showNodeSearch" v-model="nodeCodeQuery" class="device-input">

            <label v-if="!showNodeSearch">是否共享</label>
            <div v-if="!showNodeSearch" class="waring-input">
              <n-select v-model:value="deviceShared" style="width: 200px;" :options="deviceSharedOptions" />
            </div>

            <label v-if="!showNodeSearch">是否本项目</label>
            <div v-if="!showNodeSearch" class="waring-input">
              <n-select v-model:value="deviceSelf" style="width: 200px;" :options="deviceSelfOptions" />
            </div>
          </div>

          <div class="Server-search-right">
            <n-button
              v-if="showNewButton"
              class="Server-button"
              color="#1D9F3A"
              @click="triggerSearch"
            >
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span>
            </n-button>
            <div v-if="selectedDeviceClz === 'OpcUa' || selectedDeviceClz === 'WebSocket'" class="button-container">
              <n-button class="Server-button" color="#1D9F3A" @click="nodeListDataSearch">
                <n-icon>
                  <IconServerSearch />
                </n-icon>
                <span>查询</span>
              </n-button>
            </div>
            <n-button tertiary class="Server-button button-reset" @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon>
              <span class="button-reset-span">
                重置
              </span>
            </n-button>
            <div v-if="selectedDeviceClz === 'OpcUa'" class="button-container">
              <n-button
                style="width:135px"
                class="Server-button button-add"
                color="#0E62A9"
                @click="opentreeModel"
              >
                <n-icon>
                  <IcondevicePosition />
                </n-icon>
                <span>点位选择</span>
              </n-button>
              <n-button
                style="width:135px"
                class="Server-button button-add"
                color="#0E62A9"
                @click="download"
              >
                <n-icon>
                  <IcondeviceDownload />
                </n-icon>
                <span>下载模板</span>
              </n-button>
              <n-upload ref="uploadRef" :show-file-list="false" @change="uploadFile">
                <n-button class="Server-button button-add" color="#0E62A9">
                  <n-icon>
                    <IcondeviceDownloadTwo />
                  </n-icon>
                  <span>导入</span>
                </n-button>
              </n-upload>
            </div>
            <n-button
              v-if="!showNewButton"
              style="width:135px"
              class="Server-button button-add"
              color="#0E62A9"
              @click="deviceReload"
            >
              <n-icon>
                <IcondeviceDownload />
              </n-icon>
              <span>应用配置</span>
            </n-button>
            <n-button
              v-if="showNewButton"
              class="Server-button button-add"
              color="#0E62A9"
              @click="showModal = true"
            >
              <n-icon>
                <IconServerAdd />
              </n-icon>
              <span>新建</span>
            </n-button>
          </div>
        </div>
        <div style="display: flex;">
          <div style="cursor: pointer;" class="device-span" @click="resetToInitialState">
            <span v-if="selectedDeviceName" :style="{ color: showPointLocation ? '#7E7E7E' : '#0E62A9' }">{{
              selectedDeviceName }}</span>
          </div>
          <div v-if="showPointLocation" class="device-span">
            <span>点位</span>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table
            :remote="true"
            :columns="columns"
            :data="deviceAll"
            :pagination="pagination"
            :bordered="false"
            @update:page="handlePageChange"
            @update:sorter="handleSorterChange"
            @update:filters="handleFiltersChange"
          >
            <template #empty>
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

    <n-modal v-model:show="showModal" class="modal-center" :mask-closable="false">
      <n-card
        :style="{
          width: '1000px',
          height: getModalHeight + 'px'
        }"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-center-title" style="margin-bottom: 25px; margin-left:100px;">
          <span>{{ deviceAllData.id ? '编辑设备管理' : '新增设备管理' }}</span>
        </div>
        <div class="server-model">
          <n-form
            ref="formRef"
            class="authority-from"
            :model="deviceAllData"
            :rules="rules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :style="{ maxWidth: '640px' }"
          >
            <div class="input-group">
              <n-form-item :span="200" label="设备代码" path="code">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.code" :readonly="!!deviceAllData.id" placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="设备名称" path="name">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.name" placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="设备显示名称" path="showName">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.showName" placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="设备描述" path="description">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.description" placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="设备类型" path="clz">
                <div class="warning-input">
                  <n-select
                    v-model:value="deviceAllData.clz"
                    :options="deviceTypeOptions"
                    placeholder=""
                    @change="handleDeviceTypeChange"
                  />
                </div>
              </n-form-item>
              <div class="waring-label" style="margin-left: 120px">
                <n-form-item>
                  <div class="warning-checkbox">
                    <label>共享</label>
                    <n-checkbox v-model:checked="deviceAllData.isShared" />
                  </div>
                  <div class="warning-checkbox1">
                    <label>自动连接</label>
                    <n-checkbox v-model:checked="deviceAllData.isActive" />
                  </div>
                </n-form-item>
              </div>
              <div v-if="showSecurityPolicyFields || (isEditingOpcUa && deviceAllData.clz === 'OpcUa')">
                <n-form-item :span="200" label="安全策略" path="json.securityPolicy">
                  <div class="warning-input">
                    <n-select
                      v-model:value="deviceAllData.json.securityPolicy"
                      :options="securityPolicyOptions"
                      placeholder=""
                    />
                  </div>
                </n-form-item>
                <n-form-item :span="200" label="设备地址" path="json.endpoint">
                  <div class="warning-input">
                    <n-input v-model:value="deviceAllData.json.endpoint" placeholder="" />
                  </div>
                </n-form-item>
                <div class="input-row" style="display: flex; gap: 20px;">
                  <n-form-item
                    :span="20"
                    label="用户名"
                    path="json.username"
                    style="flex: 1;"
                  >
                    <div class="warning-input" style="width: 230px;">
                      <n-input v-model:value="deviceAllData.json.username" placeholder="" />
                    </div>
                  </n-form-item>
                  <n-form-item
                    :span="20"
                    label="密码"
                    path="json.password"
                    style="flex: 1;"
                  >
                    <div class="warning-input" style="width: 230px;">
                      <n-input v-model:value="deviceAllData.json.password" placeholder="" />
                    </div>
                  </n-form-item>
                </div>
              </div>

              <div v-else-if="deviceTypeValue === 'WebSocket'">
                <n-form-item :span="200" label="设备地址" path="json.endpoint">
                  <div class="warning-input">
                    <n-input v-model:value="deviceAllData.json.endpoint" placeholder="" />
                  </div>
                </n-form-item>
              </div>
            </div>
          </n-form>

          <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <div>
              <n-button
                style="border: 1px solid #A8A8A8;"
                size="small"
                :focusable="false"
                quaternary
                round
                class="button cancel-button"
                @click="statusQuery"
              >
                测试
              </n-button>
              <n-spin v-if="isSuccess === -1" size="small" stroke="black">
                <template #icon>
                  <n-icon>
                    <IconLoad />
                  </n-icon>
                </template>
              </n-spin>
              <span v-if="isSuccess === -1">连接中...</span>
              <span v-else-if="isSuccess === 0" style="color: red;margin-left: 10px;">
                <IconConnecterror />
                <!-- 连接失败 -->
              </span>
              <span v-else-if="isSuccess === 1" style="color:green;margin-left: 10px;">
                <IconConnectDefeated />
                <!-- 连接成功 -->
              </span>
            </div>
            <div style="display: flex; gap: 10px;">
              <n-button
                style="border: 1px solid #A8A8A8;"
                size="small"
                :focusable="false"
                quaternary
                round
                class="button cancel-button"
                @click="closeLoading"
              >
                取消
              </n-button>
              <n-button
                size="small"
                color="#0647a1"
                :focusable="false"
                round
                class="button confirm-button"
                @click="confirmAction"
              >
                确认
              </n-button>
            </div>
          </div>
        </div>
      </n-card>
    </n-modal>

    <n-modal v-model:show="seeModal" class="modal-center" :mask-closable="false">
      <n-card
        style="width: 1000px;height:802px;"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-center-title" style="margin-bottom: 25px; margin-left:100px;">
          <span>查看设备管理</span>
        </div>
        <div class="server-model">
          <n-form
            ref="formRef"
            class="authority-from"
            :model="deviceAllData"
            :rules="rules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :style="{ maxWidth: '640px' }"
          >
            <div class="input-group">
              <n-form-item :span="200" label="设备代码" path="code">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.code" readonly placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="设备名称" path="name">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.name" readonly placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="设备显示名称" path="showName">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.showName" readonly placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="设备描述" path="description">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.description" readonly placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="设备类型" path="clz">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.clz" readonly placeholder="" />
                </div>
              </n-form-item>
              <div class="waring-label" style="margin-left: 120px">
                <n-form-item>
                  <div class="warning-checkbox">
                    <label>共享</label>
                    <n-checkbox v-model:checked="deviceAllData.isShared" disabled />
                  </div>
                  <div class="warning-checkbox1">
                    <label>自动连接 </label>
                    <n-checkbox v-model:checked="deviceAllData.isActive" disabled />
                  </div>
                </n-form-item>
              </div>
              <n-form-item :span="200" label="安全策略" path="json.securityPolicy">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.json.securityPolicy" readonly placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="设备地址" path="json.endpoint">
                <div class="warning-input">
                  <n-input v-model:value="deviceAllData.json.endpoint" readonly placeholder="" />
                </div>
              </n-form-item>
              <div class="input-row" style="display: flex; gap: 20px;">
                <n-form-item
                  readonly
                  :span="20"
                  label="用户名"
                  path="username"
                  style="flex: 1;"
                >
                  <div class="warning-input" style="width: 230px;">
                    <n-input v-model:value="deviceAllData.json.username" readonly placeholder="" />
                  </div>
                </n-form-item>
                <n-form-item
                  :span="20"
                  label="密码"
                  path="password"
                  style="flex: 1;"
                >
                  <div class="warning-input" style="width: 230px;">
                    <n-input v-model:value="deviceAllData.json.password" readonly placeholder="" />
                  </div>
                </n-form-item>
              </div>
            </div>
          </n-form>
          <div class="input-button" style="margin-left: 0;">
            <n-button
              style="border: 1px solid #A8A8A8;"
              size="small"
              :focusable="false"
              quaternary
              round
              class="button cancel-button"
              @click="closeLoading"
            >
              取消
            </n-button>
            <n-button
              size="small"
              color="#0647a1"
              :focusable="false"
              round
              class="button confirm-button"
              @click="closeLoading"
            >
              确认
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>

    <n-modal v-model:show="configurationModel" class="modal-center" :mask-closable="false">
      <n-card
        style="width: 1000px;height:702px;"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-center-title" style="margin-bottom: 25px; margin-left:100px;">
          <span>编辑配置</span>
        </div>
        <div class="server-model">
          <n-form
            ref="formRef"
            class="authority-from"
            :model="deviceconfigData"
            :rules="rule"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :style="{ maxWidth: '640px' }"
          >
            <div class="input-group">
              <div class="waring-label" style="margin-left: 0px">
                <n-form-item :span="200" label="点位名称" path="nodeName">
                  <div class="warning-input">
                    <n-input v-model:value="deviceconfigData.nodeName" placeholder="" />
                  </div>
                </n-form-item>
                <n-form-item :span="200" label="名称" path="name">
                  <div class="warning-input">
                    <n-input v-model:value="deviceconfigData.name" placeholder="" />
                  </div>
                </n-form-item>
                <n-form-item :span="200" label="点位显示名称" path="nodeShowName">
                  <div class="warning-input">
                    <n-input v-model:value="deviceconfigData.nodeShowName" placeholder="" />
                  </div>
                </n-form-item>
                <n-form-item :span="200" label="描述" path="description">
                  <div class="warning-input">
                    <n-input v-model:value="deviceconfigData.description" placeholder="" />
                  </div>
                </n-form-item>
                <n-form-item :span="200" label="采样间隔（毫秒）" path="samplingInterval">
                  <n-input-number
                    v-model:value="deviceconfigData.samplingInterval"
                    :min="0"
                    :max="10000"
                  />
                </n-form-item>
                <div class="waring-label" style="margin-left: 106px">
                  <n-form-item>
                    <div class="warning-checkbox">
                      <label>是否订阅</label>
                      <n-checkbox v-model:checked="deviceconfigData.isSubscribe" />
                    </div>
                    <div class="warning-checkbox1">
                      <label>是否推送</label>
                      <n-checkbox v-model:checked="deviceconfigData.isPush" />
                    </div>
                    <div class="warning-checkbox2">
                      <label>是否记录</label>
                      <n-checkbox v-model:checked="deviceconfigData.isSave" />
                    </div>
                  </n-form-item>
                </div>
                <div class="waring-label" style="margin-left: 106px">
                  <n-form-item>
                    <!-- <div class="warning-checkbox1">
                      <label>是否轮询</label>
                      <n-checkbox v-model:checked="deviceconfigData.isPolling">
                      </n-checkbox>
                    </div> -->
                  </n-form-item>
                </div>
              </div>
            </div>
          </n-form>
          <div class="input-button" style="margin-left: 0;">
            <n-button
              style="border: 1px solid #A8A8A8;"
              size="small"
              :focusable="false"
              quaternary
              round
              class="button cancel-button"
              @click="closeconfiguration"
            >
              取消
            </n-button>
            <n-button
              size="small"
              color="#0647a1"
              :focusable="false"
              round
              class="button confirm-button"
              @click="deviceUpdate"
            >
              确认
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>


    <n-modal v-model:show="treeModel" class="modal-center" :mask-closable="false">
      <n-card
        style="width: 700px;height:502px; padding-right: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-center-title" style="margin-bottom: 25px; margin-left:-50px;">
          <span>点位选择</span>
        </div>
        <div class="server-model" style="margin-left: -150px">
          <n-form
            ref="formRef"
            class="authority-from"
            :model="configuratioData"
            :rules="rules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :style="{ maxWidth: '640px' }"
          >
            <n-input v-model:value="pattern" placeholder="搜索" style="width: 200px;  margin-left: 300px;" />
            <div>&nbsp;</div>
            <div class="tree-container">
              <n-tree
                :data="treeData"
                :show-irrelevant-nodes="showIrrelevantNodes"
                :default-checked-keys="defaultCheckedKeys"
                checkable
                :pattern="pattern"

                @update:checked-keys="handleCheckChange"
              />
            </div>
          </n-form>
          <div class="input-button" style="margin-left: 300px;">
            <n-button
              style="border: 1px solid #A8A8A8;"
              size="small"
              :focusable="false"
              quaternary
              round
              class="button cancel-button"
              @click="closetreeModel"
            >
              取消
            </n-button>
            <n-button
              size="small"
              color="#0647a1"
              :focusable="false"
              round
              class="button confirm-button"
              @click="treeSubmit"
            >
              确认
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>

    <n-modal v-model:show="devicelog" class="modal-center" :mask-closable="false">
      <n-card
        style="width: 1100px;height:750px; padding-right: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-center-title" style="margin-left:270px;margin-bottom: 40px;">
          <span>日志</span>
        </div>
        <div class="server-model" style="width:900px ;margin-left:200px">
          <n-data-table
            :remote="true"
            :columns="logcolumns"
            :data="RecordLog"
            :pagination="paginationSize"
            :bordered="false"
            @update:page="handlepage"
            @update:sorter="handlesort"
            @update:filters="handlefilters"
          >
            <template #empty>
              <div class="empty-data">
                <n-icon>
                  <IconNodata />
                </n-icon>
                <p>当前无数据显示</p>
              </div>
            </template>
          </n-data-table>
          <div class="input-button" style="margin-left: 0px;">
            <n-button
              style="border: 1px solid #A8A8A8;"
              size="small"
              :focusable="false"
              quaternary
              round
              class="button cancel-button"
              @click="closedevicelog"
            >
              取消
            </n-button>
            <n-button
              size="small"
              color="#0647a1"
              :focusable="false"
              round
              class="button confirm-button"
              @click="closedevicelog"
            >
              确认
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, ref, onMounted, reactive, computed, onUnmounted, watch, nextTick } from 'vue'
import { NButton, useMessage, useDialog, FormInst, TreeOption } from 'naive-ui'
import { deviceAllList, deviceEnumType, deviceAllAdd, deviceAllDel, deviceAllquery, deviceAllupdate, nodequery, queryStatus, reconnect, deviceTree, devicedownloadTpl, deviceimports, devicereload, deviceDelete, deviceModify, deviceinitial, nodeListquery, disconnect, deviceReconnect, deviceInitNode, deviceRecord } from '@/api/ic'
import { getProjectId } from '@/utils/token-util'
//import IcList from '@/views/screen-editor/config-panel/icevent-panel/ic-list.vue'
import {
  IconWarning,
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  // serverConfigBell,
  // serverConfigData,
  IconDeviceManagement,
  IcondevicePosition,
  IcondeviceDownloadTwo,
  IcondeviceDownload,
  IcondeviceLocation,
  IconLoad,
  IconNodata,
  IconConnectDefeated,
  IconConnecterror,
} from '@/icons'
export default defineComponent({
  name: 'MyScreen',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    // serverConfigBell,
    // serverConfigData,
    // IcList,
    // IconDeviceManagement,
    IcondevicePosition,
    IcondeviceDownloadTwo,
    IcondeviceDownload,
    //IcondeviceLocation,
    IconLoad,
    IconNodata,
    IconConnectDefeated,
    IconConnecterror,
  },
  setup() {
    const deviceAll = ref([])
    const RecordLog = ref([])
    const logcolumns = ref([])
    const nodeList = ref([])
    const columns = ref([])
    const deviceType = ref([])
    const showModal = ref(false)
    const seeModal = ref(false)
    const nDialog = useDialog()
    const message = useMessage()
    const devicename = ref('')
    const devicecode = ref('')
    const deviceShared = ref(null)
    const deviceSelf = ref(null)
    const nodeCode = ref('')
    const nodeName = ref('')
    const nodeShowName = ref('')
    const isEditingOpcUa = ref(false)
    const isSuccess = ref(null)
    const pollingInterval = ref(null)
    const isPolling = ref(false)
    const showNodeSearch = ref(false)
    const showNewButton = ref(true)
    const deviceTypeValue = ref('')
    const showPointLocation = ref(false)
    const selectedDeviceClz = ref('')
    const isNewAdded = ref(false)
    const configurationModel = ref(false)
    const treeModel = ref(false)
    const selectedDeviceName = ref('设备')
    const selectedDeviceCode = ref('')
    const treeData = ref<TreeOption[]>([])
    const defaultExpandedKeys = ref([])
    const defaultCheckedKeys = ref([])
    const showSecurityPolicyFields = ref(false)
    const nodeNamequery = ref('')
    const nodeCodeQuery = ref('')
    const devicelog = ref(false)
    const deviceRecordCode = ref('')
    const rootNode = ref({})
    const testButtonClicked = ref(false)
    const pattern = ref('')
    const closeconfiguration = () => {
      configurationModel.value = false
    }
    const closetreeModel = () => {
      pattern.value = ''
      treeModel.value = false
    }
    const closedevicelog = () => {
      RecordLog.value = []
      paginationSize.page = 1
      paginationSize.pageCount = 0
      paginationSize.itemCount = 0
      devicelog.value = false
    }
    const opendevicelog = () => {
      devicelog.value = true
    }
    const opentreeModel = async () => {
      treeData.value = []
      pattern.value = ''
      try {
        deviceTreeList(()=> treeModel.value = true)
        // const res = await deviceTree(selectedDeviceCode.value)
        //   if (res.data.code === 200) {
        //     treeModel.value = true
        //     await deviceTreeList()
        //   } else if (res.data.code === 500) {
        //     message.error('点位正在刷新，请稍后重试')
        //   } else {

      //     message.error('获取树数据失败，请重试')
      //   }
      } catch (error) {
        message.error('获取设备树数据时出错，请重试')
      }
    }

    //应用配置
    const deviceReload = async () => {
      try {
        const res = await devicereload(selectedDeviceCode.value)
        if (res.data.code === 200) {
          message.success('应用配置成功')
        } else {
          message.error('应用配置失败', res.data.msg)
        }
      } catch {
        message.error('应用配置时出错，请重试')
      }
    }
    const configuratioData = ref({
      isSubscribe: false,
      isPush: false,
      isSave: false,
      isPolling: false,
      samplingInterval: 0,
    })
    const securityPolicyOptions = ref([
      { label: 'None', value: 'None' },
      { label: 'Basic128Rsa15', value: 'Basic128Rsa15' },
      { label: 'Basic256', value: 'Basic256' },
      { label: 'Basic256Sha256', value: 'Basic256Sha256' },
      { label: 'Aes128_Sha256_RsaOaep', value: 'Aes128_Sha256_RsaOaep' },
      { label: 'Aes256_Sha256_RsaPss', value: 'Aes256_Sha256_RsaPss' },
    ])
    const deviceSharedOptions = ref([
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ])
    const deviceSelfOptions = ref([
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ])
    const deviceAllData = ref({
      id: '',
      projectId: '',
      ideProjectId: '',
      code: '',
      name: '',
      showName: '',
      description: '',
      clz: '',
      isActive: true,
      isShared: true,
      isRunning: null,
      isSelf: true,
      json: {
        endpoint: null,
        securityPolicy: null,
        username: null,
        password: null,
      },
    })
    const deviceconfigData = ref({
      id: '',
      nodeName: '',
      deviceCode: '',
      nodeCode: '',
      name: '',
      nodeShowName: '',
      description: '',
      samplingInterval: 0,
      isSubscribe: true,
      isPush: true,
      isSave: true,
      isRead: true,
      isPolling: true,
    })
    const formatTreeData = data => {
      // return data.map(item => ({
      //   key: item.id.toString(),
      //   label: item.name,
      //   parentId: item.parentId,
      //   hasChildrenFlag: item.hasChildrenFlag,
      //   checked: !!item.checked,
      //   opcNode: item.opcNode ?? null,
      //   total: item.total ?? 0,
      //   children: item.children ? formatTreeData(item.children) : [],
      //   isLeaf: item.children ? false : true,
      // }))

      return data.map(item => {
        let node:TreeOption =
        {
          key: `${item.id.toString()}||${treeDataIndex++}`,
          //key: `${item.id.toString()}`,
          nodeKey: item.id.toString(),
          label: item.name,
          parentId: item.parentId,
          hasChildrenFlag: item.hasChildrenFlag,
          checked: !!item.checked,
          opcNode: item.opcNode ?? null,
          total: item.total ?? 0,
          children: item.children ? formatTreeData(item.children) : null,
          isLeaf: !item.hasChildrenFlag,
        }
        return node
      })


    }

    let treeDataIndex = 0

    const deviceTreeList = async (onSuccess?: () => void) => {
      try {
        const res = await deviceTree(selectedDeviceCode.value)
        if (res.data.code === 200) {
          const rootData = res.data.data
          treeDataIndex = 0
          treeData.value = formatTreeData(res.data.data.children)
          console.log('treeData', treeData.value)
          if(onSuccess){
            onSuccess()
          }
          await nextTick()
          const defaultCheckedKeysList = []
          const collectCheckedKeys = (nodes:TreeOption[]) => {
            nodes.forEach(node => {
              if (node.checked) {
                defaultCheckedKeysList.push(node.key)
              }
              if (node.children && node.children.length > 0) {
                collectCheckedKeys(node.children)
              }
            })
          }
          collectCheckedKeys(treeData.value)
          defaultCheckedKeys.value = defaultCheckedKeysList
          rootNode.value = rootData
          console.log('defaultCheckedKeys.value', defaultCheckedKeys.value)
        } else {
          console.error('获取树数据失败:', res.data.message)
        }
      } catch (error) {
        console.error('获取设备树数据时出错:', error)
      }
    }

    const handleCheckChange = checkedKeys => {
      defaultCheckedKeys.value = checkedKeys
    }

    // const loadNode = async node => {
    //   if (node.children && node.children.length === 0 && node.hasChildrenFlag) {
    //     try {
    //       const res = await deviceTree(selectedDeviceCode.value)
    //       if (res.data.code === 200) {
    //         node.children = formatTreeData(res.data.data.children)
    //       } else {
    //         console.error('获取子节点数据失败:', res.data.message)
    //       }
    //     } catch (error) {
    //       console.error('获取子节点数据时出错:', error)
    //     }
    //   }
    // }


    const updateCheckStatus = (data, checkedKeys) => {
      return data.map(node => {
        node.checked = checkedKeys.includes(node.key)

        const updatedNode = {
          ...(node.key ? { id: node.key.split('||')[0] } : { id: node.id }),
          ...(node.label ? { name: node.label } : { name: node.name }),
          parentId: node.parentId,
          hasChildrenFlag: node.hasChildrenFlag,
          checked: node.checked,
          ...(node.opcNode ? { opcNode: node.opcNode } : { opcNode: node.opcNode }),
          ...(node.total ? { total: node.total } : { total: node.total }),
          children: node.children && node.children.length > 0 ? updateCheckStatus(node.children, checkedKeys) : [],
        }

        return updatedNode
      })
    }

    const treeSubmit = async () => {
      try {
        const updatedTreeData = updateCheckStatus(treeData.value, defaultCheckedKeys.value)
        const updatedRootData = {
          ...rootNode.value,
          children: updatedTreeData,
        }

        const res = await deviceinitial(selectedDeviceCode.value, updatedRootData)
        if (res.data.code === 200) {
          message.success('点位选择成功')
        } else {
          message.error('点位选择失败', res.data.msg)
        }
        treeModel.value = false
        refreshData()
      } catch (error) {
        console.error('提交树数据时出错:', error)
      }
    }


    const download = async () => {
      try {
        const res = await devicedownloadTpl()
        if (res.status === 200) {
          const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
          const blobUrl = window.URL.createObjectURL(blob)
          const exportFile = document.createElement('a')
          exportFile.style.display = 'none'
          exportFile.download = `设备节点导出模板`
          exportFile.href = blobUrl
          document.body.appendChild(exportFile)
          exportFile.click()
          document.body.removeChild(exportFile)
          window.URL.revokeObjectURL(blobUrl)
        } else {
          console.error('Failed to download the file:', res.statusText)
        }
      } catch (error) {
        console.error('Error downloading file:', error)
      }
    }


    const uploadFile = async file => {
      try {
        const formData = new FormData()
        formData.append('file', file.file.file)
        formData.append('deviceCode', selectedDeviceCode.value)

        // formData.forEach((value, key) => {
        //   console.log(key, value);
        // });

        const res = await deviceimports(formData)
        if (res.data.code === 200) {
          message.success(
            `文件导入成功。导入 ${res.data.data.dataCnt} 条点位数据，创建了 ${res.data.data.createCnt} 行数据。`,
          )
        } else {
          message.error(`文件上传失败: ${res.data.msg}`)
        }
      } catch (error) {
        message.error('Error during file upload:', error)
      }
    }


    const refreshData = async () => {
      try {
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await nodequery(projectIdNumber, selectedDeviceCode.value, pagination.page, pagination.pageSize)
        nodeList.value = res.data.data.records
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize)
        pagination.itemCount = res.data.data.total
        deviceAll.value = nodeList.value
        columns.value = createNodeColumns()
        showNodeSearch.value = true
        showNewButton.value = false
        if (nodeList.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page - 1
          await refreshData()
        }
      } catch (error) {
        console.error('Error fetching project data:', error)
        deviceAll.value = []
      }
    }

    const nodeListData = async page => {
      try {
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await nodeListquery(projectIdNumber, selectedDeviceCode.value, nodeNamequery.value, nodeCodeQuery.value, pagination.page, pagination.pageSize)

        nodeList.value = res.data.data.records
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize)
        pagination.itemCount = res.data.data.total
        deviceAll.value = nodeList.value
        columns.value = createNodeColumns()
        showNodeSearch.value = true
        showNewButton.value = false
      } catch (error) {
        console.error('Error fetching project data:', error)
        deviceAll.value = []
      }
    }

    const onClickName = async row => {
      isSelfZero.value = (row.isSelf === 0)
      const name = row.name ?? ''
      selectedDeviceName.value = name.length > 4 ? `${name.slice(0, 4)  }...` : name
      selectedDeviceCode.value = row.code
      selectedDeviceClz.value = row.clz
      showPointLocation.value = true
      try {
        pagination.page = 1
        columns.value = createNodeColumns()
        showNodeSearch.value = true
        showNewButton.value = false
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await nodequery(projectIdNumber, row.code, pagination.page, pagination.pageSize)
        nodeList.value = res.data.data.records
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize)
        pagination.itemCount = res.data.data.total
        deviceAll.value = nodeList.value

        deviceTreeList()
      } catch (error) {
        console.error('Error fetching project data:', error)
        deviceAll.value = []
      }
    }
    const isSelfZero = ref(false)

    const createColumns = () => {
      return columns.value = [
        {
          title: '设备名称',
          key: 'name',
          render(row) {
            return h('div', {
              style: {
                cursor: 'pointer',
              },
              onClick: () => onClickName(row),
            }, [
              h(IconDeviceManagement, { style: { marginRight: '25px' } }),
              h('span', row.name),
            ])
          },
        },
        {
          title: '设备代码',
          key: 'code',
        },
        {
          title: '显示名称',
          key: 'showName',
        },
        {
          title: '设备描述',
          key: 'description',
        },
        {
          title: '设备类型',
          key: 'clz',
        },
        {
          title: '是否共享',
          key: 'isShared',
          render(row) {
            const text = row.isShared === 1 ? '是' : '否'
            const color = row.isShared === 1 ? '#2885F0' : '#D03050'
            return h('span', { style: { color: color } }, text)
          },
        },
        {
          title: '运行状态',
          key: 'isRunning',
          render(row) {
            const text = row.isRunning === 1 ? '在线' : '离线'
            const color = row.isRunning === 1 ? '#2885F0' : '#D03050'; '#FF4646'
            return h('span', { style: { color: color } }, text)
          },
        },
        {
          title: '是否本项目',
          key: 'isSelf',
          render(row) {
            const text = row.isSelf === 1 ? '是' : '否'
            const color = row.isSelf === 1 ? '#2885F0' : '#D03050'
            return h('span', { style: { color: color } }, text)
          },
        },
        {
          title: '操作',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render(row) {
            const actionMap = {
              edit: { label: '编辑', color: '#1D9F3A', onClick: () => updateRow(row) },
              delete: { label: '删除', color: '#FF4646', onClick: () => deleteRow(row.id) },
              start: { label: '重连', color: '#0E62A9', onClick: () => reconnection(row) },
              stop: { label: '关闭', color: '#008AFF', onClick: () => breakConnect(row) },
              scan: { label: '扫描', color: '#0E62A9', onClick: () => scan(row) },
              see: { label: '查看', color: '#1D9F3A', onClick: () => seeRow(row) },
              refresh: { label: '日志', color: '#0E62A9', onClick: () => devicelogList(row) },
            }

            let actions = []
            if (row.isSelf === 0) {
              actions = ['see'].map(key => actionMap[key])
            } else if (row.clz === 'OpcUa') {
              actions = ['edit', 'delete', 'start', 'stop', 'scan', 'refresh'].map(key => actionMap[key])
            } else if (row.clz === 'WebSocket') {
              actions = ['see'].map(key => actionMap[key])
            }

            return h('div', { class: 'action-buttons' }, actions.map((action, index) => {
              return h('span', {
                class: `action-button ${index < actions.length - 1 ? 'margin-right' : ''}`,
                style: { cursor: 'pointer', color: action.color, marginRight: index < actions.length - 1 ? '36px' : '0' },
                onClick: action.onClick,
              }, action.label)
            }))
          },
        },
      ]
    }

    const createNodeColumns = () => {
      return [
        {
          title: '点位名称',
          key: 'nodeName',
          render(row) {
            return h('div', {
              style: {
                alignItems: 'center',
              },
            }, [
              h(IcondeviceLocation, {
                class: 'icon-style',
                style: { marginRight: '25px' },
              }),
              h('span', row.nodeName),
            ])
          },
        },
        {
          title: '设备代码',
          key: 'deviceCode',

        },
        {
          title: '点位代码',
          key: 'nodeCode',
        },

        {
          title: '点位显示名称',
          key: 'nodeShowName',
        },
        {
          title: '是否订阅',
          key: 'isSubscribe',
          render(row) {
            const text = row.isSubscribe === 1 ? '是' : '否'
            const color = row.isSubscribe === 1 ? '#2885F0' : '#D03050'
            return h('span', { style: { color: color } }, text)
          },
        },
        {
          title: '是否推送',
          key: 'isPush',
          render(row) {
            const text = row.isPush === 1 ? '是' : '否'
            const color = row.isPush === 1 ? '#2885F0' : '#D03050'
            return h('span', { style: { color: color } }, text)
          },
        },
        {
          title: '是否记录',
          key: 'isSave',
          render(row) {
            const text = row.isSave === 1 ? '是' : '否'
            const color = row.isSave === 1 ? '#2885F0' : '#D03050'
            return h('span', { style: { color: color } }, text)
          },
        },
        {
          title: '操作',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: computed(() => row => {
            if (isSelfZero.value) {
              return h('div', [
                h('span', {
                  style: {
                    cursor: 'pointer',
                    color: '#D3D3D3',
                    fontSize: '18px',
                  },
                  onClick: () => deviceDel(row),
                }, '无'),
              ])
            }
            if (row.isSelf === 0) {
              return null
            }
            return h('div', [
              h('span', {
                style: {
                  cursor: 'pointer',
                  color: '#1D9F3A',
                  fontSize: '18px',
                  textAlign: 'left',
                },
                onClick: () => configuration(row),
              }, '配置'),
              h('span', {
                style: {
                  cursor: 'pointer',
                  color: '#FF4646',
                  fontSize: '18px',
                  marginLeft: '36px',
                },
                onClick: () => deviceDel(row),
              }, '删除'),
            ])
          }),
        },
      ]
    }
    const deviceLogColumns = () => {
      return logcolumns.value = [
        {
          title: '内容',
          key: 'content',
          render(row) {
            return h('span', row.content)
          },
        },
        {
          title: '设备代码',
          key: 'deviceCode',
          render(row) {
            return h('span', row.deviceCode)
          },
        },
        {
          title: '日志类型',
          key: 'logType',
          render(row) {
            const logTypeMap = {
              0: '信息',
              1: '警告',
              2: '错误',
            }
            const logTypeColorMap = {
              0: '#1D9F3A',
              1: '#FF9900',
              2: '#FF4646',
            }
            return h('span', { style: { color: logTypeColorMap[row.logType] } }, logTypeMap[row.logType])
          },
        },
        {
          title: '操作时间',
          key: 'opTime',
          render(row) {
            const date = new Date(row.opTime)
            const formattedDate = date.toLocaleString()
            return h('span', formattedDate)
          },
        },
        {
          title: '操作',
          key: 'operation',
          render(row) {
            return h('span', row.operation)
          },
        },
      ]
    }
    const breakConnect = async row => {
      try {
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await disconnect(
          projectIdNumber,
          row.code,
        )
        if (res.data.code === 200) {
          message.success('关闭成功')
          fetchProjects()
        } else {
          message.error('关闭失败')
        }
      } catch (error) {
        console.error('Error:', error)
        message.error('操作失败')
      }
    }
    const reconnection = async row => {
      try {
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await deviceReconnect(
          projectIdNumber,
          row.code,
        )
        if (res.data.code === 200) {
          message.success('重连成功')
          fetchProjects()
        } else {
          message.error('重连失败')
        }
      } catch (error) {
        console.error('Error:', error)
        message.error('操作失败')
      }
    }
    const scan = async row => {
      try {
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await deviceInitNode(
          projectIdNumber,
          row.code,
        )
        if (res.data.code === 200) {
          message.success('扫描成功')
          fetchProjects()
        } else {
          message.error('扫描失败')
        }
      } catch (error) {
        console.error('Error:', error)
        message.error('操作失败')
      }
    }
    const devicelogList = async row => {
      opendevicelog()
      deviceRecordCode.value = row.code
      deviceRecordList()

    }
    const deviceRecordList = async () => {
      try {
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await deviceRecord(
          projectIdNumber,
          deviceRecordCode.value,
          paginationSize.page, paginationSize.pageSize,
        )
        RecordLog.value = res.data.data.records
        paginationSize.pageCount = Math.ceil(res.data.data.total / paginationSize.pageSize)
        paginationSize.itemCount = res.data.data.total
        deviceLogColumns()
      } catch (error) {
        console.error('Error:', error)
        message.error('操作失败')
      }
    }


    const configuration = row => {
      configurationModel.value = true
      deviceconfigData.value = {
        ...row,
        isSubscribe: row.isSubscribe === 1,
        isPush: row.isPush === 1,
        isSave: row.isSave === 1,
        isRead: row.isRead === 1,
        isPolling: row.isPolling === 1,
      }
    }
    const deviceUpdate = () => {
      formRef.value?.validate(errors => {
        if (!errors) {
          updateconfig()
        } else {
          message.error('请填写必填项')
        }
      })
    }
    const updateconfig = async () => {
      try {
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        console.log(deviceconfigData.value.samplingInterval)

        const res = await deviceModify(
          projectIdNumber,
          deviceconfigData.value.id,
          deviceconfigData.value.deviceCode,
          deviceconfigData.value.nodeCode,
          deviceconfigData.value.nodeName,
          deviceconfigData.value.name,
          deviceconfigData.value.nodeShowName,
          deviceconfigData.value.description,
          deviceconfigData.value.samplingInterval,
          deviceconfigData.value.isSubscribe ? 1 : 0,
          deviceconfigData.value.isPush ? 1 : 0,
          deviceconfigData.value.isSave ? 1 : 0,
          deviceconfigData.value.isRead ? 1 : 0,
          deviceconfigData.value.isPolling ? 1 : 0,
        )
        console.log(deviceconfigData.value.samplingInterval)

        console.log(res)

        if (res.data.code === 200) {
          message.success('编辑成功')
          closeconfiguration()
          refreshData() // 调用刷新数据的方法
        } else {
          let errorMessage = '编辑失败'
          errorMessage = res.data.msg || '未知错误'
          message.error(errorMessage)
        }
      } catch (error) {
        console.error('Error updating alarm rule:', error)
        message.error('编辑配置时出错')
      }
    }


    const closeLoading = () => {
      showSecurityPolicyFields.value = false
      deviceTypeValue.value = ''
      deviceAllData.value.clz = ''
      isSuccess.value = null
      testButtonClicked.value = false
      deviceAllData.value.json = {
        endpoint: null,
        securityPolicy: null,
        username: null,
        password: null,
      }
      showModal.value = false
      seeModal.value = false
      deviceAllData.value = {
        id: '',
        projectId: '',
        ideProjectId: '',
        code: '',
        name: '',
        showName: '',
        description: '',
        clz: '',
        isActive: true,
        isShared: true,
        isRunning: true,
        isSelf: true,
        json: {
          endpoint: null,
          securityPolicy: null,
          username: null,
          password: null,
        },
      }
    }
    const deviceDel = async row => {
      try {
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
              const projectIdString = getProjectId()
              const projectIdNumber = Number(projectIdString)
              const res = await deviceDelete(projectIdNumber,row.id)
              if (res.data.code === 200) {
                message.success('已成功删除')
                fetchProjects()
              } else {
                message.error(res.data.msg)
              }
              refreshData()
            } catch (error) {
              message.error(error.message)
            }
          },
        })
      } catch (error) {
        console.error('Error deleting device:', error)
      }
    }
    const fetchProjects = async () => {
      try {
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await deviceAllList(projectIdNumber, pagination.page, pagination.pageSize)
        deviceAll.value = res.data.data.records
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize)
        pagination.itemCount = res.data.data.total
        createColumns()
        if (deviceAll.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page - 1
          await fetchProjects()
        }
      } catch (error) {
        console.error('Error fetching project data:', error)
      }
    }
    const deviceSearch = async page => {
      try {
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await deviceAllquery(
          projectIdNumber,
          devicename.value,
          devicecode.value,
          deviceShared.value,
          deviceSelf.value,
          pagination.page,
          pagination.pageSize)
        deviceAll.value = res.data.data.records
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize)
        pagination.itemCount = res.data.data.total
        if (deviceAll.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page - 1
          await fetchProjects()
        }
      } catch (error) {
        console.error('Error fetching project data:', error)
      }
    }

    const handleDeviceTypeChange = newType => {
      deviceTypeValue.value = newType
      deviceAllData.value.json = {
        endpoint: null,
        securityPolicy: null,
        username: null,
        password: null,
      }
      showSecurityPolicyFields.value = newType === 'OpcUa'
    }
    const deleteRow = id => {
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
            const projectIdString = getProjectId()
            const projectIdNumber = Number(projectIdString)
            const res = await deviceAllDel(projectIdNumber, id)
            if (res.data.code === 200) {
              message.success('已成功删除')
              closeLoading()
              fetchProjects()
            } else {
              message.error(res.data.msg)
            }
            fetchProjects()
          } catch (error) {
            message.error(error.message)
          }
        },
      })
    }

    const updateRow = row => {
      const jsonConfig = row.json ? JSON.parse(row.json) : {}
      deviceAllData.value = { ...row, isShared: row.isShared === 1, isActive: row.isActive === 1, json: jsonConfig }
      showModal.value = true
      if (row.clz === 'OpcUa') {
        isEditingOpcUa.value = true
      } else {
        isEditingOpcUa.value = false
      }
    }

    const seeRow = row => {
      const jsonConfig = row.json ? JSON.parse(row.json) : {
        endpoint: null,
        securityPolicy: null,
        username: null,
        password: null,
      }
      deviceAllData.value = {
        ...row,
        isShared: row.isShared === 1,
        isActive: row.isActive === 1,

        json: jsonConfig,
      }
      seeModal.value = true
    }
    const deviceTypeList = async () => {
      try {
        const res = await deviceEnumType()
        deviceType.value = res.data.data.records
        createColumns()
      } catch (error) {
        console.error('Error fetching project data:', error)
      }
    }
    const deviceTypeOptions = computed(() => {
      return deviceType.value.map(m => ({ value: m.clz, label: m.clz }))
    })

    const add = async () => {
      try {
        if (!deviceAllData.value.showName) {
          deviceAllData.value.showName = deviceAllData.value.name
        }
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await deviceAllAdd(
          projectIdNumber,
          deviceAllData.value.code,
          deviceAllData.value.name,
          deviceAllData.value.showName,
          deviceAllData.value.description,
          deviceAllData.value.clz,
          deviceAllData.value.json,
          deviceAllData.value.isActive ? 1 : 0,
          deviceAllData.value.isShared ? 1 : 0,
        )

        if (res.data.code === 200) {
          message.success('新增成功')
          closeLoading()
          fetchProjects()
          isNewAdded.value = true
        } else {
          let errorMessage = '新增失败'
          if (res.data.msg.includes('设备编码')) {
            errorMessage = `设备代码已存在!`
          } else if (res.data.msg.includes('设备名称')) {
            errorMessage = `设备名称已存在!`
          } else if (res.data.msg.includes('设备显示名称')) {
            errorMessage = `设备显示名称已存在!`
          } else {
            errorMessage = res.data.msg || '未知错误'
          }
          message.error(errorMessage)
        }
      } catch (error) {
        console.error('Error:', error)
        message.error('操作失败')
      }
      resetForm()
    }

    const update = async () => {
      try {
        if (!deviceAllData.value.showName) {
          deviceAllData.value.showName = deviceAllData.value.name
        }
        const projectIdString = getProjectId()
        const projectIdNumber = Number(projectIdString)
        const res = await deviceAllupdate(
          projectIdNumber,
          deviceAllData.value.id,
          deviceAllData.value.code,
          deviceAllData.value.name,
          deviceAllData.value.showName,
          deviceAllData.value.description,
          deviceAllData.value.clz,
          deviceAllData.value.json,
          deviceAllData.value.isActive ? 1 : 0,
          deviceAllData.value.isShared ? 1 : 0,
        )

        if (res.data.code === 200) {
          message.success('编辑成功')
          closeLoading()
          fetchProjects()
        } else {
          let errorMessage = '编辑失败'
          if (res.data.msg.includes('设备编码')) {
            errorMessage = `设备编码已存在!`
          } else if (res.data.msg.includes('设备名称')) {
            errorMessage = `设备名称已存在!`
          } else if (res.data.msg.includes('设备显示名称')) {
            errorMessage = `设备显示名称已存在!`
          } else {
            errorMessage = res.data.msg || '未知错误'
          }
          message.error(errorMessage)
        }
      } catch (error) {
        console.error('Error:', error)
        message.error('操作失败')
      }
    }
    const rule = reactive({
      nodeName: {
        required: true,
        trigger: 'blur',
        message: '请输入点位名称',
      },
      name: {
        required: true,
        trigger: 'blur',
        message: '请输入名称',
      },
      nodeShowName: {
        required: true,
        trigger: 'blur',
        message: '请输入点位显示名称',
      },
      description: {
        required: true,
        trigger: 'blur',
        message: '请输入描述',
      },
      samplingInterval: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: '请输入采样间隔',
      },

    })
    const rules = reactive({
      code: {
        required: true,
        trigger: 'blur',
        message: '请输入设备代码',
      },
      name: {
        required: true,
        trigger: 'blur',
        message: '请输入设备名称',
      },
      clz: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择设备类型',
      },
      'json.endpoint': {
        required: true,
        trigger: 'blur',
        validator: (_, value) => {
          if (!['OpcUa', 'WebSocket'].includes(deviceAllData.value.clz) || value) {
            return true
          }
          return Promise.reject(new Error('请输入设备地址'))
        },
      },
    })
    const formRef = ref<FormInst | null>(null)

    const ServerAdd = () => {
      formRef.value?.validate(errors => {
        if (!errors) {
          add()
        } else {
          message.error('请填写必填项')
        }
      })
    }


    const queryStatusList = async () => {
      try {
        const res = await queryStatus(deviceAllData.value.code)
        const status = res.data.data.isSuccess
        isSuccess.value = status
        if (status !== -1) {
          clearInterval(pollingInterval.value)
          isPolling.value = false
          if (status === 0) {
          } else if (status === 1) {
            isNewAdded.value = true
          }
        }
      } catch (error) {
        console.error('查询状态失败:', error)
        clearInterval(pollingInterval.value)
        isPolling.value = false
        message.error('查询状态失败')
      }
    }

    const startPolling = async () => {
      if (isPolling.value) return
      isPolling.value = true
      pollingInterval.value = setInterval(queryStatusList, 500)
    }

    const statusList = async () => {
      try {
        try {
          if (deviceAllData.value.id) {
            if (!deviceAllData.value.showName) {
              deviceAllData.value.showName = deviceAllData.value.name
            }
            const projectIdString = getProjectId()
            const projectIdNumber = Number(projectIdString)
            const res = await deviceAllupdate(
              projectIdNumber,
              deviceAllData.value.id,
              deviceAllData.value.code,
              deviceAllData.value.name,
              deviceAllData.value.showName,
              deviceAllData.value.description,
              deviceAllData.value.clz,
              deviceAllData.value.json,
              deviceAllData.value.isActive ? 1 : 0,
              deviceAllData.value.isShared ? 1 : 0,
            )
            if (res.data.code === 200) {
              fetchProjects()
            } else {
              let errorMessage = '编辑失败'
              if (res.data.msg.includes('设备编码')) {
                errorMessage = `设备编码已存在!`
              } else if (res.data.msg.includes('设备名称')) {
                errorMessage = `设备名称已存在!`
              } else if (res.data.msg.includes('设备显示名称')) {
                errorMessage = `设备显示名称已存在!`
              } else {
                errorMessage = res.data.msg || '未知错误'
              }
              message.error(errorMessage)
            }
          } else {
            if (!deviceAllData.value.showName) {
              deviceAllData.value.showName = deviceAllData.value.name
            }
            const projectIdString = getProjectId()
            const projectIdNumber = Number(projectIdString)
            const res = await deviceAllAdd(
              projectIdNumber,
              deviceAllData.value.code,
              deviceAllData.value.name,
              deviceAllData.value.showName,
              deviceAllData.value.description,
              deviceAllData.value.clz,
              deviceAllData.value.json,
              deviceAllData.value.isActive ? 1 : 0,
              deviceAllData.value.isShared ? 1 : 0,
            )
            if (res.data.code === 200) {
              fetchProjects()
            } else {
              let errorMessage = '保存失败'
              if (res.data.msg.includes('设备编码')) {
                errorMessage = `设备编码已存在!`
              } else if (res.data.msg.includes('设备名称')) {
                errorMessage = `设备名称已存在!`
              } else if (res.data.msg.includes('设备显示名称')) {
                errorMessage = `设备显示名称已存在!`
              } else {
                errorMessage = res.data.msg || '未知错误'
              }
              message.error(errorMessage)
            }
          }
          ReconnectList()
          startPolling()
        } catch (error) {
        }
      } catch (error) {
        console.error('添加或重连失败:', error)
        message.error('操作失败')
      }
    }
    const ReconnectList = async () => {
      const res = await reconnect(deviceAllData.value.code)
      console.log('重连成功')
    }
    const statusQuery = () => {
      formRef.value?.validate(errors => {
        if (!errors) {
          isSuccess.value = -1
          testButtonClicked.value = true
          statusList()
        } else {
          message.error('请填写必填项')
        }
      })
    }
    const ServerUpdate = () => {
      formRef.value?.validate(errors => {
        if (!errors) {
          update()
        } else {
          message.error('请填写必填项')
        }
      })
    }
    const confirmAction = () => {
      if (deviceAllData.value.id) {
        if (testButtonClicked.value = true) {
          ReconnectList()
          ServerUpdate()
        }
      } else if (!isNewAdded.value) {
        if (testButtonClicked.value = true) {
          // ReconnectList();
          ServerAdd()
        }
      } else {
        closeLoading()
      }

      resetForm()
    }

    const resetForm = () => {
      isNewAdded.value = false
      if (deviceAllData.value.clz !== 'OpcUa') {
        showSecurityPolicyFields.value = false
        isEditingOpcUa.value = false
      }

    }
    const resetToInitialState = () => {
      selectedDeviceName.value = '设备'
      selectedDeviceClz.value = ''
      showPointLocation.value = false
      showNodeSearch.value = false
      showNewButton.value = true
      pagination.page = 1
      fetchProjects()
    }
    const pagination = reactive({
      page: 1,
      pageCount: 0,
      pageSize: 8,
      itemCount: 0,
      prefix({ itemCount }) {
        return `共 ${itemCount} 条`
      },
    })
    const searchNodeList = ref(false)
    const deviceNodeLIst = ref(false)
    const handleSorterChange = sorter => {
      pagination.page = 1
      if (deviceAll.value === nodeList.value) {
        refreshData()
      } else {
        fetchProjects()
      }
    }

    const handleFiltersChange = filters => {
      pagination.page = 1
      if (deviceAll.value === nodeList.value) {
        refreshData()
      } else {
        fetchProjects()
      }
    }

    const handlePageChange = async page => {
      pagination.page = page
      if (deviceAll.value === nodeList.value) {
        if (searchNodeList.value) {
          nodeListData(page)
        } else {
          refreshData()
        }
      } else {
        if (deviceNodeLIst.value) {
          deviceSearch(page)
        }
        else {
          fetchProjects()
        }
      }
    }
    const triggerSearch = () => {
      deviceNodeLIst.value = true
      pagination.page = 1
      deviceSearch(pagination.page)
    }
    const nodeListDataSearch = () => {
      searchNodeList.value = true
      pagination.page = 1
      nodeListData(pagination.page)
    }
    const paginationSize = reactive({
      page: 1,
      pageCount: 0,
      pageSize: 8,
      itemCount: 0,
      prefix({ itemCount }) {
        return `共 ${itemCount} 条`
      },
    })
    const handlesort = () => {
      paginationSize.page = 1
      deviceRecordList()
    }
    const handlefilters = () => {
      paginationSize.page = 1
      deviceRecordList()
    }
    const handlepage = currentPage => {
      paginationSize.page = currentPage
      deviceRecordList()
    }
    const Eliminate = () => {
      devicename.value = null
      devicecode.value = null
      deviceShared.value = null
      deviceSelf.value = null
      nodeCode.value = null
      nodeName.value = null
      nodeNamequery.value = null
      nodeCodeQuery.value = null
      deviceNodeLIst.value = false
      searchNodeList.value = false
      if (deviceAll.value === nodeList.value) {
        refreshData()
      } else {
        fetchProjects()
      }
    }
    const getModalHeight = computed(() => {
      switch (deviceTypeValue.value || deviceAllData.value.clz) {
        case 'OpcUa':
          return 850
        case 'WebSocket':
          return 700
        default:
          return 650
      }
    })

    onMounted(() => {
      fetchProjects()
      deviceTypeList()
    })
    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
      }
    })
    return {
      deviceAll,
      handlesort,
      handlefilters,
      handlepage,
      columns,
      pagination,
      devicename,
      showModal,
      seeModal,
      devicecode,
      deviceAllData,
      rules,
      rule,
      formRef,
      securityPolicyOptions,
      deviceShared,
      deviceSelf,
      deviceSharedOptions,
      deviceSelfOptions,
      updateRow,
      triggerSearch,
      confirmAction,
      closeLoading,
      handleSorterChange,
      handleFiltersChange,
      handlePageChange,
      Eliminate,
      deviceTypeOptions,
      seeRow,
      selectedDeviceName,
      showPointLocation,
      selectedDeviceClz,
      deviceTypeValue,
      handleDeviceTypeChange,
      showSecurityPolicyFields,
      getModalHeight,
      showNodeSearch,
      nodeName,
      nodeCode,
      showNewButton,
      nodeShowName,
      statusQuery,
      isSuccess,
      isEditingOpcUa,
      resetToInitialState,
      configurationModel,
      configuratioData,
      closeconfiguration,
      treeModel,
      closetreeModel,
      opentreeModel,
      treeData,
      download,
      deviceReload,
      deviceconfigData,
      deviceUpdate,
      defaultCheckedKeys,
      treeSubmit,
      handleCheckChange,
      uploadFile,
      nodeListDataSearch,
      nodeNamequery,
      nodeCodeQuery,
      devicelog,
      closedevicelog,
      RecordLog,
      logcolumns,
      paginationSize,
      defaultExpandedKeys,
      pattern,
      //loadNode,
      showIrrelevantNodes: ref(false),
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/main-content.scss';

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

.device-span span {
  color: #0E62A9;
  font-size: 18px;
  display: flex;
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

.n-radio .n-radio-inner {
  display: none;
}


.n-radio .n-radio-label {
  display: flex;
  align-items: center;
}

.n-radio .n-checkbox {
  margin-right: 8px;
}

.device-checkbox {
  margin-left: -20px
}

.tree-container {
  max-height: 250px;
  height: 250px;
  overflow-y: auto;
  margin-left: 300px;
}

.button-container {
  display: flex;
  gap: 5px;
}

:deep(.icon-style) {
  svg {
    margin-top: '20px'
  }
}

</style>
