<template>
  <!-- <n-modal v-model:show="dialogVisible" preset="dialog" :show-icon="false" title="创建画面" style="width: 400px"
    @close="closeDialog" :autoFocus="false">
    <div class="create-dialog">
      <p class="name-title"><span class="required">*</span>画面名称</p>
      <n-input v-model:value="projectName" placeholder="请输入画面名称" />
    </div>
    <template #action>
      <n-button :focusable="false" @click="closeDialog">
        取消
      </n-button>
      <n-button type="primary" :focusable="false" :loading="saveLoading" @click="doCreate">
        创建
      </n-button>
    </template>
  </n-modal> -->
  <n-modal v-model:show="dialogVisible" class="modal-center" :mask-closable="false">
    <n-card style="width: 907px;height:426px; display: flex; " :bordered="false" size="huge" role="dialog"
      aria-modal="true">
      <div class="modal-center-title">
        <span>创建画面</span>
      </div>
      <div class="dialog-body">
        <n-form label-placement="left" label-width="auto" require-mark-placement="right-hanging">
          <div class="input-group">
            <n-form-item style="font-size: 20px;" :span="200" label="画面名称" path="name" required>
              <n-input v-model:value="projectName" placeholder="请输入画面名称" />
            </n-form-item>
          </div>
        </n-form>
      </div>
      <div class="dialog-footer">
        <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="closeDialog" quaternary
          round class="button cancel-button">
          取消
        </n-button>
        <n-button size="small" color="#0647a1" :focusable="false" round :loading="saveLoading" @click="doCreate"
          class="button confirm-button">
          创建
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, computed, inject } from 'vue'
import { useMessage } from 'naive-ui'
import { ProjectGroup } from '@/domains/project'
import { getProjects, createProject } from '@/api/project'
import { ProjectModule } from '@/store/modules/project'
import { getProjectId } from '@/utils/token-util'

