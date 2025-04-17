<template>
    <div>
      <el-table
        v-if="topicShow"
        :row-style="topicRowStyle"
        :cell-style="topicStyle"
        :data="topicData"
        :show-header="false"
        :highlight-current-row="false"
      >
        <el-table-column
          v-for="(item,index) in topicList.slice(0,topicLength)"
          :key="item"
          :label="item"
          :prop="item"
          :min-width="widthList[index]"
        />
      </el-table>
    </div>
    <div :style="wrapperStyle">
      <el-table
        :style="tableCarouselStyle"
        :data="msgList"
        :show-header="false"
        :border="true"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        :highlight-current-row="false"
        @mouseenter="closeInterval"
        @mouseleave="continueInterval"
      >
        <el-table-column
          v-for="(item,index) in objectNameList"
          :key="item"
          :label="item"
          :prop="item"
          :min-width="widthList[index]"
        />
      </el-table>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType, computed, toRef, ref, watch} from 'vue'
import {useDataCenter, getFieldMap} from '@/mixins/data-center'
import {ApiModule} from '@/store/modules/api'
import {BasicCarousel} from './basic-carousel'
import {ElTable, ElTableColumn, ElScrollbar} from 'element-plus'
import type {CSSProperties} from 'vue'
import {useEventCenter} from '@/mixins/event-center'

