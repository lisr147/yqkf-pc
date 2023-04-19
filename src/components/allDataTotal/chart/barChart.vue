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
    <!-- <div class="footer" v-if="!hideFooter">
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
    </div> -->
  </div>
</template>

<script>
import echarts from "@/plugins/echarts";

const animationDuration = 1000;
export default {
  name: "bar-chart",
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
        "#c4ccd3",
      ],
    },
    series: {type: Object}
  },
  watch: {
    series: {
      handler(val) {
        this.$nextTick(() => {
          this.getData();
        });
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      chart: null,
      dataError: false,
      dataEmpty: false,
      updateTime: null,
      source: "",
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
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: "15%",
          left: "1%",
          right: "5%",
          bottom: "40%",
          containLabel: true,
        },
        legend: {
          textStyle: {
            color: "#ffffff",
          },
          top: 10,
        },
        xAxis: [
          {
            type: "value",
            data: [],
            axisTick: {
              show: true,
              lineStyle: {
                color: "rgba(255, 255, 255, 0.15)",
                width: 1,
              },
            },
            axisLabel: {
              show: true,
              color: "#C9D1E4",
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.15)",
                width: 1,
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.15)",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "category",
            axisTick: {
              show: true,
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.15)",
                width: 1,
              },
            },
            axisLabel: {
              show: true,
              color: "#C9D1E4",
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.15)",
              },
            },
            minInterval: 1,
          },
        ],
        series: [],
      });
    },
    // 更新数据
    setData(newData) {
      const labelRight = {
        position: "right",
      };
      let seriesData = [];
      this.data.series[0].data.forEach((e) => {
        seriesData.push({ value: e, label: labelRight });
      });
      const option = {
        legend: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: 20,
          bottom: 10,
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
          data: this.data.yAxis[0].data,
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              formatter: "{c}",
            },
            barWidth: "50%",
            data: seriesData,
          },
        ],
      };


      // 重新给chart赋值
      this.chart.setOption(option);
    },
  },
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