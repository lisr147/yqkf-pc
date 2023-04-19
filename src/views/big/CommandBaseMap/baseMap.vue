<template>
  <div class="big-container screen-wrap">
    <base-map-layer
      :layerIds="layerIds"
      ref="baseMapLayer"
      :maskColor="maskColor"
      @layerClicked="handelLayerClicked"
    >
      <template v-slot:popup>
        <div
          class="map-point-pop"
          ref="mapPointPop"
          :style="{ left: alarmInfo.x + 'px', top: alarmInfo.y + 'px' }"
        >
          <h3>{{ alarmInfo.town }}今日告警数量</h3>
          <ul>
            <li
              @click="showEventPanel(item)"
              v-for="(item, index) in alarmInfo.list"
              :key="index"
              v-show="item.value > 0"
            >
              {{ item.label }} ({{ item.value || 0 }})
            </li>
          </ul>
        </div>
      </template>
    </base-map-layer>
    <!--数据总览-->
    <DataTotal v-if="layer === 5" @close="layer = 0" />

    <!--下钻图层按钮-->
    <div class="area-opt" v-show="townOptVisible || gridOptVisible">
      <a class="btn" @click="backToWhole">返回</a>
      <!--      <a class="btn"  @click="popTownDataPanel" v-show="townOptVisible && !gridOptVisible">查看统计</a>-->
      <a class="btn" @click="popTownDataPanel">查看统计</a>
      <!--{{$store.state.common.town}}-->
    </div>

    <!--图层选择器-->
    <map-layer-filter
      ref="leyerFilter"
      :curLayer="0"
      :data="layerList"
      @switchTopic="handelTopicChange"
      @selectChanged="handelLayerChange"
      :hasSealLink="$store.state.authority.accessPaths.includes('sealareaIndex')"
    ></map-layer-filter>
    <!--图例-->
    <map-legend
      ref="mapLegend"
      @gridLayerSwitch="handleGridSwitch"
      @gotoLocation="handleGotoLocation"
      @clearLocation="handleClearLocation"
      @bgMapChange="handleByMapChange"
      :has-grid="false"
    ></map-legend>
    <!--详情面板-->
    <div class="detail_list">
      <!--镇街统计-->
      <TownCount
        v-if="townDataPanelVisible"
        :town="currTown"
        :grid="currGrid"
        from="index"
        @closeTownCount="townDataPanelVisible = false"
      ></TownCount>
      <el-dialog
        v-dialogDrag
        v-for="(item, key) in detailList"
        v-if="detailList[key]"
        :width="dialogWidth[item.detailType] || '900px'"
        :key="key"
        :visible="true"
        :modal="false"
        :close-on-click-modal="false"
        @close="closeDetailList(key)"
      >
        <template slot="title" @click="zIndex++">
          <div>
            <!-- 根据详情类型切换 -->
            <div v-if="item.detailType === 'hotel'">
              {{ item.jkgcjd }}
              <!-- <div class="title_type">{{hotelType[item.type]}}</div> -->
            </div>
            <div v-if="item.detailType === 'person'">
              <p>{{ item.xm }}</p>
              <p>{{ item.xb }}</p>
              <p v-if="item.nl">{{ item.nl + "岁" }}</p>
              <div class="title_type">{{ item.mjlx }}</div>
            </div>
            <div v-if="item.detailType === 'redYellow'">
              人员列表
            </div>
            <div v-if="item.detailType === 'ryDetail'">
              <p>{{ item.USERNAME }}</p>
              <p style="margin-right: 10px;margin-left: 4px">
                {{ item.gender }}
              </p>
              <div
                class="title_type"
                :style="{
                  background: item.hh_type === '红码' ? '#e52b2b' : '',
                }"
              >
                {{ item.hh_type }}
              </div>
            </div>
            <!--重点场所-->
            <div class="risk-title" v-if="item.detailType === 'riskPlace'">
              {{ item.stationName }}
              <span class="addr"
                >地址：{{ item.address ? item.address : "-" }}</span
              >
            </div>
            <!--轨迹-->
            <div v-if="item.detailType === 'riskPlaceDetail'">
              {{ item.fullName }}的轨迹
            </div>
            <div v-if="item.detailType === 'spotDetail'">
              {{ item.popUpTitle }}
            </div>
            <div v-if="item.detailType === 'gridDetail'">
              {{ item.name }} ({{ item.street }})
              <div class="grid-tip">
                <span>户籍人口：{{ gridFlowPeople.hjrk }} 人</span>
                <span>流动人口：{{ gridFlowPeople.lsrk }} 人</span>
                <span>总计人口：{{ gridFlowPeople.zjrk }} 人</span>
              </div>
            </div>
            <div class="risk-title" v-if="item.detailType === 'mhRiskDetail'">
              中高风险地区来粤返粤人员核查情况
            </div>
            <!--三人小组-->
            <div
              class="risk-title"
              v-if="item.detailType === 'threeGroupDetail'"
            >
              三人小组人员明细
            </div>
            <!--特殊人群-->
            <div
              class="risk-title"
              v-if="
                ['specialPeopleDetail', 'specialPeopleDetailList'].includes(
                  item.detailType
                )
              "
            >
              特殊人群
            </div>
            <!--&lt;!&ndash;密接、次密接&ndash;&gt;-->
            <!--<div class="risk-title" v-if="item.detailType === 'closeContact'">-->
            <!--{{ item.key }}-->
            <!--</div>-->
            <!--核酸采样点列表-->
            <div
              class="risk-title"
              v-if="item.detailType === 'samplingPointList'"
            >
              {{ item.fwrq }}<span class="addr"> {{ item.sszj }}</span>
            </div>
            <!--单位挂点支援镇街-->
            <div
              class="risk-title"
              v-if="item.detailType === 'unitSupportStreet'"
            >
              单位挂点支援镇街
            </div>
            <div v-else>
              {{ item.dialogTitle }}
            </div>
          </div>
        </template>
        <!-- 动态组件 -->
        <HotelDetail
          :data="item"
          @showContactDetail="showContactDetail"
          v-if="item.detailType === 'hotel'"
          @popUp="handlePopUpEvent"
        />
        <ry-list
          :cond="item"
          v-if="item.detailType === 'redYellow'"
          @showRyDetail="showRyDetail"
        ></ry-list>
        <ry-detail
          :data="item"
          v-if="item.detailType === 'ryDetail'"
        ></ry-detail>
        <person-detail :data="item" v-if="item.detailType === 'person'" />

        <!--重点场所列表、详情 -->
        <risk-place-detail
          :data="item"
          v-if="item.detailType === 'riskPlaceDetail'"
        ></risk-place-detail>
        <risk-place-list
          :data="item"
          v-if="item.detailType === 'riskPlace'"
          @showRiskPlaceDetail="showRiskPlaceDetail"
        ></risk-place-list>

        <!--密接、次密接列表-->
        <close-contact-list
          :cond="item"
          v-if="item.detailType === 'closeContact'"
          @showCloseContactDetail="showCloseContactDetail"
        ></close-contact-list>

        <!--默认的地图数据弹窗-->
        <spot-detail
          :data="item"
          v-if="item.detailType === 'spotDetail'"
          @popUp="handlePopUpEvent"
        ></spot-detail>

        <!--网格详情-->
        <grid-detail
          :data="item"
          v-if="item.detailType === 'gridDetail'"
          @popUp="handlePopUpEvent"
        ></grid-detail>

        <!--中高风险来粤详情-->
        <mh-risk-detail
          :data="item"
          v-if="item.detailType === 'mhRiskDetail'"
        ></mh-risk-detail>

        <!--三人小组详情-->
        <three-group-detail
          :cond="item"
          v-if="item.detailType === 'threeGroupDetail'"
        ></three-group-detail>

        <!--特殊人群-->
        <special-people-detail
          :cond="item"
          @showSpecialPeopleList="handleShowSpecialPeopleList"
          v-if="item.detailType === 'specialPeopleDetail'"
        ></special-people-detail>

        <!--特殊人群列表-->
        <special-people-detail-list
          :cond="item"
          v-if="item.detailType === 'specialPeopleDetailList'"
        ></special-people-detail-list>

        <!--采样点列表-->
        <sampling-point-list
          :data="item"
          v-if="item.detailType === 'samplingPointList'"
          @showSamplingPointDetail="showSamplingPointDetail"
        ></sampling-point-list>

        <!--实时视频列表-->
        <video-list
          :cond="item"
          @popUp="handlePopUpEvent"
          v-if="item.detailType === 'videoList'"
        ></video-list>

        <!--工作人员明细-->
        <staff-detail-list
          :cond="item"
          v-if="item.detailType === 'staffList'"
        ></staff-detail-list>

        <!--购药记录明细-->
        <log-detail-list
          :cond="item"
          v-if="item.detailType === 'logList'"
        ></log-detail-list>

        <!--转运车辆明细-->
        <transit-vehicles-list
          :cond="item"
          v-if="item.detailType === 'transitVehiclesList'"
        ></transit-vehicles-list>

        <!--会诊排班明细-->
        <consultation-scheduling-list
          :cond="item"
          v-if="item.detailType === 'consultationSchedulingList'"
        ></consultation-scheduling-list>

        <!--配置医护人员明细-->
        <allocation-health-care-list
          :cond="item"
          v-if="item.detailType === 'allocationHealthCareList'"
        ></allocation-health-care-list>

        <!--单位挂点支援-->
        <unit-support-street
          :cond="item"
          v-if="item.detailType === 'unitSupportStreet'"
        ></unit-support-street>

        <!--历史数据-->
        <history-list
          :cond="item"
          v-if="item.detailType === 'historyList'"
        ></history-list>
        <detail-list
          :cond="item"
          v-if="detailListArray.includes(item.detailType)"
          @layerClicked="handelLayerClicked"
        ></detail-list>
      </el-dialog>
    </div>

    <!--视频浮层面板-->
    <video-detail-board ref="videoDetailBoard" />

    <!--视频回放面板-->
    <video-record-board ref="videoRecordBoard" />

    <!--中高风险地区来粤返粤人员核查情况统计-->
    <risk-count
      ref="riskCount"
      @showMhRiskDetail="showMhRiskDetail"
    ></risk-count>

    <!--外呼面板-->
    <phone-call-panel />

    <line-up-map
      :pointName="pointName"
      v-if="lineUpMapVisible"
      @closeLineUpMap="lineUpMapVisible = false"
    ></line-up-map>
    <stream
        v-if="streamVisible"
        :data="meetingData"
        @closeStream="streamVisible = false"
    ></stream>
  </div>