export default defineComponent({
  name: 'VBasicCarousel',
  components: {
    ElTable,
    ElTableColumn,
  },
  props: {
    com: {
      type: Object as PropType<BasicCarousel>,
      required: true,
    },
  },
  setup(props) {
    console.log(props)
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

    const topicData = computed(() => {
      return config.value.topicData
    })

    const topicLength = computed(() => {
      return config.value.topicLength
    })

    const topicShow = computed(() => {
      return config.value.topicShow
    })

    let topicList = []
    for (let i = 0; i < 10; i++) {
      topicList.push(`topic${i}`)
    }

    const direction = computed(() => {
      return config.value.direction
    })

    const lineHeight = computed(() => {
      return config.value.lineHeight
    })

    const interval = computed(() => {
      return config.value.interval
    })

    const rowsNum = computed(() => {
      return config.value.rowsNum
    })

    const tableBackground = computed(() => {
      return config.value.tableStyleConfig.backgroundColor
    })

    const highlightList1 = computed(() => {
      return config.value.alertContent.highlightList1
    })

    const highlightList2 = computed(() => {
      return config.value.alertContent.highlightList2
    })

    const highlightList3 = computed(() => {
      return config.value.alertContent.highlightList3
    })

    const dataList = computed(() => {
      if (dv_data.value.length > 0) {
        return dv_data.value
      }
      return config.value.dataList
    })

    const colIndexList = computed(() => {
      return config.value.colIndexList
    })

    const colIndexColorList = computed(() => {
      return config.value.colIndexColorList
    })

    const widthList = computed(() => {
      return config.value.widthList
    })

    const msgList = []
    let objectNameList = []

    const wrapperStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${config.value.lineHeight * config.value.rowsNum}px`,
        opacity: `${attr.value.opacity}`,
        overflow: 'hidden',
        borderWidth: `${config.value.tableStyleConfig.borderWidth}px`,
        borderStyle: config.value.tableStyleConfig.borderStyle,
        borderColor: config.value.tableStyleConfig.borderColor,
      } as CSSProperties
    })

    const tableCarouselStyle = computed(() => {
      const style = {
        transform: `translate3d(0px, ${top.value}px, 0px)`,
        transition: `transform ${transitionPeriod.value}ms linear 0s`,
      }
      return style as CSSProperties
    })

    const topicStyle = computed(() => {
      return {
        fontSize: `${config.value.topicStyleConfig.fontSize}px`,
        color: `${config.value.topicStyleConfig.fontColor}`,
        opacity: `${config.value.topicStyleConfig.opacity}`,
        borderColor: `${config.value.topicStyleConfig.borderColor}`,
        borderTopWidth: `${config.value.topicStyleConfig.borderTopWidth}px`,
        borderLeftWidth: `${config.value.topicStyleConfig.borderLeftWidth}px`,
        borderRightWidth: `${config.value.topicStyleConfig.borderRightWidth}px`,
        borderBottomWidth: `${config.value.topicStyleConfig.borderBottomWidth}px`,
        borderStyle: `${config.value.topicStyleConfig.borderStyle}`,
        paddingTop: `${config.value.topicStyleConfig.paddingTop}px`,
        paddingLeft: `${config.value.topicStyleConfig.paddingLeft}px`,
        textAlign: `${config.value.topicStyleConfig.textAlign}`,
        height: `${config.value.topicStyleConfig.topicRowHeight}`,
      } as CSSProperties
    })

    function topicRowStyle({row, rowIndex}) {
      row.height = `${config.value.topicStyleConfig.topicRowHeight}px`
      row.background = `${config.value.topicStyleConfig.backgroundColor}`
      return row
    }

    function cellStyle({rowIndex, columnIndex}) {
      let fontColor = `${config.value.cellStyleConfig.fontColor}`
      let backgroundOpacity = `${config.value.backgroundOpacity}`


      if (colIndexList.value) {
        for (let i = 0; i < colIndexList.value.length; i++) {
          if (columnIndex == config.value.colIndexList[i]) {
            fontColor = config.value.colIndexColorList[i]
          }
        }
      }


      for (let i = 0; i < config.value.dataRowColInfoList1.length; i++) {
        if (config.value.dataRowColInfoList1[i][3] == 1) {
          if (rowIndex % dataList.value.length == config.value.dataRowColInfoList1[i][0] && columnIndex == config.value.dataRowColInfoList1[i][1]) {
            fontColor = config.value.alertContent.color1
          }
        }
      }

      for (let i = 0; i < config.value.dataRowColInfoList2.length; i++) {
        if (config.value.dataRowColInfoList2[i][3] == 2) {
          if (rowIndex % dataList.value.length == config.value.dataRowColInfoList2[i][0] && columnIndex == config.value.dataRowColInfoList2[i][1]) {
            fontColor = config.value.alertContent.color2
          }
        }
      }

      for (let i = 0; i < config.value.dataRowColInfoList3.length; i++) {
        if (config.value.dataRowColInfoList3[i][3] == 3) {
          if (rowIndex % dataList.value.length == config.value.dataRowColInfoList3[i][0] && columnIndex == config.value.dataRowColInfoList3[i][1]) {
            fontColor = config.value.alertContent.color3
          }
        }
      }

      const style = {
        fontSize: `${config.value.cellStyleConfig.fontSize}px`,
        color: fontColor,
        opacity: backgroundOpacity,
        borderColor: `${config.value.cellStyleConfig.borderColor}`,
        borderWidth: `${config.value.cellStyleConfig.borderWidth}px`,
        borderStyle: `${config.value.cellStyleConfig.borderStyle}`,
        paddingTop: `${config.value.cellStyleConfig.paddingTop}px`,
        paddingLeft: `${config.value.cellStyleConfig.paddingLeft}px`,
        textAlign: `${config.value.cellStyleConfig.textAlign}`,
      }
      return style as CSSProperties
    }

    function rowStyle({row, rowIndex}) {
      if (dataList.value) {
        row.height = `${lineHeight.value}px`
      }


      //防止奇数行色差
      if (dataList.value.length % 2 != 0) {
        if (rowIndex >= dataList.value.length) {
          rowIndex = rowIndex - 1
        }
      }

      if ((rowIndex % 2) == 0) {
        row.background = `${tableBackground.value}`
      } else {
        row.background = `${config.value.tableStyleConfig.backgroundStripeColor}`
      }
      return row
    }

    const top = ref(0)
    const transitionPeriod = ref(0)

    let currentPosition

    function stable() {
      transitionPeriod.value = 50000
      top.value = 0
      if (top.value == 0) {
        setTimeout(() => {
          top.value = 0
          transitionPeriod.value = 0
        }, interval.value)
      }
    }

    function up() {
      if (config.value.direction == 'up') {
        transitionPeriod.value = 500

        top.value -= lineHeight.value
        currentPosition = top.value

        if (top.value <= (-dataList.value.length * lineHeight.value)) {
          setTimeout(() => {
            top.value = 0
            transitionPeriod.value = 0
          }, interval.value)
        }
      }
    }

    function down() {
      if (config.value.direction == 'down') {
        transitionPeriod.value = 500
        top.value -= -lineHeight.value
        currentPosition = top.value
        if (top.value >= 0) {
          setTimeout(() => {
            top.value = -(dataList.value.length) * lineHeight.value
            transitionPeriod.value = 0
          }, interval.value)
        }
      }
    }

    let upInterval
    let downInterval
    let stopInterval

    const moveUp = () => {
      top.value = 0
      upInterval = setInterval(up, interval.value)
    }

    const moveDown = () => {
      top.value = -(dataList.value.length) * lineHeight.value
      downInterval = setInterval(down, interval.value)
    }

    const moveStop = () => {
      top.value = 0
      stopInterval = setInterval(stable, interval.value)
    }

    const continueInterval = () => {
      top.value = currentPosition
      if (config.value.direction == 'up') {
        upInterval = setInterval(up, interval.value)
      } else {
        downInterval = setInterval(down, interval.value)
      }
    }

    function closeInterval() {
      clearInterval(upInterval)
      clearInterval(downInterval)
      clearInterval(stopInterval)
    }

    function setData() {
      initRowColList()
      initPositionList()
      msgList.length = 0
      msgList.push(...dataList.value)
      msgList.push(...dataList.value)
      /*      dataList.value.forEach((item, index) => {
              /!*index < rowsNum.value && *!/
              msgList.push(item)
            })*/
      objNameFix()
      limitContentLength()
    }

    let positionList = []

    //初始化数据在表中位置
    function initPositionList() {
      for (let i = 0; i < dataList.value.length; i++) {
        positionList[i] = []
        let j = 0
        for (let key in dataList.value[i]) {
          positionList[i][j] = dataList.value[i][key]
          j++
        }
      }
    }

    //当数据发生变化，调整表头，对数据在表中位置重新赋值
    function objNameFix() {
      if (dataList.value.length < objectNameList.length) {
        objectNameList = []
      }
      for (let i = 0, l = dataList.value.length; i < l; i++) {
        for (let key in dataList.value[i]) {
          if (!objectNameList.includes(key)) {
            objectNameList.push(key)
          }
        }
      }
      setWidthRate()
    }

    let rowColInfoList = []

    //初始化行列信息表
    function initRowColList() {
      for (let i = 0; i < 2 * dataList.value.length; i++) {
        rowColInfoList[i] = []
        for (let j = 0; j < 4; j++) {
          rowColInfoList[i][j] = -1
        }
      }
    }

    //添加数据的行列信息
    function RCInfoAdd(row, col, listNum) {
      for (let i = 0; i < rowColInfoList.length; i++) {
        if (rowColInfoList[i][2] != -99) {
          rowColInfoList[i][0] = row
          rowColInfoList[i][1] = col
          rowColInfoList[i][2] = -99
          rowColInfoList[i][3] = listNum
          return
        } else if (rowColInfoList[i][0] == row &&
          rowColInfoList[i][1] == col) {
          return
        }
      }
    }

    //查找数据在表中位置
    function findContentPosition(content, listNum) {
      for (let i = 0; i < positionList.length; i++) {
        for (let j = 0; j < positionList[i].length; j++) {
          if (positionList[i][j] == content) {
            RCInfoAdd(i, j, listNum)
          }
        }
      }
    }

    //限制最大长度
    function limitContentLength() {
      if (objectNameList.length != 0) {
        for (let i = 0; i < positionList.length; i++) {
          for (let j = 0; j < positionList[i].length; j++) {
            const type = typeof (positionList[i][j])
            switch (type) {
              case 'string':
                if (positionList[i][j].length > config.value.limitContentLength) {
                  msgList[i][objectNameList[j]] = `${msgList[i][objectNameList[j]].substr(0, config.value.limitContentLength)}...`
                  msgList[i + positionList.length][objectNameList[j]] = `${msgList[i][objectNameList[j]].substr(0, config.value.limitContentLength)}...`
                }
                break
              case 'number':
                //js中number类型不是int，而是float
                let tempNum = positionList[i][j]
                let numberLength = 0
                let tempNumList = []
                while (tempNum != 0) {
                  tempNumList.push(tempNum % 10)
                  tempNum = (tempNum - tempNum % 10) / 10
                  numberLength++
                }
                if (numberLength > config.value.limitContentLength) {
                  let limitedNum = 0
                  for (let i = 1; i <= config.value.limitContentLength; i++) {
                    limitedNum = limitedNum + tempNumList.pop() * 10 ** (config.value.limitContentLength - i)
                  }
                  msgList[i][objectNameList[j]] = `${limitedNum}...`
                }
                break
              default:
                console.log('invalid type')
                break
            }
          }
        }
      }
    }

    function setShow() {
      switch (direction.value) {
        case 'up':
          moveUp()
          break
        case 'down':
          moveDown()
          break
        case 'stop':
          moveStop()
          break
        default:
          console.log('invalid direction')
          break
      }
    }

    function setWidthRate() {
      for (let i = 0; i < objectNameList.length; i++) {
        widthList.value.push(1)
      }
    }

    watch(() => config.value.limitContentLength, () => {
      if (config.value.limitContentLength) {
        limitContentLength()
      }
    })

    watch(() => config.value.transformFlag, () => {
      if (!config.value.transformFlag) {
        config.value.direction = 'stop'
        setShow()
        closeInterval()
      } else {
        config.value.direction = 'up'
        continueInterval()
      }
    })

    //监听参数变化时，关闭上一个滚动计时，更新滚动表格
    watch([interval, direction, () => config.value.cellStyleConfig.borderWidth, () => lineHeight.value], () => {
      closeInterval()
      setShow()
    })

    //根据行数大小、行高，自动调整外围边框大小
    watch([rowsNum, () => lineHeight.value], () => {
      if (rowsNum.value <= dataList.value.length) {
        attr.value.h = config.value.lineHeight * config.value.rowsNum
      }
    })

    //根据接收的json文件确定表头
    watch(dataList, () => {
      setData()
    })

    watch(highlightList1.value, () => {
      for (let i = 0; i < highlightList1.value.length; i++) {
        findContentPosition(highlightList1.value[i], 1)
      }
      config.value.dataRowColInfoList1 = rowColInfoList
    })

    watch(highlightList2.value, () => {
      for (let i = 0; i < highlightList2.value.length; i++) {
        findContentPosition(highlightList2.value[i], 2)
      }
      config.value.dataRowColInfoList2 = rowColInfoList
    })

    watch(highlightList3.value, () => {
      for (let i = 0; i < highlightList3.value.length; i++) {
        findContentPosition(highlightList3.value[i], 3)
      }
      config.value.dataRowColInfoList3 = rowColInfoList
    })

    watch(colIndexList.value, () => {
      console.log('colIndexChange')
    })

    return {
      findContentPosition,
      topicShow,
      topicRowStyle,
      topicStyle,
      topicData,
      topicLength,
      topicList,
      widthList,
      dv_data,
      wrapperStyle,
      tableCarouselStyle,
      rowStyle,
      cellStyle,
      tableBackground,
      setData,
      setShow,
      closeInterval,
      continueInterval,
      moveUp,
      msgList,
      objectNameList,
      top,
      leftSide: 0,
      interval,
      rowsNum,
      lineHeight,
      direction,
      dataList,
      config,
      limitContentLength,
    }
  },
  created() {
    this.setData()
  },
  mounted() {
    this.setShow()
  }
  ,
})

</script>

<style lang="css" scoped>
::v-deep(.el-table--enable-row-hover .el-table__body tr:hover td) {
  background-color: rgba(199, 199, 231, 0.7) !important;
}

::v-deep(.el-table,.el-table tr,.el-table td,.el-table th) {
  background-color: transparent;
  border: 0;
}
</style>
