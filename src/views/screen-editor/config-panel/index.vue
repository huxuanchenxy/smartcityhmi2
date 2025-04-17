<template>
  <div :class="['g-aside config-panel-wp', { '--hide': !visiblePanel }]">
    <div class="config-manager">
      <page-config v-if="!selectedCom" />
      <el-tabs v-else type="card" :stretch="true">
        <el-tab-pane>
          <template #label>
            <n-tooltip :delay="500">
              <template #trigger>
                <n-icon>
                  <IconSetting />
                </n-icon>
              </template>
              配置
            </n-tooltip>
          </template>
          <setting-panel :key="selectedCom.id" />
        </el-tab-pane>
        <el-tab-pane lazy>
          <template #label>
            <n-tooltip :delay="500">
              <template #trigger>
                <n-icon>
                  <IconCloud />
                </n-icon>
              </template>
              数据
            </n-tooltip>
          </template>
          <data-center-panel :key="selectedCom.id" />
        </el-tab-pane>
        <el-tab-pane lazy>
          <template #label>
            <n-tooltip :delay="500">
              <template #trigger>
                <n-icon>
                  <IconInteract />
                </n-icon>
              </template>
              交互
            </n-tooltip>
          </template>
          <interaction-panel :key="selectedCom.id" />
        </el-tab-pane>
        <el-tab-pane lazy>
          <template #label>
            <n-tooltip :delay="500">
              <template #trigger>
                <n-icon>
                  <IconBox />
                </n-icon>
              </template>
              点位
            </n-tooltip>
          </template>
          <ic-event-panel :key="selectedCom.id" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, provide } from 'vue'
import { ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import { loadAsyncComponent } from '@/utils/async-component'
import { IconSetting, IconCloud, IconInteract, IconBox } from '@/icons'

export default defineComponent({
  name: 'ConfigPanel',
  components: {
    PageConfig: loadAsyncComponent(() => import('./page-config.vue')),
    SettingPanel: loadAsyncComponent(() => import('./setting-panel.vue')),
    DataCenterPanel: loadAsyncComponent(() => import('./data-center-panel/index.vue')),
    InteractionPanel: loadAsyncComponent(() => import('./interaction-panel/index.vue')),
    IcEventPanel: loadAsyncComponent(() => import('./icevent-panel/index.vue')),
    IconSetting,
    IconCloud,
    IconInteract,
    IconBox
  },
  setup() {
    const visiblePanel = computed(() => ToolbarModule.config.show)
    const selectedCom = computed(() => EditorModule.selectedCom)
    const allComs = computed(() => EditorModule.coms)

    provide('com', selectedCom)
    provide('coms', allComs)

    return {
      visiblePanel,
      selectedCom,
    }
  },
})
</script>

<style lang="scss" scoped>
$panel_width: 332px;

.config-panel-wp {
  position: relative;
  z-index: 90;
  width: $panel_width !important;
  height: 100%;
  overflow: hidden;
  background: var(--datav-config-bg);
  box-shadow: -1px 0 #c8c8c8;
  transition: width 0.25s ease-in-out;
}

.config-manager {
  width: $panel_width;
  height: 100%;
  background: var(--datav-left-nav-bg);
  transition: 0.25s ease-in-out;
  user-select: none;

  ::-webkit-scrollbar {
    display: none;
  }
}

.config-panel-wp.--hide {
  width: 0 !important;

  .config-manager {
    transform: translateX(-100%);
  }
}
</style>
