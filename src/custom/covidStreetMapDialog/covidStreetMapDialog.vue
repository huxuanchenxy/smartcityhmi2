<template>
  <div style="position: relative">
    <div :style="{ height: formHeight - 18 + 'px' }" class="background"></div>
    <div
      :style="{ height: formHeight - 18 + 'px' }"
      class="dialogBody"
    >
      <div>
        <div class="dataTitle">
          老阳人数：{{ query.positive }}
        </div>
        <div class="dataTitle">
          待转运人数: {{ query.waiting }}
        </div>
        <div class="dataTitle">
          核酸异常人数: {{ query.abnormal }}
        </div>
      </div>
      <div style="height:60px;">
        &nbsp;
      </div>
      <table class="dataTable" :style="{ width: formWidth - 20 }">
        <thead>
          <tr>
            <th class="thFirst" :style="{ width: (formWidth - 20) * 0.15 + 'px' }">姓名</th>
            <th class="thCenter" :style="{ width: (formWidth - 20) * 0.35 + 'px' }">地址</th>
            <th class="thCenter" :style="{ width: (formWidth - 20) * 0.1 + 'px' }">混/单管</th>
            <th class="thCenter" :style="{ width: (formWidth - 20) * 0.1 + 'px' }">已转运</th>
            <th class="thCenter" :style="{ width: (formWidth - 20) * 0.15 + 'px' }">是否需二采</th>
            <th class="thLast" :style="{ width: (formWidth - 20) * 0.15 + 'px' }">二采结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in query.abnormalList" :key="index">
            <td class="tdFirst" style="text-align: center; vertical-align: middle;">
              {{ p.name }}
            </td>
            <td class="tdCenter" style="text-align: left; vertical-align: middle; padding-left:2px">
              {{ p.address }}
            </td>
            <td class="tdCenter" style="text-align: center; vertical-align: middle;">
              {{ toCheckType(p.checkType) }}
            </td>
            <td class="tdCenter" style="text-align: center; vertical-align: middle;">
              {{ toChineseBoolean(p.quarantine) }}
            </td>
            <td class="tdCenter" style="text-align: center; vertical-align: middle;">
              {{ toChineseBoolean(p.needSecond) }}
            </td>
            <td class="tdLast" style="text-align: center; vertical-align: middle;">
              {{ p.secondResult }}
            </td>
          </tr>
        </tbody>
      </table>



      <!-- <n-collapse accordion>
        <template #header-extra>
        </template>
        <template #arrow="options">
          <img v-show="!options.collapsed" src="/images/ellipsis.png">
          <img v-show="options.collapsed" src="/images/ellipsis_white.png">
        </template>
        <n-collapse-item :title="'老阳人数：'" name="1">
          <table class="dataTable">
            <thead>
              <tr>
                <th class="thFirst">姓名</th>
                <th>地址</th>
                <th>混/单管</th>
                <th>是否隔离</th>
                <th>是否需二采</th>
                <th>二采结果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in query.positive" :key="index">
                <td class="tdFirst">
                  {{ p.name }}
                </td>
                <td>
                  {{ p.address }}
                </td>
                <td>
                  {{ p.checkType }}
                </td>
                <td>
                  {{ p.quarantine }}
                </td>
                <td>
                  {{ p.needSecond }}
                </td>
                <td>
                  {{ p.secondResult }}
                </td>
              </tr>
            </tbody>
          </table>
        </n-collapse-item>
        <n-collapse-item :title="'待转运人数：'" name="2">
          <table class="dataTable">
            <thead>
              <tr>
                <th>姓名</th>
                <th>地址</th>
                <th>混/单管</th>
                <th>是否隔离</th>
                <th>是否需二采</th>
                <th>二采结果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in query.waiting" :key="index">
                <td>
                  {{ p.name }}
                </td>
                <td>
                  {{ p.address }}
                </td>
                <td>
                  {{ p.checkType }}
                </td>
                <td>
                  {{ p.quarantine }}
                </td>
                <td>
                  {{ p.needSecond }}
                </td>
                <td>
                  {{ p.secondResult }}
                </td>
              </tr>
            </tbody>
          </table>
        </n-collapse-item>
        <n-collapse-item :title="'核酸异常人数：'" name="3">
          <table class="dataTable">
            <thead>
              <tr>
                <th>姓名</th>
                <th>地址</th>
                <th>混/单管</th>
                <th>是否隔离</th>
                <th>是否需二采</th>
                <th>二采结果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in query.abnormal" :key="index">
                <td>
                  {{ p.name }}
                </td>
                <td>
                  {{ p.address }}
                </td>
                <td>
                  {{ p.checkType }}
                </td>
                <td>
                  {{ p.quarantine }}
                </td>
                <td>
                  {{ p.needSecond }}
                </td>
                <td>
                  {{ p.secondResult }}
                </td>
              </tr>
            </tbody>
          </table>
        </n-collapse-item>
      </n-collapse> -->
    </div>
    <div class="footer" :style="{ top: formHeight - 18 + 'px' }"></div>
  </div>
</template>

<script lang='ts'>
//CovidStreetMapDialog
import { defineComponent, ref, PropType } from 'vue'
import { mapPoint } from '@/components/map/mapPoint'
import { streetQuery } from './dataModels'
// import * as mapApi from '@/../public/templates/covidMapApi.json'
import request from '@/utils/request'

import { getApiUrl } from '@/utils/apiUrl'

// interface mapApiSetting
// {
//   apiUrl:string
// }


