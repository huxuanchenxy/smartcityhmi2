<template>
  <div class="my-project">
    <div class="project-main">
      <div class="project-manage" style="display:none;">
        <div class="manage-title">
          <div class="my-project project-group">
            <span style="margin-left: 10px;font-size: 24px;">应用分组</span>
            <n-icon class="btn-add-icon" @click="adding = true">
              <IconPlus />
            </n-icon>
          </div>
          <div
            class="my-project project-all"
            :class="{ 'project-checked-color': selectedGroupId === group.id }"
            @click="toggleProject(group.id)"
          >
            <span>{{ group.name }}</span>
            <span class="project-num">{{ group.children.length }}</span>
          </div>
          <div v-if="adding" class="new-group">
            <input
              v-focus
              class="edit-input"
              @blur="onAddInputBlur"
              @keyup.enter="addGroup"
            >
          </div>
        </div>

        <div class="manage-main" :class="{ draging: draging }">
          <div
            v-for="g in groups"
            :key="g.id"
            class="main-project group-project"
            :class="{ 'project-checked-color': selectedGroupId === g.id }"
            @click="toggleProject(g.id)"
            @dragover.prevent
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            @drop="onDrop($event, g)"
          >
            <template v-if="g.editing">
              <input
                v-focus
                :default-value="g.name"
                class="edit-input"
                @blur="onEditInputBlur($event, g)"
                @keyup.enter="editGroup($event, g)"
              >
            </template>
            <template v-else>
              <span class="project-name">{{ g.name }}</span>
              <span class="project-num">{{ g.children.length }}</span>
              <span class="group-btns">
                <n-icon :size="14" @click="g.editing = true">
                  <IconEdit />
                </n-icon>
                <n-icon :size="14" class="btn-add-icon" @click="confirmDeleteGroup(g)">
                  <IconDelete />
                </n-icon>
              </span>
            </template>
          </div>
          <div
            class="main-project"
            :class="{ 'project-checked-color': selectedGroupId === ungroup.id }"
            @click="toggleProject(ungroup.id)"
            @dragover.prevent
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            @drop="onDrop($event, ungroup)"
          >
            <span class="project-name project-ungrouped">{{ ungroup.name }}</span>
            <span class="project-num">{{ ungroup.children.length }}</span>
          </div>
        </div>
      </div>
      <div class="project-screen-list">
        <g-loading :spinning="loading">
          <project-list :group="selectedGroup" />
        </g-loading>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { h, defineComponent, ref, computed, provide, onMounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { ProjectGroup } from '@/domains/project'
import { ProjectModule } from '@/store/modules/project'
import { addClass, removeClass } from '@/utils/dom'
import { IconWarning, IconPlus, IconEdit, IconDelete } from '@/icons'
import ProjectList from './project-list.vue'
// import NewProjectList from './Project-list.vue'

export default defineComponent({
  name: 'MyProject',
  components: {
    ProjectList,
    IconPlus,
    IconEdit,
    IconDelete,
    // NewProjectList
  },
  setup() {
    const nMessage = useMessage()
    const nDialog = useDialog()
    const {
      getProjects, moveProject,
      createProjectGroup, deleteProjectGroup, updateProjectGroupName,
    } = ProjectModule

    const selectedGroupId = ref(-1)
    const loading = ref(true)
    const adding = ref(false)
    const draging = ref(false)

    const group = computed(() => ProjectModule.group)
    const ungroup = computed(() => ProjectModule.ungroup)
    const groups = computed(() => ProjectModule.groups)

    const selectedGroup = computed(() => {
      if (selectedGroupId.value === -1) {
        return group.value
      }

      if (selectedGroupId.value === 0) {
        return ungroup.value
      }

      return groups.value.find(g => g.id === selectedGroupId.value)
    })

    const toggleProject = (id: number) => {
      selectedGroupId.value = id
    }

    const onAddInputBlur = (e: any) => {
      if (!adding.value) {
        return
      }

      const name = (e.target.value || '').trim()
      if (!name) {
        adding.value = false
      }
    }

    const addGroup = async (e: any) => {
      if (!adding.value) {
        return
      }

      const name = (e.target.value || '').trim()
      if (name) {
        try {
          await createProjectGroup(name)
          adding.value = false
        } catch (error) {
          nMessage.error(error.message)
        }
      } else {
        adding.value = false
      }
    }

    const onEditInputBlur = (e: any, group: any) => {
      if (!group.editing) {
        return
      }

      const newName = (e.target.value || '').trim()
      if (!newName || group.name === newName) {
        group.editing = false
      }
    }

    const editGroup = async (e: any, group: any) => {
      if (!group.editing) {
        return
      }

      const newName = (e.target.value || '').trim()
      if (newName && group.name !== newName) {
        try {
          await updateProjectGroupName({ id: group.id, newName })
          group.name = newName
          group.editing = false
        } catch (error) {
          nMessage.error(error.message)
        }
      } else {
        group.editing = false
      }
    }

    const confirmDeleteGroup = (group: ProjectGroup) => {
      const d = nDialog.create({
        content: `${group.name} 删除后无法恢复，该分组中的可视化应用将全部移动到未分组，确认删除？`,
        negativeText: '取消',
        positiveText: '确定',
        iconPlacement: 'top',
        autoFocus: false,
        icon: () => h(IconWarning),
        onPositiveClick: async () => {
          d.loading = true
          try {
            await deleteProjectGroup(group.id)
            toggleProject(ungroup.value.id)
          } catch (error) {
            nMessage.error(error.message)
          }
        },
      })
    }

    provide('dragStart', () => {
      draging.value = true
    })
    provide('dragEnd', () => {
      draging.value = false
    })

    const onDragEnter = (event: any) => {
      addClass(event.target, 'drag-enter')
    }

    const onDragLeave = (event: any) => {
      removeClass(event.target, 'drag-enter')
    }

    const onDrop = (event: any, toGroup: ProjectGroup) => {
      event.preventDefault()
      removeClass(event.target, 'drag-enter')

      const str = event.dataTransfer.getData('text')
      if (str) {
        const [pid, fromId] = str.split(',').map((m: string) => parseInt(m))
        if (fromId !== toGroup.id) {
          moveProject({ pid, fromId, toId: toGroup.id })
        }
      }
    }

    onMounted(() => {

      getProjects().catch(error => {
        if(error.message){
          nMessage.error(error.message)
        }

        if(error.data.message){
          nMessage.error(error.data.message)
        }

      }).finally(() => {
        loading.value = false
      })

    })

    return {
      loading,
      group,
      ungroup,
      groups,
      selectedGroup,
      selectedGroupId,
      adding,
      toggleProject,
      onAddInputBlur,
      addGroup,
      onEditInputBlur,
      editGroup,
      confirmDeleteGroup,
      draging,
      onDragEnter,
      onDragLeave,
      onDrop,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/util';
@import '@/styles/mixins/function';

.my-project {
  position: relative;
  user-select: none;
  color: #000;

  .project-main {
    display: flex;
    flex: 1;
  }

  .project-manage {
    min-width: 240px;
    max-width: 240px;
    color: var(--datav-font-color);
    position: sticky;
    top: 90px;
    font-size: 14px;
    overflow-y: auto;
    height: calc(100vh - 90px);
    box-shadow: 0px 0px 10px 5px #e5e5e5;
    z-index: 3;


    .manage-main {
      display: flex;
      flex-direction: column;
      font-size: 12px;

      &.draging {
        background: rgba(36, 127, 255, 0.3);
      }
    }

    .my-project {
      line-height: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 15px;
    }

    .manage-title {
      .project-group {
        padding-left: 10px;
        height: 72px;
        //border-bottom: 1px solid #27343e;
      }

      .btn-add-icon {
        font-size: 14px;
        cursor: pointer;

        &:hover {
          color: var(--datav-main-color);
        }
      }
    }

    .project-ungrouped {
      //color: var(--datav-font-color);
      color: #000;
    }

    .project-all {
      padding-left: 20px;
      transition: color 0.2s;
      cursor: pointer;
      font-size: 20px;

      &:hover {
        color: var(--datav-main-color);
      }
    }

    .project-checked-color {
      background-color: #e6eff6;
      color: #0b61aa;
      //background-repeat: round;

      &:hover {
        color: #0b61aa !important;
      }

      .project-name {
        color: #000;
      }
    }

    .project-num {
      user-select: none;
      color: #000;
      font-size: 20px;
    }

    .group-btns {
      display: none;
      color: var(--datav-main-color);

      i+i {
        margin-left: 10px;
      }
    }

    .main-project {
      position: relative;
      height: 36px;
      padding: 0 15px 0 20px;
      display: flex;
      font-size: 12px;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: color 0.2s;



      .project-name {
        width: 165px;
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        pointer-events: none;
        font-size: 20px;
      }

      &:hover {
        .project-name {
          color: var(--datav-main-color);
        }
      }

      &.drag-enter {
        background: var(--datav-body-bg);
      }
    }

    .group-project {
      &:hover {
        .project-num {
          display: none;
        }

        .group-btns {
          display: inline-block;
        }
      }
    }
  }

  .new-group {
    padding: 5px 30px 5px 50px;
  }

  .edit-input {
    @include utils-ellipsis;

    background: var(--datav-bgcolor-2);
    color: #fff;
    padding: 0 10px;
    line-height: 30px;
    width: 100%;
    height: 30px;
    border: var(--datav-border-primary);
    transition: 0.2s;
    box-shadow: var(--datav-shadow);
  }

  .project-screen-list {
    width: 100%;
  }

  .g-nested-loading {
    height: 100% !important;
  }
}
</style>
