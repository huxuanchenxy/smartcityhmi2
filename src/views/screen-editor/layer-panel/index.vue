<template>
  <div :class="['g-aside layer-panel-wp', { '--hide': !visiblePanel }]">
    <div class="layer-manager">
      <div class="layer-manager-top">
        <div class="layer-num">图层</div>
        <div class="layer-layout">
          <n-icon
            title="缩略图版"
            class="btn-icon"
            :class="{ selected: !showText }"
            @click="showText = false"
          >
            <IconViewGrid />
          </n-icon>
          <n-icon
            title="文字版"
            class="btn-icon"
            :class="{ selected: showText }"
            @click="showText = true"
          >
            <IconViewList />
          </n-icon>
          <n-icon
            title="收起"
            class="btn-icon"
            @click="changeVisible"
          >
            <IconBack />
          </n-icon>
        </div>
      </div>
      <div class="layer-toolbar layer-toolbar-top">
        <n-icon
          title="上移一层"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveUp"
        >
          <IconMoveUp />
        </n-icon>
        <n-icon
          title="下移一层"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveDown"
        >
          <IconMoveDown />
        </n-icon>
        <n-icon
          title="置顶"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveTop"
        >
          <IconMoveTop />
        </n-icon>
        <n-icon
          title="置底"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveBottom"
        >
          <IconMoveBottom />
        </n-icon>
      </div>
      <div class="layer-manager-wrap">
        <!-- <n-collapse>
          <n-collapse-item v-for="com in descComs" :key="com.id" :name="com.id">
            <template v-if="com.type != 'layer'" #arrow>
              &nbsp;
            </template>
            <template #header>
              <div
                v-if="showText"
                :title="com.alias"
                class="layer-manager-item"
                :class="[{
                  hided: com.hided,
                  locked: com.locked,
                  hovered: com.hovered,
                  selected: com.selected
                }]"
                @mousedown="selectCom(com.id)"
                @mouseenter="com.hovered = true"
                @mouseleave="com.hovered = false"
                @contextmenu="showMenu"
              >
                <g-com-icon :icon="com.icon" />
                <input
                  v-if="com.renameing"
                  v-model.trim="com.alias"
                  v-focus
                  class="layer-item-input"
                  @blur="com.renameing = false"
                  @keydown.enter="com.renameing = false"
                >
                <span v-else class="layer-item-span">
                  <span class="layer-item-text">{{ com.alias }}</span>
                </span>
                <n-icon
                  v-if="com.hided"
                  class="show-toggle-btn"
                  @click="com.hided = false"
                >
                  <IconHide />
                </n-icon>
                <n-icon
                  v-if="com.locked"
                  class="show-toggle-btn"
                  @click="com.locked = false"
                >
                  <IconLock />
                </n-icon>
              </div>
              <div
                v-else
                :title="com.alias"
                class="layer-manager-item thumbail-wrap"
                :class="[{
                  hided: com.hided,
                  locked: com.locked,
                  hovered: com.hovered,
                  selected: com.selected
                }]"
                @mousedown="selectCom(com.id,$event)"
                @mouseenter="com.hovered = true"
                @mouseleave="com.hovered = false"
                @contextmenu="showMenu"
              >
                <div
                  class="layer-item-thumbail"
                  :alt="com.alias"
                  :style="`background-image: url(${com.img})`"
                >
                </div>
                <div class="layer-manager-thumbail">
                  <input
                    v-if="com.renameing"
                    v-model.trim="com.alias"
                    v-focus
                    class="layer-item-input"
                    @blur="com.renameing = false"
                    @keydown.enter="com.renameing = false"
                  >
                  <span v-else class="layer-item-span">
                    <span class="layer-item-text">{{ com.alias }}</span>
                  </span>
                </div>
                <div class="layer-thumbail-item">
                  <n-icon
                    v-if="com.hided"
                    class="show-toggle-btn"
                    @click="com.hided = false"
                  >
                    <IconHide />
                  </n-icon>
                  <n-icon
                    v-if="com.locked"
                    class="show-toggle-btn"
                    @click="com.locked = false"
                  >
                    <IconLock />
                  </n-icon>
                </div>
              </div>
            </template>
          </n-collapse-item>
        </n-collapse> -->
        <div v-for="com in descComs" :key="com.id">
          <div v-if="com.type != 'layer'">
            <div
              v-if="showText"
              :title="com.alias"
              class="layer-manager-item"
              :class="[{
                hided: com.hided,
                locked: com.locked,
                hovered: com.hovered,
                selected: com.selected
              }]"
              @mousedown="selectCom(com.id,$event)"
              @mouseenter="com.hovered = true"
              @mouseleave="com.hovered = false"
              @contextmenu="showMenu"
            >
              <g-com-icon :icon="com.icon" />
              <input
                v-if="com.renameing"
                v-model.trim="com.alias"
                v-focus
                class="layer-item-input"
                @blur="com.renameing = false"
                @keydown.enter="com.renameing = false"
              >
              <span v-else class="layer-item-span">
                <span class="layer-item-text">{{ com.alias }}</span>
              </span>
              <n-icon
                v-if="com.eventhub"
                class="show-toggle-btn"
                @click="com.eventhub = false"
              >
                <IconEventJoin />
              </n-icon>
              <n-icon
                v-if="com.hided"
                class="show-toggle-btn"
                @click="com.hided = false"
              >
                <IconHide />
              </n-icon>
              <n-icon
                v-if="com.locked"
                class="show-toggle-btn"
                @click="com.locked = false"
              >
                <IconLock />
              </n-icon>
            </div>
            <div
              v-else
              :title="com.alias"
              class="layer-manager-item thumbail-wrap"
              :class="[{
                hided: com.hided,
                locked: com.locked,
                hovered: com.hovered,
                selected: com.selected
              }]"
              @mousedown="selectCom(com.id,$event)"
              @mouseenter="com.hovered = true"
              @mouseleave="com.hovered = false"
              @contextmenu="showMenu"
            >
              <div
                class="layer-item-thumbail"
                :alt="com.alias"
                :style="`background-image: url(${com.img})`"
              >
              </div>
              <div class="layer-manager-thumbail">
                <input
                  v-if="com.renameing"
                  v-model.trim="com.alias"
                  v-focus
                  class="layer-item-input"
                  @blur="com.renameing = false"
                  @keydown.enter="com.renameing = false"
                >
                <span v-else class="layer-item-span">
                  <span class="layer-item-text">{{ com.alias }}</span>
                </span>
              </div>
              <div class="layer-thumbail-item">
                <n-icon
                v-if="com.eventhub"
                class="show-toggle-btn"
                @click="com.eventhub = false"
              >
                <IconEventJoin />
              </n-icon>
                <n-icon
                  v-if="com.hided"
                  class="show-toggle-btn"
                  @click="com.hided = false"
                >
                  <IconHide />
                </n-icon>
                <n-icon
                  v-if="com.locked"
                  class="show-toggle-btn"
                  @click="com.locked = false"
                >
                  <IconLock />
                </n-icon>
              </div>
            </div>
          </div>
          <div v-else>
            <n-collapse>
              <n-collapse-item :name="com.id">
                <template #header>
                  <div
                    v-if="showText"
                    :title="com.alias"
                    class="layer-manager-item"
                    :class="[{
                      hided: com.hided,
                      locked: com.locked,
                      hovered: com.hovered,
                      selected: com.selected
                    }]"
                    @mousedown="selectCom(com.id,$event)"
                    @mouseenter="com.hovered = true"
                    @mouseleave="com.hovered = false"
                    @contextmenu="showMenu"
                  >
                    <g-com-icon :icon="com.icon" />
                    <input
                      v-if="com.renameing"
                      v-model.trim="com.alias"
                      v-focus
                      class="layer-item-input"
                      @blur="com.renameing = false"
                      @keydown.enter="com.renameing = false"
                    >
                    <span v-else class="layer-item-span">
                      <span class="layer-item-text">{{ com.alias }}</span>
                    </span>
                    <n-icon
                       v-if="com.eventhub"
                       class="show-toggle-btn"
                       @click="com.eventhub = false"
                    >
                      <IconEventJoin />
                    </n-icon>
                    <n-icon
                      v-if="com.hided"
                      class="show-toggle-btn"
                      @click="com.hided = false"
                    >
                      <IconHide />
                    </n-icon>
                    <n-icon
                      v-if="com.locked"
                      class="show-toggle-btn"
                      @click="com.locked = false"
                    >
                      <IconLock />
                    </n-icon>
                  </div>
                  <div
                    v-else
                    :title="com.alias"
                    class="layer-manager-item thumbail-wrap"
                    :class="[{
                      eventhub: com.eventhub,
                      hided: com.hided,
                      locked: com.locked,
                      hovered: com.hovered,
                      selected: com.selected
                    }]"
                    @mousedown="selectCom(com.id,$event)"
                    @mouseenter="com.hovered = true"
                    @mouseleave="com.hovered = false"
                    @contextmenu="showMenu"
                  >
                    <div
                      class="layer-item-thumbail"
                      :alt="com.alias"
                      :style="`background-image: url(${com.img})`"
                    >
                    </div>
                    <div class="layer-manager-thumbail">
                      <input
                        v-if="com.renameing"
                        v-model.trim="com.alias"
                        v-focus
                        class="layer-item-input"
                        @blur="com.renameing = false"
                        @keydown.enter="com.renameing = false"
                      >
                      <span v-else class="layer-item-span">
                        <span class="layer-item-text">{{ com.alias }}</span>
                      </span>
                    </div>
                    <div class="layer-thumbail-item">
                    <n-icon
                       v-if="com.eventhub"
                       class="show-toggle-btn"
                       @click="com.eventhub = false"
                    >
                      <IconEventJoin />
                    </n-icon>
                      <n-icon
                        v-if="com.hided"
                        class="show-toggle-btn"
                        @click="com.hided = false"
                      >
                        <IconHide />
                      </n-icon>
                      <n-icon
                        v-if="com.locked"
                        class="show-toggle-btn"
                        @click="com.locked = false"
                      >
                        <IconLock />
                      </n-icon>
                    </div>
                  </div>
                </template>
                <div v-for="subComId in com.subComs" :key="subComId">
                  <div
                    v-if="showText"
                    :title="getSubCom(subComId).alias"
                    class="layer-manager-item"
                    :class="[{
                      eventhub: getSubCom(subComId).eventhub,
                      hided: getSubCom(subComId).hided,
                      locked: getSubCom(subComId).locked,
                      hovered: getSubCom(subComId).hovered,
                      selected: getSubCom(subComId).selected
                    }]"
                    @mousedown="selectCom(subComId,$event)"
                    @mouseenter="getSubCom(subComId).hovered = true"
                    @mouseleave="getSubCom(subComId).hovered = false"
                    @contextmenu="showMenu"
                  >
                    <g-com-icon :icon="getSubCom(subComId).icon" />
                    <input
                      v-if="getSubCom(subComId).renameing"
                      v-model.trim="getSubCom(subComId).alias"
                      v-focus
                      class="layer-item-input"
                      @blur="getSubCom(subComId).renameing = false"
                      @keydown.enter="getSubCom(subComId).renameing = false"
                    >
                    <span v-else class="layer-item-span">
                      <span class="layer-item-text">{{ getSubCom(subComId).alias }}</span>
                    </span>
                    <n-icon
                      v-if="getSubCom(subComId).eventhub"
                      class="show-toggle-btn"
                      @click="getSubCom(subComId).eventhub = false"
                    >
                      <IconEventJoin />
                    </n-icon>
                    <n-icon
                      v-if="getSubCom(subComId).hided"
                      class="show-toggle-btn"
                      @click="getSubCom(subComId).hided = false"
                    >
                      <IconHide />
                    </n-icon>
                    <n-icon
                      v-if="getSubCom(subComId).locked"
                      class="show-toggle-btn"
                      @click="getSubCom(subComId).locked = false"
                    >
                      <IconLock />
                    </n-icon>
                  </div>
                  <div
                    v-else
                    :title="getSubCom(subComId).alias"
                    class="layer-manager-item thumbail-wrap"
                    :class="[{
                      eventhub: getSubCom(subComId).eventhub,
                      hided: getSubCom(subComId).hided,
                      locked: getSubCom(subComId).locked,
                      hovered: getSubCom(subComId).hovered,
                      selected: getSubCom(subComId).selected
                    }]"
                    @mousedown="selectCom(subComId,$event)"
                    @mouseenter="getSubCom(subComId).hovered = true"
                    @mouseleave="getSubCom(subComId).hovered = false"
                    @contextmenu="showMenu"
                  >
                    <div
                      class="layer-item-thumbail"
                      :alt="getSubCom(subComId).alias"
                      :style="`background-image: url(${getSubCom(subComId).img})`"
                      style="margin-left:10px;width:45px;height:30px;"
                    >
                    </div>
                    <div class="layer-manager-thumbail">
                      <input
                        v-if="getSubCom(subComId).renameing"
                        v-model.trim="getSubCom(subComId).alias"
                        v-focus
                        class="layer-item-input"
                        @blur="getSubCom(subComId).renameing = false"
                        @keydown.enter="getSubCom(subComId).renameing = false"
                      >
                      <span v-else class="layer-item-span" style="font-size:8pt">
                        <span class="layer-item-text" style="font-size:8pt;">{{ getSubCom(subComId).alias }}</span>
                      </span>
                    </div>
                    <div class="layer-thumbail-item">
                    <n-icon
                      v-if="getSubCom(subComId).eventhub"
                      class="show-toggle-btn"
                      @click="getSubCom(subComId).eventhub = false"
                    >
                      <IconEventJoin />
                    </n-icon>
                      <n-icon
                        v-if="getSubCom(subComId).hided"
                        class="show-toggle-btn"
                        @click="getSubCom(subComId).hided = false"
                      >
                        <IconHide />
                      </n-icon>
                      <n-icon
                        v-if="getSubCom(subComId).locked"
                        class="show-toggle-btn"
                        @click="getSubCom(subComId).locked = false"
                      >
                        <IconLock />
                      </n-icon>
                    </div>
                  </div>
                </div>
              </n-collapse-item>
            </n-collapse>
          </div>
        </div>
      </div>
      <div class="last-flex-item" @click="selectCom('',$event)"></div>
    </div>
    <div class="layer-toolbar layer-toolbar-bottom">
      <n-icon
        title="删除"
        class="toolbar-icon standard"
        :class="enableBtnClass"
        :style="enableBtnStyle"
        @click="toDeleteCom"
      >
        <IconDelete />
      </n-icon>
       <n-icon
        title="事件对象"
        class="toolbar-icon standard"
        :class="enableEventBtnClass"
        :style="enableBtnStyle"
        @click="eventCom"
      >
        <IconEventJoin />
      </n-icon>
      <n-icon
        title="锁定"
        class="toolbar-icon standard"
        :class="enableLockBtnClass"
        :style="enableBtnStyle"
        @click="lockCom"
      >
        <IconLock />
      </n-icon>
      <n-icon
        title="隐藏"
        class="toolbar-icon standard"
        :class="enableHideBtnClass"
        :style="enableBtnStyle"
        @click="hideCom"
      >
        <IconHide />
      </n-icon>
    </div>
  </div>
