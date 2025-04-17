<template>
  <div class="datav-wrapper" :style="scrollBoardStyle">
    <scroll-board :config="scrollBoardConfig" :style="scrollBoardStyle" @click="rowClick" v-if="refreshCom" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef, ref, watch, reactive } from 'vue'
import { useDataCenter, getFieldMap } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { CarouselTable } from './carousel-table'
import type { CSSProperties } from 'vue'
import { getCurrentInstance, nextTick } from 'vue'
import { useEventCenter } from '@/mixins/event-center'

import { ScrollBoard } from '@kjgl77/datav-vue3'

import { HandleItemField } from '@/components/data-handle'

export default defineComponent({
  name: 'VCarouselTable',
  components: {
    ScrollBoard,
  },
  props: {
    com: {
      type: Object as PropType<CarouselTable>,
      required: true,
    },
  },
  setup(props) {
    const refreshCom = ref(true);

    useDataCenter(props.com)
    useEventCenter(props.com)

    const dv_data = computed(() => {
      return ApiModule.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.w}px`,
        opacity: `${attr.value.opacity}`,
      } as CSSProperties
    })

    const comEvent = (fields: HandleItemField[]) => {
      fields.forEach(field => {
        // emit自定义事件
        mitter.emit(field.targetComId, field)
      })
    }

    const rowClick = row => {
      //console.log('rowClick',row)
      let fileds = props.com.handles.rowClick.fields
      fileds.forEach(r => r.value = row)
      comEvent(fileds)
    }

    const dataSource = computed(() => {
      const result = JSON.parse(JSON.stringify(dv_data.value))//deepClone

      for (let i = 0; i < result.length; i++) {
        //let detail = result[i]
        let row = result[i]
        for (let j = 0; j < row.length; j++) {
          let cell = row[j]
          let columnSetting = config.value.columns[j]
          let color = '#fff'

          let special = config.value.SpecialCharactersList.find(r => r.text == cell)
          if (special) {
            color = special.color
          } else if (columnSetting) {
            color = columnSetting.fontColor
          }

          if (columnSetting) {
            row[j] = `<span style='font-size:${columnSetting.fontSize}pt;color:${color};font-style:${columnSetting.fontStyle};font-weight:${columnSetting.fontWeight};font-family:${columnSetting.fontFamily}'>${cell}</span>`
          }
          else {
            row[j] = `<span style='color:${color};'>${cell}</span>`
          }

        }

        // config.value.columns.forEach((col,j) => {
        //   let color = col.fontColor
        //   let special = config.value.SpecialCharactersList.find(r=>r.text==detail[j])
        //   if(special){
        //     color = special.color
        //   }
        //   detail[j]=`<span style='font-size:${col.fontSize}pt;color:${color};font-style:${col.fontStyle};font-weight:${col.fontWeight};font-family:${col.fontFamily}'>${detail[j]}</span>`
        // })
      }
      //console.log('dataSource',result)
      return result
    })

    const showHeader = computed(() => {
      return config.value.header.show
    })

    const scrollBoardConfig = computed(() => {
      reactive();
      let header = []
      let align = []
      let columnWidth = []

      config.value.columns.forEach(r => {
        if (showHeader.value) {
          let content = `<span style='font-size:${config.value.header.fontSize}pt;color:${config.value.header.fontColor};font-style:${config.value.header.fontStyle};font-weight:${config.value.header.fontWeight};font-family:${config.value.header.fontFamily}'>${r.title}</span>`
          header.push(content)
        }
        align.push(r.align)
        columnWidth.push(r.width)
      })

      // if(header.length==0)
      // {
      //   header=null
      // }

      //console.log('header',header)

      return {
        header: header,
        data: dataSource.value,
        columnWidth: columnWidth,
        align: align,
        rowNum: config.value.common.rowNum,
        headerBGC: config.value.header.headerBGC,
        oddRowBGC: config.value.common.oddRowBGC,
        evenRowBGC: config.value.common.evenRowBGC,
        waitTime: config.value.common.waitTime,
        headerHeight: config.value.header.headerHeight,
        index: config.value.common.showIndex,
        indexHeader: config.value.header.indexHeader,
        carousel: config.value.common.carousel,
        hoverPause: config.value.common.hoverPause,
      }
    })

    const scrollBoardStyle = computed(() => {
      reactive();
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
      } as CSSProperties
    })

    // const scrollBoardStyle = computed(() => {
    //   reactive();
    //   return {
    //     width: '100%',
    //     height: '100%',
    //   }
    // })

    const reactive = () => {
      refreshCom.value = false
      nextTick(() => {
        refreshCom.value = true
      })
    }

    return {
      config,
      wrapperStyle,
      scrollBoardStyle,
      scrollBoardConfig,
      dataSource,
      rowClick,
      showHeader,
      refreshCom
    }
  },
})

</script>

<style lang="css" scoped></style>
