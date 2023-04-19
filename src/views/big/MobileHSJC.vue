<!-- 核酸检测 -->
<template>
  <div class="hsjc">
    <div class="total-box">
      <div class="box-wrap">
        <div class="total-data">
          <!-- 核酸检测 -->
          <div class="title-wrap">
            <div class="m-title">近3日核酸检测数据总览</div>
            <i class="el-icon-question" @click="lookDesc('top1')" />
          </div>
          <div class="total-box-line">
            <div>
              <div class="data-list">

                <div class="list-item" v-for="(item, index) in jcList2" :key="index">
                  <div class="item-title">{{ item.name }}</div>
                  <div :class="item.id" class="item-value" :style="{ color: item.color || '' }">
                    {{ item.count }}
                    <span v-if="item.unit">{{ item.unit }}</span>
                  </div>
                </div>
              </div>

              <div class="update-time">
                更新时间：{{ updateTime }}
                <span style="margin-left:30px;">
                  数据来源：区共享平台

                </span>
              </div>
            </div>

          </div>

        </div>
        <div class="charts">
          <div class="epidemic">
            <section>
              <h2>
                本地核酸检测人数
                <i class="el-icon-question" @click="lookDesc('hsjcrs')" />
              </h2>
              <!-- <img
                class="desc-img"
                :src="baseUrl + '/static/image/ctrl/question-line.svg'"
                @click="lookDesc('hsjcrs')"
              /> -->
              <div class="chart-content">
                <ul class="period-selector">
                  <li class="period-selector-li" v-for="(item, index) in period" :key="index" @click="updateCharts(item)" :class="{ active: currIndex == item.id }">
                    {{ item.label }}
                  </li>
                </ul>
              </div>
              <chart-box @updateTime="updateTimeEvent" :code="code1" :period="period" title="本地核酸检测人数" v-if="showCode1" @initChart="initChart1"></chart-box>
              <div class="data-list-time">{{ "更新时间: " + cupdateTime1 }}<br />{{ "数据来源: " + datasource }}</div>
            </section>
          </div>

          <div class="epidemic">
            <section>
              <h2>
                入境人员检测人数
                <i class="el-icon-question" @click="lookDesc('14tnjjryjcrs')" />
              </h2>
              <!-- <img
                class="desc-img"
                :src="baseUrl + '/static/image/ctrl/question-line.svg'"
                @click="lookDesc('14tnjjryjcrs')"
              /> -->
              <div class="chart-content">
                <ul class="period-selector">
                  <li class="period-selector-li" v-for="(item, index) in period2" :key="index" @click="updateCharts2(item)" :class="{ active: currIndex2 == item.id }">
                    {{ item.label }}
                  </li>
                </ul>
              </div>
              <div class="box">
                <chart-box :code="code2" :period="period2" title="入境人员检测人数" v-if="showCode2" @updateTime="updateTimeEvent" @initChart="initChart2"></chart-box>
              </div>

              <div class="data-list-time">{{ "更新时间: " + cupdateTime2 }}<br />{{ "数据来源: " + datasource }}</div>
            </section>
          </div>

          <div class="epidemic">
            <section>
              <h2>
                外籍人员检测人数
                <i class="el-icon-question" @click="lookDesc('7twjryjcrs')" />
              </h2>

              <div class="chart-content">
                <ul class="period-selector">
                  <li class="period-selector-li" v-for="(item, index) in period3" :key="index" @click="updateCharts3(item)" :class="{ active: currIndex3 == item.id }">
                    {{ item.label }}
                  </li>
                </ul>
              </div>
              <div class="box">
                <chart-box :code="code3" :period="period3" title="入境人员检测人数" v-if="showCode3" @updateTime="updateTimeEvent" @initChart="initChart3"></chart-box>
              </div>

              <div class="data-list-time">{{ "更新时间: " + cupdateTime3 }}<br />{{ "数据来源: " + datasource }}</div>
            </section>
          </div>
        </div>
        <!-- 重点行业人员昨日核酸检测数据概览 -->
        <div class="total-data">
          <div class="title-wrap">
            <div class="m-title">重点行业人员核酸检测数据概览</div>
          </div>
          <div class="total-box-line">
            <div>
              <div class="data-list">

                <div class="list-item" v-for="(item, index) in overviewList" :key="index">
                  <div class="item-title">{{ item.label }}</div>
                  <div :class="item.id" class="item-value" :style="{ color: item.color || '' }">
                    {{ item.value }}
                    <span v-if="item.unit">{{ item.unit }}</span>
                  </div>
                </div>
              </div>
              <div class="update-time">
                更新时间：{{ overviewUpdateTime }}
                <span style="margin-left:30px;">
                  数据来源：区共享平台

                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- 重点行业人员昨日未做核酸人数 -->
        <div class="not-done">
          <div class="title-wrap">
            <div class="m-title">重点行业人员核酸不合规人数</div>
          </div>
          <div class="not-done-chart">
            <!-- <chart-box :code="code4" @initChart="initChart4" :showTitle="false" :showMagnifying="false" ></chart-box> -->
            <ChartBoard v-if="chartData" :info="{code:code4}" :data="chartData"/>
          </div>
          <div class="update-time">
                更新时间：{{ cupdateTime4 }}
                <span style="margin-left:30px;">
                  数据来源：区共享平台

                </span>
              </div>
        </div>
        <!-- 重点行业人员昨日未做核酸详单 -->
        <div class="not-done">
          <div class="title-wrap">
            <div class="m-title">重点行业人员核酸不合规详单</div>
          </div>
          <table-page :data="tableListData" :filter="filter" :hideKeyFilter="true" @search="search" @resetSearch="resetSearch" customClass="staff_table" @sizeChange="sizeChange" @tableSelectionChange="tableSelectionChange" @currentChange="currentChange">
            <template slot="searchFilter">
              <div class="search-box">
                <!-- <el-form :inline="true" :model="filter" label-width="360px"> -->
                <el-form :inline="true" :model="filter" label-width="120px" @keyup.enter.native="getData">
                  <el-form-item label="所属镇街">
                    <el-select v-model="filter.sszj">
                      <el-option :value="item" :label="item" v-for="item in sszjList" :key="item" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="主体名称">
                    <el-input v-model="filter.ztmc">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="行业细类">
                    <el-input v-model="filter.hyxl">
                    </el-input>
                  </el-form-item>
                </el-form>
                <!-- </el-form> -->
              </div>
            </template>
            <template slot="controler">
              <el-button
                  type="primary"
                  @click="exportData"
              >导出</el-button
              >
            </template>

          </table-page>
        </div>
      </div>
    </div>
    <epidemic-explaination v-show="isVisible" :title="descTitle" :txtList="descList" @closed="onCloseDesc()" />
  </div>
