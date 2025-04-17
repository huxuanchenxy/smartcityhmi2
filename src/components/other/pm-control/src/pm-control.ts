import { DatavComponent } from '@/components/datav-component'
import { ApiConfigMap, ApiDataConfigMap } from '@/components/data-source'
import { DataEventConfig } from '@/components/data-event'


export class PmControl extends DatavComponent {

    config = {}
    apis: Partial<ApiConfigMap>
    apiData: Partial<ApiDataConfigMap>
    events: Record<string, DataEventConfig>
    actions: Record<string, DataEventConfig>

    constructor() {
        super('PmControl', { w: 200, h: 50 })
        this.initData()
    }

    initData() {
        this.id = "PmControl";//只能放一个该控件
        this.apis = {}
        this.apiData = {}
        this.events = {}
        this.actions = {}
        return this
    }
    async loadData() { }
}

export default PmControl
