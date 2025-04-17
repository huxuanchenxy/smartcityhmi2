import request from '@/utils/request'

export function getModelList(projectId:number) {
  return request.post(`${import.meta.env.VITE_APP_API_Host}/device/server/mgt/threedModel/query`,{ projectId })
}

export function getThumbnail(id: string) {
  return request.get<string>(`${import.meta.env.VITE_APP_API_Host}/threed/thumbnail?id=${id}`)
}

export function getModel(id: string) {
  return request.get(`${import.meta.env.VITE_APP_API_Host}/threed/model?id=${id}`)
}

export function getFile(id: string) {
  return request.get(`${import.meta.env.VITE_APP_API_Host}/threed/file?id=${id}`,{ responseType: 'blob' })
}

export function getMesh(modelId:string) {
  return request.post(`${import.meta.env.VITE_APP_API_Host}/device/server/mgt/threedModelMesh/query`,{ modelId })
}

