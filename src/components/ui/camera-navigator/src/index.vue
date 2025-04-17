<template>
  <n-spin :show="modelLoading">
    <n-grid x-gap="12" :cols="12">
      <n-gi span="3">
        <div>
          <div>
            <n-button type="primary" :dashed="cameraStopSwtch" @click="cameraStopSwtchChange()">
              {{ cameraStopSwtchTitle }}
            </n-button>&nbsp;&nbsp;
            <n-button type="primary" @click="cameraNavigatorStart()">预览</n-button>
          </div>
          <div style="max-height: 800px;overflow-y: auto;">
            <n-table>
              <thead>
                <tr>
                  <th style="width:15%;">序号</th>
                  <th style="width:60%;">坐标</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in cameraStopList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td><p>x:{{ item.x }}</p><p>y:{{ item.y }}</p><p>z:{{ item.z }}</p></td>
                  <td>
                    <n-button tertiary type="error" @click="removeCameraStop(index)">
                      <template #icon>
                        <n-icon><icon-delete /></n-icon>
                      </template>
                    </n-button>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </div>
      </n-gi>
      <n-gi span="9">
        <div style="height:20px;">&nbsp;</div>
        <div
          ref="containerRef"
          :style="{ width: width,height: height }"
          @click="modelTap"
        ></div>
      </n-gi>
    </n-grid>
  </n-spin>
</template>
<script lang='ts'>
import {
  defineComponent,
  computed,
  toRef,
  ref,
  onMounted,
} from 'vue'
import {
  ThreedModelConfig,
  ThreedViewer,
  LightType,
  LightConfig,
  BackgroundType,
  cameraStop,
} from '../../../media/threed-viewer/src/threed-viewer'
import * as THREE from 'three'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js'
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
/*import { ElButton } from 'element-plus'*/
import { getFile } from '@/api/threed'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { IconDelete } from '@/icons'

import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { NTable } from 'naive-ui'


interface modelInfo {
  wrapper: THREE.Group
  config: ThreedModelConfig
}

interface textSpriteSetting {
  fontface: string
  fontsize: number
  borderThickness: number
  borderColor: { r: number; g: number; b: number; a: number; }
  backgroundColor: { r: number; g: number; b: number; a: number; }
}

