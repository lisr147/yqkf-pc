<template>
  <div style="position: relative;" :style="{height:errorMsg ?'300px':'550px'}">
    <div id="container" ref="chart"></div>
    <div class="error" v-if="errorMsg" :style="{left:isMobile ?'37%':''}">{{ errorMsg }}</div>
  </div>
</template>

<script>
import * as echarts from '@/plugins/echarts.min5.3.2.js'

export default {
  name: 'DoubleXChartBoard',
  components: {},
  props: {
    data: {type: Object, required: true},
    info: {type: Object},
    timePick: {type: Array},
    isMobile: {type: Boolean},
  },
  data() {
    return {
      myChart: null,
      errorMsg: null
    }
  },
  mounted() {
    this.initChart(this.data)
    window.addEventListener('resize', () => {
      if(this.myChart){
        this.myChart.resize();
      }
    });
  },
  methods: {
    initChart(chartData) {
      if (this.myChart) {
        this.myChart.dispose()
      }
      let data = chartData.panelItemData.optionData?.series[0]?.data || []
      if (data.length > 10) data = data.slice(0, 10)
      let xAxisData = []
      let xAxisGroupData = []
      let xAxisGroupData2 = []
      let seriesData = []
      let groupSeparates = []
      let keyList = []
      data.map((item) => {
        let count = item.list.length
        if (count > 0) {
          item.list.map((v, index) => {
            keyList.push(v.key)
            if (xAxisGroupData2.includes(item.name)) {
              groupSeparates.push(false)
            } else {
              xAxisGroupData2.push(item.name)
              groupSeparates.push(true)
            }
            xAxisData.push(v.key)
            seriesData.push(v.value)
          })
        } else {
          // xAxisGroupData.push({
          //   value: item.name,
          //   textStyle: {
          //     fontSize: 16,
          //     lineHeight:150
          //   }
          // })
          // xAxisData.push(' ')
          // seriesData.push(' ')
          // groupSeparates.push(true)
        }
        for (let i = 0; i < count; i++) {
          xAxisGroupData.push({
            value: count === 1 || i === count / 2 || i === (count - 1) / 2 ? (count % 2 === 0 ? item.name + `{offset|}` : item.name) : '',
            textStyle: {
              fontSize: this.isMobile?8:data.length>5?10:14,
              lineHeight: 250
            }
          })
        }
      })

      if (seriesData.length === 0) {
        this.$emit('finished',true)
        return this.errorMsg = '本时段内无使用记录'
      }
      let max = keyList.reduce((pre, next) => {
        return pre.length > next.length ? pre : next
      })
      let maxLength = max.length
      let lineHeight = 180
      lineHeight = maxLength * 30
      xAxisGroupData.map(i => {
        i.textStyle.lineHeight = lineHeight > 330 ? 330 : lineHeight < 120 ? 120 : lineHeight
      })
      this.errorMsg = ''
      let showCount = 0
      this.data.panelItemData.optionData = {
        grid: {
          left: '2%',
          right: '2%',
          bottom: '6%',
          containLabel: true
        },
        tooltip: {},
        title: {
          show: false,
          text: this.info.title,
          x: 'center',
          // 控制主标题的样似
          textStyle: {//主标题的属性
            color: '#377fc9',//颜色
            fontSize: 16,//大小
            fontWeight: 700,//
          },

          // 控制副标题的样似
          subtextStyle: {//副标题的属性
            color: '#333',
            fontSize: 12,//大小
          },
        },
        // toolbox:{
        //   show: true,
        //   feature: {
        //     saveAsImage: {
        //       show:true,
        //       excludeComponents :['toolbox'],
        //       pixelRatio: 2
        //     }
        //   }
        // },
        xAxis: [{
          position: "bottom",
          data: xAxisData,
          axisTick: {
            length: 10 // 刻度线的长度
          },
          axisLabel: {
            textStyle: {fontSize: this.isMobile?10:12},
            rotate: 90,
            margin: 5, // 标签到轴线的距离
            formatter: function (value) {
              value = value ? value.toString() : '';
              let maxlength = 13;
              if (value.length > maxlength) {
                return value.substring(0, maxlength - 1) + "...";
              } else {
                return value;
              }
            },
          }
        }, {
          position: "bottom",
          data: xAxisGroupData,
          textStyle: {
            fontSize: 10,
          },
          axisTick: {
            length: 60,
            interval: (index, value) => {
              return groupSeparates[index]; // 根据标识分组的刻度线
            }
          },
          axisLabel: {
            margin: this.isMobile&&seriesData.length>12  ? 120 : 0,
            rotate: this.isMobile&&seriesData.length>12 ? 50 : 0,
            interval: 0, // 显示所有标签
          }
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          type: 'bar',
          data: seriesData,
          barMaxWidth: 60,
          label: {
            show: true,
            position: 'top',
            color: '#000',
          },
        }]
      };
      const chart = echarts.init(this.$refs["chart"]);
      let option = this.data.panelItemData?.optionData;
      chart.lastBandWidth = 0;
      // 监听渲染事件，只要bandWidth发生变化，重新设置标签偏移的值
      chart.on('rendered', () => {
        let bandWidth = chart._chartsViews[0].renderTask.context.outputData._layout.bandWidth;
        if (chart.lastBandWidth != bandWidth) {
          chart.lastBandWidth = bandWidth;
          // 延时执行否则echarts渲染异常
          setTimeout(() => {
            // 加上偏移后重新绘制
            let optionNew = {xAxis: [{}, {}]};
            // 增量更新偏移值
            optionNew.xAxis[1] = {axisLabel: {rich: {offset: {width: chart.lastBandWidth}}}};
            chart.setOption(optionNew);
          });
        }
      });
      if (location.href.includes("generateReport")) {
        let isFinished = false
        chart.on('finished',()=>{
          if(!isFinished){
            isFinished = true
            this.$emit('finished',true)
          }
        })
      }
      chart.setOption(option);
      this.myChart = chart

    },

    Export() {
      if (!this.myChart || !this.myChart.getDataURL()) return this.$message.error('暂无数据')
      let img = new Image();
      img.src = this.myChart.getDataURL({
        type: "png",
        pixelRatio: 1, //放大2倍
        backgroundColor: '#fff'
      });
      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // 设置字体大小
        ctx.font = "16px Microsoft YaHei"
        // 更改字号后，必须重置对齐方式，否则居中麻烦。设置文本的垂直对齐方式
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        // 距离左边的位置
        let left = canvas.width / 2
        // 文字颜色
        ctx.fillStyle = "#377fc9"
        // 文字在画布的位置
        let time = this.info.timePick ? `${this.info.timePick[0]}至${this.info.timePick[1]}` : ''
        time ? ctx.fillText(`${this.info.title} (${time})`, left, 20) : ctx.fillText(`${this.info.title}`, left, 20)
        let dataURL = canvas.toDataURL('image/png');
        let a = document.createElement('a');
        // 创建一个单击事件
        let event = new MouseEvent('click');
        a.download = `${this.info.title}.png` || '报表图片';
        // 将生成的URL设置为a.href属性
        a.href = dataURL;
        // 触发a的单击事件
        a.dispatchEvent(event);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100%;
}

.error {
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: center;
  color: #333;
  transform: translate(-50%, -50%);
}
</style>
