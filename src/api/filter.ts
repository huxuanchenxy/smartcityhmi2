import request from '@/utils/request'

export function getFilters(projectId: number) {
  return request.get(`/filter/getFilters?id=${projectId}`)
}

export function createFilter(data: any) {
  return request.post('/filter/createFilter', data)
}

export function updateFilter(data: any) {
  return request.post(`/filter/updateFilter`, data)
}

export function updateFilterName(data: any) {
  return request.post(`/filter/updateFilterName`, data)
}

export function deleteFilter(projectId: number, id: number) {
  return request.post(`/filter/deleteFilter?projectId=${projectId}&id=${id}`)
}
