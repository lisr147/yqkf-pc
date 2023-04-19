<template>
  <div class="analysis-page" ref="report">
    <header class="header-box">
      <el-radio-group class="tab-btn" v-model="activeTab">
        <el-radio-button label="使用情况查询">使用情况查询</el-radio-button>
        <el-radio-button label="累计使用统计">累计使用统计</el-radio-button>
      </el-radio-group>
      <h3>南沙区疫情防控指挥平台{{ pageName }}使用情况可视化分析</h3>
      <div class="tips" v-if="activeTab==='使用情况查询'">
        <div class="tip">
          统计时间：
          <el-date-picker
            v-model="timePick"
            @change="changeAllTime()"
            value-format="yyyy-MM-dd"
            type="daterange"
            :clearable="false"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="tip">
          <!--          <span>分析日期：<span class="time">{{ lastData.lastDate }}</span></span>-->
          <el-button type="primary" @click="handlePreview('lastWeek')">上周报告</el-button>
          <el-button type="primary" @click="handlePreview">预览报告</el-button>
        </div>
      </div>
    </header>
    <section class="chart-grid"
             v-loading="isLoadingChart"
             element-loading-text="正在加载数据"
             element-loading-background="rgba(0, 0, 0, 0.2)">

      <div class="grid" :class="{grid2:index>2}" v-for="(item,index) in chartDataList" :key="index">
        <div class="tip" v-if="['userOpenZj','userOpenWbj'].includes(item.code)">
          {{ pageName }}用户注册数：<span class="num">{{ userTotal }}</span>
        </div>
        <div class="grid-h">
          <template>{{ item.infoData.title }}
            <span v-if="item.hasSelectTime||['datesUsageTrendZj','datesUsageTrendWbj'].includes(item.code)" style="font-size: 13px">
              （{{ item.timePick[0] }}至 {{ item.timePick[1] }}）
            </span>
          </template>
          <el-popover width="560" trigger="hover" style="margin-left: 5px">
            <div v-html="item.description"></div>
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </div>
        <div class="grid-b" :style="{height: item.height}">
          <el-table
            v-if="item.type==='table'"
            :data="tableData"
            :height="tableData.length>0?44*(tableData.length+1)+1:480"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            style="width: 100%;margin-top: 20px"
          >
            <el-table-column
              prop="name"
              :label="pageName"
            >
            </el-table-column>
            <el-table-column
              prop="worker"
              label="现有工作人员总数"
            >
              <template slot-scope="scope" >
                <el-link class="link" v-if="pageName === '镇街'"  @click="showKeyDetail(scope.row)">
                  {{ scope.row['worker']}}
                </el-link>
                <template v-else> {{ scope.row['worker']}}</template>
              </template>
            </el-table-column>
            <el-table-column
              prop="workerUse"
              label="使用过的工作人员数量"
            >
            </el-table-column>
            <el-table-column
              prop="useCount"
              label="平台使用次数"
            >
            </el-table-column>
          </el-table>

          <DoubleXChartBoard v-else-if="item.type==='doubleXChart'" :data="item.chartData" :timePick="item.timePick"
                             :ref="`${item.infoData.code}-chart`" from="analysis"
                             :info="item.infoData"></DoubleXChartBoard>
          <chart-board :data="item.chartData" :info="item.infoData" v-else from="analysis" :showBigBtn="false" :activeTab="activeTab"
                       :ref="`${item.infoData.code}-chart`"></chart-board>
          <div class="tool">
            <div class="grid-b-time" v-if="false">
              <el-date-picker
                v-model="item.timePick"
                @change="changeTime(item)"
                value-format="yyyy-MM-dd"
                type="daterange"
                :clearable="false"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <div class="grid-b-btns">
              <el-button class="btn" v-if="item.hasMore" type="primary" @click="showMore(item)">查看更多</el-button>
              <el-button class="btn" type="primary" @click="Export(item)">导出</el-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <chart-more
      v-if="showBig"
      @showBigClose="showBig = false"
      :data="chartData"
      style="z-index: 99;"
    ></chart-more>
    <table-more
      v-if="showAllTable"
      @showTableMore="showAllTable = false;"
      :tableData="allTableData"
      :infoData="infoData"
      :pageName="pageName"
      @Export="Export"
    ></table-more>
    <key-industry-stat-dialog
      v-if="isKeyIndustryDialogOpen"
      :data="keyIndustryStatData"
      :type="keyIndustryDialogType"
      :timePick="timePick"
      :tableId="12235"
    />
  </div>
