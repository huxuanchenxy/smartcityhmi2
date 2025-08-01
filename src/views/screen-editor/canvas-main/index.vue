<template>
  <div class="canvas-main">
    <div
      id="canvas-wp"
      class="canvas-panel-wrap"
      @mousedown.stop="cancelSelectCom"
      @mousedown="handleMouseDown"
    >
      <div id="screen-wp" class="screen-shot" :style="screenShotStyle">
        <align-line />
        <ruler />
        <div
          id="canvas-coms"
          class="canvas-panel"
          :style="canvasPanelStyle"
          @dragover="dragOver"
          @drop="dropToAddCom"
        >
          <datav-transform v-for="com in coms" :key="com.id" :com="com">
            <component
              :is="com.name"
              :com="com"
              :style="{
                transform: 'translateZ(0px)',
                opacity: com.attr.opacity,
              }"
            />
          </datav-transform>
        </div>
      </div>
      <canvas-area
        v-if="areaWidth > 0 || areaHeight > 0"
        :start-x="areaStartX"
        :start-y="areaStartY"
        :width="areaWidth"
        :height="areaHeight"
        :style="{
          width: `${selectionW}px`,
          height: `${selectionH}px`,
        }"
      />
    </div>
    <div
      id="thumbnail"
      class="thumbnail"
      :style="{ display: eyeView ? 'inline' : 'none' }"
      @mousewheel.prevent="zoomEyeView"
    >
      <div class="datas-thumbnail">
        <!-- <cavans></cavans> -->
        <span
          id="select-span"
          :style="selectSpanStyle"
          @mousedown.prevent.stop="eyeMove"
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent } from "@/components/datav";
import { DatavComponent } from "@/components/datav-component";
import { BlueprintModule } from "@/store/modules/blueprint";
import { EditorModule } from "@/store/modules/editor";
import { ToolbarModule } from "@/store/modules/toolbar";
import { off, on } from "@/utils/dom";
import { checkRectIntersect } from "@/utils/editor";
import type { CSSProperties } from "vue";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useContextMenu } from "../editor-context-menu";
import AlignLine from "./align-line.vue";
import CanvasArea from "./canvas-area.vue";
import DatavTransform from "./datav-transform/index.vue";
import Ruler from "./ruler/index.vue";

