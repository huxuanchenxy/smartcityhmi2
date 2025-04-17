import request from '@/utils/request'

export function getComs(projectId: number) {
  return request.get(`/coms/getComs?id=${projectId}`)
}

export function deleteCom(projectId: number, id: string) {
  return request.post(`/coms/deleteCom?projectId=${projectId}&id=${id}`)
}

export function deleteComs(projectId: number, ids:string[]) {
  const data={
    projectId : projectId,
    idList : ids,
  }
  return request.post(`/coms/deleteComs`, data)
}

export function addCom(data: any) {
  return request.post('/coms/addCom', data)
}

//弃用copyCom
export function copyCom(id: string) {
  return request.post(`/coms/${id}/copy`)
}
