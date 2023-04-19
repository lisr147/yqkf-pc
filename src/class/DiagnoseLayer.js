import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import Graphic from "@arcgis/core/Graphic"
import Color from "@arcgis/core/Color"

const layer = class DiagnoseLayer {

  _colorStep = 0


  constructor({view, map, id}){

    this.id = id
    this.view = view
    this.map = map

    this.layer = null
    this.features = []
    this.uniqueList = []

    this.init()
  }

  init(){

    this.layer = new GraphicsLayer({
      title: '确诊人员活动历史',
      id: this.id,
      graphics: [],
      visible: true
    })

    this.map.add(this.layer)
  }

  // 添加唯一标识
  // 这里的唯一标识是人
  addUniqueItem(attrs){

    let match = this.uniqueList.find(v=>v.id == attrs.id)

    if(match){
      console.error(`DiagnoseLayer,该标识已存在: ${JSON.stringify(attrs)}`)
      return
    }

    const {name, id, sickType} = attrs

    const res = {
      name,
      id,
      sickType,
      color: new Color(`hsla(${this._colorStep},80%,50%,1)`)
    }

    this._colorStep += 20 % 360

    this.uniqueList.push(res)

    return res
  }

  /**
   * 添加元素到图层中
   * @param data {Array}
   */
  addFeatures(data){

    data.forEach((dataItem)=>{

      const { color} = this.addUniqueItem(dataItem)
      const {id, name, trace} = dataItem

      trace.forEach(item=>{

        const history = item.log.map(v => {
          return `${v.time} 停留${v.stay}小时`
        })

        const feature =  this.createGraphic({
          //元素属性
          id,
          person: name,
          lngLat: item.lngLat,
          type: item.type,
          name: item.name,
          desc: history.join('\n')
        }, {
          //场所类型：1 居住地 2
          size: item.type == 1 ? 20 : 10,
          //关联元素的颜色
          color
        })

        //保存图形
        this.features.push(feature)

      })

    })

    this.layer.addMany(this.features)

  }

  /**
   * 根据确诊者id过滤元素，不匹配的隐藏
   * @param ids {Array}
   */
  filterFeatures({ids = []}) {

    this.features.forEach(feature => {
      const isMatch = ids.includes(feature.attributes.id)
      feature.visible = isMatch
    })

  }

  //创建图形
  createGraphic(attributes, opts = {size:10, color:'#DC1E00'}){

    const {size, color} = opts

    const graphic = new Graphic({
      geometry:{
        type: 'point',
        longitude: attributes.lngLat[0],
        latitude:  attributes.lngLat[1],
      },
      symbol: {
        type: "simple-marker",
        color,
        size,
        outline: {
          width: 1.5,
          color: '#fff'
        }
      },
      attributes
    })
    return graphic
  }



}

export default layer
