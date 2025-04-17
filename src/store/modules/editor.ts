import { Action, Module, Mutation, VuexModule, config, getModule } from "vuex-module-decorators";
import { ComType, DatavComponent } from "@/components/datav-component";
import { IcHandleItemField, PtEventModel } from "@/components/data-handle";
import { PageConfig, PageVariable } from "@/domains/editor";
import { cloneDeep, debounce } from "lodash-es";
import { generateId, getTextParams } from "@/utils/util";
import { saveScreen, saveSnapshot } from "@/api/screen";

import { FilterModule } from "@/store/modules/filter";
import { IcModule } from "@/store/modules/icstate";
import IcPanel from "@/components/ic/ic-panel/src/ic-panel";
import { MoveType } from "@/utils/enums";
import { Project } from "@/domains/project";
import { calcIntersectingLines } from "@/utils/intersecting-line-util";
//import { getComs, deleteCom, addCom, copyCom,deleteComs } from '@/api/coms'
import { getComs } from "@/api/coms";
import { getProject } from "@/api/project";
import { group } from "@/components/group/group/src/group";
import store from "@/store";

config.rawError = true;

/* region interfaces */

interface MoveComDto {
  id: string;
  moveType: MoveType;
}

export interface AlignLine {
  top: number;
  bottom: number;
  left: number;
  right: number;
  vertical: number;
  horizontal: number;
  enable: boolean;
  show: boolean;
}

export interface IEditorState {
  editMode: boolean;
  loadCompleted: boolean;
  screen: Partial<Project>;
  pageConfig: PageConfig;
  coms: DatavComponent[];
  refCom?: DatavComponent; //对齐操作的标记组件
  subComs: DatavComponent[];
  canvas: {
    scale: number;
    width: number;
    height: number;
  };
  guideLine: {
    h: number[];
    v: number[];
  };
  referLine: {
    enable: boolean;
  };
  alignLine: AlignLine;
  contextMenu: {
    show: boolean;
  };
  variables: PageVariable;
  isNormalResizeMode: boolean;
}

/* endregion */

const findComIndex = (coms: DatavComponent[], id: string) => {
  return coms.findIndex(c => c.id === id);
};

const findCom = (coms: DatavComponent[], id: string) => {
  return coms.find(c => c.id === id);
};

const findComs = (coms: DatavComponent[], parentId?: string) => {
  return coms.filter(c => c.parentId === parentId);
};

const selectCom = (coms: DatavComponent[], id?: string, ctrl?: boolean) => {
  coms.forEach(com => {
    if (com.id === id) {
      com.selected = true;

      if (EditorModule.selectedComs.length == 1) {
        EditorModule.setRefCom(com);
      }
    } else {
      if (!ctrl) {
        com.selected = false;
        EditorModule.setRefCom(null);
      }
    }
    com.hovered = false;
  });
};

const cancelSelect = (coms: DatavComponent[]) => {
  coms.forEach(com => {
    com.hovered = false;
    com.selected = false;
    // if (com.type === ComType.layer) {
    //   cancelSelect(com.children)
    // }
  });
};

const confirmSelect = (
  coms: DatavComponent[],
  id: string,
  pid: string,
  multiple = false,
  callback?: Function
) => {
  for (let i = 0, len = coms.length; i < len; i++) {
    const com = coms[i];
    com.hovered = false;
    if (multiple) {
      if (com.id === id) {
        com.selected = !com.selected;
        if (com.parentId != pid) {
          callback?.();
          com.selected = true;
          break;
        }
      }
    } else {
      com.selected = com.id === id;
    }

    // if (com.type === ComType.layer) {
    //   confirmSelect(com.children, id, pid, multiple, callback)
    // }
  }
};

@Module({ dynamic: true, store, name: "editor" })
class Editor extends VuexModule implements IEditorState {
  editMode = false;
  loadCompleted = false;
  screen: Partial<Project> = {
    id: 0,
    name: "",
    share: "",
    thumbnail: "",
    groupId: 0
  };

