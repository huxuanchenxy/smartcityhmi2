<template>
  <div>
    <div>
      <div class="Server-content">
        <span>角色管理</span>
      </div>
      <div class="server-hidden">
        <div class="Server-search">
          <div class="Server-search-left">
            <label>角色名称</label>
            <input type="text" class="Server-input" placeholder="" v-model="searchParams.name" />
          </div>
          <div class="Server-search-right">
            <n-button class="Server-button" color="#1D9F3A" @click="Search">
              <n-icon>
                <IconServerSearch />
              </n-icon>
              <span>查询</span></n-button>
            <n-button tertiary class="Server-button  button-reset" @click="Reset">
              <n-icon>
                <IconServerReset />
              </n-icon><span>重置</span></n-button>
            <n-button class="Server-button" color="#0E62A9" @click="CreateAuthority">
              <n-icon>
                <IconServerAdd />
              </n-icon><span>新建</span></n-button>
          </div>
        </div>
        <div class="Server-table">
          <n-data-table :columns="columns" :data="tableData" :pagination="pagination" @update:page="handlePageChange"
            :bordered="false" :remote="true">
            <template v-slot:empty>
              <div class="empty-data">
                <n-icon>
                  <IconNodata />
                </n-icon>
                <p>当前无数据显示</p>
              </div>
            </template>
          </n-data-table>
        </div>
      </div>

    </div>
    <!-- 新增 -->
    <n-modal v-model:show="showModal" class="modal-center">
      <n-card
        style="width: 900px;height:402px; padding-right: 113px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title" style="margin-bottom: 20px;">
          <span>{{ action_title }}</span>
        </div>
        <div class="server-model">
          <n-form class="authority-from" ref="formRef" :model="model" :rules="rules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging" :style="{
              maxWidth: '640px'
            }">
            <div class="input-group">
              <n-grid>
                <n-form-item-gi :span="100" label="角色名称" path="name">
                  <div class="warning-input">
                    <n-input v-model:value="model.name" placeholder="" />
                  </div>
                </n-form-item-gi>
                <n-form-item-gi :span="100" label="描述" path="description">
                  <div class="warning-input">
                    <n-input v-model:value="model.description" placeholder="" />
                  </div>
                </n-form-item-gi>
              </n-grid>
            </div>
          </n-form>
          <div class="input-button">
            <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="handleCancle"
              quaternary round class="button cancel-button">取消</n-button>
            <n-button size="small" color="#0647a1" :focusable="false" round class="button confirm-button"
              @click="handleSubmit">{{ action_button }}</n-button>
          </div>
        </div>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showRoleModal" class="modal-center">
      <n-card
        style="width: 1400px;height:700px;  display: flex; flex-direction: column; justify-content: center; align-items: center;"
        :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-center-title"
          style="margin-bottom: 20px;text-align: center;align-items: center;justify-content: center;">
          <span style="margin-left:0px">权限配置</span>
        </div>
        <div class="server-model" style="width:1300px;height:480px;overflow:scroll">
          <n-tree ref="menuTreeRef" :data="treeData" :default-expand-all="true" :render-suffix="renderContent" checkable
            :default-checked-keys="defaultCheckedKeys" @update:checked-keys="handleCheckChange">
          </n-tree>
        </div>
        <div class="input-button">
          <n-button style="border: 1px solid #A8A8A8;" size="small" :focusable="false" @click="handleTreeCancle"
            quaternary round class="button cancel-button">取消</n-button>
          <n-button size="small" color="#0647a1" :focusable="false" round class="button confirm-button"
            @click="handleTreeSubmit">保存</n-button>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, ref, onMounted, nextTick, reactive, computed } from 'vue'
import { NButton, useMessage, FormInst, useDialog, TreeOption, FormRules, NCheckboxGroup, NSpace, NCheckbox } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { queryRole, createRole, deleteRole, modifyRole, getRoleMenuTree } from '@/api/user'
import {
  IconServerAdd,
  IconServerReset,
  IconServerSearch,
  serverConfigData,
  IconNodata,
  IconWarning
} from '@/icons'

