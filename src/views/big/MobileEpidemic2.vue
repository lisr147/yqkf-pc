<template>
  <div class="ymjz">
    <div class="epidemic">
      <section class="total-data">
        <div class="title-wrap">
          <div class="m-title">疫苗接种全市排名情况</div>
          <i class="el-icon-question" @click="lookDesc('top1')" />
          <!-- <img
            class="look-img"
            :src="baseUrl + '/static/image/ctrl/question-line.svg'"
            @click="lookDesc('top1')"
          /> -->
        </div>

        <div class="data-list">
          <div
            v-for="(sub, index) in listData"
            :key="index"
            class="list-item"
          >
            <div class="item-title" v-html=" sub.key"></div>
            <div class="item-value">
              <b :style="{color:sub.color}" :class="{green:sub.key==='占可加强免疫人数的百分比全市排名'}">{{ sub.value }}</b>
            </div>
          </div>
        </div>
        <div class="data-list data-list2">
          <div
              v-for="(sub, index) in listData2"
              :key="index"
              class="list-item"
              style="width: auto;padding: 10px 18px"
          >
            <div class="item-title" v-html=" sub.key"></div>
            <div class="item-value">
              <b :style="{color:sub.color?'#19de43':''}">{{ sub.value }}</b>
            </div>
          </div>
        </div>

        <div class="update-time">
          统计时间：{{ updateTime }}  <span style="margin: 0 10px">数据来源：{{dataSource}}</span>
<!--          <span style="margin-left:30px;">-->
<!--            来穗接种人数中有{{-->
<!--              LSFKRS-->
<!--            }}不属于南沙区来穗人口库(来穗人口库更新时间:{{ updateTime }})-->
<!--          </span>-->
        </div>
      </section>

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
            <div style="position: absolute; top:0.2em; left:.5em;" v-if="item.hasTabs">
              <time-tabs :default-value="item.tabValue" @change="handleTabChange($event, item)"/>
            </div>
          </div>
          <div class="grid-f">
            <span>统计时间：{{ item.infoData.updateTime }}</span><br/>
            <span>数据来源：{{ item.infoData.source||'区卫生健康局' }}</span>
          </div>
        </div>

      </section>

      <epidemic-explaination
        v-show="isVisible"
        :txtList="txtList"
        title="疫苗接种全市排名情况的数据说明"
        @closed="isVisible = false"
      />
    </div>
  </div>
</template>