export default defineComponent({
  name: 'AddScreen',
  components: {
  },
  props: {
    visible: Boolean,
  },
  setup(props) {
    const nMessage = useMessage()
    const loading = ref(true)
    const dialogVisible = computed(() => props.visible)

    const projectName = ref('')

    // const groupId = ref(0)
    // const groups = ref([]) //const groups = ref([new ProjectGroup(0, '未分组')])

    const saveLoading = ref(false)

    const closeDialog = inject('closeAddProject') as Function

    // const groupOpts = computed(() => {
    //   return groups.value.map(m => ({ value: m.id, label: m.name }))
    // })

    onMounted(async () => {
      // getProjects().then(res => {
      //   if (res && res.data.code === 200) {
      //     groups.value.push(
      //       ...res.data.data.map(({ id, name }: any) => ({ id, name })),
      //     )
      //   }
      // })
    })

    const doCreate = async () => {
      try {
        if (!projectName.value) {
          nMessage.error('请输入应用名称')
          return
        }
        saveLoading.value = true

        const res = await createProject({
          name: projectName.value,
          //groupId: groupId.value,
          groupId: getProjectId(),
          templateId: 0,
          config: {
            width: 1920,
            height: 1080,
            bgimage: 'data/originPic/bj.png',
            bgcolor: 'rgba(13,42,67,0)',
            grid: 8,
            screenshot: '',
            zoomMode: 1,
            useWatermark: false,
            styleFilterParams: {
              enable: false,
              hue: 0,
              saturate: 100,
              brightness: 100,
              contrast: 100,
              opacity: 100,
            },
          },
        })
        if (res.data.code === 200) {
          //visibleCreateDialog.value = false
          //visible.value = false
          ProjectModule.getProjects().then(() => {
            closeDialog()
          })
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        nMessage.error(error.message)
      } finally {
        saveLoading.value = false
      }
    }

    return {
      loading,
      dialogVisible,
      projectName,
      // groupId,
      // groups,
      // groupOpts,
      saveLoading,
      doCreate,
      closeDialog
    }
  },
})
</script>

<style lang="scss" scoped>
@import "@/styles/mixins/function.scss";

@font-face {
  font-family: "Orbitron-Bold";
  src: url("@/styles/fonts/orbitron-bold.ttf") format("truetype");
}

:deep(.n-form-item-label) {
  font-size: 24px;
  margin-left: 79px;
  color: #7E7E7E;
  font-family: '思源黑体Normal';
}

:deep(.n-form-item-blank) {
  width: 558px;
}

.create-dialog {
  font-family: Arial, sans-serif;
  padding: 20px;
  height: 250px;

  span {
    color: #A8A8A8;
  }
}

:deep(.n-button__content) {
  font-family: '思源黑体Normal';
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

.dialog-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.dialog-body {
  margin-bottom: 20px;
  margin-left: 40px
}

.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.input-group {
  display: flex;
  // margin-bottom: px;
  margin-top: 30px;

  span {
    width: 120px;
    height: 35px;
    font-size: 24px;
    font-family: '思源黑体Normal';
    color: #7E7E7E;
    margin-left: 75px;
  }

  img {
    width: 150px;
    height: 100px;
    // margin-left: -100px;.
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

.name-title-one,
.name-title {
  margin-bottom: 5px;
  color: #333;
  margin-top: 3px;

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

.project-header {
  span {
    font-size: 21px
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
  color: #7E7E7E;
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

@mixin slider-blur($placement: left, $angle: -90deg) {
  content: " ";
  position: absolute;
  top: 0;
  #{$placement}: 0;
  background-image: linear-gradient(#{$angle},
    rgba(0, 0, 0, 0) 64%,
  );
  width: 82px;
  height: 96px;
  pointer-events: none;
  z-index: 1;
}

@import '@/styles/mixins/util';

.ellipsis {
  @include utils-ellipsis;

  display: block;
}

.new-projects-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--datav-main-color);
  padding: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.new-projects {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: -32px;

  .new-project {
    width: 258px;
    height: 78px;
    margin: 16px 32px 16px 0;
    vertical-align: middle;
    border: 1px solid #39414d;
    background: #22272e;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    color: #fff;

    img {
      width: 150px;
      height: 100%;
    }

    &:hover {
      border-color: var(--datav-main-color);

      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(36, 131, 255, 0.08);
      }
    }
  }

  .project-type {
    padding-left: 8px;
    flex: 1;
    font-size: 14px;
  }
}

.project-header {
  position: sticky;
  top: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  z-index: 1;
  min-width: 1024px;
  background-color: #fff;

  .project-title {
    display: flex;
    align-items: center;

    span {
      max-width: 100px;
      font-size: 24px;
      color: #7E7E7E;
    }
  }


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

.name-title-img {
  margin-left: 10px;
}

.header-manager {
  display: flex;
  align-items: center;
  font-size: 14px;

  .search {
    margin-right: 6px;
    transform: translateX(30px);

    .search-input {
      @include utils-ellipsis;
      color: #000;
      padding: 0 10px;
      line-height: 30px;
      height: 30px;
      padding-right: 30px;
      padding-left: 20px;
      border: 1px solid #c5c5c5;
      border-radius: 20px;
      transition: 0.2s;

      &:hover,
      &:focus {
        border: var(--datav-border-primary);
        box-shadow: var(--datav-shadow);
      }
    }
  }

  .icon-search {
    padding: 0 24px 0 4px;
    color: var(--datav-font-color);
    cursor: pointer;
    z-index: 1;
  }

  .sort-type {
    @include utils-ellipsis;

    display: inline-block;
    color: var(--datav-font-color);
    line-height: 30px;
    cursor: pointer;
    font-size: 14px;
    min-width: 100px;

    .icon-arrow {
      font-size: 14px;
      margin-left: 4px;
    }

    &:hover {
      color: var(--datav-main-color);
    }
  }
}

.main-screen {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  user-select: none;
  margin-top: 1rem;
  padding: 0;
  height: calc(100vh - 170px);
  overflow-y: auto;

  .new-project {
    margin: 24px 32px 32px 0;
    ;
    width: 336px;
    height: 249px;
    border: 2px solid rgb(14, 98, 170, .6);
    border-radius: 10px;

    .btn-add-project {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 336px;
      height: 249px;

      img {
        width: 100px;
        height: 100px
      }
    }
  }
}
</style>