</template>

<script>
// import Cookies from "js-cookie";
import MapLayerFilter from "./baseMapLayerFilter";
import MapLegend from "./baseMapLegend";

import RyList from "@/components/MapLayer/RyList";
import RyDetail from "@/components/MapLayer/RyDetail";

import PersonDetail from "@/components/screen/PersonDetail";
import HotelDetail from "@/components/MapLayer/HotelDetail.vue";

import DataTotal from "@/views/big/dataTotal.vue";
import MobileDialog from "@/views/big/MobileDialog.vue";

import { getYMUpdateTime, getHSUpdateTime } from "@/api/bigCharts";
import BaseMapLayer from "@/views/big/layer/BaseMapLayer";
import SamplingPoint from "@/components/screen/SamplingPoint";
import SamplingPointList from "@/components/screen/SamplingPointList";
import riskPlaceList from "@/components/screen/riskPlaceList";
import riskPlaceDetail from "@/components/screen/riskPlaceDetail";
import CloseContactList from "@/components/screen/CloseContactList";
import SpotDetail from "@/components/screen/SpotDetail";
import keyPlace from "@/views/big/keyPlace";
import RiskCount from "@/views/big/RiskCount";
import LineUpMap from "@/views/big/layer/LineUpMap";
import Stream from "@/views/big/layer/Stream";

