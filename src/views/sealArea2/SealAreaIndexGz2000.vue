<template>
  <div class="seal-area screen-wrap">
    <screen-header :navItemVisible="false" />

    <!--标题-->
    <div class="caption" v-if="currSealArea.name">{{ currSealArea.name }}</div>

    <!--图层-->
    <seal-map-layer
      ref="baseMapLayer"
      :isEditing="isEdit"
      :layer-ids="layerIds"
      @drawComplete="handleDrawComplete"
      @editStop="handleEditStop"
      @layerClicked="handelLayerClicked"
      @layerEvent="layerEvent"
      @layerInit="handelLayerInit"
      @show3dMap="layerEventShow3D"
    />

    <!--模式切换-->
    <div class="seal-area-tab">
      <div
        class="seal-area-tab-item"
        v-for="item in list"
        :key="item.value"
        :class="{ active: mode == item.value }"
        @click="switchMode(item)"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- 密接次密接、关联场所统计栏 -->
    <div class="stat-tab" v-if="mode != 1">
      <div
        class="stat-item"
        v-for="(item, index) in Object.values(statList)"
        :key="index"
        @click="showStatDetail(item)"
      >
        <!-- <img src="" alt="" srcset=""> -->
        <div class="count-icon">
          <div class="count-inner-ring">
            <img
              src="@/assets/image/counter-inner-ring.svg"
              class="count-inner-ringsvg"
            />
          </div>
          <div class="count-icon-inner-svg">
            <img :src="item.icon" class="count-icon-svg" />
          </div>
        </div>
        <div class="stat-info">
          <div class="stat-name">{{ item.name }}</div>
          <div class="stat-value">
            <count-to
              :startVal="0"
              :endVal="item.value"
              :duration="5000"
              autoplay
              useEasing
            ></count-to>
            <span class="stat-unit">个</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 密接、次密接人员明细 -->
    <concat-detail
      v-if="isConcatDetailVisible"
      :title="detailTitle"
      :type="concatType"
    />

    <!-- 关联场所明细 -->
    <correlate-place v-if="isCorrelatePlaceVisible" :title="detailTitle" />

    <!-- 图层搜索划设-->
    <layerSearch
      ref="layerSearch"
      v-if="currSealArea.mode === 'search'"
      @addArea="addArea"
    />
    <!--区域统计信息面板-->
    <transition name="fade">
      <seal-area-detail
        @close="resetCurrSealArea"
        v-if="isDetailVisible"
        :areaAttribute="areaAttribute"
      >
      </seal-area-detail>
    </transition>

    <!--编辑区域按钮-->
    <div class="area-opt" v-show="isEdit" style="z-index: 999">
      <div class="btn" @click="backToAll">返回</div>
      <div class="btn danger" @click="removeArea" v-show="currSealArea.id">
        删除
      </div>
      <div class="btn" @click="popupForm">保存</div>

      <el-popover
        placement="top-start"
        popper-class="screen-popover"
        width="300"
        trigger="hover"
        content=""
        v-if="currSealArea.mode"
      >
        <template v-if="currSealArea.mode === 'add'">
          <p>1.右上角编辑工具选择添加的形状</p>
          <p>2.点击区域端点，并按Delete键可删除当前端点</p>
          <p>3.点击生成的形状可以选择形状进行缩放、旋转、移动</p>
        </template>
        <template v-if="currSealArea.mode === 'search'">
          <p>1.左上搜索栏先选择划区域类型</p>
          <p>2.搜索名字或者地图点击对应的区域可以生成对应的区域范围</p>
          <p>3.可以多选相同或不同类型的区域，合并所选区域的范围</p>
          <p>4.选择完成后可以对区域进行微调，再次修改选择区域会重置微调内容</p>
        </template>
        <div slot="reference" class="btn">帮助说明</div>
      </el-popover>
    </div>

    <div class="area-opt" v-show="addAble">
      <!--<el-popover-->
      <!--placement="top-start"-->
      <!--width="200"-->
      <!--trigger="hover"-->
      <!--content="点击开始绘制区域，双击鼠标左键结束绘制，并可以进行编辑">-->
      <div slot="reference" class="btn" @click="AreaEditMode('add')">
        划设区域
      </div>
      <div slot="reference" class="btn" @click="AreaEditMode('search')">
        搜索区域
      </div>
      <!--</el-popover>-->
    </div>

    <!--图例-->
    <map-legend
      ref="mapLegend"
      @gridLayerSwitch="handleGridSwitch"
      @layerSwitch="layerSwitch"
      @gotoLocation="handleGotoLocation"
      @clearLocation="handleClearLocation"
      @bgMapChange="handleByMapChange"
      @changeAreaType="handleChangeAreaType"
      :has-grid="false"
      :filterIds="filterIds"
    ></map-legend>

    <!--区域详情-->
    <el-dialog
      title="基本信息"
      width="600px"
      :visible.sync="formVisible"
      @close="handleCloseBaseForm"
      class="screen-dialog"
      v-dialogDrag
    >
      <el-form :rules="rules" ref="baseForm" :model="form" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择区域类型">
            <el-option
              :label="item.label"
              :value="item.value"
              :key="index"
              v-for="(item, index) in typeList"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属镇街" prop="town">
          <el-select v-model="form.town" placeholder="请选择所属镇街">
            <el-option
              :label="item"
              :value="item"
              :key="index"
              v-for="(item, index) in streetList"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面积">
          <el-input :value="parseInt(form.area)" readonly>
            <template slot="append">平方米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            placeholder="请输入描述内容"
            v-model="form.remark"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 6 }"
            prop="remark"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="saveArea" type="primary" size="success"
            >保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--确诊人员图层过滤器-->
    <diagnose-filter 
      @selectChange="updateDiagnoseLayer"
      @switchTraceDialog="switchTraceDialog" 
      @updateDiagnoseHeatMapLayer="updateDiagnoseHeatMapLayer"
      @updateScanRecordLayer="updateScanRecordLayer"
      v-show="(mode === 0 && isDiagnoseFilterVisible)" 
    />

    <!-- 活动轨迹时间线弹窗 -->
    <diagnose-traces-dialog
      v-if="tracePeopleId"
      :tracePeopleId="tracePeopleId"
      @selectChange="updateDiagnoseTraceLayer"
      @closeTraceDialog="switchTraceDialog"
    />

    <!-- 人员轨迹详情 -->
    <diagnose-place-detail
      :placeDetail="placeDetail"
      @closeDetail="handleCloseDetail"
    />

    <!--流调人员信息-->
    <dispatch-panel
      :id="dispatchId"
      v-if="isDispatchPanelVisible"
      @close="isDispatchPanelVisible = false"
    >
    </dispatch-panel>

    <scan-record v-if="scanRecordDetail" :scanRecordDetail="scanRecordDetail"/>
    <div
      v-if="clusterData"
      class="clusterData"
      :style="{ left: clusterData.x + 'px', top: clusterData.y + 'px' }"
    >
      <!-- {{clusterData}} -->
      <p
        v-for="item in clusterData.data"
        @click="openDetail(item)"
        :key="item.id"
      >
        {{ item.name }}
      </p>
    </div>

    <!-- 人员轨迹时间轴 -->
    <div class="locus-timeline" v-if="showLocusTimeLine && personLocusData">
      <div class="label-box">
        <div class="time-label">
          播放时间：{{ timeLabel }}

          <el-button
            :icon="
              personLocusData.isPlaying
                ? 'el-icon-video-pause'
                : 'el-icon-video-play'
            "
            @click="personLocusData.isPlaying = !personLocusData.isPlaying"
            type="text"
            style="font-size: 18px"
          />
          <el-switch
            v-model="personLocusData.playMode"
            @change="changePlayMode"
            class="play-mode"
          />
          <div>播放模式</div>
        </div>
      </div>
      <div class="bg">
        <div
          class="progress"
          :style="
            `width:${(personLocusData.step /
              ((personLocusData.endTime - personLocusData.startTime) /
                (60 * 60))) *
              100}%;`
          "
        />
      </div>
    </div>

    <!--下钻图层按钮-->
    <div class="area-opt" v-if="girdSelect">
      <a class="btn" @click="backToWhole">返回</a>
      <!--      <div slot="reference" v-if="addAble" class="btn" @click="addArea">-->
      <!--        划设区域-->
      <!--      </div>-->
    </div>

    <three-panorama v-if="show3d" @close="show3d = false" :url="iframeUrl" />
  </div>