  pageConfig: PageConfig = {
    width: 1920,
    height: 1080,
    bgimage: "data/originPic/bj.png",
    bgcolor: "rgba(13,42,67,0)",
    grid: 1,
    screenshot: "",
    zoomMode: 1,
    useWatermark: true,
    styleFilterParams: {
      enable: false,
      hue: 0,
      saturate: 100,
      brightness: 100,
      contrast: 100,
      opacity: 100
    },
    tokenSettings: []
  };

  coms: DatavComponent[] = [];
  subComs: DatavComponent[] = [];
  refCom: DatavComponent = null;

  canvas = {
    scale: 0.2,
    width: 1920,
    height: 1080
  };

  guideLine: {
    h: number[];
    v: number[];
  } = {
    h: [],
    v: []
  };

  referLine = {
    enable: true
  };

  alignLine = {
    enable: false,
    show: false,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    vertical: 0,
    horizontal: 0
  };

  contextMenu = {
    show: false
  };

  eyeView = {
    x: 0,
    y: 0,
    show: true
  };

  variables: PageVariable = {
    componentsView: {},
    publishersView: {},
    subscribersView: {}
  };

  isNormalResizeMode = true;

  screenJsonSnapshot: string;

  agent_umbrella_token: string;

  public get selectedCom() {
    return this.coms.find(m => m.selected);
  }

  public get selectedComs() {
    return this.coms.filter(m => m.selected);
  }

  public get getScreenData() {
    if (IcModule.changed) {
      //如果组件的点位配置发生过变更
      let icPanel = EditorModule.coms.find(r => r.alias == "点位信息") as IcPanel;
      if (icPanel != null) {
        icPanel.config.ptList = []; //重置点位配置属性
        EditorModule.coms.forEach(r => {
          if (r.ichandles) {
            let ichandles = Object.values(r.ichandles);
            ichandles.forEach(e => {
              if (e.fields && e.fields.length > 0) {
                e.fields.forEach(x => {
                  let pt = icPanel.config.ptList.find(
                    p => p.propertyName == x.pt.extension.name && p.device == x.pt.extension.device
                  );
                  if (pt) {
                    let fieldItem: IcHandleItemField = x;
                    pt.fields.push(fieldItem);
                  } else {
                    if (!x.association || x.association != "formula") {
                      let ptEventItem: PtEventModel = {
                        device: x.pt.extension.device,
                        instanceName: x.pt.instanceName,
                        instanceType: x.pt.instanceType,
                        propertyName: x.pt.extension.name,
                        description: x.pt.description,
                        extension: x.pt.extension,
                        value: null,
                        fields: [],
                        virtual: x.pt.virtual
                      };
                      let fieldItem: IcHandleItemField = x;
                      //fieldItem.pt = null;
                      ptEventItem.fields.push(fieldItem);
                      icPanel.config.ptList.push(ptEventItem);
                    }
                  }
                });
              }
            });
          }
        });
      }
    }

    const data = {
      screen: EditorModule.screen,
      config: EditorModule.pageConfig,
      coms: [...EditorModule.coms, ...EditorModule.subComs],
      variables: EditorModule.variables,
      dataFilters: FilterModule.dataFilters ?? []
    };
    return data;
  }

  public get getRefCom() {
    return this.refCom;
  }

  @Mutation
  private SET_CANVAS(payload: { scale: number; width: number; height: number }) {
    this.canvas = { ...payload };
  }

  /**
   * 计算对齐线
   */
  @Mutation
  public calcAlignLine(com: DatavComponent) {
    if (!this.alignLine.enable) {
      return;
    }

    const attr = calcIntersectingLines(com, this.coms, this.canvas.scale);
    this.alignLine = { ...this.alignLine, ...attr, show: true };
  }

