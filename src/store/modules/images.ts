import {
    VuexModule, Module, Mutation, Action, getModule, config,
  } from 'vuex-module-decorators'
  import store from '@/store'
  import { DatavUploadImageType } from '@/utils/types'
  import * as api from '@/api/images'
  
  config.rawError = true
  
  /* region interfaces */
  
  export interface IUploadImagesState {
    dataUploadImages: DatavUploadImageType[]
  }
  
  /* endregion */
  
  @Module({ dynamic: true, store, name: 'uploadImages' })
  class UploadImage extends VuexModule implements IUploadImagesState {
    public dataUploadImages: DatavUploadImageType[] = []
  
    @Mutation
    private CREATE_UPLOAD_IMAGES(payload: DatavUploadImageType) {
      this.dataUploadImages.push(payload)
    }
  
    @Mutation
    private DELETE_UPLOAD_IMAGES(payload: number) {
      const index = this.dataUploadImages.findIndex(m => m.resourceId === payload)
      this.dataUploadImages.splice(index, 1)
    }
  
    @Mutation
    public setUploadImages(payload: {
        dataUploadImages: DatavUploadImageType[]
    }) {
      this.dataUploadImages = payload.dataUploadImages
    }
  
    @Action
    public async loadUploadImages(payload: number) {
      try {
        const res = await api.getUploadImages()
        if (res.data.code === 200) {
          this.setUploadImages({
            dataUploadImages: res.data.data,
          })
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    }
  }
  
  export const UploadImagesModule = getModule(UploadImage)
  