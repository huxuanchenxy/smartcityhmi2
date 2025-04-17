<template>
  <div class="ds-wrapper ds-static">
    <g-monaco-editor
      language="json"
      :auto-format="true"
      :code="apiDataConfig.config.parentData"
      @blur="updateData"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, ComputedRef, inject } from 'vue'
import { ApiDataConfig } from '@/components/data-source'

export default defineComponent({
  name: 'DsFromParentEditor',
  setup() {
    const apiDataConfig = inject('apiDataConfig') as ComputedRef<ApiDataConfig>

    const updateData = (data: any) => {
      apiDataConfig.value.config.parentData = data.value
    }

    return {
      apiDataConfig,
      updateData,
    }
  },
})
</script>