</template>

<script>
import ScreenHeader from "@/components/screen/ScreenHeader";
import SealMapLayer from "./SealMapLayerGz2000";
import SealAreaDetail from "./SealAreaDetail";
import SealMapForm from "@/mixins/SealMapForm";

import { stringfyPolygon, getConcatStatistics } from "@/api/sealarea2.js";
import MapLegend from "./MapLegendGz2000";

import DiagnoseFilter from "./DiagnoseFilter";
import DispatchPanel from "./Dispatch/DispatchPanel";
import ThreePanorama from "./ThreePanorama";
import ConcatDetail from "./detail/concatDetail";
import CorrelatePlace from "./detail/correlatePlace";
import ScanRecord from "./detail/scanRecord";
import DiagnoseTracesDialog from "./DiagnoseTracesDialog.vue";
import DiagnosePlaceDetail from './DiagnosePlaceDetail.vue'

import { initDispatchWatcher } from "@/utils/watcher";
import moment from "moment";
import IndexGz2000Layer from "./IndexGz2000Layer";
import layerSearch from "./layerSearch";
import Polygon from "@arcgis/core/geometry/Polygon";
import { GZ2000 } from "@/config/WMTS";
import { mapState } from "vuex";
import CountTo from "vue-count-to";

import * as TURF from "@turf/turf";
const INFO_MAP = {
  0: "baseInfo",
  1: "trackInfo"
};
let locusTimerInstance = null;
export default {
  name: "SealAreaIndex",
  components: {
    DispatchPanel,
    DiagnoseFilter,
    SealAreaDetail,
    SealMapLayer,
    ScreenHeader,
    MapLegend,
    ThreePanorama,
    layerSearch,
    ConcatDetail,
    CorrelatePlace,
    CountTo,
    DiagnoseTracesDialog,
    DiagnosePlaceDetail,
    ScanRecord
  },
  data() {
    return {
      iframeUrl: null, //金洲村三维视图
      show3d: false, // 金洲3D全景
      //   currAreaData: {
      //     type: null, // 划设类型（镇街、村居、网格、小区、楼宇、道路、河流）
      //     rings: [],
      //   },
      areaAttribute: null,
      list: [
        { label: "管理区域", value: 0 },
        { label: "手动划设区域", value: 1 }
      ],

      // 密接、次密接、关联场所统计
      statList: {
        connection: {
          name: "密接总数",
          dialogTitle: "密接人员明细",
          value: 0,
          type: 1,
          icon: require("@/assets/image/concat.svg")
        },
        // secondConnection: {
        //   name: "次密接总数",
        //   dialogTitle: "次密接人员明细",
        //   value: 0,
        //   type: 2,
        //   icon: require("@/assets/image/second-concat.svg")
        // },
        site: {
          name: "关联场所",
          dialogTitle: "关联场所明细",
          value: 0,
          icon: require("@/assets/image/correlate-place.svg")
        }
      },

      concatType: 1, // 1-密接；2-次密接

      //声明所有图层id
      layerIds: [],

      //是否编辑区域中
      isDrawing: false,

      //封控管理区信息表单是否可见
      formVisible: false,

      //流调窗口是否可见
      isDispatchPanelVisible: false,

      // 确诊人员图层过滤器是否可见
      isDiagnoseFilterVisible: true,
      dispatchId: null,
      streetList: [
        "南沙街",
        "黄阁镇",
        "东涌镇",
        "大岗镇",
        "榄核镇",
        "横沥镇",
        "万顷沙镇",
        "珠江街",
        "龙穴街"
      ],
      clusterData: null,
      personLocusData: null,
      showLocusTimeLine: false,
      girdSelect: false,
      filterIds: [],
      // 密接、次密接人员明细弹窗是否显示
      isConcatDetailVisible: false,
      // 关联场所明细弹窗是否显示
      isCorrelatePlaceVisible: false,
      detailTitle: "",
      mapLayer: null,
      // 展示活动轨迹的阳性人员id
      tracePeopleId: "",
      // 阳性人员活动轨迹图层是否可展示
      enableShowTrace: true, 
      // 阳性人员轨迹场所详情
      placeDetail: null, 
      // 扫码记录详情
      scanRecordDetail: null
    };
  },
  mixins: [SealMapForm, IndexGz2000Layer],
  computed: {
    ...mapState("common", ["dispatchData"]),
    mode: {
      set(newVal) {
        // if (newVal === 0) this.currAreaData = this.$options.data().currAreaData;
        this.$store.commit("common/SET_SEALAREA_MODE", newVal);
      },
      get() {
        return this.$store.state.common.sealareaMode;
      }
    },
    currSealArea() {
      return this.$store.state.common.sealarea || {};
    },
    //是否显示区域统计信息
    isDetailVisible() {
      return this.mode == 0 && Object.keys(this.currSealArea).length > 0;
    },
    isEdit() {
      //是否进入编辑模式
      return this.mode == 1 && Object.keys(this.currSealArea).length > 0;
    },
    addAble() {
      return (
        this.mode == 1 &&
        !this.isDrawing &&
        Object.keys(this.currSealArea).length == 0
      );
    },
    timeLabel() {
      let time =
        (this.personLocusData.startTime + this.personLocusData.step * 60 * 60) *
        1000;
      // let time2 = this.personLocusData.startTime + (this.personLocusData.step+1) * 30 * 60
      return moment(time).format("MM-DD HH:mm");
    }
  },
  watch: {
    mode() {
      this.backToAll();
    },
    currSealArea(obj) {
      for (let key in this.form) {
        this.form[key] = obj[key];
      }
    },
    async dispatchData(val) {
      const names = val.map(v => v.name);
      const res = await getConcatStatistics({name:names});
      Object.keys(this.statList).forEach(key => {
        this.$set(this.statList[key], "value", res[key]);
      });
    }
  },
  created() {
    let arr = [
      //   {
      //     id: "boundary",
      //     visible: true,
      //     order: 0
      //   },
      {
        id: "grid-gz2000",
        visible: false,
        order: 0
      },
      {
        id: "street-gz2000",
        visible: false,
        order: 0
      },
      {
        id: "village-gz2000",
        visible: false,
        order: 0
      },
      //   {
      //     id: 'rivers-gz2000',
      //     visible: false,
      //     order: 0
      //   },
      {
        id: "road-gz2000",
        visible: false,
        order: 0
      },
      {
        id: "houseEstate-gz2000",
        visible: false,
        order: 0
      },
      {
        id: "building-gz2000",
        visible: false,
        order: 0
      },
      {
        id: "jinzhou-gz2000",
        visible: false,
        order: 0
      },
      {
        id: "seal-area2",
        visible: true,
        order: 1
      },
      {
        id: "diagnose-trace",
        visible: false,
      },
      {
        id: "diagnose-place",
        visible: true,
      },
      {
        id: "diagnose-heatmap",
        visible: false
      },
      {
        id: "dispatch-person",
        visible: true,
        order: 0
      },
      // 临时：运营商提供的人员基站轨迹数据 @hgc 2022-7-14
      {
        id: "person-locus2",
        visible: this.showLocusTimeLine,
        order: 0
      },
      {
        id: "person-locus",
        visible: this.showLocusTimeLine,
        order: 0
      },
      {
        id: "jinzhou-UAV",
        visible: false,
        order: 0
      },
      {
        id: "scan-record",
        visible: false,
        order: 0
      }
    ];

    //图层渲染排序
    arr.sort((a, b) => {
      return a.order - b.order;
    });

    this.layerIds = arr;
  },
  mounted() {
    this.$store.commit("map/SET_MAP_TYPE", "gz2000");
    this.initWatcher();
    // this.testWebsocket();
    // 人员轨迹时间动画
    // this.locusTimer();
  },
  methods: {
    layerEvent(event) {
      if (event.type === "gird") {
        this.girdSelect = true;
      }
    },
    layerSwitch(data) {
      if (data.value === "person-locus") {
        this.showLocusTimeLine = data.active;
        const layerIds = ["person-locus", "person-locus2"];
        layerIds.forEach(id => {
          this.mapLayer.toggleOneLayer(id, data.active);
        });

        const fn = data.active ? this.locusTimer : this.clearLocusTimer;
        fn();
        return;
      }

      // 单选图层ID
      let ids = [
        "grid-gz2000",
        "street-gz2000",
        "village-gz2000",
        //   'rivers-gz2000',
        "road-gz2000",
        "houseEstate-gz2000",
        "building-gz2000"
      ];
      if (ids.includes(data.value)) {
        this.filterIds = ids.filter(i => i !== data.value);
        this.mapLayer.hideLayers(this.filterIds);
      }
      this.mapLayer.toggleOneLayer(data.value, data.active);
    },

    initWatcher() {
      const ws = initDispatchWatcher();
      ws.onmessage = msg => {
        if (msg.data.includes("连接成功")) {
          return;
        }
        try {
          const data = JSON.parse(msg.data);
          this.updateDispatchModel(data);
        } catch (e) {
          console.error(e);
        }
      };
    },

    //更新流调信息模块
    updateDispatchModel(data) {
      const {
        dataId, //流调id
        fieldName, //字段名
        mediaInfoId, //语音文件id
        text, //文字
        index, //索引值，如果操作对象是数组，则更新索引值为index的成员
        type // 0:基本信息 1:核心轨迹 2:疫苗接种 3:近7天核酸情况 4:其他
        // operation //操作 update add remove, 当前默认全部为更新操作
      } = data;

      //如果当前浏览的流调id == dataId,则继续
      if (this.dispatchId !== dataId) {
        return;
      }

      switch (type) {
        case "1":
          //核心轨迹
          if (fieldName == "hxgj") {
            this.$store.commit("dispatch/SET_INFO_ITEM", {
              infoName: INFO_MAP[type],
              fieldName: "locus",
              value: {
                locusYyWb: [
                  {
                    mediaInfoId: mediaInfoId,
                    yyText: text
                  }
                ],
                locusDate: data.tarackDate
              },
              index
            });
          }
          break;
        default:
          //更新文本
          this.$store.commit("dispatch/SET_INFO_ITEM", {
            infoName: INFO_MAP[type],
            fieldName: fieldName,
            value: text,
            index
          });
          //更新语音
          this.$store.commit("dispatch/SET_INFO_ITEM", {
            infoName: INFO_MAP[type],
            fieldName: `${fieldName}yywb`,
            value: [
              {
                mediaInfoId: mediaInfoId,
                yyText: text
              }
            ]
          });
          break;
      }
    },

    testWebsocket() {
      document.addEventListener("keypress", event => {
        if (event.key == "w") {
          //更新流调图层
          // this.$refs['baseMapLayer'].refreshLayer({id: 'dispatch-person'})
          //更新数组成员 核心轨迹
          // this.$store.commit('dispatch/SET_INFO_ITEM', {
          //   infoName: INFO_MAP["1"],
          //   fieldName: 'locus',
          //   value: {
          //     locusYyWb: [{
          //       mediaInfoId: '968880837456666624',
          //       yyText: '大家好我是傻瓜'
          //     }],
          //     locusDate: '2020-04-27'
          //   },
          //   index: 1
          // })
          // //更新字段
          // this.$store.commit('dispatch/SET_INFO_ITEM', {
          //   infoName: 'baseInfo',
          //   fieldName: 'nl',
          //   value: '大家好我是傻瓜'
          // })
          // //更新语音
          // this.$store.commit('dispatch/SET_INFO_ITEM', {
          //   infoName: 'baseInfo',
          //   fieldName: `nlyywb`,
          //   value: [{
          //     mediaInfoId: 966727587198697472,
          //     yyText: '大家好我是傻瓜'
          //   }]
          // })
          //更新照片
          // this.$store.commit('dispatch/SET_INFO_ITEM',{
          //   infoName: 'baseInfo',
          //   fieldName: `zp`,
          //   value: `968082179802775552,968082237587701760,968082269074341888`
          // })
        }
      });
    },

    //切换模式
    switchMode(item) {
      this.mode = item.value;
    },

    resetCurrSealArea() {
      this.$store.commit("common/SET_CUR_SEALAREA", null);
    },

    //设置当前区域
    setCurrSealarea(attributes, target, goto = false) {
      // console.log('设置当前区域','setCurrSealarea',attributes,target)
      this.areaAttribute = Object.assign(attributes, { target });
      const { name } = attributes;

      if (this.currSealArea.name == name) {
        return;
      }

      //设定当前高风险区
      this.$store.commit("common/SET_CUR_SEALAREA", attributes);

      //定位到当前封控管理区
      if (goto) {
        this.$refs["baseMapLayer"].gotoLocation({
          target: target.graphic,
          zoom: 13
        });
      }
    },

    //更新确诊人员图层
    updateDiagnoseLayer(event) {
      const { layerIds, ids } = event;
      var filterCode = "";
      if (ids.length > 0) {
        filterCode = ids
          .map((v) => {
            return `sfzhm = '${v}'`;
          })
          .join(" OR ");
      } else {
        filterCode = "id=NULL";
      }

      layerIds.forEach((item) => {
        this.$refs["baseMapLayer"].filterDataInLayer({ id: item, filterCode });
      });
    },

    // 更新确诊人员活动轨迹图层
    updateDiagnoseTraceLayer(event) {
      const { id, locusDate } = event;
      let filterCode = "";
      if (this.enableShowTrace && id) {
        filterCode = `sfzhm = '${id}'`;
        if (locusDate) {
          filterCode += ` AND locusDate = '${locusDate}'`;
        }
      } else {
        filterCode = "id=NULL";
      }

      ["diagnose-trace"].forEach((item) => {
        this.$refs["baseMapLayer"].toggleOneLayer(item, true);
        this.$refs["baseMapLayer"].filterDataInLayer({
          id: item,
          filterCode,
        });
      });
    },

    // 展示/隐藏阳性人员轨迹窗口
    switchTraceDialog({ id, enableShowTrace }) {
      this.tracePeopleId = id;
      this.enableShowTrace = enableShowTrace;
      //   隐藏轨迹
      if (!id) {
        this.updateDiagnoseTraceLayer({ id, locusDate: "" });
        this.isDiagnoseFilterVisible = true;
      } else {
        this.isDiagnoseFilterVisible = false;
      }
    },

    async handleDrawComplete() {
      this.addArea();
      this.isDrawing = false;
    },

    async handleEditStop() {
      //重新获取多边形坐标和面积
      const { polygon, area, labelFeature } = await this.getPolygonData();
      this.form.polygon = polygon;
      this.form.area = area;
      console.log("labelFeature", labelFeature);
    },

    // 进入区域编辑模式
    AreaEditMode(mode) {
      this.$store.commit("common/SET_CUR_SEALAREA", {
        id: null,
        name: "新建区域",
        type: "seal",
        remark: "",
        unitName: "",
        town: "",
        mode //划设模式
      });
    },

    //创建一个矩形区域
    addArea(selectAreas) {
      if (!selectAreas) {
        // 新建正方形
        this.$refs["baseMapLayer"].addDefaultFeature();
        return;
      }
      if (!selectAreas.length) {
        // 列表为空时
        return;
      }

      //   只有一个区域选择的时候，直接显示这个区域
      if (selectAreas.length === 1) {
        this.$refs["baseMapLayer"].addDefaultFeature({
          rings: selectAreas[0].rings
        });
        return;
      }
      //   判断多边形有么有重叠，如果是重叠的多边形，使用union来组合多边形
      try {
        let union;
        selectAreas.forEach((v, i) => {
          const polygonData = TURF.polygon([v.rings[0]], { fill: "#0f0" });
          if (i === 0) {
            union = polygonData;
            return;
          }
          union = TURF.union(union, polygonData);
        });
        if (union.geometry.type === "Polygon") {
          const polygon = new Polygon({
            spatialReference: GZ2000,
            rings: [union.geometry.coordinates[0]]
          });
          this.$refs["baseMapLayer"].addDefaultFeature(polygon);
          return;
        }
      } catch (e) {
        console.warn("选择的不是多边形", e);
      }

      //   如果出现不重叠的多边形，生成凸多边形
      let fc = [];
      selectAreas.forEach(v => {
        v.rings[0].forEach(j => {
          fc.push(TURF.point(j));
        });
        //     points = points.concat(v.rings[0]);
      });
      var points = TURF.featureCollection(fc);

      var hull = TURF.convex(points);
      //   console.log("凹多边形", hull);

      const polygon = new Polygon({
        spatialReference: GZ2000,
        rings: [hull.geometry.coordinates[0]]
      });
      this.$refs["baseMapLayer"].addDefaultFeature(polygon);
    },

    // 绘制区域
    // 绘制功能存在问题，得到的rings数据非闭合图形
    addDraw() {
      this.$refs["baseMapLayer"].initDraw();
      this.isDrawing = true;
    },

    //删除
    removeArea() {
      this.$confirm("此操作将永久删除该区域,确定删除吗？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        //执行删除
        await this.handleRemoveArea();
        // 更新图层
        this.refreshData();
        this.backToAll();
      });
    },

    editBaseInfo() {
      this.formVisible = true;
    },

    //保存
    async popupForm() {
      //获取多边形坐标和面积
      const { polygon, area, labelFeature } = await this.getPolygonData();
    //   console.log("labelFeature", labelFeature, area);

      if (area <= 0) {
        this.$message({
          message: "当前没有区域范围，请返回重新绘制",
          type: "warning"
        });
        return;
      }
      this.form.polygon = polygon;
      this.form.area = area;
      this.form.mapType = "GZ2000";
      //   临时使用unitName保存文字标签内容
      this.form.unitName = JSON.stringify(labelFeature);

      // if (towns.length !== 1) {
      //   this.$message({
      //     message: `高风险区域必须在1个镇街区域内,且不能跨镇街`,
      //     type: 'warning'
      //   })
      //   return
      // }

      this.formVisible = true;
    },

    async saveArea() {
      const valid = await this.validForm();

      if (!valid) {
        this.$message({
          message: "请检查基本信息是否填写完整",
          type: "warning"
        });
        return;
      }

      //提交请求
      await this.handleSaveArea(this.form);
      this.$refs.baseForm.resetFields();
      // 更新图层
      this.refreshData();
      //返回默认布局
      this.backToAll();
    },

    handleCloseBaseForm() {
      this.$refs.baseForm.resetFields();
    },

    //获取当前区域的多边形数据
    //如果当前区域为 低风险区,则需要减去其包含的高风险区
    async getPolygonData() {
      const { type } = this.form;

      //获取所有高风险区geometry
      const exitLayer = this.$refs["baseMapLayer"].getLayerById("seal-area2");
      const geometries = [];
      const { features } = await exitLayer.queryFeatures();

      if (type == "prevention") {
        //获取当前所有高风险区
        features.forEach(item => {
          const { attributes, geometry } = item;
          if (attributes.type == "seal") {
            geometries.push(geometry);
          }
        });
        //   } else if (type == "prevention") {
        //     //获取当前所有中风险区区区
        //     features.forEach(item => {
        //       const { attributes, geometry } = item;
        //       if (attributes.type == "manage") {
        //         geometries.push(geometry);
        //       }
        //     });
      }
      const mapLayer = this.$refs["baseMapLayer"];
      const { polygon, area } = mapLayer.getDrawFeature({
        geometries
      });
      const labelFeature = mapLayer.getLabelFeature();
      return {
        polygon: stringfyPolygon(polygon),
        area: area,
        labelFeature
      };
    },

    //获取当前绘制区域所在的镇街
    async getBelogsTowns() {
      //所有镇街多边形
      const boundaryLayer = this.$refs["baseMapLayer"].getLayerById("boundary");
      const { features } = await boundaryLayer.queryFeatures();

      const intersectArr = this.$refs["baseMapLayer"].getIntersectPolygon({
        features
      });
      return intersectArr.map(v => v.name);
    },

    backToAll() {
      this.resetCurrSealArea();
      this.$refs["baseMapLayer"].clearDrawLayer();
      // this.$refs['baseMapLayer'].backToWhole()
      if (this.$refs["layerSearch"]) {
        this.$refs["layerSearch"].clearLocation();
      }
      this.formVisible = false;
    },
    backToWhole() {
      this.$refs["baseMapLayer"].backToWhole();
      this.girdSelect = false;
    },

    refreshData() {
      this.$refs["baseMapLayer"].refreshLayer({ id: "seal-area2" });
    },

    //处理网格图层显示状态
    handleGridSwitch({ visible }) {
      this.$refs["baseMapLayer"].toggleOneLayer("grid", visible);
    },

    handleGotoLocation(event) {
      this.$refs["baseMapLayer"].clearMarker();
      this.$refs["baseMapLayer"].gotoLocation(event);
    },

    handleClearLocation() {
      this.$refs["baseMapLayer"].clearMarker();
    },

    //触发底图切换
    handleByMapChange({ id }) {
      this.$refs["baseMapLayer"].switchByLayer(id);
    },

    handleChangeAreaType({ data }) {
      const arr = data.map(v => {
        return `type = '${v.value}' OR labelType = '${v.value}'`;
      });
      const filterCode = arr.length > 0 ? arr.join(" OR ") : `type = 'none'`;
      //   console.log('handleChangeAreaType',filterCode,data)
      this.$refs["baseMapLayer"].filterDataInLayer({
        id: "seal-area2",
        filterCode
      });
    },
    openDetail(item) {
      this.dispatchId = item.id;
      this.isDispatchPanelVisible = true;
    },
    async locusTimer() {
      if (!this.showLocusTimeLine) return;
      if (!this.personLocusData) {
        //   获取人员轨迹时间轴时间范围
        try {
          let layer = this.mapLayer.getLayerById("person-locus");
          let layerView = await this.mapLayer.view.whenLayerView(layer);
          let layerData = await layerView.queryFeatures();
          //   console.log("图层数据", layerData);
          if (!layerData.features.length) {
            locusTimerInstance = setTimeout(this.locusTimer, 5000);
            return;
          }

          this.personLocusData = {
            startTime: layerData.features[0].attributes.startTime,
            endTime:
              layerData.features[layerData.features.length - 1].attributes
                .endTime,
            step: 0,
            isPlaying: true,
            playMode: true
          };
        } catch (e) {
          locusTimerInstance = setTimeout(this.locusTimer, 1000);
          console.error(e);
          return;
        }
      } else {
        if (!this.personLocusData.isPlaying) {
          locusTimerInstance = setTimeout(this.locusTimer, 3000);
          return;
        }
        this.personLocusData.step++;
        if (
          this.personLocusData.startTime + this.personLocusData.step * 60 * 60 >
          this.personLocusData.endTime
        ) {
          this.personLocusData.step = 0;
        }
      }

      // 每60分钟一段
      const startTime =
        this.personLocusData.startTime + this.personLocusData.step * 60 * 60;
      const endTime =
        this.personLocusData.startTime +
        (this.personLocusData.step + 1) * 60 * 60;

      let filterCode = `startTime <= ${endTime} AND endTime >= ${startTime}`;
      //   let filterCode = `startTime>0`;
      let count = 0;
      this.$refs["baseMapLayer"].filterDataInLayer({
        id: "person-locus",
        filterCode
      });

      // 显示包含当前时间点的区间圆形
      //   let filterCode2 = `startTime <= ${startTime} AND endTime >= ${startTime}`;
      let res = await this.$refs["baseMapLayer"].filterDataInLayer({
        id: "person-locus2",
        filterCode
      });
      count = res.length;
      locusTimerInstance = setTimeout(this.locusTimer, count ? 3000 : 0);
    },
    // 切换播放模式
    changePlayMode(val) {
      //   console.log("change play mode", val);
      if (!val) {
        this.personLocusData.isPlaying = false;
        this.$refs["baseMapLayer"].filterDataInLayer({
          id: "person-locus",
          filterCode: ""
        });
        this.$refs["baseMapLayer"].filterDataInLayer({
          id: "person-locus2",
          filterCode: ""
        });
      } else {
        this.personLocusData.isPlaying = true;
      }
    },
    clearLocusTimer() {
      if (locusTimerInstance) {
        clearTimeout(locusTimerInstance);
        locusTimerInstance = null;
      }
    },
    async handelLayerInit(data) {
      this.mapLayer = this.$refs.baseMapLayer;

      // console.log("图层初始化", data.layer.id, data);
      if (data.layer.id === "seal-area2") {
        // 管理区类型默认高风险、低风险
        this.handleChangeAreaType({
          data: [
            {
              label: "高风险区",
              value: "seal",
              active: true
            },
            {
              label: "低风险区",
              value: "prevention",
              active: true
            }
          ]
        });
      }
      if (
        data.layer.id === "street-gz2000" &&
        this.$store.state.user.departmentName
      ) {
        const layer = data.layer;
        const res = data.source.filter(
          v => v.attributes.street === this.$store.state.user.departmentName
        );
        if (!res.length) {
          return;
        }
        const streetGraph = res[0];
        streetGraph.layer = layer;
        this.mapLayer.layerMask(
          layer,
          streetGraph.attributes,
          [{ graphic: streetGraph }],
          true
        );
      }
      //   临时，村居
      if (
        data.layer.id === "village-gz2000" &&
        this.$store.state.user.id === 2211444
      ) {
        const layer = data.layer;
        const res = data.source.filter(v => v.attributes.name === "南北台");
        // console.log("filter", data, res);
        if (!res.length) {
          return;
        }
        const streetGraph = res[0];
        streetGraph.layer = layer;
        this.mapLayer.layerMask(
          layer,
          streetGraph.attributes,
          [{ graphic: streetGraph }],
          true
        );
      }
      // 临时，网格
      if (
        data.layer.id === "grid-gz2000" &&
        this.$store.state.user.id === 5840770
      ) {
        const layer = data.layer;
        const res = data.source.filter(
          v => v.attributes.name === "板头村012网格"
        );
        // console.log("filter", data, res);
        if (!res.length) {
          return;
        }
        const streetGraph = res[0];
        streetGraph.layer = layer;
        this.mapLayer.layerMask(
          layer,
          streetGraph.attributes,
          [{ graphic: streetGraph }],
          true
        );
      }
    },
    showStatDetail(item) {
      if (item.value === 0) {
        return;
      }
      this.detailTitle = item.dialogTitle;
      if (item.name.indexOf("密接") > -1) {
        this.isConcatDetailVisible = true;
        this.concatType = item.type;
      } else {
        this.isCorrelatePlaceVisible = true;
      }
    },
    // 关闭场所详情窗口
    handleCloseDetail() {
      this.placeDetail = null;
    },
  },
  beforeDestroy() {
    this.$store.commit("map/SET_MAP_TYPE", "gdMap");
    this.clearLocusTimer();
  }
};
</script>

