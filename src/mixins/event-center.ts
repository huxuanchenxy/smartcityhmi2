import { DatavComponent } from "@/components/datav-component";
import { ApiModule } from "@/store/modules/api";

import { writeFormula, writeNode } from "@/api/ic";
import { execFilter } from "@/components/data-filter";
import { HandleItemField, IcHandleItemField } from "@/components/data-handle";
import { ApiType } from "@/components/data-source";
import { DatavError } from "@/domains/error";
import { EditorModule } from "@/store/modules/editor";
import { FilterModule } from "@/store/modules/filter";
import { LocalValueModule } from "@/store/modules/localvalue";
import { setNP } from "@/utils/util";
import axios from "axios";
import { JSONPath } from "jsonpath-plus";
import { useMessage } from "naive-ui";
import { getCurrentInstance } from "vue";

export const useEventCenter = (com: DatavComponent) => {
  const nMessage = useMessage();

  // 拿到mitter
  const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter;
  //  监听自定义事件
  mitter.on(com.id, (field: HandleItemField | IcHandleItemField) => {
    switch (field.targetMethodName) {
      case "hide":
        com.hided = true;
        break;
      case "show":
        com.hided = false;
        break;
      case "initData":
        // updateData(JSON.parse(field.params));
        // break;
        com.apiData.source.type = ApiType.static;
        try {
          if (field.params && field.params.length > 0) {
            updateData(JSON.parse(field.params));
          } else {
            const func = new Function(
              "data,getLocalValue,setLocalValue,com,updateData,httpPost,httpGet,SUM,AVG,MAX,MIN,JSONPath",
              field.script
            );
            const jsonData = func(
              field.value,
              LocalValueModule.getLocalData,
              LocalValueModule.setLocalData,
              com,
              updateData,
              httpPost,
              httpGet,
              SUM,
              AVG,
              MAX,
              MIN,
              JSONPath
            );
            updateData(jsonData);
          }
          break;
        } catch (error) {
          throw new DatavError("初始化数据失败", error.toString(), {
            targetId: com.id,
            origin: error
          });
        }
      case "initApi":
        com.apiData.source.type = ApiType.api;

        try {
          if (field.params && field.params.length > 0) {
            const config = JSON.parse(field.params);
            com.apiData.source.config.api = config.api ?? "";
            com.apiData.source.config.apiMethod = config.apiMethod ?? "";
            com.apiData.source.config.apiHeaders = config.apiHeaders ?? "";
            com.apiData.source.config.apiBody = config.apiBody ?? "";
          } else {
            const func = new Function(
              "data,getLocalValue,setLocalValue,com,updateData,httpPost,httpGet,SUM,AVG,MAX,MIN,JSONPath",
              field.script
            );
            const config = func(
              field.value,
              LocalValueModule.getLocalData,
              LocalValueModule.setLocalData,
              com,
              updateData,
              httpPost,
              httpGet,
              SUM,
              AVG,
              MAX,
              MIN,
              JSONPath
            );

            com.apiData.source.config.api = config.api;
            com.apiData.source.config.apiMethod = config.apiMethod;
            com.apiData.source.config.apiHeaders = config.apiHeaders;
            com.apiData.source.config.apiBody = config.apiBody;
          }

          ApiModule.requestData({
            comId: com.id,
            aConfig: com.apis.source,
            adConfig: com.apiData.source
          }).then(res => {
            // 使用过滤器筛选数据
            if (com.apiData.source.config.useFilter) {
              res = execFilter(FilterModule.dataFilters, com.apiData.source.pageFilters, res);
            }
            updateData(res);
          });

          break;
        } catch (error) {
          throw new DatavError("初始化接口失败", error.toString(), {
            targetId: com.id,
            origin: error
          });
        }
      case "initConfig": //初始化组件配置
        const func = new Function(
          "data,getLocalValue,setLocalValue,com,updateData,httpPost,httpGet,SUM,AVG,MAX,MIN,JSONPath",
          field.script
        );
        com.config = func(
          field.value,
          LocalValueModule.getLocalData,
          LocalValueModule.setLocalData,
          com,
          updateData,
          httpPost,
          httpGet,
          SUM,
          AVG,
          MAX,
          MIN,
          JSONPath
        );
        break;
      case "filter":
        console.log("filter", field.params);
        //todo
        break;
      case "custom":
        try {
          const func = new Function(
            "data,getLocalValue,setLocalValue,com,updateData,httpPost,httpGet,SUM,AVG,MAX,MIN,JSONPath",
            field.script
          );
          func(
            field.value,
            LocalValueModule.getLocalData,
            LocalValueModule.setLocalData,
            com,
            updateData,
            httpPost,
            httpGet,
            SUM,
            AVG,
            MAX,
            MIN,
            JSONPath
          );
          break;
        } catch (error) {
          throw new DatavError("自定义事件执行失败", error.toString(), {
            targetId: com.id,
            origin: error
          });
        }
      case "special":
        com.special = "";
        if (field.special.indexOf("In") > -1) {
          setTimeout(function() {
            com.hided = false;
          }, 20);
        }
        setTimeout(function() {
          com.special =
            field.special +
            " " +
            (field.specialTimer ?? 1000) +
            "ms " +
            (field.specialType ?? "ease");

          if (field.special.indexOf("Out") > -1) {
            setTimeout(function() {
              com.hided = true;
            }, field.specialTimer ?? 1000);
          }
        }, 0);
        break;
      case "broadcast":
        const webui = JSON.parse(field.params);
        if ((window as any).ue == null || (window as any).ue.interface == null) {
          return;
        }

        (window as any).ue.interface.broadcast(webui.name, JSON.stringify(webui.param));

        console.log(webui.name + "," + JSON.stringify(webui.param));
        break;
      case "broadcast1":
        try {
          const func = new Function(
            "data,getLocalValue,setLocalValue,com,updateData,httpPost,httpGet,SUM,AVG,MAX,MIN,JSONPath",
            field.script
          );
          const jsonData = func(
            field.value,
            LocalValueModule.getLocalData,
            LocalValueModule.setLocalData,
            com,
            updateData,
            httpPost,
            httpGet,
            SUM,
            AVG,
            MAX,
            MIN,
            JSONPath
          );

          if ((window as any).ue == null || (window as any).ue.interface == null) {
            console.log("没有ue");
            return;
          } else {
            console.log("有ue");
            (window as any).ue.interface.broadcast("YP", jsonData);
          }
          break;
        } catch (error) {
          throw new DatavError("飘视底座事件传送失败", error.toString(), {
            targetId: com.id,
            origin: error
          });
        }

      case "broadcast2":
        const webui2 = JSON.parse(field.params);
        if ((window as any).ue == null || (window as any).ue.interface == null) {
          return;
        }

        (window as any).ue.interface.broadcast(
          webui2.type ?? "PSAPI",
          JSON.stringify(
            setupFunctionJson(
              webui2.functionName,
              webui2.functionParameters,
              webui2.backFunctionName
            )
          )
        );
        break;
      case "broadcast3":
        try {
          const func = new Function(
            "data,getLocalValue,setLocalValue,com,updateData,httpPost,httpGet,SUM,AVG,MAX,MIN,JSONPath",
            field.script
          );
          const jsonData = func(
            field.value,
            LocalValueModule.getLocalData,
            LocalValueModule.setLocalData,
            com,
            updateData,
            httpPost,
            httpGet,
            SUM,
            AVG,
            MAX,
            MIN,
            JSONPath
          );

          if ((window as any).ue == null || (window as any).ue.interface == null) {
            return;
          }

          (window as any).ue.interface.broadcast(
            jsonData.type ?? "PSAPI",
            JSON.stringify(
              setupFunctionJson(
                jsonData.functionName,
                jsonData.functionParameters,
                jsonData.backFunctionName
              )
            )
          );
          break;
        } catch (error) {
          throw new DatavError("飘视底座事件传送失败", error.toString(), {
            targetId: com.id,
            origin: error
          });
        }
      case "screenevents":
        const eventValue = JSON.parse(field.params);
        const type = eventValue.backFunctionName;

        const uefields = com.handles.screenevents.fields;
        uefields.forEach(uefield => {
          const uetype = uefield.uetype;
          if (type === uetype) {
            uefield.value = eventValue.value;
            mitter.emit(uefield.targetComId, uefield);
          }
        });
        break;
      case "property":
        let icPropertyField = field as IcHandleItemField;
        if (icPropertyField.bindType == "bind") {
          setNP(com, icPropertyField.targetProperty, icPropertyField.value);
        } else {
          // bindType = condition
          if (icPropertyField.hasDecideScript && icPropertyField.decideScript) {
            try {
              const func = new Function("data,com,path,setNP", icPropertyField.decideScript);
              func(icPropertyField.value, com, icPropertyField.targetProperty, setNP);
            } catch (error) {
              throw new DatavError("过滤条件执行失败", error.toString(), {
                targetId: com.id,
                origin: error
              });
            }
          } else {
            //console.log("未编写执行语句");
          }
        }
        break;
      case "click":
      case "mouseEnter":
      case "mouseLeave":
      case "on":
      case "off":
      case "videoPlayed":
      case "videoEnded":
      case "videoCanplay":
      case "pointIconClick":
        let icEventField = field as IcHandleItemField;
        if (icEventField.association && icEventField.association == "formula") {
          //调用配方集
          if (icEventField.formulaId && icEventField.seq) {
            if (icEventField.targetMethodAuthType == "auth") {
              writeFormula(
                icEventField.formulaId,
                icEventField.formula.seq,
                icEventField.targetMethodAuthUsers,
                icEventField.targetMethodAuthRoles
              ).then(r => {
                if (r.data.code == 500) {
                  nMessage.error(r.data.msg);
                }
              });
            } else {
              writeFormula(icEventField.formulaId, icEventField.formula.seq, [], []);
            }
          }
        } else {
          if (icEventField.bindType == "bind") {
            //直接赋值
            const num = Number(icEventField.value);
            updatePt(icEventField, isNaN(num) ? icEventField.value : num);
          } else {
            if (field.decideScript) {
              const func = new Function(
                "data,getLocalValue,setLocalValue,com,updateData,httpPost,httpGet,SUM,AVG,MAX,MIN,JSONPath",
                field.decideScript
              );
              const jsonData = func(
                field.value,
                LocalValueModule.getLocalData,
                LocalValueModule.setLocalData,
                com,
                updateData,
                httpPost,
                httpGet,
                SUM,
                AVG,
                MAX,
                MIN,
                JSONPath
              );
              if (typeof jsonData == "boolean") {
                updatePt(icEventField, jsonData);
              } else {
                const num = Number(jsonData);
                updatePt(icEventField, isNaN(num) ? jsonData : num);
              }
            }
          }
        }

        break;
    }
  });

  const updatePt = (ic: IcHandleItemField, value: any) => {
    let list = [];
    list.push({
      device: ic.pt.extension.device,
      name: ic.pt.extension.name,
      value: value
    });
    if (ic.targetMethodAuthType == "auth") {
      writeNode(list, ic.targetMethodAuthUsers, ic.targetMethodAuthRoles).then(r => {
        if (r.data.code == 500) {
          nMessage.error(r.data.msg);
        }
      });
    } else {
      writeNode(list, [], []);
    }
  };

  const updateData = params => {
    if (com.apiData.source.config.useFilter) {
      params = execFilter(FilterModule.dataFilters, com.apiData.source.pageFilters, params);
    }
    ApiModule.setData({ comId: com.id, data: { ["source"]: params } });

    if (com.subComs && com.subComs.length > 0) {
      com.subComs.forEach(subComId => {
        const subCom = EditorModule.coms.find(r => r.id == subComId);
        if (subCom && subCom.apiData.source && subCom.apiData.source.type == ApiType.fromParent) {
          let res = null;
          // 使用过滤器筛选数据
          if (subCom.apiData.source.config.useFilter) {
            res = execFilter(FilterModule.dataFilters, subCom.apiData.source.pageFilters, params);
          } else {
            res = params;
          }

          ApiModule.setData({ comId: subComId, data: { ["source"]: res } });
        }
      });
    }
  };

  const httpPost = (url: string, data: any, headers: any, callback: Function) => {
    axios.post(url, data, { headers: headers }).then(res => {
      callback(res);
    });
  };

  const httpGet = (url: string, headers: any, callback: Function) => {
    axios.get(url, { headers: headers }).then(res => {
      callback(res);
    });
  };

  const setupFunctionJson = (funName: string, funParam: any, funCallBack: string) => {
    let data = {
      functionName: funName,
      backFunctionName: funCallBack,
      functionParameters: funParam
    };
    return data;
  };

  const SUM = (list: any[], key?: string) => {
    if (list.length == 0) {
      return 0;
    }
    if (key) {
      return list.reduce((pre, cur) => pre + cur[key], 0);
    } else {
      return list.reduce((pre, cur) => pre + cur, 0);
    }
  };

  const AVG = (list: any[], key?: string) => {
    if (list.length == 0) {
      return 0;
    }
    if (key) {
      return list.reduce((pre, cur) => pre + cur[key], 0) / list.length;
    } else {
      return list.reduce((pre, cur) => pre + cur, 0) / list.length;
    }
  };

  const MAX = (list: any[], key?: string) => {
    if (list.length == 0) {
      return 0;
    }
    if (key) {
      return list.reduce((pre, cur) => {
        return pre > cur[key] ? pre : cur[key];
      }, list[0][key]);
    } else {
      return list.reduce((pre, cur) => {
        return pre > cur ? pre : cur;
      }, list[0]);
    }
  };

  const MIN = (list: any[], key?: string) => {
    if (list.length == 0) {
      return 0;
    }
    if (key) {
      return list.reduce((pre, cur) => {
        return pre < cur[key] ? pre : cur[key];
      }, list[0][key]);
    } else {
      return list.reduce((pre, cur) => {
        return pre < cur ? pre : cur;
      }, list[0]);
    }
  };
};
