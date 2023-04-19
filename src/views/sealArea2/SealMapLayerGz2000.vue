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

    <!--城中村详情弹窗-->
    <UrbanVillagesDetail
      v-if="showTabDetail"
      :tabsAllData="tabsAllData"
      :tabsArr="tabsArr"
      @close="showTabDetail = false"
    />
  </div>
</template>

<script>
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import LayerList from "@arcgis/core/widgets/LayerList";
import MapMethods from "@/mixins/MapMethods";
import Point from "@arcgis/core/geometry/Point";
import MapMask from "@/mixins/MapMask";
// import MapRange from "@/mixins/MapRange";
// import TablePage from "zkzc-table-page";
import TileLayer from "@arcgis/core/layers/TileLayer";

import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

import SETTING from "@/config/MapSetting.js";

import { WMTS_Layers, GZ2000 } from "@/config/WMTS";
// import Circle from "@arcgis/core/geometry/Circle";
import axios from "axios";

import UrbanVillagesDetail from "./UrbanVillagesDetail";

import esriConfig from "@arcgis/core/config";
import yqfkArcgisUrls from "./yqfkArcgisUrls.js";
import Sketch from "./sketch.js";
esriConfig.assetsPath = "./static/arcgis/assets";
esriConfig.fontsUrl = "./static/arcgis/fonts";