<style lang="scss" type="text/scss">
.seal-area {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #20326f;

  .caption {
    position: absolute;
    left: 50%;
    top: 90px;
    z-index: 1000;
    padding: 0.2em 0;
    min-width: 350px;
    max-width: 600px;
    transform: translateX(-50%);
    color: #fff;
    font-size: 30px;
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(0, 231, 255, 0) 0%,
      #00bace 30%,
      #00b8c9 76%,
      rgba(0, 231, 255, 0) 100%
    );
  }

  &-tab {
    position: absolute;
    top: 5em;
    left: 3em;
    z-index: 9999;
    display: inline-block;
    width: 300px;

    &-item {
      display: inline-block;
      margin-left: -1px;
      padding: 8px 4px;
      padding-left: 30px;
      width: 38%;
      box-sizing: border-box;
      border: 1px solid #314f98;
      text-align: center;
      cursor: pointer;
      color: #fff;

      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        background: rgba(32, 50, 111, 0.8)
          url("~@/assets/image/sealArea/manage.svg") 10% center no-repeat;
      }

      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        background: rgba(32, 50, 111, 0.8)
          url("~@/assets/image/sealArea/edit.svg") 16% center no-repeat;
      }

      &:hover {
        background-color: #345ef0;
      }

      &.active {
        background-color: #345ef0;
      }
    }
  }

  .area-opt {
    position: absolute;
    bottom: 3em;
    left: 50%;
    transform: translateX(-50%);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
}