</template>

<script>
// import { formatDate } from "@/utils/common";
import { getPanelItemDataByCode } from "@/api/chart";
import {
  // getCountStaticData,
  get_nulacidStatistics,
  get_NulacidGetUpdateTime,
  get_nsq7Dayhsjc,
  get_overview,
  post_detail,
  exportHsData
} from "@/api/epidemicM";
// import { chartSetting } from "@/config/setting";
// import echarts from "@/plugins/echarts";

import ChartBox from "@/components/dasboard/ChartBox.vue";
import EpidemicExplaination from "./MobileEpidemicExplaination.vue";
import TablePage from 'zkzc-table-page';
import TablePageFunc from "@/utils/tablepage.js";
import ChartBoard from "@/components/charts/ChartBoard";

export default {
  components: {
    ChartBox,
    EpidemicExplaination,
    TablePage,
    ChartBoard

  },
  mixins: [TablePageFunc],
  data () {
    return {
      baseUrl: process.env.BASE_URL,
      isVisible: false,
      descTitle: "",
      descList: [],
      jcList1: [
        // {
        //   id: "jczrc",
        //   name: "核酸检测总人次",
        //   count: 233.4,
        //   unit: "万",
        // },
      ],

      jcList2: [

      ],

      importantList: [
        {
          id: "qzrs",
          name: "确诊人数",
          count: 23,
        },
        {
          id: "mjzs",
          name: "密接者人数",
          count: 134,
        },
        {
          id: "cmjzs",
          name: "次密接者人数",
          count: 244,
        },
        {
          id: "near14s",
          name: "近14天去过荔湾区总数",
          count: 102,
        },
        {
          id: "near7s",
          name: "近7天核酸检测过人数",
          count: 84,
        },
        {
          id: "ymycfgl",
          name: "疫苗一次接种覆盖率",
          count: "67%",
        },
        {
          id: "ymecfgl",
          name: "疫苗二次接种覆盖率",
          count: "50%",
        },
      ],

      items: [],
      items2: [],
      items3: [],
      chartList: [],
      // isVisible: false,
      updateTime: "",
      datasource: '区共享平台',

      currIndex: 0,
      //图表统计间隔
      period: [
        { label: "日", value: "getDaysNulacid", id: 0 },
        { label: "周", value: "getWeeksNulacid", id: 1 },
        { label: "月", value: "getMonthsNulacid", id: 2 },
      ],
      code1: "getDaysNulacid",
      showCode1: true,

      currIndex2: 0,
      //图表统计间隔
      period2: [
        { label: "日", value: "getRjryjzDay", id: 0 },
        { label: "周", value: "getRjryjzWeek", id: 1 },
        { label: "月", value: "getRjryjzMonth", id: 2 },
      ],
      code2: "getRjryjzDay",
      showCode2: true,

      currIndex3: 0,
      //图表统计间隔
      period3: [
        { label: "日", value: "getWjryjcDay", id: 0 },
        { label: "周", value: "getWjryjcWeek", id: 1 },
        { label: "月", value: "getWjryjcMonth", id: 2 },
      ],
      code3: "getWjryjcDay",
      showCode3: true,
      code4: "zdhyryzrwzhers",
      wjhsyxrs: "",
      // updateTime: "",

      cupdateTime1: "",
      cupdateTime2: "",
      cupdateTime3: "",
      cupdateTime4: "",
      nsq7Dayhsjc: null,
      nshsUpdateTime: null,
      filter: {
        sszj: '',
        ztmc: '',
        hyxl: '',
        pageNum: 1,
        pageSize: 10,
        rowTotal: 1,
        pageSizes: [10, 20, 50, 100],
      },
      sszjList: [
        "南沙街",
        "珠江街",
        "龙穴街",
        "大岗镇",
        "榄核镇",
        "黄阁镇",
        "东涌镇",
        "横沥镇",
        "万顷沙镇"
      ], //3街6镇列表
      tableListData: {
        selection: true,
        columnFunctionsWidth: 250, // 操作栏宽度
        tableData: [], //表格内容
        tableKeys: [
          {
            id: "sszj",
            label: "所属镇街",
            allways: true,

          },
          {
            id: "hyxl",
            label: "行业细类",

          },
          {
            id: "jcdx",
            label: "检查对象",

          },
          {
            id: "hsgz",
            label: "核酸规则",

          },
          {
            id: "ztmc",
            label: "主体名称",

          },
          {
            id: "xm",
            label: "姓名",

          },
          {
            id: "sfzhm",
            label: "身份证号",

          },
          {
            id: "sjhm",
            label: "手机号码",

          },
          {
            id: "zhhssj",
            label: "规则内最后核酸时间",

          },
          {
            id: "hscs",
            label: "规则内核酸次数",

          },

          {
            id: "hshqsj",
            label: "核酸数据获取时间",

          }
        ], //表头
        tableFunctions: [
          // {
          //   label: "查看详情",
          //   method: this.checkProcess,
          // },
        ],
      },
      overviewList: [],
      chartData:'',
      overviewUpdateTime:''
    };
  },
  computed: {
    lsrkkUpdatime () {
      let time = "";
      if (this.updateTime && this.updateTime != "") {
        let arr = this.updateTime.split(" ");
        if (arr && arr.length > 0) {
          time = arr[0] + " 00:00";
        }
      }
      return time;
    },
  },
  created () {
    this.chart = [];
  },
  mounted () {

    let _jcList1 = [];
    let _jcList2 = [];
    let _self = this;
    get_nulacidStatistics().then((res) => {
      res.optionData.forEach((item) => {
        if (item.id == "001") {
          _jcList1.push({
            id: "jczrc",
            // name: item.name,
            name: "近一个月核酸检测总人次",
            count: item.value,
            unit: "万",
          });
        } else {
          if (item.id == "002") {
            _jcList2.push({
              id: "hjrk",
              name: item.name,
              count: item.value,
              unit: "万",
              color: "#F4974E",
            });
          } else if (item.id == "003") {
            _jcList2.push({
              id: "lsrk",
              name: item.name,
              count: item.value,
              unit: "万",
              color: "#F4974E",
            });
          } else if (item.id == "004") {
            _jcList2.push({
              id: "qqczrk",
              name: item.name,
              count: item.value,
              unit: "万",
              color: "#F4974E",
            });
          } else if (item.id == "005") {
            _jcList2.push({
              id: "hjhsyxrc",
              name: item.name,
              count: item.value,
              unit: "万",
            });
          } else if (item.id == "006") {
            _jcList2.push({
              id: "lshsyxrs",
              name: item.name,
              count: item.value,
              unit: "万",
            });
          } else if (item.id == "007") {
            _jcList2.push({
              id: "zhsyxrs",
              name: item.name,
              count: item.value,
              unit: "万",
            });
          } else if (item.id == "008") {
            _jcList2.push({
              id: "hjhsyxzb",
              name: item.name,
              count: item.value,
            });
          } else if (item.id == "009") {
            _jcList2.push({
              id: "lshsyxzb",
              name: item.name,
              count: item.value,
            });
          } else if (item.id == "010") {
            _jcList2.push({
              id: "zhsyxzb",
              name: item.name,
              count: item.value,
            });
          } else if (item.id == "011") {
            _self.wjhsyxrs = item.value;
            // _jcList2.push({
            //   id: "wjhsyxrs",
            //   name: item.name,
            //   count: item.value,
            // });
          }
        }
      });
      this.jcList1 = _jcList1;
      this.jcList2 = _jcList2;
      // console.log(this.jcList1, this.jcList2);

      get_nsq7Dayhsjc().then((res) => {
        this.nsq7Dayhsjc = res.optionData.map((item, index) => {
          item.count = item.value;
          item.color = "#00ca56"
          switch (item.id) {
            case "6":
              item.id = "near7s";
              break;
          }
          return item;
        });
      });
      get_NulacidGetUpdateTime().then(res => {
        this.nshsUpdateTime = res
      })
    });

    this.getUpdateTime();
    this.getOverview()
    this.getData()
    this.getChartData(this.code4)
    //this.renderCharts();
  },
  methods: {
    /**
     * 昨日核酸检测数据概览
     */
    getOverview () {
      get_overview().then(res => {
        const { count = 0, check_count = 0, uncheck_count = 0 } = res
        this.overviewList = [
          { label: '应检人数', value: count, unit: '万', color: '#fff' },
          { label: '已检人数', value: check_count, unit: '万', color: '#fff' },
          { label: '不合规人数', value: uncheck_count, unit: '万', color: '#fff' }
        ]
        this.overviewUpdateTime = res.updateTime || '-'
      })
    },
    async getChartData(code){
      const params = {code}
       let res = await getPanelItemDataByCode(params);
       this.chartData = res
       this.cupdateTime4 = res.updateTime || '-'
    },
    initChart1 (chart) {
      this.chart[0] = chart;
    },
    initChart2 (chart) {
      this.chart[1] = chart;
    },
    initChart3 (chart) {
      this.chart[2] = chart;
    },
    initChart4 (chart) {
      this.chart[3] = chart;
    },
    async getUpdateTime () {
      const res = await get_NulacidGetUpdateTime();
      this.updateTime = res;
    },
    updateTimeEvent (e) {
      console.log(e);
      if (
        e.code == "getDaysNulacid" ||
        e.code == "getWeeksNulacid" ||
        e.code == "getMonthsNulacid"
      ) {
        this.cupdateTime1 = e.updateTime;
      } else if (
        e.code == "getRjryjzDay" ||
        e.code == "getRjryjzWeek" ||
        e.code == "getRjryjzMonth"
      ) {
        this.cupdateTime2 = e.updateTime;
      } else if (
        e.code == "getWjryjcDay" ||
        e.code == "getWjryjcWeek" ||
        e.code == "getWjryjcMonth"
      ) {
        this.cupdateTime3 = e.updateTime;
      }
    },
    gotoCtrl (path) {
      this.$router.push({ path });
    },
    //更新疫苗接种人数趋势报表
    updateCharts (val) {
      this.currIndex = val.id;
      this.showCode1 = false;
      this.$nextTick((_) => {
        this.code1 = val.value;
        this.showCode1 = true;
      });
    },
    updateCharts2 (val) {
      this.currIndex2 = val.id;
      this.showCode2 = false;
      this.$nextTick((_) => {
        this.code2 = val.value;
        this.showCode2 = true;
      });
    },
    updateCharts3 (val) {
      this.currIndex3 = val.id;
      this.showCode3 = false;
      this.$nextTick((_) => {
        this.code3 = val.value;
        this.showCode3 = true;
      });
    },
    onCloseDesc () {
      this.isVisible = false;
      this.chart.forEach((item) => {
        item.setOption({ tooltip: { show: true } });
      });
    },
    lookDesc (code) {
      this.chart.forEach((item) => {
        item.setOption({ tooltip: { show: false } });
      });
      switch (code) {
        case "top1":
          this.descTitle = "数据说明";
          this.descList = [
            {
              txt:
                "1、核酸检测数据通过区公共信息资源共享服务平台对接广东省政务大数据中心获取，经智慧南沙系统清洗、分析后生成各统计项数据，每隔两小时更新。",
            },
            // {
            //   txt:
            //     "2、核酸检测总人次：从2021年5月21日起截至数据更新时间，南沙区常住人口累计做过的核酸检测的总人次。",
            // },
            {
              txt:
                "2、流动人员由区委政法委提供数据，不定时导入到疫情防控指挥平台数据台账管理系统，本平台进行统计。户籍人口由区公共信息资源共享服务平台对接到本系统，本平台进行统计。",
            },
            {
              txt:
                "3、户籍核酸检测人员：近3日内，对接核酸检测数据的人员中，属于南沙区户籍做过核酸检测的人员。",
            },
            {
              txt:
                "4、来穗核酸检测人员：近3日内，对接核酸检测数据的人员中，不属于南沙区户籍做过核酸检测的人员。",
            },
            {
              txt:
                "5、户籍核酸检测占比=近3日内，对接核酸检测数据的户籍核酸检测人数/全区户籍人口总数x100%。",
            },
            {
              txt:
                "6、来穗核酸检测占比=近3日内，对接核酸检测数据的来穗核酸检测人数/全区来穗人口总数x100%。",
            },
            {
              txt:
                "7、总核酸检测占比= 近3日内，（户籍核酸检测人数+来穗核酸检测人数）/全区常住人口总数x100%。",
            },
          ];
          break;
        case "hsjcrs":
          this.descTitle = "数据说明";
          this.descList = [
            {
              txt:
                "以当日计算，对接核酸检测数据的人员中，分别属于南沙区户籍人员并做过核酸检测和来穗人员并做过核酸检测的每日人数统计，且按周/月累加。",
            },
          ];
          break;
        case "14tnjjryjcrs":
          this.descTitle = "数据说明";
          this.descList = [
            {
              txt:
                "入境人员检测人数：以当日计算，对接核酸检测数据的人员中，属于入境人员并做过核酸检测的每日人数统计，且按周/月累加。",
            },
          ];
          break;
        case "7twjryjcrs":
          this.descTitle = "数据说明";
          this.descList = [
            {
              txt:
                "以当日计算，对接核酸检测数据的人员中，属于外籍人员并做过核酸检测的每日人数统计，且按周/月累加。",
            },
          ];
          break;
      }
      this.isVisible = true;
    },
    getData () {
      let {sszj,ztmc,hyxl,pageNum,pageSize} = this.filter
      let condition ={
        sszj,
        ztmc,
        hyxl
      }
      post_detail({condition, page: pageNum, pageSize}).then(res=>{
        this.tableListData.tableData = res.data
        this.filter.pageSize = res.pageSize
        this.filter.pageNum = res.page
        this.filter.rowTotal = res.total
      })
    },
    search () {
      this.filter.pageNum = 1;
      this.getData();
    },
    resetSearch () {
      this.filter = {
        status: "",
        dateRange: [],
      };
      this.getData();
    },
    async exportData () {
      let data = {}
      let {sszj,ztmc,hyxl,pageNum,pageSize} = this.filter
      if (this.multiData.length === 0) {
        data = {sszj, ztmc,hyxl}
      }else {
        data.ids = this.multiData.map(item => item.id)
      }
      await exportHsData(data)
      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true,
      });

    }
  },
};
</script>

