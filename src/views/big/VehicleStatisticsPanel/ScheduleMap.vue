<template>
  <div class="schedule-map">
    <div class="container" ref="container"></div>
  </div>
</template>

<script>
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

import MapMethods from "@/mixins/MapMethods";
import SETTING from "@/config/MapSetting.js";

export default {
  name: "ScheduleMap",
  components: {},
  mixins: [MapMethods],
  data() {
    return {
      layerIds: [],
      map: null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      let BG_BLACK = this.createBgLayer({ layerId: "bg-black", visible: true });
      //创建地图
      const map = new Map({
        layers: [BG_BLACK]
      });
      //创建2D视图
      const view = new MapView({
        container: this.$refs["container"],
        map: map,
        zoom: 11,
        center: [113.45576980895618, 22.822304499637983] //南沙
      });

      //view创建完成后开始监听事件
      view.when(() => {
        this.bindInteract();
        this.initLayer();

        this.$emit("layersReady");
      });

      this.view = view;
      this.map = map;
    },

    bindInteract() {
      this.view.on("click", event => {
        //必须阻止事件冒泡,popup才不会出现
        // event.stopPropagation()

        console.log(event);

        this.view.hitTest(event).then(res => {
          //过滤掉与业务图层无关的覆盖物
          const results = res.results.filter(v => {
            return v.graphic && v.graphic.sourceLayer;
          });
          if (
            !results.length ||
            !results[0].graphic ||
            results[0].graphic.attributes.cluster_count
          ) {
            return;
          }
          //派发事件
          const { sourceLayer, attributes } = results[0].graphic;

          console.log({ layerId: sourceLayer.id, attributes });
          this.$emit("layerClicked", {
            layerId: sourceLayer.id,
            attributes,
            event
          });
        });
      });
    },

    initLayer() {
      var arr = ["boundary", "vehicle-car", "vehicle-hospital"];

      arr.forEach(id => {
        //获取图层配置
        var setting = SETTING.mapLayers.find(item => item.id == id);
        //创建图层
        if (setting) {
          this.createFeatureLayer(setting, true, "GD");
        }
      });
    }
  }
};
</script>

<style lang="scss" type="text/scss">
.schedule-map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
