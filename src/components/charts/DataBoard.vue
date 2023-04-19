<template>
  <div
    class="board"
    :class="[className, countList && countList.length ? 'mt' : '']"
    v-loading="isLoading"
    element-loading-text="加载数据中"
    element-loading-custom-class="loading-mask"
  >
    <div class="header" v-if="!hideTitle">
      <h3 class="title">
        <template v-if="from === 'indexRight'">{{ sszj }}</template>
        <template v-if="alarmVillage&&alarmVillage!=='全部'">{{ alarmVillage }}</template>{{ chartInfo.title }}
      </h3>
      <el-popover
        popper-class="screen-popover"
        v-if="description"
        width="360"
        trigger="hover"
      >
        <div v-html="description"></div>
        <i slot="reference" class="el-icon-question"></i>
      </el-popover>
      <div class="link" @click="openLink" v-if="id === 'jdgltjtb'">详情</div>
    </div>
    <div
      class="chart-total-wrapper"
      v-if="countList && countList.length && countList[0] && countList[0].key"
    >
      <div
        class="chart-total-box"
        :class="{
          pointer: ['qmjtj'].includes(code),
          bgRed: ['密接人员总数', '累计密接人员'].includes(item.key),
        }"
        v-for="(item, index) in countList"
        :key="index"
      >
        <p class="t1">{{ item.key }}</p>
        <p class="t2">
          {{ item.value }}
          <span class="s2" v-if="item.unit">{{ item.unit }}</span>
        </p>

        <i class="icon el-icon-right" v-if="['qmjtj'].includes(code)"></i>
      </div>
    </div>
    <div class="chart-real-wrapper" ref="chart-real-wrapper" :data-code="code">
      <div class="chart-nav-bar" v-if="navBar && navBar.length">
        <div
          class="chart-nav-bar-item"
          v-for="(item, index) in navBar"
          :key="index"
          :class="{ active: index === currentIndex }"
          @click="handleSwitchChart(item, index)"
        >
          {{ item.name }}
        </div>
      </div>
      <component
        :is="componentName"
        :data="chartData"
        :info="chartInfo"
        v-if="chartData"
        :from="from"
        :sswg="sswg"
        :showBigBtn="showBigBtn"
        class="board-item"
        :style="`height:${this.chartHeight}px;`"
        ref="component"
        @onChartClick="(param) => this.$emit('onChartClick', param)"
      ></component>
    </div>
    <div class="footer" v-if="!hideFooter">
      <div class="footer-m">
        <span v-if="updateTime"
          >更新时间：{{
            updateTime && updateTime !== "null"
              ? updateTime
              : "2021-06-08 12:15:19"
          }}</span
        ><br />
        <span v-if="source">数据来源：{{ source }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ChartBoard from "@/components/charts/ChartBoard";
import ChartBoardV1 from "@/components/charts/ChartBoardV1";
import CounterBoard from "@/components/charts/CounterBoard";
import CounterBoardV1 from "@/components/charts/CounterBoardV1";
import GridChart from "@/components/charts/GridChart";
import VideoBoard from "@/components/charts/VideoBoard";
import IframeBoard from "@/components/charts/IframeBoard";
import Moment from "moment";
import {
  getPanelItemDataByCode,
  getHSTotal,
  getJD1,
  getControlAreaSswgs,
} from "@/api/bigCharts";
import { mapState } from "vuex";
import option from "./ChartTheme";

export default {
  name: "DataBoard",
  inject: ["handleItemChoosed"],
  props: {
    id: { type: [String, Number] },
    code: { type: [String, Number], required: true },
    originData: { type: Object }, //直接传入data，不用请求接口
    title: { type: [String, Number], required: false },
    chartHeight: { type: Number, required: false, default: 240 },
    countCode: { type: [String], required: false },
    navBar: { type: [Array], required: false },
    updateTimeType: { type: String, required: false, default: "" },
    className: { type: String },
    about: { type: String }, //数据说明
    from: { type: String }, //来源说明
    mjlx: { type: String }, //密接、次密接，密接类型传参区分展示折线图
    grid: { type: String }, //所属网格
    hideTitle: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
    },
    options: {
      type: Object,
    },
    showBigBtn: { type: Boolean, default: true },
    alarmVillage: { type: String } // 城中村告警情况
  },
  components: {
    ChartBoard,
    ChartBoardV1,
    CounterBoard,
    CounterBoardV1,
    VideoBoard,
    IframeBoard,
    GridChart,
  },

  data() {
    return {
      // 组件名称
      componentName: null,
      // 图表基本信息
      chartInfo: {},
      // 图表内容
      chartData: null,
      // 加载中
      isLoading: false,

      //数据来源
      source: "",
      //说明
      description: "",
      //更新时间
      updateTime: "",
      countList: [],
      currentIndex: 1,
      sszj: "", //所属镇街
      sswg: "", //所属网格
      showModal: true,
    };
  },
  watch: {
    grid: {
      handler() {
          this.getData();
      },
    //   immediate: true,
    },
    mjlx: {
      handler(val) {
        if (val) {
          this.mjlx = val;
          this.showModal = false;
          this.getData();
        }
      },
    //   immediate: true,
    },
    code: {
      handler(val) {
        if (this.from === "indexRight") {
          this.sszj = this.town;
          this.showModal = false;
          this.getData();
        }
      },
      immediate: true,
    },
    from: {
      handler(val) {
        if (val === "sealAreatownCount") {
          //封控区统计报表(按网格)
          this.sswg = this.sealarea.sswg;
          this.getData();
        } else if (val === "indextownCount") {
          //首页大屏（按镇街）
          this.sszj = this.town;
          this.getData();
        } else if (val === "sealAreaLeft") {
          this.getControlAreaSswgs();
        }
      },
    //   immediate: true,
    },
    town(val) {
      let fromArr = ["indexRight"];
      if (fromArr.includes(this.from)) {
        //监听首页大屏街镇切换
        this.sszj = val;
        this.getData();
      }
    },
    village(){
        this.getData()
    },
    // alarmVillage(){
    //   this.getData()
    // },
    sealarea(val) {
      if (this.from === "sealAreaLeft") {
        //封控区左侧网格切换
        this.sswg = val ? val.sswg : null;
        if (!val) {
          this.getControlAreaSswgs();
        } else {
          this.getData();
        }
      }
    },
    options() {
      this.getData();
    },
  },
  computed: {
    ...mapState("common", ["town", "sealarea",'village']),
  },
  async mounted() {
    this.from === 'czcPanel' ? this.isLoading = false : this.isLoading = true
    let fromSource = [
      "indexRight",
      "sealAreatownCount",
      "sealAreaLeft",
    ];
    if (!fromSource.includes(this.from)) {
      await this.getData();
    }
    this.isLoading = false;
  },
  methods: {
    // 获取图表信息
    async getData(id) {
      this.from === 'czcPanel' ? this.isLoading = false : this.isLoading = true
      this.componentName = "";
      const { code, showModal, options } = this;
      //无需过滤报表数组ID
      return new Promise(async (resolve, reject) => {
        let params = {
          code,
          showModal,
          ...options,
        };
        if (this.mjlx) params.mjlx = this.mjlx;
        // if (this.alarmVillage) params.village = this.alarmVillage;
        if(this.village){
            params.sscj = this.village
        }
        else if(this.grid){
            params.sswg = this.grid;
        }
        else if(this.sswg){
            params.sswg = this.sswg;
        }
        else if(this.sszj){
            params.sszj = this.town;
        }

        let res
        if(this.originData){
            res = this.originData
        }
        else{
            res = await getPanelItemDataByCode(params);
        }
        //   console.log('图表数据',res)
        this.chartInfo = {
          ...this.info,
          code: res.code,
          title: this.title || res.title,
        };
        //密接、次密接累计趋势特殊处理
        if (this.mjlx) {
          this.chartInfo.title =
            this.mjlx === "mj" ? "密接累计趋势" : "次密接累计趋势";
        }
        this.source = res.source;
        this.description = this.about || res.description;
        if (!this.updateTimeType) {
          this.updateTime =
            res.updateTime && res.updateTime == "null"
              ? Moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
              : res.updateTime;
        }
        // 根据图表type确定vue组件类型
        //特殊统计图处理（中高风险地区来粤返粤人员核查情况）
        this.componentName = ChartBoard;
        this.componentName = this.getComponent(res.itemType);
        if (res.panelItemData) {
          this.chartData = res;
        }else{
          res.panelItemData = {}
          this.chartData = res;
        }
        this.isLoading = false;
        this.$emit('update',this.chartData)
        resolve();
      });
    },
    // 获取图表上方黄色统计模块数据
    getCountData() {
      return new Promise((resolve, reject) => {
        if (this.countCode) {
          if (this.countCode === "hsjczrs") {
            getHSTotal().then((res) => {
              let optionData = res.optionData.map((v) => {
                v.key = v.name;
                v.value = v.value;
                if (v.id === "010") {
                  v.key = "近3日核酸检测占比";
                }
                return v;
              });
              this.countList = [
                optionData.find((v) => v.id === "001"),
                optionData.find((v) => v.id === "010"),
              ];
              resolve();
            });
          } else if (this.countCode === "jd1") {
            getJD1().then((res) => {
              this.countList = res.map((v) => {
                v.key = v.name;
                return v;
              });
              resolve();
            });
          } else {
            getPanelItemDataByCode({
              code: this.countCode,
              sszj: this.sszj,
            }).then((res) => {
              let data = res.panelItemData.data || {};
              this.countList = Object.keys(data).reduce((arr, key, index) => {
                arr.push({
                  key,
                  value: data[key],
                });
                if (this.countCode === "qmrsljqs") {
                  return arr.reverse();
                } else {
                  return arr;
                }
              }, []);

              resolve();
            });
          }
        } else {
          resolve();
        }
      });
    },
    handleSwitchChart(item, index) {
      this.currentIndex = index;
      // this.getData(item.id);
    },

    async getControlAreaSswgs() {
      let res = await getControlAreaSswgs();
      this.sswg = res;
      if (!res) this.sswg = "null";
      this.getData();
    },
    // 获取对应组件
    getComponent(type) {
      switch (type) {
        case "PIE":
        case "BAR":
        case "LINE":
        case "SCATTER":
        case "MAP":
        case "CANDLESTICK":
        case "RADAR":
        case "HEATMAP":
        case "GRAPH":
        case "GAUGE":
        case "FUNNEL":
        case "TREE":
          return ChartBoard;
        case "PieChart":
        case "Histogram":
        case "LineChart":
          return ChartBoardV1;
        case "Counter":
          // return CounterBoard;
          return CounterBoardV1;
        case "VIDEO":
          return VideoBoard;
        case "Iframe":
          return IframeBoard;
        case "List":
          return GridChart;
        default:
          break;
      }
    },
    openLink() {
      window.open(
        location.origin + location.pathname + "#/dataManage/hotel?statu=6",
        "_blank"
      );
    },
  },
};
</script>

