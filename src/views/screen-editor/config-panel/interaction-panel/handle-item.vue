<template>
  <div class="event">
    <div v-if="visible" class="variables">
      <n-collapse accordion arrow-placement="left" :expanded-names="item.lastTargetName"
        @item-header-click="eventCollapseHeaderClick">
        <n-collapse-item v-for="(f, idx) in item.fields" :key="idx" :name="f.name">
          <template #header>
            <div style="width: 100%">
              <div class="actionTitle">
                {{ f.targetComAlias == null ? "?" : f.targetComAlias }} -
                {{ f.targetMethodTitle == null ? "?" : f.targetMethodTitle }}
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
              <tr
                v-show="item.eventName == 'refreshData' || item.eventName == 'clickPoint' || item.eventName == 'reviceSocket' || item.eventName == 'onmessage' || item.eventName == 'itemClick'">
                <td class="handleTitleTd">过滤条件</td>
                <td class="handleContentTd">
                  <n-select v-model:value="f.hasDecideScript" :options="getDecide(f)" size="small" placeholder="请选择"
                    @update:value="decideChange">
                  </n-select>
                </td>
              </tr>
              <tr v-show="item.eventName == 'refreshData' || item.eventName == 'clickPoint'|| item.eventName == 'reviceSocket' || item.eventName == 'onmessage' || item.eventName == 'itemClick'">
                <td colspan="2" style="background-color:rgb(14,16,19);">
                  <div v-show="f.hasDecideScript">
                    <div style="font-size: 12px;margin-top: 5px;margin-bottom: 5px;margin-left:5px;">
                      <span style="color: rgb(86, 156, 214)">function</span>
                      (data,com) {
                    </div>
                    <g-monaco-editor language="javascript" :auto-format="true" :height="250" :code="f.decideScript"
                      :extra="f" full-screen-title="过滤脚本" @blur="updateDecideScript" />
                    <div style="font-size: 12px;margin-left:5px;">}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="handleTitleTd">目标组件</td>
                <td class="handleContentTd ">
                  <!-- <n-select
                    v-model:value="f.targetComId"
                    :options="getAllComs(f)"
                    size="small"
                    @update:value="targetComChange"
                  /> -->
                  <div class="datav-new-select-wp">
                    <n-tree-select v-model:value="f.targetComId" filterable :options="getAllComs(f)" :size="'small'"
                      placeholder="请选择" @update:value="targetComChange">
                      <template #empty>
                        <n-empty description="无数据" />
                      </template>
                    </n-tree-select>
                  </div>
                </td>
              </tr>
              <tr>
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
              <tr v-show="com.id == 'UeMap'">
                <td class="handleTitleTd">事件代码</td>
                <td class="handleContentTd">
                  <n-select v-show="f.targetComId != ''" v-model:value="f.uetype" :options="getUeTypes()" size="small" />
                </td>
              </tr>
              <tr>
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
              <tr v-show="f.targetMethodName == 'special'">
                <td class="handleTitleTd">动画效果</td>
                <td class="handleContentTd">
                  <n-select v-model:value="f.special" :options="getSpecials()" size="small" placeholder="请选择动画效果" />
                </td>
              </tr>
              <tr v-show="f.targetMethodName == 'special'">
                <td class="handleTitleTd">动画速率</td>
                <td class="handleContentTd">
                  <n-select v-model:value="f.specialType" :options="getSpecialsSpeed()" size="small"
                    placeholder="请选择动画速率" />
                </td>
              </tr>
              <tr v-show="f.targetMethodName == 'special'">
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
</template>

<script lang='ts'>
import { defineComponent, ref, PropType, inject, Events, onMounted } from 'vue'
import { IconArrowRight, IconDelete, IconPlus } from '@/icons'
import { HandleItemConfig, HandleItemField } from '@/components/data-handle'
import { ComType, DatavComponent } from '@/components/datav-component'
import { InternalMethod } from '@/components/InternalMethod'
import {
  eventSetting,
  getAllUeTypes,
  getAllSpecialTypes,
  getAllSpecialSpeedTypes,
  getEventSettingBy,
} from '@/components/event-setting'
import { SelectOption } from 'naive-ui'
import { TreeSelectOption } from 'naive-ui'

