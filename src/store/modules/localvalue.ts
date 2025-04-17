import {
  VuexModule, Module, Mutation, Action, getModule, config,
} from 'vuex-module-decorators'
import store from '@/store'


export interface ILocalValueState {
  localData: Record<string, any>
}

/* endregion */

@Module({ dynamic: true, store, name: 'global' })
class LocalValue extends VuexModule implements ILocalValueState {
  public localData: Record<string, any> = {}

  @Mutation
  private SET_LOCALDATA(payload: { key: string; value: any; }) {
    this.localData[payload.key] = payload.value;
  }

  @Action
  public async setLocalData(payload: { key: string; value: any; }) {
    this.SET_LOCALDATA(payload)
  }

  @Action
  public async getLocalData(key: string): Promise<any> {
    return this.localData[key];
  }
}

export const LocalValueModule = getModule(LocalValue)
