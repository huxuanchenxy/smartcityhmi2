import { DatavComponent } from '@/components/datav-component'
import {
    ApiConfigMap, ApiDataConfigMap,
    initApiConfig, initApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'

/**
 * Iframe
 */
export class BgIframe extends DatavComponent {
    config = {
        position: 'absolut',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        border: 0,
        overflow:'hidden',
        scale:1,
        srcConfig: {
            srcStyle: {
               width:100,
               height:100,
               border:0,
               margin:0,
               padding:0
            },
            src: 'http://127.0.0.1:8000/',
        },
    }

    apis: Partial<ApiConfigMap>
    apiData: Partial<ApiDataConfigMap>

    events: Record<string, DataEventConfig>

    actions: Record<string, DataEventConfig>

    constructor() {
        super('BgIframe', { w: 800, h: 600 })

        this.initData()
    }

    initData() {
        const fields = [
            createField('url', { description: '地址', optional: true }),
        ]

        this.apis = initApiConfig({
            fields: Object.assign({}, ...fields),
            description: 'iframe接口',
        })

        this.apiData = initApiData(this.id)

        this.events = {}
        this.actions = {}

        return this
    }

    async loadData() {
        try {
            // 组件静态数据来源，当前项目统一管理目录：data/*
            // 如：data/demo/data.json 简写为 => demo/data
            const path = 'iframe/bg-iframe'
            const res = await getStaticData(this.id, path)
            this.apiData.source.config.data = JSON.stringify(res.data)
        } catch (error) {
            throw error
        }
    }
}

export default BgIframe
