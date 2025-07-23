<template>
  <div class="my-screen">
    <div class="screen">
      <div class="screen-title">
        <div class="main-name">
          <g-tooltip-popover
            placement="top-start"
            :delay="1000"
            :content="screen.name"
          >
            <div class="screen-name-input">
              <n-icon>
                <IconEdit />
              </n-icon>
              <input
                v-model.trim="screenName"
                class="input"
                @blur="onInputBlur"
              />
            </div>
          </g-tooltip-popover>
        </div>
      </div>
      <div class="screen-info">
        <router-link
          :to="{ name: 'ScreenEditor', params: { projectId: screen.id } }"
          target="_blank"
          class="edit-wrap"
        >
          <div class="screen-img" :style="thumbnailStyle"></div>
        </router-link>
      </div>
      <div class="screen-main">
        <div class="screen-edit">
          <div class="publish-info">
            <span
              class="dot"
              :class="{ published: publishState.published }"
            ></span>
            <span>{{ publishState.text }}</span>
          </div>
          <div class="center-space"></div>
          <div class="right-button">
            <router-link
              :to="{ name: 'Preview', params: { screenId: screen.id } }"
              target="_blank"
              class="preview"
            >
              <g-tooltip-popover content="预览">
                <n-icon size="20">
                  <IconPreview />
                </n-icon>
              </g-tooltip-popover>
            </router-link>
            <div class="public" @click="doPublish">
              <g-tooltip-popover content="发布">
                <n-icon size="20">
                  <IconRelease />
                </n-icon>
              </g-tooltip-popover>
            </div>
            <div class="public">
              <g-tooltip-popover content="复制">
                <span class="button-span" @click="confirmCopyProject">
                  <n-icon size="20">
                    <IconCopy />
                  </n-icon>
                </span>
              </g-tooltip-popover>
            </div>
            <div class="public">
              <g-tooltip-popover content="删除">
                <span class="button-span" @click="confirmDeleteProject">
                  <n-icon size="20">
                    <IconDelete />
                  </n-icon>
                </span>
              </g-tooltip-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { globalConfig } from "@/config";
import { Project } from "@/domains/project";
import {
  IconCopy,
  IconDelete,
  IconEdit,
  IconMove,
  IconPreview,
  IconRelease,
  IconWarning,
} from "@/icons";
import { ProjectModule } from "@/store/modules/project";
import { useDialog, useMessage } from "naive-ui";
import {
  PropType,
  computed,
  defineComponent,
  h,
  inject,
  ref,
  toRefs,
} from "vue";

//const cdn = import.meta.env.VITE_APP_CDN

export default defineComponent({
  name: "MyScreen",
  components: {
    IconMove,
    IconCopy,
    IconDelete,
    IconEdit,
    IconPreview,
    IconRelease,
  },
  props: {
    screen: {
      type: Object as PropType<Project>,
      required: true,
    },
  },
  setup(props) {
    const nMessage = useMessage();
    const nDialog = useDialog();
    const { deleteProject, copyProject, updateProjectName } = ProjectModule;
    //const { id, name, groupId, share, thumbnail,config,snapshotId } = toRefs(props.screen)
    const { id, name, groupId, thumbnail, config } = toRefs(props.screen);
    const screenName = ref(name.value);
    const oldScreenName = ref(name.value);
    const thumbnailStyle = computed(() => {
      if (thumbnail.value) {
        return {
          "background-image": `url(${thumbnail.value})`,
        };
      } else if (config.value.screenshot) {
        return {
          "background-image": `url(${config.value.screenshot})`,
        };
      }
      return {
        "background-image": `url(${globalConfig.logo})`,
        "background-size": "50%",
        "background-position": "center center",
        "background-repeat": "no-repeat",
        filter: "grayscale(1)",
        opacity: 0.07,
      };
    });

    const snapshotId = computed(() => {
      return props.screen.snapshotId;
    });

    const publishState = computed(() => {
      //const published = !!share.value
      const published = !!snapshotId.value;
      return {
        published,
        text: published ? "已发布" : "未发布",
      };
    });

    const onInputBlur = async () => {
      if (screenName.value) {
        try {
          await updateProjectName({ id: id.value, newName: screenName.value });
          name.value = screenName.value;
        } catch (error) {
          nMessage.error(error.message);
        }
      } else {
        screenName.value = oldScreenName.value;
      }
    };

    const confirmCopyProject = () => {
      copyProject({ pid: id.value, gid: groupId.value });
    };

    const confirmDeleteProject = () => {
      const d = nDialog.create({
        content: `${screenName.value} 删除后无法恢复，确认删除？`,
        negativeText: "取消",
        negativeButtonProps: {
          round: true,
          ghost: true,
          color: "#7E7E7E",
          focusable: false,
        },
        positiveText: "确定",
        positiveButtonProps: {
          round: true,
          color: "#0647a1",
        },
        iconPlacement: "top",
        autoFocus: false,
        icon: () => h(IconWarning),
        onPositiveClick: async () => {
          d.loading = true;
          try {
            await deleteProject({ pid: id.value, gid: groupId.value });
          } catch (error) {
            nMessage.error(error.message);
          }
        },
      });
    };

    const dragStart = inject("dragStart") as Function;
    const dragEnd = inject("dragEnd") as Function;
    const publish = inject("publish") as Function;

    const image = new Image();
    /*    image.src = `${cdn}/datav/drag-thumbnail.png`*/
    image.src = `data/originPic/drag-thumbnail.png`;

    const onDragStart = (event: DragEvent) => {
      dragStart();

      const dt = event.dataTransfer;
      if (dt) {
        dt.effectAllowed = "copyMove";
        dt.setDragImage(image, 30, 30);
        dt.setData("text", `${id.value},${groupId.value}`);
      }
    };

    const onDragEnd = () => {
      dragEnd();
    };

    const doPublish = () => {
      publish(id.value);
    };

    return {
      name,
      thumbnailStyle,
      publishState,
      screenName,
      oldScreenName,
      onInputBlur,
      confirmCopyProject,
      confirmDeleteProject,
      onDragStart,
      onDragEnd,
      doPublish,
    };
  },
});
</script>

