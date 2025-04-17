import request from '@/utils/request'
import { getApiUrl } from '@/utils/apiUrl'

export function getUploadImages() {
  return request.get('/file/getImages')
}

export function getUploadImagesUrl(fileName: string) {
  return getApiUrl(`${import.meta.env.VITE_APP_BASE_API}/file/image?imageName=${fileName}`)
}