export default defineComponent({
  name: 'HandleItem',
  components: {
    //IconArrowRight,
    IconDelete,
    //IconPlus,
  },
  props: {
    item: {
      type: Object as PropType<HandleItemConfig>,
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

    const addField = () => {
      doAddField(props.item.eventName)
    }

    const deleteField = (idx: number) => {
      doDeleteField(props.item.eventName, idx)
    }

    // onMounted(()=>{
    //   let el= document.getElementsByClassName('n-base-selection')
    //   let html= el.item(0) as HTMLElement
    //   html.style.color='rgb(38, 44, 51)'
    // })

    // const getAllComs = (field: HandleItemField) => {
    //   let items: { value: string; label: string; item: any; }[] = []

    //   props.coms.forEach(com => {
    //     return items.push({
    //       value: com.id,
    //       label: com.alias,
    //       item: field,
    //     })
    //   })
    //   return items
    // }

    const getAllComs = (field: HandleItemField) => {
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
      console.log(items)
      return items
    }



    const getUeTypes = () => {
      let items: { value: string; label: string; }[] = []
      let ueTypes = getAllUeTypes()
      ueTypes.forEach(uetype => {
        return items.push({
          value: uetype.type,
          label: uetype.name,
        })
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

    const targetComChange = (value: string, option: TreeSelectOption | null | Array<TreeSelectOption | null> | any) => {
      let item: HandleItemField = option.item as HandleItemField
      item.targetMethodName = null
      item.targetMethodTitle = null
      item.params = null
      item.script = null
      item.hasParams = null
      item.hasScript = null
      item.targetComAlias = option.label as string
      item.uetype = null
      //console.log('dropDownListChange', value, option.com)
    }

    const targetMethodChange = (value: string, option: SelectOption) => {
      let item: HandleItemField = option.item as HandleItemField

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
        case InternalMethod.ueMap:
          item.params =
            '{"name":"方法名称","param":{"FunctionName":"","FunctionValue":[{"Key":"","Value":""}]}}'
          break;
        case InternalMethod.ueMap_oldcustom:
          let ueMap_params_old = { action: "方法名称", params: "执行参数" };
          let jsCode_ueMap_old = convertJSCode(ueMap_params_old);
          item.script = `var result= ${jsCode_ueMap_old} ; \n return result;`
          break;
        case InternalMethod.ueMap_new:
          item.params =
            '{"type":"PSAPI","functionName":"方法名称","backFunctionName":"回调函数名","functionParameters":"执行参数"}'
          break;
        case InternalMethod.ueMap_custom:
          let ueMap_params = { type: "PSAPI", functionName: "方法名称", backFunctionName: "回调函数名", functionParameters: "执行参数" };
          let jsCode_ueMap = convertJSCode(ueMap_params);
          item.script = `var result= ${jsCode_ueMap} ; \n return result;`
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
        case InternalMethod.setMapPoint:
          let setMapPoint_params = [{
            name: '散点名称',
            apiUrl: '接口地址,与dataJson二选一',
            dataJson: '散点json 格式\[\{ lng:经度,lat:纬度,params:自定义对象 \}\]',
            iconUrl: '图片地址',
            iconWidth: 40,
            iconHeight: 40,
          }];
          let setMapPoint_jsCode = convertJSCode(setMapPoint_params);
          item.script = `var result= ${setMapPoint_jsCode} ; \n return result;`
          break;
        case InternalMethod.setMapPointAndClear:
          let setMapPointAndClear_params = [{
            name: '散点名称',
            apiUrl: '接口地址,与dataJson二选一',
            dataJson: '散点json 格式\[\{ lng:经度,lat:纬度,params:自定义对象 \}\]',
            iconUrl: '图片地址',
            iconWidth: 40,
            iconHeight: 40,
          }];
          let setMapPointAndClear_jsCode = convertJSCode(setMapPointAndClear_params);
          item.script = `var result= ${setMapPointAndClear_jsCode} ; \n return result;`
          break;
        case InternalMethod.setCenterAndZoom:
          let setCenterAndZoom_params = {
            lng: 121.526077,
            lat: 31.259541,
            zoom: 14
          };
          let setCenterAndZoom_jsCode = convertJSCode(setCenterAndZoom_params);
          item.script = `var result= ${setCenterAndZoom_jsCode} ; \n return result;`
          break;
        case InternalMethod.clearGroupPoint:
          item.params = JSON.stringify({
            name: '要清除的散点名称'
          })
          break;
        case InternalMethod.setHeatMap:
          let setHeatMap_params = {
            dataJson: '热力数据JSON',
            apiUrl: '接口地址',
            maxPixelIntensity: 20,
            minPixelIntensity: 5,
            field: '数据字段名称'
          }
          let setHeatMap_jsCode = convertJSCode(setHeatMap_params);
          item.script = `var result= ${setHeatMap_jsCode} ; \n return result;`
          break;
        case InternalMethod.setHeatMapAndClear:
          let setHeatMapAndClear_params = {
            dataJson: '热力数据JSON',
            apiUrl: '接口地址',
            maxPixelIntensity: 20,
            minPixelIntensity: 5,
            field: '数据字段名称'
          }
          let setHeatMapAndClear_jsCode = convertJSCode(setHeatMapAndClear_params);
          item.script = `var result= ${setHeatMapAndClear_jsCode} ; \n return result;`
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

    const getActions = (item: HandleItemField) => {
      if (!item.targetComId) return []

      let com = props.coms.find(r => r.id == item.targetComId)

      let setting: eventSetting = getEventSettingBy(com?.name)

      let items: {
        value: string
        label: string
        hasParams: boolean
        hasScript: boolean
        item: HandleItemField
        com: any
      }[] = [
          {
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
          }
        ]

      if (setting) {
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
      return items
    }

    const getDecide = (item: HandleItemField) => {
      return [{ value: false, label: "无条件", item: item }, { value: true, label: "自定义", item: item }]
    }

    const decideChange = (value: string, option: SelectOption) => {
      let item: HandleItemField = option.item as HandleItemField;
      if (value) {
        item.decideScript = `var result = true;\nreturn result;`;
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


    return {
      visible,
      //isEnabled,
      addField,
      deleteField,
      //updateField,
      //onEnableChange,
      getDecide,
      getAllComs,
      getActions,
      getUeTypes,
      getSpecials,
      getSpecialsSpeed,
      targetComChange,
      targetMethodChange,
      decideChange,
      //allComs,
      eventCollapseHeaderClick,
      updateJson,
      updateScript,
      updateDecideScript,
      showDeleteConfirm,
      InternalMethod
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
</style>
