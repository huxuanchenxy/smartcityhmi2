<template>
  <div class="com-title-wp">
    <div class="com-title">
      <div class="title-name">
        <span class="alias-name">{{ comAlias }}</span>
        <!-- <n-tooltip placement="right">
          <template #trigger>
            <n-icon class="com-doc-icon">
              <IconDocument />
            </n-icon>
          </template>
          {{ `${comTitle}文档` }}
        </n-tooltip> -->
        <div class="version-tag">
          <span>{{ comTitle }}</span>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { findComByName } from "@/data/system-components";
import { IconDocument } from "@/icons";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "SettingPanel",
  components: {
    IconDocument,
  },
  props: {
    comName: {
      type: String,
      required: true,
    },
    comAlias: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const comTitle = computed(() => {
      const obj = findComByName(props.comName);
      if (props.comName == "VCustomerComp") {
        return "自定义组件";
      } else {
        return obj?.com.alias;
      }
    });

    return {
      comTitle,
    };
  },
});
</script>

<style lang="scss" scoped>
.com-title-wp {
  position: relative;
  display: flex;
  height: 50px;
  padding-top: 12px;
  padding-right: 8px;
  color: var(--datav-font-color);
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #c8c8c8;
  line-height: 30px;

  .com-title {
    padding-right: 5px;
    padding-left: 10px;
    overflow: hidden;
    flex: 1;

    .title-name {
      display: flex;
      padding-bottom: 3px;
      font-size: 14px;
      flex-wrap: nowrap;
      align-items: center;
    }

    .alias-name {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      flex-grow: 1;
    }

    .com-doc-icon {
      margin-left: 4px;
      font-size: 12px;
      color: #f8b81c;
      cursor: pointer;
    }

    .version-tag {
      min-width: 80px;
      display: flex;
      flex-direction: row-reverse;
      font-size: 12px;
      color: #647279;
      flex-wrap: nowrap;
    }
  }
}
</style>
