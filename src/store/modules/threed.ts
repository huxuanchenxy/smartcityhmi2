import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'
import { ThreedModel } from '@/utils/types'
import * as api from '@/api/threed'

config.rawError = true

/* region interfaces */

export interface IThreedState {
    dataThreedModels: ThreedModel[]
  }

/* endregion */

  @Module({ dynamic: true, store, name: 'threed' })
class threed extends VuexModule implements IThreedState {
    public dataThreedModels: ThreedModel[] = []

    @Mutation
    public setThreedModel(payload: {
      dataThreedModels: ThreedModel[]
    }) {
      this.dataThreedModels = payload.dataThreedModels
    }

    @Action
    public async loadThreedModelList(projectId: number) {
      try {
        const res = await api.getModelList(projectId)
        if (res.data.code === 200) {
          this.setThreedModel({
            dataThreedModels: res.data.data,
          })
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    }
  }

export const ThreedModule = getModule(threed)
