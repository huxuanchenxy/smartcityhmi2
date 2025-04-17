<template>
  <div class="datav-gui g-color-picker" :class="[
    {
      '--inline': !!inline,
      '--single': inline === 'inline-single',
    }
  ]">
    <div class="g-color-picker__inner">
      <n-input v-model:value="color" :size="size" placeholder="请输入" @blur="handleBlur" />
      <n-color-picker :modes="['hex']" :value="modelValue" :size="size" :show-alpha="alpha" :style="{ width: '30px', flex: `0 0 30px` }"
        @update:value="handleInput" />
    </div>
    <span v-if="label" class="g-input__caption">
      {{ label }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
  name: 'GColorPicker',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'small',
    },
    label: {
      type: String,
      default: '',
    },
    alpha: {
      type: Boolean,
      default: true,
    },
    inline: {
      type: [Boolean, String],
      default: false,
    },
  },
  emits: [UPDATE_MODEL_EVENT,'change'],
  setup(props, ctx) {

    const checkHex = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$");

    const checkRGB = /(rgb\(((([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s*){2}([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\)))|(rgba\(((([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s*){3}(1|1.0*|0?.\d)\)))/;

    var color = ref("");

    color.value = props.modelValue;

    const handleInput = (value: string) => {
      if (checkHex.test(value)) {
        //console.log("reg success")
        color.value = value;
        ctx.emit(UPDATE_MODEL_EVENT, value)
        ctx.emit('change', value)
      }
      else if (checkRGB.test(value)) {
        //console.log("reg success")
        color.value = value;
        ctx.emit(UPDATE_MODEL_EVENT, value)
        ctx.emit('change', value)
      }
      else {
        //console.log("reg failed")
      }

    }

    const handleBlur = (event: any) => {
      if (checkHex.test(event.target.value)) {
        //console.log("reg success")
        ctx.emit(UPDATE_MODEL_EVENT, event.target.value)
        ctx.emit('change', event.target.value)
      }
      else if (checkRGB.test(event.target.value)) {
        //console.log("reg success")
        ctx.emit(UPDATE_MODEL_EVENT, event.target.value)
        ctx.emit('change', event.target.value)
      }
      else {
        //console.log("reg failed")
      }
    }

    return {
      handleInput,
      handleBlur,
      color
    }
  },
})
</script>