</template>

<script lang='ts'>
import { h, defineComponent, ref, computed } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { PanelType, ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import { MoveType } from '@/utils/enums'
import {
  IconViewList,
  IconViewGrid,
  IconBack,
  IconWarning,
  IconMoveUp,
  IconMoveDown,
  IconMoveTop,
  IconMoveBottom,
  IconLock,
  IconHide,
  IconDelete,
  IconEventJoin,
} from '@/icons'
import { useContextMenu } from '../editor-context-menu/index'
// import { DatavComponent } from '@/components/datav-component'
// import group from '@/components/group/group/src/group'

export default defineComponent({
  name: 'LayerPanel',
  components:{
    IconViewList,
    IconViewGrid,
    IconBack,
    IconMoveUp,
    IconMoveDown,
    IconMoveTop,
    IconMoveBottom,
    IconLock,
    IconHide,
    IconDelete,
    IconEventJoin,
  },
  setup() {
    const nMessage = useMessage()
    const nDialog = useDialog()
    const showText = ref(false)
    const visiblePanel = computed(() => ToolbarModule.layer.show)
    const descComs = computed(() => {
      const list = EditorModule.coms.filter(r=>!r.parentId).reverse()
      console.log('descComs', list, EditorModule.coms)
      return list
    })
    const selectedCom = computed(() => EditorModule.selectedCom)
    //const selectedComs = computed(() => EditorModule.selectedComs)

    const enableBtnClass = computed(() => !!selectedCom.value)

    const enableEventBtnClass = computed(() => {
      return {
        enable: !!selectedCom.value,
        checked: selectedCom.value?.eventhub,
      }
    })

    const enableLockBtnClass = computed(() => {
      return {
        enable: !!selectedCom.value,
        checked: selectedCom.value?.locked,
      }
    })
    const enableHideBtnClass = computed(() => {
      return {
        enable: !!selectedCom.value,
        checked: selectedCom.value?.hided,
      }
    })

    const enableBtnStyle = computed(() => {
      return {
        opacity: selectedCom.value ? 1 : 0.3,
      }
    })

    const changeVisible = () => {
      ToolbarModule.setPanelState({ type: PanelType.layer, value: !visiblePanel.value })
    }

    const selectCom = (id: string,event:MouseEvent) => {
      console.log('click',event.button)
      let ctrl=false

      if(event && event.ctrlKey){
        ctrl=true
      }

      let com = EditorModule.coms.find(r=>r.id==id)

      if(event.button==0 || (event.button==2 && !com.selected)){
        EditorModule.selectCom({ id,ctrl })
      }

    }

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
      const com = selectedCom.value
      if (com) {
        const d = nDialog.create({
          content: '是否删除选中的1个组件',
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
          autoFocus:false,
          icon: () => h(IconWarning),
          onPositiveClick: async () => {
            d.loading = true
            try {
              await EditorModule.deleteCom(com)
            } catch (error) {
              nMessage.error(error.message)
            }
          },
        })
      }
    }

    const { showMenu } = useContextMenu()

    // const getSubComs= (com:DatavComponent) => {
    //   // let group =com as group
    //   // let list= group.subComs.map(r=> EditorModule.GetCom(r))
    //   // console.log(group.subComs, list)
    //   let list= EditorModule.coms.filter(r=>r.parentId==com.id)
    //   return list
    // }

    const getSubCom = (subId:string) => {
      let item= EditorModule.coms.find(r=>r.id==subId)
      return item
    }

    return {
      showText,
      visiblePanel,
      descComs,
      enableBtnClass,
      enableEventBtnClass,
      enableLockBtnClass,
      enableHideBtnClass,
      enableBtnStyle,
      changeVisible,
      selectCom,
      moveUp,
      moveDown,
      moveTop,
      moveBottom,
      lockCom,
      hideCom,
      toDeleteCom,
      showMenu,
      //getSubComs,
      getSubCom,
      eventCom,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './style';

.subCom
{
  font-size: 8pt !important;
}

.subComImg
{
  width:45px;
  height:30px;
}


:deep(.n-collapse .n-collapse-item .n-collapse-item__header) {
  height:48px !important;
}
</style>
