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
const light =
  "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LjljY2M0ZGU5MywgMjAyMi8wMy8xNC0xNDowNzoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjMgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjQwQUJGMTUxNDdGMTFFRDg0NjVENEFFQzlFMUEzOEUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjQwQUJGMTYxNDdGMTFFRDg0NjVENEFFQzlFMUEzOEUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNDBBQkYxMzE0N0YxMUVEODQ2NUQ0QUVDOUUxQTM4RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNDBBQkYxNDE0N0YxMUVEODQ2NUQ0QUVDOUUxQTM4RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjMl55MAAAKUSURBVHjatJbBbtQwEIYTx9tkoWwjeq9A4oQ4ceQMzwAIDvBkvUEfAQl4CQ6ckKiWM6hlW7Ibxw7jamb5M02yS6GWfnk3nvjL2J7xpA/nn5KBlo4IWzuiS81uABlWpnpsgeRVH4bAdgAmE1vWBH4jVCANy8FvGUsQahXMAChCdki56q0Cxslr0kr1DmzE4zUQl3DCKkhT0g3oc7Zp4b3AkF+kCnqZ04F9i8AMPIuAm6Rd0oz/B5BuOdtU/H4Gh0tgXoDau4Jhe6SSnzfJeJMPieB9BuIJlvHUAszyHk3ZsxIm27aJbckeoQJ6KMCc92rGzzqw+0V+cFDsPMlNeif+X4X2eL6s339eruYKbHgOB7o4uRb2bwIeTnEZySh9XN56NbPZc1iuJDfJowe706f0EUcfThaHzZ/9CjCP7GuEejPgYcczgr0m2EuEQcto7EW06VleOdkSSqlRJ1TiLeAy0oTPNm1etIm2CoixmyHQALSTuuKeDXh2yVO21XuJ2Sk1PVmmk/vkgGzTyPZeT2Jfw5KeRHztzcCXrIMTDVxov207GYXJl57LwGMuNQCTrO/xjeNl/W7L4A8xJtUznPMCKkAPWb/GpY5B/bPxbzfRoo1KAIZjrwZoix42kPU7exuDmiZ8o70XL+LYx9Ozw57tOuc55X5sUyoxJBwKzqF7nIDzkdR2l/fs60hqi6DvpFPSGWkZwREoMagT9+1/PJA/SCcMq3hpvVVLWvOgxE7Zl8Q3nPrAoAWAGrwt8M5yqjLzPRfwEMgwYME652V0WFRZiEMPsYPP3BVLDIHJfdipafBaceC1ACv+4r8tohDW6qqtxYwAycDxfVZdsUxsh8pEXfAE8MBdVyGMhU+q0t5/KfV/CzAAAQFSKNvO97EAAAAASUVORK5CYII=";

const animationDuration = 1000;
export default {
  name: "strip-chart",
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
      // immediate: true,
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
    // this.$nextTick(() => {
    //   this.getData();
    // });
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

      //   this.setData(this.data);
    },
    initChart() {
      //找出数组最大值
      let max = 0
      this.series.series.forEach(e=>{
        max = max <= e ? e : max
      })
      this.chart = echarts.init(this.$refs["chart"]);
      this.chart.setOption({
        color: this.color,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{b0}: {c0}人'
          // formatter(val){
          //   console.log('tooltip', val)
          // }
        },
        grid: {
            bottom: '0%',
            left: '5%',
            right: '5%',
            top: '5%',
            containLabel: false
        },
        legend: {
          show: false,
          textStyle: {
            color: "#ffffff",
          },
          top: 10,
        },
        xAxis: [
          {
            type: "value",
            show: false,
            axisLine: {
              lineStyle: {
                color: "#364f9a",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "category",
            splitLine: "none",
            axisTick: "none",
            axisLine: "none",
            show: true,
            inverse: true,
            axisLabel: {
              textStyle: {
                color: "#fff",
                verticalAlign: "bottom",
                align: "left",
                padding: [0, 10, 4, 10],
              },
            },
            data: this.series.yAxis,
          },
          {
            type: "category",
            splitLine: "none",
            axisTick: "none",
            axisLine: "none",
            show: true,
            inverse: true,
            axisLabel: {
              textStyle: {
                color: "#FFFF33",
                verticalAlign: "bottom",
                align: "right",
                padding: [0, 10, 4, 0],
              },
            },
            data: this.series.series.map(v=>{return v+ '人'}),
          },
        ],

        series: [
          {
            name: "人数",
            stack: "chart",
            barWidth: 8,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "#E9E9E9",
              borderRadius: 5,
            },
            itemStyle: {
              color: "#56D0A4",
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0.1,
                    color: "#56D0A4",
                  },
                  {
                    offset: 1,
                    color: "#8BF7E4",
                  },
                ]),
                barBorderRadius: 5,
              },
            },
            data: this.series.series,
          },
          {
            name: "icon",
            type: "pictorialBar",
            symbol: light,
            symbolSize: [20, 20],
            symbolOffset: [10, 0],
            symbolPosition: "end",
            z: 12,
            itemStyle: {
              normal: {
                color: "#88F6E2",
                borderColor: "#33E2D2",
                shadowColor: "rgb(51,226,210)",
                shadowBlur: 10,
              },
            },

            data: this.series.series,
          },
          {
            name: "人数",
            stack: "chart",
            barWidth: 8,
            type: "bar",
            itemStyle: {
              color: "rgba(233, 233, 233, 0.17)",
              offset: [10, 0],
              normal: {
                color: 'rgba(233, 233, 233, 0.17)',
                barBorderRadius: 5,
              },
            },
            data: this.series.series.map(v=>{return max-v}),
          },
        ],
      });
    },
    // 更新数据
    setData(newData) {
      const labelRight = {
        position: "right",
      };
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
          top: 0,
          bottom: 30,
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
          ],
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              formatter: "{c}",
            },
            barWidth: "50%",
            data: [
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
              { value: 100, label: labelRight },
            ],
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