import chartParty from "@/views/big/chartParty";
import {
  getStreetHealthCode,
  getCloseContactData,
  getSecondCloseContactData,
  getCurrTown,
  getPeopleSum,
  getNucleicCount,
} from "@/api/mapData.js";
import SETTING from "@/config/MapSetting.js";
import GridDetail from "@/views/big/layer/GridDetail";
import mhRiskDetail from "@/components/screen/mhRiskDetail";
import ThreeGroupDetail from "@/views/big/layer/ThreeGroupDetail";
import SpecialPeopleDetail from "@/views/big/layer/SpecialPeopleDetail";
import SpecialPeopleDetailList from "@/views/big/layer/SpecialPeopleDetailList";
import VideoList from "@/views/big/layer/VideoList";
import VideoDetailBoard from "@/views/big/layer/VideoDetailBoard";
import VideoRecordBoard from "@/views/big/layer/VideoRecordBoard";
import StaffDetailList from "@/views/big/layer/StaffDetailList";
import LogDetailList from "@/views/big/layer/LogDetailList";
import DetailList from "@/views/big/layer/DetailList";

import transitVehiclesList from "@/views/big/layer/TransitVehiclesList";
import AllocationHealthCareList from "@/views/big/layer/AllocationHealthCareList";
import consultationSchedulingList from "@/views/big/layer/ConsultationSchedulingList";

import UnitSupportStreet from "@/views/big/layer/UnitSupportStreet";
import TotalToast from "@/components/screen/TotalToast"; // 左上角总数toast

import DataBoard from "@/components/charts/DataBoard";
import BlockStatistics from "@/components/charts/BlockStatistics";

import HistoryList from "@/views/big/layer/HistoryList";
import BigChart from "@/components/charts/BigChart";
import TownCount from "@/views/big/layer/TownCount";

import BigScreenMethods from "@/mixins/BigScreenMethods.js";
import { initAlarmWatcher, initWebsocket } from "@/utils/watcher.js";

const UPDATE_THREHOLD = 1000 * 60 * 5;

