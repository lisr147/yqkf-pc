<template>
  <div class="box">
    <div class="chart_title" v-if="info && info.title && info.showInfo">
      {{ info.title }}
    </div>
    <i
      class="el-icon-zoom-in big-icon"
      v-if="showBigBtn"
      @click="showBigChart"
    ></i>
    <div
      class="chart"
      ref="chart"
      :style="{
        height:
          errorMsg2 && from === 'generateReport'
            ? '100px'
            : from === 'generateReport'
            ? '500px'
            : '100%'
      }"
    >
      <div class="error" v-if="errorMsg" :style="errorStyle">
        {{ errorMsg }}
      </div>
    </div>
    <div class="tip" v-if="info && info.updateTime && info.showInfo">
      更新时间：{{ info.updateTime }}
    </div>
    <div class="tip" v-if="info && info.source && info.showInfo">
      数据来源：{{ info.source }}
    </div>
    <div
      v-if="errorMsg2"
      class="error2"
      :class="
        ['analysis', 'generateReport'].includes(this.from) ? 'error3' : ''
      "
    >
      {{ errorMsg2 }}
    </div>
  </div>
</template>

<script>
import echarts from "@/plugins/echarts";
/**
 * 默认主题文件，不同主题加载不同的文件
 */
import defaultOption from "./ChartTheme";
// import $resize from './mixins/resize'
import { formatDate } from "@/utils/global";
import { chartSetting } from "@/config/setting";
import chartSkinDark from "@/config/chartTheme/ChartSkinDark.json";
import moment from "moment";
export default {
  name: "ChartBoard",
  components: {},
  // mixins: [$resize],
  props: {
    info: { type: Object },
    from: { type: String },
    scale: { type: Number | String, default: 1 },
    data: { type: Object, required: true },
    isMobile: { type: Boolean },
    showBigBtn: { type: Boolean, default: true },
    activeTab: { type: String },
    errorStyle: { type: Object, default: () => {} }
  },
  inject: ["handleItemChoosed"],
  data() {
    return {
      errorMsg: null,
      errorMsg2: null,
      chart: null,
      dialogVisible: false,
      timer: ""
    };
  },
  mounted() {
    let data = this.getData(this.data);
    setTimeout(() => {
      this.$nextTick(() => {
        this.initChart(data);
      });
    }, 500);
  },
  computed: {
    chartSkin() {
      return this.from === "generateReport"
        ? chartSkinDark
        : this.$store.state.user.themeData.chartSkin;
    }
  },
  methods: {
    updateData(newData) {
      if (["volunteer", "analysis"].includes(this.from)) {
        if (this.chart) this.chart.dispose();
        let data = this.getData(newData);
        setTimeout(() => {
          this.$nextTick(() => {
            this.initChart(data);
          });
        }, 100);
        return;
      }
      // const instance = this.chart;
      const instance = echarts.init(this.$refs["chart"]);
      if (
        newData.itemType === "RADAR" &&
        newData.panelItemData.optionData.radar.indicator.length === 0
      ) {
        instance.setOption(newData.panelItemData, true);
        this.errorMsg2 = `暂无数据`;
        return;
      }
      let data = this.getData(newData);
      if (
        !data.panelItemOptionData.series[0].data ||
        data.panelItemOptionData.series[0].data.length === 0
      ) {
        instance.setOption(data.panelItemOptionData, true);
        this.errorMsg2 = `暂无数据`;
      } else {
        this.errorMsg2 = null;
      }
      // 渲染接口数据
      instance.setOption(data.panelItemOptionData);
      // 渲染模板样式
      instance.setOption(
        defaultOption(
          data.optionData,
          data.panelItemOptionData,
          instance,
          this.chartSkin
        )
      );
      // 渲染图表定制样式
      let optionData = this.getChartStyle(
        this.info.code,
        data.panelItemOptionData
      );
      instance.setOption(optionData);
    },
    // 整理数据
    getData(data) {
      if (!data.code) return;
      if (Object.keys(data).length == 0) {
        return { optionData: {}, panelItemOptionData: {} };
      }
      // 清理optiondata中null的字段
      const clearData = data => {
        for (let i in data) {
          if (data[i] === null || data[i] === "") {
            delete data[i];
          }
          if (typeof data[i] === "object") {
            clearData(data[i]);
          }
        }
      };

      let optionData =
        data["optionData"] && data["optionData"].length > 0
          ? JSON.parse(data["optionData"])
          : {};
      let panelItemOptionData =
        (data["panelItemData"] && data["panelItemData"]["optionData"]) || {};

      // 去除title配置
      delete panelItemOptionData.title;
      delete optionData.title;
      delete optionData.backgroundColor;

      clearData(optionData);
      clearData(panelItemOptionData);

      return {
        // 图表配置定制样式
        optionData,
        // 接口返回数据
        panelItemOptionData
      };
    },
    showBigChart() {
      this.data.info = this.info;
      this.handleItemChoosed(this.data, "chart");
    },
    // 渲染图表
    initChart(data) {
      if (
        Object.keys(data.panelItemOptionData).length == 0 ||
        !data.panelItemOptionData.series ||
        !data.panelItemOptionData.series[0].data?.length
      ) {
        this.errorMsg = `暂无数据`;
        if (["analysis", "generateReport"].includes(this.from)) {
          ["userOpenZj", "userOpenWbj"].includes(this.data.code)
            ? (this.errorMsg2 = `本时段内无新增注册账号`)
            : (this.errorMsg2 = `本时段内无使用记录`);
        } else {
          this.errorMsg2 = ``;
        }
        if (location.href.includes("generateReport")) {
          this.$emit("finished", true);
        }
        return;
      } else {
        this.errorMsg = null;
        this.errorMsg2 = null;
      }
      const instance = echarts.init(this.$refs["chart"]);
      let code;
      const dataInfo = this.data.info;
      if (this.info) {
        code = this.info.code;
      } else {
        code = dataInfo.code;
      }
      // 渲染接口数据
      instance.setOption(data.panelItemOptionData);
      // 渲染模板样式
      instance.setOption(
        defaultOption(
          data.optionData,
          data.panelItemOptionData,
          instance,
          this.chartSkin
        )
      );
      let optionData = {};
      let panelItemOptionData = JSON.parse(
        JSON.stringify(data.panelItemOptionData)
      );
      optionData = this.getChartStyle(
        this.info ? this.info.code : dataInfo.code,
        data.panelItemOptionData
      );
      instance.setOption(optionData)

      // 饼图默认高亮
      if(['weekMovePeopleChart'].includes(this.info.code)){
        let index = 0
        instance.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0})
        // 当鼠标移入时，如果不是第一项，则把当前项置为选中，如果是第一项，则设置第一项为当前项
        instance.on('mouseover',function(e){
          instance.dispatchAction({type: 'downplay',seriesIndex: 0,dataIndex:0});
          if(e.dataIndex != index){
            instance.dispatchAction({type: 'downplay', seriesIndex: 0, dataIndex: index  });
          }
          if(e.dataIndex == 0){
            instance.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex:e.dataIndex});
          }
        });
        //当鼠标离开时，把当前项置为选中
        instance.on('mouseout',function(e){
          index = e.dataIndex;
          instance.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: e.dataIndex});
        });
      }

      this.chart = instance;
      if (['gridAlarm'].includes(this.info.code)) {
        this.autoLoop(panelItemOptionData, 12, 5, 5000)
      }
      if (["qzxqfk"].includes(code)) {
        instance.on("click", param => {
          this.$emit("onChartClick", param);
        });
      }
      if (location.href.includes("generateReport")) {
        let isFinished = false;
        instance.on("finished", () => {
          if (!isFinished) {
            isFinished = true;
            this.$emit("finished", true);
          }
        });
      }
    },
    //初始化放大比例
    initStyle(code, optionData) {
      let scale = this.scale;
      let series = optionData.series.map(i => {
        i.symbolSize = 8 * scale; //拐点大小
        i.itemStyle = {
          normal: {
            lineStyle: {
              width: 2 * scale //折线图的粗细
            }
          }
        };
        return i;
      });
      Object.assign(optionData, {
        textStyle: { fontSize: 12 * scale },
        legend: {
          itemHeight: 10 * scale,
          itemWidth: 10 * scale,
          textStyle: { fontSize: 12 * scale }
        },
        tooltip: {
          textStyle: { fontSize: 12 * scale }
          // extraCssText: `font-size:${10*scale}px;`
        },
        series: series
      });
      let chartArr = ["BAR", "LINE"];
      if (chartArr.includes(this.data.itemType)) {
        //X轴
        Object.assign(optionData.xAxis[0], {
          axisLabel: {
            textStyle: { fontSize: 12 * scale }
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: !["analysis-more", "generateReport"].includes(this.from)
                ? "#fff"
                : "", //左边线的颜色
              width: "1" //坐标线的宽度
            }
          }
        });
        //Y轴
        Object.assign(optionData.yAxis[0], {
          axisLabel: {
            textStyle: { fontSize: 12 * scale }
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: !["analysis-more", "generateReport"].includes(this.from)
                ? "#fff"
                : "", //线的颜色
              width: "1" //坐标线的宽度
            }
          }
        });
      }
      switch (code) {
        case "btzj": //不同镇街3街6镇
          Object.assign(optionData.xAxis[0], {
            axisLabel: {
              interval: 0,
              textStyle: { fontSize: 12 * scale }
            }
          });
          break;
        default:
          break;
      }
    },

    getChartStyle(code, optionData) {
      optionData = Object.assign(optionData, {
        title: { show: false },
        color: chartSetting.colorAcc,
        tooltip: { show: true, trigger: "axis" }
      });
      let unit =
        code === "ccclgzltj" ? "次" : code === "diffAgeJzCount" ? "人" : "";
      if (this.data.itemType === "PIE") {
        Object.assign(optionData.series[0], {
          label: {
            formatter: `{b}\n{@1}${unit}({d}%)`
          },
          radius: [0, "50%"]
        });
      }
      const data = optionData.series[0].data
      const sum = data.reduce((pre, curr) => {
        return pre + curr.value
      }, 0)
      switch (code) {
        case "AlarmDisposal": //告警处置情况
          Object.assign(optionData,{
            legend:{
              top: '10%',
            },
            grid: {
              top: '20%',
              containLabel: true
            }
          })
          break
        case "peopleConstitute": //人员构成情况
          Object.assign(optionData.series[0], {
            barMaxWidth: 30,
            itemStyle: {
              color: 'rgba(234,177,0,0.3)',
              barBorderColor: '#EAB100',
            },
          });
          Object.assign(optionData.series[1], {
            barMaxWidth: 30,
            itemStyle: {
              color: 'rgba(4,239,253,0.3)',
              barBorderColor: '#04EFFD', //边框色
            },
          });
          // Object.assign(optionData.xAxis[0], {
          //   axisLabel: {
          //     interval: 0,
          //     rotate: -45,
          //     textStyle: { fontSize: 10 }
          //   }
          // });
          break;
        case "zdPeopleChart": //重点关注人员
          Object.assign(optionData.series[0], {
            barMaxWidth: 25,
            itemStyle: {
              barBorderRadius: [10,10,10,10],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#34CAF1' },
                { offset: 1, color: '#0373EC' }
              ]),
            },
          });
          break;
        case "residenceChart": //住宅情况
          Object.assign(optionData.series[0], {
            barMaxWidth: 30,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#6396F9' },
                { offset: 1, color: '#1D316E' }
              ]),
            },
          });
          Object.assign(optionData.series[1], {
            barMaxWidth: 30,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#0AF8FF' },
                { offset: 1, color: '#1D316E' }
              ]),
            },
          })
          Object.assign(optionData.yAxis[0], {
            min: 50,
          })
          break;
        case "gridAlarm": //各网格告警
          Object.assign(optionData.series[0], {
            barMaxWidth: 20,
            itemStyle: {
              barBorderRadius: [0,0,10,10],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#018189' },
                { offset: 1, color: '#04EFFD' }
              ])
            },
          });
          Object.assign(optionData.series[1], {
            barMaxWidth: 20,
            itemStyle: {
              barBorderRadius: [10,10,0,0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#FFE100' },
                { offset: 1, color: '#D4A000' }
              ]),
            },
          });
          Object.assign(optionData.xAxis[0], {
            axisLabel: {
              interval: 0,
              rotate: 30,
              textStyle: { fontSize: 10}
            }
          });
          Object.assign(optionData.yAxis[0], {
            min: 0,
          })
          optionData.grid = {
            left: '8%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          };
          break;
        case "alarmChart": //各村今日告警统计
          optionData.color = ['#00EAE9','#E1AB05']
          Object.assign(optionData.series[0], {
            barMaxWidth: 30,
          });
        case "weekAlarmTrend": //近7天告警趋势
          optionData.color = ['#40FEDB','#25D73B']
          Object.assign(optionData.series[0], {
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: "rgba(0, 255, 255, 0.9)",
                  },
                    {
                      offset: 1,
                      color: "rgba(0, 255, 255, 0)",
                    },
                  ],
                  false
                ),
              },
            },
          });
              break
        case "weekAlarmChart": //近7天各村分布统计
          optionData.color = ['#40FEDB', '#25D73B', '#2586D7', '#E5C228', '#FF5B00', '#C2D0F7', "#00EAE9", "#6395F9"]
          optionData.legend = {
            bottom: '-1%',
            type : 'scroll',
            orient : 'horizontal',
            textStyle:{
              color: '#fff'
            },
          }
          optionData.title = [{
            show: true,
            textStyle: {
              fontSize: 14,
              align: 'center'
            }
          }, {
            textStyle: {
              color: '#FFF',
              fontSize: 18,
              align: 'center'
            }
          }]
          Object.assign(optionData.title[0], {
            text: '总',
            x: 'center',
            top: '38%'
          })
          Object.assign(optionData.title[1], {
            text: sum,
            x: 'center',
            top: '48%'
          })
          Object.assign(optionData.series[0], {
            radius: ['40%', '55%'],
            // center: ["50%", "55%"],
            // labelLine: {
            //   normal: {
            //     length: 10, //第一条线
            //   }
            // }
          });

          break
        case "inOutChart": //各村今日出入情况统计
          Object.assign(optionData.series[0], {
            barMaxWidth: 30,
            color:['#FF9A52'],
          });
          Object.assign(optionData.series[1], {
            barMaxWidth: 30,
            color:['#3D6AF4'],
          });
          break;
        case "weekInOutTrendChart": //近7天车辆累计出入趋势变化
          optionData.color = ['#40FEDB','#25D73B']
          Object.assign(optionData.series[0], {
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: "rgba(0, 255, 255, 0.9)",
                  },
                    {
                      offset: 1,
                      color: "rgba(0, 255, 255, 0)",
                    },
                  ],
                  false
                ),
              },
            },
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(21,22,23,0.8)',
              shadowBlur: 3, //阴影模糊系数
              shadowOffsetY: 5  //阴影Y轴偏移
            },
          });
          break;
        case "weekInOutChart": //近7天出入车辆累计各村分布统计
          optionData.color = ['#40FEDB','#25D73B','#2586D7','#E5C228','#FF5B00','#C2D0F7',"#00EAE9", "#6395F9"]
          optionData.legend = {
            bottom: '5%',
            left:'50%',
            pagemode: true,
          }
          Object.assign(optionData.series[0], {
            selectedMode: true,
          });
          break;
        case "moveChart": //各村累计迁入迁出统计
          optionData.color = ["#00EAE9", "#EAB100"];
          optionData.series.forEach(item => {
            item.barMaxWidth = 20;
          });
          break;
        case "weekMoveChart": //近7天人员流动情况
          Object.assign(optionData.series[0], {
            barMaxWidth: 20,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#AB00F6' },
                { offset: 1, color: '#1D3270' }
              ]),
            },
          });
          Object.assign(optionData.series[1], {
            barMaxWidth: 20,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#F67600' },
                { offset: 1, color: '#1D3270' }
              ]),
            },
          });
          break;
        case "weekMoveProportion": //近7天迁入迁出占比统计
          optionData.color = ["#00EAE9", "#6395F9"];
          optionData.legend.show = false
          Object.assign(optionData.series[0], {
            radius: ['55%', '70%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#3D6AF4',
              borderWidth: 1,
            },
          });
          optionData.title = [{
            show: true,
            textStyle: {
              fontSize: 11,
              align: 'center'
            }
          }, {
            textStyle: {
              color: '#FFF',
              fontSize: 16,
              align: 'center'
            }
          }]
          Object.assign(optionData.title[0], {
            text: '总',
            x: 'center',
            top: '38%'
          })
          Object.assign(optionData.title[1], {
            text: sum,
            x: 'center',
            top: '50%'
          })

          break;
        case "weekMovePeopleChart": //近7天各村迁入迁出累计人数占比统计
          optionData.color = ['#40FEDB','#25D73B','#2586D7','#E5C228','#FF5B00','#C2D0F7',"#00EAE9", "#6395F9"];
          Object.assign(optionData.series[0], {
            radius: ['65%', '85%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,  // 设置为false，否则会重复
              position: 'center',
              formatter:'{n1|{b}}' +'\n' +'{n2|{c}}',  // 设置默认显示值
              rich:{
                n1:{
                  fontSize:14,
                  color:'#fff',
                  padding:[5,0]
                },
                n2:{
                  fontSize:18,
                  fontWeight:'bold',
                  color:'#fff',
                  padding:[5,0]
                },
              }
            },
          })

          data.forEach(item => {
            item.precent = (item.value / sum * 100).toFixed(2) + '%'
          })
          optionData.legend = {
            top: 'center',
            right: '10%',
            orient: 'vertical',
            pagemode: true,
            itemGap: 14,
            padding: 8,
            textStyle: {
              fontSize: 12,
              rich: {
                0: {
                  color: '#F4DD32',
                },
              },
            },
            formatter(name) {
              const result = data.find((item) => item.name === name)
              return `${result.name}：${result.value} {0|(${result.precent})}`
            }
          }
          break;
        case "componentType": //城中村部件类型占比统计
          optionData.color = ['#40FEDB','#25D73B','#2586D7','#E5C228','#FF5B00','#C2D0F7',"#00EAE9", "#6395F9"];
          data.forEach(item => {
            item.precent = (item.value / sum * 100).toFixed(2) + '%'
          })
          optionData.legend = {
            top: 'center',
            right: '10%',
            orient: 'vertical',
            pagemode: true,
            itemGap: 14,
            padding: 8,
            textStyle: {
              fontSize: 12
            },
            formatter(name) {
              const result = data.find((item) => item.name === name)
              return `${result.name}:${result.value} (${result.precent})`
            }
          }
          Object.assign(optionData.series[0], {
            radius: ['45%', '60%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,  // 设置为false，否则会重复
              position: 'center',
              formatter() {
                return `{n1|总}\n{n2|${sum}}`
              },
              rich:{
                n1:{
                  fontSize:14,
                  color:'#fff',
                  padding:[5,0]
                },
                n2:{
                  fontSize:18,
                  fontWeight:'bold',
                  color:'#fff',
                  padding:[5,0]
                },
              }
            },
          })
          break;
        case "componentVillage": //各村部件总数占比统计
        case "singleAlarmChart": //今日村告警占比
        case "weekSingleAlarmChart": //近七天村告警占比
          optionData.color = ['#e8ba29','#40FEDB', '#25D73B',  '#FF8452', '#FF5B00', '#C2D0F7', "#00EAE9", "#6395F9"]
          let showLegend = ['componentVillage'].includes(code)?false:true
          optionData.legend = {
            show: showLegend,
            x:'center',
            y:'bottom',
            textStyle:{
              color: '#fff'
            },
          }
          optionData.title = [{
            show: true,
            textStyle: {
              fontSize: 14,
              align: 'center'
            }
          }, {
            textStyle: {
              color: '#FFF',
              fontSize: 18,
              align: 'center'
            }
          }]
          Object.assign(optionData.title[0], {
            text: '总',
            x: 'center',
            top: '38%'
          })
          Object.assign(optionData.title[1], {
            text: sum,
            x: 'center',
            top: '48%'
          })
          Object.assign(optionData.series[0], {
            radius: ['40%', '55%'],
          });
          optionData.series[1] ={
            name: '外边框',
            type: 'pie',
            clockWise: false,
            radius: ['58%', '58%'],//边框大小
            center: ['50%', '50%'],//边框位置
            labelLine:{  //删除指示线
              show:false
            },
            hoverAnimation: false,
            data: [{
              value: 0,
              itemStyle: {
                normal: {
                  borderWidth: 6,//设置边框粗细
                  borderColor: 'rgba(61, 106, 244, 0.2)'//边框颜色
                }
              }
            }]
          }
          break
        case "ylryqktb":
          optionData.legend.show = false
          break;
        case "commonPlaceDayScene":
          optionData.grid = {
            top: "30%"
          };
          break;
        case "zyzzjfb": //志愿者镇街分布
        case "dyzyzzjfb": //党员志愿者镇街分布
        case "fdyzyzzjfb": //非党员志愿者镇街分布
          Object.assign(optionData.xAxis[0], {
            axisLabel: {
              interval: 0
            }
          });
          break;
        case "streetRiskAreasRank": //中高风险地区来粤返粤人员各镇街排名
        case "wgRiskAreasRank": //中高风险地区来粤返粤人员各网格排名
        case "jrzgfxgzjpm": // 今日风险地区流入各镇街人员排名
          optionData.color = ["#00EAE9", "#5e6ef9"];
          optionData.grid = {
            top: "5%"
          };
          // optionData.dataZoom=[
          //   {
          //     type: "slider",
          //     // realtime: true,
          //     start: 0,
          //     end: 50,
          //     yAxisIndex: [0],
          //   },
          // ],
          Object.assign(optionData.series[0], {
            barMaxWidth: 30,
            barWidth: "60%",
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "right",
                  formatter(e) {
                    return `${e["value"]}人`;
                  }
                }
              }
            }
          });
          // console.log(346,optionData.yAxis[0]);
          let ydata = optionData.yAxis[0].data;
          if (ydata.length > 15) {
            optionData.yAxis[0].data = ydata.slice(
              ydata.length - 14,
              ydata.length
            );
            optionData.yAxis[0].data.unshift("...");
            optionData.series[0].data = optionData.series[0].data.slice(
              ydata.length - 15,
              ydata.length
            );
          }
          break;
        case "ydgmfsyrqtj": //药店购买发烧药人群“三人小组”排查情况统计
          optionData.color = ["#D3230D", "#B2B200"];
          optionData.legend = { selectedMode: false };
          optionData.series[1].itemStyle = {
            //显示数值
            normal: {
              label: {
                show: true,
                position: "right",
                formatter(e) {
                  return `${e["value"]}人`;
                }
              }
            }
          };
          break;
        case "streetHealthCodeRank": //红黄码人员各镇街排名
          optionData.color = ["#D3230D", "#fffd1e"];
          optionData.legend = { selectedMode: false };
          let data0 = optionData.series[0].data;
          optionData.series[1].itemStyle = {
            //显示数值
            normal: {
              label: {
                show: true, //开启显示
                position: "right",
                formatter(e) {
                  return `${parseInt(e["value"]) +
                    parseInt(data0[e.dataIndex])}人`;
                }
              }
            }
          };
          break;
        case "streetContactRank": //密接/次密接人员各镇街排名
        case "wgContactRank": //密接/次密接人员各网格排名
          optionData.color = ["#B2B200", "#5E6EFA"];
          optionData.legend = { selectedMode: false };
          let mjdata0 = optionData.series[0].data;
          optionData.series[1].itemStyle = {
            //显示数值
            normal: {
              label: {
                show: true, //开启显示
                position: "right",
                formatter(e) {
                  return `${parseInt(e["value"]) +
                    parseInt(mjdata0[e.dataIndex])}人`;
                }
              }
            }
          };
          Object.assign(optionData.series[0], {
            barMaxWidth: 30,
            barWidth: "60%"
          });
          break;

        case "healthCodeTrend": //红黄码趋势图
          optionData.color = ["#f1130c", "#ffff00"];
          break;
        case "kacbsj": //出入境口岸船舶信息
          optionData.color = ["#49B04D", "#E8A12E", "#00EAE9"];
          optionData.tooltip = {
            show: true,
            trigger: "axis"
          };
          break;
        case "ymjzfbThird": //疫苗接种分布（包括第三针）
          optionData.grid = {
            right: "8%"
          };
          break;
        case "zfwzcb": //政府物资储备
        case "wzylzy": //物资-医疗资源
        case "rcsc": //肉菜市场
        case "sc": //商超
        case "tsrq-bak": //特殊人群
          optionData.color = ["#00EAE9", "#5e6ef9"];
          optionData.series[0].barMaxWidth = "50%";
          optionData.series[0].barMinHeight = "5";
          optionData.series[0].itemStyle = {
            //显示数值
            normal: {
              label: {
                show: true, //开启显示
                position: "right",
                formatter(e) {
                  // console.log(156,e);
                  switch (e["name"]) {
                    case "口罩":
                      return `${e["value"]}个`;
                    case "酒精":
                      return `${e["value"]}万升`;
                    case "卫生帽":
                      return `${e["value"]}个`;
                    case "防疫包":
                      return `${e["value"]}个`;
                    case "免洗手液":
                      return `${e["value"]}对`;
                    case "体温贴":
                      return `${e["value"]}个`;
                    case "防护服":
                      return `${e["value"]}件`;
                    case "隔离衣":
                      return `${e["value"]}件`;
                    case "手持体温枪":
                      return `${e["value"]}支`;
                    case "防护面屏":
                      return `${e["value"]}件`;
                    case "手套":
                      return `${e["value"]}副`;
                    case "含氯消毒片":
                      return `${e["value"]}瓶`;
                    case "鞋套":
                      return `${e["value"]}双`;
                    case "其他":
                      if (code == "zfwzcb") {
                        return `${e["value"]}吨`;
                      } else if (code == "tsrq") {
                        return `${e["value"]}人`;
                      } else {
                        return `${e["value"]}`;
                      }
                    default:
                      if (code == "tsrq") {
                        return `${e["value"]}人`;
                      } else if (code == "wzylzy") {
                        return `${e["value"]}家`;
                      } else if (code == "rcsc" || code == "sc") {
                        return `${
                          e["value"] ? parseFloat(e["value"].toFixed(2)) : 0
                        }公斤`;
                      } else {
                        return `${e["value"]}`;
                      }
                      break;
                  }
                }
              }
            }
          };
          optionData.grid = {
            top: "8%",
            right: "20%",
            bottom: "-3%",
            left: "2%"
          };
          Object.assign(optionData.xAxis[0], {
            show: false
          });
          Object.assign(optionData.yAxis[0], {
            axisTick: {
              //y轴刻度线
              show: false
            },
            axisLine: {
              //y轴
              show: false
            }
          });
          break;
        case "tzsb": //特种设备
        case "getHighRiskZkr": //高风险疫苗接种
        case "getHighRiskNucleic": //高风险岗位人员核酸检测情况
          optionData.color = ["#00EAE9", "#5e6ef9"];
          optionData.series[0].barMaxWidth = "60%";
          optionData.legend.selectedMode = false;
          optionData.grid = {
            top: "10%",
            right: "13%",
            bottom: "-5%",
            left: "4%"
          };
          if (["getCovidZJ"].includes(code)) {
            optionData.series.itemStyle = {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "right",
                  formatter(e) {}
                }
              }
            };
            optionData.series[1].itemStyle = {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "right",
                  formatter(e) {
                    console.log(e, 9897);
                  }
                }
              }
            };
          }
          Object.assign(optionData.xAxis[0], {
            show: false
          });
          Object.assign(optionData.yAxis[0], {
            axisTick: {
              //y轴刻度线
              show: false
            },
            axisLine: {
              //y轴
              show: false
            }
          });

          const firstNum = optionData.series[0].data;
          if (code === "getHighRiskNucleic") {
            optionData.series.forEach(item => {
              item.barMaxWidth = 30;
            });
            optionData.series[0].itemStyle = {
              //显示数值
              normal: {
                label: {
                  show: firstNum[0] !== 0 ? true : false, //开启显示
                  position: "right",
                  formatter(e) {
                    return `${parseInt(firstNum[e.dataIndex])}人`;
                  }
                }
              }
            };
          }
          optionData.series[1].itemStyle = {
            //显示数值
            normal: {
              label: {
                show: true, //开启显示
                position: "right",
                formatter(e) {
                  if (["getHighRiskNucleic"].includes(code)) {
                    return `${parseInt(e["value"])}人`;
                  } else if (["getHighRiskZkr"].includes(code)) {
                    return `${parseInt(e["value"]) +
                      parseInt(firstNum[e.dataIndex])}人`;
                  } else {
                    return `${e["value"]}个`;
                  }
                }
              }
            }
          };
          break;
        case "tsrq":
        case "crrq":
        case "zdrq":
        case "tscszrsmqk":
        case 'tsrqNew':
        case 'crrqNew':
        case 'zdrqNew':
          optionData.color = ["#00EAE9"];
          optionData.xAxis[0].splitNumber = 3;
          optionData.series[0].itemStyle = {
            normal: {
              label: {
                show: true,
                position: "right",
                formatter(e) {
                  return `${e["value"]}`;
                }
              }
            }
          };
          break;
        case "tscsgzryzthsqk":
          optionData.color = ["#49B04D", "#ec980c"];
          optionData.xAxis[0].splitNumber = 3;
          //   optionData.grid[0].right="10%"
          optionData.grid = {
            right: "20%"
          };
          optionData.series[1].itemStyle = {
            normal: {
              label: {
                show: true,
                position: "right",
                formatter(e) {
                  const val1 = optionData.series[0].data[e.dataIndex] * 1;
                  const val2 = optionData.series[1].data[e.dataIndex] * 1;
                  //   return `${e["value"]}`;
                  if (val2) {
                    return `${val1 + val2}(不合规:${val2})`;
                  }
                  return val1 + val2;
                }
              }
            }
          };
          optionData.series[0].itemStyle = {
            normal: {
              label: {
                show: false
              }
            }
          };
          optionData.series.forEach(v => {
            v.stack = "总量";
          });
          break;
        case "alarmRankByPerson": // 近7日接收告警人员top10
        case "hscydzjpm": //  核酸采样点各镇街上报次数排名
          optionData.color = ["#00EAE9"];
          optionData.series[0].itemStyle = {
            normal: {
              label: {
                show: true,
                position: "right",
                formatter(e) {
                  return `${e["value"]}次`;
                }
              }
            }
          };
          break;
        case "getCovidZJ": //南沙人口镇街分布
          optionData.color = ["#00EAE9", "#5e6ef9"];
          optionData.series[0].barMaxWidth = "60%";
          optionData.legend.selectedMode = false;
          optionData.grid = {
            top: "10%",
            right: "13%",
            bottom: "-5%",
            left: "4%"
          };
          optionData.series[1].itemStyle = {
            normal: {
              label: {
                show: true, //开启显示
                position: "right",
                formatter(e) {
                  return `${parseInt(e.value) +
                    parseInt(optionData.series[0].data[e.dataIndex])}人`;
                }
              }
            }
          };
          Object.assign(optionData.xAxis[0], {
            show: false
          });
          Object.assign(optionData.yAxis[0], {
            axisTick: {
              //y轴刻度线
              show: false
            },
            axisLine: {
              //y轴
              show: false
            }
          });
          break;
        case "jzqs":
        case "frmzjzqs":
          optionData.yAxis[0].min = 0;
          optionData.yAxis[0].splitNumber = 4;
          optionData.xAxis[0].data = optionData.xAxis[0].data.map(v => {
            return moment(v).format("DD") + "日";
          });
          optionData.series[0].label = {
            show: true
          };
          break;
        case "yxryqs":
        case "ypjxqs":
        case "zzzyqs":
          optionData.yAxis[0].min = 0;
          optionData.yAxis[0].splitNumber = 4;
          optionData.series.forEach(v => {
            v.label = {
              show: true
            };
          });
          break;
        case "jrgsdghqs":
          optionData.yAxis[0].name = "个";
          optionData.yAxis[0].splitNumber = 4;
          optionData.yAxis[0].min = 0;
          optionData.xAxis[0].name = "时";
        //   optionData.series[0].label = {
        //     show: true
        //   };
          break;

        case "zjqtxzrstb":
        case "zjqtljqs": //密接、次密接趋势图
          Object.assign(optionData.yAxis[0], {
            // boundaryGap: false,
            minInterval: 1
          });
          optionData.legend.top = 10;
          optionData.legend.right = 20;
          optionData.tooltip = { trigger: "axis" };

          // var temp = 0
          // optionData.series[0].data = optionData.series[0].data.map((v) => {
          //   temp = Math.max(temp, v)
          //   return temp
          // })
          // var temp = 0
          // optionData.series[1].data = optionData.series[1].data.map((v) => {
          //   temp = Math.max(temp, v)
          //   return temp
          // })
          break;
        case "wlqtjcglrstb":
          optionData.legend.top = 0;
          optionData.grid = {
            top: "10%",
            right: "6%",
            bottom: "4%",
            left: "4%",
            containLabel: true
          };
          optionData.color = ["#2F54EB", "#1EE7E7"];
          optionData.tooltip = {
            trigger: "axis"
          };

          let colorList = [
            [
              {
                offset: 0,
                color: "rgba(47,84,235,0.4)"
              },
              {
                offset: 1,
                color: "rgba(47,84,235,0.0)"
              }
            ],
            [
              {
                offset: 0,
                color: "rgba(30,231,231,0.4)"
              },
              {
                offset: 1,
                color: "rgba(30,231,231,0.0)"
              }
            ]
          ];
          optionData.series = optionData.series.map((v, index) => {
            v.areaStyle = {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                colorList[index]
              )
            };
            return v;
          });
          Object.assign(optionData.legend, {
            icon: "roundRect"
          });
          break;
        case "weeksStreetZkrTrend":
          //数据处理-获取前一天日期
          var endDate = optionData.xAxis[0].data.slice(0);
          endDate.shift();
          var today = new Date();
          endDate.push(formatDate(today));
          endDate.forEach((item, index, arr) => {
            var timeStamp = new Date(item);
            timeStamp.setDate(timeStamp.getDate() - 1);
            arr[index] = formatDate(timeStamp);
          });

          optionData.legend.top = "5%";
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid = {
            top: "20%",
            left: "15%",
            right: "5%",
            bottom: "10%"
          };
          // optionData.dataZoom = {
          //   type: 'inside'
          // }
          optionData.tooltip.formatter = function(item) {
            //获取周区间
            let date = new Date(item[0].axisValue);
            let today = new Date();
            let endDate = "";
            if (date.getTime() + 7 * 24 * 3600000 < today.getTime()) {
              date.setDate(date.getDate() + 6);
              endDate = formatDate(date);
            } else {
              endDate = formatDate(today.setDate(today.getDate() - 1));
            }
            return `${item[0].axisValue}至${endDate}
                <br/>接种总人数: ${item[0].value + item[1].value}人
                <br/> ${item[0].seriesName}: ${item[0].value}人
                <br/>${item[1].seriesName}: ${item[1].value}人`;
          };
          Object.assign(optionData.xAxis[0], {
            axisLabel: {
              color: "#333",
              // showMaxLabel:'true',
              formatter: function(value, index) {
                return value.split("-")[1] + "-" + value.split("-")[2];
              }
            },
            axisLine: { lineStyle: { color: "#ccc" } },
            splitLine: { lineStyle: { color: "#f0f0f0" } }
          });
          Object.assign(optionData.yAxis[0], {
            type: "value",
            axisLabel: {
              color: "#333",
              formatter: function(value, index) {
                if (value === 0) {
                  return value;
                } else if (value < 10000) {
                  return value + "人";
                } else {
                  return (Math.ceil(value / 1000) / 10).toFixed(1) + "万人";
                }
              }
            },
            axisLine: { lineStyle: { color: "#ccc" } },
            splitLine: { lineStyle: { color: "#f0f0f0" } },
            axisTick: { show: false }
          });
          break;
        case "daysStreetZkrTrend":
          optionData.legend.top = "5%";
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid = {
            top: "20%",
            left: "15%",
            right: "5%",
            bottom: "10%"
          };
          // optionData.dataZoom = {
          //   type: 'inside'
          // }
          optionData.tooltip.formatter = function(item) {
            return `${item[0].axisValue}
                <br/>接种总人数: ${item[0].value + item[1].value}人
                <br/> ${item[0].seriesName}: ${item[0].value}人
                <br/>${item[1].seriesName}: ${item[1].value}人`;
          };
          Object.assign(optionData.xAxis[0], {
            axisLabel: {
              color: "#333",
              // showMaxLabel:'true',
              formatter: function(value, index) {
                return value.split("-")[1] + "-" + value.split("-")[2];
              }
            },
            axisLine: { lineStyle: { color: "#ccc" } },
            splitLine: { lineStyle: { color: "#f0f0f0" } }
          });
          Object.assign(optionData.yAxis[0], {
            type: "value",
            axisLabel: {
              color: "#333",
              formatter: function(value, index) {
                if (value === 0) {
                  return value;
                } else if (value < 10000) {
                  return value + "人";
                } else {
                  return (Math.ceil(value / 1000) / 10).toFixed(1) + "万人";
                }
              }
            },
            axisLine: { lineStyle: { color: "#ccc" } },
            splitLine: { lineStyle: { color: "#f0f0f0" } },
            axisTick: { show: false }
          });
          break;
        case "monthsStreetZkrTrend":
          optionData.legend.top = "5%";
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid = {
            top: "20%",
            left: "15%",
            right: "5%",
            bottom: "10%"
          };
          // optionData.dataZoom = {
          //   type: 'inside'
          // }
          optionData.tooltip.formatter = function(item) {
            return `${item[0].axisValue}
                <br/>接种总人数: ${item[0].value + item[1].value}人
                <br/> ${item[0].seriesName}: ${item[0].value}人
                <br/>${item[1].seriesName}: ${item[1].value}人`;
          };
          Object.assign(optionData.xAxis[0], {
            axisLabel: {
              color: "#333",
              // showMaxLabel:'true',
              formatter: function(value, index) {
                return value.split("-")[1] + "月";
              }
            },
            axisLine: { lineStyle: { color: "#ccc" } },
            splitLine: { lineStyle: { color: "#f0f0f0" } }
          });
          Object.assign(optionData.yAxis[0], {
            type: "value",
            axisLabel: {
              color: "#333",
              formatter: function(value, index) {
                if (value === 0) {
                  return value;
                } else {
                  return Math.ceil(value / 10000) + "万人";
                }
              }
            },
            axisLine: { lineStyle: { color: "#ccc" } },
            splitLine: { lineStyle: { color: "#f0f0f0" } },
            axisTick: { show: false }
          });
          break;
        case "ymjztj":
          optionData.grid = {
            top: "5%"
          };
          optionData.legend = { show: false };
          optionData.series[0].center = ["50%", "50%"];
          optionData.series[0].radius = [0, "60%"];
          optionData.series[0].label = {
            formatter: "{b}:" + "\n" + "{@1}人" + "\n" + "({d}%)"
          };
          break;
        case "hjrkjzbl":
          optionData.grid = {
            top: "5%"
          };
          optionData.legend = { show: false };
          optionData.series[0].center = ["50%", "50%"];
          optionData.series[0].radius = [0, "60%"];
          optionData.series[0].label = {
            formatter: "{b}:" + "\n" + "{@1}人" + "\n" + "({d}%)"
          };
          break;
        case "ymjzfb":
          // 接种分布
          optionData.legend.top = "0%";
          optionData.legend.selectedMode = false;
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid.left = "2%";
          optionData.grid.right = "1%";
          optionData.color = ["#2F54EB", "#71E7A2"];
          // optionData.xAxis.boundaryGap = ['1%','30%']
          let [s1, s2] = optionData.series;
          const arr = s1.data.map((val, index) => {
            let total = val + s2.data[index];
            let attribute = s2.atrributes[index];
            return {
              total,
              attribute,
              v1: val,
              v2: s2.data[index],
              p1: s1["_percent"][index],
              p2: s2["_percent"][index],
              p_total:
                (
                  parseFloat(s1["_percent"][index].split("%")[0]) +
                  parseFloat(s2["_percent"][index].split("%")[0])
                ).toFixed(2) + "%"
            };
          });

          if (!optionData.tooltip) {
            optionData.tooltip = {};
          }
          optionData.tooltip.formatter = function(item) {
            const { v1, v2, p1, p2, p_total, total, attribute } = arr[
              item[0].dataIndex
            ];
            return `${item[0].name}:
                <br/>户籍人口: ${attribute}人
                <br/>接种总人数: ${total}人(${p_total})
                <br/> ${item[0].seriesName}: ${v1}人(${p1})
                <br/>${item[1].seriesName}: ${v2}人(${p2})`;
          };

          s1.label = { show: false };
          s1.barWidth = "60%";
          s2.label = {
            show: true,
            position: "right",
            formatter({ dataIndex }) {
              const { v1, v2, p1, p2 } = arr[dataIndex];
              return `{a|${v1}人(${p1})}` + `\n` + `{b|${v2}人(${p2})}`;
            },
            rich: {
              a: {
                color: "#2F54EB"
              },
              b: {
                color: "#71E7A2"
              }
            }
          };

          //样式
          optionData.xAxis = {};
          Object.assign(optionData.xAxis, {
            type: "value",
            // axisLabel: { color: "#333", showMaxLabel: false },
            // axisLine: { lineStyle: { color: "#ccc" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
            interval: 10000,
            max: function(value) {
              return value.max * 1.6;
            }
          });
          // Object.assign(optionData.yAxis[0], {
          //   axisLabel: { color: "#333", show: true },
          //   axisLine: { lineStyle: { color: "#ccc" } },
          //   splitLine: { lineStyle: { color: "#f0f0f0" } },
          // });
          break;
        case "organZkrStatistics": {
          let seriesData = [];
          for (let i = 0; i < optionData.series[0].data.length; i++) {
            seriesData.push({
              name: optionData.yAxis[0].data[i],
              value: optionData.series[0].data[i],
              label: {
                width: "4px",
                overflow: "break",
                normal: {
                  color: "black",
                  show: true,
                  position: [0, "-14px"],
                  textStyle: {
                    fontSize: 12
                  },
                  // width:'5px',
                  // overflow: 'break',
                  formatter: function(a, b) {
                    // let name = a.name.length > 25 ? a.name.substr(0,25) + '...' : a.name
                    return a.name;
                  }
                }
              }
            });
          }
          optionData.series[0].data = seriesData;

          optionData.legend.top = "5%";
          optionData.legend.selectedMode = false;
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid.left = "1%";
          optionData.grid.right = "1%";
          // optionData.xAxis.boundaryGap = ['1%','30%']
          let [s1, s2] = optionData.series;
          const arr = s1.data.map((val, index) => {
            let total = val + s2.data[index];
            return {
              total,
              v1: val,
              v2: s2.data[index]
            };
          });

          if (!optionData.tooltip) {
            optionData.tooltip = {};
          }
          optionData.tooltip.formatter = function(item) {
            const { v1, v2 } = arr[item[0].dataIndex];
            let nameList = item[0].name.split(",");
            let name = "";
            nameList.forEach(e => {
              name += "<br/>" + e;
            });
            return `接种点：${name}
                <br/> ${item[0].seriesName}: ${v1.value}人
                <br/>${item[1].seriesName}: ${v2}人`;
          };

          s1.label = { show: false };
          s1.barWidth = "40%";
          s2.label = {
            show: true,
            position: "right",
            formatter({ dataIndex }) {
              const { v1, v2 } = arr[dataIndex];
              return `{a|${v1.value}人}` + `/` + `${v2}人`;
            },
            rich: {
              a: {
                color: "#5e6ef9"
              }
            }
          };

          //样式
          optionData.xAxis = {};
          Object.assign(optionData.xAxis, {
            type: "value",
            axisLabel: { color: "#333", showMaxLabel: false },
            axisLine: { lineStyle: { color: "#ccc" } },
            splitLine: { lineStyle: { color: "#f0f0f0" } },
            interval: 30000,
            max: function(value) {
              return value.max * 1.6;
            }
          });
          Object.assign(optionData.yAxis[0], {
            axisLabel: {
              color: "#333",
              show: false
            },
            axisLine: { lineStyle: { color: "#ccc" } },
            splitLine: { lineStyle: { color: "#f0f0f0" } }
          });
          optionData.color = ["#306EDD", "#71E7A2"];
          break;
        }
        case "rjczcy":
        case "rgczcy":
          optionData.color = ["#2F54EB", "#1EE7E7"];
          break;
        case "jdgltjtb":
          optionData.color = ["#1EE7E7", "#2F54EB"];
          // optionData.xAxis.axisLabel = {
          //   // interval : 0
          // }
          optionData.yAxis.forEach(item => {
            item.axisLabel = {
              formatter: function(value) {
                value = value.toString();
                var maxlength = 8;
                if (value.length > maxlength) {
                  return value.substring(0, maxlength - 1) + "...";
                } else {
                  return value;
                }
              }
            };
          });
          if (optionData.series && optionData.series.length) {
            optionData.series = optionData.series.map(v => {
              v.label = {
                position: "right",
                show: true, // 开启显示
                textStyle: {
                  // 数值样式
                  color: "#fff",
                  fontSize: 12
                }
              };
              return v;
            });
          }
          Object.assign(optionData, {
            grid: {
              top: "14%",
              right: "6%",
              bottom: "2%",
              left: "4%",
              containLabel: true
            }
          });
          // console.log('酒店表格',optionData)
          break;
        case "vehicleTimes": //出车次数统
          optionData.series.forEach(item => {
            item.label = {
              show: true,
              position: "top",
              formatter: "{c}次"
            };
          });
          break;
        case "vehicleMileage": //出车里程数统计
          optionData.series.forEach(item => {
            item.label = {
              show: true,
              position: "top",
              formatter: "{c}公里"
            };
          });
          break;
        case "ccyy": //负压车辆出车原因统计图表
          let itemIndex = optionData.xAxis[0].data.findIndex(v => v === "未知");
          if (itemIndex) {
            let count = optionData.series[0].data[itemIndex];
            optionData.xAxis[0].data.splice(itemIndex, 1);
            optionData.series[0].data.splice(itemIndex, 1);
            optionData.xAxis[0].data.push("未知");
            optionData.series[0].data.push(count);
          }
          optionData.series.forEach(item => {
            item.label = {
              show: true,
              position: "top",
              formatter: "{c}次"
            };
            if (item.data) {
              item.data = this.getSingleDataColor(optionData);
              item.barWidth = "50%";
              item.barMaxWidth = 30;
            }
          });
          break;
        case "ccclgzltj": //出车车辆工作量统计
          optionData.series[0].label = {
            formatter: "{b}\n{c}次({d}%)"
          };
          Object.assign(optionData, {
            legend: {
              top: "13%"
            }
          });
          Object.assign(optionData.series[0], {
            radius: 60 * this.scale,
            center: ["50%", "65%"]
          });
          break;
        case "ccmddtj": //出车目的地
          Object.assign(optionData.radar, {
            radius: 75 * this.scale,
            center: ["50%", "55%"]
          });
          optionData.series[0].label = {
            show: true,
            formatter: "{c}"
          };
          break;
        case "rylb": //负压车辆人员类别统计
          optionData.grid = {
            right: "12%",
            containLabel: true
          };
          optionData.series[0].label = {
            show: true,
            position: "right",
            formatter: "{c}人"
          };
          optionData.series.forEach(item => {
            item.barWidth = "60%";
            item.barMaxWidth = 30;
          });
          if (optionData.series[0].data) {
            optionData.series[0].data = this.getSingleDataColor(optionData);
          }
          break;
        //疫苗接种全市排名总览
        case "vacDay":
        case "vacDayAge":
          optionData.legend.top = "10%";
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid = {
            top: "20%",
            left: "5%",
            right: "8%",
            bottom: "10%",
            containLabel: true
          };
          Object.assign(optionData.xAxis[0], {
            boundaryGap: false, //从0开始
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#fff", //左边线的颜色
                width: "1" //坐标线的宽度
              }
            },
            axisLabel: {
              // interval:0,
              // formatter: function(value, index){
              //   let xYear = value.slice(0,4)
              //   let xMd = value.slice(5,10)
              //   return `${xYear}\n${xMd}`
              // }
            }
          });
          break;
        case "ymjzjc":
        case "diffAgeJzCount":
          optionData.legend = { show: false };
          optionData.tooltip = { show: false };
          optionData.series[0].center = ["50%", "50%"];
          optionData.series[0].radius = [0, "60%"];
          optionData.series[0].label = {
            formatter: "{b}:" + "\n" + "{@1}人" + "\n" + "({d}%)"
          };
          break;
        case "btzj":
          optionData.grid = {
            top: "20%",
            left: "0%",
            right: "5%",
            bottom: "10%",
            containLabel: true
          };
          // Object.assign(optionData.xAxis[0], {
          //   axisLabel : {
          //     interval:0
          //   }
          // });
          break;
        case "btnl":
          optionData.tooltip.formatter = function(item) {
            let per1 = optionData.series[1].atrributes[0];
            let per2 = optionData.series[2].atrributes[0];
            return `${item[0].axisValue}
                <br/> ${item[0].seriesName}: ${item[0].value}
                <br/>${item[1].seriesName}: ${item[1].value}（完成率: ${
              per1[item[1].dataIndex]
            }）
                <br/>${item[2].seriesName}: ${item[2].value}（完成率: ${
              per2[item[2].dataIndex]
            }）`;
          };
          break;
        case "ssjsbs":
          optionData.grid = {
            top: "20%",
            left: "3%",
            right: "2%",
            bottom: "5%",
            containLabel: true
          };
          optionData.legend = {
            selectedMode: false
          };
          // console.log(506,optionData);
          Object.assign(optionData.series[0], {
            barWidth: "25%",
            // barGap:'80%',
            itemStyle: {
              normal: {
                // color: function (params) {
                //   let colorList = ['#256dec','#12d285']
                //   return colorList[params.dataIndex]
                // },
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  // textStyle: {	    //数值样式
                  //   color: 'black',
                  //   fontSize: 16
                  // }
                  formatter: function(params) {
                    // console.log(525,params);
                    return `${params.seriesName}\n${params.value}`;
                  }
                }
              }
            }
          });
          Object.assign(optionData.series[1], {
            barWidth: "25%",
            barGap: "60%",
            itemStyle: {
              normal: {
                // color: function (params) {
                //   let colorList = ['#63bb2d','#dbd121']
                //   return colorList[params.dataIndex]
                // },
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  // textStyle: {	    //数值样式
                  //   color: 'black',
                  //   fontSize: 16
                  // }
                  formatter: function(params) {
                    let per = optionData.series[1].atrributes[0];
                    return `${params.seriesName}\n${params.value}\n（${
                      per[params.dataIndex]
                    }）`;
                  }
                }
              }
            }
          });
          optionData.tooltip.formatter = function(item) {
            let per = optionData.series[1].atrributes[0];
            return `${item[0].axisValue}
                <br/> ${item[0].seriesName}: ${item[0].value}
                <br/>${item[1].seriesName}: ${item[1].value}
                <br/>全程免疫任务完成率: ${per[item[0].dataIndex]}`;
          };
          break;
        //本地核酸检测人数 (日、周、月)
        case "getDaysNulacid":
        case "getWeeksNulacid":
        case "getMonthsNulacid":
        //入境人员检测人数（日、周、月）
        case "getRjryjzDay":
        case "getRjryjzWeek":
        case "getRjryjzMonth":
        //外籍人员检测人数（日、周、月）
        case "getWjryjcDay":
        case "getWjryjcWeek":
        case "getWjryjcMonth":
          optionData.color = ["#49B04D", "#ec980c"];
          optionData.series.forEach(item => {
            item.barWidth = "50%";
          });
          Object.assign(optionData, {
            grid: {
              top: "20%",
              right: "6%",
              bottom: "2%",
              left: "4%",
              containLabel: true
            }
          });
          break;
        //委办局/镇街近12个月平台使用总量
        case "userOpenWbj":
        case "userOpenZj":
        case "userModeZj":
        case "userModeWbj":
          Object.assign(optionData.xAxis[0], {
            minInterval: 1
          });
          optionData.series[0].label = {
            show: true,
            position: "right"
          };
          optionData.color = ["#49B04D", "#ec980c"];
          optionData.grid = {
            top: "8%",
            containLabel: true
          };
          optionData.series.forEach(item => {
            item.barWidth = "50%";
            item.barMaxWidth = 50;
          });

          break;
        //委办局/镇街近月平台使用总量趋势图
        case "monthsUsageTrendWbj":
        case "monthsUsageTrendZj":
        //委办局/镇街近日平台使用总量趋势图
        case "datesUsageTrendWbj":
        case "datesUsageTrendZj":
          optionData.tooltip = {
            trigger: "axis",
            formatter: params => {
              let astr = "";
              params.forEach(ele => {
                for (const key in ele) {
                  if (key === "seriesName") {
                    astr += `
                      <div style="display: block;height:20px;float:left;margin:1px 6px">
                        <i style="width: 10px;height: 10px;display: inline-block;background: ${ele.color};border-radius: 10px;"></i>
                        <span>${ele.seriesName}: ${ele.data}</span>
                      </div>
                   `;
                  }
                }
              });
              const b = '<div style="max-width: 420px;">' + astr + "<div>";
              return b;
            }
          };
          optionData.series.map(v => {
            v.itemStyle = {
              normal: { label: { show: true, position: "top" } }
            };
            if (v.stack) v.stack = undefined;
          });
          optionData.legend = {
            bottom: "2%",
            left: "center"
            // itemWidth: 18,
            // itemHeight: 12, // 设置该值的话，square的宽度会变成3, 不设置的话rect是正方形,
            // icon:'roundRect'
          };
          optionData.grid = {
            top: "3%",
            bottom:
              optionData.series.length > 50
                ? "30%"
                : this.isMobile
                ? "20%"
                : "12%",
            containLabel: true
          };
          break;
        //镇街使用频率前5
        case "frequencyRankZj":
        case "frequencyRankWbj":
          optionData.color = ["#49B04D", "#ec980c"];
          optionData.toolbox = {
            show: true,
            feature: {
              saveAsImage: {
                show: true,
                excludeComponents: ["toolbox"],
                pixelRatio: 2
              }
            }
          };
          break;
        default:
          break;
      }
      if (optionData.xAxis && optionData.xAxis[0]) {
        optionData.xAxis[0].axisLine = {
          lineStyle: {
            color: "#364f9a"
          }
        };
      }
      if (optionData.yAxis && optionData.yAxis[0]) {
        optionData.yAxis[0].axisLine = {
          lineStyle: {
            color: "#364f9a"
          }
        };
      }
      if (optionData && optionData.yAxis && !["analysis"].includes(this.from)) {
        optionData.yAxis.forEach(item => {
          item.axisLabel = {
            formatter: function(value) {
              value = value ? value.toString() : "";
              var maxlength = 8;
              if (value.length > maxlength) {
                return value.substring(0, maxlength - 1) + "...";
              } else {
                return value;
              }
            }
          };
        });
      }
      if (this.from === "analysis-more") {
        optionData.grid = {
          top: 80,
          right: "3%",
          bottom: "1%",
          left: "1%",
          containLabel: true
        };
      }
      if (this.scale > 1) {
        this.initStyle(code, optionData);
      }
      //   console.log('图表样式',code,optionData,JSON.stringify(optionData))
      return optionData;
    },

    getSingleDataColor(optionData) {
      let colors = optionData.color;
      let arr = optionData.series[0].data.map((v, index) => {
        let value = typeof v == "object" ? v.value : v;
        return { value, itemStyle: { color: colors[index % colors.length] } };
      });
      return arr;
    },

    // 报表自动轮播
    autoLoop(panelItemOptionData,count,number,time){
      //  count 展示最大轮播数量, number每次轮播个数，time 时间间隔
      if (panelItemOptionData.series[0].data.length > count) {
        let start = 0; //轮播开始的位置
        let fn = () => {
          let newOptions = JSON.parse(JSON.stringify(panelItemOptionData));
          let data1 = newOptions.series[0].data.splice(start, count);
          let data2 = newOptions.series[1].data.splice(start, count);
          let data3 = newOptions.xAxis[0].data.splice(start, count);
          start+=number
          if (start > panelItemOptionData.series[0].data.length - count) {
            start = 0;
          }
          newOptions.series[0].data = data1;
          newOptions.series[1].data = data2;
          newOptions.xAxis[0].data = data3;
          this.chart.setOption(newOptions);
        };
        fn();
        setInterval(() => {
          fn();
        }, time);
      }
    },

    Export() {
      if (!this.chart || !this.chart.getDataURL())
        return this.$message.error("暂无数据");
      let img = new Image();
      img.src = this.chart.getDataURL({
        type: "png",
        pixelRatio: 1, //放大2倍
        backgroundColor: "#fff"
      });
      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        // 设置字体大小
        ctx.font = "16px Microsoft YaHei";
        // 更改字号后，必须重置对齐方式，否则居中麻烦。设置文本的垂直对齐方式
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        // 距离左边的位置
        let left = canvas.width / 2;
        // 距离上边的位置 (图片高-文字距离图片底部的距离)
        let top = this.from === "analysis-more" ? 50 : 20;
        // 文字颜色
        ctx.fillStyle = "#377fc9";
        // 文字在画布的位置
        let time = "";
        if (
          (this.info.timePick && this.activeTab === "使用情况查询") ||
          ["datesUsageTrendZj", "datesUsageTrendWbj"].includes(this.data.code)
        ) {
          time = `${this.info.timePick[0]}至${this.info.timePick[1]}`;
        }
        time
          ? ctx.fillText(`${this.info.title} (${time})`, left, top)
          : ctx.fillText(`${this.info.title}`, left, top);
        let dataURL = canvas.toDataURL("image/png");
        let a = document.createElement("a");
        // 创建一个单击事件
        let event = new MouseEvent("click");
        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = `${this.info.title}.png` || "报表图片";
        // 将生成的URL设置为a.href属性
        a.href = dataURL;
        // 触发a的单击事件
        a.dispatchEvent(event);
      };
    },
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.box {
  position: relative;
  width: 100%;
  // height: 200px;
  height: 100%;

  .chart_title {
    color: #fff;
  }

  .big-icon {
    position: absolute;
    top: -12px;
    right: 12px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    z-index: 999;
    transition: opacity 1s;
    opacity: 0;
  }

  .chart {
    width: 100%;
    height: 100%;
  }

  .error, .error2{
    // padding: 3em;
    // text-align: center;
    color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .error2{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(32, 50, 111);
  }
  .error3 {
    position: absolute;
    text-align: center;
    color: #333;
    font-size: 14px;
    background-color:#FFFFFF;
  }
}

.box:hover .big-icon {
  display: block;
  opacity: 1;
  transition: opacity 1s;
}
</style>