export default defineComponent({
  name: 'CameraNavigator',
  components: {
    IconDelete,
    NTable,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    console.log('ctx', ctx)

    const width = ref(1024)
    const height = ref(768)

    const modelLoading = ref(false)

    const com = props.modelValue as ThreedViewer
    const config = toRef(com, 'config')

    const containerRef = ref<HTMLDivElement | null>(null) //容器

    let scene: THREE.Scene //场景
    let renderer: THREE.WebGLRenderer //渲染器
    let currentCamera: THREE.PerspectiveCamera //相机
    let cameraLight: THREE.DirectionalLight //相机辅助光
    let cameraControl: ArcballControls

    let objList: modelInfo[] = [] //模型列表
    const mouse = new THREE.Vector2() //鼠标


    let ambientLight:THREE.AmbientLight

    let ground:THREE.Mesh

    const cameraStopSwtch = ref(false)

    const addModelToScene = (
      threedModel: GLTF,
      modelConfig: ThreedModelConfig,
    ) => {
      let group: THREE.Group

      let model: modelInfo = objList.find(r => r.config.id == modelConfig.id)

      if (model) {
        group = model.wrapper
        group.clear()
        model.config = modelConfig
      } else {
        group = new THREE.Group()
        scene.add(group)

        model = {
          wrapper: group,
          config: modelConfig,
        }
        objList.push(model)
      }

      //let loader = new THREE.ObjectLoader()

      if (threedModel != null) {
        //const currentModel = loader.parse(threedModel)
        const currentModel = threedModel.scene
        group.add(currentModel)
        rotateCurrentModel(group, model.config)
        changeCurrentModelPosition(group, model.config)
        changeCurrentModelScale(group, model.config)

        addMaterial(group, model.config)
      }

      render()
      console.log(group)
    }

    // 创建场景
    const initScene = () => {
      scene = new THREE.Scene()
      const axesHelper = new THREE.AxesHelper(150)
      scene.add(axesHelper)
    }

    // 创建渲染器
    const initRenderer = () => {
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio( config.value.render.pixelRatio)
    }

    //实例化一个透视投影相机
    const initCamera = () => {
      currentCamera = new THREE.PerspectiveCamera(config.value.camera.fov, width.value/ height.value, config.value.camera.near, config.value.camera.far)
      currentCamera.position.set(
        config.value.camera.position.x,
        config.value.camera.position.y,
        config.value.camera.position.z,
      )
      //相机观察目标指向Threejs 3D空间中某个位置
      //camera.lookAt(mesh.position); //指向mesh对应的位置
      currentCamera.lookAt(
        config.value.camera.lookAt.x,
        config.value.camera.lookAt.y,
        config.value.camera.lookAt.z,
      )
    }

    //设置光源
    const initCameraLight = () => {
      cameraLight = new THREE.DirectionalLight(
        config.value.camera.light.color,
        config.value.camera.light.intensity,
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

    const initLight = () => {
      config.value.light.forEach(lightConfig => {
        addLight(lightConfig)
      })
    }


    // 设置相机控件轨道控制器
    const initCameraControl = () => {
      cameraControl = new ArcballControls(currentCamera, renderer.domElement)
      cameraControl.addEventListener('change', function() {
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


    const addLight = (config:LightConfig) => {
      let light:THREE.Light
      switch (config.lightType){
        case LightType.DirectionalLight:
          light = new THREE.DirectionalLight( config.color, config.intensity)
          break
        case LightType.AmbientLight:
          light = new THREE.AmbientLight( config.color, config.intensity)
          break
      }

      light.uuid = config.id
      light.position.set(
        config.x,
        config.y,
        config.z,
      )

      scene.add(light)
    }

    const initAmbientLight = () =>{
      ambientLight = new THREE.AmbientLight(config.value.scene.ambientLight.color, config.value.scene.ambientLight.intensity)
      scene.add(ambientLight)
    }


    const initBackground = () => {
      const backgroundConfig = config.value.scene.background
      switch(backgroundConfig.type){
        case BackgroundType.Color:
          scene.background = new THREE.Color(config.value.scene.background.color)
          break
        case BackgroundType.Texture:
          const textureCube = new THREE.CubeTextureLoader().load([
            backgroundConfig.pic1,
            backgroundConfig.pic2,
            backgroundConfig.pic3,
            backgroundConfig.pic4,
            backgroundConfig.pic5,
            backgroundConfig.pic6,
          ])
          scene.background = textureCube // 作为背景贴图
          break
      }
    }

    const initGround = () =>{
      const groundConfig = config.value.scene.ground

      const groundGeo = new THREE.PlaneGeometry( groundConfig.width, groundConfig.height )
      const groundMat = new THREE.MeshLambertMaterial( { color: groundConfig.color } )

      ground = new THREE.Mesh(groundGeo, groundMat)
      ground.visible = groundConfig.enabled
      ground.position.x = groundConfig.position.x
      ground.position.y = groundConfig.position.y
      ground.position.z = groundConfig.position.z


      ground.rotation.x = THREE.MathUtils.degToRad(groundConfig.rotation.x) //- Math.PI / 2
      ground.rotation.y = THREE.MathUtils.degToRad(groundConfig.rotation.y)
      ground.rotation.z = THREE.MathUtils.degToRad(groundConfig.rotation.z)

      //ground.rotation.x = - Math.PI / 2
      ground.receiveShadow = true
      scene.add(ground)
    }


    const initFog = () =>{
      const fogConfig = config.value.scene.fog
      if(fogConfig.enabled) {
        scene.fog = new THREE.Fog(fogConfig.color, fogConfig.near, fogConfig.far)
      }
    }

    //渲染场景
    const render = () => {

      // 定义threejs输出画布的尺寸(单位:像素px)
      renderer.setSize(width.value, height.value) //设置three.js渲染区域的尺寸(像素px)
      renderer.setRenderTarget(null)
      renderer.setPixelRatio( config.value.render.pixelRatio)
      renderer.render(scene, currentCamera) //执行渲染操作
      //requestAnimationFrame(render)
    }

    const addMaterial = (obj: THREE.Object3D, config:ThreedModelConfig) => {

      obj.traverse(child => {

        if (child instanceof THREE.Mesh) {
          config.materials.forEach(materialConfig => {

            if ([materialConfig.meshName].includes(child.name) || (!materialConfig.meshName && !child.name)) {
              const material = new THREE.MeshBasicMaterial({
                color: materialConfig.color,
              })

              const mesh = new THREE.Mesh(child.geometry, material)
              mesh.rotateX(THREE.MathUtils.degToRad(materialConfig.rotation.x))
              mesh.rotateY(THREE.MathUtils.degToRad(materialConfig.rotation.y))
              mesh.rotateZ(THREE.MathUtils.degToRad(materialConfig.rotation.z))

              mesh.position.set(
                child.position.x + obj.position.x,
                child.position.y + obj.position.y,
                child.position.z + obj.position.z,
              )

              scene.add(mesh)
            }

          })
        }
      })
    }

    const rotateCurrentModel = (group: THREE.Group, modelConfig: ThreedModelConfig) => {
      group.rotation.set(
        THREE.MathUtils.degToRad(modelConfig.rotate.X),
        THREE.MathUtils.degToRad(modelConfig.rotate.Y),
        THREE.MathUtils.degToRad(modelConfig.rotate.Z),
      )
    }


    const changeCurrentModelPosition = (group: THREE.Group, modelConfig: ThreedModelConfig) => {
      group.position.set(modelConfig.postion.X, modelConfig.postion.Y, modelConfig.postion.Z)
    }

    const changeCurrentModelScale = (group: THREE.Group, modelConfig: ThreedModelConfig) => {
      group.scale.set(modelConfig.scale.X, modelConfig.scale.Y, modelConfig.scale.Z)
    }


    const modelTap = (e: MouseEvent) => {
      mouse.x = (e.offsetX / width.value) * 2 - 1
      mouse.y = -(e.offsetY / height.value) * 2 + 1

      const wrapperList = objList.map(r => r.wrapper)

      let raycaster: THREE.Raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, currentCamera)

      let intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[] = raycaster.intersectObjects(wrapperList)

      if (intersects.length > 0 && cameraStopSwtch.value) {
        let newCameraStop = addCameraStop(intersects[0])
        printPoint(newCameraStop, cameraStopList.value.length)
      }
    }

    initScene()
    initRenderer()
    initCamera()
    initCameraLight()
    initCameraControl()
    initLight()
    initAmbientLight()
    initBackground()
    initGround()
    initFog()

    const loadModel = () => {
      objList.forEach(r => scene.remove(r.wrapper))
      objList = []
      const loader = new GLTFLoader()

      config.value.models.forEach(r => {
        if (r.url) {
          getFile(r.url).then(res => {
            const blob = new Blob([res.data])
            blob.arrayBuffer().then(arrayBuffer => {
              loader.parse(arrayBuffer, '',  gltf => {
                addModelToScene(gltf, r)
              })
            })
          })
        } else {
          addModelToScene(null, r)
        }
      })
    }

    onMounted(() => {

      if(!com.config.cameraStops)
      {
        com.config.cameraStops = []
      }

      loadModel()
      render()
      if (containerRef.value) {
        containerRef.value.appendChild(renderer.domElement) //body元素中插入canvas对象
      }
      initCameraStopModel()

      console.log('cameraStops',com.config.cameraStops)
    })

    const cameraStopList = computed(() => {
      return com.config.cameraStops
    })

    const addCameraStop = (intersect: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>) => {
      let cameraStop:cameraStop = { x: intersect.point.x, y: intersect.point.y, z: intersect.point.z,groupId:null }
      com.config.cameraStops.push(cameraStop)
      return cameraStop
    }

    const printPoint = (cameraStop:cameraStop,index:number) => {

      const group = new THREE.Group()

      const geometry = new THREE.SphereGeometry(1, 32, 16)
      const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.5,
      })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(cameraStop.x,cameraStop.y,cameraStop.z)
      scene.add(sphere)
      group.add(sphere)
      var spriteX = makeTextSprite((index).toString(), {
        fontsize: 80,
        borderColor: { r: 255, g: 0, b: 0, a: 0.4 } /* 边框黑色 */,
        backgroundColor: { r: 255, g: 255, b: 255, a: 0.9 } /* 背景颜色 */,
        fontface: 'Arial',
        borderThickness: 10,
      })

      if (spriteX) {
        spriteX.center = new THREE.Vector2(0, 0)
        //ascene.add(spriteX)
        spriteX.position.set(cameraStop.x + 3,cameraStop.y + 6,cameraStop.z + 3)
        scene.add(spriteX)

        group.add(spriteX)
        scene.add(group)
        cameraStop.groupId = group.id
        //com.config.cameraStops.push({ x: x, y: y + 10, z: z, groupId: group.id })
      }
      cameraStopSwtch.value = false
    }

    const makeTextSprite = (message: string, parameters: textSpriteSetting) => {
      var fontface = parameters.hasOwnProperty('fontface')
        ? parameters['fontface']
        : 'Arial'

      /* 字体大小 */
      var fontsize = parameters.hasOwnProperty('fontsize')
        ? parameters['fontsize']
        : 18

      /* 边框厚度 */
      var borderThickness = parameters.hasOwnProperty('borderThickness')
        ? parameters['borderThickness']
        : 4

      /* 边框颜色 */
      var borderColor = parameters.hasOwnProperty('borderColor')
        ? parameters['borderColor']
        : { r: 0, g: 0, b: 0, a: 1.0 }

      /* 背景颜色 */
      var backgroundColor = parameters.hasOwnProperty('backgroundColor')
        ? parameters['backgroundColor']
        : { r: 255, g: 255, b: 255, a: 1.0 }

      /* 创建画布 */
      var canvas: HTMLCanvasElement = document.createElement('canvas')
      var context = canvas.getContext('2d')

      if (!context) {
        return null
      }

      /* 字体加粗 */
      context.font = `Bold ${  fontsize  }px ${  fontface}`

      /* 获取文字的大小数据，高度取决于文字的大小 */
      //var metrics = context.measureText(message);
      //var textWidth = metrics.width;

      /* 背景颜色 */
      context.fillStyle =
    `rgba(${
      backgroundColor.r
    },${
      backgroundColor.g
    },${
      backgroundColor.b
    },${
      backgroundColor.a
    })`

      /* 边框的颜色 */
      context.strokeStyle =
    `rgba(${
      borderColor.r
    },${
      borderColor.g
    },${
      borderColor.b
    },${
      borderColor.a
    })`
      context.lineWidth = borderThickness

      // /* 绘制圆角矩形 */
      drawAnchor(context)

      /* 字体颜色 */
      context.fillStyle = 'rgba(0, 0, 0, 1.0)'
      context.fillText(message, -25, -50)

      /* 画布内容用于纹理贴图 */
      var texture = new THREE.Texture(canvas)
      texture.needsUpdate = true

      var spriteMaterial = new THREE.SpriteMaterial({ map: texture })
      var sprite = new THREE.Sprite(spriteMaterial)

      /* 缩放比例 */
      sprite.scale.set(10, 5, 1)

      return sprite
    }

    // 绘制锚点
    function drawAnchor(ctx: CanvasRenderingContext2D) {

      //变换-位移
      // ctx.rotate(Math.PI/12);
      ctx.translate(100, 150)

      //开始新路径
      ctx.beginPath()

      //指定起点，建立子路径
      ctx.moveTo(0, 0)

      //绘制二次贝塞尔曲线
      ctx.quadraticCurveTo(50, -50, 50, -100)

      //绘制圆弧
      ctx.arc(0, -100, 50, 0, Math.PI, true)

      //绘制二次贝塞尔曲线
      ctx.quadraticCurveTo(-50, -50, 0, 0)

      ctx.closePath()
      //显示路径
      // ctx.stroke();
      ctx.fill()
      ctx.stroke()
    }

    const cameraStopSwtchChange = () => {
      cameraStopSwtch.value = !cameraStopSwtch.value
    }

    const cameraStopSwtchTitle = computed(() => {
      return cameraStopSwtch.value ? '请点击3D视图设置途径点' : '设置途径点'
    })

    const removeCameraStop = (index: number) => {
      clearCameraStopModel()
      com.config.cameraStops.splice(index, 1)
      initCameraStopModel()
    }

    const initCameraStopModel = () => {
      com.config.cameraStops.forEach((cameraStop,index) => {
        printPoint(cameraStop,index+1)
      })
    }

    const clearCameraStopModel = () => {
      com.config.cameraStops.forEach(cameraStop => {
        if(cameraStop && cameraStop.groupId) {
          let point = scene.getObjectById(cameraStop.groupId)
          scene.remove(point)
          cameraStop.groupId = null
        }
      })
    }


    const animate = () => {
      requestAnimationFrame(animate)
      TWEEN.update()
      renderer.render(scene, currentCamera) //执行渲染操作
    }

    const extendPoint = (A: THREE.Vector3, B: THREE.Vector3, distance: number): THREE.Vector3 => {
      // 计算向量AB
      const AB = {
        x: B.x - A.x,
        y: B.y - A.y,
        z: B.z - A.z,
      }

      // 计算向量AB的模
      const magnitudeAB = Math.sqrt(AB.x ** 2 + AB.y ** 2 + AB.z ** 2)

      // 计算单位向量AB_unit
      const AB_unit = {
        x: AB.x / magnitudeAB,
        y: AB.y / magnitudeAB,
        z: AB.z / magnitudeAB,
      }

      const C = {
        x: A.x + (distance + magnitudeAB) * AB_unit.x,
        y: A.y + (distance + magnitudeAB) * AB_unit.y,
        z: A.z + (distance + magnitudeAB) * AB_unit.z,
      }

      return new THREE.Vector3(C.x, C.y, C.z)
    }

    const cameraNavigatorStart = () => {
      let tweenList: Array<TWEEN.Tween<THREE.Vector3>> = []

      let cruisingAltitude = config.value.CruisingAltitude ?? 0

      cameraStopList.value.forEach((r, index) => {
        let endLookAt = new THREE.Vector3(r.x, r.y + cruisingAltitude, r.z)
        let startLookAt

        console.log('moveCamera cameraStopList index', index)

        if (index == 0) {
          startLookAt = new THREE.Vector3(0, 0, 0)
          if (cameraStopList.value.length > 1) {
            endLookAt = new THREE.Vector3(
              cameraStopList.value[1].x,
              cameraStopList.value[1].y + cruisingAltitude,
              cameraStopList.value[1].z,
            )
          }
        } else if (index == 1) {
          startLookAt = new THREE.Vector3(r.x, r.y + cruisingAltitude, r.z)
        } else {
          let preStop = cameraStopList.value[index - 1]
          let prePreStop = cameraStopList.value[index - 2]
          startLookAt = extendPoint(
            new THREE.Vector3(prePreStop.x, prePreStop.y + cruisingAltitude, prePreStop.z),
            new THREE.Vector3(preStop.x, preStop.y + cruisingAltitude, preStop.z),
            200,
          )
        }

        //移动镜头焦点
        let tween1 = new TWEEN.Tween(startLookAt)
        tween1.to(endLookAt, 1000)
        tween1.onStart(() => {
          currentCamera.up.set(0, 1, 0)
        })
        tween1.onUpdate(currentLookAt => {
          currentCamera.lookAt(currentLookAt.x, currentLookAt.y + cruisingAltitude, currentLookAt.z)
        })

        //移动相机位置
        let tween2 = new TWEEN.Tween(currentCamera.position)
        tween2.to({ x: r.x, y: r.y + cruisingAltitude, z: r.z }, 3000)
        tween2.onUpdate(function () {
          currentCamera.lookAt(endLookAt.x, endLookAt.y, endLookAt.z)
          cameraLight.position.set(
            currentCamera.position.x,
            currentCamera.position.y,
            currentCamera.position.z,
          )
        })

        if (index > 0) {
          tweenList[tweenList.length - 1].chain(tween1)
          tween1.chain(tween2)
        } else {
          tween1.chain(tween2)
        }
        tweenList.push(tween1)
        tweenList.push(tween2)
      })

      if (tweenList.length > 0) {
        let lastStop = cameraStopList.value[cameraStopList.value.length - 1]
        let startLookAt = new THREE.Vector3(lastStop.x, lastStop.y, lastStop.z)
        let tween1 = new TWEEN.Tween(startLookAt)
        tween1.to({ x: 0, y: 0, z: 0 }, 1000)
        tween1.onUpdate(currentLookAt => {
          currentCamera.lookAt(currentLookAt.x, currentLookAt.y, currentLookAt.z)
        })

        let tween2 = new TWEEN.Tween(currentCamera.position)
        tween2.to({ x: config.value.camera.position.x, y: config.value.camera.position.y, z: config.value.camera.position.z }, 1000)
        tween2.onUpdate(() => {
          cameraLight.position.set(
            currentCamera.position.x,
            currentCamera.position.y,
            currentCamera.position.z)
        })

        tweenList[tweenList.length - 1].chain(tween1,tween2)
        tweenList.push(tween1)
        tweenList.push(tween2)
        tweenList[0].start()
      }
      animate()
    }

    return {
      width,
      height,
      modelTap,
      modelLoading,
      containerRef,
      cameraStopList,
      cameraStopSwtch,
      cameraStopSwtchChange,
      cameraStopSwtchTitle,
      removeCameraStop,
      cameraNavigatorStart,
    }
  },
})
</script>
<style scoped>
.animationItem:hover{
    background-color: #f0f0f0;
}
</style>
