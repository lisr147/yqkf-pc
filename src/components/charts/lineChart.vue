<template>
  <div class="vue-chart">
    <div class="error" v-if="dataError">
      <i class="el-icon-circle-close"></i>
      <p>图表加载失败</p>
    </div>
    <div class="error" v-if="dataEmpty">
      <i class="el-icon-folder-opened"></i>
      <p>当前无数据</p>
    </div>
    <div ref="chart" class="vue-chart"></div>
  </div>
</template>

<script>
import echarts from "@/plugins/echarts"; // echarts theme

const animationDuration = 1000;

export default {
  name: "barChart",
  props: {
    data: {
      type: [Object, Array],
      default: () => []
    },
    color: {
      type: [Object, Array],
      default: () => [
        "#65cb39",
        "#4061c8",
        "#f96058",
        "#d48265",
        "#91c7ae",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3"
      ]
    }
  },
  data() {
    return {
      chart: null,
      dataError: false,
      dataEmpty: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs["chart"]);
      this.chart.setOption({
        color: this.color,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: "15%",
          left: "15",
          right: "15",
          bottom: "20",
          containLabel: true
        },
        legend: {
          textStyle: {
            color: "#cfd7e4"
          },
          top: 10,
          data: [
            {
              name: "用电量",
              // 强制设置图形为圆。
              icon: "circle",
              // 设置文本为红色
              textStyle: {
                color: "#0ee7df"
              }
            }
          ]
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              color: "#ced6e3"
            },
            axisLine: {
              lineStyle: {
                color: "#115c83",
                width: 2
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#115c83",
                width: 2
              }
            },
            axisLabel: {
              show: true,
              color: "#ced6e3"
            },
            splitLine: {
              lineStyle: {
                color: "#163343"
              }
            },
            minInterval: 1
          }
        ],
        series: []
      });
    },
    // 请求图表数据
    getData() {
      if (this.data.xAxisDatas.length === 0) {
        this.dataEmpty = true;
      }
      if (!this.dataEmpty) {
        this.initChart();
      }

      this.setData(this.data);
    },
    // 更新数据
    setData(newData) {
      if (!this.chart || !newData.xAxisDatas || !newData.yAxisDatas) {
        return;
      }
      let seriesData = [];
      let legendData = [];

      newData.yAxisDatas.forEach((item, index) => {
        seriesData.push({
          name: item.name,
          type: "line",
          data: item.data,
          lineStyle: {
            width: 4
          },
          z: 5,
          symbolSize: "10",
          animationDuration
        });

        legendData.push(item.name);
      });

      // 重新给chart赋值
      this.chart.setOption({
        xAxis: [
          {
            type: "category",
            data: newData.xAxisDatas,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        legend: {
          data: legendData
        },
        series: seriesData
      });
    }
  }
};
</script>

<style scoped>
.vue-chart {
  width: 100%;
  height: 100%;
}

.error {
  padding: 16px 0;
  text-align: center;
}
</style>
