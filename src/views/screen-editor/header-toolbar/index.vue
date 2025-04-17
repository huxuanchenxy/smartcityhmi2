<template>
  <div class="datav-header">
    <div class="head-btn-group view-btn-group">
      <n-tooltip :delay="500">
        <template #trigger>
          <div class="head-btn --selected">
            <n-icon class="head-btn-icon">
              <IconEditorCanvas />
            </n-icon>
          </div>
        </template>
        画布编辑器
      </n-tooltip>
      <!-- <n-tooltip :delay="500">
        <template #trigger>
          <div class="head-btn --disabled">
            <n-icon class="head-btn-icon">
              <IconNodal />
            </n-icon>
          </div>
        </template>
        蓝图编辑器
      </n-tooltip> -->
    </div>
    <div class="datav-edit-header">
      <div class="editor-header-wp">
        <div class="editor-config">
          <n-tooltip :delay="500">
            <template #trigger>
              <div :class="['head-btn mr4', { '--selected': layer }]" @click="changeLayerPanel">
                <n-icon class="head-btn-icon">
                  <IconLayer />
                </n-icon>
              </div>
            </template>
            图层
          </n-tooltip>
          <n-tooltip :delay="500">
            <template #trigger>
              <div :class="['head-btn mr4', { '--selected': components }]" @click="changeComponentsPanel">
                <n-icon class="com-list-icon" :class="{ '--rotate': !components }">
                  <IconBox />
                </n-icon>
              </div>
            </template>
            组件列表
          </n-tooltip>
          <n-tooltip :delay="500">
            <template #trigger>
              <div
                :class="['head-btn mr4', { '--selected': config }]"
                @click="changeConfigPanel"
              >
                <n-icon class="head-btn-icon">
                  <IconRpanel />
                </n-icon>
              </div>
            </template>
            右侧面板
          </n-tooltip>
          <n-tooltip :delay="500">
            <template #trigger>
              <div
                :class="['head-btn mr4', { '--selected': toolbox }]"
                @click="changeToolboxPanel"
              >
                <n-icon class="head-btn-icon">
                  <IconToolbox />
                </n-icon>
              </div>
            </template>
            工具箱
          </n-tooltip>
        </div>
        <div class="drawer-actions">
          <n-tooltip :delay="500">
            <template #trigger>
              <div
                :class="['head-btn mr4', { '--selected': filter }]"
                @click="changeFilterPanel"
              >
                <n-icon class="head-btn-icon">
                  <IconFilter />
                </n-icon>
              </div>
            </template>
            数据过滤器
          </n-tooltip>
          <!-- <n-tooltip :delay="500">
            <template #trigger>
              <div :class="['head-btn mr4']">
                <n-icon class="head-btn-icon">
                  <IconMagic />
                </n-icon>
              </div>
            </template>
            美化工具箱
          </n-tooltip> -->
          <!-- <n-tooltip :delay="500">
            <template #trigger>
              <div :class="['head-btn mr4']">
                <n-icon class="head-btn-icon">
                  <IconMobile />
                </n-icon>
              </div>
            </template>
            迁移至移动端
          </n-tooltip> -->
        </div>
      </div>
      <div class="screen-info">
        <n-icon class="workspace-icon" @click="goHome">
          <IconWorkspace />
        </n-icon>
        <span>{{ "工作空间 - " + screen.name }}</span>
      </div>

      <div class="global-actions">
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn mr4" @click="changeFormulaPanel">
              <n-icon class="head-btn-icon">
                <IconFormula />
              </n-icon>
            </div>
          </template>
          配方
        </n-tooltip>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4">
              <n-upload
                :show-file-list="false"
                :action="uploadSetting.url"
                :headers="uploadSetting.headers"
                @finish="importComponents"
              >
                <n-icon class="head-btn-icon">
                  <IconAppend />
                </n-icon>
              </n-upload>
            </div>
          </template>
          追加屏幕
        </n-tooltip>
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4">
              <n-upload
                :show-file-list="false"
                :action="uploadSetting.url"
                :headers="uploadSetting.headers"
                @finish="importScreen"
              >
                <n-icon class="head-btn-icon">
                  <IconImport />
                </n-icon>
              </n-upload>
            </div>
          </template>
          导入
        </n-tooltip>
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4" @click="exportScreen">
              <n-icon class="head-btn-icon">
                <IconExport />
              </n-icon>
            </div>
          </template>
          导出
        </n-tooltip>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4" @click="saveScreen">
              <n-icon class="head-btn-icon">
                <IconSave />
              </n-icon>
            </div>
          </template>
          保存
        </n-tooltip>
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4" @click="goSnapshot">
              <n-icon class="head-btn-icon">
                <IconSnapshot />
              </n-icon>
            </div>
          </template>
          生成快照
        </n-tooltip>
        <!-- <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4">
              <router-link
                :to="{ name: 'MyCase' }"
                target="_blank"
                class="full-a"
              >
                <n-icon class="head-btn-icon">
                  <IconHelp />
                </n-icon>
              </router-link>
            </div>
          </template>
          帮助
        </n-tooltip> -->
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4" @click="goPublish">
              <n-icon class="head-btn-icon">
                <IconRelease />
              </n-icon>
            </div>
          </template>
          发布
        </n-tooltip>
        <n-tooltip :delay="500">
          <template #trigger>
            <div class="head-btn ml4" @click="goPreview">
              <n-icon class="head-btn-icon">
                <IconPreview />
              </n-icon>
            </div>
          </template>
          预览
        </n-tooltip>
      </div>
    </div>
  </div>
  <head-loading />
  <publish-screen v-model="visiblePublish" :project-id="publishAppId" />
  <snapshot v-model="visibleSnapshot" :project-id="snapshotAppId" />
  <formula/>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import {
  UploadCustomRequestOptions,
  UploadFileInfo,
  useMessage,
} from 'naive-ui'
import { PanelType, ToolbarModule } from '@/store/modules/toolbar'
//import { FilterModule } from '@/store/modules/filter'
import { EditorModule } from '@/store/modules/editor'
//import { saveScreen } from '@/api/screen'
import {
  IconEditorCanvas,
  //IconNodal,
  IconBox,
  IconRpanel,
  IconToolbox,
  IconFilter,
  //IconMagic,
  //IconMobile,
  IconWorkspace,
  IconSnapshot,
  //IconHelp,
  IconLayer,
  IconRelease,
  IconPreview,
  IconSave,
  IconExport,
  IconImport,
  IconAppend,
  IconFormula
} from '@/icons'
import HeadLoading from './head-loading.vue'
// import PublishScreen from '../../my-project/publish-screen.vue'
import Snapshot from '../../my-project/Snapshot.vue'
import PublishScreen from '../../my-project/publish.vue'
import Formula from '../../screen-editor/formula-panel/index.vue'
import * as configImagePropJson from '@/../public/templates/configImageProp.json'
import {
  configImagePropModel,
  configImagePropModelAttribute,
  exportImageListModel,
} from '@/components/configImagePropModel'