  /**
   * 隐藏对齐线
   */
  @Mutation
  public hideAlignLine(id?: string) {
    if (!this.alignLine.enable) {
      return;
    }

    if (this.alignLine.enable && this.alignLine.show) {
      this.alignLine.show = false;
      selectCom(this.coms, id, null);
    }
  }

  @Mutation
  public moveCom({ id, moveType }: MoveComDto) {
    const com = findCom(this.coms, id);
    if (com.parentId) {
      const parentCom = findCom(this.coms, com.parentId) as group;
      const i = parentCom.subComs.findIndex(c => c === id);

      switch (moveType) {
        case MoveType.up:
          if (i > 0) {
            parentCom.subComs.splice(i - 1, 0, ...parentCom.subComs.splice(i, 1));
          }
          break;
        case MoveType.down:
          if (i + 1 < parentCom.subComs.length) {
            parentCom.subComs.splice(i + 1, 0, ...parentCom.subComs.splice(i, 1));
          }
          break;
        case MoveType.top:
          if (i > 0) {
            parentCom.subComs.unshift(...parentCom.subComs.splice(i, 1));
          }
          break;
        case MoveType.bottom:
          if (i + 1 < parentCom.subComs.length) {
            parentCom.subComs.push(...parentCom.subComs.splice(i, 1));
          }
          break;
      }
    } else {
      const comOldIndex = findComIndex(this.coms, id);
      let comNewIndex = comOldIndex;
      if (moveType === MoveType.up) {
        while (comNewIndex + 1 < this.coms.length) {
          comNewIndex += 1;
          const anotherCom = this.coms[comNewIndex];
          if (!anotherCom.parentId) {
            this.coms.splice(comNewIndex, 0, ...this.coms.splice(comOldIndex, 1));
            break;
          }
        }
        // if (i + 1 < this.coms.length) {
        //   this.coms.splice(i + 1, 0, ...this.coms.splice(i, 1))
        // }
      } else if (moveType === MoveType.down) {
        while (comNewIndex > 0) {
          comNewIndex -= 1;
          const anotherCom = this.coms[comNewIndex];
          if (!anotherCom.parentId) {
            this.coms.splice(comNewIndex, 0, ...this.coms.splice(comOldIndex, 1));
            break;
          }
        }
        // if (i > 0) {
        //   this.coms.splice(i - 1, 0, ...this.coms.splice(i, 1))
        // }
      } else if (moveType === MoveType.top) {
        if (comOldIndex + 1 < this.coms.length) {
          this.coms.push(...this.coms.splice(comOldIndex, 1));
        }
      } else if (moveType === MoveType.bottom) {
        if (comOldIndex > 0) {
          this.coms.unshift(...this.coms.splice(comOldIndex, 1));
        }
      }
    }
  }

  @Mutation
  public selectCom(params?: { id?: string; ctrl?: boolean }) {
    selectCom(this.coms, params?.id, params?.ctrl);
  }

  @Mutation
  public select(id: string, parentId?: string, multiple = false) {
    if (id) {
      let pid = parentId;
      if (multiple) {
        const scoms = this.selectedComs;
        if (scoms.length > 0) {
          pid = scoms[0].parentId;
        }
      }
      confirmSelect(this.coms, id, pid, multiple, () => {
        cancelSelect(this.coms);
      });
    } else {
      cancelSelect(this.coms);
    }
  }

  @Mutation
  public setEditMode() {
    this.editMode = true;
  }

  @Mutation
  public setLoadState() {
    this.loadCompleted = true;
  }

  @Mutation
  public changeResizeMode(isNormal: boolean) {
    this.isNormalResizeMode = isNormal;
  }

