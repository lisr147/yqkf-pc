<template>
  <div style="height: 100%;overflow: auto;">
    <el-button class="export-btn" type="primary" :style="{right:isMobile?'15px':'30px'}" @click="handleDown">导出报告
    </el-button>
    <div class="report-page" ref="demo1" :class="{'small-page':isMobile}">
      <header class="header-box">
        <h2>南沙区疫情防控指挥平台</h2>
        <h2>{{ pageName }}使用情况</h2>
        <h2>数据分析报告</h2>
        <h2>{{ titleInfo.content }}</h2>
      </header>
      <div class="desc">
        <h2>1.总体说明 </h2>
        <p>{{ totalDesc }}</p>
      </div>
      <div class="desc" style="margin-top: 30px">
        <h2>2.{{ pageName }}使用平台情况分析</h2>
      </div>
      <section class="chart-grid"
               v-loading="isLoadingChart"
               element-loading-text="正在加载"
               element-loading-background="rgba(0, 0, 0, 0.3)">
        <div class="grid" v-for="(item,index) in chartDataList" :key="index">
          <div class="desc">
            <h3>2.{{ index + 1 }} {{ item.infoData.title }}
            </h3>
          </div>
          <div class="grid-h">
            {{ item.infoData.title }}
            <span v-if="['datesUsageTrendZj','datesUsageTrendWbj'].includes(item.code)" style="font-size: 13px">
              （{{ item.timePick[0] }}至 {{ item.timePick[1] }}）
            </span>
          </div>
          <div class="grid-b">
            <el-table
              v-if="item.type==='table'"
              :data="tableData"
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
                               :ref="`${item.infoData.code}-chart`" :isMobile="isMobile"
                               :info="item.infoData" @finished="finished"></DoubleXChartBoard>
            <chart-board :data="item.chartData" :info="item.infoData" v-else from="generateReport" :isMobile="isMobile"
                         :style="{height:item.height}" :ref="`${item.infoData.code}-chart`"
                         @finished="finished"></chart-board>
            <div class="desc">
              {{ item.desc }}
              <p v-if="reportType!=='zj'">
                要查看更多委办局的数据明细，可登录
                <a href="https://cb.gzns.gov.cn:8081/yqfk/index.html#/analysis/CommissionOffice" target="_blank"
                   style="color: #377fc9;text-decoration:underline;">平台</a>
                ，点击平台使用情况分析-委办局使用情况分析-找到这个图表点击【查看更多】查看更多数据明细。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import {getPanelItemDataByCode} from "@/api/autoCount";
import {getUserUseZj, getUserUseWbj, getAutoTemplateAll, getBaseInfo} from "@/api/autoCount";
import ChartBoard from "@/components/charts/ChartBoard";
import DoubleXChartBoard from "@/components/charts/DoubleXChartBoard";
import htmlToPdf from './htmlToPdf';
import TableMore from "./TableMore";
import {Loading} from "element-ui";
import moment from 'moment'