</template>

<script>
import {getPanelItemDataByCode} from "@/api/chart";
import {
  getUserTotalZj,
  getUserTotalWbj,
  getUserUseZj,
  getUserUseWbj,
  getPastTime,
  exportUseZj,
  exportUseWbj,
  getMonthsUseZj,
  getMonthsUseWbj,
  getDayUseZj,
  getDayUseWbj,
  getRankWbj
} from "@/api/autoCount";
import ChartBoard from "@/components/charts/ChartBoard";
import DoubleXChartBoard from "@/components/charts/DoubleXChartBoard";
import {formatDate} from '@/utils/common'
import ChartMore from "./ChartMore";
import TableMore from "./TableMore";
import moment from 'moment'

export default {
  name: "analysisIndex",
  components: {
    ChartBoard,
    DoubleXChartBoard,
    ChartMore,
    TableMore,
    KeyIndustryStatDialog: ()=>import("@/components/KeyIndustryStat/KeyIndustryStatDialog")
  },
  provide() {
    return {
      handleItemChoosed: this.handleItemChoosed,
    };
  },
  props: {
    title: {type: Array}
  },
  watch: {
    activeTab(val) {
      this.activeTab = val
      this.timePick = this.timeDefault
      if(val==='累计使用统计'){
        this.timePick[0]=undefined
      }
      this.initData()
    },
  },
  computed: {
    // 默认时间
    timeDefault() {
      let defalutStartTime = '2022-03-01'
      let defalutEndTime = formatDate(new Date(new Date() - 24 * 60 * 60 * 1000))
      if (this.activeTab === '使用情况查询') {
        defalutStartTime = formatDate(new Date(new Date() - 7 * 24 * 60 * 60 * 1000))
        defalutEndTime = formatDate(new Date(new Date() - 24 * 60 * 60 * 1000))
      }
      return [defalutStartTime, defalutEndTime] //默认时间
    },
  },
  data() {
    return {
      activeTab: '使用情况查询',
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() > Date.now() - 24 * 3600 * 1000 || time.getTime() < new Date('2022-03-01').getTime();
          return time.getTime() > Date.now() - 24 * 3600 * 1000 || time.getTime() < Date.now() - 31 * 24 * 3600 * 1000 ; // 默认可选时间范围一个月内 2022/12/05
        },
      },
      pageName: '镇街',
      userTotal: 0,
      tableData: [],
      allTableData: [],
      timePick: '',
      chartDataList: [],
      isLoadingChart: true,
      codeList: [],
      lastData: {
        lastDate: null,
        lastWeek: null,
      },
      showBig: false,
      showAllTable: false,
      chartData: {},
      infoData: {},
      isIndex: true, //情况分析index
      isKeyIndustryDialogOpen:false,
      keyIndustryStatData: {}, //  列表行信息
      keyIndustryDialogType: '', //统计 弹窗类型，more-查看
    }
  },

  mounted() {
    this.$route.name === 'analysisTownStreet' ? this.pageName = '镇街' : this.pageName = '委办局'
    this.timePick = this.timeDefault
    this.initData()
  },
  methods: {
    getTimeDay(days,time){
      return moment(time).subtract('days', days).format('YYYY-MM-DD')
    },
    // 初始化时间范围（每7天一个维度）
    initSelectDay(days,code){
      let [d1,d2] = days
      let diffDay = moment(d2).diff(d1, 'day')
      let week = Math.ceil((diffDay + 1) / 7)
      let pick = moment(d2).subtract(-1, 'd').format("YYYY-MM-DD")
      let arr = []
      if (week > 1) {
        for (let i = 0; i < week; i++) {
          let end = moment(pick).subtract(7 * i + 1, 'd').format("YYYY-MM-DD")
          let start = moment(pick).subtract(7 * (i + 1), 'd').format("YYYY-MM-DD")
          let timePick = [start, end]
          if (moment(timePick[0]) < moment(d1)) {
            timePick = [d1, end]
          }
          arr.push({ code, hasSelectTime: true, height: '500px', hasMore: true, timePick,indexId:i })
        }
      }else {
        arr = [{ code, hasSelectTime: true, height: '500px', hasMore: true, timePick:days }]
      }
      return arr
    },
    initData() {
      this.chartDataList = []
      this.isLoadingChart=true
      if (this.pageName === '镇街') {
        if (this.activeTab === '累计使用统计') {
          let timePick =[this.getTimeDay(30),this.timeDefault[1]]
          let addCode = this.initSelectDay(timePick,'datesUsageTrendZj')
          this.codeList = [
            {code: 'userOpenZj', hasSelectTime: false,height: '500px', type: 'chart', moreType: 'chart'},
            ...addCode,
            {code: 'monthsUsageTrendZj', hasSelectTime: false,  height: '500px', hasMore:true},
          ]
        } else {
          let addCode = this.initSelectDay(this.timePick,'datesUsageTrendZj')
          this.codeList = [
            {code: 'userOpenZj', hasSelectTime: true, type: 'chart',height: '500px', moreType: 'chart'},
            ...addCode,
            // {code: 'datesUsageTrendZj', hasSelectTime: true, height: '500px', hasMore: true},
            {
              code: 'userUserZj', hasSelectTime: true, type: 'table', height: '486px', description: `系统通过按镇街统计“平台操作日志记录”的功能模块使用次数、使用过工作人员数量来展示平台使用情况。<br>
1、默认统计系统当前日期前一天（零点至23点59分59秒时间段的）的平台使用情况；<br>
2、现有工作人员总数：统计系统当前日期所属应用系统为“疫情防控“现时存在的3街6镇账号数；<br>
3、使用过的工作人员数量：统计系统当前日期前一天工作人员对功能模块有使用过的工作人员数量总和。<br>
4、平台使用次数：统计“平台操作日志记录”的功能模块使用次数，先算出每个人使用的次数，再根据所属镇街来统计平台使用次数累计数。<br>
5、支持选择统计日期，可选择某一天、某一周、某一个月来统计。日使用量：统计的是操作日期的零点至23点59分59秒操作日志数量。比如：统计日期选择2022-06-13，即统计操作日期2022-06-13 0点至23点59分59秒的操作日志数量。`
            },
            {code: 'userModeZj', hasSelectTime: true, type: 'chart', height: '500px', hasMore: true, moreType: 'chart'},
            {code: 'frequencyRankZj', hasSelectTime: true, type: 'doubleXChart', height: '560px', hasMore: false},
          ]
        }
      } else {
        if (this.activeTab === '累计使用统计') {
          let timePick =[this.getTimeDay(30),this.timeDefault[1]]
          let addCode = this.initSelectDay(timePick,'datesUsageTrendWbj')
          this.codeList = [
            {code: 'userOpenWbj', hasSelectTime: false, type: 'chart', height: '500px', hasMore: true, moreType: 'chart'},
            ...addCode,
            {code: 'monthsUsageTrendWbj',hasSelectTime: false, type: 'chart',height:'500px',hasMore: true },
          ]
        } else {
          let addCode = this.initSelectDay(this.timePick,'datesUsageTrendWbj')
          this.codeList = [
            {code: 'userOpenWbj', hasSelectTime: true, type: 'chart',height: '500px', endDate: true, hasMore: true, moreType: 'chart'},
            ...addCode,
            // {
            //   code: 'datesUsageTrendWbj',
            //   hasSelectTime: true,
            //   endDate: true,
            //   type: 'chart',
            //   height: '500px',
            //   hasMore: true
            // },
            {
              code: 'userUserWbj', hasSelectTime: true, type: 'table', height: '530px', hasMore: true, description: `系统通过按委办局统计“平台操作日志记录”的功能模块使用次数、使用过工作人员数量来展示“功能模块使用次数最多前10个委办局”的平台使用情况。<br>
1、默认统计系统当前日期前一天（零点至23点59分59秒时间段的）的平台使用情况；<br>
2、现有工作人员总数：统计系统当前日期在“智慧南沙综合门户-系统管理-用户管理”中-所属应用系统为“疫情防控“现时存在的委办局账号数；<br>
3、使用过的工作人员数量：统计系统当前日期前一天工作人员对功能模块有使用过的工作人员数量总和。<br>
4、平台使用次数：统计“平台操作日志记录”的功能模块使用次数，先算出每个人使用的次数，再根据所属委办局来统计平台使用次数累计数。<br>
5、支持选择统计日期，可选择某一天、某一周、某一个月来统计。日使用量：统计的是操作日期的零点至23点59分59秒操作日志数量。比如：统计日期选择2022-06-13，即统计操作日期2022-06-13 0点至23点59分59秒的操作日志数量。`
            },
            {
              code: 'userModeWbj',
              hasSelectTime: true,
              type: 'chart',
              height: '500px',
              hasMore: true,
              moreType: 'chart'
            },
            {code: 'frequencyRankWbj', hasSelectTime: true, type: 'doubleXChart', height: '560px', hasMore: true},
          ]
        }
      }
      this.getUserTotal()
      this.getChartData()
    },

    async showMore(item) {
      if (item.nullData) return this.$message.error('暂无数据')
      if (item.moreType === 'chart') {
        let res = await getPanelItemDataByCode({
          code: item.infoData.code,
          showModal: true,
          start: item.timePick ? item.timePick[0] : undefined,
          end: item.timePick ? item.timePick[1] : undefined,
        })
        if (!res.panelItemData?.optionData.series[0].data) return this.$message.error('暂无数据')
        this.chartData = res
        this.chartData.info = Object.assign(item.infoData,{activeTab:this.activeTab})
        if (item.timePick) this.chartData.info.timePick = item.timePick
        this.showBig = true
      } else {
        let code = item.infoData.code
        let params = {
          start: item.timePick ? item.timePick[0] : undefined,
          end: item.timePick ? item.timePick[1] : undefined,
        }
        let res = []
        switch (code) {
          case 'monthsUsageTrendZj': // 镇街月平台使用总量
            res = await getMonthsUseZj(params)
            break
          case 'datesUsageTrendZj': // 镇街日平台使用总量
            res = await getDayUseZj(params)
            break
          case 'monthsUsageTrendWbj': // 委办局月平台使用总量
            res = await getMonthsUseWbj(params)
            break
          case 'datesUsageTrendWbj': // 委办局日平台使用总量
            res = await getDayUseWbj(params)
            break
          case 'frequencyRankZj': // 镇街使用率前三的功能模块
            break
          case 'frequencyRankWbj': // 委办局使用率前三的功能模块
            res = await getRankWbj(params)
            break
          default:
            res = this.pageName === '镇街' ? await getUserUseZj(params) : await getUserUseWbj(params)
            break
        }
        this.allTableData = res
        this.infoData = item.infoData
        this.infoData.activeTab = this.activeTab
        if (item.timePick) this.infoData.timePick = item.timePick
        this.allTableData && this.allTableData.length > 0 ? this.showAllTable = true : this.$message.error('暂无数据')
      }
    },
    Export(item) {
      if (item.nullData || item.type === 'table' && this.tableData.length === 0) return this.$message.error('暂无数据')
      if (item.type === 'table') {
        let params = {
          start: item.timePick[0],
          end: item.timePick[1],
        }
        this.pageName === '镇街' ? exportUseZj(params) : exportUseWbj(params)
      } else {
        item.infoData.timePick = item.timePick
        if(item.indexId){
          this.$refs[`${item.infoData.code}-chart`][item.indexId].Export()
        }else {
          this.$refs[`${item.infoData.code}-chart`][0].Export()
        }
      }
    },
    async getPastTime() {
      let res = await getPastTime()
      this.lastData = res
    },
    //用户注册总数
    async getUserTotal() {
      let params = {
        start: this.timePick[0],
        end: this.timePick[1],
        showModal: false,
      }
      let res = this.pageName === '镇街' ? await getUserTotalZj(params) : await getUserTotalWbj(params)
      this.userTotal = res['用户注册总数']
    },
    //账号使用情况
    async getUserUse(params) {
      let res = this.pageName === '镇街' ? await getUserUseZj(params) : await getUserUseWbj(params)
      this.tableData = res.splice(0, 11)
    },
    async getChartData() {
      let arr = []
      for (let i = 0; i < this.codeList.length; i++) {
        let {code, type, hasSelectTime, height, hasMore, moreType, endDate,timePick,indexId} = this.codeList[i]
        let res = type === 'table' ? await this.getUserUse({
          start: this.timePick[0],
          end: this.timePick[1],
          number: this.isIndex && this.pageName === '委办局' ? 10 : null,
          showModal: false
        }) : await getPanelItemDataByCode({
          code,
          showModal: false,
          start: timePick ? timePick[0] : this.timePick[0],
          end: timePick ? timePick[1] : this.timePick[1],
          number: this.isIndex ? 10 : null,
        })
        const {title, updateTime, source, description} = res || {}
        arr.push({
          chartData: res,
          infoData: type === 'table' ? {
            title: `${this.pageName}使用情况`,
            code,
            source,
            updateTime,
            hasSelectTime,
            endDate
          } : {
            code,
            title,
            updateTime,
            source,
            description,
            hasSelectTime,
            endDate,
            timePick: timePick || this.timePick,
          },
          hasSelectTime,
          type,
          height,
          hasMore,
          moreType,
          code,
          description: description || this.codeList[i].description,
          endDate,
          timePick: timePick || this.timePick,
          indexId
        })
      }
      this.chartDataList = arr
      this.isLoadingChart = false
    },

    async changeTime(item) {
      // 单个报表切换时间
      const code = item.infoData.code
      let params = {
        code,
        showModal: true,
      }
      let time = item.timePick
      if (time) {
        params.start = time[0]
        params.end = time[1]
        params.number = this.isIndex ? 10 : null
      }
      if (item.type === 'table') {
        this.getUserUse(params)
      } else {
        let res = await getPanelItemDataByCode(params)
        !res.panelItemData.optionData.series || !res.panelItemData.optionData.series[0].data ? item.nullData = true : item.nullData = false
        if (item.type === 'doubleXChart') {
          this.$refs[`${code}-chart`][0].initChart(res)
        } else {
          this.$refs[`${code}-chart`][0].updateData(res)
        }
      }
    },

    async changeAllTime() {
      this.initData()
      // this.getUserTotal()
      // this.chartDataList.map(item => {
      //   if (item.hasSelectTime || item.endDate) {
      //     item.timePick = this.timePick
      //     this.changeTime(item)
      //   }
      // })
    },
    //触发事件
    handleItemChoosed(event, type) {
      if (type === "chart") {
        this.showBig = true;
        this.chartData = Object.assign({}, event);
      }
    },

    getTime(n) {
      let now = new Date();
      let year = now.getFullYear();
      //因为月份是从0开始的,所以获取这个月的月份数要加1才行
      let month = now.getMonth() + 1;
      let day = now.getDay();
      day == 0 ? day = 7 : day = day;
      let date = now.getDate();
      n = n + (day - 1);
      if (day)
        //这个判断是为了解决跨年的问题
        if (month > 1) {
          month = month;
        }
        //这个判断是为了解决跨年的问题,月份是从0开始的
        else {
          year = year - 1;
          month = 12;
        }
      now.setDate(now.getDate() - n);
      year = now.getFullYear();
      month = now.getMonth() + 1;
      date = now.getDate();
      let s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
      return s;
    },
    handlePreview(type) {
      let timePick = this.timePick
      if (type === 'lastWeek') {
        timePick = [this.getTime(7),this.getTime(1)]
        console.log(timePick);
      }
      let routeUrl = this.$router.resolve({
        path: "/analysis/generateReport",
        query: {reportType: this.pageName === '镇街' ? 'zj' : 'wbj', timePick:JSON.stringify(timePick)},
      });
      window.open(routeUrl.href, '_blank');
    },

    showKeyDetail(item){
      this.keyIndustryStatData = item
      this.keyIndustryDialogType = 'detail'
      this.isKeyIndustryDialogOpen = true
    }
  }
}
</script>