  @Mutation
  public setPublishersView(payload: { id: string; keys: string[]; enable: boolean }) {
    const { id, keys, enable } = payload;
    const pv = this.variables.publishersView;
    const pvkeys = Object.keys(pv);
    const allKeys = new Set([...keys, ...pvkeys]);
    allKeys.forEach(key => {
      if (enable) {
        if (!pvkeys.includes(key)) {
          pv[key] = [id];
        } else if (!pv[key].includes(id)) {
          pv[key].push(id);
        } else if (!keys.includes(key)) {
          pv[key] = pv[key].filter(m => m !== id);
        }
      } else {
        if (pvkeys.includes(key)) {
          pv[key] = pv[key].filter(m => m !== id);
        }
      }

      if (pv[key].length === 0) {
        delete pv[key];
      }
    });
  }

  @Mutation
  public setSubscribersView(payload: { id: string; data: string }) {
    const { id, data } = payload;
    const sv = this.variables.subscribersView;
    const keys = getTextParams(data).map(m => m.substr(1));
    const svkeys = Object.keys(sv);
    const allKeys = new Set([...keys, ...svkeys]);
    for (const key of allKeys) {
      if (keys.length > 0) {
        if (!svkeys.includes(key)) {
          sv[key] = [id];
        } else if (!sv[key].includes(id)) {
          sv[key].push(id);
        } else if (!keys.includes(key)) {
          sv[key] = sv[key].filter(m => m !== id);
        }
      } else {
        if (svkeys.includes(key)) {
          sv[key] = sv[key].filter(m => m !== id);
        }
      }

      if (sv[key].length === 0) {
        delete sv[key];
      }
    }
  }

  @Mutation
  private DELETE_COM(com: DatavComponent) {
    if (com.type === ComType.com) {
      this.coms.splice(findComIndex(this.coms, com.id), 1);

      if (com.parentId) {
        const groupCom = this.coms.find(r => r.id == com.parentId) as group;
        const subComIndex = groupCom.subComs.findIndex(r => r == com.id);
        groupCom.subComs.splice(subComIndex, 1);
      }
    } else if (com.type === ComType.layer) {
      const groupCom = com as group;

      groupCom.subComs.forEach(r => this.coms.splice(findComIndex(this.coms, r), 1));

      this.coms.splice(findComIndex(this.coms, com.id), 1);
    } else {
      this.subComs.splice(findComIndex(this.subComs, com.id), 1);
    }
  }

  @Mutation
  private ADD_COM(com: DatavComponent) {
    this.coms.push(com);
  }

  @Mutation
  private COPY_COM(id: string) {
    // 模拟后端复制
    const getNewCom = (com: DatavComponent, newPosition: boolean, parentId?: string) => {
      const ncom = cloneDeep(com);
      ncom.id = generateId(ncom.name);
      ncom.alias += "_copy";
      if (newPosition) {
        ncom.attr.x += 30;
        ncom.attr.y += 30;
      }

      ncom.hovered = false;
      ncom.selected = false;
      ncom.renameing = false;

      ncom.parentId = parentId;
      ncom.projectId = com.projectId;

      for (const key in ncom.apiData) {
        ncom.apiData[key].id = generateId();
        ncom.apiData[key].comId = ncom.id;
      }

      return ncom;
    };

    const ocom = findCom(this.coms, id);
    if (ocom) {
      const ncom = getNewCom(ocom, true);
      this.coms.push(ncom);

      if (ocom.type == ComType.layer) {
        const groupNew = ncom as group;
        groupNew.subComs = [];

        const nSubComs = findComs(this.coms, ocom.id).map(m => getNewCom(m, false, ncom.id));
        this.coms.push(...nSubComs);
        groupNew.subComs.push(...nSubComs.map(r => r.id));
      }
    }
  }