<script>
import { formatTime } from "@/utils/common";
import { getPanelItemDataByCode } from "@/api/chart";
import { getDayCityRank} from "@/api/epidemicM";
import { chartSetting } from "@/config/setting";
import echarts from "@/plugins/echarts";
import EpidemicExplaination from "./MobileEpidemicExplaination.vue";
import ChartBoard from "@/components/charts/ChartBoard";
import TimeTabs from "./VehicleStatisticsPanel/TimeTabs";
export default {
  name: "Epidemic",
  inject: ["handleItemChoosed"],
  components: {
    EpidemicExplaination,
    ChartBoard,
    TimeTabs
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      dataSource:'区卫生健康局',
      chartData: [],
      codeList: [
        {code: 'vacDay', hasTabs: true,period:['vacDay','vacWeek','vacMonth']},
        {code: 'vacDayAge', hasTabs: true,period:['vacDayAge','vacWeekAge','vacMonthAge']},
        {code: 'ymjzjc', hasTabs: false},
        {code: 'diffAgeJzCount', hasTabs: false},
        {code: 'btzj', hasTabs: false},
        {code: 'btnl', hasTabs: false},
        {code: 'ssjsbs', hasTabs: false},
      ],
      isLoadingChart: true,
      LSFKRS: "",
      listData:[],
      listData2:[],
      chartList: [],
      isVisible: false,
      updateTime: "",
      //图表统计间隔
      period: [
        { label: "日", value: "vacDay", id: 0 },
        { label: "周", value: "vacWeek", id: 1 },
        { label: "月", value: "vacMonth", id: 2 },
      ],
      period2: [
        { label: "日", value: "vacDayAge", id: 0 },
        { label: "周", value: "vacWeekAge", id: 1 },
        { label: "月", value: "vacMonthAge", id: 2 },
      ],
      txtList: [
        {
          txt: "1、疫苗接种数据来源于在后台管理系统“疫苗接种每日全市排名情况”模块上传xls已经计算好的统计数和接种率，每天统计更新一次，本平台不做数据清洗加工，直接从上传数据来获取数据来显示相关图表。",
        },
        {
          txt: "2、累计接种（万剂次）：是统计时间当天全南沙区累计接种万剂次。",
        },
        {
          txt: "3、全市排名：根据各区情况排出名次的。",
        },
        {
          txt: "4、全人群全程接种率：全人群全程接种数 / 全区常住人口总数 x 100%",
        },
        {
          txt: "5、第三剂“加强针”接种人数（万人）：全南沙区第三剂“加强针”接种人数总和",
        },
        {
          txt: "6、占可加强免疫人数的百分比 =第三剂“加强针”接种人数 / 可加强免疫人数 x 100%",
        },
        {
          txt: "7、3-11岁人群第一剂接种率 = 3-11岁人群第一剂次接种数 / 常住人口总数 x 100%",
        },
        {
          txt: "8、不同年龄段人群全程接种率 = 不同年龄段人群全程免疫接种数 / 常住人口总数 x 100%"
        },
        {
          txt:"以上数据都是截至前一天24时的。",
        }
      ],
    };
  },
  mounted() {
    this.getCountData();
    this.getChartData();
  },
  watch: {},
  methods: {
    showBigChart(){
      console.log(this.data);
      this.handleItemChoosed(this.data,'chart')
    },

    async getChartData() {
      var arr = []
      for (let i = 0; i < this.codeList.length; i++) {
        let {code, hasTabs,period} = this.codeList[i]
        let res = await getPanelItemDataByCode({code,showModal: false})
        const {title, updateTime, source, description} = res

        arr.push({
          chartData: res,
          infoData: {code, title, updateTime, source, description,hasTabs,period},
          hasTabs,
          tabValue: 'day',
        })
      }
      arr.forEach((i)=>{
        if(i.infoData.title==='疫苗接种人数趋势（按天统计）'){
          i.infoData.title = '疫苗接种人数趋势'
        }else if(i.infoData.title==='不同年龄段疫苗接种人数趋势（按天统计）'){
          i.infoData.title = '不同年龄段疫苗接种人数趋势'
        }
      })
      this.chartData = arr
      this.isLoadingChart = false
    },

    async handleTabChange(tabValue, item){
      console.log(211,tabValue,item);
      let code = item.infoData.code
      let period =item.infoData.period
      let pcode =code
      switch (tabValue) {
        case 'month':
          pcode = period[2]
          break
        case 'week':
          pcode = period[1]
          break
        default:
          pcode = period[0]
          break
      }
      var res = await getPanelItemDataByCode({code: pcode,showModal: false})
      // item.chartData = res
      this.$refs[`${code}-chart`][0].updateData(res)
    },

    getCountData() {
      getDayCityRank().then((res) => {
        this.dataSource = res.dataSource || '暂无'
        this.updateTime = formatTime(res.updateTime) || '暂无'
        let filterArr = ['导入者ID','导入者','导入数据时间','统计时间','更新时间','截止统计日期']
        let list=res.detail.filter(i=>!filterArr.includes(i.key))
        list.forEach((i,index)=>{
          if(i.key.includes('排名')){
            i.color= '#F4974E'
          }
          if(i.key.includes('人群')&&!i.key.includes('全人群')){
            let s1 = i.key.split('人群');
            i.key = s1[0] +'人群'+  + s1[1]
            i.key =  `${s1[0]}人群<br/>${s1[1]}`
          }
        })
        // console.log(251,list);
        this.listData = list.slice(0,6)
        this.listData2 = list.slice(6,list.length)
      });
    },
    getChartStyle(code, optionData) {
      optionData = Object.assign(optionData,{
        title:{show: false },
        color:chartSetting.colorAcc,
        tooltip:{ show:true, trigger: 'axis'},
      })

      switch (code) {
        case "vacDay":
        case "vacDayAge":
          optionData.legend.top = "5%";
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid = {
            top: "20%",
            left: "0%",
            right: "5%",
            bottom: "10%",
            containLabel: true,
          };
          // Object.assign(optionData.xAxis[0],{
          //   boundaryGap:false, //从0开始
          //   axisLabel:{
          //     // interval:0,
          //     formatter: function(value, index){
          //       let xYear = value.slice(0,4)
          //       let xMd = value.slice(5,10)
          //       return `${xYear}\n${xMd}`
          //     }
          //   },
          // })
          break;
        case "ymjzjc":
        case "diffAgeJzCount":
          optionData.legend = { show: false };
          optionData.tooltip = { show: false };
          optionData.series[0].center = ["50%", "50%"];
          optionData.series[0].radius = [0, "60%"];
          optionData.series[0].label = {
            formatter: "{b}:" + "\n" + "{@1}人" + "\n" + "({d}%)",
          };
          break
        case "btzj":
          optionData.grid = {
            top: "20%",
            left: "0%",
            right: "5%",
            bottom: "10%",
            containLabel: true,
          };
          Object.assign(optionData.xAxis[0], {
            axisLabel : {
              interval:0
            }
          });
          break
        case "btnl":
          optionData.tooltip.formatter = function (item) {

            let per1 = optionData.series[1].atrributes[0]
            let per2 = optionData.series[2].atrributes[0]
            return `${item[0].axisValue}
                <br/> ${item[0].seriesName}: ${item[0].value}
                <br/>${item[1].seriesName}: ${item[1].value}（完成率: ${per1[item[1].dataIndex]}）
                <br/>${item[2].seriesName}: ${item[2].value}（完成率: ${per2[item[2].dataIndex]}）`;
          };
          break
        case "ssjsbs":
          optionData.grid = {
            top: "20%",
            left: "0%",
            right: "2%",
            bottom: "10%",
            containLabel: true,
          };
          optionData.legend ={
            selectedMode:false
          }
          // console.log(506,optionData);
          Object.assign(optionData.series[0],{
            barWidth:'25%',
            // barGap:'80%',
            itemStyle: {
              normal:{
                // color: function (params) {
                //   let colorList = ['#256dec','#12d285']
                //   return colorList[params.dataIndex]
                // },
                label: {
                  show: true,		//开启显示
                  position: 'top',	//在上方显示
                  // textStyle: {	    //数值样式
                  //   color: 'black',
                  //   fontSize: 16
                  // }
                  formatter: function(params) {
                    // console.log(525,params);
                    return  `${params.seriesName}\n${params.value}`
                  }
                }
              }

            }
          })
          Object.assign(optionData.series[1],{
            barWidth:'25%',
            barGap:'60%',
            itemStyle: {
              normal: {
                // color: function (params) {
                //   let colorList = ['#63bb2d','#dbd121']
                //   return colorList[params.dataIndex]
                // },
                label: {
                  show: true,		//开启显示
                  position: 'top',	//在上方显示
                  // textStyle: {	    //数值样式
                  //   color: 'black',
                  //   fontSize: 16
                  // }
                  formatter: function(params) {
                    let per = optionData.series[1].atrributes[0]
                    return  `${params.seriesName}\n${params.value}\n（${per[params.dataIndex]}）`
                  }
                }
              },

            }

          })
          optionData.tooltip.formatter = function (item) {
            let per = optionData.series[1].atrributes[0]
            return `${item[0].axisValue}
                <br/> ${item[0].seriesName}: ${item[0].value}
                <br/>${item[1].seriesName}: ${item[1].value}
                <br/>全程免疫任务完成率: ${per[item[0].dataIndex]}`
          };
          break;
        default:
          break;
      }

      if (Array.isArray(optionData.xAxis)) {
        optionData.xAxis.forEach((v) => {
          v.splitLine = {
            show: false,
          };
          v.axisLine = {lineStyle: { color: "rgba(255, 255, 255, .3)" }}
        });
      } else {
        if (optionData.xAxis) {
          optionData.xAxis.splitLine = {
            show: false,
          };
        }
      }
      if (optionData.yAxis) {
        if (Array.isArray(optionData.yAxis)) {
          optionData.yAxis.forEach((v) => {
            v.splitLine = {
              show: false,
            };
            v.axisLine = {lineStyle: { color: "rgba(255, 255, 255, .3)" }}
          });
        } else {
          optionData.yAxis.splitLine = {
            show: false,
          };
        }
      }
      return optionData;
    },
    showExplaination() {
      this.isVisible = true;
    },
    lookDesc(code) {
      this.isVisible = true;
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.ymjz {
  color: #fff;
  * {
    // border: 1px solid #f00;
  }
  i {
    cursor: pointer;
  }

  .total-data {
    background-color: rgba($color: #223e7e, $alpha: 1);
    margin-top: 10px;
    padding: 20px 20px 20px 15px;
    .title-wrap {
      display: flex;
      align-items: center;
      font-size: 16px;
      i {
        margin-left: 10px;
      }
    }
    .data-list {
      display: flex;
      flex-wrap: wrap;
      .list-item {
        background-color: #324f96;
        margin: 6px;
        padding: 15px 5px;
        width: 265px;
        text-align: center;
        font-size: 12px;
        .item-title {
          //white-space: nowrap;
          //height: 35px;
          margin-bottom: 5px;
        }
        .item-value {
          font-size: 18px;
          font-weight: 600;
          white-space: nowrap;
          color: #FFFE00;
          span {
            font-size: 14px;
            font-weight: normal;
            color: #fff;
          }
          .green{
            color: #19de43!important;
          }
        }
      }
    }
    .update-time {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      opacity: 0.5;
      margin-top: 5px;
    }
  }
  .data-list2{
    .list-item {
      background-color: #324f96;
      margin: 6px;
      padding: 10px 5px;
      width: 170px;
      text-align: center;
      font-size: 12px;
      .item-title {
        height: 35px;
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
  .charts {
    display: flex;
    color: #fff;
    margin-top: 20px;
    // justify-content: space-between;
    flex-wrap: wrap;
    h2 {
      color: #fff !important;
      margin-bottom: 10px;
      i{
        margin-left: 3px;
      }
    }
    .section-2x {
      width: 32%;
      box-sizing: border-box;
      margin-bottom: 20px;
      margin-right: 1%;
      section {
        width: 100%;
      }
    }
    section {
      background-color: #324f96;
      width: 23.5%;
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
      margin-right: 1%;

      .box {
        height: 350px;
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
.chart-grid {
  margin: 20px 20px 20px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-height: 330px;
  transition: height .5s ease-in-out;
}

.grid {
  position: relative;
  box-sizing: border-box;
  margin: 0 0 1em;
  padding:.5em;
  width: 24.5%;
  background-color: #324f96;
  &:nth-child(6){
    width: 35%;
  }
  &:nth-child(7){
    width: 35%;
  }
  &:nth-child(8){
    width: 28%;
  }
  &-h {
    padding: 1em 1em 0;
    font-weight: 700;
    margin-bottom: .5em;
    font-size: 14px;
  }
  &-b {
    position: relative;
    height: 320px;
  }
  &-f {
    padding: 0.2em 1em 0.5em;
    //color: #577ae1;
    font-size: 12px;
  }
}

</style>