export default defineComponent({
  name: 'MyScreen',
  components: {
    IconServerAdd,
    IconServerReset,
    IconServerSearch,
    serverConfigData,
    IconWarning,
    IconNodata,
  },
  setup() {
    const message = useMessage()
    const nDialog = useDialog();
    const showModal = ref(false)
    const showRoleModal = ref(false)
    const tableData = ref([])
    const menuTreeRef = ref<any>();

    const defaultProps = {
      children: "children",
      label: "label"
    };

    const searchParams = reactive({
      name: null,
      pageNo: 1,
      pageSize: 10
    })

    const pagination = reactive({
      page: 1,
      pageCount: 0,
      pageSize: 10,
      itemCount: 0,
      prefix({ itemCount }) {
        return `共 ${itemCount} 条`;
      }
    });
    const action_title = ref('新建角色')
    const action_button = ref('新建')

    const formRef = ref<FormInst | null>(null)

    const model = reactive({
      id: null,
      name: null,
      description: null,
      authority: {},
    })

    const treeData = ref<MenuElement[]>([])
    const defaultExpandedKeys = ref([])
    const defaultCheckedKeys = ref([])


    onMounted(() => {
      Search();
      initTree();
    })

    const Search = () => {
      pagination.page = 1;
      initData();
    }

    const level1_menu = ref([])
    const level2_menu = ref([])

    //默认菜单权限
    const default_menu_role = ref([]);
    const user_role_permissions = ref(null);
    const buttons_list = computed(() => {
      let level1_permisson = user_role_permissions.value["一级菜单"];
      let level2_permisson = user_role_permissions.value["二级菜单"];
      let blist = [];
      defaultCheckedKeys.value = ['level1', 'level2'];
      if (level1_permisson) {
        level1_permisson.forEach((item, idx) => {
          item.children.forEach((c_item, c_idx) => {
            blist.push(c_item);
          })
        })
      }
      else {
        level1_menu.value.forEach((item, idx) => {
          item.children.forEach((c_item, c_idx) => {
            blist.push(c_item);
          })
        })
      }
      if (level2_permisson) {
        level2_permisson.forEach((item, idx) => {
          item.children.forEach((c_item, c_idx) => {
            blist.push(c_item);
          })
        })
      }
      else {
        level2_menu.value.forEach((item, idx) => {
          item.children.forEach((c_item, c_idx) => {
            blist.push(c_item);
          })
        })
      }
      return blist;
    })

    const checkButtonList = ref([]);

    const initTree = () => {
      let treeList = [];
      getRoleMenuTree().then(res => {
        default_menu_role.value = res.data.data;
        level1_menu.value = default_menu_role.value["一级菜单"];
        level2_menu.value = default_menu_role.value["二级菜单"];
        let node_1 = {
          id: 'level1',
          key: 'level1',
          label: '一级菜单',
          enabled: true,
          checkboxDisabled: true,
          icon: null,
          children: []
        }

        let node_2 = {
          id: 'level2',
          key: 'level2',
          label: '二级菜单',
          checkboxDisabled: true,
          enabled: true,
          icon: null,
          children: []
        }

        defaultCheckedKeys.value = ['level1', 'level2'];
        level1_menu.value.forEach((item, idx) => {
          let child = {
            id: item._id,
            key: item._id,
            label: item.name,
            enabled: false,
            icon: null,
            children: [],
            buttons: null
          }
          if (child.enabled) {
            defaultCheckedKeys.value.push(child.id);
          }

          if (item.children && item.children.length > 0) {
            item.children.forEach((c_item, c_idx) => {
              let c_child = {
                id: c_item._id,
                key: c_item._id,
                label: c_item.name,
                enabled: false,
                icon: null,
                children: null,
                buttons: c_item.buttons
              }
              child.children.push(c_child);
              if (c_child.enabled) {
                defaultCheckedKeys.value.push(c_child.id);
              }
            })
          }
          node_1.children.push(child)
        })

        level2_menu.value.forEach((item, idx) => {
          let child = {
            id: item._id,
            key: item._id,
            label: item.name,
            enabled: false,
            icon: null,
            children: [],
            buttons: null
          }
          if (child.enabled) {
            defaultCheckedKeys.value.push(child.id);
          }
          if (item.children && item.children.length > 0) {
            item.children.forEach((c_item, c_idx) => {
              let c_child = {
                id: c_item._id,
                key: c_item._id,
                label: c_item.name,
                enabled: false,
                icon: null,
                children: null,
                buttons: c_item.buttons
              }
              child.children.push(c_child);
              if (c_child.enabled) {
                defaultCheckedKeys.value.push(c_child.id);
              }
            })
          }
          node_2.children.push(child)
        })

        treeList.push(node_1)
        treeList.push(node_2)
        treeData.value = treeList;
      });
    };

    const Reset = () => {
      searchParams.name = null
      Search();
    }

    const initData = () => {
      try {
        searchParams.pageNo = pagination.page;
        searchParams.pageSize = pagination.pageSize;
        queryRole(searchParams).then(res => {
          tableData.value = res.data.data.records;
          pagination.pageCount = res.data.data.pages;
          pagination.itemCount = res.data.data.total;
          if (tableData.value.length === 0 && pagination.page > 1) {
            pagination.page = pagination.page - 1;
            initData();
          }
        })
      } catch (error) {
        console.error('Error initData:', error);
      }
    }

    const handlePageChange = (currentPage) => {
      pagination.page = currentPage;
      initData();
    };

    const CreateAuthority = (row: AuthorityModel) => {
      action_title.value = '新建角色';
      action_button.value = '新建';
      model.id = null;
      model.name = null;
      model.description = null;
      model.authority = {};
      showModal.value = true;
    }

    const rules: FormRules = {
      name: [
        {
          required: true,
          message: '请输入用户名',
          trigger: ['input', 'blur'],
        },
      ],
      description: [
        {
          required: true,
          message: '请输入描述',
          trigger: ['input', 'blur'],
        },
      ]
    }

    const createColumns = (): DataTableColumns<AuthorityModel> => {
      return [
        {
          title: '角色名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          width: 240
        },
        {
          title: '修改时间',
          key: 'updateTime',
          align: 'center',
          width: 240
        },
        {
          title: '操作',
          key: 'actions',
          align: 'center',
          width: 180,
          render(row) {
            return h('div', [
              h('span', {
                strong: true,
                tertiary: true,
                size: 'small',
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#0E62A9',
                  fontSize: '18px',
                  textAlign: 'left'
                },
                onClick: () => EditRoleMenu(row)
              }, { default: () => '菜单权限' }),
              h('span', {
                strong: true,
                tertiary: true,
                size: 'small',
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#0E62A9',
                  fontSize: '18px',
                  marginLeft: '36px',
                  textAlign: 'left'
                },
                onClick: () => EditRole(row)
              }, { default: () => '编辑' }),
              h('span', {
                strong: true,
                tertiary: true,
                size: 'small',
                style: {
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#1D9F3A',
                  fontSize: '18px',
                  textAlign: 'left',
                  marginLeft: '36px',
                },
                onClick: () => DeleteRole(row)
              }, { default: () => '删除' }),
            ]);
          }
        }
      ]
    }

    const EditRole = (row: AuthorityModel) => {

      action_title.value = '编辑角色'
      action_button.value = '保存'
      model.id = row.id;
      model.name = row.name;
      model.description = row.description;
      model.authority = JSON.parse(row.authorityJson);
      showModal.value = true;
    }

    const EditRoleMenu = (row: AuthorityModel) => {
      user_role_permissions.value = JSON.parse(row.authorityJson);
      checkButtonList.value = [];
      currentCheckedList.value = [];

      let level1_permisson = user_role_permissions.value["一级菜单"];
      let level2_permisson = user_role_permissions.value["二级菜单"];

      defaultCheckedKeys.value = ['level1', 'level2'];
      if (level1_permisson) {
        level1_permisson.forEach((item, idx) => {
          if (item.enabled) {
            defaultCheckedKeys.value.push(item._id);
          }
          item.children.forEach((c_item, c_idx) => {
            if (c_item.enabled) {
              defaultCheckedKeys.value.push(c_item._id);
            }
          })
        })
      }
      else {
        level1_menu.value.forEach((item, idx) => {
          if (item.enabled) {
            defaultCheckedKeys.value.push(item._id);
          }
          item.children.forEach((c_item, c_idx) => {
            if (c_item.enabled) {
              defaultCheckedKeys.value.push(c_item._id);
            }
          })
        })
      }
      if (level2_permisson) {
        level2_permisson.forEach((item, idx) => {
          if (item.enabled) {
            defaultCheckedKeys.value.push(item._id);
          }
          item.children.forEach((c_item, c_idx) => {
            if (c_item.enabled) {
              defaultCheckedKeys.value.push(c_item._id);
            }
          })
        })
      }
      else {
        level2_menu.value.forEach((item, idx) => {
          if (item.enabled) {
            defaultCheckedKeys.value.push(item._id);
          }
          item.children.forEach((c_item, c_idx) => {

            if (c_item.enabled) {
              defaultCheckedKeys.value.push(c_item._id);
            }
          })
        })
      }

      model.id = row.id;
      model.name = row.name;
      model.description = row.description;
      showRoleModal.value = true;
    }

    const DeleteRole = (row: AuthorityModel) => {
      const d = nDialog.create({
        content: `确定删除？`,
        negativeText: '取消',
        negativeButtonProps: {
          round: true,
          ghost: true,
          color: '#7E7E7E',
          focusable: false,
        },
        positiveText: '确定',
        positiveButtonProps: {
          round: true,
          color: '#0647a1',
        },
        iconPlacement: 'top',
        autoFocus: false,
        icon: () => h(IconWarning),
        onPositiveClick: () => {
          d.loading = true
          try {
            deleteRole(row.id).then(r => {
              if (r.data.code == 200) {
                message.success('操作成功');
                initData();
              }
              else {
                message.error(r.data.msg);
              }
            });
          } catch (error) {
            message.error(error.message)
          }
        },
      })
    }

    const currentCheckedList = ref([]);

    const handleCheckChange = (checkedKeys) => {
      console.log(checkedKeys);
      currentCheckedList.value = checkedKeys;
      //defaultCheckedKeys.value = checkedKeys
    }

    const handleCancle = () => {
      formRef.value?.restoreValidation()
      showModal.value = false;
    }

    const handleSubmit = (e: MouseEvent) => {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          try {
            if (model.id) {
              modifyRole(model).then(res => {
                if (res.data.code === 200) {
                  message.success('操作成功');
                  formRef.value?.restoreValidation()
                  showModal.value = false;
                  Search();
                } else {
                  message.error(res.data.msg);
                }
              })
            }
            else {
              createRole(model).then(res => {
                if (res.data.code === 200) {
                  message.success('操作成功');
                  formRef.value?.restoreValidation()
                  showModal.value = false;
                  Search();
                } else {
                  message.error(res.data.msg);
                }
              })
            }
          }
          catch (error) {
            console.error('Error submit:', error);
          }
        }
      })
    }

    const handleTreeCancle = () => {
      showRoleModal.value = false;
    }

    const handleTreeSubmit = (e: MouseEvent) => {

      let copy_menu_role = JSON.parse(JSON.stringify(default_menu_role.value))
      copy_menu_role["一级菜单"].forEach((item, idx) => {
        item.enabled = false;
        currentCheckedList.value.forEach((checkItem) => {
          if (item._id == checkItem) {
            item.enabled = true;
          }
        })

        if (item.children && item.children.length > 0) {
          item.children.forEach((c_item, c_idx) => {
            c_item.enabled = false;
            currentCheckedList.value.forEach((checkItem) => {
              if (c_item._id == checkItem) {
                c_item.enabled = true;
              }
            })

            checkButtonList.value.forEach((check_item) => {
              if (c_item._id == check_item._id && c_item.name == check_item) {
                c_item.buttons = check_item.buttons
              }
            })
          })
        }
      })

      copy_menu_role["二级菜单"].forEach((item, idx) => {
        item.enabled = false;
        currentCheckedList.value.forEach((checkItem) => {
          if (item._id == checkItem) {
            item.enabled = true;
          }
        })

        if (item.children && item.children.length > 0) {
          item.children.forEach((c_item, c_idx) => {

            c_item.enabled = false;
            currentCheckedList.value.forEach((checkItem) => {
              if (c_item._id == checkItem) {
                c_item.enabled = true;
              }
            })

            checkButtonList.value.forEach((check_item) => {
              if (c_item._id == check_item._id && c_item.name == check_item) {
                c_item.buttons = check_item.buttons
              }
            })
          })
        }
      })

      model.authority = copy_menu_role;

      modifyRole(model).then(res => {
        if (res.data.code === 200) {
          message.success('操作成功');
          showRoleModal.value = false;
          Search();
        } else {
          message.error(res.data.msg);
        }
      })
    }


    const renderContent: any = ({ option }: { option: TreeOption, checked: boolean, selected: boolean }) => {
      let buttons = [];
      let getButton = false;
      if (option.children && option.children.length > 0) {
        return;
      }
      buttons_list.value.forEach((item, idx) => {
        if (!getButton) {
          if (item._id == option.key && item.name == option.label) {
            if (item.buttons) {
              buttons = item.buttons
              if (buttons.length > 0) {
                if (checkButtonList.value.length < buttons_list.value.length) {
                  checkButtonList.value.push({
                    _id: item._id,
                    name: item.name,
                    buttons: buttons
                  });
                }
              }
            }
            getButton = true;
          }
        }
      })

      if (buttons.length == 0) {
        return;
      }

      return h(NSpace, { itemStyle: { display: 'flex' } },
        buttons.map((btn) => {
          let checked = btn.enabled ? true : false
          return h(NCheckbox,
            {
              label: btn.name,
              checked: checked,
              "onUpdate:checked": (val: boolean) => { btn.enabled = val; }
            },
            { default: () => btn.name }
          )
        }
        )
      )
    };

    return {
      searchParams,
      showModal,
      formRef,
      pagination,
      handlePageChange,
      Reset,
      Search,
      tableData,
      CreateAuthority,
      columns: createColumns(),
      action_title,
      action_button,
      model,
      rules,
      treeData,
      defaultCheckedKeys,
      handleCheckChange,
      handleCancle,
      handleSubmit,
      showRoleModal,
      menuTreeRef,
      defaultProps,
      renderContent,
      handleTreeCancle,
      handleTreeSubmit
    }
  },
})

