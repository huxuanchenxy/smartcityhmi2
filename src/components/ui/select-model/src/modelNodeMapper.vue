<template>
  <n-spin :show="modelLoading">
    <n-grid x-gap="12" :cols="12">
      <n-gi span="3">
        <n-tabs type="line" default-value="animation" animated>
          <n-tab-pane name="mesh" tab="网格">
            <div style="overflow: auto;height: 700px;width: 100%;">
              <n-tree
                ref="treeIntanceRef"
                block-line
                :data="treeData"
                key-field="uuid"
                label-field="name"
                children-field="children"
                selectable
                :node-props="nodeProps"
                :selected-keys="selectKeyList"
                :expanded-keys="expandedKeyList"
              />
            </div>
          </n-tab-pane>
          <n-tab-pane name="animation" tab="动画">
            <n-list hoverable clickable>
              <n-list-item
                v-for="item in animationList"
                :key="item.clip.uuid"
                class="animationItem"
                :style="{ background: item.selected ? '#525252' : '', color: item.selected ? '#fff' : '' }"
                @click="selectAnimation(item)"
              >
                <template #prefix>
                  <n-icon class="icon-add" style="cursor:pointer" @click="playAnimation(item.clip)">
                    <IconPlay />
                  </n-icon>
                </template>
                <n-thing :style="{ color: item.selected ? '#fff' : '' }">
                  {{ item.clip.name }}
                </n-thing>
              </n-list-item>
            </n-list>
          </n-tab-pane>
        </n-tabs>
      </n-gi>
      <n-gi span="7">
        <div ref="containerRef" style="width: 100%;height: 700px;" @click="modelTap"></div>
      </n-gi>
      <n-gi span="2">
        点位
        <n-form ref="mappingFormRef" :model="currentModelNodeMapping" :rules="mappingRules">
          <n-form-item path="nodeCode" label="点位">
            <n-input
              v-model:value="currentModelNodeMapping.nodeCode"
              :style="{ width: '70%', 'font-size': '12px' }"
              placeholder="请选择"
              readonly="readonly"
            />
            <n-button
              type="primary"
              size="small"
              ghost
              @click="openIcList()"
            >
              点位
            </n-button>
          </n-form-item>
          <n-form-item path="operator1" label="规则1">
            <n-select v-model:value="currentModelNodeMapping.operator1" :options="getOperatorList" clearable />
          </n-form-item>
          <n-form-item path="value1" label="值1">
            <n-input v-model:value="currentModelNodeMapping.value1" placeholder="请输入" />
          </n-form-item>
          <n-form-item path="operator2" label="规则2">
            <n-select v-model:value="currentModelNodeMapping.operator2" :options="getOperatorList" clearable />
          </n-form-item>
          <n-form-item path="value2" label="值2">
            <n-input v-model:value="currentModelNodeMapping.value2" placeholder="请输入" />
          </n-form-item>
          <n-form-item path="loop" label="循环">
            <n-switch v-model:value="currentModelNodeMapping.loop" />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button type="success" @click="saveCurrentModelNodeMapping()">
                保存
              </n-button>
              <n-button @click="resetCurrentModelNodeMapping()">
                重置
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </n-gi>
    </n-grid>
  </n-spin>
  <IcList :visible="icListVisibile" />
</template>
<script lang='ts'>
import { computed, defineComponent, onMounted, provide, ref, toRef } from 'vue'
import { IconPlay } from '@/icons'
import { getFile, getModel } from '@/api/threed'
import * as THREE from 'three'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { TreeOption, NTabs, NTabPane, NList, NListItem, NThing, FormInst, FormRules, NSpace } from 'naive-ui'
import IcList from '@/views/screen-editor/config-panel/icevent-panel/ic-list.vue'
import { modelNodeMapping, ThreedModelConfig, ThreedViewer } from '@/components/media/threed-viewer/src/threed-viewer'
import { IcHandleItemConfig, PtModel } from '@/components/data-handle'
import { cloneDeep } from 'lodash-es'
import { useMessage } from 'naive-ui'
import { IcModule } from '@/store/modules/icstate'
import { NodeDataType, convertNodeTypeToDataType, getOperatorListByDataType } from '@/utils/threed-node'

interface animationListItem {
  clip: THREE.AnimationClip
  selected: boolean
}

