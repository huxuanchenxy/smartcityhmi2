<template>
  <div class="divWindow">
    <div class="divPwdTitle">
      发布密码
    </div>
    <n-input-group>
      <n-input
        v-model:value="publishPassword"
        :style="{ width: '50%' }"
        type="password"
        show-password-on="mousedown"
        placeholder="密码"
      />
      <n-button type="primary"  :focusable="false" ghost @click="updatePwd">
        更新
      </n-button>
    </n-input-group>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { testPassword } from '@/utils/util'
import { setPublishPassword } from '@/api/system'

export default defineComponent({
  name: 'SystemSetting',
  setup() {
    const nMessage = useMessage()
    const publishPassword = ref('')

    const updatePwd = () =>{
      if(!publishPassword.value)
      {
        nMessage.warning('密码不能为空')
        return
      }

      if(publishPassword.value.length<8)
      {
        nMessage.warning('密码长度不能小于8位')
        return
      }

      if(!testPassword(publishPassword.value))
      {
        nMessage.warning('密码必须包含1个大写字母、1个小写字母、1个数字和1个特殊字符')
        return
      }

      setPublishPassword(publishPassword.value).then(res => {
        if(res.data.code==200)
        {
          nMessage.success('更新成功')
        }
        else
        {
          nMessage.error(res.data.msg)
        }
      }).catch(err=>{
        nMessage.error(err.message)
      })

    }


    return {
      publishPassword,
      updatePwd,
    }
  },
})
</script>

<style>
.divWindow
{
    width:800px;
    height:100%;
    margin: 20px auto;
}

.divPwdTitle
{
    font-size: 12pt;
    font-weight: bold;
}
</style>
