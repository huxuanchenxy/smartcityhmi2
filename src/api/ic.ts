import icrequest from "@/utils/ic-request";
import { number } from "echarts";

export function readNode(list: any[]): any {
  return icrequest.post(`/deviceManagement/readNode`, { nodes: list });
}

export function icTreeNode(projectId: any) {
  return icrequest.post(`/deviceManagement/tree`, { projectId: projectId });
}

export function icListNode(
  projectId: any,
  node: any,
  pageNo: number,
  pageSize: number,
  screenId?: number,
  deviceCode?: string,
  nodeCode?: string,
  name?: string,
  description?: string
) {
  return icrequest.post(`/deviceManagement/list`, {
    data: {
      node: node,
      deviceCode: deviceCode,
      name: nodeCode,
      nodeCode: name,
      description: description,
      projectId: projectId,
      screenId: screenId
    },
    pageNo: pageNo,
    pageSize: pageSize
  });
}

// export function writeNode(list: any[]): any {
//   return icrequest.post(`/deviceManagement/writeNode`, { nodes: list });
// }

export function writeNode(list: any[], users: any[], roles: any[]): any {
  return icrequest.post(`/deviceManagement/canvasWriteNode`, {
    nodes: list,
    auth: {
      users: users,
      roles: roles
    }
  });
}

export function formulaNode(projectId: any, pageNo: number, pageSize: number) {
  return icrequest.post(`/server/mgt/formula/queryAll`, { projectId, pageNo, pageSize });
}
export function formulaNodeList(
  projectId: any,
  name: string,
  description: string,
  isShared: number,
  isSelf: number,
  pageNo: number,
  pageSize: number
) {
  return icrequest.post(`/server/mgt/formula/queryAll`, {
    projectId,
    name,
    description,
    isShared,
    isSelf,
    pageNo,
    pageSize
  });
}
export function formulaCreate(model: any) {
  return icrequest.post("/server/mgt/formula/create", model);
}
export function formulaDelete(id: number) {
  return icrequest.post(`/server/mgt/formula/delete`, {
    id: id
  });
}

export function formulaUpdate(model: any) {
  return icrequest.post("/server/mgt/formula/modify", model);
}

export function formulaVerNode(id: number, pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/formulaSeq/query", {
    formulaId: id,
    pageNo,
    pageSize
  });
}
export function formulaVerNodeList(
  id: number,
  name: string,
  showName: string,
  pageNo: number,
  pageSize: number
) {
  return icrequest.post("/server/mgt/formulaSeq/query", {
    formulaId: id,
    name,
    showName,
    pageNo,
    pageSize
  });
}
export function formulaSeqUpdate(model: any) {
  return icrequest.post("/server/mgt/formulaSeq/modify", model);
}

export function formulaSeqCreate(model: any) {
  return icrequest.post("/server/mgt/formulaSeq/create", model);
}

export function formulaSeqDelete(model: any) {
  return icrequest.post("/server/mgt/formulaSeq/delete", model);
}

// export function writeFormula(formulaId: number, seq: number) {
//   return icrequest.post("/deviceManagement/writeFormula", {
//     formulaId: formulaId,
//     seq: seq
//   });
// }

export function writeFormula(formulaId: number, seq: number, users: any[], roles: any[]) {
  return icrequest.post("/deviceManagement/canvasWriteFormula", {
    formulaId: formulaId,
    seq: seq,
    auth: {
      users: users,
      roles: roles
    }
  });
}

export function projectList(pageSize: number) {
  return icrequest.post("/server/mgt/project/query", {
    pageSize
  });
}
export function projectSearch(name: string) {
  return icrequest.post("/server/mgt/project/query", {
    name
  });
}

export function projectCreate(name: string, thumbnail: string) {
  return icrequest.post("/server/mgt/project/create", {
    name,
    thumbnail
  });
}

export function projectUpdate(jsonString: any) {
  return icrequest.post("/server/mgt/project/modify", jsonString);
}
export function projectDelete(id: number) {
  return icrequest.post("/server/mgt/project/delete", {
    id: id
  });
}

