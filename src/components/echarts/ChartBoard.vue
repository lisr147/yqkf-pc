<template>
  <div class="box">
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import echarts from '@/plugins/echarts'
// 前端图表样式
import defaultOption from './ChartTheme'

export default {
  name: 'ChartBoard',
  components: {},
  props: {
    // info: { type: Object },
    data: { type: Object, required: true },
    // themeData: { type: Object }
  },
  data () {
    return {
      charData: null
    }
  },
  mounted () {
    let data = this.getData()
    this.initChart(data)
  },
  methods: {
    getData () {
      // debugger
      // 检查 清洗数据
      return {
        optionData: this.data,
        panelItemOptionData: this.data
      }
    },
    initChart (charData) {
      if (!this.charData) {
        this.charData = charData
      }
      let data = this.charData
      // delete data.panelItemOptionData.title

      // 清理optiondata中null的字段
      let clearData = (data) => {
        for (let i in data) {
          if (data[i] === null || data[i] === '') {
            delete data[i]
          }
          if (typeof (data[i]) === 'object') {
            clearData(data[i])
          }
        }
      }
      clearData(data.optionData)
      clearData(data.panelItemOptionData)
      const instance = echarts.init(this.$refs['chart'])
      instance.setOption(data.panelItemOptionData)
      instance.setOption(data.optionData)
      instance.setOption(defaultOption(data.panelItemOptionData, data.panelItemOptionData, instance))
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .box {
    position: relative;
    width: 100%;
    height: 400px;
    // height: 100%;

    .chart {
      width: 100%;
      height: 100%;
    }
  }
</style>
