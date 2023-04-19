<template>
  <div class="ymjz">
    <div class="epidemic">
      <section class="total-data">
        <div class="title-wrap">
          <div class="m-title">疫苗接种总览</div>
          <i class="el-icon-question" @click="lookDesc('top1')" />
          <!-- <img
            class="look-img"
            :src="baseUrl + '/static/image/ctrl/question-line.svg'"
            @click="lookDesc('top1')"
          /> -->
        </div>

        <div class="data-list">
          <div
            v-for="(sub, index) in items"
            :key="'l1' + index"
            class="list-item"
          >
            <div class="item-title">{{ sub.name }}</div>
            <div class="item-value">
              <b>{{ sub.value }}</b>
              <span>{{ sub.unit }}</span>
            </div>
          </div>
          <div
            v-for="(sub, index) in items2"
            :key="'l2' + index"
            class="list-item"
          >
            <div class="item-title">{{ sub.name }}</div>
            <div class="item-value">
              <b>{{ sub.value }}</b>
            </div>
          </div>
          <div
            v-for="(sub, index) in items3"
            :key="'l3' + index"
            class="list-item"
          >
            <div class="item-title">{{ sub.name }}</div>
            <div class="item-value">
              <b>{{ sub.value }}</b>
              <span>{{ sub.unit }} </span>
            </div>
          </div>
        </div>

        <div class="update-time">
          更新时间:{{ updateTime }} 数据来源:区共享平台
          <span style="margin-left:30px;">
            来穗接种人数中有{{
              LSFKRS
            }}不属于南沙区来穗人口库(来穗人口库更新时间:{{ updateTime }})
          </span>
        </div>
      </section>

      <div class="charts">
        <section>
          <h2>疫苗接种人数趋势</h2>
          <div class="chart-content">
            <ul class="period-selector">
              <li
                class="period-selector-li"
                v-for="(item, index) in period"
                :key="index"
                @click="updateCharts(item)"
                :class="{ active: currIndex == item.id }"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
          <div class="box" ref="dom4"></div>
          <div class="updata-time">
            更新时间：{{ updateTime1 === "null" ? "2021-05-31" : updateTime1 }}
            数据来源：区共享平台
          </div>
        </section>

        <!-- <section>
          <h2>疫苗接种人数占比</h2>
          <div class="box" ref="dom1"></div>
          <div class="updata-time">
            更新时间：{{ updateTime2 === "null" ? "2021-05-31" : updateTime2 }}
            数据来源：区共享平台
          </div>
        </section> -->

        <section>
          <h2>疫苗接种次数占比</h2>
          <div class="chart-content" style="opacity:0;">
            <ul class="period-selector">
              <li
                class="period-selector-li"
                style="cursor: default;"
              >
              asdfasd
              </li>
            </ul>
          </div>
          <div class="box" ref="dom3"></div>
          <div class="updata-time">
            更新时间：{{ updateTime3 === "null" ? "2021-05-31" : updateTime3 }}
            数据来源：区共享平台
          </div>
        </section>

        <!-- 2022-1-25 新增123次接种比例，数据来自移动端-疫情防控 -->
        <section>
          <h2>全区疫苗接种分布</h2>
          <div class="chart-content" style="opacity:0;">
            <ul class="period-selector">
              <li
                class="period-selector-li"
                style="cursor: default;"
              >
              asdfasd
              </li>
            </ul>
          </div>
          <div class="box" ref="dom6"></div>
          <div class="updata-time">
            更新时间：{{ updateTime6 === "null" ? "2021-05-31" : updateTime6 }}
            数据来源：区共享平台
          </div>
        </section>

        <section>
          <h2>户籍人口疫苗接种分布</h2>
          <div class="box" ref="dom2"></div>
          <div class="updata-time">
            更新时间：{{ updateTime4 === "null" ? "2021-05-31" : updateTime4 }}
            数据来源：区共享平台
          </div>
        </section>

        <section style="width:65%;">
          <h2>接种点接种人数分布</h2>
          <div class="box" ref="dom5"></div>
          <div class="updata-time">
            更新时间：{{ updateTime5 === "null" ? "2021-05-31" : updateTime5 }}
            数据来源：区共享平台
          </div>
        </section>

        <!-- 占位 -->
        <section style="opacity:0" />
      </div>
      <epidemic-explaination
        v-show="isVisible"
        :txtList="txtList"
        @closed="isVisible = false"
      />
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/common";
import { getPanelItemDataByCode, getPanelData } from "@/api/chart";
import { getCountStaticData, get_covidInfo } from "@/api/epidemicM";
import { chartSetting } from "@/config/setting";
import echarts from "@/plugins/echarts";
import EpidemicExplaination from "./MobileEpidemicExplaination.vue";
export default {
  name: "Epidemic",
  components: {
    EpidemicExplaination,
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,

      items: [],
      items2: [],
      items3: [],
      LSFKRS: "",
      chartList: [],
      isVisible: false,
      updateTime: "",
      updateTime1: "",
      updateTime2: "",
      updateTime3: "",
      updateTime4: "",
      updateTime5: "",
      updateTime6: "",
      currIndex: 0,
      //图表统计间隔
      period: [
        { label: "日", value: "daysZkrTrendThird", id: 0 },
        { label: "周", value: "weeksZkrTrendThird", id: 1 },
        { label: "月", value: "monthsZkrTrendThird", id: 2 },
      ],
      txtList: [
        {
          txt:
            "1、疫苗接种数据来源于广东省疫苗流通与接种管理信息系统，每天中午12：00前同步前一天数据到大脑系统，然后下午两点清洗、加工和关联统计分析疫苗接种数据更新统计报表。",
        },
        {
          txt:
            "2、户籍人口总数和镇街户籍人员来源于区共享平台，来穗人员总数来源于第七次人口普查结果（采集于南沙部落）",
        },
        {
          txt:
            "3、总接种比例 = 全区接种人数（包含一次和两次、第三次）/ 全区常住人口总数 x 100% ",
        },
        {
          txt: "4、户籍接种比例 = 户籍人员接种总数 / 全区户籍人口总数  x 100%",
        },
        {
          txt: "5、来穗接种比例 = 来穗人员接种总数 / 全区来穗人口总数  x 100%",
        },
        {
          txt: "6、疫苗接种人数占比：相应接种人员数 / 全区常住人口总数 x 100%",
        },
        {
          txt: "7、疫苗接种次数占比：相应接种人员数 / 全区接种人员总数 x 100%",
        },
        {
          txt:
            "8、户籍人口疫苗接种分布：按镇街统计户籍人员接种人数分布，占比  = 镇街相应接种人员总数 / 镇街户籍人员总数 x 100%",
        },
        { txt: "9、疫苗接种人数趋势：按周和月统计全区接种人员总数" },
      ],
    };
  },
  mounted() {
    this.renderCharts();
    this.getCountData();
  },
  watch: {},
  methods: {
    lookDesc(code) {
      this.isVisible = true;
    },
    getCountData() {
      getCountStaticData().then((res) => {
        let populationStatic = ["HJZRS", "LDRS", "ZRS"];
        let vaccineStatic = ["HJJZRS", "LSJZRS", "ZJZRS"];
        res.forEach((e) => {
          if (e.key == "HJJZRS") {
            this.updateTime = e.updateTime || "";
          }
          if (populationStatic.indexOf(e.key) > -1) {
            this.items.push(e);
          } else if (vaccineStatic.indexOf(e.key) > -1) {
            this.items2.push(e);
          } else {
            if (e.key === "HJJZBL") {
              this.items3[0] = e;
            } else if (e.key === "LSJZBL") {
              this.items3[1] = e;
            } else if (e.key == "ZJZBL") {
              this.items3[2] = e;
            } else if (e.key == "LSFKRS") {
              this.LSFKRS = e.value;
            }
          }
        });
      });
    },
    initCharts() {
      ["dom1", "dom2", "dom3", "dom4", "dom5", "dom6"].forEach((id, index) => {
        if (!this.$refs[id]) {
          return;
        }
        this.chartList[index] = echarts.init(this.$refs[id]);
        this.chartList[index].setOption({
          textStyle: {
            color: "#fff",
          },
          legend: {
            textStyle: {
              color: "#fff",
            },
          },
        });
      });
    },
    //更新疫苗接种人数趋势报表
    updateCharts(val) {
      this.currIndex = val.id;
      getPanelItemDataByCode({ code: val.value }).then((res) => {
        let optionData = {};
        optionData = this.getChartStyle(
          val.value,
          res.panelItemData.optionData
        );
        this.chartList[3].setOption(optionData);
      });
    },
    async renderCharts() {
      if (this.chartList.length === 0) {
        this.initCharts();
      }

      //疫苗接种人数趋势
      //monthsStreetZkrTrend按月
      //weeksStreetZkrTrend按周
      getPanelItemDataByCode({ code: "daysZkrTrendThird" }).then((res) => {
        this.updateTime1 = res.panelItemData.updateTime;
        //获取最后接种疫苗时间
        // this.updateTime =
        //   res.panelItemData.optionData.xAxis[0].data[
        //     res.panelItemData.optionData.xAxis[0].data.length - 1
        //   ];
        let optionData = this.getChartStyle(
          "daysZkrTrendThird",
          res.panelItemData.optionData
        );
        this.chartList[3].setOption(optionData);
      });

      // 疫苗接种人数占比
      getPanelItemDataByCode({ code: "ymjztj" }).then((res) => {
        this.updateTime2 = res.panelItemData.updateTime;
        let optionData = this.getChartStyle(
          "ymjztj",
          res.panelItemData.optionData
        );
        this.chartList[2].setOption(optionData);
      });

      // 户籍人口疫苗接种分布
      getPanelItemDataByCode({ code: "ymjzfbThird" }).then((res) => {
        this.updateTime4 = res.panelItemData.updateTime;
        let optionData = this.getChartStyle(
          "ymjzfbThird",
          res.panelItemData.optionData
        );
        optionData.xAxis.axisLabel = {
          rotate: -20,
          interval: 0,
        };

        this.chartList[1].setOption(optionData);
      });

      //户籍人口接种比例
      getPanelItemDataByCode({ code: "hjrkjzbl" }).then((res) => {
        this.updateTime3 = res.panelItemData.updateTime;
        let optionData = this.getChartStyle(
          "hjrkjzbl",
          res.panelItemData.optionData
        );
        this.chartList[0].setOption(optionData);
      });

      //接种点人数分布比例
      getPanelItemDataByCode({ code: "organZkrThird" }).then((res) => {
        console.log("organZkrThird", res);
        this.updateTime5 = res.panelItemData.updateTime;
        // res.panelItemData.optionData.series.forEach(v=>{
        //   v.barWidth = '10%'
        // })
        // res.panelItemData.optionData.yAxis[0].data.splice(5,100)
        // res.panelItemData.optionData.series[0].data = res.panelItemData.optionData.series[0].data.splice(6,100)
        let optionData = this.getChartStyle(
          "organZkrThird",
          res.panelItemData.optionData
        );
        optionData.xAxis.axisLabel = {
          rotate: -20,
        };
        this.chartList[4].setOption(optionData);
      });

      // 2022-1-25 新增123次接种比例，数据来自移动端-疫情防控
      get_covidInfo().then((res) => {
        let num1 = res.huji_inject_first + res.liudong_inject_first;
        let num2 = res.huji_inject_second + res.liudong_inject_second;
        let num3 = res.huji_inject_third + res.liudong_inject_third;
        let total = res.area_total;
        let optionData = {
          title: { show: false },
          tooltip: {
            trigger: "axis",
            axisPointer: {},
            formatter(item) {
              item = item[0];
              return `${item.name} : ${item.data} ( ${(
                (item.data / total) *
                100
              ).toFixed(2)}% )`;
            },
          },
          // legend: {
          //   data: ["接种一次", "接种两次", "接种三次及以上"],
          //   top: "5%",
          // },
          xAxis: [
            {
              data: ["仅接种一次", "仅接种两次", "接种三次及以上"],
              type: "category",
              axisLabel: {},
              axisLine: { lineStyle: { color: "#fff" } },
            },
          ],
          yAxis: [
            {
              type: "value",
              axisLabel: {},
              axisLine: { lineStyle: { color: "#fff" } },
              axisTick: { show: false },
              splitLine:{
                show:false
              }
            },
          ],
          series: [
            {
              data: [num1, num2, num3],
              type: "bar",
              barWidth: "40%",
              label: {
                show: true,
                position: "top",
                formatter(item) {
                  return ` ${item.data}人(${((item.data / total) * 100).toFixed(
                    2
                  )}%)`;
                },
              },
            },
          ],
          updateTime: "2022-01-24 00:00:00",
          color: ["#00cdae", "#4eb04b", "#e9a230"],
          grid: { top: "20%", left: "15%", right: "5%", bottom: "10%" },
        };
        this.updateTime6 = res.updateTime;
        console.log("接种比例", res, optionData);
        this.chartList[5].setOption(optionData);
      });
    },
    getChartStyle(code, optionData) {
      optionData.title = { show: false };
      optionData.color = chartSetting.colorAcc;
      switch (code) {
        case "weeksZkrTrendThird":
          //数据处理-获取前一天日期
          var endivate = optionData.xAxis[0].data.slice(0);
          endivate.shift();
          var today = new Date();
          endivate.push(formatDate(today));
          endivate.forEach((item, index, arr) => {
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
            bottom: "10%",
          };
          // optionData.dataZoom = {
          //   type: 'inside'
          // }
          optionData.tooltip.formatter = function(item) {
            //获取周区间
            let date = new Date(item[0].axisValue);
            let today = new Date();
            let endivate = "";
            if (date.getTime() + 7 * 24 * 3600000 < today.getTime()) {
              date.setDate(date.getDate() + 6);
              endivate = formatDate(date);
            } else {
              endivate = formatDate(today.setDate(today.getDate() - 1));
            }
            return `${item[0].axisValue}至${endivate}
                <br/>接种总人数: ${item[0].value +
                  item[1].value +
                  item[2].value}人
                <br/> ${item[0].seriesName}: ${item[0].value}人
                <br/>${item[1].seriesName}: ${item[1].value}人
                <br/>${item[2].seriesName}: ${item[2].value}人`;
          };
          Object.assign(optionData.xAxis[0], {
            axisLabel: {
              // color: "#333",
              // showMaxLabel:'true',
              formatter: function(value, index) {
                return value.split("-")[1] + "-" + value.split("-")[2];
              },
            },
            axisLine: { lineStyle: { color: "#fff" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
          });
          Object.assign(optionData.yAxis[0], {
            type: "value",
            axisLabel: {
              // color: "#333",
              formatter: function(value, index) {
                if (value === 0) {
                  return value;
                } else if (value < 10000) {
                  return value + "人";
                } else {
                  return (Math.ceil(value / 1000) / 10).toFixed(1) + "万人";
                }
              },
            },
            axisLine: { lineStyle: { color: "#fff" } },
            splitLine: { lineStyle: { color: "#f0f0f0" } },
            axisTick: { show: false },
          });
          break;
        case "daysZkrTrendThird":
          optionData.legend.top = "5%";
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid = {
            top: "20%",
            left: "15%",
            right: "5%",
            bottom: "10%",
          };
          // optionData.dataZoom = {
          //   type: 'inside'
          // }
          optionData.tooltip.formatter = function(item) {
            return `${item[0].axisValue}
                <br/>接种总人数: ${item[0].value +
                  item[1].value +
                  item[2].value}人
                <br/> ${item[0].seriesName}: ${item[0].value}人
                <br/>${item[1].seriesName}: ${item[1].value}人
                <br/>${item[2].seriesName}: ${item[2].value}人`;
          };
          Object.assign(optionData.xAxis[0], {
            axisLabel: {
              // color: "#333",
              // showMaxLabel:'true',
              formatter: function(value, index) {
                return value.split("-")[1] + "-" + value.split("-")[2];
              },
            },
            axisLine: { lineStyle: { color: "#fff" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
          });
          Object.assign(optionData.yAxis[0], {
            type: "value",
            axisLabel: {
              // color: "#333",
              formatter: function(value, index) {
                if (value === 0) {
                  return value;
                } else if (value < 10000) {
                  return value + "人";
                } else {
                  return (Math.ceil(value / 1000) / 10).toFixed(1) + "万人";
                }
              },
            },
            axisLine: { lineStyle: { color: "#fff" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
            axisTick: { show: false },
          });
          break;
        case "monthsZkrTrendThird":
          optionData.legend.top = "5%";
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid = {
            top: "20%",
            left: "15%",
            right: "5%",
            bottom: "10%",
          };
          // optionData.dataZoom = {
          //   type: 'inside'
          // }
          optionData.tooltip.formatter = function(item) {
            return `${item[0].axisValue}
                <br/>接种总人数: ${item[0].value +
                  item[1].value +
                  item[2].value}人
                <br/> ${item[0].seriesName}: ${item[0].value}人
                <br/>${item[1].seriesName}: ${item[1].value}人
                 <br/>${item[2].seriesName}: ${item[2].value}人`;
          };
          Object.assign(optionData.xAxis[0], {
            axisLabel: {
              // color: "#333",
              // showMaxLabel:'true',
              formatter: function(value, index) {
                return value.split("-")[1] + "月";
              },
            },
            axisLine: { lineStyle: { color: "#fff" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
          });
          Object.assign(optionData.yAxis[0], {
            type: "value",
            axisLabel: {
              // color: "#333",
              formatter: function(value, index) {
                if (value === 0) {
                  return value;
                } else {
                  return Math.ceil(value / 10000) + "万人";
                }
              },
            },
            axisLine: { lineStyle: { color: "#fff" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
            axisTick: { show: false },
          });
          break;
        case "ymjztj":
          optionData.grid = {
            top: "5%",
          };
          optionData.legend = { show: false };
          optionData.series[0].center = ["50%", "50%"];
          optionData.series[0].radius = [0, "60%"];
          optionData.series[0].label = {
            formatter: "{b}:" + "\n" + "{@1}人" + "\n" + "({d}%)",
          };
          break;
        case "hjrkjzbl":
          optionData.grid = {
            top: "5%",
          };
          optionData.legend = { show: false };
          optionData.series[0].center = ["50%", "50%"];
          optionData.series[0].radius = [0, "60%"];
          optionData.series[0].label = {
            formatter: "{b}:" + "\n" + "{@1}人" + "\n" + "({d}%)",
          };
          break;
        case "ymjzfbThird":
          optionData.legend.top = "5%";
          optionData.legend.selectedMode = false;
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid.left = "18%";
          optionData.grid.right = "1%";
          // optionData.xAxis.boundaryGap = ['1%','30%']
          let [s1, s2, s3] = optionData.series;
          const arr = s1.data.map((val, index) => {
            let total = val + s2.data[index] + s3.data[index];
            let attribute = s2.atrributes[index];
            return {
              total,
              attribute,
              v1: val,
              v2: s2.data[index],
              v3: s3.data[index],
              p1: s1["_percent"][index],
              p2: s2["_percent"][index],
              p3: s3["_percent"][index],

              p_total:
                (
                  parseFloat(s1["_percent"][index].split("%")[0]) +
                  parseFloat(s2["_percent"][index].split("%")[0]) +
                  parseFloat(s3["_percent"][index].split("%")[0])
                ).toFixed(2) + "%",
            };
          });

          if (!optionData.tooltip) {
            optionData.tooltip = {};
          }
          optionData.tooltip.formatter = function(item) {
            const { v1, v2, v3, p1, p2, p3, p_total, total, attribute } = arr[
              item[0].dataIndex
            ];
            return `${item[0].name}: 
                <br/>户籍人口: ${attribute}人
                <br/>接种总人数: ${total}人(${p_total})
                <br/> ${item[0].seriesName}: ${v1}人(${p1})
                <br/>${item[1].seriesName}: ${v2}人(${p2})
                <br/>${item[2].seriesName}: ${v3}人(${p3})`;
          };

          s1.label = { show: false };
          s1.barWidth = "60%";
          s3.label = {
            show: true,
            position: "right",
            formatter({ dataIndex }) {
              const { attribute } = arr[dataIndex];
              // return `{a|${v1}人(${p1})}` + `\n` + `${v2}人(${p2})`;
              return `合计:${attribute}`;
            },
            // rich: {
            //   a: {
            //     color: "#5e6ef9",
            //   },
            // },
          };

          //样式
          optionData.xAxis = {};
          Object.assign(optionData.xAxis, {
            type: "value",
            // axisLabel: { color: "#333", showMaxLabel: false },
            axisLine: { lineStyle: { color: "#fff" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
            interval: 20000,
            max: function(value) {
              return value.max * 1.6;
            },
          });
          Object.assign(optionData.yAxis[0], {
            // axisLabel: { color: "#333", show: true },
            axisLine: { lineStyle: { color: "#fff" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
          });
          break;
        case "organZkrThird": {
          let seriesData = [];
          for (let i = 0; i < optionData.series[0].data.length; i++) {
            seriesData.push({
              name: optionData.yAxis[0].data[i],
              value: optionData.series[0].data[i],
              // label: {
              //   show:false,
              //   width: "4px",
              //   overflow: "break",
              //   normal: {
              //     // color: "black",
              //     // show: true,
              //     // position: [0, "-14px"],
              //     textStyle: {
              //       fontSize: 12,
              //     },
              //     // width:'5px',
              //     // overflow: 'break',
              //     formatter: function(a, b) {
              //       // let name = a.name.length > 25 ? a.name.substr(0,25) + '...' : a.name
              //       return a.name;
              //     },
              //   },
              // },
            });
          }
          optionData.series[0].data = seriesData;

          optionData.legend.top = "5%";
          optionData.legend.show = false;
          optionData.legend.selectedMode = false;
          if (!optionData.grid) {
            optionData.grid = {};
          }
          optionData.grid.left = "1%";
          optionData.grid.right = "1%";
          optionData.grid.top = "1%";
          // optionData.xAxis.boundaryGap = ['1%','30%']
          let [s1, s2, s3] = optionData.series;
          const arr = s1.data.map((val, index) => {
            let total = val.value + s2.data[index] + s3.data[index];
            return {
              total,
              v1: val.value,
              v2: s2.data[index],
              v3: s3.data[index],
            };
          });

          if (!optionData.tooltip) {
            optionData.tooltip = {};
          }
          optionData.tooltip.formatter = function(item) {
            const { v1, v2 } = arr[item[0].dataIndex];
            let nameList = item[0].name.split(",");
            let name = "";
            nameList.forEach((e) => {
              name += "<br/>" + e;
            });
            return `接种点：${name}
                <br/> ${item[0].seriesName}: ${v1}人
                <br/>${item[1].seriesName}: ${v2}人
                <br/>${item[2].seriesName}: ${v2}人`;
          };

          s1.label = { show: false };
          s1.barWidth = "40%";
          // s1.label ={
          //   show:true,
          //   position:'top',
          //   formatter(data) {
          //     // const { v1, v2,v3 } = arr[dataIndex];
          //     // return `{a|${v1.value}人}` + `/` + `${v2}人`;
          //     // console.log(data,arr[data.dataIndex])
          //     // return `${data.name}\n${arr[data.dataIndex].total}`
          //     return data.name
          //   },
          // }
          s3.label = {
            show: true,
            position: "right",
            formatter(data) {
              // const { v1, v2,v3 } = arr[dataIndex];
              // return `{a|${v1.value}人}` + `/` + `${v2}人`;
              // console.log(data,arr[data.dataIndex])
              // return `${data.name}\n${arr[data.dataIndex].total}`
              return `${data.name}：${arr[data.dataIndex].total}人`;
            },
            // rich: {
            //   a: {
            //     color: "#5e6ef9",
            //   },
            // },
          };

          //样式
          optionData.xAxis = {};
          Object.assign(optionData.xAxis, {
            type: "value",
            // axisLabel: { color: "#333", showMaxLabel: false },
            axisLine: { lineStyle: { color: "#fff" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
            // interval: 40000,
            max: function(value) {
              return value.max * 1.6;
            },
          });
          Object.assign(optionData.yAxis[0], {
            show: true,
            axisLabel: {
              color: "#fff",
              show: false,
              inside: true,
              fontSize: 9,
              verticalAlign: "bottom",
              lineHeight: 20,
            },
            axisLine: { lineStyle: { color: "#fff" } },
            // splitLine: { lineStyle: { color: "#f0f0f0" } },
          });

          // optionData.grid = {
          //   top: "20%",
          // };
          break;
        }
        default:
          break;
      }

      if (Array.isArray(optionData.xAxis)) {
        optionData.xAxis.forEach((v) => {
          v.splitLine = {
            show: false,
          };
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
    margin-top: 20px;
    padding: 20px;
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
    .update-time {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      opacity: 0.5;
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
      width: 32%;
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
      margin-right: 1%;

      .box {
        height: 450px;
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
</style>