export default {
  components: {
    LineUpMap,
    VideoRecordBoard,
    HistoryList,
    PhoneCallPanel: () => import("@/components/common/PhoneCallPanel"),
    BlockStatistics,
    StaffDetailList,
    VideoDetailBoard,
    VideoList,
    SpecialPeopleDetailList,
    SpecialPeopleDetail,
    ThreeGroupDetail,
    GridDetail,
    MapLegend,
    MapLayerFilter,
    BaseMapLayer,
    PersonDetail,
    HotelDetail,
    DataTotal,
    RyList,
    RyDetail,
    keyPlace,
    RiskCount,
    riskPlaceDetail,
    riskPlaceList,
    SpotDetail,
    chartParty,
    mhRiskDetail,
    SamplingPoint,
    SamplingPointList,
    CloseContactList,
    MobileDialog,
    LogDetailList,
    transitVehiclesList,
    AllocationHealthCareList,
    consultationSchedulingList,
    UnitSupportStreet,
    TotalToast,
    DataBoard,
    BigChart,
    TownCount,
    DetailList,
    Stream
  },
  name: "index",
  // 父组件中返回要传给下级的数据
  provide() {
    return {
      handleItemChoosed: this.handleItemChoosed,

    };
  },
  mixins: [BigScreenMethods],
  data() {
    return {
      maskColor: [22, 29, 40, .85],
      showMapFilter: false, //图层过滤
      pointName: "", //当前采集点名称
      streamVisible: false, //直播会议
      lineUpMapVisible: false, //核酸点排队地图
      currTown: "", //当前镇街
      currGrid: "", //当前网格
      townDataPanelVisible: false, //显示街镇统计
      showBig: false, //显示echart大图
      linkData: [], //右侧联动报表
      mapData: {
        heatMapData: [],
        markers: [],
      },
      hotalData: [],
      redYellowData: [],
      detailList: {},
      hotelType: {
        1: "入境者酒店",
        3: "本土（广州市）密切接触者酒店",
        2: "入境者密切接触者酒店",
      },
      zIndex: 1,
      showPlaceMap: false,
      layer: 0, //当前图层: 0 默认地图， 1公安流调  3嘉安花园， 4封控管理区，5流调数据总览,6疫苗接种,7核酸检测 8数据说明,12 人员核查
      websocket: null,
      endStream: false,
      dialogWidth: {
        redYellow: "1040px",
        riskPlace: "980px",
        mhRiskDetail: "1010px",
        closeContact: "900px",
        gridDetail: "1180px",
        samplingPointList: "1100px",
        conventionalNucleicPoint: "1180px",
        massNucleicPoint: "1180px",
      },
      chartUpdateTime: {
        ym: "", //疫苗更新时间
        hs: "", //核酸更新时间
      },

      amountData: {
        redTotal: 0,
        yellowTotal: 0,
        redOther: 0,
        yellowOther: 0,
      },

      layerList: [],

      //声明所有图层id
      layerIds: [],
      //当前显示的图层id
      visibleIds: [],
      // 左上角总数toast提示数据
      toastItemsData: [],
      // 网格流动人口
      gridFlowPeople: [],

      //告警事件
      alarmInfo: {
        x: -9999,
        y: -9999,
        list: [],
      },
      // 核酸采样点计数
      nucleicCount: {
        detail: [],
        updateTime: null,
        dataSource: null,
        fetchTime: null,
      },
      detailListArray: ["conventionalNucleicPoint", "massNucleicPoint"],
      waveLayerData: [],
      meetingData:{},//采样点直播数据
    };
  },
  computed: {
    townOptVisible() {
      return this.$store.state.common.town !== null;
    },
    gridOptVisible() {
      return this.$store.state.common.grid !== null;
    },
    // 左上角总数toast提示
    toastItems() {
      return this.toastItemsData.filter((item) =>
        this.visibleIds.includes(item.dirtyName)
      );
    },
  },
  created() {
    //声明所有图层初始状态
    let arr = [
      {
        id: "boundary",
        visible: true,
      },
      {
        id: "grid",
        visible: false,
      },
    ];
    this.layerList = SETTING.getLayerMenu();

    //上次图层选中的缓存状态
    let cookieIds = JSON.parse(localStorage._selected_layer_ids || "[]");
    const linkData = JSON.parse(localStorage.linkData || "[]");

    if (!localStorage._selected_layer_ids) {
      //第一次进来默认状态（选中红码、特殊人群、肉菜市场）
      cookieIds = ["redYellow", "specialMen", "foodMarket"];
      this.linkData = [
        { code: "healthCodeTrend", chartId: "3306708", id: "redYellow" },
        { code: "tsrq", chartId: "3270523", id: "specialMen" },
        { code: "rcsc", chartId: "3303777", id: "foodMarket" },
      ];
    } else {
      this.linkData = linkData.filter((i) => i.id !== "party");
    }
    this.$store.commit(
      "report/SET_RIGHT_FOLDER_STATE",
      this.linkData.length > 0 ? false : true
    );
    // console.log(526, cookieIds, linkData);
    this.layerList.forEach((item) => {
      if (item.children) {
        let ids = item.children.map((subItem) => {
          if (cookieIds.length > 0) {
            subItem.checked = cookieIds.includes(subItem.id) ? true : false;
          }

          const { id, checked, order, mapFilterVisible } = subItem;
          if (checked) {
            // console.log(id);
            this.visibleIds.push(id);
          }
          return {
            id,
            visible: checked,
            order,
            mapFilterVisible,
          };
        });
        arr = arr.concat(ids);
      }
    });
    //图层渲染排序
    arr.sort((a, b) => {
      return a.order - b.orders;
    });
    this.layerIds = arr;

    this.initAmount();

    this.initInteractive();
  },
  methods: {
    initInteractive() {
      document.addEventListener("click", (event) => {
        const mapPointPop = this.$refs["mapPointPop"];
        if (mapPointPop && !mapPointPop.contains(event.target)) {
          this.resetAlarmInfo();
        }
      });
    },

    //初始化统计数据面板
    async initAmount() {
      //密接次密接人员统计
      const closeContact = await getCloseContactData({ sszj: getCurrTown() });
      const secondCloseContact = await getSecondCloseContactData({
        sszj: getCurrTown(),
      });
      let { nucleicCount } = this;
      if (
        !nucleicCount.fetchTime ||
        nucleicCount.fetchTime - new Date() > UPDATE_THREHOLD
      ) {
        nucleicCount = {
          ...(await getNucleicCount({ sszj: getCurrTown() })),
          fetchTime: new Date(),
        };
      }
      this.toastItemsData = [
        {
          name: "closeContact",
          dirtyName: "mjPeople",
          title: "密接人员",
          color: "#e8473f",
          data: {
            total: closeContact.contactTotal,
            detail: [
              {
                name: "入境",
                num: closeContact.entry,
              },
              {
                name: "本土省外",
                num: closeContact.localOutSide,
              },
              {
                name: "本土省内",
                num: closeContact.localInSide,
              },
              {
                name: "其他",
                num: closeContact.other,
              },
            ],
          },
          about: `密接人员 总数：是密接类型为“密切接触者”，并且转归状态为“继续观察”的人员总数。<br/>
              入境 数：前提条件为密接人员，并且“是否入境人员”值为“是”的人员数量。<br/>
              本土省外 数：前提条件为密接人员，并且“是否入境人员”值为“否”，并且“密接/次密接发现途径”值为“外省协查”的人员数量。<br/>
              本土省内 数：前提条件为密接人员，并且“是否入境人员”值为“否”，并且“密接/次密接发现途径”值为非“外省协查”的人员数量。<br/>
              其他 数：前提条件为密接人员，并且“是否入境人员”值为“空”人员数量。或是“是否入境人员”值为“否”，并且“是否外省协查人员”值为“空”的人员数量。`,
        },
        {
          name: "secondCloseContact",
          dirtyName: "cmjPeople",
          title: "次密接人员",
          color: "#ffff00",
          data: {
            total: secondCloseContact.contactTotal,
            detail: [
              {
                name: "入境",
                num: secondCloseContact.entry,
              },
              {
                name: "本土省外",
                num: secondCloseContact.localOutSide,
              },
              {
                name: "本土省内",
                num: secondCloseContact.localInSide,
              },
              {
                name: "其他",
                num: secondCloseContact.other,
              },
            ],
          },
          about: `次密接人员 总数：是密接类型为“密接的密接”，并且转归状态为“继续观察”的人员总数。<br/>
              入境 数：前提条件为次密接人员，并且“是否入境人员”值为“是”的人员数量。<br/>
              本土省外 数：前提条件为次密接人员，并且“是否入境人员”值为“否”，并且“密接/次密接发现途径”值为“外省协查”的人员数量。<br/>
              本土省内 数：前提条件为次密接人员，并且“是否入境人员”值为“否”，并且“密接/次密接发现途径”值为非“外省协查”的人员数量。<br/>
              其他 数：前提条件为次密接人员，并且“是否入境人员”值为“空”人员数量。或是“是否入境人员”值为“否”，并且“是否外省协查人员”值为“空”的人员数量。`,
        },
        {
          name: "conventionalNucleicPoint",
          dirtyName: "detectionPoint",
          title: "常规核酸采样点",
          color: "#ffff00",
          data: {
            total: nucleicCount.detail.length
              ? nucleicCount.detail.find(
                  (item) => item.key === "常规核酸检测点"
                )?.value
              : 0,
          },
        },
        {
          name: "massNucleicPoint",
          dirtyName: "detectionPoint",
          title: "大规模核酸采样点",
          color: "#009bb7",
          data: {
            total: nucleicCount.detail.length
              ? nucleicCount.detail.find(
                  (item) => item.key === "大规模核酸检测点"
                )?.value
              : 0,
          },
        },
      ];

      //红码人员统计
      getStreetHealthCode({ sszj: getCurrTown() }).then((res) => {
        const { redQt, redTotal,yellowTotal, yellowQt } = res;
        this.amountData.redTotal = redTotal;
          this.amountData.redOther = redQt;
                this.amountData.yellowTotal = yellowTotal;
        this.amountData.yellowOther = yellowQt;
      });
    },

    //触发图层选择事件，更新图层显示隐藏状态
    async handelLayerChange({ ids, target }) {
      console.log(ids, target, 233);
      if (
        this.detailList.spotDetail &&
        this.detailList.spotDetail.layerId === target.id
      ) {
        this.detailList["spotDetail"] = undefined;
      }
      const { id, checked } = target;
      if (checked) {
        switch (id) {
          case "detectionPoint":
            if (
              !this.nucleicCount.fetchTime ||
              this.nucleicCount.fetchTime - new Date() > UPDATE_THREHOLD
            ) {
              getNucleicCount({ sszj: getCurrTown() }).then((res) => {
                this.nucleicCount = {
                  ...res,
                  fetchTime: new Date(),
                };
              });
            }
            break;
        }
      }
      //target用于调整右侧图表
      this.visibleIds = ids;
      this.$refs["baseMapLayer"].toggleLayers(ids);

      // 保存到选择状态到cookie
      // Cookies.set("_selected_layer_ids", JSON.stringify(ids));
      localStorage._selected_layer_ids = JSON.stringify(ids)

      //可联动图表ID
      if (target.checked && target.isLink) {
        this.linkData.unshift(target);
      } else if (!target.checked && target.isLink) {
        this.linkData = this.linkData.filter((i) => i.id !== target.id);
      }
      if (this.linkData.length > 6) {
        this.linkData = this.linkData.splice(0, 6);
      }
      this.linkData.forEach((item) => {
        // console.log(744,item.id);
        switch (item.id) {
          // case 'dangerPeople': // 中高风险地区来粤返粤人员
          // case 'dangerPeopleHeatmap': //中高风险地区来粤返粤人员热力图
          //   if(this.linkData.find(v=>v.code==='dangerPeople')) return false
          //   item = Object.assign(item, {code: 'dangerPeople', chart: 'block'})
          //   break
          case "mjPeople": //密接人员
            item = Object.assign(item, {
              code: "zjqtljqs",
              chartId: "2846164",
              mjlx: "mj",
            });
            break;
          case "cmjPeople": //次密接人员
            item = Object.assign(item, {
              code: "zjqtljqs",
              chartId: "2846164",
              mjlx: "cmj",
            });
            break;
          case "foodMarket": //肉菜市场
            item = Object.assign(item, { code: "rcsc", chartId: "3303777" });
            break;
          case "market": //商超
            item = Object.assign(item, { code: "sc", chartId: "3303933" });
            break;
          case "specialMen": //特殊人群
            item = Object.assign(item, { code: "tsrq", chartId: "3270523" });
            break;
          case "redYellow": //红码人员
            item = Object.assign(item, {
              code: "healthCodeTrend",
              chartId: "3306708",
            });
            break;
          // case 'hotel': // 隔离酒店
          //   item = Object.assign(item, {code:'gljd'})
          //   break
          // case 'hospital':  //物资-医疗资源图表
          //   item = Object.assign(item, {code:'wzylzy',chartId:'3270715'})
          //   break
          case "hotel": // 隔离酒店
            item = Object.assign(item, { code: "gljd", chart: "block" });
            break;
          case "coldWarehouse": // 冷链仓库
            item = Object.assign(item, { code: "llck", chart: "block" });
            break;
          case "detectionGroup": // 核酸采样点
            item = Object.assign(item, {
              code: "detectionGroup",
              chart: "block",
            });
            break;
          case "seafoodEmp": // 水产品企业
            item = Object.assign(item, { code: "seafoodEmp", chart: "block" });
            break;
          case "importedMaterial": // 进口物料企业
            item = Object.assign(item, {
              code: "importedMaterial",
              chart: "block",
            });
            break;
          case "hospital": // 医疗资源统计
            item = Object.assign(item, { code: "hosipital", chart: "block" });
            break;
          default:
            break;
        }
      });
      // this.rightFold=this.linkData.length>0?false:true
      this.$store.commit(
        "report/SET_RIGHT_FOLDER_STATE",
        this.linkData.length > 0 ? false : true
      );
      // Cookies.set("linkData", JSON.stringify(this.linkData));
      localStorage.linkData = JSON.stringify(this.linkData)
    },

    resetAlarmInfo() {
      this.alarmInfo = {
        x: -9999,
        y: -9999,
        list: [],
      };
    },

    async initWaveLayer() {
      //初始化告警强调波纹
      this.$refs["baseMapLayer"].initWaveLayer();

      //获取最初数据
      const { getData } = SETTING.getLayerSetting("event-alarm");
      const data = await getData();
      this.waveLayerData = data.filter((v) => v.totalCount > 0);
      this.$refs["baseMapLayer"].refreshWaveLayer({
        data: data.filter((v) => v.totalCount > 0),
      });
    },

    //地图图层准备完成
    handleLayerReady() {
      //初始化告警强调波纹
      this.initWaveLayer();

      //初始化告警图标
      this.$refs["baseMapLayer"].addLayer({ id: "event-alarm", visible: true });

      //接收告警信息 更新图层
      const ws = initAlarmWatcher();
      ws.onmessage = (msg) => {
        if (msg.data.includes("连接成功")) {
          return;
        }
        try {
          //更新图层
          const { data, type } = JSON.parse(msg.data);
          if (type == "alarmLayer") {
            this.refreshAlarmLayer({ data });
          }
        } catch (e) {
          console.error(e);
        }
      };
    },

    //触发图层点击事件
    async handelLayerClicked({ layerId, attributes, event, target }) {
      console.log(406, layerId, attributes);

      if (layerId !== "event-alarm") {
        this.resetAlarmInfo();
      }
      switch (layerId) {
        case "boundary":
          if (this.$store.state.common.town == attributes.name) {
            // this.$store.commit('common/SET_TOWN', null)
            return;
          } else {
            this.$store.commit("common/SET_TOWN", attributes.name);
          }
          this.currTown = attributes.name;
          this.currGrid = "";
          //开启遮罩下钻
          this.$refs["baseMapLayer"].maskTo(target.graphic);
          //镇街图层相关统计
          this.initAmount();
          break;
        case "grid":
          this.$store.commit("common/SET_GRID", attributes.name);
          this.currGrid = attributes.name;
          //开启遮罩下钻
          this.$refs["baseMapLayer"].maskTo(target.graphic);

          //网格人口统计
          this.gridFlowPeople = await getPeopleSum({
            sswg: attributes.name,
          });
          //网格详情
          this.$set(this.detailList, "gridDetail", {
            ...attributes,
            detailType: "gridDetail",
          });
          break;

        case "event-alarm":
          this.$store.commit("common/SET_ALARM_TOWN", attributes.town);

          var { x, y } = this.$refs["baseMapLayer"].view.toScreen(
            target.graphic.geometry
          );
          this.alarmInfo.town = attributes.town;
          this.alarmInfo.list = [
            {
              name: "hotel",
              label: "防疫酒店告警",
              value: attributes["hotel"],
            },
            {
              name: "keyPlaces",
              label: "重点场所扫码告警",
              value: attributes["keyPlaces"],
            },
            {
              name: "mjPeople",
              label: "密接次密接人员去向核查告警",
              value: attributes["mjPeople"],
            },
            {
              name: "buyMedicine",
              label: "购药记录逾期未核查告警",
              value: attributes["buyMedicine"],
            },
            {
              name: "dangerWorker",
              label: "高风险岗位人员核酸检测告警",
              value: attributes["dangerWorker"],
            },
            {
              name: "specialPeople",
              label: "特殊人群服务告警",
              value: attributes["specialPeople"],
            },
            {
              name: "yellowCode",
              label: "黄码人员过多告警",
              value: attributes["yellowCode"],
            },
          ];
          this.$nextTick(() => {
            let h = this.$refs["mapPointPop"].clientHeight;
            let bodyH = document.body.scrollHeight;
            this.alarmInfo.x = parseInt(x);
            this.alarmInfo.y =
              parseInt(y) + h + 60 > bodyH ? parseInt(y) - h - 60 : parseInt(y);
          });

          break;

        case "hotel":
          //隔离酒店
          this.showHotelDetal(attributes);
          break;
        case "redYellow":
          //红黄码
          var { street, type } = attributes;
          this.$set(this.detailList, `${street}_${type}`, {
            ...attributes,
            detailType: "redYellow",
          });
          break;
        case "hotel-video":
        case "coldWarehouse-video":
        case "driverWorkPoint-video":
        case "detectionPoint-video":
        case "keyPlaces-video":
        case "foodMarket-video":
        case "market-video":
        case "bigDetectionPoint-video":
        case "pharmacy-video":
        case "school-video":
        case "nurseHouse-video":
        case "maternityCenter-video":
        case "detectPointAround-video":
        case "industry-video":
        case "gcyKeyplace-video":
        case "hospital-video":
        case "therapyStation-video":
        case "recovery-video":
        case "maternalChild-video":
        case "mentalHealth-video":
        case "socialServiceCenter-video":
        case "constructionSite-video":
        case "religionPlace-video":
          this.$set(this.detailList, "videoList", {
            ...attributes,
            layerId,
            detailType: "videoList",
            dialogTitle: "视频列表",
          });
          break;
        case "dangerPeople": //中高风险地区来南沙人员
          // this.showMhRiskDetail(attributes)
          this.$refs["riskCount"].openDetail(1, {
            street: attributes.street,
            onlyTable: true,
          });
          break;
        case "delivery": //快递配送人员
          this.$set(this.detailList, "staffList", {
            ...attributes,
            layerId,
            detailType: "staffList",
            dialogTitle: "工作人员明细",
          });
          break;
        case "mjPeople":
        case "cmjPeople": //密接次密接人员待改为特殊面板
          this.$set(this.detailList, `closeContact`, {
            ...attributes,
            layerId,
            detailType: "closeContact",
            dialogTitle: layerId == "mjPeople" ? "密接人员" : "次密接人员",
          });
          break;
        // case "dangerPeople":
        case "driver":
        case "detectionPoint":
        case "coldWarehouse":
        case "inout":
        case "hospital":
        case "pharmacy":
        case "foodMarket":
        case "seafoodEmp":
        case "productEmp":
        case "farmEmp":
        case "buildingEmp":
        case "party":
        case "volunteer":
        case "detectionGroup":
        case "market":
        case "roadgate":
        case "driverWorkPoint":
        case "busEmp":
        case "security":
        case "transitWarehouse":
        case "school":
        case "email":
        case "importedMaterial":
        case "nurseHouse":
        case "maternityCenter":
        case "detectPointAround":
        case "industry":
        case "gcyKeyplace":
        case "therapyStation":
          //普通点图层
          var { templateId, label } = SETTING.getLayerInfo(layerId);
          this.$set(this.detailList, `spotDetail`, {
            layerId,
            templateId,
            popUpTitle: label,
            detailType: "spotDetail",
            ...attributes,
          });
          break;
        case "threeGroup":
          //三人小组
          this.$set(this.detailList, `threeGroupDetail`, {
            ...{ street: attributes.street },
            detailType: "threeGroupDetail",
          });
          break;
        case "specialMen":
          //特殊人群
          this.$set(this.detailList, `specialPeopleDetail`, {
            ...attributes,
            detailType: "specialPeopleDetail",
          });
          break;
        case "keyPlaces":
          //重点场所
          this.$set(this.detailList, "riskPlace", {
            ...attributes,
            detailType: "riskPlace",
          });
          break;
        default:
          break;
      }
    },

    //核酸检测点排队地图
    showLineUpMap(e) {
      this.pointName = e ? (e.yljg || e.cghsjcd) : null;
      this.lineUpMapVisible = true;
    },

    //直播会议
    showStream(e) {
      this.meetingData =  {}
      this.streamVisible = true;
    },

    //触发事件
    handleItemChoosed(event, type) {
      if (type === "chart") {
        this.showBig = true;
        this.chartData = Object.assign({}, event);
      }else if(type === "meeting") {
        this.meetingData = event
        this.streamVisible = true
      } else if (type === "locaSearchVisible") {
        this.$refs.leyerFilter.showMapFilter = false
      } else if (type === 'showMapFilter') {
        this.$refs.mapLegend.locaSearchVisible = false
      }
    },

    /**
     * 获取图表更新时间
     */
    async getChartUpdateTime() {
      let ymTime = await getYMUpdateTime();
      let hsTime = await getHSUpdateTime();
      this.chartUpdateTime = {
        ym: ymTime, //疫苗更新时间
        hs: hsTime, //核酸更新时间
      };
    },

    popTownDataPanel() {
      //展示网格统计数据
      if (this.gridOptVisible) {
        // this.currGrid = this.$store.state.common.grid
        console.log("当前网格", this.currGrid);
      } else {
        //展示镇街统计数据
        this.currTown = getCurrTown();
        console.log("当前镇街", this.currTown);
      }
      this.townDataPanelVisible = true;
    },

    //返回到全局地图
    async backToWhole() {
      await this.$refs["baseMapLayer"].backToWholeFromMask();
      this.$store.commit("common/SET_GRID", null);
      this.$store.commit("common/SET_TOWN", null);
      this.currTown = null;
      this.townDataPanelVisible = false;
      this.initAmount();
    },

    //显示告警事件统计小浮层
    showEventPanel(item) {
      const { name } = item;
      this.$store.commit("common/SET_ALARM_TYPE", name);
      this.switchLayer(9, { reset: false });
    },

    closeDetailList(key) {
      this.$store.commit("common/SET_CUR_CALL_NUMBER", null);
      this.detailList[key] = false;
    },

    //模拟告警事件
    // async handelEventAlarmMsg() {
    //   mockAlarmEvent()
    // },

    //更新事件告警图层
    async refreshAlarmLayer(params = { data: [], recover: false }) {
      const { data, recover } = params;

      const layer = this.$refs["baseMapLayer"].getLayerById("event-alarm");
      const { features } = await layer.queryFeatures();
      const waveArr = [];

      if (recover) {
        //恢复图层状态
        features.forEach((item) => {
          item.attributes.state = 0;
        });
      } else {
        //更新图层数据
        features.forEach((item) => {
          const { town } = item.attributes;
          const { center } = SETTING.findTown(town);
          const { alarmDatas } = data.find((v) => v.sszj.includes(town));
          const totalCount = alarmDatas.reduce((a, b) => {
            return a + b.todayCount;
          }, 0);

          const props = {
            visible: totalCount > 0 ? 1 : 0,
          };

          alarmDatas.forEach(({ name, todayCount }) => {
            props[name] = todayCount;
          });

          if (props.visible) {
            // 强调当前位置
            waveArr.push({
              lngLat: center,
            });
          }
          //更新数据
          Object.assign(item.attributes, props);
        });
      }

      //更新告警图标图层
      const results = await layer.applyEdits({ updateFeatures: features });
      console.log(
        `layer ${layer.id},updateFeatures: ${results.updateFeatures}`
      );

      //更新告警强调波纹
      this.waveLayerData = waveArr;
      this.$refs["baseMapLayer"].refreshWaveLayer({ data: waveArr });
    },
  },
  watch: {
    currTown(val) {
      this.$refs["baseMapLayer"].refreshWaveLayer({
        data: this.waveLayerData.filter((v) => (val ? v.town === val : true)),
      });
    },
  },
  mounted() {
    this.getChartUpdateTime();
    let protocol =
      window.location.protocol.indexOf("https") > -1 ? "wss" : "ws";

    let host =
      process.env.NODE_ENV === "production"
        ? window.location.host
        : "dn.product.iot-cas.com:8081";
    let url = `${protocol}://${host}/yqfk/websocket/spzb/${this.$store.state.user.id}`;

    // 初始化 websocket
    this.websocket = initWebsocket({url});
    // 接收websocket信号
    const _this = this;
    this.websocket.onmessage = function(msg) {
      console.log("视频直播", msg);
      try {
        let data = JSON.parse(msg.data);
        console.log(data);
        if (data.eventCode === "app-spzb-02") {
          _this.endStream = true;
          _this.$refs.baseMapLayer.deleteEventMarker();
          return;
        }
        let pos = [113.532608, 22.808156];
        if (data.location.longitude) {
          pos = [data.location.longitude, data.location.latitude];
        }
        return
        _this.$confirm('收到直播请求', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // window.open(`https://${window.location.host.indexOf('develop') < -1 ? 'dnvideopre.iot-cas.com' : 'dnvideodev.iot-cas.com'}/video/index.html#/?name=${this.$store.state.user.username}&romm=999`)
          window.open(`https://dnvideopre.iot-cas.com/video/index.html#/?name=${_this.$store.state.user.username}&romm=999`)
        }).catch(() => {
        });

      } catch (e) {
        // console.error(msg.data)
      }
    };
  },
};
</script>

