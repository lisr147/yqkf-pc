<template>
  <div :class="className" >
    <div class="chart_dom" ref="dom"></div>
    <van-empty image="error"  v-if="loadFail">
      <template slot="description">
        <p>{{title}}</p>
        <p> 图表加载失败，请检查图表配置</p>
      </template>
    </van-empty>
  </div>
</template>

<script>
import echarts from '@/plugins/echarts'
import {chartColors} from '@/config/setting'
import { getPanelData } from '@/api/chart'
import axios from 'axios'

const animationDuration = 1000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: { type: Number, String },
    title: { type: String }
  },
  data () {
    return {
      chart: null,
      loadFail: false
    }
  },
  watch: {
    id (newValue) {
      this.getData()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
      this.getData()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$refs['dom'])
      this.chart.setOption({
        color: chartColors[0].data,
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 78,
          left: '10',
          right: '10',
          bottom: '20',
          containLabel: true
        },

        xAxis: [{
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            show: true
            // interval: 1
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        legend: {
          top: 50,
          right: 10,
          align: 'left',
          type: 'scroll'
        },
        series: []
      })
    },
    // 请求图表数据
    getData () {
      if (!this.id) {
        return
      }
      getPanelData({
        id: this.id
      }).then((res) => {
        this.setData(res.panelItemData.data)
      }).catch(res => {
        this.loadFail = true
        console.log('图表加载失败：' + this.id)
      })


    },
    // 更新数据
    setData (newData) {
      if (!this.chart || !newData.data.xAxisDatas || !newData.data.yAxisDatas) {
        return
      }
      let seriesData = []
      let legendData = []
      // 整理y轴数据
      newData.data.yAxisDatas.forEach(item => {
        seriesData.push({
          name: item.name,
          type: 'bar',
          // stack: 'vistors',
          // barWidth: '50%',
          barGap: '10%',
          data: item.data,
          animationDuration
        })
        legendData.push(item.name)
      })

      // 重新给chart赋值
      this.chart.setOption({
        title: {
          top: 8,
          left: 8,
          text: newData.title,
          subtext: '更新时间：' + (newData.update || newData.updateTime),
          show: false
        },
        xAxis: [{
          type: 'category',
          data: newData.data.xAxisDatas,
          axisTick: {
            alignWithLabel: true
          }
        }],
        legend: {
          data: legendData
        },
        series: seriesData
      })

      // if (this.data.title) {
      //   this.chart.setOption({
      //     title: {
      //       text: this.data.title,
      //       top: '8',
      //       left: '10',
      //       textStyle: {
      //         color: '#606266',
      //         fontSize: 14
      //       }
      //     }
      //   })
      // }
    },
    resize () {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>
