<template>
  <div class="relative_map" >
    <div class="chart" ref="chart" :style="{height: canvasHeight + 'px'}">
      <div class="error" v-if="errorMsg">{{errorMsg}}</div>
    </div>
  </div>
</template>

<script>
import { getRelative } from '@/api/mapData.js'
import echarts from '@/plugins/echarts'
export default {
  name: 'relativeMap',
  props: ['id'],
  data () {
    return {
      errorMsg: null,
      chart: null,

      //找出子节点最多的数量
      maxChildCount: 1,

      //关系树的深度
      deep: 0,
      chartData: [],
      linksData: []
    }
  },
  computed:{
    canvasHeight(){
      return this.maxChildCount * 100
    }
  },
  methods: {
    async getRelative () {
      let res = await getRelative(this.id)
      //遍历树 整理数据
      this.handlerRelativeData([res])
      if (!this.chartData.length) {
        this.$emit('closeRelativeMap')
      }

      console.log(this.chartData)
      console.log(this.linksData)

      //渲染图表
      this.$nextTick(()=>{
        this.initChart(res)
      })

    },
    initChart (data) {
      if (!data || !Object.keys(data).length) {
        this.errorMsg = `无`
        return
      }

      const instance = echarts.init(this.$refs['chart'])
      let optionData = {};
      optionData = {
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        tooltip:{
          formatter: function (params) {
            const {pname, tag, source,target} = params.data
            return source ? `${source}->${target}` : `姓名：${pname} <br/> 接触方式：${tag||'未知'}`
          },
          padding: 5,
          textStyle:{
            color:'#fff',
          },
          // backgroundColor : '#ff9300'
        },
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize:  70,
            roam: true,
            label: {
              //节点内容
              formatter: function (params) {
                const data = params.data
                return `${data.pname.trim()} ${data.tag ? '\n{a|' + data.tag.trim() + '}' : ''}`
              },
              show: true,
              align: 'center',
              color:'#fff',
              fontSize: 16,
              rich: {
                a: {
                  fontSize: 12,
                  padding: [2,4],
                  color: '#fff',
                  backgroundColor: '#ff9300',
                  lineHeight: 18,
                  borderRadius: 10
                }
              },
            },
            edgeSymbol: ['none', 'none'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20,
              show: true
            },
            data: [],

            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0,
              color:'#2151f4'
            },
            itemStyle: {
              borderWidth: 1,
              borderType:'solid',
              borderColor: '#fff',
              color: (seriesIndex, dataIndex, data, value) => {
                if (seriesIndex.dataIndex == '0') {
                  return '#ff9f00'
                }
                return '#2151f4'
              }
            },
          }
        ]
      }
      optionData.series[0].data = this.chartData
      optionData.series[0].links = this.linksData
      instance.setOption(optionData)

      this.chart = instance
    },

    //节点数据
    handlerRelativeData (data, deep = 0 ,parent ) {

      this.maxChildCount = Math.max(this.maxChildCount, data.length)

      for (let i = 0; i < data.length; i++) {

        const item = data[i]
        const name = `${item.name.trim()}`

        //节点数据
        this.chartData.push({
          name,  //作为节点唯一标识，不用用于展示
          pname: item.name.trim(), //用于展示的名称
          relation: item.relationName,
          tag: item.tag,
          x: deep * 200,
          y: (i - data.length / 2) * 100,
        })

        //连线数据
        if (parent) {
          this.linksData.push({
            target: name,
            source: parent.name,
            relation: item.relationName,
            label: {
              show: true,
              color: '#fff',
              fontSize: 12,
              lineHeight: 16,
              formatter: function (params) {
                return params.data.relation || '关系未知'
              }
            }
          })
        }

        //处理子节点
        if (item.children && item.children.length) {
          this.handlerRelativeData(item.children, deep + 1, {name})
        }

      }
    }

  },
  mounted () {
    this.getRelative()
  }
}
</script>

<style lang="scss" scoped>
.relative_map {
  position: relative;
  background-color: #192a57;

  .chart {
    width: 100%;
    min-height: 220px;
  }
  .error {
    padding: 2em;
    text-align: center;
    color: #999;
  }
}
</style>