import request from '@/utils/request'
import { getApiUrl } from '@/utils/apiUrl'

import { saveAs } from 'file-saver'
import { getToken } from '@/utils/token-util'

export default defineComponent({
  name: 'HeaderToolber',
  components: {
    HeadLoading,
    PublishScreen,
    Snapshot,
    Formula,
    IconEditorCanvas,
    //IconNodal,
    IconBox,
    IconRpanel,
    IconToolbox,
    IconFilter,
    //IconMagic,
    //IconMobile,
    IconWorkspace,
    IconSnapshot,
    //IconHelp,
    IconLayer,
    IconRelease,
    IconPreview,
    IconSave,
    IconExport,
    IconImport,
    IconAppend,
    IconFormula
  },
  setup() {
    const visibleSnapshot = ref(false)
    const visiblePublish = ref(false)

    const visibleFormula = ref(false);
    const closeFormula = () => {
      visibleFormula.value = false;
    };
    const closeSnapshot = () => {
      visibleSnapshot.value = false
    }

    const closePublish = () => {
      visiblePublish.value = false
    }

    provide('closeSnapshot', closeSnapshot)
    provide('closePublish', closePublish)
    provide('closeFormula', closeFormula)
    // const customRequest = ({
    //   file,
    // }: UploadCustomRequestOptions) => {
    //   //console.log(file.file)
    //   const reader=new FileReader()
    //   reader.readAsText(file.file)
    //   reader.onload = e=>{
    //     let data = e.target.result
    //     //console.log('openfile',e)
    //     const json = JSON.parse(data.toString())
    //     //console.log('openfile',json)
    //     EditorModule.loadScreenFromModel({ model: json,projectId:EditorModule.screen.id,name:EditorModule.screen.name })
    //   }
    // }

    const uploadSetting = ref({
      url: getApiUrl('dashboard/screen/projectImport'),
      headers: { token: getToken() },
    })

    const importScreen = ({
      file,
      event,
    }: {
      file: UploadFileInfo
      event?: ProgressEvent
    }) => {
      //console.log(event)
      //console.log((event?.target as XMLHttpRequest).response)
      const model = JSON.parse((event?.target as XMLHttpRequest).response)
      const project = model.data.project
      const imageList = model.data.imageList as exportImageListModel[]

      const configImageProp =
        configImagePropJson.default as unknown as configImagePropModel[]

      project.coms.forEach(com => {
        let image = imageList.find(r => r.comId == com.id)

        if (image) {
          let setting = configImageProp.find(r => r.ComName == com.name)
          if (setting) {
            setting.Attributes.forEach(
              (attr: configImagePropModelAttribute) => {
                let proplist = attr.path.split('.')
                let imageProp = com.config

                for (let i = 0; i < proplist.length - 1; i++) {
                  imageProp = imageProp[proplist[i]]
                }

                imageProp[proplist[proplist.length - 1]] = getApiUrl(
                  `${import.meta.env.VITE_APP_QINIU_IMAGE}?imageName=${image.newId
                  }`,
                )
              },
            )
          }
        }
      })

      EditorModule.loadScreenFromModel({
        model: project,
        projectId: EditorModule.screen.id,
        name: EditorModule.screen.name,
      })
    }

    const importComponents = ({
      file,
      event,
    }: {
      file: UploadFileInfo
      event?: ProgressEvent
    }) => {
      const model = JSON.parse((event?.target as XMLHttpRequest).response)
      const project = model.data.project
      const imageList = model.data.imageList as exportImageListModel[]

      const configImageProp =
        configImagePropJson.default as unknown as configImagePropModel[]

      project.coms.forEach(com => {
        let image = imageList.find(r => r.comId == com.id)

        if (image) {
          let setting = configImageProp.find(r => r.ComName == com.name)
          if (setting) {
            setting.Attributes.forEach(
              (attr: configImagePropModelAttribute) => {
                let proplist = attr.path.split('.')
                let imageProp = com.config

                for (let i = 0; i < proplist.length - 1; i++) {
                  imageProp = imageProp[proplist[i]]
                }

                imageProp[proplist[proplist.length - 1]] = getApiUrl(
                  `${import.meta.env.VITE_APP_QINIU_IMAGE}?imageName=${image.newId
                  }`,
                )
              },
            )
          }
        }
      })

      EditorModule.appendEditorOption({
        coms: project.coms,
      })
    }

    return {
      visibleSnapshot,
      visiblePublish,
      closeSnapshot,
      closePublish,
      //customRequest,
      uploadSetting,
      importScreen,
      importComponents,
      visibleFormula,
      closeFormula,
      // hideModal,
    }
  },
  data() {
    return {
      //visiblePublish: false,
      //visibleSnapshot: false,
      visibleFormula:false,
      publishAppId: 0,
      snapshotAppId: 0,
      nMessage: useMessage(),
    }
  },
  computed: {
    screen() {
      return EditorModule.screen
    },
    layer() {
      return ToolbarModule.layer.show
    },
    components() {
      return ToolbarModule.components.show
    },
    config() {
      return ToolbarModule.config.show
    },
    toolbox() {
      return ToolbarModule.toolbox.show
    },
    filter() {
      return ToolbarModule.filter.show
    },
    formula(){
      return ToolbarModule.formula.show
    }
  },
  methods: {
    changeLayerPanel() {
      ToolbarModule.setPanelState({
        type: PanelType.layer,
        value: !this.layer,
      })
    },
    changeComponentsPanel() {
      ToolbarModule.setPanelState({
        type: PanelType.components,
        value: !this.components,
      })
    },
    changeConfigPanel() {
      ToolbarModule.setPanelState({
        type: PanelType.config,
        value: !this.config,
      })
    },
    changeToolboxPanel() {
      ToolbarModule.setPanelState({
        type: PanelType.toolbox,
        value: !this.toolbox,
      })
    },
    changeFilterPanel() {
      ToolbarModule.filter.show = !this.filter
    },
    changeFormulaPanel() {
      ToolbarModule.formula.show = !this.formula
    },
    goHome() {
      const route = this.$router.resolve('/')
      window.open(route.href, '_blank', 'noopener=yes,noreferrer=yes')
    },
    goPublish() {
      this.visiblePublish = true
      this.publishAppId = this.screen.id
    },
    goSnapshot() {
      this.visibleSnapshot = true
      this.snapshotAppId = this.screen.id
    },
    async saveScreen() {
      ToolbarModule.addLoading()
      try {
        EditorModule.saveScreen()
        // const data = {
        //   screen: EditorModule.screen,snapshotList
        //   config: EditorModule.pageConfig,
        //   coms: [
        //     ...EditorModule.coms,
        //     ...EditorModule.subComs,
        //   ],
        //   variables: EditorModule.variables,
        //   dataFilters: FilterModule.dataFilters ?? [],
        // }
        // await saveScreen(data)
        this.nMessage.success('应用已保存')
      } catch (error) {
        this.nMessage.error(`保存应用失败：${error}`)
      } finally {
        ToolbarModule.removeLoading()
      }
    },
    async exportScreen() {
      const data = EditorModule.getScreenData
      const configImageProp =
        configImagePropJson.default as unknown as configImagePropModel[]

      const imageList: exportImageListModel[] = []
      data.coms.forEach(com => {
        let imageConfig = configImageProp.find(r => r.ComName == com.name)
        let comConfig = com.config
        if (imageConfig) {
          imageConfig.Attributes.forEach(detail => {
            let attrList = detail.path.split('.')
            let configAttr = comConfig[attrList[0]]
            for (let i = 1; i < attrList.length; i++) {
              configAttr = configAttr[attrList[i]]
            }

            const url = configAttr as string
            if (url && url.indexOf('data/originPic') < 0) {
              let fromInternet =
                url.indexOf(
                  `${import.meta.env.VITE_APP_QINIU_IMAGE}?imageName=`,
                ) < 0
              let imageUrl = null
              let imageId = null
              if (fromInternet) {
                imageUrl = url
              } else {
                imageId = url.split(
                  `${import.meta.env.VITE_APP_QINIU_IMAGE}?imageName=`,
                )[1]
              }

              imageList.push({
                comId: com.id,
                attrIndex: detail.index,
                fromInternet: fromInternet,
                imageId: imageId,
                imageUrl: imageUrl,
                newId: null,
              })
            }
          })
        }
      })

      ToolbarModule.addLoading()
      const requestData = { projectId: this.screen.id, data: imageList }
      //console.log('exportScreen urls',imageList,JSON.stringify(requestData))
      EditorModule.saveScreen()
        .then(() => {
          request
            .post(getApiUrl('dashboard/screen/projectExport'), requestData, {
              responseType: 'blob',
            })
            .then(res => {
              const blob = new Blob([res.data])
              saveAs(blob, `大屏-${this.screen.name}.zip`)
            })
            .catch(error => {
              if (error.message) {
                this.nMessage.error(error.message)
              }

              if (error.data.message) {
                this.nMessage.error(error.data.message)
              }
            })
            .finally(() => {
              ToolbarModule.removeLoading()
            })
        })
        .catch(error => {
          if (error.message) {
            this.nMessage.error(error.message)
          }

          if (error.data.message) {
            this.nMessage.error(error.data.message)
          }
          ToolbarModule.removeLoading()
        })
      // .finally(() => {
      //   ToolbarModule.removeLoading()
      // })

      //const blob = new Blob([JSON.stringify(data)])
      //saveAs(blob,'screen.json')
    },
    async goPreview() {
      await this.saveScreen()

      const route = this.$router.resolve({
        name: 'Preview',
        params: {
          screenId: this.screen.id,
        },
      })
      const a = document.createElement('a')
      a.rel = 'noopener, noreferrer'
      a.href = route.href
      a.target = '_blank'
      a.click()
    },
  },
})
</script>