export interface AuthorityModel {
  createTime: string
  createByName: string
  updateTime: string
  updateByName: string
  deleted: number
  id?: number
  name: string
  description: string
  authorityJson: string
  authority?: number
  parentId?: number
  children?: any[],
}

export interface UpdateMenuList {
  menuId: string
  checkedList: string[]
}

export interface UpdateMenus {
  roleId: string
  menus: UpdateMenuList[]
}

export interface MenuElement {
  allAuthorities?: Authority[]
  authorities?: Authority[]
  checked: boolean
  children?: MenuElement[]
  enabled: number
  hasChildrenFlag: boolean
  icon: string
  id: string
  name: string
  parentId?: string
  title: string
}

export interface Authority {
  authorityId: string
  name: string
}
</script>

<style lang="scss" scoped>
@import '@/styles/main-content.scss';

.tree-container {
  max-height: 250px;
  height: 250px;
  overflow-y: auto;
  width: 300px;
}

:deep(.n-tree-node-content__text) {
  font-size: 16px;
}

:deep(.n-checkbox-box-wrapper) {
  height: 26px;
}

:deep(.n-checkbox__label) {
  font-size: 16px;
  color: #0E62A9
}

:deep(.n-tree-node-content__text) {
  width: 200px;
}

:deep(.n-tree-node-content__suffix) {}
</style>
