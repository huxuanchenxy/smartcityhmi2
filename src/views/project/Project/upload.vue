<template>
  <div class="datav-gui g-upload">
    <n-upload accept="image/*" :action="action" :multiple="false" :show-file-list="false" :data="form"
      :headers="httpHeaders" @before-upload="beforeUpload" @finish="finishUpload">
      <n-upload-dragger>
        <n-spin :show="loading">
          <div class="g-upload-image-wrap" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <div class="g-upload-image-content">
              <img v-if="modelValue && !iserr" :src="modelValue">
              <div v-else class="g-upload-tip">
                <n-icon size="60">
                  <Uploadimage />
                </n-icon>
                <div>点击或拖拽文件到这里更换</div>
              </div>
            </div>
            <div v-show="visibleCover" class="g-upload-image-cover">
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
import { IconLink, IconImg, Uploadimage } from '@/icons'
import { UploadImagesModule } from '@/store/modules/images'
import { getUploadImagesUrl } from '@/api/images'
import { getToken } from '@/utils/token-util'

export default defineComponent({
  name: 'GUploadImage',
  components: {
    IconLink,
    IconImg,
    Uploadimage
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
  emits: [UPDATE_MODEL_EVENT, 'change'],
  setup(props, ctx) {
    const visible = ref(false)
    const nMessage = useMessage()
    const loading = ref(false)
    const form = ref({
      key: '',
    })

    const httpHeaders = ref({ token: '' })

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

    // console.log(
    //   watch(() => props.modelValue, zoomImage)

    // );

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

<style lang="scss" scoped>
.g-upload {
  width: 160px;
  height: 160px;
  border-radius: 20px;
  .n-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    height:  160px;
    margin-top: 3px;
    background: var(--datav-gui-component-bgcolor);

    &:hover {
      background: var(--datav-gui-component-bgcolor-hover);
    }
  }

  .n-upload-trigger,
  .n-upload-dragger,
  .n-spin-container,
  .n-spin-content,
  .g-upload-image-wrap {
    width: 100%;
    height: 100%;
    padding: 0;
    background-color: #F0F4FD;
  }

  .g-upload-image-content {
    width: 100%;
    height: 100%;
    padding: 10px;
    padding-top: 30px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .g-upload-image-cover {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--datav-font-color);

    span {
      cursor: pointer;

      &:hover {
        color: var(--datav-gui-hover-color);
      }
    }
  }

  .g-upload-tip {
    color: var(--datav-gui-font-color-base);
  }
}
</style>
