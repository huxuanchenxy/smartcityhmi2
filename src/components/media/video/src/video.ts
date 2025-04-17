import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
} from '@/components/data-source'
import { DataEventConfig } from '@/components/data-event'
import { getStaticData } from '@/api/data'

/**
 * MainImg
 */
export class Video extends DatavComponent {
  config = {
    autoplay:true,//自动播放
    controls:true,//控制面板
    loop:true,//循环播放
    muted:true,//静音
    poster:'',//规定视频下载时显示的图像，或者在用户点击播放按钮前显示的图像。
    preload:true,//如果出现该属性，则视频在页面加载时进行加载，并预备播放。如果使用“autoplay”，则忽略该属性
    src: '',//要播放的视频的URL。
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('Video', { w: 300, h: 180 })

    this.initData()
  }

  initData() {
    this.apis = {}
    this.apiData = {}
    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      // 组件静态数据来源，当前项目统一管理目录：data/*
      // 如：data/demo/data.json 简写为 => demo/data
      const path = ''
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default Video
