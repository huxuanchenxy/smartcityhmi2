<template>
  <div class="setting-panel-gui">
    <!-- 渲染 -->
    <g-field-collapse label="渲染">
      <g-field :level="2" label="抗锯齿">
        <n-switch v-model:value="config.render.antialias" />
      </g-field>
      <g-field :level="2" label="像素比">
        <g-input-number
          v-model="config.render.pixelRatio"
          :min="0"
          :max="10"
          :step="0.1"
        />
      </g-field>
    </g-field-collapse>
    <!-- 场景 -->
    <g-field-collapse label="场景">
      <!-- 环境光 -->
      <g-field-collapse level="2" label="环境光">
        <g-field :level="2" label="颜色">
          <g-color-picker
            v-model="config.scene.ambientLight.color"
            @change="handleUpdateAmbientLight(config.scene.ambientLight)"
          />
        </g-field>
        <g-field :level="2" label="强度">
          <g-input-number
            v-model="config.scene.ambientLight.intensity"
            :min="0"
            :max="1"
            :step="0.1"
            @change="handleUpdateAmbientLight(config.scene.ambientLight)"
          />
        </g-field>
      </g-field-collapse>
      <!-- 背景 -->
      <g-field-collapse level="2" label="背景">
        <g-field :level="2" label="类型">
          <g-select
            v-model="config.scene.background.type"
            :data="[
              { id: 'none', value: '无' },
              { id: 'Color', value: '颜色' },
              { id: 'Day', value: '纹理(白天)' },
              { id: 'Night', value: '纹理(黑夜)' },
              { id: 'Texture', value: '自定义纹理' }
            ]"
            @change="handleModifyBackground(config.scene.background)"
          />
        </g-field>
        <g-field :level="2" label="颜色">
          <g-color-picker v-model="config.scene.background.color" @change="handleModifyBackground(config.scene.background)" />
        </g-field>
        <!-- 背景图 -->
        <g-field-collapse v-model="usePicture" :toggle="true" label="纹理">
          <g-field label="图1">
            <g-upload-image v-model="config.scene.background.pic1" @change="handleModifyBackground(config.scene.background)" />
          </g-field>
          <g-field label="图2">
            <g-upload-image v-model="config.scene.background.pic2" @change="handleModifyBackground(config.scene.background)" />
          </g-field>
          <g-field label="图3">
            <g-upload-image v-model="config.scene.background.pic3" @change="handleModifyBackground(config.scene.background)" />
          </g-field>
          <g-field label="图4">
            <g-upload-image v-model="config.scene.background.pic4" @change="handleModifyBackground(config.scene.background)" />
          </g-field>
          <g-field label="图5">
            <g-upload-image v-model="config.scene.background.pic5" @change="handleModifyBackground(config.scene.background)" />
          </g-field>
          <g-field label="图6">
            <g-upload-image v-model="config.scene.background.pic6" @change="handleModifyBackground(config.scene.background)" />
          </g-field>
        </g-field-collapse>
      </g-field-collapse>
      <!-- 地面 -->
      <g-field-collapse
        v-model="config.scene.ground.enabled"
        :toggle="true"
        label="地面"
        level="2"
        @change="handleModifyGround(config.scene.ground)"
      >
        <g-field :level="2" label="宽度">
          <g-input-number
            v-model="config.scene.ground.width"
            :min="0"
            :step="1"
            @change="handleModifyGround(config.scene.ground)"
          />
        </g-field>
        <g-field :level="2" label="高度">
          <g-input-number
            v-model="config.scene.ground.height"
            :min="0"
            :step="1"
            @change="handleModifyGround(config.scene.ground)"
          />
        </g-field>
        <g-field :level="2" label="颜色">
          <g-color-picker v-model="config.scene.ground.color" @change="handleModifyGround(config.scene.ground)" />
        </g-field>
        <!-- 位置 -->
        <g-field-collapse label="位置">
          <g-field :level="2" label="X">
            <g-input-number v-model="config.scene.ground.position.x" :step="1" @change="handleModifyGround(config.scene.ground)" />
          </g-field>
          <g-field :level="2" label="Y">
            <g-input-number v-model="config.scene.ground.position.y" :step="1" @change="handleModifyGround(config.scene.ground)" />
          </g-field>
          <g-field :level="2" label="Z">
            <g-input-number v-model="config.scene.ground.position.z" :step="1" @change="handleModifyGround(config.scene.ground)" />
          </g-field>
        </g-field-collapse>
        <!-- 旋转 -->
        <g-field-collapse label="旋转">
          <g-field :level="2" label="X">
            <g-input-number
              v-model="config.scene.ground.rotation.x"
              :min="-360"
              :max="360"
              :step="1"
              @change="handleModifyGround(config.scene.ground)"
            />
          </g-field>
          <g-field :level="2" label="Y">
            <g-input-number
              v-model="config.scene.ground.rotation.y"
              :min="-360"
              :max="360"
              :step="1"
              @change="handleModifyGround(config.scene.ground)"
            />
          </g-field>
          <g-field :level="2" label="Z">
            <g-input-number
              v-model="config.scene.ground.rotation.z"
              :min="-360"
              :max="360"
              :step="1"
              @change="handleModifyGround(config.scene.ground)"
            />
          </g-field>
        </g-field-collapse>
      </g-field-collapse>
      <!-- 雾 -->
      <g-field-collapse
        v-model="config.scene.fog.enabled"
        label="雾"
        :toggle="true"
        level="2"
        @change="handleModifyFog(config.scene.fog)"
      >
        <g-field :level="2" label="颜色">
          <g-color-picker v-model="config.scene.fog.color" @change="handleModifyFog(config.scene.fog)" />
        </g-field>
        <g-field :level="2" label="近端面">
          <g-input-number v-model="config.scene.fog.near" :step="1" @change="handleModifyFog(config.scene.fog)" />
        </g-field>
        <g-field :level="2" label="远端面">
          <g-input-number v-model="config.scene.fog.far" :step="1" @change="handleModifyFog(config.scene.fog)" />
        </g-field>
      </g-field-collapse>
    </g-field-collapse>
    <!-- 相机 -->
    <g-field-collapse label="相机">
      <!-- 光源 -->
      <g-field-collapse level="2" label="光源">
        <g-field :level="2" label="颜色">
          <g-color-picker v-model="config.camera.light.color" />
        </g-field>
        <g-field :level="2" label="强度">
          <g-input-number
            v-model="config.camera.light.intensity"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
      </g-field-collapse>
      <!-- 位置 -->
      <g-field-collapse level="2" label="位置">
        <g-field :level="2" label="X">
          <g-input-number v-model="config.camera.position.x" :step="1" />
        </g-field>
        <g-field :level="2" label="Y">
          <g-input-number v-model="config.camera.position.y" :step="1" />
        </g-field>
        <g-field :level="2" label="Z">
          <g-input-number v-model="config.camera.position.z" :step="1" />
        </g-field>
      </g-field-collapse>
      <!-- 观察目标 -->
      <g-field-collapse level="2" label="观察目标">
        <g-field :level="2" label="X">
          <g-input-number v-model="config.camera.lookAt.x" :step="1" />
        </g-field>
        <g-field :level="2" label="Y">
          <g-input-number v-model="config.camera.lookAt.y" :step="1" />
        </g-field>
        <g-field :level="2" label="Z">
          <g-input-number v-model="config.camera.lookAt.z" :step="1" />
        </g-field>
      </g-field-collapse>
      <!-- 视锥体 -->
      <g-field-collapse level="2" label="视锥体">
        <g-field :level="1" label="垂直视野角度">
          <g-input-number v-model="config.camera.fov" :step="1" />
        </g-field>
        <!-- <g-field :level="1" label="长宽比">
          <g-input-number v-model="config.camera.aspect" :step="0.1" />
        </g-field> -->
        <g-field :level="1" label="近端面">
          <g-input-number v-model="config.camera.near" :step="1" />
        </g-field>
        <g-field :level="1" label="远端面">
          <g-input-number v-model="config.camera.far" :step="1" />
        </g-field>
      </g-field-collapse>
    </g-field-collapse>
    <!-- 3D模型 -->
    <g-field-collapse
      label="3D模型"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
      :list="config.models"
      :min="1"
      :max="100"
      tab="模型"
      :add-item="handleAddModelItem"
      :remove-item="handleRemoveModelItem"
    >
      <template #default="slotProps">
        <!-- Url -->
        <g-field :level="2" label="Url">
          <g-select-model
            v-model="slotProps.item"
            :ic-com="com"
            @change="handModelChange(slotProps.item)"
          />
          <!-- @change="handModelChange(slotProps.item)" -->
        </g-field>
        <!-- 缩放 -->
        <g-field-collapse level="2" label="缩放">
          <g-field :level="2" label="X">
            <g-input-number
              v-model="slotProps.item.scale.X"
              :step="0.1"
              :change="handleModifyModelParamItem(slotProps.item)"
            />
          </g-field>
          <g-field :level="2" label="Y">
            <g-input-number
              v-model="slotProps.item.scale.Y"
              :step="0.1"
              :change="handleModifyModelParamItem(slotProps.item)"
            />
          </g-field>
          <g-field :level="2" label="Z">
            <g-input-number
              v-model="slotProps.item.scale.Z"
              :step="0.1"
              :change="handleModifyModelParamItem(slotProps.item)"
            />
          </g-field>
        </g-field-collapse>
        <!-- 位置 -->
        <g-field-collapse level="2" label="位置">
          <g-field :level="2" label="X">
            <g-input-number
              v-model="slotProps.item.postion.X"
              :step="1"
              :change="handleModifyModelParamItem(slotProps.item)"
            />
          </g-field>
          <g-field :level="2" label="Y">
            <g-input-number
              v-model="slotProps.item.postion.Y"
              :step="1"
              :change="handleModifyModelParamItem(slotProps.item)"
            />
          </g-field>
          <g-field :level="2" label="Z">
            <g-input-number
              v-model="slotProps.item.postion.Z"
              :step="1"
              :change="handleModifyModelParamItem(slotProps.item)"
            />
          </g-field>
        </g-field-collapse>
        <!-- 旋转 -->
        <g-field-collapse level="2" label="旋转">
          <g-field :level="2" label="X">
            <g-input-number
              v-model="slotProps.item.rotate.X"
              :min="-360"
              :max="360"
              :step="1"
              :change="handleModifyModelParamItem(slotProps.item)"
            />
          </g-field>
          <g-field :level="2" label="Y">
            <g-input-number
              v-model="slotProps.item.rotate.Y"
              :min="-360"
              :max="360"
              :step="1"
              :change="handleModifyModelParamItem(slotProps.item)"
            />
          </g-field>
          <g-field :level="2" label="Z">
            <g-input-number
              v-model="slotProps.item.rotate.Z"
              :min="-360"
              :max="360"
              :step="1"
              :change="handleModifyModelParamItem(slotProps.item)"
            />
          </g-field>
        </g-field-collapse>

        <g-field-collapse
          level="2"
          label="材质"
          mode="layout"
          default-layout="horizontal"
          :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
          :list="slotProps.item.materials"
          :min="0"
          :max="100"
          tab="材质"
          :add-item="handleAddMaterial"
          :remove-item="handleRemoveMaterial"
        >
          <template #default="materialProps">
            <g-field :level="2" label="网格名称">
              <!-- <g-input v-model="materialProps.item.meshName" /> -->
              <g-select v-model="materialProps.item.meshName" :data="slotProps.item.meshList" @change="handleModifyMaterial(slotProps.item)" />
            </g-field>
            <g-field :level="2" label="颜色">
              <g-color-picker v-model="materialProps.item.color" @change="handleModifyMaterial(slotProps.item)" />
            </g-field>
            <g-field :level="2" label="透明度">
              <g-input-number
                v-model="materialProps.item.opacity"
                :step="0.1"
                :min="0"
                :max="1"
                @change="handleModifyMaterial(slotProps.item)"
              />
            </g-field>
            <g-field-collapse label="旋转" level="2">
              <g-field :level="2" label="X">
                <g-input-number
                  v-model="materialProps.item.rotation.X"
                  :min="-360"
                  :max="360"
                  :step="1"
                  @change="handleModifyMaterial(slotProps.item)"
                />
              </g-field>
              <g-field :level="2" label="Y">
                <g-input-number
                  v-model="materialProps.item.rotation.Y"
                  :min="-360"
                  :max="360"
                  :step="1"
                  @change="handleModifyMaterial(slotProps.item)"
                />
              </g-field>
              <g-field :level="2" label="Z">
                <g-input-number
                  v-model="materialProps.item.rotation.Z"
                  :min="-360"
                  :max="360"
                  :step="1"
                  @change="handleModifyMaterial(slotProps.item)"
                />
              </g-field>
            </g-field-collapse>
          </template>
        </g-field-collapse>
      </template>
    </g-field-collapse>
    <!-- 模型选择 -->
    <g-field-collapse v-model="config.select.enable" :toggle="true" label="模型选择">
      <g-field :level="2" label="颜色">
        <g-color-picker v-model="config.select.color" />
      </g-field>
      <!-- 控制 -->
      <g-field label="控制">
        <g-select
          v-model="config.transform"
          :data="[
            { id: 'none', value: '无' },
            { id: 'translate', value: '移动' },
            { id: 'rotate', value: '旋转' },
            { id: 'scale', value: '缩放' }
          ]"
        />
      </g-field>
    </g-field-collapse>
    <!-- 灯光 -->
    <g-field-collapse
      label="灯光"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
      :list="config.light"
      :min="0"
      :max="100"
      tab="灯光"
      :add-item="handleAddLight"
      :remove-item="handleRemoveLight"
    >
      <template #default="slotProps">
        <g-field label="控制">
          <g-select
            v-model="slotProps.item.lightType"
            :data="[
              { id: 'DirectionalLight', value: '平行光' },
              { id: 'AmbientLight', value: '氛围光' }
            ]"
            :change="handleUpdateLight(slotProps.item)"
          />
        </g-field>
        <g-field :level="2" label="颜色">
          <g-color-picker
            v-model="slotProps.item.color"
            :change="handleUpdateLight(slotProps.item)"
          />
        </g-field>
        <g-field :level="2" label="强度">
          <g-input-number
            v-model="slotProps.item.intensity"
            :min="0"
            :max="100"
            :step="1"
            :change="handleUpdateLight(slotProps.item)"
          />
        </g-field>
        <g-field :level="2" label="X">
          <g-input-number
            v-model="slotProps.item.x"
            :step="1"
            :change="handleUpdateLight(slotProps.item)"
          />
        </g-field>
        <g-field :level="2" label="Y">
          <g-input-number
            v-model="slotProps.item.y"
            :step="1"
            :change="handleUpdateLight(slotProps.item)"
          />
        </g-field>
        <g-field :level="2" label="Z">
          <g-input-number
            v-model="slotProps.item.z"
            :step="1"
            :change="handleUpdateLight(slotProps.item)"
          />
        </g-field>
      </template>
    </g-field-collapse>
    <g-field-collapse label="路径导航">
      <g-field :level="2" label="途径点">
        <n-button @click="showCameraNavigator()">设置</n-button>
      </g-field>
      <g-field :level="2" label="循环播放">
        <n-switch v-model:value="config.loopPlay" />
      </g-field>
      <g-field :level="2" label="自动播放">
        <n-switch v-model:value="config.autoPlay" />
      </g-field>
      <g-field :level="2" label="X">
        <g-input-number
          v-model="config.CruisingAltitude"
          :step="1"
        />
      </g-field>
    </g-field-collapse>

    <g-field-collapse
      label="撒点设置"
      mode="layout"
      default-layout="horizontal"
      :features="['vertical', 'horizontal', 'copy', 'add', 'remove']"
      :list="config.pointConfigs"
      :min="0"
      :max="20"
      tab="撒点"
      :add-item="addPoint"
    >
      <template #default="slotProps">
        <g-field label="名称">
          <g-input v-model="slotProps.item.name" />
        </g-field>
        <g-field label="类型">
          <g-input v-model="slotProps.item.type" />
        </g-field>
        <g-field label="Api地址">
          <g-input v-model="slotProps.item.apiUrl" />
        </g-field>
        <g-field label="图标地址">
          <g-upload-image v-model="slotProps.item.iconUrl" />
        </g-field>
        <g-field label="图标宽度">
          <g-input-number
            v-model="slotProps.item.iconWidth"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
        <g-field label="图标高度">
          <g-input-number
            v-model="slotProps.item.iconHeight"
            :min="0"
            :max="100"
            :step="1"
          />
        </g-field>
      </template>
    </g-field-collapse>
  </div>
  <n-modal
    v-model:show="cameraNavigatorVisible"
    preset="dialog"
    :show-icon="false"
    :auto-focus="false"
    style="width:1440px;height:900px;"
  >
    <g-camera-navigator v-model="props.com" />
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef, getCurrentInstance, watch, computed, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
// import {
// } from '@/data/select-options'
import {
  ThreedViewer,
  ThreedModelConfig,
  ThreedModelEventArgs,
  ThreedModelEventType,
  LightConfig,
  LightType,
  ThreedLightEventArgs,
  AmbientLightConfig,
  BackgroundType,
  MaterialConfig,
  BackgroundConfig,
  FogConfig,
  GroundConfig,
} from './threed-viewer'

