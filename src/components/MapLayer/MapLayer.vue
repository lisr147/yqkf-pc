<template>
  <div class="map">
    <gd-map
      ref="map"
      @layerClickEvent="layerClickEvent"
      :config="mapConfig"
      @zoomend="zoomend"
    ></gd-map>
  </div>
</template>
<script>
import GdMap from './GdMap/GdMap'
import { mapState } from 'vuex'
import store from '@/store'
import DISTRICTS from './districts.json'
export default {
  name: 'mapLayer',
  props: ['mapData', 'mapModel'],
  components: {
    GdMap,
  },
  computed: {
    ...mapState('global', ['themeData'])
  },
  watch: {
    // 监听地图数据变化
    mapData: {
      handler (val, oldVal) {
        this.setMapData(true)
        console.log(val)
      },
      deep: true
    },
    // 监听缩放变化
    mapZoom (val, oldVal) {
      let limitZoom = 12
      if (val > limitZoom && this.layerType === 'roundPointLayer') {
        // 换成icon
        this.layerType = 'iconLayer'
        this.setMapData(false)
      } else if (val <= limitZoom && this.layerType === 'iconLayer') {
        // 换成point
        this.layerType = 'roundPointLayer'
        this.setMapData(false)
      }
    }
  },
  data () {
    let mapZoom = 12
    return {
      mapConfig: {
        instance: null,
        container: null,
        AMap: null,
        conf: {
          center: [113.554668, 22.720674],
          resizeEnable: true,
          zooms: [3, 20],
          viewMode: '3D',
          defaultCursor: 'default',
          pitch: 45,
          mapStyle: store.state.global.themeData.mapStyle,
          expandZoomRange: true,
          rotation: 0,
          zoom: mapZoom
        }
      },
      mapZoom: mapZoom,
      layerType: ''
    }
  },
  mounted () {
    // 设置南沙区域边界
    this.$refs.map.setMapData(
      DISTRICTS,
      {
        type: 'polygon',
        fillOpacity: '0',
        strokeColor: '#b6eced',
        strokeWeight: 2
      },
      0
    )
  },

  methods: {
    setMapData (isSetView = false) {
      let self = this
      let setRoundPointLayer = (mapData) => {
        self.$refs.map.setMapData(
          mapData,
          {
            isSetView,
            type: 'roundPointLayer',
            unit: 'px',
            style: {
              radius: 3,
              color: '#3366FF',
              opacity: 1
            },
            selectStyle: {
              radius: 5
            }
          },
          2
        )
      }
      let setIconLayer = (mapData) => {
        self.$refs.map.setMapData(
          mapData,
          {
            isSetView,
            type: 'iconLayer',
            source: (obj) => {
              return `./static/mapIcon/Hotel_m_${obj.value.type}.png`
            },
            style: {
              // 默认半径单位为像素
              size: 30
            },
            selectStyle: {
              size: 26
            },
            fitView: true
          },
          2
        )
      }
      this.$refs.map.setMapData(this.mapData.heatMapData, { type: 'heatmap' }, 10)
      if (this.mapModel === 0) {
        this.$refs.map.setMapData(this.mapData.markers, { type: 'marker' }, 2)
      } else {
        setIconLayer(this.mapData.markers)
      }
    },
    // 图层点击事件
    layerClickEvent (data) {
      this.$emit('layerClickEvent', data)
    },
    zoomend (zoom) {
      this.mapZoom = zoom
    },
    /**
     *@Description:绘制事件图标
     * params:[经度，纬度]
     * 直播事件
     */
    addEventMarker (pos, data) {
      // 有事件图标对象才显示
      const content = `<transition><div class="alarm-marker animated zoomIn" onclick="mapItemClick(event)" extData=${JSON.stringify(data)}><img src="./static/mapIcon/event-alram.svg" /></div></transition>`

      let conf = {
        isSetView: true,
        content: content,
        position: pos,
        size: [30, 36],
        offset: new AMap.Pixel(-15, -18)
      }
      console.log([conf]);
      this.$refs.map.setMapData([conf], { type: 'marker' }, 4)

      // 调整视野，设置上下左右的像素避让宽度
      this.$refs.map.setZoomAndCenter(14, [pos[0], parseFloat(pos[1]) + 0.01])
    },
    /**
     * 直播事件结束调用，删除事件图标
     */
    deleteEventMarker () {
      this.$refs.map.setMapData([], { type: 'marker' }, 4)
    }
  }
}
</script>
<style lang="scss" scoped>
@import url("./GdMap/scss/marker.scss");
// @import url("./GdMap/scss/marker.scss");
.map {
  position: fixed;
  width: 100%;
  height: 100%;
  text-align: center;
  // left: 200px;
  // top: 50px;
  /*line-height: 100vh;*/
}
</style>
