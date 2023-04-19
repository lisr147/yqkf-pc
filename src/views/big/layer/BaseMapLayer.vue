<template>
  <div class="base-layer">
    <div ref="container" class="container"></div>
    <!--点标记名称-->
    <div
      class="map-point-tip"
      :style="currTipStyle"
      v-show="currTip"
      v-html="currTip"
    ></div>

    <!--<div style="position: absolute; top:5em; left: 450px;">-->
    <!--<el-button @click="switchMap">切换地图</el-button>-->
    <!--</div>-->
    <slot name="popup"></slot>
  </div>
</template>

<script>
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import LayerList from "@arcgis/core/widgets/LayerList";
// import WebTileLayer from "@arcgis/core/layers/WebTileLayer";

import MapMethods from "@/mixins/MapMethods";
import MapMask from "@/mixins/MapMask";
import MapWave from "@/mixins/MapWave";
import SETTING from "@/config/MapSetting.js";
import {WMTS_Layers} from "@/config/WMTS"
import esriConfig from "@arcgis/core/config";
esriConfig.assetsPath = "./static/arcgis/assets";
esriConfig.fontsUrl= "./static/arcgis/fonts";

export default {
  name: "BaseMapLayer",
  components: {},
  mixins: [MapMask, MapMethods, MapWave],
  props: {
    layerIds: {
      type: Array,
      default: function() {
        return [
          {
            id: "boundary", //图层id
            visible: true, //图层初始状态
          },
        ];
      },
    },
    maskColor:{
      type: Array,
      default: function() {
        return [33, 48, 160, 1];
      },
    }
  },
  data() {
    return {
      view: null,

      //当前浮动贴士内容
      currTip: "",
      currTipStyle: {},

      //初始状态
      defaultCenter: [113.54735115356235, 22.78385103258788], //南沙中心
      defaultZoom: 11,

      bgMapIds: WMTS_Layers.map(v=>v.id)
    };
  },
  computed: {
    currTown() {
      return this.$store.state.common.town;
    },
  },
  watch: {
    currTown() {
      this.refreshLayers();
    },
  },
  mounted() {
    this.initMap();
  },
  methods: {
    switchMap() {
      var map = this.map;
      map.findLayerById("bg-white").visible = false;
    },

    initMap() {

      //创建地图
      const map = new Map({
        layers: this.createAllBgLayers()
        // basemap: 'topo-vector'
      });
      //创建2D视图
      const view = new MapView({
        container: this.$refs["container"],
        map: map,
        zoom: this.defaultZoom,
        center: this.defaultCenter,
      });
      view.ui.remove('zoom')

      //图层列表
      if (process.env.NODE_ENV !== "production") {
        var layerList = new LayerList({
          view: view,
        });
        view.ui.add(layerList, {
          position: "bottom-right",
        });
      }

      //view创建完成后开始监听事件
      view.when(() => {

        this.bindInteract();
        this.initLayer();
        // this.testLine()
        this.$emit("layersReady");
        this.initMaskLayer({color: this.maskColor});
      });

      this.map = map;
      this.view = view;
    },

    // 初始化所有图层
    async initLayer() {
      this.layerIds.forEach(({ id, visible }) => {
        //获取图层配置
        var setting = SETTING.mapLayers.find((item) => item.id == id);
        //创建图层
        if (setting) {
          this.createFeatureLayer(setting, { visible });
        }
      });
    },

    /**
     * 更新所有图层
     **/
    refreshLayers() {
      console.log("更新图层", this.map.layers);
      this.map.layers.forEach(async (layer) => {
        if (
          [
            ...this.bgMapIds,
            "maskLayer",
            "markerLayer",
            "waveLayer",
          ].includes(layer.id)
        ) {
          //不处理
          return;
        }

        //获取图层配置
        const { getData, layerType } = SETTING.mapLayers.find(
          (item) => item.id == layer.id
        );

        // 获取待清除的图层要素id
        const ObjectIds = await layer.queryObjectIds();
        const deleteFeatures = ObjectIds.map((v) => {
          return { objectId: v };
        });

        // 获取待添加的图层要素
        const data = await getData({}, { commitCount: true });
        const addFeatures = data.map((item) => {
          return this.createGraphic(item, layerType);
        });

        //执行更新
        const results = await layer.applyEdits({ deleteFeatures, addFeatures });
        // console.log(`layer ${layer.id },deleteFeatures: ${results.deleteFeatureResults.length}; addFeatures:${results.addFeatureResults.length}`)
      });
    },

    //显示指定图层，隐藏其他图层
    //特殊图层如boundary 永远不会被隐藏
    toggleLayers(ids = []) {
      this.map.layers.forEach((layer) => {
        const id = layer.id;
        if (
          [
            ...this.bgMapIds,
            "boundary",
            "grid",
            "maskLayer",
            "event-alarm",
            "waveLayer",
          ].includes(id)
        ) {
          //不处理
        } else if (ids.includes(id)) {
          layer.visible = true;
        } else {
          layer.visible = false;
        }
      });
    },

    // 切换底图，显示指定id的底图
    switchByLayer(curId) {
      const arr = this.bgMapIds
      arr.forEach((id) => {
        this.map.findLayerById(id).visible = curId == id;
      });
    },

    //显示隐藏单个图层
    toggleOneLayer(id, visible) {
      const layer = this.map.findLayerById(id);
      if (layer) {
        layer.visible = visible;
      }
    },

    //绑定鼠标交互
    bindInteract() {
      console.log(`bindInteract`);
      var t = this;
      this.view.on("click", (event) => {
        //必须阻止事件冒泡,popup才不会出现
        event.stopPropagation();

        console.log(event);

        this.view.hitTest(event).then((res) => {
          if (res.results.length == 0) {
            this.$emit("layerClicked", {});
            return;
          }

          //碰撞到遮罩区域，不予处理
          if (t.isHitMask(res.results)) {
            return;
          }

          //过滤掉与业务图层无关的覆盖物
          const results = res.results.filter((v) => {
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
            event,
            target: results[0],
          });
        });
      });

      //鼠标悬浮时 多边形高亮
      var highlight = null;
      this.view.on("pointer-move", (event) => {
        this.view.hitTest(event).then((res) => {
          //碰撞到遮罩区域，不予处理
          if (t.isHitMask(res.results)) {
            if (highlight) {
              highlight.remove();
            }
            return;
          }

          //过滤掉与业务图层无关的覆盖物
          const results = res.results.filter((v) => {
            return v.graphic && v.graphic.sourceLayer;
          });
          const graphic = results.length ? results[0].graphic : null;

          if (!graphic) {
            if (highlight) {
              highlight.remove();
            }
            this.currTip = "";
            return;
          }

          //指定某些图层不做交互
          if (
            graphic &&
            graphic.sourceLayer &&
            ["boundary"].includes(graphic.sourceLayer.id) &&
            this.currTown
          ) {
            return;
          }

          //悬浮显示名称
          if (["grid", "keyPlaces"].includes(graphic.sourceLayer.id)) {
            const { tip } = graphic.attributes;
            this.currTip = tip || "未知名称";
            const { x, y } = event;
            this.currTipStyle = { top: y + 15 + "px", left: x + 15 + "px" };
          } else {
            this.currTip = "";
          }

          //仅多边形悬浮出现高亮效果
          if (
            graphic &&
            graphic.geometry &&
            ["polygon", "point"].includes(graphic.geometry.type)
          ) {
            if (highlight) {
              highlight.remove();
            }
            this.view.whenLayerView(graphic.layer).then((layerView) => {
              highlight = layerView.highlight(graphic);
            });
          } else {
            if (highlight) {
              highlight.remove();
            }
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" type="text/scss">
.base-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1d5d8c;

  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .map-point-tip {
    position: absolute;
    top: -9999px;
    left: -9999px;
    padding: 0.4em;
    border-radius: 4px;
    background-color: #0f286a;
    transition: all 0.3s;
    color: #fff;
    font-size: 14px;
    max-width: 220px;
  }
}
</style>
