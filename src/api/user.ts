import request from "@/utils/request";
import axios from "axios";
import requestic from "@/utils/ic-request";
import { getApiUrl } from "@/utils/apiUrl";

export function login(userName: string, password: string, code: string) {
  return requestic.post("/home/login", { userName, password, code });
}

export function updatePassword(userName: string, password: string, newpassword) {
  return axios.post(getApiUrl(`${import.meta.env.VITE_APP_BASE_API}/user/updatePassword`), {
    userName,
    password,
    newpassword
  });
}

export function logout() {
  return requestic.post("/home/logout");
}

//当前登录用户信息
export function getInfo() {
  return requestic.get("/server/authority/user/info");
}

//查询用户
export function queryUser(data: any) {
  return requestic.post("/server/authority/user/query", data);
}

//创建用户
export function createUser(data: any) {
  return requestic.post("/server/authority/user/create", data);
}

//批量创建用户
export function batchCreateUser(name: string, count: number, roles: any[]) {
  return requestic.post("/server/authority/user/batchCreate", {
    name: name,
    count: count,
    roles: roles
  });
}

//修改密码
export function modifyPwd(userName: string, password: string, newPassword: string) {
  return requestic.post("/server/authority/user/modifyPwd", {
    userName: userName,
    password: password,
    newPassword: newPassword
  });
}

//重置密码
export function resetPwd(userName: string) {
  return requestic.post("/server/authority/user/resetPwd", { userName: userName });
}

//修改用户
export function modifyUser(data: any) {
  return requestic.post("/server/authority/user/modify", data);
}

//启用用户
export function enableUser(id: number) {
  return requestic.post("/server/authority/user/enable", { id: id });
}

//禁用用户
export function disableUser(id: number) {
  return requestic.post("/server/authority/user/disable", { id: id });
}

//查询角色
export function queryRole(data: any) {
  return requestic.post("/server/authority/role/query", data);
}

//新增角色
export function createRole(data:any) {
  return requestic.post("/server/authority/role/create", data);
}

//修改角色
export function modifyRole(data:any) {
  return requestic.post("/server/authority/role/modify", data);
}

//删除角色
export function deleteRole(id: number) {
  return requestic.post("/server/authority/role/delete", { id: id });
}

//菜单默认权限
export function getRoleMenuTree() {
  return requestic.post("server/authority/menu/default", {});
}

//查询菜单权限
export function getRolePermissions() {
  return requestic.post("/server/authority/menu/permissions", {});
}
