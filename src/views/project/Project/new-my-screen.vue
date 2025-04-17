<template>
  <div class="my-screen">
    <div class="screen">
      <div class="screen-title">
        <div class="main-name">
          <g-tooltip-popover placement="top-start" :delay="1000" :content="screen.name">
            <div class="screen-name-input">
              <ProjectIcon />
              <span class="input">{{ screen.name }}</span>
            </div>
          </g-tooltip-popover>
        </div>
      </div>

      <div class="screen-info" @click="toggleItem()">
        <img :src="newthumbnail" v-if="newthumbnail" />
        <div v-else class="screen-in"></div>
      </div>
      <div class="screen-main">
        <div class="screen-edit">
          <div class="publish-info">
            <span :class="{ published: isPublished, notPublished: !isPublished }">
              {{ isPublished ? '已发布' : '未发布' }}
            </span>
          </div>
          <div class="center-space"></div>
          <div class="right-button">
            <g-tooltip-popover content="发布" style="margin-right: 12px;">
              <n-icon size="17" class="cursor-pointer">
                <projectIssue />
              </n-icon>
            </g-tooltip-popover>
            <g-tooltip-popover content="编辑" style="margin-right: 12px;">
              <n-icon size="17" @click="openModal" class="cursor-pointer">
                <NewIconScreenEdit />
              </n-icon>
            </g-tooltip-popover>
            <g-tooltip-popover content="删除" style="margin-right: 20px;">
              <n-icon size="18" @click="confirmDeleteProject(screen.id)" class="cursor-pointer">
                <IconDelete />
              </n-icon>
            </g-tooltip-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
  <n-modal v-model:show="showModal" class="modal-center" :mask-closable="false"> 
    <n-card style="width: 907px;height:526px; display: flex; " :bordered="false" size="huge" role="dialog"
      aria-modal="true">
      <div class="modal-center-title">
        <span>编辑项目</span>
      </div>
      <div class="dialog-body">
        <div class="input-group1">
          <span class="name-title">项目名称：</span>
          <div class="server-input">
            <new-input id="serverCode" v-model="newname" placeholder="" class="name-input" />
          </div>
        </div>
        <div class="input-group">
          <span class="name-title" for="groupId">设置封面：</span>
          <uploadimg v-model="thumbnail" class="name-title-img" ref="uploadComponent" />
        </div>
      </div>
      <div class="dialog-footer">
        <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="closeLoading" quaternary
          round class="button cancel-button">
          取消
        </n-button>
        <n-button size="small" color="#0647a1" round @click="confirmUpdateProject(screen.id)"
          class="button confirm-button">
          编辑
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang='ts'>
import { h, defineComponent, PropType, toRefs, computed, ref, } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { Project } from '@/domains/project'
import {
  IconWarning, IconDelete, NewIconScreenEdit, ProjectIcon, projectIssue
} from '@/icons'
import { EditorModule } from '@/store/modules/editor'
import { projectDelete, projectUpdate, projectSearch } from '@/api/ic'
import uploadimg from './upload.vue'

export default defineComponent({
  name: 'MyScreen',
  components: {
    IconDelete,
    NewIconScreenEdit,
    ProjectIcon,
    IconWarning,
    uploadimg,
    projectIssue
  },
  props: {
    screen: {
      type: Object as PropType<Project>,
      required: true,
    },
    isPublished: Boolean
  },
  // emits: ['screen-deleted'],
  setup(props, context) {
    const pageConfig = computed(() => EditorModule.pageConfig)
    const newname = ref('');
    const newthumbnail = ref('');
    const showModal = ref(false)
    const saveLoading = ref(false);
    const nMessage = useMessage()
    const nDialog = useDialog()
    const { id, name, groupId, thumbnail, config } = toRefs(props.screen)
    newname.value = name.value;
    newthumbnail.value = thumbnail.value;
    const screenName = ref(name.value)
    const openModal = () => {
      showModal.value = true;
    };
    const closeLoading = () => {
      showModal.value = false;
      // context.emit('screen-deleted');
    }
    const getProjectId = () => {
      return props.screen.id;
    };

    const confirmUpdateProject = async (id) => {
      if (newname.value) {
        saveLoading.value = true;
        try {
          const dataToSubmit = {
            ...props.screen,
            name: newname.value,
            thumbnail: thumbnail.value,
          };
          const res = await projectUpdate(dataToSubmit);

          if (res.data.code === 200) {
            nMessage.success('项目编辑成功！');
            context.emit("screen-update");
            showModal.value = false;
            newthumbnail.value = thumbnail.value;
          } else if (res.data.code === 500) {
            nMessage.error(res.data.msg);
          } else {
            nMessage.error(res.data.msg);
          }
        } catch (error) {
          console.error(error);
          nMessage.error('编辑过程中出现问题，请稍后重试！');
        }
      } else {
        nMessage.error('项目名称不能为空');
      }
    };


    const confirmDeleteProject = (id: number) => {
      const d = nDialog.create({
        content: `${screenName.value} 删除后无法恢复，确认删除？`,
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
            const res = await projectDelete(id);
            if (res.data.code === 200) {
              nMessage.success('项目删除成功！');
              context.emit('screen-deleted', id);
            } else {
              nMessage.error(res.data.msg);
            }
          } catch (error) {
            nMessage.error(error.message)
          }

        },
      })
    }
    const activeItem = ref(0)

    const toggleItem = () => {
      activeItem.value = props.screen.id
      context.emit('change', props.screen)
    }

    return {
      newname,
      screenName,
      saveLoading,
      confirmUpdateProject,
      confirmDeleteProject,
      getProjectId,
      showModal,
      closeLoading,
      newthumbnail,
      openModal,
      toggleItem,
      thumbnail,
      pageConfig
    }
  },
})
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
:deep(.n-button__content){
  font-family: '思源黑体Normal';
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
      background-color: #0E62A9;
      padding: 0 10px;

      .screen-name-input {
        width: 100%;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -12px;

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
    background-image:
      url("/public/images/project/项目背景.png"),
      linear-gradient(to bottom, #003E76, #001426);
    background-repeat: no-repeat, repeat;
    background-position: center, 0 0;
    background-size: 200px 130px, auto;

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
    margin-left: 40px
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

      .edit-wrap {
        width: 304px;
        height: 172px;

        .edit {
          min-width: 116px;
          padding: 0 30px;
          font-size: 16px;
        }
      }

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
        width: 50%;
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
        padding: 0 10px;
        white-space: nowrap;
      }

      .public {
        padding: 0 10px;
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
    font-family: '思源黑体Normal';
    color: #7E7E7E;
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
    color: #1D9F3A !important;
  }

  .notPublished {
    color: #0E62A9 !important;
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
    font-family: '思源黑体Normal';
    color: #7E7E7E;
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
    color: #A8A8A8;
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
    font-family: '思源黑体Normal';
    color: #7E7E7E;
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
    color: #A8A8A8;
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
  color: #A8A8A8;
}

.server-input {
  .name-input {
    border-radius: 20px;
    height: 48px;
    width: 558px;
    padding: 10px;
    border: 1px solid #ccc;
    color: #A8A8A8;
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
  border: #A8A8A8;
}

.n-base-selection-label {
  border-radius: 10rem;
  border: #A8A8A8;
}
</style>
