<template>
  <div v-if="contextMenu.show" class="context-menu-wrap" :style="contextMenuStyle">
    <div v-if="!hasSelectedComs" class="context-menu-item" @click="moveTop">
      <n-icon class="menu-icon">
        <IconMoveTop />
      </n-icon>
      置顶
    </div>
    <div v-if="!hasSelectedComs" class="context-menu-item" @click="moveBottom">
      <n-icon class="menu-icon">
        <IconMoveBottom />
      </n-icon>
      置底
    </div>
    <div v-if="!hasSelectedComs" class="context-menu-item" @click="moveUp">
      <n-icon class="menu-icon">
        <IconMoveUp />
      </n-icon>
      上移一层
    </div>
    <div v-if="!hasSelectedComs" class="context-menu-item" @click="moveDown">
      <n-icon class="menu-icon">
        <IconMoveDown />
      </n-icon>
      下移一层
    </div>

    <div v-if="!hasSelectedComs" class="context-menu-divider"></div>

    <div v-if="!isGroup && hasManyCom" class="context-menu-item" @click="toGroup">
      <n-icon class="menu-icon">
        <IconLayer />
      </n-icon>
      成组
    </div>

    <div v-if="isGroup && !hasManyCom" class="context-menu-item" @click="dismiss">
      <n-icon class="menu-icon">
        <IconMagic />
      </n-icon>
      取消成组
    </div>

    <div v-if="!hasSelectedComs" class="context-menu-divider"></div>




    <div v-if="!hasSelectedComs" class="context-menu-item" @click="eventCom">
      <template v-if="isEventhub">
        <n-icon class="menu-icon">
          <IconEventDelete />
        </n-icon>
         移除事件
      </template>
      <template v-else>
        <n-icon class="menu-icon">
          <IconEventJoin />
        </n-icon>
         事件对象
      </template>
    </div>

    <div v-if="!hasSelectedComs" class="context-menu-item" @click="lockCom">
      <template v-if="isLocked">
        <n-icon class="menu-icon">
          <IconUnlock />
        </n-icon>
        解锁
      </template>
      <template v-else>
        <n-icon class="menu-icon">
          <IconLock />
        </n-icon>
        锁定
      </template>
    </div>
    <div v-if="!hasSelectedComs" class="context-menu-item" @click="hideCom">
      <template v-if="isHided">
        <n-icon class="menu-icon">
          <IconShow />
        </n-icon>
        显示
      </template>
      <template v-else>
        <n-icon class="menu-icon">
          <IconHide />
        </n-icon>
        隐藏
      </template>
    </div>

    <div v-if="!hasSelectedComs" class="context-menu-divider"></div>

    <div v-if="!hasSelectedComs" class="context-menu-item" @click="renameCom">
      <n-icon class="menu-icon">
        <IconEdit />
      </n-icon>
      重命名
    </div>
    <div v-if="!hasSelectedComs" class="context-menu-item" @click="toCopyCom">
      <n-icon class="menu-icon">
        <IconCopy />
      </n-icon>
      复制
    </div>
    <div class="context-menu-item" @click="toDeleteCom">
      <n-icon class="menu-icon">
        <IconDelete />
      </n-icon>
      删除
    </div>

    <div class="context-menu-divider"></div>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, onBeforeMount, onUnmounted, computed } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { EditorModule } from '@/store/modules/editor'
import { on, off } from '@/utils/dom'
import { MoveType } from '@/utils/enums'
import {
  IconWarning,
  IconMoveUp,
  IconMoveDown,
  IconMoveTop,
  IconMoveBottom,
  IconLock,
  IconUnlock,
  IconShow,
  IconHide,
  IconCopy,
  IconEdit,
  IconDelete,
  IconLayer,
  IconMagic,
  IconEventDelete,
  IconEventJoin
} from '@/icons'
import { useContextMenu } from './index'
import { ComType } from '@/components/datav-component'
import { ToolbarModule } from '@/store/modules/toolbar'
import { BlueprintModule } from '@/store/modules/blueprint'
import { createComponent } from '@/components/datav'
//import { number } from 'echarts/core'

import { minBy } from 'lodash'
import group from '@/components/group/group/src/group'