<style lang="scss" type="text/scss">
body .report-layer .sidebar .side-box.side-box1 {
  .header {
    //height: 58px;
  }
  .title {
    //margin-left: 16px;
    //margin-top: 12px;
  }
}
.board {
  position: relative;
  height: 100%;
  overflow: hidden;
  &.mt {
    .board-item {
      height: calc(100% - 165px);
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
  .chart-real-wrapper {
    //height: 100%;
    position: relative;
  }
  .chart-nav-bar {
    position: absolute;
    left: 5x;
    top: 0;
    z-index: 9;
    display: flex;
    align-items: center;
    .chart-nav-bar-item {
      cursor: pointer;
      width: 48px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      background-color: #1f3068;
      font-size: 12px;
      color: #5b6eab;
      margin-right: 1px;
      &.active {
        background-color: #2544a6;
        color: #fff;
      }
    }
  }

  .header {
    box-sizing: border-box;
    background: url(../../assets/image/bigCharts/title-bg1.png);
    width: 398px;
    height: 46px;
    background-size: 100%;
    margin: -1px;
    position: relative;
    .title {
      display: inline-block;
      margin-left: 16px;
      margin-top: 8px;
      padding: 0 0.5em;
      font-size: 16px;
      line-height: 1.1em;
      font-weight: normal;
      color: #95dafa;
    }
    .link {
      cursor: pointer;
      color: #fff;
      right: 60px;
      top: 0px;
      position: absolute;
    }
  }
  .footer {
    //position: absolute;
    //bottom: 4px;
    //left: 0;
    //width: 100%;
    box-sizing: border-box;
    text-align: left;
    //height: 24px;
    //line-height: 24px;
    vertical-align: top;
    font-size: 12px;
    color: #6686e6;
    margin: 4px 20px 0;
    padding: 5px 10px;
    word-wrap: break-word;
    .footer-m {
      display: inline-block;
      word-wrap: break-word;
    }
    span {
      display: inline-block;
      margin-right: 4px;
    }
  }
  .board-item {
    height: calc(100% - 70px);
  }
  .chart-total-wrapper {
    padding: 8px 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .chart-total-box {
      width: 39%;
      background-color: #1d306d;
      padding: 10px 12px;
      text-align: center;
      margin: 5px;
      position: relative;
      .t1 {
        font-size: 12px;
        color: #fff;
        //padding: 0 30px;
        max-width: 100px;
        margin: 0 auto;
        text-align: center;
      }
      .t2 {
        margin-top: 4px;
        font-size: 23px;
        color: #ffff00;
        font-weight: 600;
        .s2 {
          font-size: 12px;
          color: #fff;
        }
      }
      .el-icon-right {
        position: absolute;
        right: 10px;
        top: 43%;
      }
    }
    .pointer {
      cursor: pointer;
      background: linear-gradient(
        90deg,
        rgba(244, 151, 77, 0.2) 0%,
        rgba(241, 153, 71, 0.03) 100%
      );
    }
    .bgRed {
      background: linear-gradient(
        90deg,
        rgba(220, 30, 0, 0.2) 0%,
        rgba(220, 30, 0, 0.05) 100%
      );
      .t2 {
        color: #ff0000;
      }
    }
    .bgYellow {
      background: linear-gradient(
        90deg,
        rgba(244, 151, 77, 0.2) 0%,
        rgba(241, 153, 71, 0.03) 100%
      );
    }
  }
}
.el-popover__reference-wrapper {
  color: #fff;
}
</style>