export default {
  name: "generateReport",
  components: {
    ChartBoard,
    DoubleXChartBoard,
    TableMore
  },
  provide() {
    return {
      handleItemChoosed: '',
    };
  },
  data() {
    return {
      tableData: [],
      timePick: '',
      chartDataList: [],
      isLoadingChart: true,
      codeList: [],
      reportType: 'zj',
      pageName: '镇街',
      titleInfo: {},
      totalDesc: '',
      data: {},
      token: "",
      dateType: 'week',
      timeDefault: '',
      isMobile: false,
      generateDate: null, //报告生成时间
      finishChartNum: 0,//渲染完成chart图表数量
    }
  },
  created() {
    this.isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
  },
  mounted() {
    Loading.service({
      lock: true,
      text: '正在生成报告...',
      background: 'rgba(0, 0, 0, 0.8)'
    });
    if (this.$route.query.timePick) {
      this.reportType = this.$route.query.reportType
      this.pageName = this.reportType === 'zj' ? '镇街' : '委办局'
      this.timeDefault = JSON.parse(this.$route.query.timePick)
      this.initData()
    }
    if (this.$route.query.token) {
      this.token = this.$route.query.token
      this.isLoadingChart = false
      this.getBaseInfo({token: this.token, showModal: false})
    }
  },
  methods: {
    finished() {
      this.finishChartNum += 1
      if (this.finishChartNum === this.chartDataList.length - 1) {
        // this.isMobile&&this.token ? this.handleDown() : Loading.service().close()
        Loading.service().close()
      }
    },
    async getBaseInfo(params) {
      let res = await getBaseInfo(params)
      this.reportType = res.reportType
      this.pageName = this.reportType === 'zj' ? '镇街' : '委办局'
      this.dateType = res.dateType
      this.timeDefault = [res.date.startDate, res.date.endDate]
      this.generateDate = res.date.generateDate
      if (res) {
        this.initData()
      }
    },
    async getAutoTemplateAll() {
      let params = {
        start: this.timeDefault[0],
        end: this.timeDefault[1],
        generateDate: this.generateDate,
        showModal: false
      }
      let res = await getAutoTemplateAll(params)
      this.data = this.reportType === 'zj' ? res.filter(i => i.type === 'zj') : res.filter(i => i.type === 'wbj')
      this.totalDesc = this.data.find(i => i.title === '总体说明').content
      this.titleInfo = res[0]
      this.getChartData()
    },
    handleDown() {
      if(this.isMobile) return this.$message.warning('请移步电脑端下载！')
      let pdfName
      if (this.token) {
        pdfName = `${this.pageName}平台使用情况分析报告(${this.dateType === 'week' ? `周报${this.timeDefault[0]}至${this.timeDefault[1]}` : `日报${this.generateDate}`})`
      } else {
        pdfName = `${this.pageName}平台使用情况分析报告(${this.timeDefault[0]}至${this.timeDefault[1]}）`
      }
      this.$nextTick(() => {
        htmlToPdf.exportPDF(this.$refs.demo1, pdfName);
      })
    },
    // 初始化时间范围（每7天一个维度）
    initSelectDay(days,code){
      let m1 = moment(days[0]).format('YYYY-MM-DD')
      let m2 = moment(days[1]).format('YYYY-MM-DD')
      let diffDay = moment(m2).diff(m1, 'day')
      let week = Math.ceil((diffDay + 1) / 7)
      let pick = moment(m2).subtract(-1, 'd').format("YYYY-MM-DD")
      let arr = []
      if (week > 1) {
        for (let i = 0; i < week; i++) {
          let end = moment(pick).subtract(7 * i + 1, 'd').format("YYYY-MM-DD")
          let start = moment(pick).subtract(7 * (i + 1), 'd').format("YYYY-MM-DD")
          let timePick = [start, end]
          if (moment(timePick[0]) < moment(m1)) {
            timePick = [m1, end]
          }
          arr.push({ code, hasSelectTime: true, height: '500px', hasMore: true, timePick })
        }
      }else {
        arr = [{ code, hasSelectTime: true, height: '500px', hasMore: true, timePick:days }]
      }
      return arr
    },
    initData() {
      switch (this.reportType) {
        case 'zj':
          let zjCode = this.initSelectDay(this.timeDefault,'datesUsageTrendZj')
          this.codeList = [
            {code: 'userOpenZj', hasSelectTime: true, type: 'chart', moreType: 'chart'},
            ...zjCode,
            // {code: 'datesUsageTrendZj', hasSelectTime: true, hasMore: true,},
            // {code: 'monthsUsageTrendZj', hasSelectTime: true, height: '500px', hasMore: true},
            {code: 'userUserZj', hasSelectTime: true, type: 'table', height: 'auto'},
            {code: 'userModeZj', hasSelectTime: true, type: 'chart', hasMore: true, moreType: 'chart'},
            {code: 'frequencyRankZj', hasSelectTime: true, type: 'doubleXChart', hasMore: false, marginTop:'-120px'},
          ]
          break
        case 'wbj':
          let wbjCode = this.initSelectDay(this.timeDefault,'datesUsageTrendWbj')
          this.codeList = [
            {
              code: 'userOpenWbj',
              hasSelectTime: true,
              type: 'chart',
              hasMore: true,
              moreType: 'chart'
            },
            ...wbjCode,
            // {code: 'datesUsageTrendWbj', hasSelectTime: true, type: 'chart', hasMore: true},
            // {code: 'monthsUsageTrendWbj', hasSelectTime: true, type: 'chart', hasMore: true},
            {code: 'userUserWbj', hasSelectTime: true, type: 'table', height: '530px', hasMore: true,},
            {
              code: 'userModeWbj',
              hasSelectTime: true,
              type: 'chart',
              hasMore: true,
              moreType: 'chart'
            },
            {code: 'frequencyRankWbj', hasSelectTime: true, type: 'doubleXChart', hasMore: true, marginTop:'-120px'},
          ]
          break
      }
      this.getAutoTemplateAll()
    },
    //账号使用情况
    async getUserUse(params) {
      let res = this.reportType === 'zj' ? await getUserUseZj(params) : await getUserUseWbj(params)
      this.tableData = res
    },
    async getChartData() {
      let arr = []
      for (let i = 0; i < this.codeList.length; i++) {
        let {code, type, hasSelectTime, height,marginTop,timePick} = this.codeList[i]
        let res = type === 'table' ? await this.getUserUse({
          showModal: false,
          start: this.timeDefault[0],
          end: this.timeDefault[1],
          number: 10
        }) : await getPanelItemDataByCode({
          code,
          showModal: false,
          start: timePick ? timePick[0] : this.timePick[0],
          end: timePick ? timePick[1] : this.timePick[1],
          number: 10
        })
        const {title, updateTime} = res || {}
        // const dataNum = res?.panelItemData?.optionData?.series[0].data.length || 0
        // let chartHeight = dataNum > 10 && moreType === 'chart' ? 50 * dataNum + 'px' : height
        arr.push({
          chartData: res,
          infoData: type === 'table' ? {
            title: `${this.pageName}使用情况`,
            code,
            updateTime,
            hasSelectTime,
          } : {
            code,
            title,
            updateTime,
            hasSelectTime,
            timePick: this.timeDefault,
          },
          hasSelectTime,
          type,
          height,
          marginTop,
          code,
          timePick: timePick || this.timeDefault,
        })
      }
      this.chartDataList = arr
      this.chartDataList.map(item => {
        switch (item.infoData.code) {
          case 'userOpenZj'://镇街开通账号情况
          case 'userOpenWbj':  //委办局开通账号情况
            item.desc = `${this.data.find(i => i.title.includes('开通账号情况')).content}`
            break
          case 'datesUsageTrendZj'://镇街平台日使用总量数趋势
          case 'datesUsageTrendWbj': //委办局平台日使用总量数趋势
            item.desc = `${this.data.find(i => i.title.includes('平台日使用总量数')).content}`
            break
          case 'monthsUsageTrendZj'://镇街平台月使用总量数趋势
          case 'monthsUsageTrendWbj': //委办局平台月使用总量数趋势
            item.desc = `${this.data.find(i => i.title.includes('平台月使用总量数')).content}`
            break
          case 'userUserZj': //镇近一周镇街平台使用情况
          case 'userUserWbj': //近一周委办局平台使用情况
            item.desc = `${this.data.find(i => i.title.includes('平台使用情况')).content}`
            break
          case 'userModeZj': //镇街近一周功能模块使用次数
          case 'userModeWbj': //委办局近一周功能模块使用次数
            item.desc = `${this.data.find(i => i.title.includes('模块使用次数')).content}`
            break
          case 'frequencyRankZj': //镇街近一周使用频率前三的功能模块
          case 'frequencyRankWbj': //委办局近一周功能模块使用次数
            item.desc = `${this.data.find(i => i.title.includes('使用频率前三的功能模块')).content}`
            break
        }
      })
      this.isLoadingChart = false
      this.showReportBtn = true

    },

  }
}
</script>

