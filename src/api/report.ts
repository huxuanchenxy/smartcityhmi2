import icrequest from "@/utils/ic-request";

export function queryReport(params: any) {
  return icrequest.post("/server/mgt/reportModel/query", params);
}

export function queryAllReport(params: any) {
  return icrequest.post("/server/mgt/reportModel/queryAll", params);
}

export function createReport(model: any) {
  return icrequest.post("/server/mgt/reportModel/create", model);
}

export function modifyReport(model: any) {
  return icrequest.post("/server/mgt/reportModel/modify", model);
}

export function deleteReport(id: number) {
  return icrequest.post("/server/mgt/reportModel/delete", { id: id });
}

export function grantReport(params: any) {
  return icrequest.post("/server/mgt/reportModel/grant", params);
}
