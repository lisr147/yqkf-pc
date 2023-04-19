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
  </div>
</template>

<script>
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import LayerList from "@arcgis/core/widgets/LayerList";
//   import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import MapMethods from "@/mixins/MapMethods";
import MapRange from "@/mixins/MapRange";
import MapMask from "@/mixins/MapMask";
import SETTING from "@/config/MapSetting.js";

import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";

// import Geometry from "@arcgis/core/geometry/Geometry";
import Draw from "@arcgis/core/views/draw/Draw";
import Circle from "@arcgis/core/geometry/Circle";

import { WMTS_Layers } from "@/config/WMTS";

const WKID = undefined;

import esriConfig from "@arcgis/core/config";
esriConfig.assetsPath = "./static/arcgis/assets";
esriConfig.fontsUrl = "./static/arcgis/fonts";

export default {
  name: "SealMapLayer",
  components: {},
  mixins: [MapMethods, MapMask, MapRange],
  props: {
    layerIds: {
      type: Array,
      default: function () {
        return [
          {
            id: "boundary", //图层id
            visible: true, //图层初始状态
          },
        ];
      },
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
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

      drawLayer: null,
      polygonEditor: null,

      bgMapIds: WMTS_Layers.find((v) => v.id),
    };
  },
  computed: {
    currSealArea() {
      return this.$store.state.common.sealarea;
    },
  },
  watch: {
    currSealArea() {
      // this.refreshLayers()
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
        //创建底图
        layers: this.createAllBgLayers(),
      });
      //创建2D视图
      const view = new MapView({
        container: this.$refs["container"],
        map: map,
        zoom: this.defaultZoom,
        center: this.defaultCenter,
        spatialReference: WKID,
      });
      view.ui.remove("zoom");

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
        this.initMaskLayer();

        //初始化多边形编辑功能
        this.initDrawLayer();
        this.initEdit();

        this.$emit("layersReady");
      });

      this.map = map;
      this.view = view;
    },

    //创建一次绘制行为
    initDraw() {
      const view = this.view;
      const drawLayer = this.drawLayer;

      let draw = new Draw({
        view: view,
      });

      let action = draw.create("polygon", { mode: "click" });

      // PolygonDrawAction.vertex-add
      // Fires when user clicks, or presses the "F" key.
      // Can also be triggered when the "R" key is pressed to redo.
      action.on("vertex-add", function (evt) {
        createPolygonGraphic(evt.vertices);
      });

      // PolygonDrawAction.vertex-remove
      // Fires when the "Z" key is pressed to undo the last added vertex
      action.on("vertex-remove", function (evt) {
        createPolygonGraphic(evt.vertices);
      });

      // Fires when the pointer moves over the view
      action.on("cursor-update", function (evt) {
        createPolygonGraphic(evt.vertices);
      });

      // Add a graphic representing the completed polygon
      // when user double-clicks on the view or presses the "C" key
      action.on("draw-complete", (evt) => {
        createPolygonGraphic(evt.vertices);
        this.$emit("drawComplete");
      });

      function createPolygonGraphic(vertices) {
        //该操作会引起SketchViewModel报错
        drawLayer.removeAll();

        let polygon = {
          type: "polygon",
          rings: vertices,
          spatialReference: view.spatialReference,
        };

        let graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: "simple-fill",
            color: [92, 143, 255, 0.8],
            outline: {
              width: 2,
              color: "#fff",
              style: "dash",
            },
          },
        });
        drawLayer.add(graphic);
      }
    },

    //区域编辑功能
    initEdit() {
      let t = this;

      let sketchViewModel = new SketchViewModel({
        view: this.view,
        layer: this.drawLayer,
        updateOnGraphicClick: false,
        defaultUpdateOptions: {
          toggleToolOnClick: true, //点击则更新编辑方式
        },
      });
      this.polygonEditor = sketchViewModel;

      sketchViewModel.on(["update", "undo", "redo"], onGraphicUpdate);

      function onGraphicUpdate(event) {
        const graphic = event.graphics[0];
        const { toolEventInfo } = event;

        if (
          toolEventInfo &&
          [
            "move-stop",
            "refresh-stop",
            "reshape-stop",
            "scale-stop",
            "vertex-remove",
          ].includes(toolEventInfo.type)
        ) {
          t.$emit("editStop");
          sketchViewModel.complete();
        } else if (event.state == "complete") {
          sketchViewModel.update([graphic], { tool: "reshape" });
        }
      }

      //点击元素时触发编辑
      this.view.on("click", (event) => {
        if (sketchViewModel.state == "active") {
          return;
        }
        this.view.hitTest(event).then((res) => {
          if (!res.results[0]) {
            return;
          }

          const { graphic } = res.results[0];

          if (graphic.layer == sketchViewModel.layer) {
            sketchViewModel.update([graphic], { tool: "reshape" });
          }
        });
      });
    },

    //区域绘制图层
    initDrawLayer() {
      const layer = new GraphicsLayer({
        id: "drawLayer",
        title: "绘制图层",
        visible: true,
      });
      this.map.add(layer);
      this.drawLayer = layer;
    },

    //清空区域绘制图层
    clearDrawLayer() {
      if (this.polygonEditor) {
        this.polygonEditor.cancel();
      }
      // this.drawLayer.removeMany(this.drawLayer.graphics)
      this.drawLayer.removeAll();
    },

    addDrawFeature(geo) {
      let graphic = new Graphic({
        geometry: geo,
        symbol: {
          type: "simple-fill",
          color: [92, 143, 255, 0.8],
          outline: {
            width: 2,
            color: "#fff",
            style: "dash",
          },
        },
      });

      this.drawLayer.add(graphic);

      //图形开启编辑模式
      this.polygonEditor.update([graphic], { tool: "reshape" });
    },

    //获取当前编辑的区域polygon
    //遍历geometries判断是否在polygon里面
    //有则一同返回
    getDrawFeature({ geometries }) {
      const currGraphic = this.drawLayer.graphics.items[0];
      if (!currGraphic) {
        return {
          polygon: [],
          area: 0,
        };
      }

      //墨卡托格式坐标转换成地理坐标
      const currGeometry = webMercatorUtils.webMercatorToGeographic(
        currGraphic.geometry
      );

      const innerArr = [];
      let area = geometryEngine.geodesicArea(currGeometry, "square-meters");
      let subArea = 0;

      geometries.forEach((item) => {
        //判断是否在当前编辑的区域内
        let isWithin = geometryEngine.within(item, currGeometry);
        if (isWithin) {
          subArea += Math.abs(
            geometryEngine.geodesicArea(item, "square-meters")
          );
          innerArr.push(item.rings[0]);
        }
      });

      return {
        polygon: [...currGeometry.rings, ...innerArr],
        area: Math.abs(area) - subArea,
      };
    },

    //获取与当前绘制区域相交的多边形数据
    getIntersectPolygon({ features }) {
      const currGraphic = this.drawLayer.graphics.items[0];
      if (!currGraphic) {
        return [];
      }

      //墨卡托格式坐标转换成地理坐标
      const currGeometry = webMercatorUtils.webMercatorToGeographic(
        currGraphic.geometry
      );

      const res = [];
      features.forEach((item) => {
        const { attributes, geometry } = item;
        if (geometryEngine.intersects(currGeometry, geometry)) {
          console.log(attributes.name);
          res.push(attributes);
        }
      });

      return res;
    },

    //创建一个默认的区域多边形
    addDefaultFeature() {
      const { x, y, latitude, longitude } = this.view.center;

      const circle = new Circle({
        type: "Circle",
        center: [longitude, latitude],
        numberOfPoints: 15,
        radius: 0.5,
        radiusUnit: "kilometers",
        geodesic: true,
      });

      let graphic = new Graphic({
        geometry: {
          type: "polygon",
          rings: circle.rings,
        },
        symbol: {
          type: "simple-fill",
          color: [92, 143, 255, 0.8],
          outline: {
            width: 2,
            color: "#fff",
            style: "dash",
          },
        },
      });

      //添加图形到图层
      this.drawLayer.add(graphic);

      //图形开启编辑模式
      this.polygonEditor.update([graphic], { tool: "reshape" });
    },

    //根据镇街生成区域
    // addTownFeature(townName){
    //
    //   let {coordinates} = DISTRICTS.find(v=>v.name == townName)
    //
    //   let graphic = new Graphic({
    //     geometry: webMercatorUtils.geographicToWebMercator({
    //       type: 'polygon',
    //       rings: [coordinates],
    //       spatialReference: WKID
    //     }),
    //     symbol: {
    //       type: "simple-fill",
    //       color: [92, 143, 255, 0.8],
    //       outline: {
    //         width: 2,
    //         color: "#fff",
    //         style: 'dash'
    //       }
    //     },
    //
    //   })
    //
    //   //添加图形到图层
    //   this.drawLayer.add(graphic)
    //
    //   //图形开启编辑模式
    //   this.polygonEditor.update([graphic], {tool: 'reshape'})
    //
    // },

    // 初始化所有图层
    async initLayer() {
      this.layerIds.forEach(({ id, visible }) => {
        //获取图层配置
        var setting = SETTING.mapLayers.find((item) => item.id == id);
        //创建图层
        if (setting) {
          this.createFeatureLayer(setting, { visible }, "GD");
        }
      });
    },

    /**
     * 更新所有图层
     **/
    refreshLayers() {
      this.map.layers.forEach(async (layer) => {
        if (
          [
            ...this.bgMapIds,
            "maskLayer",
            "boundary",
            "grid",
            "markerLayer",
            "seal-area2",
            "drawLayer",
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
        console.log(
          `layer ${layer.id},deleteFeatures: ${results.deleteFeatureResults.length}; addFeatures:${results.addFeatureResults.length}`
        );
      });
    },

    //更新单个图层
    async refreshLayer({ id }) {
      //获取图层配置
      const setting = SETTING.mapLayers.find((item) => item.id == id);

      if (!setting) {
        console.error(`图层${id} 缺少方法getData`);
        return;
      }

      const layer = this.getLayerById(id);
      const { getData, layerType } = setting;

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
      console.log(
        `layer ${layer.id},deleteFeatures: ${results.deleteFeatureResults.length}; addFeatures:${results.addFeatureResults.length}`
      );
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
            "seal-area",
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
      const arr = WMTS_Layers.map((v) => v.id);
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

    isHitMask(arr) {
      if (arr.length && arr[0].graphic && arr[0].graphic.hit) {
        return true;
      } else {
        return false;
      }
    },

    //绑定鼠标交互
    bindInteract() {
      this.view.on("click", (event) => {
        this.$emit("layerClicked");

        //必须阻止事件冒泡,popup才不会出现
        event.stopPropagation();

        console.log(event);

        this.view
          .hitTest(event)
          .then((res) => {
            //碰撞到遮罩区域，不予处理
            if (this.isHitMask(res.results)) {
              return;
            }

            ///过滤掉与业务图层无关的覆盖物
            const results = res.results
              .filter((v) => {
                return v.graphic && v.graphic.sourceLayer;
              })
              .sort((a, b) => {
                return (
                  a.graphic?.attributes?.order - b.graphic?.attributes?.order
                );
              });
            console.log(results);

            if (results.length <= 0) {
              return;
            }

            //派发事件
            const { sourceLayer, attributes } = results[0].graphic;

            if (sourceLayer) {
              console.log({ layerId: sourceLayer.id, attributes });
              this.$emit("layerClicked", {
                layerId: sourceLayer.id,
                attributes,
                event,
                target: results[0],
              });
            }

            //取消悬浮
            if (!["diagnose-trace", "dispatch-person"].includes(sourceLayer)) {
              this.currTip = "";
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });

      //鼠标悬浮时 多边形高亮
      var highlight = null;
      this.view.on("pointer-move", (event) => {
        if (this.isEditing) {
          if (highlight) {
            highlight.remove();
          }
          return;
        }

        this.view.hitTest(event).then((res) => {
          //碰撞到遮罩区域，不予处理
          if (this.isHitMask(res.results)) {
            if (highlight) {
              highlight.remove();
            }
            return;
          }

          //过滤掉与业务图层无关的覆盖物
          const results = res.results
            .filter((v) => {
              return v.graphic && v.graphic.sourceLayer;
            })
            .sort((a, b) => {
              return (
                a.graphic?.attributes?.order - b.graphic?.attributes?.order
              );
            });

          const graphic = results.length ? results[0].graphic : null;

          if (!graphic) {
            if (highlight) {
              highlight.remove();
            }
            this.currTip = "";
            return;
          }

          //如果是boundary，不派发
          if (graphic && ["boundary"].includes(graphic.sourceLayer.id)) {
            if (highlight) {
              highlight.remove();
            }
            return;
          }

          //悬浮显示名称
          if (
            ["diagnose-trace", "dispatch-person"].includes(
              graphic.sourceLayer.id
            )
          ) {
            const { tip } = graphic.attributes;
            this.currTip = tip || "";
            const { x, y } = event;
            this.currTipStyle = { top: y + 15 + "px", left: x + 15 + "px" };
          } else {
            this.currTip = "";
          }

          //仅多边形悬浮出现高亮效果
          if (
            graphic &&
            graphic.geometry &&
            ["polygon"].includes(graphic.geometry.type)
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
    max-width: 260px;
  }
}
</style>
