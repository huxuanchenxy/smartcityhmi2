<template>
  <n-config-provider :theme-overrides="themeOverrides" abstract :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider closable keep-alive-on-hover>
      <n-dialog-provider>
        <AppMessage />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { themeOverrides } from "@/styles/themes/naive-ui-theme-overrides";
import AppMessage from "./AppMessage.vue";
import { HandleItemField } from "./components/data-handle";
import { emitter } from "./mitter";
import { zhCN, dateZhCN } from 'naive-ui'

export default defineComponent({
  name: "App",
  components: {
    AppMessage,
  },
  setup() {
    return {
      themeOverrides,
      zhCN,
      dateZhCN
    };
  },
  mounted() {
    this.setupClientBindings();

    window.onmessage = ((e) => {
      try {
        let data = JSON.parse(e.data);
        const field: HandleItemField = {
        name: "PmControl",
        targetComId: "PmControl",
        targetComAlias: "PmControl",
        targetMethodName: "onmessage",
        targetMethodTitle: "窗体通讯",
        hasParams: true,
        hasScript: true,
        params: data,
        showDeleteConfirm: false,
      };
      emitter.emit("PmControl", field);
      } catch (error) {
        //console.log(error);
      }
    })
  },
  methods: {
    setupClientBindings() {
      if ((window as any).ue == null || (window as any).ue.interface == null) {
        return;
      }
      (window as any).ue.interface.initWeb = this.initWeb;
      //(window as any).ue.interface.screenevents = this.screenevents;
      (window as any).ue.interface.OnPOIClicked = this.OnPOIClicked;
      (window as any).ue.interface.OnbuildClicked = this.OnbuildClicked;
      (window as any).ue.interface.OnVirtualCameraClick = this.OnVirtualCameraClick;
      (window as any).ue.interface.OnDiurnalchange = this.OnDiurnalchange;
    },
    initWeb() {
      // let that = this;
      // that.$router.push({ name: "publish", params: { screenId: 74 },query:{token:"fSsdCh09Y2A%2BIUl%2Bxuf6tw%3D%3D"} });
      // window.location.href = "http://localhost/#/publish/74?token=fSsdCh09Y2A%252BIUl%252Bxuf6tw%253D%253D";
    },

    OnPOIClicked(e) {
      this.screenevents(e);
    },

    OnVirtualCameraClick(e) {
      this.screenevents(e);
    },

    OnDiurnalchange(e) {
      this.screenevents(e);
    },

    OnbuildClicked(e) {
      this.screenevents(e);
    },

    screenevents(data: any) {
      console.log(data);
      const field: HandleItemField = {
        name: "UeMap",
        targetComId: "UeMap",
        targetComAlias: "UeMap",
        targetMethodName: "screenevents",
        targetMethodTitle: "底座通讯",
        hasParams: true,
        hasScript: true,
        params: data,
        showDeleteConfirm: false,
      };
      emitter.emit("UeMap", field);
    },
  },
});
</script>