<style lang="scss" scoped>
.datav-header {
  position: relative;
  height: 41px;
  padding-right: 8px;
  display: flex;
  z-index: 100;
  align-items: center;
  user-select: none;
  color: var(--datav-gui-font-color-base);
  //border-bottom: var(--datav-border-dark);
  background: #000;

  .view-btn-group {
    margin: 0 15px;
    z-index: 1;
  }
}

.head-btn {
  width: 40px;
  height: 24px;
  line-height: 26px;
  text-align: center;
  cursor: pointer;
  background: var(--datav-component-bg);
  box-shadow: inset 0 0 0 1px rgba(255, 235, 235, 0.1), 0 0 0 1px #181818;
  transition: 0.2s;

  .head-btn-icon {
    color: #fff;
    font-size: 14px;

    &:not(:first-child) {
      border-left: 1px solid rgba(255, 235, 235, 0.1);
    }
  }

  &:not(.--disabled):hover {
    background: #414750;
  }

  &.--selected {
    background: var(--datav-main-color);

    &+.head-btn {
      border-left-color: transparent;
    }

    &:not(.--disabled):hover {
      background: var(--datav-main-color);
    }
  }

  &.--disabled {
    cursor: not-allowed;

    .head-btn-icon {
      opacity: 0.2;
    }
  }
}