export default defineComponent({
  name: 'ModelNodeMapper',
  components: {
    NTabs,
    NTabPane,
    NList,
    NListItem,
    NThing,
    IconPlay,
    IcList,
    NSpace,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    icCom: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {

    console.log('ctx', ctx)

    const modelLoading = ref(false)

    const treeData = ref([])
    const treeIntanceRef = ref(null)

    const selectKeyList = ref([])
    const expandedKeyList = ref([])

    const selectMaterialList = ref([])

    let animationActions = {}
    let mixer: THREE.AnimationMixer = null
    const animationList = ref<animationListItem[]>([])
    const animationClock = new THREE.Clock()

    const icListVisibile = ref(false)

    const getEmptyModelNodeMapping = (clipName: string | null) => {
      return { deviceCode: null, nodeCode: null, modelKey: clipName, nodeType: null, operator1: null, value1: null, operator2: null, value2: null, pt: null, loop: false }
    }

    const currentModelNodeMapping = ref<modelNodeMapping>(getEmptyModelNodeMapping(null))

    const nMessage = useMessage()


    const read3dModel = (threeModel: THREE.Object3D, animations: THREE.AnimationClip[]) => {

      addModelToScene(threeModel)
      treeData.value = [threeModel]
      scene.animations = animations
      animationList.value = animations.map(clip => {
        return {
          clip: clip,
          selected: false,
        }
      })
      mixer = new THREE.AnimationMixer(threeModel)
      animationActions = {}
      animationList.value.forEach(item => {
        animationActions[item.clip.name] = mixer.clipAction(item.clip)
        animationActions[item.clip.name].loop = THREE.LoopOnce
        animationActions[item.clip.name].clampWhenFinished = true
      })

      //console.log('select-model','openNodeWindow',threeModel)
      if (containerRef.value && containerRef.value.children.length === 0) {
        containerRef.value.appendChild(renderer.domElement) //body元素中插入canvas对象
      }
    }



    const show3dModel = () => {
      modelLoading.value = true

      const loader = new GLTFLoader()//?id=${props.modelValue.url}

      getFile(props.modelValue.url).then(res => {
        const blob = new Blob([res.data])
        blob.arrayBuffer().then(arrayBuffer => {
          loader.parse(arrayBuffer, '', function (gltf) {
            //scene.animations = gltf.animations
            read3dModel(gltf.scene, gltf.animations)
            modelLoading.value = false
          })
        })

      })

      // loader.load(`http://10.235.112.186:8020/benz/benz.glb`, function (obj) {
      //   //tempModel = obj.scene.children[0];
      //   scene.animations = obj.animations
      //   read3dModel(obj.scene)
      //   modelLoading.value = false
      // })

      // getModel(props.modelValue.url).then(res => {
      //   console.log('select-model',props.modelValue,res)
      //   let loader = new THREE.ObjectLoader()
      //   const threeModel = loader.parse(res.data)
      //   read3dModel(threeModel)
      //   modelLoading.value = false
      // })

    }


    const containerRef = ref<HTMLDivElement | null>(null) //容器

    let scene: THREE.Scene //场景
    let renderer: THREE.WebGLRenderer //渲染器
    let currentCamera: THREE.PerspectiveCamera //相机
    let cameraLight: THREE.DirectionalLight //相机辅助光
    let cameraControl: ArcballControls

    let selectObject: any //选中的模型
    const mouse = new THREE.Vector2() //鼠标

    let group: THREE.Group | null = null

    // 创建场景
    const initScene = () => {
      scene = new THREE.Scene()
    }

    // 创建渲染器
    const initRenderer = () => {
      //renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer = new THREE.WebGLRenderer({ antialias: false })
      //renderer.setClearColor(config.value.render.clearColor)
      renderer.setClearColor(0xffffff, 0)
    }

    //实例化一个透视投影相机
    const initCamera = () => {
      currentCamera = new THREE.PerspectiveCamera()
      currentCamera.position.set(
        -8,
        -26,
        0,
      )
      //相机观察目标指向Threejs 3D空间中某个位置
      //camera.lookAt(mesh.position); //指向mesh对应的位置
      currentCamera.lookAt(
        0,
        0,
        0,
      )
    }

    //设置光源
    const initCameraLight = () => {
      cameraLight = new THREE.DirectionalLight(
        'rgba(255,255,255,1)',
        2,
      )
      if (currentCamera) {
        cameraLight.position.set(
          currentCamera.position.x,
          currentCamera.position.y,
          currentCamera.position.z,
        )
      }

      scene.add(cameraLight)
    }

    // 设置相机控件轨道控制器
    const initCameraControl = () => {
      cameraControl = new ArcballControls(currentCamera, renderer.domElement)
      cameraControl.addEventListener('change', function () {
        if (cameraLight) {
          cameraLight.position.set(
            currentCamera.position.x,
            currentCamera.position.y,
            currentCamera.position.z,
          )
          render()
        }
      })
      cameraControl.update()
    }

    const modelTap = (e: MouseEvent) => {
      mouse.x = (e.offsetX / 600) * 2 - 1
      mouse.y = -(e.offsetY / 600) * 2 + 1


      let raycaster: THREE.Raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, currentCamera)

      let intersects: THREE.Intersection<
        THREE.Object3D<THREE.Object3DEventMap>
      >[] = raycaster.intersectObjects([group])

      if (intersects.length > 0) {
        select3DModel(intersects[0].object)

        selectKeyList.value = [selectObject.uuid]
        expandedKeyList.value = getKeyList(selectObject)
      } else {
        if (selectObject) {
          selectObject.material.emissive.setHex(selectObject.currentHex)
        }
        // 清空选中物体
        selectObject = null

        renderer.render(scene, currentCamera)
      }
    }

    //渲染场景
    const render = () => {
      const time = animationClock.getDelta()
      if (mixer) {
        mixer.update(time)
      }

      // 定义threejs输出画布的尺寸(单位:像素px)
      renderer.setSize(600, 600) //设置three.js渲染区域的尺寸(像素px)
      renderer.render(scene, currentCamera) //执行渲染操作
      renderer.setRenderTarget(null)
      requestAnimationFrame(render)
    }

    initScene()
    initRenderer()
    initCamera()
    initCameraLight()
    initCameraControl()

    const addModelToScene = (threedModel: THREE.Object3D | null) => {
      group = new THREE.Group()
      scene.add(group)
      group.add(threedModel)
      render()
    }

    onMounted(() => {
      render()
    })

    const nodeProps = ({ option }: { option: TreeOption; }) => {
      return {
        onClick() {

          //console.log('selectObject', option, treeIntanceRef.value)
          const item: THREE.Object3D = option as unknown as THREE.Object3D
          expandedKeyList.value = getKeyList(item)
          select3DModel(item)
        },
      }
    }

    const select3DModel = (model3d: THREE.Object3D) => {

      if (selectObject != model3d) {
        // 这里选中的物体是上一个选中物体。
        if (selectObject) {
          // 把上一个选中的物体设置为当前色。
          cancelSelected(selectObject)
          clearSelectedMaterial()
        }
        // 设置当前选中的物体
        selectObject = model3d
        // // 保留当前选中物体，**原本的颜色**
        // selectObject.currentHex = selectObject.material.emissive.getHex()
        // // 设置当前选中的物体颜色为红色
        // //selectObject.material.emissive.setHex(0xff0000);
        // selectObject.material.emissive.setHex(
        //   new THREE.Color('rgba(255,0,0,1)').getHex(),
        // )
        setSelected(selectObject)
        console.log('selectObject', selectObject)
        renderer.render(scene, currentCamera)
      }
    }

    const cancelSelected = (item: THREE.Object3D) => {
      if (item instanceof THREE.Mesh && item['currentHex'] != undefined) {
        item.material.emissive.setHex(item['currentHex'])
      }

      if (item.children && item.children.length) {
        item.children.forEach((child: THREE.Object3D) => {
          cancelSelected(child)
        })
      }
    }

    const setSelected = (item: THREE.Object3D) => {
      if (item instanceof THREE.Mesh) {
        if (!selectMaterialList.value.some(r => r.uuid == item.material.uuid)) {
          item['currentHex'] = item.material.emissive.getHex()
          item.material.emissive.setHex(new THREE.Color('rgba(255,0,0,1)').getHex())
          selectMaterialList.value.push(item.material)
        }
      }

      if (item.children.length > 0) {
        item.children.forEach((child: THREE.Object3D) => {
          setSelected(child)
        })
      }
    }

    const clearSelectedMaterial = () => {
      selectMaterialList.value.forEach(r => {
        r.emissive.setHex(r.currentHex)
      })
      selectMaterialList.value = []
    }

    const getKeyList = (node: THREE.Object3D) => {
      let list = []
      list.push(node.uuid)
      if (node.parent) {
        list = list.concat(getKeyList(node.parent))
      }
      return list
    }

    const playAnimation = (item: THREE.AnimationClip) => {
      for (let element in animationActions) {
        animationActions[element].stop()
      }
      animationActions[item.name].play()
      render()
    }

    const selectAnimation = (item: animationListItem) => {
      animationList.value.forEach(r => {
        r.selected = false
      })
      item.selected = true

      let modelNodeMapping = props.modelValue.modelNodeMappings.find(r => r.modelKey == item.clip.name)
      if (modelNodeMapping) {
        currentModelNodeMapping.value = cloneDeep(modelNodeMapping)
      }
      else {
        currentModelNodeMapping.value = getEmptyModelNodeMapping(item.clip.name)
      }
      mappingFormRef.value.restoreValidation()
    }

    const openIcList = () => {
      icListVisibile.value = true
    }
    provide('closeIcList', () => { icListVisibile.value = false })

    provide('addPt', (item: PtModel) => {
      currentModelNodeMapping.value.deviceCode = item.extension.device
      currentModelNodeMapping.value.nodeCode = item.extension.name
      currentModelNodeMapping.value.nodeType = item.nodeType
      currentModelNodeMapping.value.pt = item
      icListVisibile.value = false
    })

    const mappingFormRef = ref<FormInst | null>(null)
    const mappingRules: FormRules = {
      deviceCode: [{ required: true, message: '请选择点位', trigger: ['input', 'blur'] }],
      nodeCode: [{ required: true, message: '请选择点位', trigger: ['input', 'blur'] }],
      operator1: [{ required: true, message: '请选择规则1', trigger: ['input', 'blur'] }],
      value1: [{ required: true, message: '请输入值1', trigger: ['input', 'blur'] }],
    }

    const getNodeDataType = computed(() => {

      if (!currentModelNodeMapping.value || !currentModelNodeMapping.value.nodeType) {
        return null
      }

      return convertNodeTypeToDataType(currentModelNodeMapping.value.nodeType.toLocaleLowerCase())
    })

    const getOperatorList = computed(() => {
      let dataType: NodeDataType = getNodeDataType.value
      return getOperatorListByDataType(dataType)
    })

    const saveCurrentModelNodeMapping = () => {

      console.log('icCom', props.icCom)
      //console.log('icHandles', props.icHandles['nodeValueChange'].fields)

      let icHandles = props.icCom.ichandles as Record<string, IcHandleItemConfig>
      let nodeValueChange = icHandles['nodeValueChange']
      //console.log('icHandles', icHandles['nodeValueChange'])
      //console.log('icHandles', toRef(props.icCom,'ichandles'))

      if (currentModelNodeMapping.value == null) {
        nMessage.error('请选择动画节点')
        return
      }

      let modelNodeMappingIndex = props.modelValue.modelNodeMappings.findIndex(r => r.modelKey == currentModelNodeMapping.value.modelKey)

      if (modelNodeMappingIndex < 0) {
        let modelNodeMapping = cloneDeep(currentModelNodeMapping.value)
        props.modelValue.modelNodeMappings.push(modelNodeMapping)
      }
      else {
        props.modelValue.modelNodeMappings[modelNodeMappingIndex] = cloneDeep(currentModelNodeMapping.value)
      }

      if (currentModelNodeMapping.value.modelKey &&
        currentModelNodeMapping.value.deviceCode &&
        currentModelNodeMapping.value.nodeCode) {
        let fieldIndex = nodeValueChange.fields.findIndex(r => r.icDevice == currentModelNodeMapping.value.deviceCode && r.icName == currentModelNodeMapping.value.nodeCode)
        if (fieldIndex >= 0) {
          nodeValueChange.fields.splice(fieldIndex, 1)
        }

        nodeValueChange.fields.push({
          name: currentModelNodeMapping.value.modelKey,
          icDevice: currentModelNodeMapping.value.deviceCode,
          icName: currentModelNodeMapping.value.nodeCode,
          showDeleteConfirm: false,
          targetComId: props.icCom.id,
          targetMethodName: 'nodeValueChange',
          pt: currentModelNodeMapping.value.pt,
        })
        IcModule.setIcState()
      }

      nMessage.success('保存成功')
    }

    const resetCurrentModelNodeMapping = () => {
      if (currentModelNodeMapping.value == null || currentModelNodeMapping.value.modelKey == null) {
        currentModelNodeMapping.value = getEmptyModelNodeMapping(null)
      }
      else {
        currentModelNodeMapping.value = getEmptyModelNodeMapping(currentModelNodeMapping.value.modelKey)
      }
    }

    return {
      modelLoading,
      treeData,
      icListVisibile,
      containerRef,
      modelTap,
      nodeProps,
      treeIntanceRef,
      openIcList,
      // treeProps,
      selectKeyList,
      expandedKeyList,
      animationList,

      playAnimation,
      selectAnimation,
      show3dModel,

      currentModelNodeMapping,

      mappingFormRef,
      mappingRules,
      getNodeDataType,

      getOperatorList,
      resetCurrentModelNodeMapping,
      saveCurrentModelNodeMapping,
    }
  },
})
</script>
<style scoped>
.animationItem:hover {
  background-color: #f0f0f0;
}
</style>
