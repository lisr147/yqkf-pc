<template>
  <div class="check-points-map">
    <div ref="container" class="container">

    </div>
  </div>
</template>

<script>
  import Map from "@arcgis/core/Map"
  import MapView from "@arcgis/core/views/MapView"
  import MapMethods from "@/mixins/MapMethods"
  import MapMask from "@/mixins/MapMask"
  import SETTING from "@/config/MapSetting.js"

  export default {
    name: "CheckPointsMap",
    components: {},
    mixins: [MapMethods, MapMask],
    data() {
      return {
        map: null,

        view: null,

        layerIds: [
          {id: 'boundary', visible: true},
          {id: 'dangerPeopleHeatmap-mini', visible: true},
          {id: 'detectionPoint-mini', visible: true},
        ],

        defaultCenter: [113.53361824340612, 22.71672931394762],
        //地图缩放程度
        defaultZoom: 10,

        pointData: []
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {

      initMap(){

        let BG_WX = this.createBgLayer({layerId:'bg-wx', visible: true})
        const map = new Map({
          layers: [BG_WX]
        })

        //创建2D视图
        const view = new MapView({
          container: this.$refs["container"],
          map: map,
          zoom: this.defaultZoom,
          center: this.defaultCenter,
        })

        view.ui.remove('zoom')

        view.when(() => {
          this.initLayer()
          this.$emit("layersReady")
          this.initMaskLayer({color: [27,49,117,1]})

        })

        this.map = map
        this.view = view

        // debugger
        // window._view = this.view
        // this.view.on("click", (event) => {
        //   const {latitude, longitude} = event.mapPoint
        //   console.log({latitude, longitude} )
        // })

      },

      // 初始化所有图层
      async initLayer() {
        this.layerIds.forEach(({ id, visible }) => {
          var setting = SETTING.mapLayers.find((item) => item.id == id);
          if (setting) {
            this.createFeatureLayer(setting, { visible });
          }
        })
      },

      async addToLayer(data) {
        const layer = this.map.findLayerById('detectionPoint-mini')
        const addFeatures = data.map(item => {
          return this.createGraphic(item, 'point')
        })

        const results = await layer.applyEdits({addFeatures})
        console.log(`addFeatures:${results.addFeatureResults.length}`)
      }

    }
  }
</script>

<style lang="scss" type="text/scss">
  .check-points-map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .container {
      position: relative;
      height: 100%;
    }

  }
</style>
