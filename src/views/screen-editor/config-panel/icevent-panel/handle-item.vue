<template>
  <div class="event">
    <div v-if="visible" class="variables">
      <n-collapse accordion arrow-placement="left" :expanded-names="item.lastTargetName"
        @item-header-click="eventCollapseHeaderClick">
        <n-collapse-item v-for="(f, idx) in item.fields" :key="idx" :name="f.name">
          <template #header>
            <div style="width: 100%">
              <div class="actionTitle">
                {{ item.eventName == 'property' ? (f.targetProperty == null ? "?" :
                  f.targetPropertyTitle) : (f.targetMethodName == null ? "?" : f.targetMethodTitle) }} -
                {{ f.association == 'formula' ? (f.formulaName == null ? "?" : f.formulaName) : (f.icName == null ? "?" :
                  f.icName) }}
              </div>

              <div style="float: right; width: 70px; height: 16px" @click="$event.stopPropagation()">
                <n-popconfirm v-model:show="f.showDeleteConfirm" positive-text="确定" negative-text="取消">
                  <template #trigger>
                    <n-icon class="delete-btn">
                      <IconDelete />
                    </n-icon>
                  </template>确定要删除吗？
                  <template #action>
                    <n-button size="tiny" @click="f.showDeleteConfirm = false">
                      取消
                    </n-button>
                    <n-button size="tiny" type="primary" @click="deleteField(idx); f.showDeleteConfirm = false;">
                      确定
                    </n-button>
                  </template>
                </n-popconfirm>
              </div>
            </div>
          </template>
          <template #header-extra> </template>
          <table style="width: 100%">
            <tbody>
              <tr v-show="item.eventName == 'property'">
                <td class="handleTitleTd">组件属性</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.targetProperty" :options="getProperty(f, item)" size="small"
                      placeholder="请选择" @update:value="targetPropertyChange">
                    </n-select>
                  </div>
                </td>
              </tr>
              <tr v-show="item.eventName == 'event'">
                <td class="handleTitleTd">触发类型</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.targetMethodTriggle" :options="getTriggleType(f, item)" size="small"
                      placeholder="请选择" @update:value="targetMethodTriggleChange">
                    </n-select>
                  </div>
                </td>
              </tr>
              <tr v-show="item.eventName == 'event' && f.targetMethodTriggle == 'event'">
                <td class="handleTitleTd">操作权限</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.targetMethodAuthType" :options="getAuthType(f, item)" size="small"
                      placeholder="请选择" @update:value="authTypeChange">
                    </n-select>
                  </div>
                </td>
              </tr>
              <tr
                v-show="item.eventName == 'event' && f.targetMethodTriggle == 'event' && f.targetMethodAuthType == 'auth'">
                <td class="handleTitleTd">指定角色</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.targetMethodAuthRoles" placeholder="选择角色" multiple :fallback-option="false"
                      :options="roleList"/>
                  </div>
                </td>
              </tr>
              <tr
                v-show="item.eventName == 'event' && f.targetMethodTriggle == 'event' && f.targetMethodAuthType == 'auth'">
                <td class="handleTitleTd">指定用户</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.targetMethodAuthUsers" placeholder="选择用户"  multiple  :fallback-option="false"
                      :options="userList" />
                  </div>
                </td>
              </tr>
              <tr v-show="item.eventName == 'event' && f.targetMethodTriggle == 'event'">
                <td class="handleTitleTd">触发事件</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.targetMethodName" :options="getTriggleMethod(f, item)" size="small"
                      placeholder="请选择" @update:value="targetTriggleMethodChange">
                    </n-select>
                  </div>
                </td>
              </tr>

              <!-- <tr v-show="item.eventName == 'event' && f.targetMethodTriggle=='data'">
                <td class="handleTitleTd">接收事件</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.targetMethodTriggle" :options="getTriggle(f, item)" size="small"
                      placeholder="请选择" @update:value="targetTriggleChange">
                    </n-select>
                  </div>
                </td>
              </tr> -->
              <tr v-show="item.eventName == 'event' && f.targetMethodTriggle == 'event'">
                <td class="handleTitleTd">关联对象</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.association" :options="getAssociation()" size="small" placeholder="请选择">
                    </n-select>
                  </div>
                </td>
              </tr>
              <tr v-show="f.association == 'formula'">
                <td class="handleTitleTd">关联配方</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-input-group>
                      <n-input v-model:value="f.formulaName" :style="{ width: '70%', 'font-size': '12px' }"
                        placeholder="请选择" readonly="readonly" />
                      <n-button type="primary" size="small" :focusable="false" ghost @click="openFormulaList(f)">
                        配方
                      </n-button>
                    </n-input-group>
                  </div>
                </td>
              </tr>
              <tr v-show="f.association != 'formula'">
                <td class="handleTitleTd">关联点位</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-input-group>
                      <n-input v-model:value="f.icName" :style="{ width: '70%', 'font-size': '12px' }" placeholder="请选择"
                        readonly="readonly" />
                      <n-button type="primary" size="small" :focusable="false" ghost @click="openIcList(f)">
                        点位
                      </n-button>
                    </n-input-group>
                  </div>
                </td>
              </tr>
              <tr v-show="item.eventName == 'property'">
                <td class="handleTitleTd">关联类型</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.bindType" :options="getTypes(f)" size="small" placeholder="请选择"
                      @update:value="targetTypeChange">
                    </n-select>
                  </div>
                </td>
              </tr>
              <tr v-show="item.eventName == 'event' && f.targetMethodTriggle == 'data'">
                <td class="handleTitleTd">触发条件</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.bindType" :options="getTypes3(f)" size="small" placeholder="请选择"
                      @update:value="targetTypeChange">
                    </n-select>
                  </div>
                </td>
              </tr>
              <tr v-show="item.eventName == 'event' && f.targetMethodTriggle == 'event' && f.association == 'pt'">
                <td class="handleTitleTd">关联类型</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <n-select v-model:value="f.bindType" :options="getTypes2(f)" size="small" placeholder="请选择"
                      @update:value="targetTypeChange2">
                    </n-select>
                  </div>
                </td>
              </tr>
              <tr
                v-show="item.eventName == 'event' && f.targetMethodTriggle == 'event' && f.association == 'pt' && f.bindType == 'bind'">
                <td class="handleTitleTd">点位赋值</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <g-input v-model="f.value" />
                  </div>
                </td>
              </tr>
              <tr
                v-show="f.bindType == 'condition' || (item.eventName == 'event' && f.targetMethodTriggle == 'data' && f.association == 'pt')">
                <td class="handleTitleTd">当点位值</td>
                <td class="handleContentTd ">
                  <n-select v-model:value="f.operator" :options="getCondition(f)" size="small" placeholder="请选择对比逻辑"
                    @update:value="operatorChange(f)">
                  </n-select>
                </td>
              </tr>
              <tr
                v-show="f.bindType == 'condition' || (item.eventName == 'event' && f.targetMethodTriggle == 'data' && f.association == 'pt')">
                <td class="handleTitleTd">对比数值</td>
                <td class="handleContentTd ">
                  <!-- <n-input v-model:value="f.opvalue" size="small" placeholder="请输入对比数值"
                    @blur="updateConditionScript(f)" /> -->
                  <g-input v-model="f.opvalue" @change="updateConditionScript(f)" />
                </td>
              </tr>
              <tr v-show="f.bindType == 'condition2'">
                <td class="handleTitleTd">当点位值</td>
                <td class="handleContentTd ">
                  <n-select v-model:value="f.operator" :options="getConditionStart(f)" size="small" placeholder="请选择对比逻辑"
                    @update:value="operatorChange(f)">
                  </n-select>
                </td>
              </tr>
              <tr v-show="f.bindType == 'condition2'">
                <td class="handleTitleTd">对比数值</td>
                <td class="handleContentTd ">
                  <!-- <n-input v-model:value="f.opvalue" size="small" placeholder="请输入对比数值"
                    @blur="updateConditionScript(f)" /> -->
                  <g-input v-model="f.opvalue" @change="updateConditionScript(f)" />
                </td>
              </tr>
              <tr v-show="f.bindType == 'condition2'">
                <td class="handleTitleTd">当点位值</td>
                <td class="handleContentTd ">
                  <n-select v-model:value="f.operator2" :options="getConditionEnd(f)" size="small" placeholder="请选择对比逻辑"
                    @update:value="operatorChange(f)">
                  </n-select>
                </td>
              </tr>
              <tr v-show="f.bindType == 'condition2'">
                <td class="handleTitleTd">对比数值</td>
                <td class="handleContentTd ">
                  <!-- <n-input v-model:value="f.opvalue" size="small" placeholder="请输入对比数值"
                    @blur="updateConditionScript(f)" /> -->
                  <g-input v-model="f.opvalue2" @change="updateConditionScript(f)" />
                </td>
              </tr>
              <tr v-show="item.eventName != 'event' && (f.bindType == 'condition' || f.bindType == 'condition2')">
                <td class="handleTitleTd">属性赋值</td>
                <td class="handleContentTd ">
                  <div class="datav-new-select-wp">
                    <g-input v-if="f.targetPropertyType == 'string'" v-model="f.opresult"
                      @change="updateConditionScript(f)" />
                    <g-input-number v-if="f.targetPropertyType == 'number'" v-model="f.opresult"
                      @change="updateConditionScript(f)" />
                    <g-color-picker v-if="f.targetPropertyType == 'color'" v-model="f.opresult"
                      @change="updateConditionScript(f)" />
                    <g-upload-image v-if="f.targetPropertyType == 'image'" v-model="f.opresult"
                      @change="updateConditionScript(f)" />
                    <g-select v-if="f.targetPropertyType == 'enableTypes'" v-model="f.opresult" :data="enableTypes"
                      @change="updateConditionScript(f)" />
                    <g-select v-if="f.targetPropertyType == 'animationTypes'" v-model="f.opresult" :data="animationTypes"
                      @change="updateConditionScript(f)" />
                    <g-select v-if="f.targetPropertyType == 'animationState'" v-model="f.opresult" :data="animationState"
                      @change="updateConditionScript(f)" />
                  </div>
                </td>
              </tr>
              <tr
                v-show="f.targetMethodTriggle != 'data' && (f.bindType == 'custom' || f.bindType == 'condition' || f.bindType == 'condition2')">
                <td colspan="2" style="background-color:rgb(14,16,19);">
                  <div v-show="f.hasDecideScript">
                    <div style="font-size: 12px;margin-top: 5px;margin-bottom: 5px;margin-left:5px;">
                      <span style="color: rgb(86, 156, 214)">function</span>
                      (data,com,path) {
                    </div>
                    <g-monaco-editor language="javascript" :auto-format="true" :height="250" :code="f.decideScript"
                      :extra="f" full-screen-title="条件赋值" @blur="updateDecideScript" />
                    <div style="font-size: 12px;margin-left:5px;">}</div>
                  </div>
                </td>
              </tr>
              <tr v-show="item.eventName == 'event' && f.targetMethodTriggle == 'data'">
                <td class="handleTitleTd">执行动作</td>
                <td class="handleContentTd">
                  <n-select v-show="f.targetComId != ''" v-model:value="f.targetMethodName" :options="getActions(f)"
                    size="small" placeholder="请选择" @update:value="targetMethodChange">
                    <template #empty>
                      <n-empty description="无数据" />
                    </template>
                  </n-select>
                </td>
              </tr>
              <tr v-show="item.eventName == 'event' && f.targetMethodTriggle == 'data'">
                <td colspan="2" style="background-color:rgb(14,16,19);">
                  <div v-show="f.hasScript">
                    <div style="font-size: 12px;margin-top: 5px;margin-bottom: 5px;margin-left:5px;">
                      <span style="color: rgb(86, 156, 214)">function</span>
                      (data,getLocalValue) {
                    </div>
                    <g-monaco-editor language="javascript" :auto-format="true" :height="250" :code="f.script" :extra="f"
                      full-screen-title="自定义脚本" @blur="updateScript" />
                    <div style="font-size: 12px;margin-left:5px;">}</div>
                  </div>
                  <div v-show="f.hasParams">
                    <g-monaco-editor language="json" :auto-format="true" :height="250" :code="f.params" :extra="f"
                      full-screen-title="自定义参数" @blur="updateJson" />
                  </div>
                </td>
              </tr>
              <tr
                v-show="item.eventName == 'event' && f.targetMethodTriggle == 'data' && f.targetMethodName == 'special'">
                <td class="handleTitleTd">动画效果</td>
                <td class="handleContentTd">
                  <n-select v-model:value="f.special" :options="getSpecials()" size="small" placeholder="请选择动画效果" />
                </td>
              </tr>
              <tr
                v-show="item.eventName == 'event' && f.targetMethodTriggle == 'data' && f.targetMethodName == 'special'">
                <td class="handleTitleTd">动画速率</td>
                <td class="handleContentTd">
                  <n-select v-model:value="f.specialType" :options="getSpecialsSpeed()" size="small"
                    placeholder="请选择动画速率" />
                </td>
              </tr>
              <tr
                v-show="item.eventName == 'event' && f.targetMethodTriggle == 'data' && f.targetMethodName == 'special'">
                <td class="handleTitleTd">持续时间</td>
                <td class="handleContentTd">
                  <g-input-number v-model="f.specialTimer" :min="0" :max="10000" :step="50" suffix="ms" />
                </td>
              </tr>
            </tbody>
          </table>
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
  <IcList :visible="icListVisibile" />
  <FormulaList :visible="formulaListVisibile" />