.clusterData {
  position: fixed;
  background-color: rgba($color: #000000, $alpha: 0.7);
  color: #fff;
  padding: 5px;

  p {
    color: #fff;
    cursor: pointer;
  }
}
</style>
<style lang="scss" type="text/scss" scoped>
.seal-area-tab{
  z-index: 999;
}
.seal-area-tab-item {
  width: unset;
  padding-right: 8px;
}

.stat-tab {
  position: fixed;
  top: 86px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  color: #fff;
//   width: 507px;
  height: 73px;
  justify-content: space-between;
  border-radius: 4px;
  backdrop-filter: blur(2px);
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;

  .stat-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0px 10px;
    .count-icon {
      width: 50px;
      height: 50px;
      border: 1px solid #2f53d5;
      border-radius: 25px;
      margin-right: 10px;

      .count-inner-ring {
        position: relative;
        width: 50px;
        height: 50px;
        background: radial-gradient(
          circle,
          rgba(51, 174, 230, 0.6) 0,
          transparent 40%
        );

        .count-inner-ringsvg {
          width: 100%;
          height: 100%;
          animation: rotating 3s linear infinite;
        }
        @keyframes rotating {
          0% {
            transform: rotateZ(0deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }
      }
      .count-icon-inner-svg {
        position: relative;
        top: -100%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 48px;
        .count-icon-svg {
          width: 18px;
          height: 18px;
        }
      }
    }
    .stat-info {
      .stat-name {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #ced9ff;
      }
      .stat-value {
        font-size: 32px;
        font-family: MADETOMMY-Bold, MADETOMMY;
        font-weight: bold;
        color: #ffffff;
        white-space: nowrap;
        min-width: 120px;
        .stat-unit {
          font-size: 16px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #ced9ff;
        }
      }
    }
  }
}
.locus-timeline {
  position: fixed;
  bottom: 110px;
  left: 20px;
  width: 80%;
  height: 30px;
  box-sizing: border-box;

  .bg {
    background-color: rgba($color: #000000, $alpha: 0.7);
    width: 100%;
    height: 100%;
    padding: 10px;

    .progress {
      background-color: rgba($color: #2130a0, $alpha: 1);
      height: 100%;
      width: 30%;
      transition: all 0.5s;
    }
  }

  .label-box {
    position: absolute;
    left: 0px;
    top: -40px;
    height: 20px;
    padding: 10px;
    background-color: rgba($color: #000000, $alpha: 0.7);
    display: flex;
    align-items: center;

    .time-label {
      font-size: 18px;
      color: #fff;
      display: flex;
      align-items: center;

      * {
        margin-left: 10px;
      }
    }
  }
}
</style>
