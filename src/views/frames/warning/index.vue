<template>
  <div>
    <div>
      <div class="Server-content">
        <span>报警规则</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div class="Server-search-left">
            <label>点位名称</label>
            <input
              v-model="nodeCode"
              type="text"
              class="device-input"
              placeholder=""
            >
            <label>严重度</label>
            <div class="dev-input">
              <n-select v-model:value="severityD" :options="severityOptions" placeholder="请选择严重度" />
            </div>
            <label>是否共享</label>
            <div class="dev-input">
              <n-select v-model:value="deviceShared" :options="deviceSharedOptions" />
            </div>
            <label>是否本项目</label>
            <div class="dev-input">
              <n-select v-model:value="deviceSelf" :options="deviceSelfOptions" />
            </div>
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A" @click="handleSearchButtonClick">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span>
            </n-button>
            <n-button tertiary class="Server-button button-reset" @click="Eliminate">
              <n-icon>
                <IconServerReset />
              </n-icon>
              <span class="button-reset-span">
                重置
              </span>
            </n-button>
            <n-button class="Server-button button-add" color="#0E62A9" @click="showModal = true">
              <n-icon>
                <IconServerAdd />
              </n-icon><span>新建</span>
            </n-button>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table
            :remote="true"
            :columns="columns"
            :data="alarmRule"
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
    <!-- 新增 修改 -->
    <n-modal v-model:show="showModal" style="width: 1000px;" :mask-closable="false">
      <n-card
        style="width: 900px;height:800px; padding-right: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-center-title" style="margin-bottom: 25px;">
          <span>{{ alarmRuleData.id ? '编辑报警规则' : '新增报警规则' }}</span>
        </div>
        <div class="server-model">
          <n-form
            ref="formRef"
            class="authority-from"
            :model="alarmRuleData"
            :rules="rules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :style="{
              maxWidth: '640px'
            }"
          >
            <div class="input-group">
              <n-form-item
                style="font-size: 20px;"
                :span="200"
                label="点位"
                path="nodeCode"
              >
                <div class="warning-input" style="display:flex;">
                  <n-input
                    v-model:value="alarmRuleData.nodeCode"
                    style="width: 470px;"
                    placeholder=""
                    readonly="readonly"
                    :rules="{ required: true, message: '点位不能为空' }"
                  />
                  <n-button
                    style="margin-left:10px;"
                    type="primary"
                    size="small"
                    ghost
                    @click="openIcList()"
                  >
                    点位
                  </n-button>
                </div>
              </n-form-item>
              <n-form-item :span="200" label="描述" path="name">
                <div class="warning-input">
                  <n-input v-model:value="alarmRuleData.name" placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="严重度" path="severity">
                <div class="warning-input">
                  <n-select v-model:value="alarmRuleData.severity" :options="severityOptions" placeholder="请选择严重度" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="时间间隔(秒)" path="interval">
                <n-input-number v-model:value="alarmRuleData.interval" :min="0" :max="9999" />
              </n-form-item>
              <n-form-item :span="200" label="优先级" path="priority">
                <n-input-number
                  v-model:value="alarmRuleData.priority"
                  :min="1"
                  :max="5"
                  placeholder=""
                />
              </n-form-item>
              <div style="margin-left: 245px;">1最小 5最大</div>
              <div class="waring-label" style="margin-left: 120px">
                <n-form-item>
                  <div class="warning-checkbox">
                    <label>共享</label>
                    <n-checkbox v-model:checked="alarmRuleData.isShare" />
                  </div>
                  <div class="warning-checkbox1">
                    <label>启动规则</label>
                    <n-checkbox v-model:checked="alarmRuleData.enabled" />
                  </div>
                </n-form-item>
              </div>
              <n-form-item :span="200" label="解决方式" path="resolveType">
                <div class="warning-input">
                  <n-select v-model:value="alarmRuleData.resolveType" :options="resolveTypeOptions" placeholder="" />
                </div>
              </n-form-item>
              <div class="waring-select">
                <n-form-item label="规则1" path="ruleDetail.operator1" :show-feedback="false">
                  <n-grid :cols="2" :x-gap="24">
                    <n-form-item-gi>
                      <div class="waring-form-ai">
                        <n-select
                          v-model:value="alarmRuleData.ruleDetail.operator1"
                          :options="operatorOptions"
                          placeholder="请选择规则"
                        />
                      </div>
                    </n-form-item-gi>
                    <n-form-item-gi path="ruleDetail.value1">
                      <div class="waring-form-content">
                        <label v-if="showValue1">值1</label>
                        <n-input-number
                          v-if="numberboxEnabled && showValue1"
                          v-model:value="alarmRuleData.ruleDetail.value1"
                          :min="0"
                          :max="10000"
                          placeholder=""
                        />
                        <n-input v-if="textboxEnabled && showValue1" v-model:value="alarmRuleData.ruleDetail.value1" />
                      </div>
                    </n-form-item-gi>
                  </n-grid>
                </n-form-item>
              </div>
              <div class="waring-select">
                <n-form-item label="规则2" :show-feedback="false">
                  <n-grid :cols="2" :x-gap="24">
                    <n-form-item-gi path="ruleDetail.operator2">
                      <div class="waring-form-ai">
                        <n-select
                          v-model:value="alarmRuleData.ruleDetail.operator2"
                          :options="operatorOptions"
                          placeholder="请选择规则"
                          clearable
                        />
                      </div>
                    </n-form-item-gi>
                    <n-form-item-gi path="ruleDetail.value2">
                      <div class="waring-form-content">
                        <label v-if="showValue2">值2</label>
                        <n-input-number
                          v-if="numberboxEnabled && showValue2"
                          v-model:value="alarmRuleData.ruleDetail.value2"
                          :min="0"
                          :max="9999"
                        />
                        <n-input v-if="textboxEnabled && showValue2" v-model:value="alarmRuleData.ruleDetail.value2" />
                      </div>
                    </n-form-item-gi>
                  </n-grid>
                </n-form-item>
              </div>
            </div>
          </n-form>
          <div class="input-button" style="margin-left:200px;">
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
      </n-card>
    </n-modal>
    <!-- 查看  -->
    <n-modal v-model:show="seeModal" class="modal-center" :mask-closable="false">
      <n-card
        style="width: 900px;height:800px; padding-right:  150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-center-title">
          <span>查看报警规则</span>
        </div>
        <div class="server-model">
          <n-form
            ref="formRef"
            class="authority-from"
            :model="alarmRuleData"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            :style="{
              maxWidth: '640px'
            }"
          >
            <div class="input-group">
              <n-form-item
                style="font-size: 20px;"
                :span="200"
                label="点位"
                path="nodeCode"
              >
                <div class="warning-input">
                  <n-input v-model:value="alarmRuleData.nodeCode" readonly placeholder="请选择" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="描述" path="name">
                <div class="warning-input">
                  <n-input v-model:value="alarmRuleData.name" readonly placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="严重度" path="severity">
                <div class="warning-input">
                  <n-input v-model:value="alarmRuleData.severity" readonly placeholder="请选择严重度" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="时间间隔(秒)" path="interval">
                <div class="warning-input">
                  <n-input v-model:value="alarmRuleData.interval" readonly placeholder="" />
                </div>
              </n-form-item>
              <n-form-item :span="200" label="优先级" path="priority">
                <div class="warning-input">
                  <n-input v-model:value="alarmRuleData.priority" readonly placeholder="" />
                </div>
              </n-form-item>
              <div class="waring-label" style="margin-left: 120px">
                <n-form-item>
                  <div class="warning-checkbox">
                    <label>共享</label>
                    <n-checkbox v-model:checked="alarmRuleData.isShare" class="disabled-checkbox" disabled />
                  </div>
                  <div class="warning-checkbox1">
                    <label>启动规则</label>
                    <n-checkbox v-model:checked="alarmRuleData.enabled" class="disabled-checkbox" disabled />
                  </div>
                </n-form-item>
              </div>
              <n-form-item :span="200" label="解决方式" path="resolveType">
                <div class="warning-input">
                  <n-input v-model:value="alarmRuleData.resolveType" readonly placeholder="" />
                </div>
              </n-form-item>
              <div class="waring-select">
                <n-form-item label="规则1" path="ruleDetail.operator1" :show-feedback="false">
                  <n-grid :cols="2" :x-gap="24">
                    <n-form-item-gi>
                      <div class="waring-form-ai" style="width:200px">
                        <n-select
                          v-model:value="alarmRuleData.ruleDetail.operator1"
                          disabled
                          :options="operatorOptions"
                          placeholder="请选择规则"
                        />
                      </div>
                    </n-form-item-gi>
                    <n-form-item-gi path="ruleDetail.value1">
                      <div class="waring-form-content">
                        <label>值1</label>
                        <n-input v-model:value="alarmRuleData.ruleDetail.value1" readonly placeholder="" />
                      </div>
                    </n-form-item-gi>
                  </n-grid>
                </n-form-item>
              </div>
              <div class="waring-select">
                <n-form-item label="规则2" :show-feedback="false">
                  <n-grid :cols="2" :x-gap="24">
                    <n-form-item-gi path="ruleDetail.operator2">
                      <div class="waring-form-ai" style="width:200px">
                        <n-select
                          v-model:value="alarmRuleData.ruleDetail.operator2"
                          disabled
                          :options="operatorOptions"
                          placeholder="请选择规则"
                        />
                      </div>
                    </n-form-item-gi>
                    <n-form-item-gi path="ruleDetail.value2">
                      <div class="waring-form-content">
                        <label>值2</label>
                        <n-input v-model:value="alarmRuleData.ruleDetail.value2" readonly placeholder="" />
                      </div>
                    </n-form-item-gi>
                  </n-grid>
                </n-form-item>
              </div>
            </div>
          </n-form>
          <div class="input-button">
            <n-button
              style="border: 1px solid #A8A8A8;"
              size="small"
              :focusable="false"
              quaternary
              round
              class="button cancel-button"
              @click="seeClose"
            >
              关闭
            </n-button>
            <n-button
              size="small"
              color="#0647a1"
              :focusable="false"
              round
              class="button confirm-button"
              @click="seeClose"
            >
              确认
            </n-button>
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
import { alarmRuleList, enumQuery, alarmRuleAdd, alarmRuleDel, alarmRuleUpdate, alarmRulequery } from '@/api/ic'
import { getProjectId } from '@/utils/token-util'
import IcList from '@/views/screen-editor/config-panel/icevent-panel/ic-list.vue'
import { IcHandleItemField, PtModel } from '@/components/data-handle'
import {
  IconWarning,
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  // serverConfigBell,
  // serverConfigData,
  IconNodata,
} from '@/icons'

