<template>
    <div class="setting-panel-gui">
        <g-field-collapse label="地图设置">
            <g-field label="地图网址">
                <g-input v-model="config.url" />
            </g-field>
        </g-field-collapse>
        <g-field-collapse label="弹出框设置">
            <g-field label="弹出框宽度">
                <g-input-number v-model="config.dialogWidth" :min="100" :max="2000" :step="1" />
            </g-field>
            <g-field label="弹出框高度">
                <g-input-number v-model="config.dialogHeight" :min="100" :max="2000" :step="1" />
            </g-field>
            <g-field label="标题背景颜色">
                <g-input v-model="config.dialogHeaderBackgroundColor" />
            </g-field>
            <g-field label="标题高度">
                <g-input-number v-model="config.dialogHeaderHeight" :min="10" :max="1000" :step="1" />
            </g-field>
            <g-field label="标题字体大小">
                <g-input-number v-model="config.dialogHeaderFrontSize" :min="12" :max="100" :step="1" />
            </g-field>
        </g-field-collapse>
        <g-field-collapse label="初始化视角设置">
            <g-field :level="2" label="3D">
                <n-switch v-model:value="config.camera.is3D" />
            </g-field>
            <g-field :level="2" label="X坐标">
                <g-input-number v-model="config.camera.pointX" :step="1" />
            </g-field>
            <g-field :level="2" label="Y坐标">
                <g-input-number v-model="config.camera.pointY" :step="1" />
            </g-field>
            <g-field :level="2" label="Z坐标">
                <g-input-number v-model="config.camera.pointZ" :step="1" />
            </g-field>
            <g-field :level="2" label="旋转度">
                <g-input-number v-model="config.camera.headingValue" :step="1" />
            </g-field>
            <g-field :level="2" label="倾斜度">
                <g-input-number v-model="config.camera.tiltValue" :step="1" />
            </g-field>
            <g-field :level="2" label="缩放数值">
                <g-input-number v-model="config.camera.scaleValue" :step="1" />
            </g-field>
        </g-field-collapse>
        <g-field-collapse label="撒点设置" mode="layout" default-layout="horizontal"
            :features="['vertical', 'horizontal', 'copy', 'add', 'remove']" :list="config.pointConfigs" :min="1"
            :max="20" tab="撒点" :add-item="addPoint">
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
                <g-field label="点位JSON">
                    <g-input v-model="slotProps.item.dataJson" />
                </g-field>
                <g-field label="图标地址">
                    <g-upload-image v-model="slotProps.item.iconUrl" />
                </g-field>
                <g-field label="图标宽度">
                    <g-input-number v-model="slotProps.item.iconWidth" :min="0" :max="100" :step="1" />
                </g-field>
                <g-field label="图标高度">
                    <g-input-number v-model="slotProps.item.iconHeight" :min="0" :max="100" :step="1" />
                </g-field>
            </template>
        </g-field-collapse>
            <g-field label="地图缩放">
                <g-input-number
                    v-model="config.zoomIn"
                    :step="1"
                    :min="0"
                    :max="13"
                />
            </g-field>
            <g-field label="地图初始化延迟">
                <g-input-number
                    v-model="config.timeoutVal"
                    :step="1"
                    :min="0"
                    :max="10000"
                />
            </g-field>


    </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, toRef, ref } from 'vue'
import {
} from '@/data/select-options'
import { City3dMap } from './city-3d-map'

export default defineComponent({
    name: 'VCity3dMapProp',
    props: {
        com: {
            type: Object as PropType<City3dMap>,
            required: true,
        },
    },
    setup(props) {
        const config = toRef(props.com, 'config')

        const addPoint = () => {
            if (config.value.pointConfigs.some(r => r.name == '')) {
                return
            }
            config.value.pointConfigs.push({
                name: '',
                type: '',
                apiUrl: '',
                iconUrl: '',
                iconWidth: 20,
                iconHeight: 20,
                dataJson: '',
            })
        }

        return {
            config,
            addPoint
        }
    },
})
</script>

<style scoped>
.actionTitle {
    font-size: 9pt;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 200px;
    float: left;
}
</style>