export default defineComponent({
  name: "CanvasMain",
  components: {
    AlignLine,
    Ruler,
    CanvasArea,
    DatavTransform,
  },
  setup() {
    const canvas = computed(() => EditorModule.canvas);
    const pageConfig = computed(() => EditorModule.pageConfig);
    const coms = computed(() => EditorModule.coms.filter((r) => !r.parentId));
    const { hideMenu } = useContextMenu();
    const eyeView = computed(() => EditorModule.eyeView.show);

    const cancelable = ref(false);
    const selectionW = ref(0);
    const selectionH = ref(0);
    const areaStartX = ref(0);
    const areaStartY = ref(0);
    const areaWidth = ref(0);
    const areaHeight = ref(0);
    const offsetX = 60;
    const offsetY = 60;

    onMounted(() => {
      coms.value.forEach(async (r) => {
        let com = r as DatavComponent;
        if (com.apis.source && typeof com.loadData == "function") {
          console.log("load com", com);
          await com.loadData();
          BlueprintModule.datavComponents[com.id].$DATAV_requestData();
        }
      });
    });

    const zoomEyeView = (ev: any) => {
      var scale = canvas.value.scale * 100;
      scale += ev.wheelDelta / 60;
      console.log(ev);
      EditorModule.setCanvasScale({
        scale: scale,
        ...getPanelOffset(),
      });
    };

    const getPanelOffset = () => ({
      offsetX: ToolbarModule.getPanelOffsetX,
      offsetY: ToolbarModule.getPanelOffsetY,
    });

    const screenShotStyle = computed(() => {
      // console.log(canvas.value);
      return {
        width: `${canvas.value.width}px`,
        height: `${canvas.value.height}px`,
      } as CSSProperties;
    });

    const canvasPanelStyle = computed(() => {
      return {
        position: "absolute",
        width: `${pageConfig.value.width}px`,
        height: `${pageConfig.value.height}px`,
        transform: `scale(${canvas.value.scale}) translate(0px, 0px)`,
        backgroundImage: `url(${pageConfig.value.bgimage})`,
        backgroundColor: pageConfig.value.bgcolor,
      } as CSSProperties;
    });

    const selectSpanStyle = computed(() => {
      var clientWidth = 0;
      var clientHeight = 0;

      const canvasWp = document.getElementById("canvas-wp");
      if (canvasWp) {
        clientWidth = canvasWp.clientWidth;
        clientHeight = canvasWp.clientHeight;
      } else {
        clientWidth = canvas.value.scale * pageConfig.value.width + 100;
        clientHeight = canvas.value.scale * pageConfig.value.height + 100;
      }

      var view_width = clientWidth;
      var view_height = clientHeight;

      var span_width = Math.round(
        (view_width / (canvas.value.scale * pageConfig.value.width + 100)) * 190
      );
      var span_height = Math.round(
        (view_height / (canvas.value.scale * pageConfig.value.height + 100)) *
          110
      );

      return {
        width: `${span_width > 190 ? 190 : span_width}px`,
        height: `${span_height > 110 ? 110 : span_height}px`,
      } as CSSProperties;
    });

    const dropToAddCom = async (event: any) => {
      event.preventDefault();

      try {
        const name = event.dataTransfer.getData("text");
        const comStr = event.dataTransfer.getData("com");
        // console.log("dragggg……", name, comStr);
        if (name) {
          ToolbarModule.addLoading();
          let com = await createComponent(name);
          if (comStr != "") {
            let objComData = JSON.parse(comStr);
            if (objComData) {
              com.alias = objComData.alias;
              com.filePath = objComData.filePath;
            }
          }
          const { scale } = EditorModule.canvas;

          const offsetX =
            (event.clientX -
              ToolbarModule.getPanelOffsetLeft +
              EditorModule.eyeView.x) /
            scale;
          const offsetY =
            (event.clientY -
              ToolbarModule.getPanelOffsetTop +
              EditorModule.eyeView.y) /
            scale;
          //console.log(offsetX);
          //console.log(offsetY);
          com.projectId = EditorModule.screen.id;
          com.attr.x = Math.round(offsetX - com.attr.w / 2);
          com.attr.y = Math.round(offsetY - com.attr.h / 2);
          await EditorModule.addCom(com);
          EditorModule.selectCom({ id: com?.id });
          ToolbarModule.removeLoading();

          if (com.apis.source) {
            await com.loadData();
            BlueprintModule.datavComponents[com.id].$DATAV_requestData();
          }
        }
      } catch {
        // TODO
      }
    };

    const handleMouseDown = (ev: MouseEvent) => {
      // ev.stopPropagation()
      cancelable.value = true;
      if (EditorModule.contextMenu.show) {
        cancelable.value = false;
        hideMenu();
        return false;
      }

      const screenWp = document.getElementById("screen-wp");
      selectionW.value = screenWp.clientWidth;
      selectionH.value = screenWp.clientHeight;

      // 获取编辑器的位移信息，每次点击时都需要获取一次。
      const rectInfo = screenWp.getBoundingClientRect();
      const currX = rectInfo.x;
      const currY = rectInfo.y;

      const sx = ev.clientX;
      const sy = ev.clientY;
      areaStartX.value = sx - currX;
      areaStartY.value = sy - currY;

      const move = (e: MouseEvent) => {
        if (e.clientX < sx) {
          areaStartX.value = e.clientX - currX;
        }

        if (e.clientY < sy) {
          areaStartY.value = e.clientY - currY;
        }

        areaWidth.value = Math.abs(e.clientX - sx);
        areaHeight.value = Math.abs(e.clientY - sy);

        //handleSelectArea()

        cancelable.value = false;
        console.log(new Date().getMilliseconds());
      };

      const up = () => {
        off(document, "mousemove", move);
        off(document, "mouseup", up);
        handleSelectArea();
        hideArea();
        getSelectComs();

        if (cancelable.value) {
          confirmCancel(ev);
        }
      };

      on(document, "mousemove", move);
      on(document, "mouseup", up);
    };

    const handleSelectArea = () => {
      const { scale } = canvas.value;
      // 区域起点坐标
      const sx = (areaStartX.value - offsetX) / scale; // left
      const sy = (areaStartY.value - offsetY) / scale; // top
      const sw = areaWidth.value / scale; // width
      const sh = areaHeight.value / scale; // height
      //计算所有的组件数据，判断是否和选中区域相交
      coms.value.forEach((com) => {
        if (com.locked || com.hided) {
          return;
        }

        const { x, y, w, h } = com.attr;
        const rect1 = { x: sx, y: sy, w: sw, h: sh };
        const rect2 = { x, y, w, h };
        com.hovered = checkRectIntersect(rect1, rect2);
      });
    };

    const confirmCancel = (ev: MouseEvent) => {
      const dom = ev.target as HTMLElement;
      const cls = ["canvas-panel", "screen-shot", "canvas-panel-wrap"];
      if (cls.includes(dom.className)) {
        cancelable.value = true;
      } else {
        cancelable.value = false;
      }
    };

    const getSelectComs = () => {
      return coms.value.filter((com) => {
        if (com.locked || com.hided || !com.hovered) {
          com.selected = false;
          return false;
        }
        com.selected = true;
        return true;
      });
    };

    const hideArea = () => {
      areaWidth.value = 0;
      areaHeight.value = 0;
    };

    const cancelSelectCom = () => {
      EditorModule.selectCom();
    };

    const dragOver = (ev: DragEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      ev.dataTransfer.dropEffect = "copy";
    };

    //监控滚动条的值来对鹰眼框进行同步
    watch(
      () => EditorModule.eyeView,
      (eyeView) => {
        const { scale } = canvas.value;
        const deltaW = pageConfig.value.width * scale + 100;
        const deltaH = pageConfig.value.height * scale + 100;
        var span = document.getElementById("select-span") as HTMLSpanElement;
        var current_x = Math.round((eyeView.x / deltaW) * 190);
        var current_y = Math.round((eyeView.y / deltaH) * 110);
        span.style.transform =
          "translate(" + current_x + "px," + current_y + "px)";
      },
      { deep: true }
    );

    const eyeMove = (ev: MouseEvent) => {
      var canvasWp = document.getElementById("canvas-wp") as HTMLDivElement;
      var span = document.getElementById("select-span") as HTMLSpanElement;
      const { scale } = canvas.value;

      const deltaW = pageConfig.value.width * scale + 100;
      const deltaH = pageConfig.value.height * scale + 100;

      var x = 0;
      var y = 0;

      var max_x = 190 - span.offsetWidth;
      var max_y = 110 - span.offsetHeight;

      if (span.style.transform.length > 0) {
        var regex = /(?<=\()(.+?)(?=\))/g;
        var xyList = span.style.transform.match(regex)[0].split(",");
        x = parseInt(xyList[0].replaceAll("px", "").trim());
        y = parseInt(xyList[1].replaceAll("px", "").trim());
      }

      const move = (e: MouseEvent) => {
        var move_x = Math.round(e.clientX - ev.clientX);
        var move_y = Math.round(e.clientY - ev.clientY);
        var current_x = 0;
        var current_y = 0;

        if (span.style.transform.length > 0) {
          current_x = x + move_x;
          current_y = y + move_y;

          if (x + move_x > max_x) {
            current_x = max_x;
          }
          if (x + move_x < 0) {
            current_x = 0;
          }
          if (y + move_y > max_y) {
            current_y = max_y;
          }
          if (y + move_y < 0) {
            current_y = 0;
          }
        }

        canvasWp.scrollTop = Math.round((current_y / 110) * deltaH);
        canvasWp.scrollLeft = Math.round((current_x / 190) * deltaW);
        span.style.transform =
          "translate(" + current_x + "px," + current_y + "px)";
      };

      const up = () => {
        off(document, "mousemove", move);
        off(document, "mouseup", up);
      };

      on(document, "mousemove", move);
      on(document, "mouseup", up);
    };

    return {
      coms,
      screenShotStyle,
      canvasPanelStyle,
      selectSpanStyle,
      dropToAddCom,
      cancelSelectCom,
      dragOver,
      handleMouseDown,
      selectionW,
      selectionH,
      areaStartX,
      areaStartY,
      areaWidth,
      areaHeight,
      eyeMove,
      eyeView,
      zoomEyeView,
    };
  },
});
</script>

<style lang="scss" scoped>
.canvas-main {
  position: relative;
  display: flex;
  height: 100%;
  padding: 0;
  user-select: none;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
}

.canvas-panel-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;

  .canvas-panel {
    top: 40px;
    left: 40px;
    background-position: center, right bottom;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, contain;
    box-shadow: rgba(0, 0, 0, 0.5) 0 0 30px 0;
    transition: 0.2s all ease-in-out;
    transform-origin: 0 0;
  }
}
</style>

<style lang="scss">
.datav-com .datav-wraper,
.datav-layer .datav-wraper {
  pointer-events: none !important;
}

.datav-wraper {
  box-sizing: border-box;
}

.thumbnail {
  .datas-thumbnail {
    position: absolute;
    bottom: 7px;
    right: 5px;
    user-select: none;
    //background-color: rgba(0, 0, 0, 0.5);
    background-color: rgba(224, 224, 224, 0.5);
    box-shadow: 0 0 20px 0 #005497;
    width: 190px;
    height: 110px;

    span {
      z-index: 2;
      width: 30px;
      height: 30px;
      cursor: move;
      border: 1px solid #005497;
      //box-shadow: 0 0 30px 0 #000;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