export function dmServerList(pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/dmServer/query", {
    pageNo: pageNo,
    pageSize: pageSize
  });
}
export function dmServerSearch(serverName: string, pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/dmServer/query", {
    serverName,
    pageNo: pageNo,
    pageSize: pageSize
  });
}
export function dmServerAdd(
  serverCode: string,
  serverName: string,
  serverIp: string,
  serverPort: string,
  serverUrl: string,
  description: string
) {
  return icrequest.post("/server/mgt/dmServer/create", {
    serverCode,
    serverName,
    serverIp,
    serverPort,
    serverUrl,
    description
  });
}
export function dmServerDel(id: number) {
  return icrequest.post("/server/mgt/dmServer/delete", {
    id
  });
}
export function dmServerUpdate(
  id: string,
  serverCode: string,
  serverName: string,
  serverIp: string,
  serverPort: string,
  serverUrl: string,
  description: string
) {
  return icrequest.post("/server/mgt/dmServer/modify", {
    id,
    serverCode,
    serverName,
    serverIp,
    serverPort,
    serverUrl,
    description
  });
}

export function alarmRuleList(projectId: any, pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/alarmRule/query", {
    projectId,
    pageNo,
    pageSize
  });
}
export function enumQuery(id: string) {
  return icrequest.post("/server/mgt/enum/query", {
    id
  });
}
export function alarmRuleAdd(
  projectId: any, //项目id
  deviceCode: any, //设备代码
  nodeCode: string, //点位代码
  name: string, //规则描述
  severity: string, //严重程度
  ruleType: number, //规则类型
  interval: number, //报警间隔
  priority: number, //优先级
  ruleDetail: any, //
  isShare: number, //全局共享，1为true，0为false
  enabled: number, //全局共享，1为true，0为false
  resolveType: any, //解决方式
  nodeType: string
) {
  return icrequest.post("/server/mgt/alarmRule/create", {
    projectId,
    deviceCode,
    nodeCode,
    name,
    severity,
    ruleType,
    interval,
    priority,
    ruleDetail,
    isShare,
    enabled,
    resolveType,
    nodeType
  });
}

export function alarmRuleDel(id: number) {
  return icrequest.post("/server/mgt/alarmRule/delete", {
    id: id
  });
}

export function alarmRuleUpdate(
  id: string,
  projectId: any, //项目id
  deviceCode: any, //设备代码
  nodeCode: string, //点位代码
  name: string, //规则描述
  severity: string, //严重程度
  ruleType: number, //规则类型
  interval: number, //报警间隔
  priority: number, //优先级
  ruleDetail: any, //
  isShare: number, //全局共享，1为true，0为false
  enabled: number, //全局共享，1为true，0为false
  resolveType: any, //解决方式
  nodeType: string
) {
  return icrequest.post("/server/mgt/alarmRule/modify", {
    id,
    projectId,
    deviceCode,
    nodeCode,
    name,
    severity,
    ruleType,
    interval,
    priority,
    ruleDetail,
    isShare,
    enabled,
    resolveType,
    nodeType
  });
}

export function alarmRulequery(
  projectId: any,
  nodeCode: string,
  severity: any,
  isShare: number,
  local: number,
  pageNo: number,
  pageSize: number
) {
  return icrequest.post("/server/mgt/alarmRule/query", {
    projectId,
    nodeCode,
    severity,
    isShare,
    local,
    pageNo,
    pageSize
  });
}

export function alarmHistoryList(projectId: any, pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/alarmHistory/query", {
    projectId,
    pageNo,
    pageSize
  });
}

export function alarmHistorySearch(
  projectId: any,
  name: string,
  nodeName: string,
  triggerTimeStart: any,
  triggerTimeEnd: any,
  sortColumn: any,
  sortOrder: any,
  pageNo: number,
  pageSize: number
) {
  return icrequest.post("/server/mgt/alarmHistory/query", {
    projectId,
    name,
    nodeName,
    triggerTimeStart,
    triggerTimeEnd,
    sortColumn,
    sortOrder,
    pageNo,
    pageSize
  });
}

export function alarmRealTimeList(projectId: any, pageNo: number, pageSize: number) {
  return icrequest.post(`/server/mgt/alarmRealTime/query`, {
    projectId,
    pageNo,
    pageSize
  });
}

