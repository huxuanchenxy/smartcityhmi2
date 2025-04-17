<template>
  <div>
    <div>
      <div class="user-content">
        <span>参数配置</span>
      </div>

    </div>

  </div>
</template>


<script lang='ts'>
import { h, defineComponent } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'


export default defineComponent({
  name: 'MyScreen',
  components: {
  },
  setup() {
    const message = useMessage()

  }
})
</script>

<style lang="scss" scoped>
.user-content {
  margin-top: 10px;
  margin-left: 10px;
  font-size: 20px;
  color: #9E9E9E;

  h3 {
    margin-left: 2vh;
    margin-top: 2vh;
  }
}

.user-table {
  margin-top: 4vh;
  margin-left: 4vh;
}

:deep(table thead tr th) {
  background-color: #E5EAF4 !important;
  color: #98999C !important;
  font-size: 1.5rem;
}

:deeo(.n-data-table td) {
  text-align: center;
  /* 使表格内容居中 */
}

:deep(.n-data-table th) {
  text-align: center;
  /* 使表头内容居中 */
}
</style>