export default {
  name: "SealMapLayerGz2000",
  components: { UrbanVillagesDetail },
  mixins: [MapMask, MapMethods, Sketch],
  props: {
    layerIds: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const centerPoint = new Point({
      x: 54810.07389911926,
      y: 192729.84924644174,
      spatialReference: { wkt: GZ2000.wkt }
    });
    return {
      //  城中村弹窗
      showTabDetail: false,
      tabsArr: [],
      tabsAllData: {
        publicFaciData: {
          // 公用设施
          selection: false,
          columnFunctionsWidth: 60,
          tableData: [],
          tableKeys: []
        },
        serveFaciData: {
          // 服务设施
          selection: false,
          columnFunctionsWidth: 60,
          tableData: [],
          tableKeys: []
        },
        KeyPlaceData: {
          // 重点场所
          selection: false,
          columnFunctionsWidth: 60,
          tableData: [],
          tableKeys: []
        },
        cityPartsData: {
          // 城市部件
          selection: false,
          columnFunctionsWidth: 60,
          tableData: [],
          tableKeys: []
        },
        peopleData: {} // 楼栋人员信息
      },
      view: null,
      ma: null,

      //当前浮动贴士内容
      currTip: "",
      currTipStyle: {},

      //初始状态
      defaultCenter: centerPoint, //南沙中心
      defaultZoom: 1,



      bgMapIds: WMTS_Layers.find(v => v.id),
      peopleData: null,
      showPeopleChart: false,
      showPeopleDialog: false,

      maskInit: null, //镇街用户默认的MASK
      draging: false //地图拖动中
    };
  },
  computed: {
    currGz2000layers() {
      return this.$store.state.common.currGz2000layers;
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    showDetail() {
      this.showPeopleChart = false;
      this.showPeopleDialog = true;
    },
    getRootPath(withSzg = false) {
      if (process.env.NODE_ENV !== "production") {
        return "";
      }
      const arr = location.pathname.split("/szg");
      return (arr[0].length > 1 ? arr[0] : "") + (withSzg ? "/szg" : "");
    },

    initMap() {
      //南沙区卫星地图
      let layerNSWX = new TileLayer({
        url: yqfkArcgisUrls.NSWX,
        title: "南沙区卫星影像地图",
        id: "gz-nswx",
        // SpatialReference: { wkt: GZ2000.wkt }
      });
    // let layerNSWX = new MapImageLayer({
    //     url: yqfkArcgisUrls.NSWX,
    //     title: "南沙区卫星影像地图",
    //     id: "gz-nswx",
    //   });

      //   暂时隐藏城规院的网格层
      let layerWG = new MapImageLayer({
        url: yqfkArcgisUrls.WG,
        title: "网格范围",
        id: "gz-wg",
        opacity: 1,
        visible: false
      });
      //疫情防控影像图
      let layerLWDT = new TileLayer({
        url: yqfkArcgisUrls.LWDT,
        title: "防疫系统路网底图",
        id: "gz-yq",
        opacity: 1,
        visible: false
      });

      let layerCJ = new TileLayer({
        url: yqfkArcgisUrls.CJ,
        title: "村界",
        id: "gz-cj",
        opacity: 1,
        visible: false
      });

      //   // 小区
      //   let layerXQ = new MapImageLayer({
      //     url: yqfkArcgisUrls.NSQXQ,
      //     title: "南沙区小区范围",
      //     id: "house-gz2000",
      //     opacity: 1,
      //     visible: false,
      //   });
      //   // 河流
      //   let layerHL = new MapImageLayer({
      //     url: yqfkArcgisUrls.HL,
      //     title: "南沙区河流水系",
      //     id: "rivers-gz2000",
      //     opacity: 1,
      //     visible: false,
      //   });

      //   // 路网
      //   let layerLW = new MapImageLayer({
      //     url: yqfkArcgisUrls.JCLW,
      //     title: "南沙区基础路网",
      //     id: "road-gz2000",
      //     opacity: 1,
      //     visible: false,
      //   });

      let layerFW = new MapImageLayer({
        url: yqfkArcgisUrls.FW,
        title: "全区房屋面",
        id: "gz-fw",
        opacity: 1,
        visible: false
      });

      let layerFWPep = new MapImageLayer({
        url: yqfkArcgisUrls.FWPep,
        title: "全区房屋人口",
        id: "gz-fwp",
        opacity: 1,
        visible: false
      });
      let layerVolunteer = new MapImageLayer({
        url: yqfkArcgisUrls.DY,
        title: "党员志愿者",
        id: "gz-dyzyzfw",
        opacity: 1,
        visible: false
      });
      let layerTSRQ = new MapImageLayer({
        url: yqfkArcgisUrls.TSRQ,
        title: "特殊人群",
        id: "tsrq",
        opacity: 1,
        visible: false
      });
      let layerYYWSZX = new MapImageLayer({
        url: yqfkArcgisUrls.YYWSZX,
        title: "医院卫生中心",
        id: "yywszx",
        opacity: 1,
        visible: false
      });
      let layer3DMAP = new MapImageLayer({
        url: yqfkArcgisUrls.SWDTD,
        title: "金洲村三维地图点",
        id: "gz-jzcswdt",
        opacity: 1,
        visible: false
      });

      let layerGGFWSS = new MapImageLayer({
        url: yqfkArcgisUrls.GGFWSS,
        title: "金洲村公共服务设施",
        id: "gz-ggfwss",
        opacity: 1,
        visible: false
      });
      // let layerSZGYSS = new MapImageLayer({
      //   url: yqfkArcgisUrls.SZGYSS,
      //   title: "金洲村市政公用设施",
      //   id: "gz-szgyss",
      //   opacity: 1,
      //   visible: false,
      // });
      let layerCZCZDCS = new MapImageLayer({
        url: yqfkArcgisUrls.CZCZDCS,
        title: "城中村重点场所",
        id: "gz-czczdcs",
        opacity: 1,
        visible: false
      });
      let layerCZCSP = new MapImageLayer({
        url: yqfkArcgisUrls.CZCSP,
        title: "城中村商铺",
        id: "gz-czcsp",
        opacity: 1,
        visible: false
      });

      let layerCITYSSJG = new MapImageLayer({
        url: yqfkArcgisUrls.SSJG,
        title: "上水井盖",
        id: "city-ssjg",
        opacity: 1,
        visible: false
      });
      let layerCITYGDJG = new MapImageLayer({
        url: yqfkArcgisUrls.GDJG,
        title: "供电井盖",
        id: "city-gdjg",
        opacity: 1,
        visible: false
      });
      let layerCITYGGCS = new MapImageLayer({
        url: yqfkArcgisUrls.GGCS,
        title: "公共厕所",
        id: "city-ggcs",
        opacity: 1,
        visible: false
      });
      let layerCITYLJSJD = new MapImageLayer({
        url: yqfkArcgisUrls.LJSJD,
        title: "垃圾收集点",
        id: "city-ljsjd",
        opacity: 1,
        visible: false
      });
      let layerCITYSZXHX = new MapImageLayer({
        url: yqfkArcgisUrls.SZXHX,
        title: "市政消火栓",
        id: "city-szxhx",
        opacity: 1,
        visible: false
      });
      let layerCITYWXXFZ = new MapImageLayer({
        url: yqfkArcgisUrls.WXXFZ,
        title: "微型消防站",
        id: "city-wxxfz",
        opacity: 1,
        visible: false
      });
      let layerCITYPSJG = new MapImageLayer({
        url: yqfkArcgisUrls.PSJG,
        title: "排水井盖",
        id: "city-psjg",
        opacity: 1,
        visible: false
      });
      let layerCITYZMSS = new MapImageLayer({
        url: yqfkArcgisUrls.ZMSS,
        title: "照明设施",
        id: "city-zmss",
        opacity: 1,
        visible: false
      });
      let layerCITYJKDZY = new MapImageLayer({
        url: yqfkArcgisUrls.JKDZY,
        title: "监控电子眼",
        id: "city-jkdzy",
        opacity: 1,
        visible: false
      });
      let layerCITYJSD = new MapImageLayer({
        url: yqfkArcgisUrls.JSD,
        title: "积水点",
        id: "city-jsd",
        opacity: 1,
        visible: false
      });
      //创建地图
      const map = new Map({
        layers: [
          layerNSWX,
          layerLWDT,
          // layerXQ,layerHL,layerLW,
          layerWG,
          layerCJ,
          layer3DMAP,
          layerFW,
          layerFWPep,
          layerGGFWSS,
          // layerSZGYSS,
          layerCZCZDCS,
          layerCZCSP,
          layerCITYSSJG,
          layerCITYGDJG,
          layerCITYGGCS,
          layerCITYLJSJD,
          layerCITYSZXHX,
          layerCITYWXXFZ,
          layerCITYPSJG,
          layerCITYZMSS,
          layerCITYJKDZY,
          layerCITYJSD,
          layerVolunteer,
          layerTSRQ,
          layerYYWSZX
        ]
      });

      //创建2D视图
      const view = new MapView({
        map: map,
        container: this.$refs["container"],
        //初始范围，会覆盖 center scale zoom
        // center: this.defaultCenter,
        center: this.defaultCenter,
        // zoom: 2,
        background: {
          color: "#2130a0"
        },
        constraints: {
          minScale: 500000, // User cannot zoom out beyond a scale of 1:500,000
          maxScale: 0 // User can overzoom tiles
          // snapToZoom: false,
        },
        highlightOptions: {
          fillOpacity: 0
        }
      });

      /*
        城规院的南沙底图不能使用SCENEVIEW
        原因是自定义的城市坐标系（spatialReference），不在arcgis内置坐标系列表内
        无法把2D的底图投影在对应的位置上，保证底图不形变
        @HUANGGUANGCONG 2022/11/8
    */
      view.ui.remove("zoom");

      //图层列表
      if (
        process.env.NODE_ENV !== "production" ||
        location.search.includes("debug")
      ) {
        var layerList = new LayerList({
          view: view
        });
        view.ui.add(layerList, {
          position: "bottom-right"
        });
      }

      //view创建完成后开始监听事件
      view.when(() => {
        this.bindInteract();
        this.initLayer();
        //初始化多边形编辑功能
        this.initDrawMethod()
        this.$emit("layersReady");
      });

      this.map = map;
      this.view = view;
    },

    // 初始化所有图层
    async initLayer() {
      this.layerIds.forEach(({ id, visible }) => {
        //获取图层配置
        var setting = SETTING.mapLayers.find(item => item.id == id);
        //创建图层
        if (setting) {
          this.createFeatureLayer(setting, { visible }, "GZ2000");
        }
      });
    },

    /**
     * 更新所有图层
     **/
    refreshLayers() {
      this.map.layers.forEach(async layer => {
        if (
          [
            ...this.bgMapIds,
            "maskLayer",
            "boundary",
            "grid",
            "markerLayer",
            "seal-area2",
            "drawLayer"
          ].includes(layer.id)
        ) {
          //不处理
          return;
        }

        //获取图层配置
        const { getData, layerType } = SETTING.mapLayers.find(
          item => item.id == layer.id
        );

        // 获取待清除的图层要素id
        const ObjectIds = await layer.queryObjectIds();
        const deleteFeatures = ObjectIds.map(v => {
          return { objectId: v };
        });

        // 获取待添加的图层要素
        const data = await getData(
          {
            mapType: "GZ2000"
          },
          { commitCount: true }
        );
        const addFeatures = data.map(item => {
          return this.createGraphic(item, layerType, { wkt: GZ2000.wkt });
        });

        //执行更新
        // const results =
        await layer.applyEdits({ deleteFeatures, addFeatures });
        // console.log(
        //   `layer ${layer.id},deleteFeatures: ${results.deleteFeatureResults.length}; addFeatures:${results.addFeatureResults.length}`
        // );
      });
    },

    //更新单个图层
    async refreshLayer({ id }) {
      //获取图层配置
      const setting = SETTING.mapLayers.find(item => item.id == id);

      if (!setting) {
        console.error(`图层${id} 缺少方法getData`);
        return;
      }

      const layer = this.getLayerById(id);
      const { getData, layerType } = setting;

      // 获取待清除的图层要素id
      const ObjectIds = await layer.queryObjectIds();
      const deleteFeatures = ObjectIds.map(v => {
        return { objectId: v };
      });

      // 获取待添加的图层要素
      const data = await getData(
        {
          mapType: "GZ2000"
        },
        { commitCount: true }
      );
      const addFeatures = data.map(item => {
        return this.createGraphic(item, layerType, { wkt: GZ2000.wkt });
      });

      //执行更新
      //   const results =
      await layer.applyEdits({ deleteFeatures, addFeatures });
      //   console.log(
      //     `layer ${layer.id},deleteFeatures: ${results.deleteFeatureResults.length}; addFeatures:${results.addFeatureResults.length}`
      //   );
    },

    //显示指定图层，隐藏其他图层
    //特殊图层如boundary 永远不会被隐藏
    toggleLayers(ids = []) {
      this.map.layers.forEach(layer => {
        const id = layer.id;
        if (
          [
            ...this.bgMapIds,
            "boundary",
            "grid",
            "maskLayer",
            "seal-area"
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
      const arr = WMTS_Layers.map(v => v.id);
      arr.forEach(id => {
        this.view.map.findLayerById(id).visible = curId == id;
      });
    },

    //显示隐藏单个图层
    toggleOneLayer(id, visible) {
      const layer = this.map.findLayerById(id);
      if (layer) {
        layer.visible = visible;
      }
    },

    //显示隐藏过滤多个图层
    hideLayers(ids) {
      this.map.layers.forEach(layer => {
        if (ids.includes(layer.id)) layer.visible = false;
      });
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
      this.view.on("click", async event => {
        // 编辑区域事件
        this.editLayerClick(event);

        //必须阻止事件冒泡,popup才不会出现
        event.stopPropagation();
        // this.$emit("layerClicked");
        this.tabsArr = [];
        this.tabsAllData = this.$options.data().tabsAllData;
        this.showTabDetail = false;
        const res = await this.view.hitTest(event);
        //   .then((res) => {
        //碰撞到遮罩区域，不予处理
        if (this.isHitMask(res.results)) {
          //   this.$emit("layerClicked", {
          //     event
          //   });
          return;
        }
        ///过滤掉与业务图层无关的覆盖物
        const results = res.results
          .filter(v => {
            return v.graphic && v.graphic.sourceLayer;
          })
          .sort((a, b) => {
            return a.graphic?.attributes?.order - b.graphic?.attributes?.order;
          });
        if (
          results.length <= 0 ||
          results[0].graphic.sourceLayer.id === "boundary"
        ) {
          this.getMapLayerData(event);
          this.$emit("layerClicked", {
            event
          });
          return;
        }
        //派发事件
        const { sourceLayer, attributes } = results[0].graphic;
        // console.log("sourceLayer");
        if (sourceLayer) {
          //   console.log({ layerId: sourceLayer.id, attributes });
          if (sourceLayer.id === "jinzhou-UAV") {
            return this.$emit(
              "show3dMap",
              "https://www.720yun.com/t/80vk6yrypfh?scene_id=102421634"
            );
          }
          this.$emit("layerClicked", {
            layerId: sourceLayer.id,
            attributes,
            event,
            target: results[0]
          });
        } else {
          this.$emit("layerClicked", {
            event
          });
        }
        // 2022-10-31 只响应镇街、网格、村居三个图层 HGC
        if (
          [
            "grid-gz2000",
            "street-gz2000",
            "village-gz2000"
            // 'rivers-gz2000',
            // 'road-gz2000',
            // 'houseEstate-gz2000',
            // 'building-gz2000'
          ].includes(sourceLayer.id)
        ) {
          this.layerMask(sourceLayer, attributes, results);
        }

        //取消悬浮
        if (
          !["diagnose-trace", "dispatch-person", "jinzhou-UAV"].includes(
            sourceLayer
          )
        ) {
          this.currTip = "";
        }
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //   });
      });

      this.view.on("drag", event => {
        // console.log('map view drag',event)
        if (event.action === "start") {
          this.draging = true;
        }
        if (event.action === "end") {
          this.draging = false;
        }
      });

      //鼠标悬浮时 多边形高亮
      var highlight = null;
      this.view.on("pointer-move", event => {
        if (this.draging) {
          return;
        }
        if (this.isEditing) {
          if (highlight) {
            highlight.remove();
          }
          return;
        }

        this.view.hitTest(event).then(res => {
          //碰撞到遮罩区域，不予处理
          if (this.isHitMask(res.results)) {
            if (highlight) {
              highlight.remove();
            }
            return;
          }

          //过滤掉与业务图层无关的覆盖物
          const results = res.results
            .filter(v => {
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
            // ["diagnose-trace", "dispatch-person"].includes(
            //   graphic.sourceLayer.id
            // )
            graphic.attributes.showTip
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
            this.view.whenLayerView(graphic.layer).then(layerView => {
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

    // 点击镇街、村居、网格时进行遮罩
    async layerMask(sourceLayer, attributes, results, streetInit = false) {
      if (streetInit) {
        this.maskInit = {
          sourceLayer,
          attributes,
          results
        };
      }

      const street = attributes.street;
      //   console.log("点击遮罩图层", street, sourceLayer, attributes, results[0]);

      this.maskToGz2000(results[0].graphic);
      if (!streetInit) {
        this.$emit("layerEvent", {
          type: "gird"
        });
      }

      //   过滤三个图层所属镇街
      const filterCode = `street='${street}'`;
      this.filterDataInLayer({
        id: "street-gz2000",
        filterCode
      });
      this.filterDataInLayer({
        id: "village-gz2000",
        filterCode
      });
      this.filterDataInLayer({
        id: "grid-gz2000",
        filterCode
      });
    },

    async backToWhole() {
      // 镇街用户返回时返回改镇街
      if (this.maskInit) {
        const { sourceLayer, attributes, results } = this.maskInit;
        this.layerMask(sourceLayer, attributes, results);
        return;
      }

      //   console.log(this);
      const filterCode = ``;
      this.filterDataInLayer({
        id: "street-gz2000",
        filterCode
      });
      this.filterDataInLayer({
        id: "village-gz2000",
        filterCode
      });
      this.filterDataInLayer({
        id: "grid-gz2000",
        filterCode
      });
      await this.backToWholeFromMaskGz2000();
      //   this.$store.commit("common/SET_GRID", null);
      //   this.$store.commit("common/SET_TOWN", null);
      //   this.currTown = null;
      //   this.townDataPanelVisible = false;
      //   this.initAmount();
    },

    // 点击图层详情数据处理
    initLayerData(results) {
      // 是否点击到了金洲村无人机icon
      let jzc3dMap = results.find(res =>
        res.config.url.includes("金洲村三维地图点")
      );
      if (jzc3dMap?.data.features.length) {
        return this.$emit(
          "show3dMap",
          "https://www.720yun.com/t/80vk6yrypfh?scene_id=102421634"
        );
      }
      results.map(res => {
        let typeUrl = res.config.url
          .split("services/")[1]
          .split("/MapServer/0/query")[0];
        let type = typeUrl.split("/")[1];
        switch (type) {
          case "上水井盖":
          case "供电井盖":
          case "公共厕所":
          case "垃圾收集点":
          case "市政消火栓":
          case "微型消防站":
          case "排水井盖":
          case "照明设施":
          case "积水点":
            if (res.data.features.length) {
              this.tabsArr.push(type);
              let tableKeysMap = {
                FID: "编号",
                MC: "名称",
                LX: "类型",
                GLYMC: "管理员姓名",
                GLYLXFS: "管理员电话",
                SSCM: "所属行政村",
                WGXX: "网格信息",
                DZ: "地址"
              };
              let props = res.data;
              for (let i in props.fields) {
                if (
                  [
                    "F8",
                    "ID",
                    "BZ",
                    "OBJECTID",
                    "OBJECTID_1",
                    "x",
                    "y",
                    "X",
                    "Y"
                  ].includes(props.fields[i].alias)
                ) {
                  continue;
                }
                let key = {
                  id: props.fields[i].alias,
                  label: tableKeysMap[props.fields[i].name],
                  minWidth: "150",
                  searchable: false
                };
                this.tabsAllData.cityPartsData.tableKeys.push(key);
              }
              this.tabsAllData.cityPartsData.tableData = props.features.map(
                v => {
                  return v.attributes;
                }
              );
            }
            break;
          case "监控电子眼":
            if (res.data.features.length) {
              this.tabsArr.push(type);
              let tableKeysMap = {
                FID: "编号",
                名称: "名称",
                资源名: "资源名",
                资源类: "资源类",
                资源编: "资源编",
                转换编: "转换编",
                镇名: "镇名",
                父组织: "父组织",
                父组_1: "父组_1",
                父组_12: "父组_12",
                纬度: "纬度",
                经度: "经度",
                五口: "五口"
              };
              let props = res.data;
              for (let i in props.fields) {
                if (
                  ["F8", "ID", "OBJECTID", "OBJECTID_1", "x", "y"].includes(
                    props.fields[i].alias
                  )
                ) {
                  continue;
                }
                let key = {
                  id: props.fields[i].alias,
                  label: tableKeysMap[props.fields[i].name],
                  minWidth: "150",
                  searchable: false
                };
                this.tabsAllData.cityPartsData.tableKeys.push(key);
              }
              this.tabsAllData.cityPartsData.tableData = props.features.map(
                v => {
                  return v.attributes;
                }
              );
            }
            break;
          case "queryResident": // 楼栋人员信息
            if (res.data.features.length) {
              this.tabsArr.push("楼栋人员信息");
              this.tabsAllData.peopleData = res.data;
            }
            break;
          case "党员志愿者":
            if (res.data.features.length) {
              this.tabsArr.push(type);
              const tableKeysMap = {
                FID: "编号",
                XM: "姓名",
                XB: "性别",
                WG: "网格",
                // HS: "核酸",
                SJHM: "手机号码",
                JG: "网格党组织",
                JKM: "健康码",
                JZD: "地址",
                ZJHM: "证件号码"
              };
              let props = res.data;
              for (let i in props.fields) {
                if (
                  ["NL", "x", "y", "OBJECTID", "HS"].includes(
                    props.fields[i].alias
                  )
                ) {
                  continue;
                }
                let key = {
                  id: props.fields[i].alias,
                  label: tableKeysMap[props.fields[i].name],
                  minWidth: "150",
                  searchable: false
                };
                this.tabsAllData.cityPartsData.tableKeys.push(key);
              }
              this.tabsAllData.cityPartsData.tableData = props.features.map(
                v => {
                  return v.attributes;
                }
              );
            }
            break;
          case "金洲村公共服务设施10_5": // 公共服务设施
            if (res.data.features.length) {
              this.tabsArr.push("城中村公共服务设施");
              const tableKeysMap = {
                FID: "编号",
                MC: "名称",
                LX: "类型",
                GLYMC: "管理员姓名",
                GLYLXFS: "管理员电话",
                SSCM: "所属行政村",
                WGXX: "网格信息",
                DZ: "地址"
              };
              let props = res.data;
              for (let i in props.fields) {
                if (
                  ["FID", "TSBH", "SZSSMC", "QTXX", "X", "Y"].includes(
                    props.fields[i].alias
                  )
                ) {
                  continue;
                }
                let key = {
                  id: props.fields[i].alias,
                  label: tableKeysMap[props.fields[i].name],
                  minWidth: "200",
                  searchable: false
                };
                this.tabsAllData.serveFaciData.tableKeys.push(key);
              }
              this.tabsAllData.serveFaciData.tableData = props.features.map(
                v => {
                  return v.attributes;
                }
              );
            }
            break;
          case "城中村重点场所": // 城中村重点场所
            if (res.data.features.length) {
              this.tabsArr.push(type);
              const tableKeysMap = {
                FID: "编号",
                MC: "名称",
                LX: "类型",
                GLYMC: "管理员姓名",
                GLYLXFS: "管理员电话",
                SSCM: "所属行政村",
                WGXX: "网格信息",
                DZ: "地址"
              };
              let props = res.data;
              for (let i in props.fields) {
                if (["BZ", "X", "Y"].includes(props.fields[i].alias)) {
                  continue;
                }
                let key = {
                  id: props.fields[i].alias,
                  label: tableKeysMap[props.fields[i].name],
                  minWidth: "150",
                  searchable: false
                };
                this.tabsAllData.KeyPlaceData.tableKeys.push(key);
              }
              this.tabsAllData.KeyPlaceData.tableData = props.features.map(
                v => {
                  return v.attributes;
                }
              );
            }
            break;
          case "城中村商铺": // 城中村商铺
            if (res.data.features.length) {
              this.tabsArr.push(type);
              const tableKeysMap = {
                FID: "编号",
                MC: "店铺名称",
                DZ: "地址",
                LXR: "联系人",
                LXRDH: "联系人电话",
                SFZDCS:"是否重点场所",
                ZJ:"镇街",
                WG:"网格",
                SJLY:"数据来源",
                CJLX:"场景类型"
              }
              let props = res.data;
              for (let i in props.fields) {
                if (["FID",'序号','location_x','location_y'].includes(props.fields[i].alias)) {
                  continue;
                }
                let key = {
                  id: props.fields[i].alias,
                  label: tableKeysMap[props.fields[i].name],
                  minWidth: "150",
                  searchable: false
                };
                this.tabsAllData.cityPartsData.tableKeys.push(key);
              }
              this.tabsAllData.cityPartsData.tableData = props.features.map(
                v => {
                  return v.attributes;
                }
              );
            }
            break;
          case "特殊人群": // 特殊人群
            if (res.data.features.length) {
              this.tabsArr.push(type);
              const tableKeysMap = {
                XM: "姓名",
                XB: "性别",
                NL: "年龄",
                DZ: "地址",
                ZJHM: "身份证号",
                RYLX: "人员类型",
                SJHM:"手机号码",
                YWZJNL:"有无自救能力",
                ZJ:"镇街",
                CJ:"村居",
                WG:"网格",
                UPDATE_TIM:"更新时间",
                BZ:"备注",
              }
              let props = res.data;
              for (let i in props.fields) {
                if (["FID",'gz2000_x','gz2000_y','WG_X','WG_Y'].includes(props.fields[i].alias)) {
                  continue;
                }
                let key = {
                  id: props.fields[i].alias,
                  label: tableKeysMap[props.fields[i].name],
                  minWidth: "150",
                  searchable: false
                };
                this.tabsAllData.cityPartsData.tableKeys.push(key);
              }
              this.tabsAllData.cityPartsData.tableData = props.features.map(
                v => {
                  return v.attributes;
                }
              );
            }
            break;
          case "医疗资源_医院卫生中心":
            if (res.data.features.length) {
              this.tabsArr.push('医院卫生中心');
              // const tableKeysMap = {
              //   名称: "名称",
              //   BZ:"备注",
              // }
              const tableKeysMap = res.data.fieldAliases
              let props = res.data;
              for (let i in props.fields) {
                if (["FID",'id','location_x','location_y'].includes(props.fields[i].alias)) {
                  continue;
                }
                let key = {
                  id: props.fields[i].alias,
                  label: tableKeysMap[props.fields[i].name],
                  minWidth: "150",
                  searchable: false
                };
                this.tabsAllData.cityPartsData.tableKeys.push(key);
              }
              this.tabsAllData.cityPartsData.tableData = props.features.map(
                v => {
                  return v.attributes;
                }
              );
            }
            break;
          case "医疗资源_医院卫生中心":
            if (res.data.features.length) {
              this.tabsArr.push('医院卫生中心');
              // const tableKeysMap = {
              //   名称: "名称",
              //   BZ:"备注",
              // }
              const tableKeysMap = res.data.fieldAliases
              let props = res.data;
              for (let i in props.fields) {
                if (["FID",'id','location_x','location_y'].includes(props.fields[i].alias)) {
                  continue;
                }
                let key = {
                  id: props.fields[i].alias,
                  label: tableKeysMap[props.fields[i].name],
                  minWidth: "150",
                  searchable: false
                };
                this.tabsAllData.cityPartsData.tableKeys.push(key);
              }
              this.tabsAllData.cityPartsData.tableData = props.features.map(
                v => {
                  return v.attributes;
                }
              );
            }
            break;
        }
      });
      if (this.tabsArr.length) {
        this.showTabDetail = true;
      }
    },
    // 请求城规院地图数据
    getMapLayerData(event) {
      // 地图接口测试
      let urls = [];
      // 市政设施（城市部件）
      this.currGz2000layers
        .find(v => v.type === "szss")
        .layers.map(v => {
          if (v.active)
            urls.push(
              `${process.env.VUE_APP_MAP_API}/yqfkarcgis/arcgis/rest/services/城市部件/${v.label}/MapServer/0/query`
            );
        });
      //医疗物资
      this.currGz2000layers
        .find(v => v.type === "ylzy")
        .layers.map(v => {
        if (v.active) {
          if (v.value === "yywszx"){
            urls.push(`${yqfkArcgisUrls.YYWSZX}/0/query`);
          }
        }
      })
      // 城中村治理
      this.currGz2000layers
        .find(v => v.type === "czc")
        .layers.map(v => {
          if (v.active) {
            if (v.value === "gz-ggfwss") {
              urls.push(`${yqfkArcgisUrls.GGFWSS}/0/query`);
            } else if (v.value === "gz-czczdcs") {
              urls.push(`${yqfkArcgisUrls.CZCZDCS}/0/query`);
            } else if (v.value === "gz-czcsp") {
              urls.push(`${yqfkArcgisUrls.CZCSP}/0/query`);
            }
          }
        });
      // 基础图层
      this.currGz2000layers
        .find(v => v.type === "base")
        .layers.map(v => {
          if (v.active) {
            if (v.value === "gz-dyzyzfw") {
              //党员志愿者
              urls.push(`${yqfkArcgisUrls.DY}/0/query`);
            } else if (v.value === "gz-fwp") {
              //房屋人口图层
              urls.push(`${yqfkArcgisUrls.FWPep}/0/query`);
            } else if (v.value === "gz-jzcswdt") {
              //金洲村三维地图点
              urls.push(`${yqfkArcgisUrls.SWDTD}/0/query`);
            }else if (v.value === "tsrq") {
              //特殊人群
              urls.push(`${yqfkArcgisUrls.TSRQ}/0/query`);
            }
          }
        });
      urls = Array.from(new Set(urls));
      var pickPoint = { x: event.mapPoint.x, y: event.mapPoint.y }; //鼠标点击的坐标点
      // var pickPoint = {x:65792.45135,y:193517.4045}  //鼠标点击的坐标点
      let radius = 3;
      //查询参数
      var params = {
        f: "pjson",
        // geometry: {
        //   xmin: pickPoint.x - 3,
        //   ymin: pickPoint.x - 3,
        //   xmax: pickPoint.x + 3,
        //   ymax: pickPoint.x + 3,
        // },
        geometry: `{xmin:${pickPoint.x - radius},ymin:${pickPoint.y -
          radius},xmax:${pickPoint.x + radius},ymax:${pickPoint.y + radius}}`,
        geometryType: "esriGeometryEnvelope",
        spatialRel: "esriSpatialRelIntersects",
        returnGeometry: "true",
        outFields: "*"
      };

      let data = new FormData();
      for (let i in params) {
        data.append(i, params[i]);
      }
      // 所有请求完成后有数据则弹窗
      axios
        .all(
          urls.map(url => {
            return axios.post(url, data);
          })
        )
        .then(
          axios.spread((...a) => {
            this.initLayerData([...a]);
          })
        )
        .catch(err => {
          console.log(err);
        });

      //发起请求
      //     $.ajax({
      //         url: url,
      //         type: "post",
      //         data: params,
      //         dataType: "json",
      //         success: function (data) {
      //             console.log(data);
      // //var features = new ol.format.EsriJSON().readFeatures(data);
      // //console.log(features);
      //         }
      // });

      // 测试END
    }
  }
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

// ARCGIS编辑工具栏
.esri-sketch {
  top: 100px;
  right: 120px;
  &::before{
        content: '多边形绘制';
        padding: 5px;
    }
}
.esri-selection-toolbar__container {
  display: flex;
}
// .esri-editor {
//   right: 120px;
//   top: 200px;
// }
.esri-sketch.label-sketch{
    top: 180px;
    &::before{
        content: '文字标签';
        padding: 5px;
    }
}
</style>