<style lang="scss" scoped>
.report-page {
  background-color: #FFFFFF;
  //min-width: 1200px;
  .header-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    font-weight: 600;
    position: relative;

    h2 {
      color: #333;
      font-size: 26px;
      margin-top: 5px;
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
    margin: 20px 0 60px;
    background-color: #fff;
    color: #333333;
    width: 100%;

    &-h {
      padding: 10px 0 0;
      color: #377fc9;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }

    &-desc {
      color: #333333;
    }

    &-b {
      //height: 400px;
      margin-top: 15px;
      //overflow: auto;

      .table-card {
        display: flex;
        flex-wrap: wrap;

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

  .desc {
    text-indent: 2em;
    text-align: left;
    padding: 10px 30px;
    font-size: 16px;
    line-height: 1.8;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;

    h2 {
      margin: 20px 0 10px;
      font-size: 24px;
    }

    h3 {
      font-size: 18px;
      margin-top: 20px;

      span {
        font-size: 16px;
        font-weight: normal;
      }
    }

    p {
      text-indent: 2em;
      line-height: 2;
      font-size: 16px;
    }
  }

}

.export-btn {
  position: absolute;
  right: 30px;
  top: 15px;
  z-index: 9;
}

.small-page {
  padding-top: 30px;

  .header-box {
    h2 {
      font-size: 20px;
      margin: 5px 0;
    }
  }

  .desc {
    text-indent: 2em;
    padding: 10px;

    h2 {
      text-indent: 0;
      font-size: 20px;
    }
  }
}
</style>