  @Mutation
  public setEditorOption(payload: {
    screen?: Partial<Project>;
    config?: Partial<PageConfig>;
    coms?: DatavComponent[];
    variables?: PageVariable;
    guideLine?: {
      h: number[];
      v: number[];
    };
  }) {
    if (payload.screen) {
      this.screen = { ...this.screen, ...payload.screen };
    }

    if (payload.config) {
      this.pageConfig = { ...this.pageConfig, ...payload.config };
    }

    if (payload.coms) {
      const coms: DatavComponent[] = [];
      const subComs: DatavComponent[] = [];
      payload.coms.forEach(c => {
        if (c.type === ComType.com || c.type === ComType.layer) {
          coms.push(c);
        } else if (c.type === ComType.subCom) {
          subComs.push(c);
        }
      });
      // payload.coms.filter(r => r.type === ComType.layer).forEach(c => {
      //   c.editing = false
      //   coms.push(c)
      // })
      // payload.coms.filter(r => r.type != ComType.layer).forEach(c => {
      //   if (c.type === ComType.com) {
      //     coms.push(c)
      //   } else if (c.type === ComType.subCom) {
      //     subComs.push(c)
      //   }
      // })

      this.coms = coms;
      this.subComs = subComs;
    }

    if (payload.variables) {
      this.variables = { ...payload.variables };
    }

    if (payload.guideLine) {
      this.guideLine = { ...payload.guideLine };
    }

    //FilterModule.dataFilters=
  }

  @Mutation
  public appendEditorOption(payload: { coms?: DatavComponent[] }) {
    if (payload.coms) {
      const coms: DatavComponent[] = [];
      const subComs: DatavComponent[] = [];
      payload.coms.forEach(c => {
        if (c.type === ComType.com || c.type === ComType.layer) {
          coms.push(c);
        } else if (c.type === ComType.subCom) {
          subComs.push(c);
        }
      });

      coms.forEach(newCom => {
        const oldComIndex = this.coms.findIndex(r => r.id == newCom.id);
        if (oldComIndex >= 0) {
          this.coms.splice(oldComIndex, 1);
        }

        this.coms.push(newCom);
      });

      const tempComs: DatavComponent[] = [];

      this.coms.forEach(r => tempComs.push(r));

      this.coms = [];
      setTimeout(() => {
        this.coms = tempComs;
      }, 1000);
      // this.coms = coms
      // this.subComs = subComs
    }
  }

  @Action
  public async autoCanvasScale(payload: () => { offsetX: number; offsetY: number }) {
    const resize = debounce(() => {
      const offset = payload();
      const width = document.documentElement.clientWidth - offset.offsetX;
      const height = document.documentElement.clientHeight - 98 - 32 - offset.offsetY;

      const a = (width - 120) / this.pageConfig.width;
      const b = (height - 140) / this.pageConfig.height;
      const scale = parseFloat((a > b ? b : a).toFixed(6)) * 100;

      this.setCanvasScale({ scale, ...offset });
    }, 200);

    window.onresize = resize;

    resize();
  }

  @Action
  public async setCanvasScale(payload: { scale: number; offsetX: number; offsetY: number }) {
    let width = document.documentElement.clientWidth - payload.offsetX;
    let height = document.documentElement.clientHeight - 98 - 32 - payload.offsetY;
    const scale = Math.min(Math.max(payload.scale, 10), 200) / 100;

    // 方便计算滚动条 和 标尺
    const deltaW = this.pageConfig.width * scale;
    const deltaH = this.pageConfig.height * scale;
    if (width < deltaW) {
      width = deltaW + 100;
    }

    if (height < deltaH) {
      height = deltaH + 100;
    }

    this.SET_CANVAS({ scale, width, height });
  }

  @Action
  public async loadScreenFromModel(payload: { model: any; projectId: number; name: string }) {
    try {
      payload.model.screen.id = payload.projectId;
      payload.model.screen.name = payload.name;
      this.setEditorOption(payload.model);
      FilterModule.setFilterOption({
        dataFilters: payload.model.dataFilters ?? []
      });
    } catch (error) {
      throw error;
    }
  }