<style lang="scss" scoped>
.analysis-page {
  z-index: 9;
  margin: 20px 50px;

  .header-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 10px 20px 10px;
    background-color: #fff;
    color: #377fc9;
    font-weight: 600;
    position: relative;

    .tab-btn {
      position: absolute;
      left: 15px;
      top: 15px;
    }

    .tips {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 30px;

      .tip {
        span {
          margin-right: 15px;

          .num {
            font-size: 16px;
            color: #db1e1e;
          }
        }
      }
    }

    .time {
      color: #333333;
      font-weight: 500;
    }

    h3 {
      font-size: 22px;
      color: #377fc9;
      text-align: center;
    }
  }


  .chart-grid {
    margin: 1em 0 0;
    display: flex;
    flex-wrap: wrap;
    min-height: 380px;
    transition: height .5s ease-in-out;
    justify-content: center;
    width: 100%;
  }

  .grid {
    position: relative;
    box-sizing: border-box;
    margin: 10px 0;
    background-color: #fff;
    color: #333333;
    width: 100%;

    .tip {
      position: absolute;
      left: 15px;
      top: 15px;
      font-size: 14px;

      .num {
        color: #db1e1e;
        margin-right: 15px;
      }
    }

    &-h {
      padding: 10px 0 0;
      color: #377fc9;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
    }

    &-desc {
      color: #333333;
    }

    &-b {
      height: 400px;
      margin-top: 15px;
      //overflow: auto;
      &-time {
        width: 350px;
        margin-right: 10px;

        ::v-deep.el-range-editor--mini {
          width: 100%;
          color: #333;

          .el-range-input {
            color: #333;
          }

          .el-range-separator {
            color: #333;
          }
        }
      }

      &-btns {
        .btn {
          cursor: pointer;
          margin-right: 5px;
        }
      }

      .tool {
        position: absolute;
        top: 13px;
        right: 10px;
        display: flex;
      }

      .table-card {
        display: flex;
        flex-wrap: wrap;
        height: 380px;
        overflow: auto;
        padding: 5px 25px;

        .box-card {
          margin: 5px 7px;

          .clearfix {
            color: #377fc9;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
          }

          .text {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            height: 80px;
            flex-direction: column;

            p {
              .num {
                font-size: 16px;
                color: #f67a48;
              }
            }
          }
        }

        .null-tip {
          width: 100%;
          margin-top: 50px;
          text-align: center;
        }
      }
    }

    &-f {
      padding: 0.2em 1em 0.5em;
      font-size: 12px;
    }
  }

  .grid2 {
    //background-color: #bac6ee;
  }
  .link {
    color: #409EFF;
    font-size: 12px;
  }
}
</style>