</template>

<script lang='ts'>
import { defineComponent, ref, PropType, inject, Events, onMounted, provide, reactive, watch, computed } from 'vue'
import { IconArrowRight, IconDelete, IconPlus } from '@/icons'
import { FormulaSecModel, IcHandleItemConfig, IcHandleItemField, PtModel } from '@/components/data-handle'
import { ComType, DatavComponent } from '@/components/datav-component'
import { InternalMethod } from '@/components/InternalMethod'
import {
  eventSetting,
  getAllSpecialTypes,
  getAllSpecialSpeedTypes,
  getEventSettingBy,
  getIcEventSettingBy,
  icEventSetting,
} from '@/components/event-setting'
import { SelectOption, TreeSelectOption } from 'naive-ui'
import IcList from './ic-list.vue'
import FormulaList from './formula-list.vue'
import { IcModule } from '@/store/modules/icstate'
import { animationState, animationTypes, enableTypes } from '@/data/select-options'
import { queryRole, queryUser } from '@/api/user'

export default defineComponent({
  name: 'HandleItem',
  components: {
    IconDelete,
    IcList,
    FormulaList
  },
  props: {
    item: {
      type: Object as PropType<IcHandleItemConfig>,
      required: true,
    },
    coms: {
      type: Object as PropType<DatavComponent[]>,
      required: true,
    },
    com: {
      type: Object as PropType<DatavComponent>,
      required: true,
    }
  },
  setup(props) {
    const visible = ref(true)

    const doAddField = inject('addField') as (eventName: string) => void
    const doDeleteField = inject('deleteField') as (
      eventName: string,
      idx: number
    ) => void

    const showDeleteConfirm = ref(false)

    const roleList = ref([])

    const userList = ref([])


    onMounted(() => {
      queryRole({}).then(result => {
        let list = result.data.data.records;
        roleList.value = list.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      });

      const searchParams = {
        pageNo: 1,
        pageSize: 10000
      }
      queryUser(searchParams).then(result => {
        let list = result.data.data.records;
        userList.value = list.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      });
    })


    const addField = () => {
      doAddField(props.item.eventName)
    }

    const deleteField = (idx: number) => {
      doDeleteField(props.item.eventName, idx)
    }

    const getAllComs = (field: IcHandleItemField) => {
      let items: { key: string; label: string; item: any; children?: []; }[] = []

      const subComs = props.coms.filter(r => r.parentId && r.eventhub)
      const coms = props.coms.filter(r => !r.parentId && (r.eventhub || subComs.some(s => r.id == s.parentId))).reverse()

      coms.forEach(com => {
        const item = {
          key: com.id,
          label: com.alias,
          item: field,
          children: null,
        }
        items.push(item)

        if (com.type == ComType.layer) {
          item.children = []
          subComs.filter(r => r.parentId == com.id).forEach(subCom => {
            item.children.push({
              key: subCom.id,
              label: subCom.alias,
              item: field,
            })
          })
        }
      })
      return items
    }


    const getSpecials = () => {
      let items: { value: string; label: string; }[] = []
      let specials = getAllSpecialTypes()
      specials.forEach(special => {
        return items.push({
          value: special.type,
          label: special.name,
        })
      })
      return items
    }

    const getSpecialsSpeed = () => {
      let items: { value: string; label: string; }[] = []
      let specialSpeeds = getAllSpecialSpeedTypes()
      specialSpeeds.forEach(specialSpeed => {
        return items.push({
          value: specialSpeed.type,
          label: specialSpeed.name,
        })
      })
      return items
    }

    const getProperty = (item: IcHandleItemField, config: IcHandleItemConfig) => {
      let list = [];
      config.properties?.forEach(r => {
        let property = {
          value: r.path,
          label: r.name,
          type: r.type,
          item: item
        }
        list.push(property);
      })
      return list;
    }

    const getTriggleType = (item: IcHandleItemField, config: IcHandleItemConfig) => {
      let list = [{
        value: 'data',
        label: '点位数据触发',
        item: item
      }, {
        value: 'event',
        label: '组件事件触发',
        item: item
      }];
      return list;
    }

    const getAuthType = (item: IcHandleItemField, config: IcHandleItemConfig) => {
      let list = [{
        value: 'all',
        label: '允许所有人',
        item: item
      }, {
        value: 'auth',
        label: '指定用户/角色',
        item: item
      }];
      return list;
    }

    const getAssociation = () => {
      let list = [{
        value: 'formula',
        label: '配方',
      }, {
        value: 'pt',
        label: '点位',
      }];
      return list;
    }

    const getTriggleMethod = (item: IcHandleItemField, config: IcHandleItemConfig) => {
      let list = [];
      if (config.events && config.events.length > 0) {
        config.events.forEach(r => {
          let event = {
            value: r.methodCode,
            label: r.methodName,
            item: item
          }
          list.push(event)
        })

      }

      list = [...list, ...[{
        value: 'click',
        label: '点击',
        item: item
      }, {
        value: 'mouseEnter',
        label: '鼠标移入',
        item: item
      }, {
        value: 'mouseLeave',
        label: '鼠标移出',
        item: item
      }]];
      return list;
    }

    const targetTriggleMethodChange = (value: string, option: SelectOption | null) => {
      let item: IcHandleItemField = option.item as IcHandleItemField
      item.targetMethodTitle = option.label.toString();
    }

    const targetPropertyChange = (value: string, option: SelectOption | null) => {
      let item: IcHandleItemField = option.item as IcHandleItemField
      item.targetProperty = value;
      item.targetPropertyTitle = option.label.toString();
      item.targetPropertyType = option.type as string;
      console.log(item);
    }

    const targetMethodTriggleChange = (value: string, option: SelectOption | null) => {
      let item: IcHandleItemField = option.item as IcHandleItemField


      item.targetMethodName = null
      item.targetMethodTitle = null

      item.association = null
      item.icName = null
      item.icDevice = null
      item.pt = null
      item.formula = null
      item.formulaName = null
      item.formulaId = null
      item.seq = null
      item.bindType = null
      item.value = null
      item.operator = null
      item.opvalue = null
      item.operator2 = null
      item.opvalue2 = null
      item.opresult = null
      item.special = null
      item.specialTimer = null
      item.specialType = null
      item.specialParams = null
      item.hasDecideScript = null
      item.decideScript = null

      item.targetMethodAuthType = 'all';

    }

    const authTypeChange = (value: string, option: SelectOption | null) => {
      let item: IcHandleItemField = option.item as IcHandleItemField
      if (value == 'all') {
        item.targetMethodAuthRoles = [];
        item.targetMethodAuthUsers = [];
      }
    }

    const targetTypeChange = (value: string, option: SelectOption) => {
      let item: IcHandleItemField = option.item as IcHandleItemField
      switch (item.bindType) {
        //数值绑定
        case "bind":
          item.hasDecideScript = false;
          item.decideScript = '';
          break;
        //按条件赋值
        case "condition":
        case "condition2":
          item.hasDecideScript = true;
          updateConditionScript(item);
          break;
        case "custom":
          item.hasDecideScript = true;
          item.decideScript = `var condition = true;\nif(condition){\n setNP(com,path,data) \n}\n`;
          break;
      }
    }

    const targetTypeChange2 = (value: string, option: SelectOption) => {
      let item: IcHandleItemField = option.item as IcHandleItemField
      switch (item.bindType) {
        //数值绑定
        case "bind":
          item.hasDecideScript = false;
          item.decideScript = '';
          break;
        case "custom":
          item.hasDecideScript = true;
          item.decideScript = `return '返回值'`;
          break;
      }
    }

    const operatorChange = (item: IcHandleItemField) => {
      updateConditionScript(item);
    }

    const targetComChange = (value: string, option: TreeSelectOption | null | Array<TreeSelectOption | null> | any) => {
      let item: IcHandleItemField = option.item as IcHandleItemField
      item.targetMethodName = null
      item.targetMethodTitle = null
      item.params = null
      item.script = null
      item.hasParams = null
      item.hasScript = null
      item.targetComAlias = option.label as string
      //console.log('dropDownListChange', value, option.com)
    }

    const targetMethodChange = (value: string, option: SelectOption) => {
      let item: IcHandleItemField = option.item as IcHandleItemField

      console.log(option.com)

      let com = option.com as DatavComponent

      item.hasParams = option.hasParams as boolean
      item.hasScript = option.hasScript as boolean

      if (!item.hasParams) {
        item.params = null;
      }
      else {
        item.params = '{}';
      }
      if (!item.hasScript) {
        item.script = null;
      }
      else {
        item.script = '';
      }

      switch (item.targetMethodName) {
        case InternalMethod.initApi:
          let apiConfig = {
            api: '',
            apiBody: '{}',
            apiHeaders: '{}',
            apiMethod: 'GET',
          }

          if (com.apiData.source.config.api) {
            apiConfig.api = com.apiData.source.config.api
          }

          if (com.apiData.source.config.apiMethod) {
            apiConfig.apiMethod = com.apiData.source.config.apiMethod
          }

          if (com.apiData.source.config.apiHeaders) {
            apiConfig.apiHeaders = com.apiData.source.config.apiHeaders
          }

          if (com.apiData.source.config.apiBody) {
            apiConfig.apiBody = com.apiData.source.config.apiBody
          }

          let jsCode_apiConfig = convertJSCode(apiConfig);
          item.script = `var result= ${jsCode_apiConfig} ; \n return result;`
          break;
        case InternalMethod.initData:
          if (com.apiData.source.config.data.length > 0) {
            let jsCode_data = convertJSCode(JSON.parse(com.apiData.source.config.data));
            item.script = `var result= ${jsCode_data} ; \n return result;`
          }
          else {
            item.script = `var result={} ; \n return result;`
          }
          break;
        case InternalMethod.initConfig:
          let config = com.config
          let jsCode = convertJSCode(config);
          item.script = `var result= ${jsCode} ; \n return result;`
          break;
        case InternalMethod.special:
          item.specialTimer = item.specialTimer ?? 500;
          item.specialType = item.specialType && item.specialType.length > 0 ? item.specialType : 'ease'
          break;
        case InternalMethod.custom:
          break;
      }

      item.targetMethodTitle = option.label as string
    }

    const convertJSCode = (item: any) => {
      let jsCode = JSON.stringify(item).replace(/"(\w+)"\s*:/g, '$1:');
      jsCode = jsCode.replaceAll(':{', ':\n{\n');
      jsCode = jsCode.replaceAll('},', '},\n');
      jsCode = jsCode.replaceAll('",', '",\n');
      jsCode = jsCode.replaceAll('true,', 'true,\n');
      jsCode = jsCode.replaceAll('false,', 'false,\n');
      jsCode = jsCode.replaceAll(':0,', ':0,\n');
      return jsCode;
    }

    const getTypes = (item: IcHandleItemField) => {
      let items: {
        value: string
        label: string
        item: IcHandleItemField
      }[] = [
          {
            value: 'bind',
            label: '数值绑定',
            item: item,
          },
          {
            value: 'condition',
            label: '开区间条件赋值',
            item: item,
          },
          {
            value: 'condition2',
            label: '闭区间条件赋值',
            item: item,
          },
          {
            value: 'custom',
            label: '自定义赋值',
            item: item,
          }
        ];
      return items
    }

    const getTypes2 = (item: IcHandleItemField) => {
      let items: {
        value: string
        label: string
        item: IcHandleItemField
      }[] = [
          {
            value: 'bind',
            label: '直接赋值',
            item: item,
          },
          {
            value: 'custom',
            label: '自定义赋值',
            item: item,
          }
        ];
      return items
    }

    const getTypes3 = (item: IcHandleItemField) => {
      let items: {
        value: string
        label: string
        item: IcHandleItemField
      }[] = [
          {
            value: 'condition',
            label: '开区间条件触发',
            item: item,
          },
          {
            value: 'condition2',
            label: '闭区间条件触发',
            item: item,
          }
        ];
      return items
    }


    const getCondition = (item: IcHandleItemField) => {
      let items: {
        value: string
        label: string
        item: IcHandleItemField
      }[] = [
          {
            value: '>',
            label: '大于',
            item: item,
          },
          {
            value: '>=',
            label: '大于等于',
            item: item,
          },
          {
            value: '==',
            label: '等于',
            item: item,
          },
          {
            value: '<',
            label: '小于',
            item: item,
          },
          {
            value: '<=',
            label: '小于等于',
            item: item,
          },
          {
            value: '!=',
            label: '不等于',
            item: item,
          }
        ];
      return items
    }

    const getConditionStart = (item: IcHandleItemField) => {
      let items: {
        value: string
        label: string
        item: IcHandleItemField
      }[] = [
          {
            value: '>',
            label: '大于',
            item: item,
          },
          {
            value: '>=',
            label: '大于等于',
            item: item,
          }
        ];
      return items
    }

    const getConditionEnd = (item: IcHandleItemField) => {
      let items: {
        value: string
        label: string
        item: IcHandleItemField
      }[] = [
          {
            value: '<',
            label: '小于',
            item: item,
          },
          {
            value: '<=',
            label: '小于等于',
            item: item,
          }
        ];
      return items
    }

    const getActions = (item: IcHandleItemField) => {
      if (!item.targetComId) return []

      let com = props.coms.find(r => r.id == item.targetComId)

      //let setting: icEventSetting = getIcEventSettingBy(com?.name)
      let setting: eventSetting = getEventSettingBy(com?.name)


      let items: {
        value: string
        label: string
        hasParams: boolean
        hasScript: boolean
        item: IcHandleItemField
        com: any
      }[] = []

      if (setting) {
        // let icevent = setting.icevents.find(r => r.name == 'event');
        // icevent.events.forEach(element => {
        //   items.push({
        //     value: element.methodCode,
        //     label: element.methodName,
        //     hasParams: false,
        //     hasScript: false,
        //     item: item,
        //     com: com,
        //   })
        // })

        setting.actions.forEach(element => {
          items.push({
            value: element.methodCode,
            label: element.methodName,
            hasParams: element.hasParams,
            hasScript: element.hasScript,
            item: item,
            com: com,
          })
        })
      }

      items = items.concat([{
        value: InternalMethod.custom,
        label: '自定义脚本',
        hasParams: false,
        hasScript: true,
        item: item,
        com: com,
      },
      {
        value: InternalMethod.initData,
        label: '初始化数据',
        hasParams: false,
        hasScript: true,
        item: item,
        com: com,
      },
      {
        value: InternalMethod.initApi,
        label: '初始化接口',
        hasParams: false,
        hasScript: true,
        item: item,
        com: com,
      },
      {
        value: InternalMethod.initConfig,
        label: '初始化配置',
        hasParams: false,
        hasScript: true,
        item: item,
        com: com,
      },
      {
        value: InternalMethod.special,
        label: '动画效果',
        hasParams: false,
        hasScript: false,
        item: item,
        com: com,
      }]);

      return items
    }

    const getDecide = (item: IcHandleItemField) => {
      return [{ value: false, label: "无条件", item: item }, { value: true, label: "自定义", item: item }]
    }

    const decideChange = (value: string, option: SelectOption) => {
      let item: IcHandleItemField = option.item as IcHandleItemField;
      if (value) {
        item.decideScript = `var condition = true;if(condition){\n return data \n};`;
      }
    }

    const eventCollapseHeaderClick = (data: {
      name: string
      expanded: boolean
    }) => {
      if (props.item.lastTargetName == data.name) {
        props.item.lastTargetName = null
      } else {
        props.item.lastTargetName = data.name
      }
    }

    const updateJson = (data: any) => {
      data.extra.params = data.value
    }

    const updateScript = (data: any) => {
      data.extra.script = data.value
    }


    const updateDecideScript = (data: any) => {
      data.extra.decideScript = data.value
    }

    const updateConditionScript = (item: IcHandleItemField) => {
      if (item.bindType == 'condition') {
        let decideScript = '';
        let opresult = null;
        if (item.targetPropertyType == 'enableTypes') {
          opresult = item.opresult;
        }
        else {
          opresult = strToNum(item.opresult);
        }
        decideScript += 'if(data ' + (item.operator && item.operator.length > 0 ? item.operator : '?') + ' ' + (item.opvalue && item.opvalue.length > 0 ? strToNum(item.opvalue) : '\'未赋值\'') + '){\n'
        if (item.targetMethodTriggle == 'data') {
          decideScript += ' return true \n'
        }
        else {
          decideScript += '  setNP(com,path,' + opresult + ') \n'
        }
        decideScript += '}'
        if (item.targetMethodTriggle == 'data') {
          decideScript += '\n else{ return false } '
        }
        item.decideScript = decideScript;
      }
      else if (item.bindType == 'condition2') {
        let decideScript = '';
        let opresult = null;
        if (item.targetPropertyType == 'enableTypes') {
          opresult = item.opresult;
        }
        else {
          opresult = strToNum(item.opresult);
        }
        decideScript += 'if(data ' + (item.operator && item.operator.length > 0 ? item.operator : '?') + ' ' + (item.opvalue && item.opvalue.length > 0 ? strToNum(item.opvalue) : '\'未赋值\'');
        decideScript += ' && data ' + (item.operator2 && item.operator2.length > 0 ? item.operator2 : '?') + ' ' + (item.opvalue2 && item.opvalue2.length > 0 ? strToNum(item.opvalue2) : '\'未赋值\'') + '){\n'
        if (item.targetMethodTriggle == 'data') {
          decideScript += ' return true \n'
        }
        else {
          decideScript += '  setNP(com,path,' + opresult + ') \n'
        }
        decideScript += '}'
        if (item.targetMethodTriggle == 'data') {
          decideScript += '\n else{ return false } '
        }
        item.decideScript = decideScript;
      }
    }

    const handleChange = (value: boolean) => {
      alert(value);
    }

    const strToNum = (str) => {
      const num = Number(str);
      if (isNaN(num)) {
        if (str && str.length > 0) {
          if (str == 'true') {
            return true
          } else if (str == 'false') {
            return false
          }
          else {
            return '\'' + str + '\'';
          }
        }
        else {
          return '\'未赋值\'';
        }
      }
      return num;
    }

    const icListVisibile = ref(false);
    const formulaListVisibile = ref(false);

    var currentField: IcHandleItemField = null;

    const openIcList = (item: IcHandleItemField) => {
      currentField = item;
      icListVisibile.value = true
    }

    const openFormulaList = (item: IcHandleItemField) => {
      currentField = item;
      formulaListVisibile.value = true;
    }

    watch(props.item, () => {
      IcModule.setIcState();
    }, { deep: true })


    provide('closeIcList', () => { icListVisibile.value = false })

    provide('addPt', (item: PtModel) => {
      if (item != null && item.extension && item.extension.device && item.extension.device) {
        currentField.pt = item;
        currentField.icName = item.propertyName;
        currentField.icDevice = item.extension.device;
        icListVisibile.value = false
      }
    })

    provide('closeFormulaList', () => { formulaListVisibile.value = false })

    provide('addFormula', (item: FormulaSecModel) => {
      if (item != null && item.id) {
        currentField.formula = item;
        currentField.formulaName = (item.showName.length > 0 ? item.showName : item.name);
        currentField.formulaId = item.formulaId;
        currentField.seq = item.seq;
        formulaListVisibile.value = false
      }
    })

    return {
      visible,
      //isEnabled,
      addField,
      deleteField,
      //updateField,
      //onEnableChange,
      getProperty,
      getTypes,
      getTypes2,
      getTypes3,
      getDecide,
      getAllComs,
      getActions,
      getSpecials,
      getSpecialsSpeed,
      getCondition,
      getConditionStart,
      getConditionEnd,
      getTriggleType,
      getTriggleMethod,
      getAssociation,
      getAuthType,
      targetTypeChange,
      targetTypeChange2,
      targetComChange,
      targetMethodChange,
      targetPropertyChange,
      targetTriggleMethodChange,
      targetMethodTriggleChange,
      authTypeChange,
      decideChange,
      //allComs,
      eventCollapseHeaderClick,
      updateJson,
      updateScript,
      updateDecideScript,
      updateConditionScript,
      showDeleteConfirm,
      InternalMethod,
      openIcList,
      icListVisibile,
      operatorChange,
      openFormulaList,
      formulaListVisibile,
      animationTypes,
      animationState,
      enableTypes,
      handleChange,
      roleList,
      userList
    }
  },
})
</script>
<style lang='scss' scoped>
.topline {
  border-top: var(--datav-config-border);
}

.handleTitleTd {
  width: 30%;
  height: 30px;
  line-height: 30px;
  vertical-align: top;
  white-space: nowrap;
  color: var(--datav-font-color);
}

.handleContentTd {
  width: 60%;
  line-height: 30px;
  overflow: hidden;
}

.deleteTd {
  text-align: center;
  vertical-align: middle;
}

.actionTitle {
  font-size: 9pt;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 200px;
  float: left;
}

.n-tree-select-menu {
  border: 1px solid #000 !important;
}


:deep(.n-base-selection .n-base-selection-tags){
  background-color:#fff;
}

:deep(.n-base-selection .n-base-selection-focus){
  background-color:#fff;
}

:deep(.n-base-selection:not(.n-base-selection--disable).n-base-selection--active .n-base-selection-tags){
  background-color:#fff;
}


:deep(.n-tag .n-tag--closable){
  height:18px !important;
}

:deep(.n-base-selection-tag-wrapper .n-tag){
  height:20px !important;
  font-size: 12px !important;
}

:deep(.n-base-selection-tag-wrapper .n-tag .n-tag__content){
  color:#000 !important;
}


</style>
