import { generateId } from '@/utils/util'

export class baseMapConfigModel {
    x = 121.53
    y = 31.299
    zoom = 10
    rotation = 0
    matrixSet = 'EPSG:4326'
    fixedMatrixSet = 'BD-MC'
    dialogWidth = 800
    dialogHeight = 600
    dialogHeaderBackgroundColor = '#11C2EE'
    dialogHeaderBackgroundImgUrl = null
    dialogHeaderHeight = 30
    dialogHeaderFrontSize = 16
    pointConfigs = [{
      id: generateId('point'),
      name: '',
      code: '',
      apiUrl: '',
      iconUrl: '',
      iconWidth: 0,
      iconHeight: 0,
      dialogComponent: '',
    }]
    circleApiUrl = ''
    filghtApiUrl = ''
    AreaOutline = {
      show: false,
      url: '../../data/map/geoJson_yangpu.json',
      InnerbackgroundColor: 'rgba(255,255,255,0)',
      outerbackgroundColor: 'rgba(255,255,255,0)',
      broder: {
        width: 2,
        color: 'rgb(53,154,204)',
      },
    }
    heatmapApiUrl = ''
    overviewMap = false
    filter = {
      grayscale : 0,
      sepia : 0,
      saturate : 1,
      hueRotate : 0,
      invert : 0,
      opacity : 1,
      brightness : 1,
      contrast : 1,
      blur : 0,
    }
}
