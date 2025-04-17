import { VuexModule, Module, Mutation, getModule } from "vuex-module-decorators";
import store from "@/store";

export interface IcStateInterface {
  changed: boolean;
}

@Module({ dynamic: true, store, name: "icstate" })
class IcState extends VuexModule implements IcStateInterface {
  changed = false;

  @Mutation
  public setIcState() {
    this.changed = true;
  }
}

export const IcModule = getModule(IcState);