<style lang="scss" scoped>
.big-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #20326f;
  ::v-deep{
    .esri-view .esri-view-surface--inset-outline:focus::after {
      outline: auto 0px Highlight !important;
      outline: auto 0px -webkit-focus-ring-color !important;
    }
  }
  .red-yellow-marker-box {
    position: relative;
    .red-yellow-marker-item {
      position: absolute;
    }
    .red-marker-item {
      left: 0;
      top: 0;
      .icon {
        background: url("~@/assets/image/icon-red.svg") no-repeat;
        background-size: 100%;
      }
      .ry-count {
        background-color: #e8473f;
      }
    }
    .street-name {
      position: absolute;
      bottom: -14px;
      right: 32px;
      color: #fff;
      font-size: 14px;
      width: 150px;
      text-align: right;
    }
    .yellow-marker-item {
      left: -50px;
      top: -15px;
      .icon {
        background: url("~@/assets/image/icon-yellow.svg") no-repeat;
        background-size: 100%;
      }
      .ry-count {
        background-color: #dd9b29;
      }
    }
    .icon {
      width: 37px;
      height: 42px;
    }
    .ry-count {
      position: absolute;
      left: 22px;
      top: -6px;
      padding: 0 6px;
      height: 14px;
      line-height: 14px;
      border-radius: 6px;
      text-align: center;
      color: #fff;
      font-size: 12px;
    }
  }
  .total-btn-container {
    position: absolute;
    left: 440px;
    top: 80px;
    .total-btn-wrapper {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      // background: url(../../assets/image/ry-all-btn.png) no-repeat;
      background: url("~@/assets/image/sidebar-bg-unit.png");
      border-radius: 5px;
      min-width: 380px;
      height: 50px;
      line-height: 40px;
      background-size: 100% 100%;
      .t1 {
        font-size: 18px;
        color: #fff;
        margin-right: 4px;
        margin-left: 20px;
      }
      .t2 {
        color: #ffff00;
        font-size: 15px;
        font-weight: 600;
        margin-right: 5px;
      }
    }
  }
  .risk-title {
    font-size: 22px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;
    .addr {
      font-size: 13px;
      margin-left: 10px;
    }
  }
  .grid-tip {
    display: inline-block;
    margin-left: 250px;
    span {
      display: inline-block;
      margin: 0 20px;
    }
  }

  .area-opt {
    position: absolute;
    bottom: 7em;
    left: 50%;
    transform: translateX(-50%);
  }
  .detail_list::v-deep {
    .town-count-wrap {
      top: 8vh;
      .risk-title {
        font-size: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #fff;
      }
    }
  }

  .map-point-pop {
    position: absolute;
    top: 8em;
    left: 35em;
    transform: translate(-50%, 10px);
    padding: 0.4em;
    border-radius: 4px;
    background-color: rgba(25, 41, 91, 0.9);
    /*transition: all .3s;*/
    color: #fff;

    h3 {
      padding: 4px;
      color: #fff;
    }
    li {
      margin-bottom: 4px;
      padding: 4px;
      border-radius: 2px;
      background-color: rgba(40, 65, 132, 0.8);
      cursor: pointer;

      &:hover {
        background-color: #3759b4;
      }
    }
  }
}
</style>
