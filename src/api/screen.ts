import request from '@/utils/request'
import axios from 'axios'
import { getApiUrl } from '@/utils/apiUrl'
//const PreviewKey = 'DataV-Preview'

export function getScreen(screenId: number) {
  return request.get(`/screen/getScreen?id=${screenId}`)
}

export function saveScreen(data: any) {
  return request.post('/screen/saveScreen', data)
}


export function saveSnapshot(data: any,name:string) {
  return request.post(`/screen/saveSnapshot?name=${encodeURIComponent(name)}`, data)
}

export function deleteSnapshot(screenId: number,snapshotId:number|string) {
  return request.post(`/screen/deleteSnapshot`,{ id:screenId, snapshotId: snapshotId })
}

export function getAllSnapshot(screenId: number) {
  return request.get(`/screen/getAllSnapshots?id=${screenId}`)
}

export function publishScreen(screenId: number,snapshotId:number|string)
{
  return request.post(`/screen/setSnapshot`,{ id:screenId, snapshotId: snapshotId })
}

export function getPublishScreen(screenId: number|string, token:string)
{
  return axios.get(`${getApiUrl(import.meta.env.VITE_APP_BASE_API)}/screen/getSnapshot?id=${screenId}`,{ headers: { token:token } } )
}

export function anonymousLogin(token:string)
{
  // return request.post(`/dashboard/anonymousLogin`,{ password: token } )
  return axios.post(`${getApiUrl(import.meta.env.VITE_APP_BASE_API)}/anonymousLogin`,{ password: token })
}