  @Action
  public async loadScreen(projectId: number) {
    console.log("loadScreen");
    try {
      const { data } = await getProject(projectId);
      if (data.code === 200) {
        const { config } = data.data;

        const screenData = {
          screen: {
            id: projectId,
            name: data.data.name,
            groupId: data.data.groupId,
            thumbnail: data.data.thumbnail
          },
          config: {
            bgcolor: config.bgcolor,
            width: config.width,
            height: config.height,
            bgimage: config.bgimage,
            screenshot: config.screenshot,
            zoomMode: config.zoomMode,
            useWatermark: config.useWatermark,
            grid: config.grid,
            styleFilterParams: config.styleFilterParams
          },
          variables: config.variables
        };
        this.setEditorOption(screenData);
      } else {
        throw Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  @Action
  public async loadComs(projectId: number) {
    try {
      const res = await getComs(projectId);
      if (res.data.code === 200) {
        this.setEditorOption({
          coms: res.data.data
        });
      } else {
        throw Error(res.data.message);
      }

      this.screenJsonSnapshot = JSON.stringify(this.getScreenData);
      this.setLoadState(); //加载完控件
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  @Action
  public async deleteCom(com: DatavComponent) {
    this.DELETE_COM(com);
    // try {
    //   const res = await deleteCom(com.projectId, com.id)
    //   if (res.data.code === 200) {
    //     this.DELETE_COM(com)
    //   } else {
    //     throw Error(res.data.message)
    //   }
    // } catch (error) {
    //   throw error
    // }
  }

  @Action
  public async deleteComs(coms: DatavComponent[]) {
    if (!coms || coms.length == 0) {
      return;
    }

    coms.forEach(com => {
      this.DELETE_COM(com);
    });

    // try {
    //   const projectId = coms[0].projectId

    //   const delComs:DatavComponent[] = []

    //   coms.forEach(com => {
    //     delComs.push(com)
    //     if(com.type==ComType.layer)
    //     {
    //       const groupCom = com as group
    //       groupCom.subComs.forEach(subComId=>{
    //         const subCom= findCom(this.coms,subComId)
    //         delComs.push(subCom)
    //       })
    //     }
    //   })

    //   const ids = delComs.map(r=>r.id)
    //   console.log('delComs',delComs)

    //   const res = await deleteComs(projectId, ids)
    //   if (res.data.code === 200) {
    //     coms.forEach(com => {
    //       console.log('this.DELETE_COM',com)
    //       this.DELETE_COM(com)
    //     })
    //   } else {
    //     throw Error(res.data.message)
    //   }
    // } catch (error) {
    //   throw error
    // }
  }

  @Action
  public async addCom(com: DatavComponent) {
    this.ADD_COM(com);
    // try {
    //   const res = await addCom(com)
    //   if (res.data.code === 200) {
    //     this.ADD_COM(com)
    //   } else {
    //     throw Error(res.data.message)
    //   }
    // } catch (error) {
    //   throw error
    // }
  }

  @Action
  public async copyCom(id: string) {
    try {
      // const res = await copyCom(id)
      // if (res.data.code === 200) {
      this.COPY_COM(id);
      // } else {
      //   throw Error(res.data.message)
      // }
    } catch (error) {
      throw error;
    }
  }

  @Action
  public async saveScreen() {
    try {
      if (this.loadCompleted) {
        const data = this.getScreenData;
        await saveScreen(data);
        this.screenJsonSnapshot = JSON.stringify(data);
      } else {
        console.log("组件数据未加载完全，无法进行保存操作，请稍后再试");
      }
    } catch (error) {
      throw error;
    }
  }

  @Action
  public async saveSnapshot(name: string) {
    try {
      const data = this.getScreenData;
      await saveSnapshot(data, name);
      this.screenJsonSnapshot = JSON.stringify(data);
      console.log("save screenJsonSnapshot", this.screenJsonSnapshot);
    } catch (error) {
      throw error;
    }
  }

  @Action
  public async isChanged() {
    const data = this.getScreenData;
    const jsonData = JSON.stringify(data);
    return this.screenJsonSnapshot != jsonData;
  }

  @Mutation
  public setRefCom(com: DatavComponent) {
    this.refCom = com;
  }
}

export const EditorModule = getModule(Editor);
