<!--<template>
  <div class="datav-wrapper" :style="titleStyle">
         <template v-for="item in data.countList" :key="item.title" :value="em.title">
            <div class="popup-item">
            <span><img :src="item.imgUrl">{{item.title}}</span>
             <em>{{item.value}}</em>
             </div>
        </template>
      <div class="popup-wrap">
      <div class="popup-title" title="${data.title}">
        {{data.title.length>15?data.title.substring(0,14)+"…":data.title}}
      </div>
      <div class="popup-count">{{data.count}}</div>
      <div class="popup-addr">{{data.address}}<span>{{data.level}}</span></div>
  </div>
</template>
<script lang='ts'>
import {
  defineComponent,
  PropType,
  computed,
  toRef,
  getCurrentInstance,
  Component,
} from "vue";
import type { CSSProperties } from "vue";
import { useDataCenter, getFieldMap } from "@/mixins/data-center";
import { ApiModule } from "@/store/modules/api";
import { HandleItemField } from "@/components/data-handle";
import { LocalValueModule } from "@/store/modules/localvalue";
import { DatavError } from "@/domains/error";

export default defineComponent({
  name: "VModalPanelBasic",
  props: {
    com: {
      required: true,
    },
  },
  setup(props) {
    const titleStyle = computed(() => {
      const style = {
        width: `100%`,
        height: `auto`,
        "font-family": `Microsoft YaHei, Arial, sans-serif`,
        "font-size": `18px`,
        "justify-content": "start",
        "background-color": "initial",
        border: "none",
        "border-radius": "0px",
        transform: "translateZ(0px)",
        display: "flex",
        "align-items": "center",
        "text-overflow": "ellipsis",
        "white-space": "nowrap",
        overflow: "hidden",
      };
      return style as CSSProperties;
    });

    return {
      titleStyle,
    };
  },
});
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.popup-wrap {
  background: transparent;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}
.popup-title {
  background: url(//datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/a941707268b462a317529847629078d5.png)
    no-repeat left center;
  font-size: 24px;
  color: #fff;
  background-size: 450px 63px;
  line-height: 63px;
  height: 63px;
  padding: 0 15px;
  position: relative;
}
.popup-desc {
  padding: 16px 20px 5px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  line-height: 1.6;
}
.popup-count {
  margin: 0 0 18px;
  background: transparent;
  padding: 10px 35px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.13);
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3) inset;
}
.popup-item {
  padding: 20px 0;
}
.popup-item img {
  vertical-align: middle;
  margin-right: 10px;
}
.popup-item span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
.popup-item em {
  font-weight: normal;
  font-style: normal;
  color: #ffe700;
  padding-top: 8px;
  font-size: 26px;
  display: block;
  vertical-align: middle;
  padding-left: 27px;
}
.popup-item div {
  display: inline;
}
.popup-addr {
  margin-left: 20px;
  padding: 0 20px 20px 23px;
  line-height: 1;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
}
.popup-addr:before {
  content: "";
  left: 0;
  background: url(//datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/2b3e9cb38998e19a2c44b5e64d9d19ec.png);
  background-size: 14px 18px;
  position: absolute;
  width: 14px;
  height: 18px;
}
.popup-addr span {
  position: absolute;
  background: rgba(15, 157, 217, 0.25);
  border: 1px solid #0f9dd9;
  border-radius: 3px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  height: 20px;
  line-height: 1.4;
  right: 15px;
  padding: 0 6px;
}
</style>-->
