<template>
  <component :is="comName" :screen-data="screenData" />
</template>

<script lang='ts'>
import {
  defineComponent,
  onMounted,
  ref,
  watch,
} from 'vue'
import { getPublishScreen } from '@/api/screen'
import screen from './screen.vue'
import { getUrlKey } from '@/utils/util'
import { useMessage } from 'naive-ui'

import { anonymousLogin } from '@/api/screen'

import { EditorModule } from '@/store/modules/editor'
import { useRoute } from 'vue-router'
import { getToken } from '@/utils/token-util'
import router from '@/routes'

export default defineComponent({
  name: 'Preview',
  components: {
    screen,
  },
  props: {
    screenId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {

    const screenData = ref(null)
    const comName = ref(null)
    const route = useRoute();
    const nMessage = useMessage()

    onMounted(async () => {
      initData(+props.screenId);
    })

    const initData = async (screenId: number) => {
      try {

        let token = getUrlKey('token', window.location.href)

        if (!token) {
          // nMessage.warning('没有访问令牌')
          // return
          token = getToken();

          if (!token) {
            if (router.currentRoute.value.name != "Login") {
              router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
            }
          }
          else {
            EditorModule.agent_umbrella_token = token
            const retModel = await getPublishScreen(screenId, token)
            if (retModel.data.code == 200) {
              const data = retModel.data.data
              screenData.value = data
              comName.value = 'screen'
            }
            else {
              nMessage.error(retModel.data.msg, { duration: 0, closable: true })
            }
          }
        }
        else {
          const loginRes = await anonymousLogin(decodeURIComponent(token))
          if (loginRes.data.code == 200) {
            const screenToken = loginRes.data.data
            EditorModule.agent_umbrella_token = screenToken
            const retModel = await getPublishScreen(screenId, screenToken)
            if (retModel.data.code == 200) {
              const data = retModel.data.data
              screenData.value = data
              comName.value = 'screen'
            }
            else {
              nMessage.error(retModel.data.msg, { duration: 0, closable: true })
            }
          }
          else {
            if (loginRes.data.msg == '账号名或密码错误') {
              nMessage.error('发布密码可能已更新，请重新发布应用', { duration: 0, closable: true })
            }
            else {
              nMessage.error(loginRes.data.msg, { duration: 0, closable: true })
            }
          }


        }
      } catch (error) {
        console.log(error)
        if (router.currentRoute.value.name != "Login") {
          router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
        }
      }
    }

    watch(() => route.params.screenId, (newId, oldId) => {
      initData(+newId);
    })

    return {
      screenData,
      comName,
    }
  },
})
</script>

<style lang="scss">
//全局文字不能选中 滨江的需求
span {
  user-select: none;
}
</style>
