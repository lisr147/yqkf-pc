<template>
  <div class="chart-box">
    <div class="error" v-if="dataError">
      <i class="el-icon-circle-close"></i>
      <p>图表加载失败</p>
    </div>
    <div class="error" v-if="dataEmpty">
      <i class="el-icon-folder-opened"></i>
      <p>当前无数据</p>
    </div>
    <div class="chart" ref="chart"></div>
    <div class="footer" v-if="!hideFooter">
      <div class="footer-m">
        <span>
          更新时间：{{
          updateTime && updateTime !== "null"
          ? updateTime
          : "2021-06-08 12:15:19"
          }}
        </span>
        <span>数据来源：{{ source }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "@/plugins/echarts";

const animationDuration = 1000;
export default {
  name: "chart-box",
  props: {
    info: { type: Object },
    data: { type: Object, required: true },
    hideFooter: { type: Boolean, default: true },
    type: { type: String },
    color: {
      type: [Object, Array],
      default: () => [
        "#3e61c9",
        "#13f3cf",
        "#61a0a8",
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
      dataEmpty: false,
      updateTime: null,
      source: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    // 请求图表数据
    getData() {
      if (this.data.xAxis.length === 0) {
        this.dataEmpty = true;
      }
      if (!this.dataEmpty) {
        this.initChart();
      }

      this.setData(this.data);
    },
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
          top: 10
        },
        xAxis: [
          {
            type: "value",
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
            type: "category",
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
    // 更新数据
    setData(newData) {
      const labelRight = {
        position: "right"
      };
      const option = {
        legend: {
          show: false
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: 0,
          bottom: 30
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          // axisLine: { show: false },
          // axisLabel: { show: false },
          // axisTick: { show: false },
          // splitLine: { show: false },
          data: [
            "南沙街",
            "东涌镇",
            "黄阁镇",
            "榄核镇",
            "万顷沙镇",
            "珠江街",
            "龙穴街",
          ]
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              formatter: "{c}"
            },
            data: [
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
            ]
          }
        ]
      };

      // 重新给chart赋值
      this.chart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-box {
  width: 100%;
  height: 100%;
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>