<style lang="scss" scoped>
.my-screen {
  margin: 24px 32px 32px 0;
}

.cursor-pointer {
  cursor: pointer !important;
}

.modal-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 907px;
  height: 526px;
  border-radius: 10px;
  margin-top: 100px;
}

:deep(.n-button__content) {
  font-family: "思源黑体Normal";
}

.name-title-img {
  margin-left: 10px;
}

.screen {
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  width: 336px;
  height: 249px;
  border: 1px solid var(--datav-border-color);
  transition: 0.2s;

  .screen-title {
    // width: 100%;
    // position: relative;
    display: flex;
    // align-items: center;
    // justify-content: center;

    .main-name {
      border-radius: 10px 10px 0 0;
      width: 336px;
      height: 30px;
      display: flex;
      align-items: center;
      position: relative;
      justify-content: center;
      color: #fff;
      background-color: #0e62a9;
      padding: 0 10px;

      .screen-name-input {
        width: 100%;
        font-size: 14px;
        display: flex;
        align-items: center;
        //justify-content: center;
        margin-left: 12px;

        .input {
          text-overflow: ellipsis;
          /* 添加省略效果 */
          white-space: nowrap;
          /* 防止文本换行 */
          overflow: hidden;
          /* 隐藏溢出的内容 */
          color: #fff;
          background: 0 0;
          max-width: 200px;
          /* 如果需要，可以设置一个最大宽度，而不是固定宽度 */
          cursor: default;

          &:hover {
            color: #fff;
            /* 鼠标悬浮时的样式，如果需要 */
          }
        }
      }
    }
  }

  .publish-info-text {
    margin-left: 1rem;
  }

  .screen-info {
    cursor: pointer;
    width: 334px;
    height: 189px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #001426;
    background-image: url("/public/images/project/画面背景.png"),
      linear-gradient(to bottom, #003e76, #001426);
    background-repeat: no-repeat, repeat;
    background-position: center, 0 0;
    background-size: 300px 160px, auto;

    .edit-wrap {
      width: 304px;
      height: 172px;

      .edit {
        min-width: 116px;
        padding: 0 30px;
        font-size: 16px;
      }
    }

    img {
      width: 334px;
      height: 189px;
    }
  }

  &:hover {
    box-shadow: var(--datav-shadow);
    border: var(--datav-border-primary);

    .screen-info {
      .screen-edit {
        opacity: 1;
        pointer-events: all;
      }
    }
  }

  .dialog-body {
    margin-bottom: 20px;
    margin-left: 40px;
  }

  .screen-in {
    width: 302px;
    height: 192px;
    border-radius: 0 0 20px 20px;
  }

  .screen-main {
    .screen-edit {
      border-radius: 0 0 10px 10px;
      position: relative;
      display: flex;
      width: 100%;
      height: 30px;
      align-items: center;
      justify-content: flex-start;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;

      .left-button {
        display: flex;
        justify-content: space-around;
        font-size: 19px;
        align-items: center;
        color: #fff;
        min-width: 120px;
        height: 36px;
      }

      .center-space {
        width: 40%;
      }

      .right-button {
        display: flex;
        justify-content: space-around;
        font-size: 19px;
        align-items: center;
        color: #fff;
        height: 30px;
        min-width: 50px;
        flex: 1;
      }

      .screen-button {
        text-align: center;

        .button-span {
          padding: 0 10px;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.2s;

          &:hover {
            color: var(--datav-main-hover-color);
          }
        }
      }

      .preview {
        padding: 0 5px;
        white-space: nowrap;
      }

      .public {
        padding: 0 5px;
        white-space: nowrap;
        color: #fff;
        cursor: pointer;
        transition: color 0.2s;
      }

      .preview,
      .public {
        color: #fff;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: var(--datav-main-hover-color);
        }
      }
    }
  }
}

