import {getGridData} from '@/config/MapSettingMethod'
// import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Graphic from '@arcgis/core/Graphic'

var MapRange = {
  data(){
    return {
      rangeLayer: null
    }
  },
  created(){

  },
  methods: {

    getRangeLayer() {

      this.rangeLayer =  this.map.findLayerById('rangLayer')
      return this.rangeLayer
    },

    //渲染范围
    async renderRange(gridNames, attributes){

      const gridMap = await getGridData()
      const arr = gridNames.map(key=>{
        return gridMap.get(key)
      })

      this.refreshRangeLayer(arr, attributes)
    },

    //更新图层数据
    async refreshRangeLayer(data, attributes){

      const layer = this.getRangeLayer()

      // 获取待清除的图层要素id
      const ObjectIds = await layer.queryObjectIds()
      const deleteFeatures = ObjectIds.map(v=>{ return {objectId: v}})

      // 获取待添加的图层要素
      const addFeatures = data.map((item)=>{

        const {properties, rings} = item

        let graphic = new Graphic({
          attributes: {
            type: attributes.type || undefined, //区域类型
            name: properties['NAME'],
            street: properties['STREET_NAME']
          },
          geometry: {
            type: 'polygon',
            rings: rings[0]
          }
        })
        return  graphic
      })

      //执行更新
      //deleteFeatures,
      const results = await layer.applyEdits({ deleteFeatures, addFeatures })
      console.log(`layer ${layer.id },deleteFeatures: ${results.deleteFeatureResults.length}; addFeatures:${results.addFeatureResults.length}`)

    }


  }
}

export default MapRange
