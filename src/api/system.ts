import request from '@/utils/request'

export function setPublishPassword(pwd:string)
{
  return request.post(`/screen/setPassword`,{ password:pwd })
}