import { getMesh } from '@/api/threed'


export default defineComponent({
  name: 'VThreedViewerProp',
  props: {
    com: {
      type: Object as PropType<ThreedViewer>,
      required: true,
    },
  },
  setup(props) {
    const mitter = getCurrentInstance()?.appContext.config.globalProperties.mitter

    const config = toRef(props.com, 'config')
    //const icHandles = toRef(props.com, 'ichandles')

    if(!config.value.CruisingAltitude)
    {
      config.value.CruisingAltitude = 0
    }

    if(!config.value.pointConfigs) {
      config.value.pointConfigs = []
    }

    const cameraNavigatorVisible = ref(false)

    const handleAddModelItem = () => {
      const eventArgs: ThreedModelEventArgs = {
        comId: props.com.id,
        config: new ThreedModelConfig(),
      }
      mitter.emit(ThreedModelEventType.AddThreedModelItem + props.com.id, eventArgs)
      return eventArgs.config
    }

    const handleRemoveModelItem = (item: ThreedModelConfig) => {
      const eventArgs: ThreedModelEventArgs = { comId: props.com.id, config: item }
      mitter.emit(ThreedModelEventType.RemoveThreedModelItem + props.com.id, eventArgs)
    }

    const handleAddMaterial = () => {
      console.log('handleAddMaterial', config.value)
      let materialConfig: MaterialConfig = {
        meshName: null,
        color: 'rgb(27,48,68)',
        opacity: 1,
        rotation: {
          x: -90,
          y: 0,
          z: 0,
        },
      }
      return materialConfig
    }

    const handleRemoveMaterial = (item: MaterialConfig) => {
      console.log('handleRemoveMaterial', item)
      mitter.emit(ThreedModelEventType.ModifyMaterial + props.com.id, null)
    }

    const modelJson = computed(() => {
      return cloneDeep<ThreedModelConfig[]>(config.value.models)
    })

    watch(
      () => modelJson.value,
      (newVal, oldVal) => {
        for (let i = 0; i < newVal.length; i++) {
          let oldValItem = oldVal[i]
          let newValItem = newVal[i]
          if (oldValItem && newValItem.id == oldValItem.id && newValItem.url != oldValItem.url) {
            const eventArgs: ThreedModelEventArgs = { comId: props.com.id, config: newVal[i] }
            mitter.emit(ThreedModelEventType.ModifyThreedModelUrlItem + props.com.id, eventArgs)
            break
          }
        }
      },
      { deep: true },
    )

    const handleModifyModelParamItem = (item: ThreedModelConfig) => {
      const eventArgs: ThreedModelEventArgs = { comId: props.com.id, config: item }
      mitter.emit(ThreedModelEventType.ModifyThreedModelParamItem + props.com.id, eventArgs)
    }

    const handModelChange = (item: ThreedModelConfig) => {
      console.log('handModelChange', item)
      const eventArgs: ThreedModelEventArgs = { comId: props.com.id, config: item }
      mitter.emit(ThreedModelEventType.ModifyThreedModelUrlItem + props.com.id, eventArgs)

      getMesh(item.url).then(res => {
        if(res.data.code == 200){
          item.meshList = []
          let list = res.data.data as any[]
          if (list && list.length > 0) {
            item.meshList = list.map(r => { return { id: r.name , value: r.name }})
          }
        }
        console.log('getMesh', res.data.data,item.meshList)
      })
    }

    const handleAddLight = () => {
      let light: LightConfig = LightConfig.createBy(
        'rgba(255,255,255,1)',
        2,
        LightType.DirectionalLight,
        0,
        0,
        0,
      )
      const eventArgs: ThreedLightEventArgs = { comId: props.com.id, config: light }
      mitter.emit(ThreedModelEventType.AddThreedLightItem + props.com.id, eventArgs)
      return light
    }

    const handleRemoveLight = (item: LightConfig) => {
      const eventArgs: ThreedLightEventArgs = { comId: props.com.id, config: item }
      mitter.emit(ThreedModelEventType.RemoveThreedLightItem + props.com.id, eventArgs)
    }

    const handleUpdateLight = (item: LightConfig) => {
      const eventArgs: ThreedLightEventArgs = { comId: props.com.id, config: item }
      mitter.emit(ThreedModelEventType.ModifyThreedLightItem + props.com.id, eventArgs)
    }

    const handleUpdateAmbientLight = (item: AmbientLightConfig) => {
      mitter.emit(ThreedModelEventType.modifyAmbientLight + props.com.id, item)
    }

    const handleModifyMaterial = (item:ThreedModelConfig) => {
      mitter.emit(ThreedModelEventType.ModifyMaterial + props.com.id, item)
    }

    const handleModifyBackground = (item:BackgroundConfig) => {
      mitter.emit(ThreedModelEventType.ModifyBackground + props.com.id, item)
    }

    const usePicture = computed(() => {
      return config.value.scene.background.type == BackgroundType.Texture
    })

    const handleModifyFog = (item: FogConfig) => {
      return mitter.emit(ThreedModelEventType.ModifyFog + props.com.id, item)
    }

    const handleModifyGround = (item: GroundConfig) => {
      return mitter.emit(ThreedModelEventType.ModifyGround + props.com.id, item)
    }


    const showCameraNavigator = () => {
      cameraNavigatorVisible.value = true
    }

    const addPoint = () => {
      if (config.value.pointConfigs.some(r => r.name == '')) {
        return
      }
      return {
        name: '',
        type: '',
        apiUrl: '',
        iconUrl: '',
        iconWidth: 20,
        iconHeight: 20,
        dataJson: '',
      }
    }

    return {
      config,
      //icHandles,
      handleAddModelItem,
      handleRemoveModelItem,
      //handleModifyModelUrlItem,
      handleModifyModelParamItem,
      handModelChange,

      handleAddLight,
      handleRemoveLight,
      handleUpdateLight,

      handleUpdateAmbientLight,

      handleAddMaterial,
      handleModifyMaterial,
      handleRemoveMaterial,

      handleModifyBackground,
      handleModifyFog,
      handleModifyGround,

      usePicture,
      cameraNavigatorVisible,
      showCameraNavigator,
      props,
      addPoint,
    }
  },
})
</script>
