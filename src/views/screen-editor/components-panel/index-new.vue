<template>
  <div :class="['component-panel', { '--hide': !visiblePanel }]">
    <div :class="['component-type', { '--hide': !visiblePanel }]">
      <div
        :class="[
          'component-type-detail',
          { '--selected': comType == 'toolbox' },
        ]"
        @click="changeComType('toolbox')"
      >
        <n-tooltip :delay="500">
          <template #trigger>
            <div :class="['head-btn mr4']">
              <n-icon class="head-btn-icon">
                <IconToolbox />
              </n-icon>
            </div>
          </template>
          工具组件
        </n-tooltip>
      </div>
      <div
        :class="['component-type-detail', { '--selected': comType == 'img' }]"
        @click="changeComType('img')"
      >
        <n-tooltip :delay="500">
          <template #trigger>
            <div :class="['head-btn mr4']">
              <n-icon class="head-btn-icon">
                <IconImg />
              </n-icon>
            </div>
          </template>
          图库组件
        </n-tooltip>
      </div>
    </div>
    <div class="components-panel-wrapper" @dragover="dragOver">
      <el-tabs
        tab-position="left"
        @tab-click="handleTabClick"
        class="el-tabs-l1"
      >
        <el-tab-pane v-for="cate in categories" :key="cate.type">
          <template #label>
            <div>
              <g-com-icon :icon="cate.icon" class="com-tab-icon" />
              <span class="com-tab-title">{{ cate.name }}</span>
            </div>
          </template>

          <div class="components-multi-menu">
            <div class="components-single-menu --wider">
              <ul class="components-single-menu-list">
                <li
                  v-for="com in cate.data[0].data"
                  v-show="com.visible == undefined || com.visible"
                  :key="com.name"
                  :title="com.alias"
                  :draggable="com.used"
                  class="components-item three"
                  @dragstart="dragStart($event, com.name, com)"
                  @click="toAddCom(com.name, com.used, com)"
                >
                  <div
                    class="components-item-img"
                    :style="`background-image: url(${com.img});`"
                  ></div>
                  <div class="components-item-text">
                    {{ com.alias }}
                  </div>
                </li>
              </ul>
              <template v-if="cate.data[0].data.length === 0">
                <div v-if="cate.type === 'favorite'" class="favorite-empty">
                  没有收藏组件
                </div>
              </template>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang='ts'>
import { createComponent } from "@/components/datav";
import { classifications } from "@/data/system-components";
import { IconBack, IconImg, IconToolbox } from "@/icons";
import { BlueprintModule } from "@/store/modules/blueprint";
import { EditorModule } from "@/store/modules/editor";
import { PanelType, ToolbarModule } from "@/store/modules/toolbar";
import { cloneDeep } from "lodash-es";
import { useMessage } from "naive-ui";
import { computed, defineComponent, onMounted, ref } from "vue";

type CategoryType = (typeof classifications)[0];

export default defineComponent({
  name: "ComponentsPanel",
  components: {
    //IconSearch,
    IconBack,
    IconToolbox,
    IconImg,
  },
  setup() {
    const comType = ref("toolbox");
    const nMessage = useMessage();
    const favoriteComs = ref([]);
    const visiblePanel = computed(() => ToolbarModule.components.show);

    const cloneCfs: CategoryType[] = cloneDeep(classifications);
    const currentCfs = ref<CategoryType[]>([]);
    const first = { type: "all", name: "全部", icon: "v-icon-view-grid" };

    const categories = computed(() => {
      const list: CategoryType[] = currentCfs.value;
      list.forEach((item) => {
        console.log("item");
        item.data.unshift({
          ...first,
          data: item.data.flatMap((m) => m.data),
        });
      });
      // console.log("list……list^……", list);
      // list.push({
      //   type: 'favorite',
      //   name: '收藏',
      //   icon: 'v-icon-favorite',
      //   data: [{ ...first, data: favoriteComs.value }],
      // })

      return list;
    });

    onMounted(() => {
      currentCfs.value = cloneCfs; //TODO
    });

    const changeVisible = () => {
      ToolbarModule.setPanelState({
        type: PanelType.components,
        value: !visiblePanel.value,
      });
    };

    const handleTabClick = () => {
      if (!visiblePanel.value) {
        ToolbarModule.setPanelState({
          type: PanelType.components,
          value: true,
        });
      }
    };

    const toAddCom = async (comName: string, used: boolean, comObj: any) => {
      if (used) {
        ToolbarModule.addLoading();
        const { pageConfig } = EditorModule;
        // console.log("comName……", comName);
        let com = await createComponent(comName);

        if (comName == "VCustomerComp") {
          com.alias = comObj.alias;
          com.filePath = comObj.filePath;
        }
        // console.log("toAddCom……", com);
        com.attr.x = Math.floor((pageConfig.width - com.attr.w) / 2);
        com.attr.y = Math.floor((pageConfig.height - com.attr.h) / 2);
        com.projectId = EditorModule.screen.id;
        await EditorModule.addCom(com);
        EditorModule.selectCom(com.id);
        ToolbarModule.removeLoading();

        if (com.apis.source) {
          await com.loadData();
          BlueprintModule.datavComponents[com.id].$DATAV_requestData();
        }
      } else {
        nMessage.warning("正在开发中。。。");
      }
    };

    const dragStart = (ev: any, comName: string, com: any) => {
      // console.log("dragStart:::", comName, ev);
      ev.dataTransfer.setData("text", comName);
      ev.dataTransfer.setData("com", JSON.stringify(com));
      // let xx = ev.dataTransfer.getData("text");
      // console.log("xx", xx);
    };

    const dragOver = (ev: DragEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      ev.dataTransfer.dropEffect = "none";
      // console.log("end^……", ev, ev.dataTransfer);
    };

    const changeComType = (type: string) => {
      comType.value = type;
      if (type == "toolbox") {
        currentCfs.value = cloneCfs; //TODO
      }
      if (type == "img") {
        currentCfs.value = cloneCfs; //TODO
      }
    };

    return {
      visiblePanel,
      categories,
      changeVisible,
      handleTabClick,
      toAddCom,
      dragStart,
      dragOver,
      comType,
      changeComType,
    };
  },
});
</script>

