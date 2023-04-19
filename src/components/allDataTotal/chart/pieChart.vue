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
    series: { type: Object, required: true, default: null },
    
  },
  data() {
    return {
      chart: null,
      dataError: false,
      dataEmpty: false,
      updateTime: null,
      source: "",
      scrollIndex: 0,
      timer: null
    };
  },
  watch: {
    series: {
      handler(val) {
        if (!val){
          return
        }
        this.$nextTick(() => {
          this.getData();
          this.scroll()
          window.onresize = () => {
              this.chart.resize();
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getData();
    //   this.scroll()
    //   window.onresize = () => {
    //       this.chart.resize();
    //   }
    // });
  },
  destroyed() {
    clearInterval()
    this.timer = null
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
        grid: {
          top: "15%",
          left: "5%",
          right: "15%",
          bottom: "40%",
          containLabel: true,
        },
        series: [],
      });
    },
    // 更新数据
    setData(newData) {
        const data = [
              { value: this.series.nsjSamplingNum || 0, name: "南沙街" },
              { value: this.series.hgzSamplingNum || 0, name: "黄阁镇" },
              { value: this.series.dczSamplingNum || 0, name: "东涌镇" },
              { value: this.series.dgzSamplingNum || 0, name: "大岗镇" },
              { value: this.series.zjjSamplingNum || 0, name: "珠江街" },
              { value: this.series.lhzSamplingNum || 0, name: "榄核镇" },
              { value: this.series.hlzSamplingNum || 0, name: "横沥镇" },
              { value: this.series.wqsSamplingNum || 0, name: "万顷沙镇" },
              { value: this.series.lxjSamplingNum || 0, name: "龙穴街" },
            ]
      const option = {
        // legend: {
        //   show: false
        // },
        legend: {
            color: '#fff',
            orient: 'vertical',
            right: "5%",
            top: "15%",
            bottom: 30,
            textStyle: {
                fontSize: 14,
                color: "#D1D1D1"
            },
            icon: 'circle',
            data: [
            "南沙街",
            "黄阁镇",
            "东涌镇",
            "大岗镇",
            "珠江街",
            "榄核镇",
            "横沥镇",
            "万顷沙镇",
            "龙穴街",
          ],
          formatter: function (name) {
                return name + ' ' + data.find(v=>{return v.name===name}).value + '人';
            }
        },
        series: [
          {
            type: "pie",
            radius: ["35%", "50%"],
            center: ["30%", "50%"],
            silent: true,
            legendHoverLink: false,
            itemStyle: {
              borderColor: "rgba(32, 50, 111, 0.95)",
              borderWidth: 4,
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                show: true,
                fontSize: '10',
                fontWeight: 'bold',
                formatter: (params)=> {
                    let str =(`{b|${params.name}}`)+ '\n\n'+(`{d|${params.value}人}`);
                    return str
                },
                // formatter: '{b|b}\n{d|d}人',
                rich: {
                    b: {
                        color: "#DFDFDF",
                        fontSize: 14
                    },
                    d: {
                        color: "#fff",
                        fontSize: 24
                    }
                }
                }
            },
            data: data,
          },
        ],
      };

      // 重新给chart赋值
      this.chart.setOption(option);
    },
    scroll() {
        if (this.timer){
            clearInterval()
            this.timer = null
        }
        this.timer = setInterval(()=>{
                        
            this.chart.dispatchAction({
                type: 'downplay',
                dataIndex: this.scrollIndex > 0 ? this.scrollIndex - 1 : 9
            })
            this.chart.dispatchAction({
                type: 'highlight',
                dataIndex: this.scrollIndex
            })
            this.scrollIndex < 9 ? this.scrollIndex++ : this.scrollIndex = 0
        }, 2000)
    }
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