import { convertNodeTypeToDataType, NodeDataType } from '@/utils/threed-node'

export default defineComponent({
  name: 'MyScreen',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    // serverConfigBell,
    // serverConfigData,
    IcList,
    IconNodata,
  },
  setup() {
    const alarmRule = ref([])
    const columns = ref([])
    const showModal = ref(false)
    const message = useMessage()
    const severity = ref([])
    //const operator = ref([])
    const resolveType = ref([])
    const ruleType = ref([])
    const nDialog = useDialog()
    const nodeCode = ref('')
    const severityD = ref(null)
    const seeModal = ref(false)
    const isSearching = ref(false)
    const deviceShared = ref(null)
    const deviceSelf = ref(null)
    const deviceSharedOptions = ref([
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ])
    const deviceSelfOptions = ref([
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ])


    let excludeValueOperators = ['is_null', 'is_not_null'] //不需要填值的操作符

    const seeClose = () => {
      seeModal.value = false
      alarmRuleData.value = {
        id: '', //id
        deviceCode: '',
        nodeCode: '', //点位名称
        ruleType: 10,
        name: '', //描述
        severity: '', //严重度描述
        severityDesc: '',
        interval: null, //时间间隔
        priority: null, //优先级
        isShare: true, //是否共享
        enabled: true, //是否启用
        resolveType: '', //解决方式描述
        resolveTypeDesc: '',
        nodeType: 'String',
        ruleDetail: {
          operator1: null,
          value1: null,
          operator2: null,
          value2: null,
        }, //规则详情
      }
    }

    const closeLoading = () => {
      showModal.value = false
      alarmRuleData.value = {
        id: '', //id
        deviceCode: '',
        nodeCode: '', //点位名称
        ruleType: 10,
        name: '', //描述
        severity: '', //严重度描述
        severityDesc: '',
        interval: null, //时间间隔
        priority: null, //优先级
        isShare: true, //是否共享
        enabled: true, //是否启用
        resolveType: '', //解决方式描述
        resolveTypeDesc: '',
        nodeType: 'String',
        ruleDetail: {
          operator1: null,
          value1: null,
          operator2: null,
          value2: null,
        }, //规则详情
      }
    }
    const alarmRuleData = ref({
      id: '', //id
      deviceCode: '',
      nodeCode: '', //点位名称
      ruleType: 10,
      name: '', //描述
      severity: '', //严重度描述
      severityDesc: '',
      interval: null, //时间间隔
      priority: null, //优先级
      isShare: true, //是否共享
      enabled: true, //是否启用
      resolveType: '', //解决方式描述
      resolveTypeDesc: '',
      nodeType: 'String',
      ruleDetail: {
        operator1: null,
        value1: null,
        operator2: null,
        value2: null,
      }, //规则详情
    })
    const createColumns = () => {
      return columns.value = [
        {
          title: '点位',
          key: 'nodeCode',
        },
        {
          title: '描述',
          key: 'name',
          width: '200px',
          render(row) {
            return h('div', {
              class: 'ellipsis',
              style: {
                maxWidth: 'width',
              },
            }, row.name)
          },
        },
        {
          title: '严重度',
          key: 'severityDesc',
        },

        {
          title: '优先级',
          key: 'priority',
        },
        {
          title: '是否共享',
          key: 'isShare',
          render(row) {
            // 根据 isShare 的值改变文本和颜色
            const text = row.isShare === 1 ? '是' : '否'
            const color = row.isShare === 1 ? '#2885F0' : '#D03050'
            return h('span', { style: { color: color } }, text)
          },
        },
        {
          title: '启用',
          key: 'enabled',
          render(row) {
            // 根据 enabled 的值改变文本和颜色
            const text = row.enabled === 1 ? '启用' : '禁用'
            const color = row.enabled === 1 ? '#2885F0' : '#D03050'
            return h('span', { style: { color: color } }, text)
          },
        },
        {
          title: '解决方式',
          key: 'resolveTypeDesc',
        },
        {
          title: '是否本项目',
          key: 'local',
          render(row) {
            // 根据 enabled 的值改变文本和颜色
            const text = row.local === true ? '是' : '否'
            const color = row.local === true ? '#2885F0' : '#D03050'
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
              see: { label: '查看', color: '#1D9F3A', onClick: () => see(row) },
              edit: { label: '编辑', color: '#0E62A9', onClick: () => edit(row) },
              delete: { label: '删除', color: '#FF4646', onClick: () => deleteRow(row.id) },
            }

            let actions = []
            if (row.local === true) {
              // 如果 row.local 为 true，显示查看、编辑和删除按钮
              actions = ['edit', 'delete'].map(key => actionMap[key])
            } else {
              // 如果 row.local 为 false，只显示查看按钮
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
    const see = row => {
      seeModal.value = true
      const severityMap = {
        10: '低',
        20: '中',
        30: '高',
        40: '严重',
        50: '致命',
      }
      const resolveTypeMap = {
        10: '自动',
        20: '手动',
      }
      let severityDescription = severityMap[row.severity]
      let resolveTypeDescription = resolveTypeMap[row.resolveType]

      alarmRuleData.value = {
        ...row,
        isShare: row.isShare === 1,
        enabled: row.enabled === 1,
        severity: severityDescription,
        resolveType: resolveTypeDescription,
      }
    }
    const edit = row => {
      showModal.value = true
      const severityMap = {
        10: '低',
        20: '中',
        30: '高',
        40: '严重',
        50: '致命',
      }
      const resolveTypeMap = {
        10: '自动',
        20: '手动',
      }
      let severityDescription = severityMap[row.severity]
      let resolveTypeDescription = resolveTypeMap[row.resolveType]

      alarmRuleData.value = {
        ...row,
        isShare: row.isShare === 1,
        enabled: row.enabled === 1,
        severity: severityDescription,
        resolveType: resolveTypeDescription,

      }

    }
    const rules = ref({
      nodeCode: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择点位',
      },
      severity: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择严重度',
      },
      resolveType: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择解决方式',
      },
      name: {
        required: true,
        trigger: 'blur',
        message: '请输入描述',
      },
      interval: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: '请输入时间间隔',
      },
      priority: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: '请输入优先级',
      },
      ruleDetail: {
        operator1: {
          required: true,
          trigger: ['blur', 'change'],
          message: '请选择操作符1',
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
      if (alarmRuleData.value.id) {
        ServerUpdate()
      } else {
        ServerAdd()
      }
    }
    const update = async () => {
      try {
        const severityMap = {
          低: 10,
          中: 20,
          高: 30,
          严重: 40,
          致命: 50,
        }
        const resolveTypeMap = {
          自动: 10,
          手动: 20,
        }
        let severityDescription = alarmRuleData.value.severity
        let resolveTypeDescription = alarmRuleData.value.resolveType
        let severity = isNaN(Number(severityDescription)) ? severityMap[severityDescription] : Number(severityDescription)
        let resolveType = isNaN(Number(resolveTypeDescription)) ? resolveTypeMap[resolveTypeDescription] : Number(resolveTypeDescription)

        const res = await alarmRuleUpdate(
          alarmRuleData.value.id,
          getProjectId(),
          alarmRuleData.value.deviceCode,
          alarmRuleData.value.nodeCode,
          alarmRuleData.value.name,
          severity,
          alarmRuleData.value.ruleType,
          alarmRuleData.value.interval,
          alarmRuleData.value.priority,
          alarmRuleData.value.ruleDetail,
          alarmRuleData.value.isShare ? 1 : 0,
          alarmRuleData.value.enabled ? 1 : 0,
          resolveType,
          alarmRuleData.value.nodeType,
        )

        if (res.data.code === 200) {
          message.success('编辑成功')
          closeLoading()
          fetchProjects()
        } else {
          message.error(res.data.msg)
        }
      } catch (error) {
        console.error('Error updating alarm rule:', error)
        message.error('更新告警规则时出错')
      }
    }



    const deleteRow = async id => {
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
            await alarmRuleDel(id)
            message.success('已成功删除')
            fetchProjects()
          } catch (error) {
            message.error(error.message)
          }
        },
      })
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

    const fetchProjects = async () => {
      try {
        const res = await alarmRuleList(getProjectId(), pagination.page, pagination.pageSize)
        alarmRule.value = res.data.data.records
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize)
        pagination.itemCount = res.data.data.total
        createColumns()
        if (alarmRule.value.length === 0 && pagination.page > 1) {
          pagination.page = pagination.page - 1
          await fetchProjects()
        }
      } catch (error) {
        console.error('Error fetching project data:', error)
      }
    }

    const ServerConfigSearch = async page => {
      try {
        const res = await alarmRulequery(
          getProjectId(),
          nodeCode.value,
          severityD.value,
          deviceShared.value,
          deviceSelf.value,
          pagination.page,
          pagination.pageSize,
        )
        alarmRule.value = res.data.data.records
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize)
        pagination.itemCount = res.data.data.total
      } catch (error) {
        console.error('Error fetching project data:', error)
      } finally {
        isSearching.value = false // 结束搜索状态
      }
    }

    const searchInitiated = ref(false) // 用于跟踪是否已经点击了搜索按钮

    const handleSorterChange = sorter => {
      pagination.page = 1
      fetchProjects()
    }

    const handleFiltersChange = filters => {
      pagination.page = 1
      fetchProjects()
    }

    const handlePageChange = page => {
      pagination.page = page
      if (searchInitiated.value) {
        ServerConfigSearch(page)
      } else {
        fetchProjects()
      }
    }


    // 搜索按钮点击事件处理函数
    const handleSearchButtonClick = () => {
      searchInitiated.value = true
      pagination.page = 1
      ServerConfigSearch(pagination.page)
    }


    const enumProjects = async () => {
      try {
        const id1 = 'AlarmSeverity'
        //const id2 = 'AlarmOperator'
        const id3 = 'AlarmRuleType'
        const id4 = 'AlarmResolveType'
        const severityList = await enumQuery(id1) // 报警严重度
        //const operatorList = await enumQuery(id2) //报警计算符
        const ruleTypeList = await enumQuery(id3) //报警规则类型
        const resolveTypeList = await enumQuery(id4) //解决方式
        severityList.data.data.sort((a, b) => {
          return parseInt(b.value) - parseInt(a.value)
        })
        severity.value = severityList.data.data
        //operator.value = operatorList.data.data

        resolveType.value = resolveTypeList.data.data
        ruleType.value = ruleTypeList.data.data
      } catch (error) {
        console.log(error)
      }
    }
    const add = async () => {
      try {
        const res = await alarmRuleAdd(
          getProjectId(),
          alarmRuleData.value.deviceCode,
          alarmRuleData.value.nodeCode,
          alarmRuleData.value.name,
          alarmRuleData.value.severity,
          alarmRuleData.value.ruleType,
          alarmRuleData.value.interval,
          alarmRuleData.value.priority,
          alarmRuleData.value.ruleDetail,
          alarmRuleData.value.isShare ? 1 : 0,
          alarmRuleData.value.enabled ? 1 : 0,
          alarmRuleData.value.resolveType,
          alarmRuleData.value.nodeType,
        )

        if (res.data.code === 200) {
          message.success('新增成功')
          closeLoading()
          fetchProjects()
        } else {
          message.error(res.data.msg)
        }
      } catch (error) {
        console.error('Error:', error)
        message.error('操作失败')
      }
    }
    const severityOptions = computed(() => {
      return severity.value.map(m => ({ value: m.value, label: m.name }))
    })
    // const operatorOptions = computed(() => {
    //   return operator.value.map(m => ({ value: m.value, label: m.name }))
    // })
    const resolveTypeOptions = computed(() => {
      return resolveType.value.map(m => ({ label: m.name, value: m.value }))
    })
    // const ruleTypeOptions = computed(() => {
    //   return ruleType.value.map(m => ({ label: m.name, value: m.name }))
    // })
    const icListVisibile = ref(false)
    const openIcList = () => {
      icListVisibile.value = true
    }

    // const formRef = ref(null);
    provide('closeIcList', () => { icListVisibile.value = false })
    provide('addPt', (item: PtModel) => {
      alarmRuleData.value.deviceCode = item.extension.device
      alarmRuleData.value.nodeCode = item.extension.name

      if(alarmRuleData.value.nodeType != item.nodeType && !alarmRuleData.value.nodeType) {
        alarmRuleData.value.ruleDetail.operator1 = null
        alarmRuleData.value.ruleDetail.value1 = null
        alarmRuleData.value.ruleDetail.operator2 = null
        alarmRuleData.value.ruleDetail.value2 = null
      }

      alarmRuleData.value.nodeType = item.nodeType
      icListVisibile.value = false
    })

    const Eliminate = () => {
      nodeCode.value = null
      severityD.value = null
      deviceShared.value = null
      deviceSelf.value = null
      searchInitiated.value = false
      fetchProjects()
    }
    onMounted(() => {
      fetchProjects()
      enumProjects()
    })

    const nodeDataType = computed(() => {
      if(alarmRuleData.value.nodeType == null) {
        return NodeDataType.string
      }
      else {
        return convertNodeTypeToDataType(alarmRuleData.value.nodeType)
      }
    })

    const textboxEnabled = computed(() => {
      return nodeDataType.value == NodeDataType.string
    })

    const numberboxEnabled = computed(() => {
      return nodeDataType.value == NodeDataType.number
    })

    const showValue1 = computed(() => {
      return !excludeValueOperators.includes(alarmRuleData.value.ruleDetail.operator1)
    })

    const showValue2 = computed(() => {
      return !excludeValueOperators.includes(alarmRuleData.value.ruleDetail.operator2)
    })

    const operatorOptions = computed(() => {
      let data = []

      if(nodeDataType.value == NodeDataType.number) {
        data = [
          {
            value: '<=',
            label: '小于等于',
          },
          {
            value: 'is_null',
            label: '为空',
          },
          {
            value: '!=',
            label: '不等于',
          },
          {
            value: '<',
            label: '小于',
          },
          {
            value: '=',
            label: '等于',
          },
          {
            value: 'is_not_null',
            label: '不为空',
          },
          {
            value: '>',
            label: '大于',
          },
          {
            value: '>=',
            label: '大于等于',
          },
        ]
      }
      else{
        data = [
          {
            value: 'in',
            label: '包含',
          },
          {
            value: 'not_in',
            label: '不包含',
          },
          {
            value: 'is_null',
            label: '为空',
          },
          {
            value: '!=',
            label: '不等于',
          },
          {
            value: '=',
            label: '等于',
          },
          {
            value: 'is_not_null',
            label: '不为空',
          },
        ]
      }

      return data
    })



    return {
      alarmRule,
      alarmRuleData,
      columns,
      severity,
      nodeCode,
      severityD,
      showModal,
      closeLoading,
      handleSorterChange,
      handleFiltersChange,
      handlePageChange,
      severityOptions,
      operatorOptions,
      resolveTypeOptions,
      formRef,
      openIcList,
      icListVisibile,
      // triggerSearch,
      Eliminate,
      seeModal,
      seeClose,
      pagination,
      ServerAdd,
      ServerUpdate,
      confirmAction,
      rules,
      handleSearchButtonClick,
      deviceShared,
      deviceSelf,
      deviceSharedOptions,
      deviceSelfOptions,

      textboxEnabled,
      numberboxEnabled,

      showValue1,
      showValue2,
    }
  },
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

.Server-search {
  :deep(.dev-input) {
    border: 0px solid;
    margin-right: 10px;

    .n-base-selection {
      width: 150px;
    }

    .n-base-selection-label {
      height: 36px;
      width: 150px;
    }

    .n-base-selection--selected {
      border-radius: 8px;
    }

    .n-base-selection-input__content {
      font-size: 18px;
      color: #7E7E7E;
    }

    .n-base-selection__border {
      height: 36px;
      border-radius: 8px;
      border: 1px solid #E4E7EC;
    }

    .n-base-selection__state-border {
      height: 36px;
      border: 0px solid;
      margin-right: 5px;
    }
  }
}

</style>

