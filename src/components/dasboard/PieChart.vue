<template>
  <div :class="className" >
    <div class="chart_dom" ref="dom"></div>
    <van-empty image="error" v-if="loadFail">
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

const animationDuration = 1000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    data: {
      type: [Object, Array],
      default () {
        return {}
      }
    },
    title: {
      type: String
    },
    id: { type: Number, String },
    showLegend: {
      type: Boolean,
      default: true
    }
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
        color:  chartColors[0].data,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        }
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
    // 设置表格数据
    setData (newData) {
      if (!this.chart || !newData.data || newData.data.length <= 0) {
        return
      }

      let legendData = []
      newData.data.forEach(item => {
        legendData.push(item.name)
      })
      var nameLen = new Array(newData.data.length)
      var selected = {}// 选择默认选中项;
      if (newData.data.length > 5) {
        for (let j = 0; j < 5; j++) {
          nameLen[j] = true
        }
        ;
        for (let j = 5; j < newData.data.length; j++) {
          nameLen[j] = false
        }
        for (let k = 0; k < newData.data.length; k++) {
          selected[legendData[k]] = nameLen[k]
        }
      }

      newData.data.forEach(item => {
        if (parseFloat(item.value) === 0) {
          item.value = 0
        }
        if (parseFloat(item.value) === 100) {
          item.value = 100
        }
      })

      let opts = {
        title: {
          top: 8,
          left: 8,
          text: newData.title,
          subtext: '更新时间：' + (newData.update || newData.updateTime),
          show: false
        },
        series: [{
          name: '数据占比',
          type: 'pie',
          radius: ['30%', '50%'],
          center: ['50%', '50%'],
          data: newData.data,
          animationEasing: 'cubicInOut',
          animationDuration: animationDuration,
          label: {
            formatter: '{b}\n{c}',
          }
        }]
      }
      if (this.showLegend) {
        opts.legend = {
          // type: 'scroll',
          icon: 'circle',
          orient: 'horizontal',
          bottom: 20,
          left:  10,
          right: 10,
          data: legendData,
          selected: selected
        }
      }

      this.chart.setOption(opts)
    },
    resize () {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>