export default defineComponent({
  name: 'EditorContextMenu',
  components: {
    IconMoveUp,
    IconMoveDown,
    IconMoveTop,
    IconMoveBottom,
    IconLock,
    IconUnlock,
    IconShow,
    IconHide,
    IconCopy,
    IconEdit,
    IconDelete,
    IconLayer,
    IconMagic,
    IconEventDelete,
    IconEventJoin
  },
  setup() {
    const nMessage = useMessage()
    const nDialog = useDialog()
    const {
      contextMenu,
      selectedCom,
      selectedComs,
      isLocked,
      isHided,
      isEventhub,
      contextMenuStyle,
    } = useContextMenu()

    const moveCom = (moveType: MoveType) => {
      if (selectedCom.value) {
        EditorModule.moveCom({ id: selectedCom.value.id, moveType })
      }
    }

    const moveUp = () => moveCom(MoveType.up)
    const moveDown = () => moveCom(MoveType.down)
    const moveTop = () => moveCom(MoveType.top)
    const moveBottom = () => moveCom(MoveType.bottom)

    const eventCom = () => {
      if (selectedCom.value) {
        selectedCom.value.eventhub = !selectedCom.value.eventhub
      }
    }

    const lockCom = () => {
      if (selectedCom.value) {
        selectedCom.value.locked = !selectedCom.value.locked
      }
    }

    const hideCom = () => {
      if (selectedCom.value) {
        selectedCom.value.hided = !selectedCom.value.hided
      }
    }

    const toDeleteCom = () => {
      //const com = selectedCom.value
      if (EditorModule.selectedComs.length > 0) {
        const d = nDialog.create({
          content: '是否删除选中的组件',
          negativeText: '取消',
        negativeButtonProps: {
          round: true,
          ghost:true,
          color:'#7E7E7E',
          focusable:false,
        },
        positiveText: '确定',
        positiveButtonProps:{
          round: true,
          color:'#0647a1',
        },
          iconPlacement: 'top',
          autoFocus: false,
          icon: () => h(IconWarning),
          onPositiveClick: async () => {
            d.loading = true
            try {
              EditorModule.deleteComs(EditorModule.selectedComs)
              // EditorModule.selectedComs.forEach(sCom=>{
              //   console.log('EditorModule.deleteCom',sCom)
              //   EditorModule.deleteCom(sCom)
              // })
            } catch (error) {
              nMessage.error(error.message)
            }
          },
        })
      }
    }

    const renameCom = () => {
      if (selectedCom.value) {
        selectedCom.value.renameing = true
      }
    }

    const toCopyCom = () => {
      if (selectedCom.value) {
        EditorModule.copyCom(selectedCom.value.id)
      }
    }

    const handleContextmenu = (ev: Event) => ev.preventDefault()

    onBeforeMount(() => {
      on(document, 'contextmenu', handleContextmenu)
    })

    onUnmounted(() => {
      off(document, 'contextmenu', handleContextmenu)
    })

    const isGroup = computed(() => {
      if (selectedCom.value) {
        return selectedCom.value.type == ComType.layer
      } else {
        return false
      }
    })

    const hasManyCom = computed(() => {
      return (
        selectedComs.value.length > 0 &&
        selectedComs.value.filter(r => r.type == ComType.layer).length == 0
      )
    })

    const toGroup = async () => {
      //ToolbarModule.addLoading()

      let coms = selectedComs.value

      if (coms.filter(r => r.parentId).length > 0) {
        nDialog.create({
          content: '子组件不能再次成组',
          positiveText: '确定',
        positiveButtonProps:{
          round: true,
          color:'#0647a1',
        },
          iconPlacement: 'top',
          autoFocus: false,
          icon: () => h(IconWarning),
          onPositiveClick: async () => {
            //ToolbarModule.removeLoading()
            return
          },
        })
        return
      }

      if (coms.length == 1) {
        nDialog.create({
          content: '单个组件不能成组',
          positiveText: '确定',
        positiveButtonProps:{
          round: true,
          color:'#0647a1',
        },
          iconPlacement: 'top',
          autoFocus: false,
          icon: () => h(IconWarning),
          onPositiveClick: async () => {
            //ToolbarModule.removeLoading()
            return
          },
        })
        return
      }

      let minX = minBy(coms, r => r.attr.x)
      let minY = minBy(coms, r => r.attr.y)
      //let minXcoms=coms.filter(r=>r.attr.x==minX.attr.x)
      //let minY=minBy(minXcoms,r=>r.attr.y)
      //let minAttrCom = minXcoms.filter(r=>r.attr.y==minY.attr.y)[0]

      let maxW = 0
      let maxH = 0
      coms.forEach(com => {
        let w = com.attr.x + com.attr.w
        let h = com.attr.y + com.attr.h

        if (w > maxW) {
          maxW = w
        }

        if (h > maxH) {
          maxH = h
        }
      })

      //const { pageConfig } = EditorModule
      const com = await createComponent('VGroup')
      com.attr.x = minX.attr.x
      com.attr.y = minY.attr.y
      com.attr.w = maxW - com.attr.x
      com.attr.h = maxH - com.attr.y
      com.projectId = EditorModule.screen.id

      selectedComs.value.forEach(r => {
        //EditorModule.deleteCom(r)
        r.parentId = com.id
        r.attr.x = r.attr.x - com.attr.x
        r.attr.y = r.attr.y - com.attr.y
        com.subComs.push(r.id)
      })
      await EditorModule.addCom(com)
      EditorModule.selectCom(com.id)
      //ToolbarModule.removeLoading()

      if (com.apis.source) {
        await com.loadData()
        BlueprintModule.datavComponents[com.id].$DATAV_requestData()
      }
      //ToolbarModule.removeLoading()
    }

    const dismiss = async () => {
      const com = selectedCom.value as group

      if (com) {
        const d = nDialog.create({
          content: '是否取消成组',
          negativeText: '取消',
        negativeButtonProps: {
          round: true,
          ghost:true,
          color:'#7E7E7E',
          focusable:false,
        },
        positiveText: '确定',
        positiveButtonProps:{
          round: true,
          color:'#0647a1',
        },
          iconPlacement: 'top',
          autoFocus: false,
          icon: () => h(IconWarning),
          onPositiveClick: async () => {
            console.log('group', com.subComs.length)
            d.loading = true
            try {
              for (let i = com.subComs.length - 1; i >= 0; i--) {
                let subComId = com.subComs[i]
                let subCom = EditorModule.coms.find(r => r.id == subComId)
                subCom.parentId = null
                com.subComs.splice(i)
                subCom.attr.x = subCom.attr.x + com.attr.x
                subCom.attr.y = subCom.attr.y + com.attr.y
              }

              await EditorModule.deleteCom(com)
            } catch (error) {
              nMessage.error(error.message)
            }
          },
        })
      }
    }

    const hasSelectedComs = computed(() => {
      return EditorModule.selectedComs.length > 1
    })

    return {
      contextMenu,
      isEventhub,
      isLocked,
      isHided,
      contextMenuStyle,
      moveUp,
      moveDown,
      moveTop,
      moveBottom,
      eventCom,
      lockCom,
      hideCom,
      toDeleteCom,
      renameCom,
      toCopyCom,
      hasSelectedComs,
      hasManyCom,
      isGroup,
      toGroup,
      dismiss,
    }
  },
})
</script>

<style lang="scss" scoped>
.context-menu-wrap {
  position: fixed;
  z-index: 9999;
  display: none;
  width: 111px;
  color: var(--datav-font-color);
  background: var(--datav-menu-bg);
  user-select: none;
}

.context-menu-item {
  display: flex;
  height: 28px;
  padding: 0 6px;
  padding-right: 3em;
  overflow: hidden;
  align-items: center;
  cursor: pointer;
  border-left: 2px solid transparent;

  &:hover {
    color: #000;
    background-color: var(--datav-menu-bg-hover);
    border-left: 2px solid var(--datav-menu-color-hover);
  }

  .menu-icon {
    margin-right: 4px;
    font-size: 14px;
  }

  &.disable {
    color: var(--datav-menu-color-disabled);
    pointer-events: none;
    cursor: auto;
  }
}

.context-menu-divider {
  width: 100%;
  height: 1px;
  background-color: var(--datav-border-color);
}
</style>