export default defineComponent({
  name: 'CovidStreetMapDialog',
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    data: {
      type: Object as PropType<mapPoint>,
      required: true,
    },
  },
  setup(props) {
    const formHeight = ref(props.height)
    const formWidth = ref(props.width)

    const query = ref<streetQuery>({ positive:0,waiting:0,abnormal:0,abnormalList:[] })

    //const _mapApi = mapApi as unknown as mapApiSetting
    //console.log(import.meta.env.VITE_APP_COVID_POINT_DETAIL_API)
    const getData = () => {
      let url = getApiUrl(import.meta.env.VITE_APP_COVID_POINT_DETAIL_API)
      request.post(url,{ name : props.data.name , days: props.data.params.days }).then(r=>{
        let result = r.data as streetQuery
        query.value=result
        console.log(query.value)
      })



      // query.value = {
      //   positive: 123,
      //   waiting: 10,
      //   abnormal: 20,
      //   abnormalList:[],
      // }

      // query.value.abnormalList.push({
      //   name:'张三',
      //   address:'xx弄xx号',
      //   checkType:'单',
      //   quarantine:false,
      //   needSecond:true,
      //   secondResult:'阴',
      // })

      // query.value.abnormalList.push({
      //   name:'李四',
      //   address:'xx弄xx号',
      //   checkType:'单',
      //   quarantine:false,
      //   needSecond:true,
      //   secondResult:'阴',
      // })

      // query.value.abnormalList.push({
      //   name:'王五',
      //   address:'xx弄xx号',
      //   checkType:'单',
      //   quarantine:false,
      //   needSecond:true,
      //   secondResult:'阴',
      // })

      // query.value.abnormalList.push({
      //   name:'张三',
      //   address:'xx弄xx号',
      //   checkType:'单',
      //   quarantine:false,
      //   needSecond:true,
      //   secondResult:'阴',
      // })

      // query.value.abnormalList.push({
      //   name:'张三',
      //   address:'xx弄xx号',
      //   checkType:'单',
      //   quarantine:false,
      //   needSecond:true,
      //   secondResult:'阴',
      // })
    }

    getData()


    const toChineseBoolean = (val:boolean) => {
      if(val){
        return '是'
      }
      else{
        return '否'
      }
    }

    const toCheckType = (val:string) =>{
      let result= ''
      switch(val)
      {
        case '0':
          result='单'
          break
        case '1':
          result='混'
          break
        case '2':
          result='抗'
          break
      }
      return result
    }

    return {
      formWidth,
      formHeight,
      query,

      toChineseBoolean,
      toCheckType,
    }
  },
})
</script>

<style lang="scss" scoped>
// :deep(.dialog-background-panel) {
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   background-color: rgb(16, 60, 95);
//   opacity: 0.8;
// }

:deep(.background) {
  width: 100%;
  position: absolute;
  background-color: rgb(16, 60, 95);
  opacity: 0.8;
  z-index: 10;
}

:deep(.dialogBody) {
  position: absolute;

  z-index: 200;
}


:deep(.footer) {
  width: 100%;
  height: 18px;
  background-image: url("../images/dialogfooter.png");
  background-size: 100% 100%;
  background-attachment: fixed;
  background-repeat: no-repeat;
  position:absolute;
}

:deep(.n-collapse .n-collapse-item .n-collapse-item__header) {
  border-bottom: 0px;
}

:deep(.n-collapse
    .n-collapse-item
    .n-collapse-item__content-wrapper
    .n-collapse-item__content-inner) {
  background-color: transparent;
  color: white;
  outline-color: white;
}

:deep(.n-collapse .n-collapse-item .n-collapse-item__content-wrapper) {
  color: white;
  outline-color: white;
}

:deep(.n-collapse .n-collapse-item) {
  color: white;
  outline-color: white;
}

:deep(.dataTitle){
  width:33%;
  color:white;
  float: left;
  font-size: 14pt;
  text-align: center;
}


:deep(.dataTable){
  color:white;
  border-collapse : collapse;
  border-spacing : 0;
  margin-left: 6px;
}

:deep(.dataTable .thFirst){
  height:26px;
  font-size: 12pt;
  // border-bottom-color: rgb(46, 179, 188);
  // border-bottom-width: 1px;
  // border-bottom-style: solid;
}

:deep(.dataTable .thCenter){
  font-size: 12pt;
  // border-bottom-color: rgb(46, 179, 188);
  // border-bottom-width: 1px;
  // border-bottom-style: solid;
  border-left-color: rgb(46, 179, 188);
  border-left-width: 1px;
  border-left-style: solid;
  // border-right-color: rgb(46, 179, 188);
  // border-right-width: 1px;
  // border-right-style: solid;
}

:deep(.dataTable .thLast){
  font-size: 12pt;
  height:26px;
  border-left-color: rgb(46, 179, 188);
  border-left-width: 1px;
  border-left-style: solid;
  // border-bottom-color: rgb(46, 179, 188);
  // border-bottom-width: 1px;
  // border-bottom-style: solid;
}


:deep(.dataTable .tdFirst){
  height:26px;
  border-top-color: rgb(46, 179, 188);
  border-top-width: 1px;
  border-top-style: solid;
}

:deep(.dataTable .tdCenter){
  border-top-color: rgb(46, 179, 188);
  border-top-width: 1px;
  border-top-style: solid;
  border-left-color: rgb(46, 179, 188);
  border-left-width: 1px;
  border-left-style: solid;
  // border-right-color: rgb(46, 179, 188);
  // border-right-width: 1px;
  // border-right-style: solid;
}

:deep(.dataTable .tdLast){
  border-left-color: rgb(46, 179, 188);
  border-left-width: 1px;
  border-left-style: solid;
  border-top-color: rgb(46, 179, 188);
  border-top-width: 1px;
  border-top-style: solid;
}


</style>