.modal-center-title {
  display: flex;
  justify-content: center;
  margin-top: 30px;

  span {
    width: 110px;
    height: 35px;
    font-size: 24px;
    font-family: "思源黑体Normal";
    color: #7e7e7e;
  }
}

.publish-info {
  span {
    margin-left: 12px;
    margin-top: 6px;
    margin-bottom: 7px;
    font-size: 12px;
  }

  .published {
    color: #1d9f3a !important;
  }

  .notPublished {
    color: #0e62a9 !important;
  }
}

.input-group1 {
  display: flex;
  margin-bottom: 59px;
  margin-top: 46px;

  span {
    width: 110px;
    height: 35px;
    font-size: 22px;
    font-family: "思源黑体Normal";
    color: #7e7e7e;
    // margin-left:85px;
  }

  img {
    width: 150px;
    height: 100px;
    // margin-left: -100px;
  }
}

.create-dialog {
  font-family: Arial, sans-serif;
  padding: 20px;
  height: 250px;

  span {
    color: #a8a8a8;
  }
}

.input-group {
  display: flex;
  margin-bottom: 59px;

  // margin-top: 20px;
  span {
    width: 110px;
    height: 35px;
    font-size: 22px;
    font-family: "思源黑体Normal";
    color: #7e7e7e;
    // margin-left:85px;
  }

  img {
    width: 150px;
    height: 100px;
    // margin-left: -100px;
  }
}

.name-title-one,
.name-title {
  margin-bottom: 5px;
  color: #333;
  margin-top: 3px;
  width: 90px;
}

.server-input {
  .name-input {
    border-radius: 8px;
    height: 30px;
    width: 400px;
    padding: 10px;
    border: 1px solid #ccc;
    color: #a8a8a8;
  }

  .na-input {
    border-radius: 8px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.name-title-button {
  border: 1px solid #ccc;
  width: 8rem;
  height: 8rem;
  border-radius: 2rem;
  color: #ccc;
  background-color: white;

  span {
    font-size: 6rem;
  }
}

.name-input {
  margin-left: 10px;
  border-radius: 4rem;
  height: 30px;
  width: 70%;
  padding: 10px;
  border: 1px solid #ccc;
  color: #a8a8a8;
}

.server-input {
  .name-input {
    border-radius: 20px;
    height: 48px;
    width: 558px;
    padding: 10px;
    border: 1px solid #ccc;
    color: #a8a8a8;
    font-size: 20px;
  }

  .na-input {
    border-radius: 8px;
  }
}

.name-select .n-base-selection-label {
  border-radius: 16px !important;
  /* 调整下拉选项的圆角 */
}

.n-select {
  border-radius: 0 0 0 10rem !important;
  margin-left: 10px;
  width: 70%;
  // border: #A8A8A8;
}

:deep(.name-select, .n-base-selection-label) {
  border-radius: 16px !important;
}

.cancel-button {
  color: #333;
}

.button {
  margin-top: 30px;
  margin-left: 10px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  height: 48px;
  width: 158px;
  font-size: 24px;
  margin-bottom: 41px;
}

.n-base-selection {
  border-radius: 10rem;
  border: #a8a8a8;
}

.n-base-selection-label {
  border-radius: 10rem;
  border: #a8a8a8;
}
</style>
