<template>
  <div
    class="datav-gui g-upload"
    :class="[
      {
        '--inline --single': !!inline,
      }
    ]"
  >
    <n-input
      :value="modelValue"
      size="small"
      placeholder="请输入图片地址"
      @update:value="handleInput"
    >
      <template #prefix>
        <n-icon>
          <IconLink />
        </n-icon>
      </template>
    </n-input>
    <n-upload
      accept="image/*"
      :action="action"
      :multiple="false"
      :show-file-list="false"
      :data="form"
      :headers="httpHeaders"
      @before-upload="beforeUpload"
      @finish="finishUpload"
    >
      <n-upload-dragger>
        <n-spin :show="loading">
          <div class="g-upload-image-wrap" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <div class="g-upload-image-content">
              <img v-if="modelValue && !iserr" :src="modelValue">
              <div v-else class="g-upload-tip">
                <n-icon size="60">
                  <IconImg />
                </n-icon>
                <div>点击或拖拽文件到这里更换</div>
              </div>
            </div>
            <div v-show="visibleCover" class="g-upload-image-cover">
              <n-popover
                v-model:show="visible"
                :placement="'left'"
                trigger="click"
                :width="350"
                :show-arrow="false"
                class="g-select-image-popover"
                :style="{
                  '--color': 'var(--datav-gui-bgcolor-back)'
                }"
              >
                <template #trigger>
                  <span @click.stop="syncUploadImages()">选择</span>
                </template>
                <div class="g-select-image-dropdown-menu-wrap">
                  <ul class="g-select-image-dropdown-menu">
                    <template v-if="images && images.length > 0">
                      <li
                        v-for="img in images"
                        :key="img.resourceId"
                        class="g-select-image-dropdown-menu-item"
                        @click="onSelectImg(img)"
                      >
                        <img :src="getUploadImagesUrl(img.resourceUrl)" class="g-select-image-img">
                        <span>{{ img.originalFileName }}</span>
                      </li>
                    </template>
                    <li v-else class="g-select-image-dropdown-menu-item --empty">
                      <span>列表为空</span>
                    </li>
                  </ul>
                </div>
              </n-popover>
              <p style="padding: 0 10px;">|</p>
              <span>上传</span>
              <p style="padding: 0 10px;">|</p>
              <span @click.stop="removeImage">删除</span>
            </div>
          </div>
        </n-spin>
      </n-upload-dragger>
    </n-upload>
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref, watch, PropType, onMounted } from 'vue'
import { useMessage, UploadFileInfo } from 'naive-ui'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'
import { generateId } from '@/utils/util'
import { DatavUploadImageType } from '@/utils/types'
import { uploadHost, previewHost, validAllowImg } from '@/utils/upload-util'
//import { getTokenByEnv } from '@/api/qiniu'
import { IconLink, IconImg } from '@/icons'
import { UploadImagesModule } from '@/store/modules/images'
import { getUploadImagesUrl } from '@/api/images'
import { getToken } from '@/utils/token-util'

export default defineComponent({
  name: 'GUploadImage',
  components: {
    IconLink,
    IconImg,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    allowType: {
      type: String,
      default: 'gif|jpeg|jpg|png',
    },
    size: {
      type: Number,
      default: 20,
    },
    action: {
      type: String,
      default: uploadHost,
    },
    previewHost: {
      type: String,
      default: previewHost,
    },
    label: {
      type: String,
      default: '',
    },
    inline: {
      type: [Boolean, String],
      default: false,
    },
  },
  emits: [UPDATE_MODEL_EVENT,'change'],
  setup(props, ctx) {
    const visible = ref(false)
    const nMessage = useMessage()
    const loading = ref(false)
    const form = ref({
      key: '',
      //      token: '',
    })

    const httpHeaders = ref({ token : '' })

    const iserr = ref(false)
    const visibleCover = ref(false)
    const images = computed(() => {
      return UploadImagesModule.dataUploadImages
    })

    const syncUploadImages = () => {

    }

    const onSelectImg = (img: DatavUploadImageType) => {
      visible.value = false
      visibleCover.value = false
      ctx.emit(UPDATE_MODEL_EVENT, getUploadImagesUrl(img.resourceUrl))
      ctx.emit('change', getUploadImagesUrl(img.resourceUrl));
    }

    const beforeUpload = async (options: { file: UploadFileInfo; event: Event; }) => {
      const valid = validAllowImg(options.file.file, {
        allowType: props.allowType,
        allowSize: props.size,
      })

      if (valid) {
        nMessage.error(valid)
        return false
      }

      try {
        loading.value = true
        //form.value.token = await getTokenByEnv()
        form.value.key = `upload/${generateId()}_${options.file.name}`

        httpHeaders.value.token = getToken()

        return true
      } catch (error) {
        loading.value = false
        nMessage.error(error.toString())
      }

      return false
    }

    const finishUpload = (options: { file: UploadFileInfo; event: Event; }) => {
      loading.value = false

      const res = JSON.parse((options.event.target as XMLHttpRequest).response)
      if (res.error) {
        nMessage.error(res.error)
      } else {
        UploadImagesModule.loadUploadImages(null)
        ctx.emit(UPDATE_MODEL_EVENT, getUploadImagesUrl(res.data))
        ctx.emit('change', getUploadImagesUrl(res.data));
      }
    }

    const handleInput = (value: string) => {
      ctx.emit(UPDATE_MODEL_EVENT, value)
    }

    const zoomImage = () => {
      const img = new Image()
      img.src = props.modelValue
      img.onload = () => {
        iserr.value = false
      }

      img.onerror = () => {
        iserr.value = true
        if (props.modelValue) {
          nMessage.error('图片加载失败')
        }
      }
    }

    const handleMouseEnter = () => {
      //if (props.modelValue) {
      visibleCover.value = true
      //}
    }

    const handleMouseLeave = () => {
      if (!visible.value) {
        visibleCover.value = false
      }
    }

    const removeImage = () => {
      handleInput('')
      visibleCover.value = false
      visible.value = false
      ctx.emit('change', '');
    }

    watch(() => props.modelValue, zoomImage)

    return {
      visible,
      loading,
      form,
      iserr,
      visibleCover,
      images,
      syncUploadImages,
      beforeUpload,
      finishUpload,
      handleInput,
      handleMouseEnter,
      handleMouseLeave,
      removeImage,
      onSelectImg,
      getUploadImagesUrl,
      httpHeaders,
    }
  },
})
</script>
