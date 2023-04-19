<template>
  <div class="box">
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import echarts from '@/plugins/echarts'
/**
 * 默认主题文件，不同主题加载不同的文件
 */
import defaultOption from './ChartTheme'

export default {
  name: 'ChartBoardV1',
  components: {},
  props: {
    info: {type: Object},
    data: {type: Object, required: true},
  },
  data () {
    return {

    }
  },
  mounted () {
    let data = this.getData()
    this.initChart(data)
  },
  computed: {
    chartSkin() {
      return this.$store.state.user.themeData.chartSkin
    }
  },
  methods: {

    getData () {
      // 处理数据
      let panelItemOptionData
      const orgData = this.data['panelItemData']['data'].data
      const type = this.info['type']

      switch (type) {
        case 'PieChart':
          panelItemOptionData = this.getPieOption(orgData)
          break
        case 'Histogram':
          panelItemOptionData = this.getBarOption(orgData)
          break
        case 'LineChart':
          panelItemOptionData = this.getLineOption(orgData)
          break
        default:
          break
      }

      let optionData = this.data['optionData'] && this.data['optionData'].length > 0 ? JSON.parse(this.data['optionData']) : {}

      return {
        // 图表配置定制样式
        optionData,
        //（处理后)的接口返回数据
        panelItemOptionData
      }
    },

    initChart(data) {
      if (!data.panelItemOptionData) {
        return
      }
      delete data.panelItemOptionData.title
      const instance = echarts.init(this.$refs['chart'])

      instance.setOption(data.panelItemOptionData)
      instance.setOption(defaultOption(data.optionData, data.panelItemOptionData,instance, this.chartSkin))
      // 渲染图表定制样式
      instance.setOption(data.optionData)
    },

    getPieOption(orgData){
      const legendData = orgData.map(item => item.name)
      return {
        legend: {
          textStyle: {
            color: '#B1B9C4',
            fontSize: 10
          },
          type: 'scroll',
          orient: 'vertical',
          top: '10',
          right: '20',
          data: legendData
        },
        series: [{
          name: this.info.title,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['35%', '50%'],
          data: orgData,
          animationEasing: 'cubicInOut',
          label: {
            show: false,
            formatter: '{b}\n{c}'
          }
        }]
      }
    },

    getBarOption(orgData) {

      let seriesData = []
      let legendData = []
      // 整理y轴数据
      orgData.yAxisDatas.forEach(item => {
        seriesData.push({
          name: item.name,
          type: 'bar',
          barGap: '10%',
          data: item.data,
        })
        legendData.push(item.name)
      })

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: orgData.xAxisDatas,
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
          data: legendData
        },
        series: seriesData
      }
    },

    getLineOption(orgData) {
      return {
        xAxis: {
          data: orgData.xAxisDatas,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          top: 30,
          right: 10,
          align: 'left',
          type: 'scroll'
        },
        series: orgData.yAxisDatas
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .box {
    position: relative;
    width: 100%;
    height: 100%;

    .chart {
      width: 100%;
      height: 100%;
    }
  }
</style>
