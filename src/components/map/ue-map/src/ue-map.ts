import { DatavComponent } from '@/components/datav-component'
import { ApiConfigMap, ApiDataConfigMap } from '@/components/data-source'
import { DataEventConfig } from '@/components/data-event'


export class UeMap extends DatavComponent {

    config = {}
    apis: Partial<ApiConfigMap>
    apiData: Partial<ApiDataConfigMap>
    events: Record<string, DataEventConfig>
    actions: Record<string, DataEventConfig>

    constructor() {
        super('UeMap', { w: 200, h: 50 })
        this.initData()
    }

    initData() {
        this.id = "UeMap";//只能放一个该控件
        this.apis = {}
        this.apiData = {}
        this.events = {}
        this.actions = {}
        return this
    }
    async loadData() { }
}

export default UeMap
