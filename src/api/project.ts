import request from '@/utils/request';

export function getProjects() {
  return request.get("/project/getProjects");
}

export function getProjectsByGroup(projectId: string) {
  return request.get(`/project/getProjectsByGroup?groupId=${projectId}`);
}

export function getProject(id: number) {
  return request.get(`/project/getProject?id=${id}`);
}

export function createProject(data: any) {
  return request.post("/project/createProject", data);
}

export function updateProjectName(id: number, name: string) {
  return request.post(`/project/updateProjectName?id=${id}&name=${name}`);
}

export function deleteProject(id: number) {
  return request.post(`/project/deleteProject?id=${id}`);
}

export function moveProject(data: any) {
  return request.post("/project/updateProjectGroup", data);
}

export function copyProject(id: number) {
  return request.post(`/project/copyProject?id=${id}`);
}

export function createProjectGroup(data: any) {
  return request.post("/group/createGroup", data);
}

export function deleteProjectGroup(data: any) {
  return request.post("/group/deleteGroup", data);
}

export function updateProjectGroupName(data: any) {
  return request.post("/group/updateGroup", data);
}

export function getMockTemplates() {
  return request.get("/project/template");
}

export function getPublishInfo(id: number) {
  return request.get(`/project/${id}/publish`);
}

export function publishApp(id: number, data: any) {
  return request.post(`/project/${id}/publish`, data);
}

export function getShareUrl(id: number) {
  return `${window.location.origin}/share/#/screen/${id}`;
}