export function alarmRealSearch(
  projectId: any,
  name: string,
  nodeName: string,
  triggerTimeStart: any,
  triggerTimeEnd: any,
  pageNo: number,
  pageSize: number
) {
  return icrequest.post(`/server/mgt/alarmRealTime/query`, {
    projectId,
    name,
    nodeName,
    triggerTimeStart,
    triggerTimeEnd,
    pageNo,
    pageSize
  });
}

export function setShelved(cacheKey: any) {
  return icrequest.post(`/server/mgt/alarmRealTime/setShelved`, {
    cacheKey
  });
}
export function cancelShelved(cacheKey: any) {
  return icrequest.post(`/server/mgt/alarmRealTime/cancelShelved`, {
    cacheKey
  });
}

export function confirmpolice(cacheKey: any) {
  return icrequest.post(`/server/mgt/alarmRealTime/confirm`, {
    cacheKey
  });
}

export function deviceAllList(projectId: any, pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/device/queryAll", {
    projectId,
    pageNo,
    pageSize
  });
}

export function deviceEnumType() {
  return icrequest.post("/server/mgt/deviceType/query", {});
}

export function deviceAllAdd(
  projectId: any,
  code: string,
  name: string,
  showName: string,
  description: string,
  clz: string,
  config: any,
  isActive: number,
  isShared: number
) {
  return icrequest.post("/server/mgt/device/create", {
    projectId,
    code,
    name,
    showName,
    description,
    clz,
    config,
    isActive,
    isShared
  });
}
export function deviceAllDel(projectId: any, id: number) {
  return icrequest.post("/server/mgt/device/delete", {
    projectId,
    id
  });
}

export function deviceAllquery(
  projectId: any,
  name: string,
  code: string,
  isShared: number,
  isSelf: number,
  pageNo: number,
  pageSize: number
) {
  return icrequest.post("/server/mgt/device/queryAll", {
    projectId,
    name,
    code,
    isShared,
    isSelf,
    pageNo,
    pageSize
  });
}
export function deviceAllupdate(
  projectId: any,
  id: any,
  code: string,
  name: string,
  showName: string,
  description: string,
  clz: string,
  config: any,
  isActive: number,
  isShared: number
) {
  return icrequest.post("/server/mgt/device/modify", {
    projectId,
    id,
    code,
    name,
    showName,
    description,
    clz,
    config,
    isActive,
    isShared
  });
}
export function nodeAllList(projectId: any, pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/node/query", {
    projectId,
    pageNo,
    pageSize
  });
}
export function nodeAllListquery(
  projectId: any,
  deviceCode: string,
  nodeCode: string,
  nodeName: string,
  nodeShowName: string,
  pageNo: number,
  pageSize: number
) {
  return icrequest.post("/server/mgt/node/query", {
    projectId,
    deviceCode,
    nodeCode,
    nodeName,
    nodeShowName,
    pageNo,
    pageSize
  });
}

export function nodequery(projectId: any, deviceCode: string, pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/node/query", {
    projectId,
    deviceCode,
    pageNo,
    pageSize
  });
}

export function nodeListquery(
  projectId: any,
  deviceCode: string,
  nodeName: string,
  nodeCode: string,
  pageNo: number,
  pageSize: number
) {
  return icrequest.post("/server/mgt/node/query", {
    projectId,
    deviceCode,
    nodeName,
    nodeCode,
    pageNo,
    pageSize
  });
}

export function queryStatus(deviceCode: string) {
  return icrequest.post("/server/mgt/device/queryStatus", {
    deviceCode
  });
}

export function reconnect(deviceCode: string) {
  return icrequest.post("/deviceManagement/reconnect", {
    deviceCode
  });
}

export function deviceTree(deviceCode: string) {
  return icrequest.post("/server/mgt/device/tree", {
    deviceCode
  });
}

export function deviceDelete(projectId: any, id: number) {
  return icrequest.post("/server/mgt/node/delete", {
    projectId,
    id
  });
}