<style lang="scss" scoped>
.hsjc {
  color: #fff;
  .total-box {
    // .total-box-line{
    //   display: flex;
    //   overflow: auto;
    // }
    * {
      // border: 1px solid #f00;
    }
    i {
      cursor: pointer;
    }
    .title-wrap {
      display: flex;
      align-items: center;
      font-size: 16px;
      i {
        margin-left: 10px;
      }
    }
    .total-data {
      background-color: rgba($color: #223e7e, $alpha: 1);
      margin-top: 20px;
      padding: 20px;

      .data-list {
        display: flex;
        .list-item {
          background-color: #324f96;
          margin: 8px;
          padding: 5px;
          width: 150px;
          text-align: center;
          font-size: 14px;
          .item-title {
            white-space: nowrap;
          }
          .item-value {
            font-size: 18px;
            font-weight: 600;
            white-space: nowrap;
            color: #fffe00;
            span {
              font-size: 14px;
              font-weight: normal;
              color: #fff;
            }
          }
        }
      }

    }

    .charts {
      display: flex;
      color: #fff;
      margin-top: 20px;
      justify-content: space-between;
      h2 {
        color: #fff !important;
        margin-bottom: 10px;
      }
      .epidemic {
        background-color: #324f96;
        width: 32%;
        padding: 20px;
        box-sizing: border-box;
        .box {
          height: 300px;
        }
        .period-selector {
          display: flex;
          .period-selector-li {
            padding: 7px 37px;
            border: 1px solid #4060b2;
            // border-radius: 4px;
            cursor: pointer;
            &.active {
              background-color: #5166ff;
            }
            & + .period-selector-li {
              margin-left: -1px;
            }
            &:first-of-type {
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
            }
            &:last-of-type {
              border-top-right-radius: 4px;
              border-bottom-right-radius: 4px;
            }
          }
        }
        .data-list-time {
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          opacity: 0.5;
        }
      }
    }
  }
}
.not-done {
  background-color: #223e7e;
  margin-top: 20px;
  padding: 20px;
  .not-done-chart {
    width: 100%;
    height: 300px;
  }
}
.update-time {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.5;
  white-space: nowrap;
}
</style>
