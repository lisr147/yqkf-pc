<!--
地图组件
-->
<template>
  <div class="gd-map" id="gdMap" ref="gdMap"></div>
</template>

<script>
import defaultConfig from './config/config.json'
import url from './config/url.json'
import { loadScript } from './js/common.js'

import roundPointLayer from './mixins/roundPointLayer'
import iconLayer from './mixins/iconLayer'
import polygon from './mixins/polygon'
import marker from './mixins/marker'
import heatmap from './mixins/heatmap'

export default {
  name: 'Gdmap',
  props: {
    // 初始化地图配置
    config: {
      type: Object,
      default: () => defaultConfig
    },
    // 加载库地址
    url: {
      type: Object,
      default: () => url
    }
  },
  data () {
    return {
      layerData: [], // 记录当前图层信息
      layerType: { roundPointLayer, iconLayer, polygon, marker, heatmap }
    }
  },
  methods: {
    async init () {
      console.log('gdmap init')
      var protocol = window.location.protocol
      if (!window.AMap) {
        await loadScript(protocol+this.url.gd.url)
      }

      if (!window.Loca) {
        await loadScript(protocol+this.url.loca.url)
      }

      this.createMap().on('complete', () => {
        // 地图初始化完毕，重新渲染地图数据
        this.layerData.forEach((v, i) => {
          this.setMapData(v.layerData, v.layerConfig, i)
        })

        // 地图缩放事件
        this.config.AMap.on('zoomend', (event) => {
          let zoom = this.config.AMap.getZoom()
          this.$emit('zoomend', zoom)
        })
      })
    },

    /**
     * 创建、更新或删除图层
     * layerData:图层数据
     * layerConfig:图层配置
     * layerIndex:图层编号，指定修改哪个图层数据，默认为0。如果该层有数据，先删除该层再重新新建图层
     */
    setMapData (layerData = [], layerConfig = { }, layerIndex = 0) {
      // console.log('setMapData', layerData, layerConfig, layerIndex)
      // 删除原INDEX下的图层
      if (this.layerData[layerIndex] && this.layerData[layerIndex].layer) {
        this.layerData[layerIndex].layer.delLayer()
      }
      // 如果layerConfig是空，直接删除图层
      if (!layerConfig) {
        this.layerData[layerIndex] = null
        return
      }

      // 更新新的layer数据
      this.layerData[layerIndex] = { layerData, layerConfig }
      // 描绘图层
      if (window.Loca && window.AMap) {
        let clickEvent = (event) => {
          this.$emit('layerClickEvent', event.rawData)
        }
        layerConfig.zIndex = layerIndex
        let layer = new this.layerType[layerConfig.type](this.config.AMap, layerConfig, layerData, clickEvent)
        this.layerData[layerIndex].layer = layer
      }
    },
    /**
     * 设置视野
     */
    setZoomAndCenter (zoom, pos) {
      this.config.AMap.setZoomAndCenter(zoom, pos)
    },

    /**
     * 创建地图
     */
    createMap () {
      this.config.container = this.$refs['gdMap']
      this.config.AMap = new window.AMap.Map(
        this.config.container,
        this.config.conf
      )
      return this.config.AMap
    },

    /**
     * 销毁地图
     */
    destroyMap () {
      this.config.AMap && this.config.AMap.destroy()
    }

  },
  async mounted () {
    this.init()
  },
  beforeDestroy () {
    this.destroyMap()
  }
}
</script>

<style scoped>
.gd-map {
  width: 100%;
  height: 100%;
}
/*修改高德 TEXT 覆盖物样式*/
/deep/ .amap-overlay-text-container {
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  color: #ffffff;
}
</style>
