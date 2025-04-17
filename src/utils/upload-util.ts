import { getApiUrl } from './apiUrl'

interface FileInfo {
  name: string
  size: number
}

interface UploadOption {
  allowType: string
  allowSize: number
}

export const uploadHost = getApiUrl(`${import.meta.env.VITE_APP_QINIU_UPLOAD}`)   //import.meta.env.VITE_APP_QINIU_UPLOAD || ''
export const previewHost = getApiUrl(`${import.meta.env.VITE_APP_QINIU_IMAGE}`) //import.meta.env.VITE_APP_CDN || ''
export const uploadCoverHost = getApiUrl(`${import.meta.env.VITE_APP_QINIU_UPLOADCOVER}`)

export const validAllowImg = (file: FileInfo, option: Partial<UploadOption>) => {
  const opt: UploadOption = {
    allowType: 'gif|jpeg|jpg|png',
    allowSize: 20,
    ...option,
  }

  const regx = new RegExp(`\\.(${opt.allowType})$`, 'i')
  if (!regx.test(file.name)) {
    return `上传图片的格式只能是 ${opt.allowType} 中的一种！`
  }

  if (file.size / 1024 / 1024 > opt.allowSize) {
    return `上传图片的大小不能超过 ${opt.allowSize}MB！`
  }

  return null
}

export const dataURLtoBlob = (dataURL: string) => {
  const data = window.atob(dataURL.split(',')[1])
  const ia = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    ia[i] = data.charCodeAt(i)
  }
  return new Blob([ia], { type: 'image/png' })
}