<style lang="scss">
//@import './style';
.component-panel {
  flex: none;
  position: relative;
  z-index: 5;
  width: 360px !important;
  height: calc(100vh - 98px);
  display: flex;
  flex-direction: column;
  background-color: #f0f4fd;
  transition: width 0.3s ease;
  overflow: hidden;

  &.--hide {
    width: 98px !important;

    .component-type-detail {
      &.--selected {
        order: -1;
      }
    }
  }

  .component-type {
    width: 360px;
    height: 72px;
    display: flex;
    flex-direction: row;

    &.--hide {
      width: 98px !important;
      overflow: hidden;
    }

    .component-type-detail {
      min-width: 98px;
      width: 180px;
      height: 72px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #e5eaf4;
      color: #3d3d3d;
      cursor: pointer;
      transition: width 0.3s ease;

      &.--selected {
        background-color: #005497;
        color: #ffffff;
      }

      .head-btn {
        width: 32px;
        height: 32px;
        line-height: 32px;
        //padding: 4px;
        text-align: center;
        border-radius: 6px;
        transition: 0.2s;
        margin: 0 5px;

        .head-btn-icon {
          font-size: 30px;
        }

        &.--selected {
          background: #0e62a9;
        }
      }
    }
  }

  .components-panel-wrapper {
    width: 360px;
    height: calc(100vh - 160px);
    flex: 1;
    display: flex;
    position: relative;
    flex-direction: column;
    overflow: hidden;
  }

  .com-tab-icon {
    font-size: 16px;
    font-weight: normal;
  }

  .com-tab-title {
    font-size: 12px;
    width: 100%;
    line-height: 16px;
    color: var(--datav-font-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    font-weight: normal;
  }

  .el-tabs__item {
    height: auto;
    line-height: normal;
    padding: 14px 5px !important;

    &.is-left {
      text-align: center;
    }

    &.is-active {
      .com-tab-icon,
      .com-tab-title {
        color: var(--datav-main-color);
      }
    }
  }

  .el-tabs-l1 {
    .el-tabs__header {
      width: 98px;

      .el-tabs__nav-wrap {
        border: none;
      }

      .el-tabs__nav {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }

    .el-tabs__active-bar {
      display: none;
    }

    .el-tabs__item {
      width: 68px;
      height: 68px;
      border-radius: 20px;
      background: #ffffff;
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
      margin: 9px 0;

      .com-tab-icon {
        color: #999999;
      }

      .com-tab-title {
        color: #999999;
      }

      &:hover {
        .com-tab-icon {
          color: #005497cc;
        }

        .com-tab-title {
          color: #005497cc;
        }
      }

      &.is-active {
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.7);

        .com-tab-icon {
          color: #005497;
        }

        .com-tab-title {
          color: #005497;
        }
      }
    }
  }

  .el-tabs-l2 {
    .el-tabs__header {
      width: 60px;

      .el-tabs__nav-wrap {
        background: var(--datav-left-nav-active-bg);
      }
    }

    .el-tabs__active-bar {
      display: none;
    }

    .el-tabs__item {
      text-align: left !important;
      padding: 16px 7px !important;

      &.is-active {
        //background: var(--datav-layer-bg-dark);
      }
    }
  }

  .components-single-menu-wp {
    background: var(--datav-layer-bg-dark);
    min-height: 100%;
  }

  .components-single-menu {
    padding: 10px;
  }

  .components-single-menu-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .components-multi-menu {
    height: 100%;
    overflow-y: scroll;
  }

  .components-item {
    cursor: pointer;
    display: inline-block;
    color: #7e7e7e;
    vertical-align: top;
    user-select: none;
    flex: none;
    margin-bottom: 10px;
    border-radius: 3px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    .components-item-text {
      font-size: 12px;
      padding: 0 5px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 22px;
    }

    .components-item-img {
      overflow: hidden;
      width: 100%;
      background-clip: content-box;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      position: relative;
      text-align: center;
      box-sizing: content-box;
      transition: border-color 0.2s;
      height: 45px;
      //border: 1px solid #7E7E7E;
    }

    &.single {
      width: 47%;

      .components-item-img {
        height: 58px;
      }
    }

    &.double {
      width: 100%;

      .components-item-img {
        height: 72px;
      }
    }

    &.three {
      width: 33%;
      padding: 3px;

      .components-item-img {
        height: 45px;
      }
    }

    &:hover {
      border-radius: 10px;
      box-shadow: 0px 0px 6px 0px rgba(0, 84, 151, 1);
    }
  }
}
</style>
