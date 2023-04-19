<template>
  <div class="wrap">
    <div class="chart_title">{{title}}流入趋势图</div>
    <div ref="chart" class="vue-chart"></div>
    <div class="tip">更新时间：{{updateTime}}</div>
    <div class="tip">数据来源：移动运营商</div>
  </div>
</template>

<script>
import echarts from '@/plugins/echarts'
import { getPanelItemDataByCode } from '@/api/EpidemicAreaVisiter'
export default {
  props: {
    msg: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      chart: null,
      updateTime: '-',
      title: '-',
      colors: [
        '#65cb39',
        '#4061c8',
        '#f96058',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#c4ccd3',
      ],
    }
  },
  watch: {
    msg: {
      handler() {
        this.setTitle()
      },
      deep: true,
    },
  },
  mounted() {
    this.initChart()
    this.getData()
    this.setTitle()
  },
  methods: {
    setTitle() {
      let dict = {
        0: '低风险地区',
        1: '中风险地区',
        2: '高风险地区',
        3: '市内各区',
      }
      let t1 = ''
      let t2 = ''

      if (this.msg.date) {
        t1 = '历史'
      } else {
        t1 = '今日'
      }

      t2 = dict[this.msg.riskLevel]
      this.title = t1 + t2
    },
    getData() {
      let params = JSON.parse(JSON.stringify(this.msg))
      params.code = 'jrgfxdqlrqs'
      getPanelItemDataByCode(params).then((res) => {
        this.updateTime = res.updateTime
        let optionData = res.panelItemData.optionData
        let seriesData = []
        let xAxisData = []
        optionData.series.forEach((item) => {
          seriesData.push({
            name: item.name,
            type: 'line',
            data: item.data,
          })
        })
        xAxisData = {
          data: optionData.xAxis[0]?.data,
          type: 'category',
        }
        this.chart.setOption({
          xAxis: [xAxisData],
          series: seriesData,
        })
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs['chart'])
      this.chart.setOption({
        color: this.colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: '10',
          left: '15',
          right: '15',
          bottom: '20',
          containLabel: true,
        },
        legend: {
          textStyle: {
            color: '#cfd7e4',
          },
          top: 10,
          data: [
            {
              name: '用电量',
              // 强制设置图形为圆。
              icon: 'circle',
              // 设置文本为红色
              textStyle: {
                color: '#0ee7df',
              },
            },
          ],
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#ced6e3',
              formatter: function (params) {
                let str = params.split(' ')
                return str[0] + '\n' + str[1]
              },
            },
            axisLine: {
              lineStyle: {
                color: '#115c83',
                width: 2,
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,.2)',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#115c83',
                width: 2,
              },
            },
            axisLabel: {
              show: true,
              color: '#ced6e3',
            },
            splitLine: {
              lineStyle: {
                color: '#163343',
              },
            },
            minInterval: 1,
          },
        ],
        series: [
          {
            data: [],
            type: 'line',
          },
        ],
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  .vue-chart {
    width: 100%;
    height: 320px;
  }
}
.chart_title {
  font-size: 18px;
  color: #ffffff;
  padding: 10px 0 26px 0;
}
.tip {
  font-size: 14px;
  color: #ffffff;
  line-height: 20px;
  opacity: 0.4;
  padding-left: 20px;
}
</style>