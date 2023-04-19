<template>
  <div class="vehicle-statistics-panel">

    <ledger></ledger>

    <section class="chart-grid"
             v-loading="isLoadingChart"
             element-loading-text="正在加载数据"
             element-loading-background="rgba(0, 0, 0, 0.3)">

      <div class="grid" v-for="(item,index) in chartData" :key="index" >
        <div class="grid-h">
          {{item.infoData.title}}

          <el-popover
            v-if="item.infoData.description"
            popper-class="screen-popover"
            width="360"
            trigger="hover">
            <div v-html="item.infoData.description"></div>
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>

        </div>
        <div class="grid-b">
          <chart-board :data="item.chartData" :info="item.infoData" from="vehicle" :ref="`${item.infoData.code}-chart`"></chart-board>
          <div style="position: absolute; top:0.3em; left:1em; " v-if="item.hasTabs">
            <time-tabs :default-value="item.tabValue" @change="handleTabChange($event, item)"/>
          </div>
          <div class="grid-b-time">
            <el-date-picker
                v-if="item.hasSelectTime"
                v-model="item.timePick"
                @change="changeTime(item)"
                value-format="yyyy-MM-dd"
                type="daterange"
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="grid-f">
          <span>统计时间：{{ item.infoData.updateTime }}</span><br/>
          <span>数据来源：{{ item.infoData.source }}</span>
        </div>
      </div>
    </section>

    <section class="chart-grid">
      <div class="grid2" style="width:100%;height:400px;">
        <schedule-map/>
      </div>
      <!--<div class="grid2"></div>-->
    </section>

  </div>
</template>

<script>

  import Ledger from "./Ledger";
  import ChartBoard from "@/components/charts/ChartBoard";
  import { getPanelItemDataByCode } from "@/api/bigCharts";
  import TimeTabs from "./TimeTabs";
  import ScheduleMap from "./ScheduleMap";


  export default {
    name: "VehicleStatisticsPanel",
    components: {
      ScheduleMap,
      TimeTabs,
      ChartBoard,
      Ledger,
    },
    data() {
      return {
        timePick:'',
        chartData: [],
        codeList: [
          {code: 'vehicleTimes', hasTabs: true, type: 'day'}, //出车次数统计
          {code: 'vehicleMileage', hasTabs: true, type: 'day'}, //出车里程数统计
          {code: 'ccyy', hasTabs: false, hasSelectTime:true},  //负压车辆出车原因统计图表
          {code: 'ccmddtj', hasTabs: false,hasSelectTime:true}, //出车目的地（隔离酒店）统计
          {code: 'ccclgzltj', hasTabs: false,hasSelectTime:true}, //出车车辆工作量统计（每周工作次数）
          {code: 'rylb', hasTabs: false,hasSelectTime:true}, //负压车辆人员类别统计
        ],
        isLoadingChart: true
      }
    },
    mounted() {
      this.getChartData()
    },
    methods: {

      async getChartData() {

        var arr = []

        for (let i = 0; i < this.codeList.length; i++) {

          let {code, hasTabs, type,hasSelectTime} = this.codeList[i]
          let res = await getPanelItemDataByCode({code, type, showModal: false})
          const {title, updateTime, source, description} = res

          arr.push({
            chartData: res,
            infoData: {code, title, updateTime, source, description,hasTabs,hasSelectTime},
            hasTabs,
            hasSelectTime,
            tabValue: type
          })
        }

        this.chartData = arr
        this.isLoadingChart = false
      },

      async handleTabChange(tabValue, item){

        const code = item.infoData.code
        var res = await getPanelItemDataByCode({code: code, type :tabValue , showModal: false})
        this.$refs[`${code}-chart`][0].updateData(res)
      },

      async changeTime(item){
        const code = item.infoData.code
        let time =item.timePick
        let params = {
          code,
          showModal:false,
        }
        if(time){
          params.startTime = time[0]
          params.endTime = time[1]
        }
        var res = await getPanelItemDataByCode(params)
        this.$refs[`${code}-chart`][0].updateData(res)
      },
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
.vehicle-statistics-panel{
  padding: 1.5em;
  z-index: 9999;
  background-color: #203373;
  color: #fff;

  .chart-grid {
    margin: 1em 0 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    min-height: 300px;
    transition: height .5s ease-in-out;
  }

  .grid {
    position: relative;
    box-sizing: border-box;
    margin: 0 0 1em;
    width: 32.5%;
    background-color: #223E7E;

    &-h {
      padding: 1em 1em 0;
    }
    &-b {
      position: relative;
      height: 270px;
      &-time{
        position: absolute;
        right: .8em;
        top: .4em;
        width: 205px;
        ::v-deep.el-range-editor--mini{
          width: 100%;
          background-color: #3f60ad;
          color: #ffffff;
          border: none;
          .el-range-input{
            background-color: #3f60ad;
            color: #ffffff;
          }
          .el-range-separator{
            color: #ffffff;
          }
        }
      }
    }
    &-f {
      padding: 0.2em 1em 0.5em;
      color: #577ae1;
      font-size: 12px;
    }
  }

  .grid2 {
    position: relative;
    box-sizing: border-box;
    width: 49.5%;
    background-color: #223E7E;
  }
}
</style>