.head-btn-group {
  display: flex;
  box-sizing: border-box;
  background: #1d1e1f;
  border: 1px solid rgba(255, 235, 235, 0.1);
  box-shadow: 0 0 0 1px #181818;

  .head-btn {
    width: 45px;
    border-radius: 0;
    box-shadow: none;
    height: 22px;
    line-height: 24px;
    border-left: 1px solid transparent;
  }
}

.datav-edit-header {
  width: 100%;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  height: 40px;
  z-index: 100;

  .editor-header-wp {
    display: flex;
    overflow: hidden;
    transition: width 0.3s ease;
  }

  .editor-config {
    display: flex;
    width: 300px;
    align-items: center;
    transition: 0.3s ease;
  }

  .drawer-actions {
    width: 90px;
    height: 40px;
    display: flex;
    align-items: center;
  }

  .com-list-icon {
    display: inline-block;
    font-size: 14px;
    color: #fff;

    &.--rotate {
      animation: com-rotate 2s infinite;
      animation-direction: alternate-reverse;
    }
  }

  .screen-info {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    text-align: center;
    cursor: default;
    font-size: 14px;
    max-width: 500px;
    color: var(--datav-gui-font-color-base);
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .workspace-icon {
      margin-right: 8px;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .global-actions {
    position: absolute;
    top: 0;
    right: 8px;
    width: 300px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
  }

  .full-a {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }

  .ml4 {
    margin-left: 4px;
  }

  .mr4 {
    margin-right: 4px;
  }
}

@keyframes com-rotate {
  0% {
    transform: rotateZ(0);
  }

  100% {
    transform: rotateZ(360deg);
  }
}
</style>