export function deviceModify(
  projectId: any,
  id: any,
  deviceCode: string,
  nodeCode: string,
  nodeName: string,
  name: string,
  nodeShowName: string,
  description: string,
  samplingInterval: any,
  isSubscribe: number,
  isPush: number,
  isSave: number,
  isRead: number,
  isPolling: number
) {
  return icrequest.post("/server/mgt/node/modify", {
    projectId,
    id,
    deviceCode,
    nodeCode,
    nodeName,
    name,
    nodeShowName,
    description,
    samplingInterval,
    isSubscribe,
    isPush,
    isSave,
    isRead,
    isPolling
  });
}
export function deviceinitial(deviceCode: string, data: any) {
  return icrequest.post("/dmNode/initial", {
    deviceCode,
    data
  });
}

export function devicedownloadTpl() {
  return icrequest.post("/dmNode/downloadTpl", {}, { responseType: "blob" });
}

export function deviceimports(formData: any) {
  return icrequest.post("/dmNode/import", formData);
}

export function devicereload(deviceCode: string) {
  return icrequest.post("/deviceManagement/reload", {
    deviceCode
  });
}

export function disconnect(projectId: any, deviceCode: string) {
  return icrequest.post("/deviceManagement/disconnect", {
    projectId,
    deviceCode
  });
}

export function deviceReconnect(projectId: any, deviceCode: string) {
  return icrequest.post("/deviceManagement/reconnect", {
    projectId,
    deviceCode
  });
}

export function deviceInitNode(projectId: any, deviceCode: string) {
  return icrequest.post("/deviceManagement/initNode", {
    projectId,
    deviceCode
  });
}

export function deviceRecord(projectId: any, deviceCode: string, pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/log/query", {
    projectId,
    deviceCode,
    pageNo,
    pageSize
  });
}

export function menuDefault() {
  return icrequest.post("/server/authority/menu/default");
}

export function variableList(projectId: any, pageNo: number, pageSize: number) {
  return icrequest.post("/server/mgt/variable/queryAll", {
    projectId,
    pageNo,
    pageSize
  });
}
export function variablequeryList(
  projectId: any,
  name: string,
  showName: string,
  isShared: number,
  isSelf: number,
  pageNo: number,
  pageSize: number
) {
  return icrequest.post("/server/mgt/variable/queryAll", {
    projectId,
    name,
    showName,
    isShared,
    isSelf,
    pageNo,
    pageSize
  });
}
export function variableCreate(
  projectId: any,
  name: string,
  showName: string,
  deviceCode: string,
  nodeCode: string,
  description: string,
  isShared: number,
  isSave: number
) {
  return icrequest.post("/server/mgt/variable/create", {
    projectId,
    name,
    showName,
    deviceCode,
    nodeCode,
    description,
    isShared,
    isSave
  });
}
export function variableModify(
  projectId: any,
  id: number,
  name: string,
  showName: string,
  deviceCode: string,
  nodeCode: string,
  description: string,
  isShared: number,
  isSave: number,
  value: string,
  valueType: string
) {
  return icrequest.post("/server/mgt/variable/modify", {
    projectId,
    id,
    name,
    showName,
    deviceCode,
    nodeCode,
    description,
    isShared,
    isSave,
    value,
    valueType
  });
}
export function variableDelete(projectId: any, id: number) {
  return icrequest.post("/server/mgt/variable/delete", {
    projectId,
    id
  });
}

export function queryHostComputer(params: {
  projectId: number;
  name: string;
  description: string;
  pageNo: number;
  pageSize: number;
}) {
  return icrequest.post("/server/mgt/vans/query", params);
}

export function addHostComputer(data: {
  id: number | null;
  projectId: number;
  name: string;
  description: string;
}) {
  return icrequest.post("/server/mgt/vans/create", data);
}

export function updateHostComputer(data: {
  id: number | null;
  projectId: number;
  name: string;
  description: string;
}) {
  return icrequest.post("/server/mgt/vans/modify", data);
}

export function deleteHostComputer(id: number) {
  return icrequest.post("/server/mgt/vans/delete", { id });
}

//查询项目所有可用控制器状态
export function getAllDeviceStatus(projectId: number) {
  return icrequest.post("/server/mgt/device/queryAll", { projectId: projectId });
}
