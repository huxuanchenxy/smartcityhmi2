<template>
  <div>
    <div class="project-header">
      <div class="project-title">
        <span>项目列表</span>
      </div>
      <div class="header-manager">
        <div class="search">
          <input v-model="searchText" class="search-input" placeholder="搜索项目关键字">
        </div>
        <n-icon class="icon-search">
          <IconSearch />
        </n-icon>
      </div>
    </div>
    <!-- <div class="project-header"> -->
    <!-- </div> -->
    <div class="main-screen">
      <div class="main-project" v-for="screen in filteredScreens" :key="screen.id">
        <my-screen :remote="true" :screen="screen" @screen-deleted="fetchProjects" @screen-update="fetchProjects"
          @change="handleScreenChange" />
      </div>
      <div class="new-project" title="创建应用" @click="openModel">
        <div class="btn-add-project">
          <img :src="`data/originPic/plus.png`" style="cursor: pointer;">
        </div>
      </div>
    </div>
  </div>
  <n-modal v-model:show="showModal" class="modal-center" :mask-closable="false">
    <n-card style="width: 907px;height:526px; display: flex; " :bordered="false" size="huge" role="dialog"
      aria-modal="true">
      <div class="modal-center-title">
        <span>项目列表</span>
      </div>
      <div class="dialog-body">
        <n-form ref="formRef" :model="formModel" :rules="formRules" label-placement="left" label-width="auto"
          require-mark-placement="right-hanging">
          <div class="input-group">
            <n-form-item style="font-size: 20px;" :span="200" label="项目名称" path="name" required>
              <n-input v-model:value="formModel.name" placeholder="请输入项目名称" />
            </n-form-item>
          </div>
        </n-form>
        <div class="input-group">
          <span class="name-title" for="groupId">设置封面</span>
          <uploadimg v-model="pageConfig.bgimage" class="name-title-img" />
        </div>
      </div>

      <div class="dialog-footer">
        <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="closeLoading" quaternary
          round class="button cancel-button">
          取消
        </n-button>
        <n-button size="small" color="#0647a1" :focusable="false" round :loading="saveLoading" @click="doCreate"
          class="button confirm-button">
          确认
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang='ts'>
import {
  defineComponent, ref, PropType,
  computed, watch, reactive
} from 'vue'
import { ProjectGroup } from '@/domains/project'
import { IconSearch } from '@/icons'
import MyScreen from './new-my-screen.vue'
import { EditorModule } from '@/store/modules/editor'
import { onMounted, inject } from 'vue'
import { useMessage, FormInst } from 'naive-ui'
import { projectList, projectCreate, projectSearch } from '@/api/ic'
import { useRouter } from 'vue-router'
import uploadimg from './upload.vue'
import { setProjectId, setisIde } from '@/utils/token-util'



interface Screen {
  id: number;
  name: string;
  thumbnail: string;
  groupId: number;
  createAt: string;
  updateAt: string;
  share: string
}
export default defineComponent({
  name: 'ProjectList',
  components: {
    MyScreen,
    IconSearch,
    uploadimg
  },
  props: {
    group: Object as PropType<ProjectGroup>,
  },
  setup(props, context) {
    const screens = ref([] as Screen[]);
    const showModal = ref(false)
    const searchText = ref('')
    const name = ref('')
    const saveLoading = ref(false)
    const nMessage = useMessage()
    const pageConfig = computed(() => EditorModule.pageConfig)
    const openModel = () => {
      formModel.name = ''
      showModal.value = true
    }
    const formModel = reactive({
      name: '', // 初始为空字符串
    });
    const closeLoading = () => {
      showModal.value = false;
    }
    const fetchSearchResults = async (searchText) => {
      try {
        const response = await projectSearch(searchText);
        if (Array.isArray(response.data)) {
          screens.value = response.data;
        } else {
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
    // 当搜索条件变化时，重新获取搜索结果
    watch(searchText, () => {
      fetchSearchResults(searchText.value);
    });
    watch(showModal, (newValue, oldValue) => {
      if (newValue) {
        pageConfig.value.bgimage = '';
      }
    });
    const formRules = reactive({
      name: {
        required: true,
        message: '项目名称不能为空',
        trigger: 'blur'
      },
      // 可以添加其他表单项的规则...
    });

    const filteredScreens = computed(() => {
      return screens.value
        .filter((screen) => {
          const name = screen.name;
          return name != null && name.toLowerCase().includes(searchText.value.toLowerCase());
        })
        .map((screen) => {
          const typedScreen = screen as Screen;
          return typedScreen;
        });
    });

    const doCreate = async () => {
      try {
        const res = await projectCreate(formModel.name, pageConfig.value.bgimage);

        if (res.data.code === 200) {
          nMessage.success('项目创建成功！');
          name.value = '';
          closeLoading();
          fetchProjects();
        } else {
          if (formModel.name === '') {
            nMessage.error('项目名称不能为空！');
            return;
          }
          nMessage.error(res.data.msg || '项目名称已经存在！');
        }
      } catch (error) {
        nMessage.error('创建过程中出现问题，请稍后重试！');
      }
    }
    const sort = ref('name')

    const handleSortChange = (key: string) => {
      sort.value = key
    }

    const fetchProjects = async () => {
      try {
        const res = await projectList(pagination.pageSize);
        screens.value = res.data.data.records;
        pagination.pageCount = Math.ceil(res.data.data.total / pagination.pageSize);
        pagination.itemCount = res.data.data.total;
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const pagination = reactive({
      page: 1, // 初始化为第一页
      pageCount: 0, // 初始化时没有页数，将根据API响应动态计算
      pageSize: 100000000,
      itemCount: 0,
    });

    const router = useRouter()

    const changeProject = inject('changeProject') as (project: any) => void

    const handleScreenChange = (props) => {
      setProjectId(props.id, 2592000);
      setisIde(props.isIde, 2592000);
      changeProject(props);
      router.push({ name: 'CavansList' })
    }
    onMounted(() => {
      fetchProjects();
    })
    const formRef = ref<FormInst | null>(null)
    return {
      // handlePageChange,
      pagination,
      fetchProjects,
      handleScreenChange,
      sort,
      screens,
      handleSortChange,
      saveLoading,
      doCreate,
      name,
      showModal,
      closeLoading,
      openModel,
      // fetchScreenData,
      searchText,
      filteredScreens,
      pageConfig,
      formRef,
      formRules,
      formModel,
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            nMessage.success('验证成功')
          } else {
            console.log(errors)
            nMessage.error('验证失败')
          }
        })
      },
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

@mixin cover-img {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #131e2d;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50%;
  filter: grayscale(1);
  opacity: 0.36;
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
