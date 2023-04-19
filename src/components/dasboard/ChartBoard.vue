<template>
  <div class="box" :class="className">

    <van-empty image="error"  v-if="loadFail">
      <template slot="description">
        <!--<p>{{title}}</p>-->
        <p> 图表加载失败，请检查图表配置</p>
      </template>
    </van-empty>

    <div class="chart" ref="chart" v-else></div>

  </div>
</template>

<script>
import echarts from '@/plugins/echarts'
import { getChartData } from '@/api/chart'


export default {
  name: 'ChartBoard',
  components: {},
  props: {
    id: { type: [String, Number], required: true },
    className: {type: String, default: ''}
  },
  data () {
    return {
      isLoading: false,
      loadFail: false
    }
  },
  async mounted () {
    this.isLoading = true
    let data = await this.getData()
    this.isLoading = false

    this.initChart(data)
  },
  methods: {
    getData () {
      return new Promise((resolve, reject) => {
        getChartData({ id: this.id }).then(res => {
          resolve(res)
        })
      })
    },

    initChart (item) {
      if (item == undefined || item == null) {
        console.log(`显示数据加载失败`)
        return
      }

      const { id, title, itemType, panelItemData, data , optionData} = item

      try {
        let apiOptionData = panelItemData.optionData
        if (!apiOptionData) {
          this.loadFail = true
          return
        }
        delete apiOptionData.title

        Object.assign(apiOptionData, {
          color: this.$store.getters.chartColorStyle,
          grid: {
            // "top": "10%",
            "right": "6%",
            "bottom": "4%",
            "left": "4%",
            "containLabel": true
          },
          "nameGap":8
        })

        const instance = echarts.init(this.$refs['chart'])

        // 根据接口数据渲染图表
        instance.setOption(apiOptionData)

        // 渲染定制化的图表配置
        if(optionData){
          const customerOptionData = eval("(" + optionData + ")")
          delete customerOptionData.title
          instance.setOption(customerOptionData)
        }

      } catch (err) {
        console.error(`${item.title} ${item.id}`)
        console.error(err)
        // debugger
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
    margin-bottom: 4vw;

    .chart {
      width: 100%;
      height: 100%;
    }
  }
</style>
