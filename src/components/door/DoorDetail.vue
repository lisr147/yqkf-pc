<template>
  <el-dialog
      v-dialogDrag
      title="居家隔离户信息"
      top="18vh"
      width="600px"
      @close="handleClose"
      class="door-detail-dialog-container"
      :visible="showme"
      :modal="false">
    <div class="door-detail-container">
      <div class="door-tab-wrapper">
        <div class="door-tab-item" @click="changeTab(1)" :class="{'active': currentTabIndex === 1}">今日设备告警</div>
        <div class="door-tab-item" @click="changeTab(2)" :class="{'active': currentTabIndex === 2}">告警统计</div>
      </div>
      <div class="door-content-wrapper">
        <div class="door-content-item" v-show="currentTabIndex === 1">
          <div v-if="alarmList && alarmList.length">
            <el-timeline :reverse="false">
              <el-timeline-item
                  v-for="(item) in alarmList"
                  :key="item.id"
                  :color="item.isActive ? '#ff3233' : '#3664d3'"
                  placement='top'>
                <div class="time-line-content" :class="{'active': item.isActive}">
                  <span class="t1 tt">{{item.timeHMS}}</span>
                  <span class="t2 tt">{{item.eventName}}</span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div class="no-data" v-else>暂无数据</div>
        </div>
        <div class="door-content-item" v-show="currentTabIndex === 2">
          <div class="chart" ref="chart">
            <div class="no-data">暂无数据</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {getDoorAlarm, getDoorAlarmChart} from '@/api/mapData'
import echarts from '@/plugins/echarts'
export default {
  name: 'DoorDetail',
  props: {
    showme: {type: Boolean},
    data: {type: Object},
  },
  model:{
    prop: 'showme',
    event: 'toggle'
  },
  data () {
    return {
      alarmList: [],
      optionData:{},
      currentTabIndex: 1
    }
  },
  watch:{
    data: {
      handler: function () {
        if (this.data && this.data.deviceImei) {
          this.currentTabIndex = 1
          this.getData()
          this.getChartData()
        }
      },
      immediate: true
    }
  },
  async mounted() {

  },
  methods: {
    async getData () {
      console.log('data',this.data)
      await getDoorAlarm({imei:this.data.deviceImei}).then(res => {
        console.log('获取设备告警', res)
        this.alarmList = res && res.length ? res.map(item => {
          item.isActive = ['紧急报警','门磁打开'].indexOf(item.eventName) > -1
          return item
        }) : []
      })
    },
    // 获取告警统计报表
    async getChartData () {
      await getDoorAlarmChart({imei:this.data.deviceImei}).then(res => {
        console.log('获取告警统计报表', res)
        this.optionData = res.option
      })
    },
    initChart (optionData) {
      if (optionData && optionData.xAxis && optionData.xAxis.length) {
        const instance = echarts.init(this.$refs['chart'])
        let legendData = optionData.series.map(item => item.name)
        console.log('legendData',legendData)
        let series =  optionData.series.map(v => {
          let formatItem = {
            name: v.name,
            type: 'line',
            data: v.data
          }
          return formatItem
        })
        console.log('series',series)
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#ff913f','#2f54eb','#71e7a2','#71ac5e','#ff223b','#1ee7e7'],
          legend: {
            data: legendData,
            textStyle:{
              color:"#fff"
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#fff",
              }
            },
            data: optionData.xAxis[0].data
          },
          yAxis: {
            splitLine : {show:false,lineStyle: {color: '#22395b'}},
            axisLine: {
              lineStyle: {
                color: "#fff",
              }
            },
            minInterval: 1,
            type: 'value'
          },
          series: series
        }
        instance.setOption(option)
      }
    },
    handleClose(){
      this.$emit('toggle', false)
    },
    changeTab (index) {
      this.currentTabIndex = index
      if (index === 2) {
        this.$nextTick(() => {
          this.initChart(this.optionData)
        })
      }
    }
  }

}
</script>
<style lang="scss">
.door-detail-dialog-container {
  .el-dialog {
    left: 60%;
    top: 16vh;
  }
}
.door-detail-container {
  min-height: 200px;
  height: 50vh;
  overflow-y: auto;
  .el-timeline-item__tail {
    border-left: 3px solid #5478E4;
  }
  .el-timeline-item__timestamp {
    color: #fff;
    font-size: 15px;
  }
  .time-line-content {
    color: #fff;
    //background-color: #192B61;
    //padding: 6px 10px;
    border-radius: 3px;
    margin-top: 12px;
    width: 90%;
    font-size: 15px;
    .tt {
      color: #fff;
      font-size: 14px;
    }
    &.active {
      .tt {
        color: #ff4b52;
      }
    }
    .t1 {
      margin-right: 10px;
    }
  }
  .door-tab-item {
    font-size: 14px;
    padding: 8px 12px;
    text-align: center;
    margin-right: 2px;
    //border-radius: 4px;
    background-color: #1f3b8e;
    color: #7490e4;
    cursor: pointer;
    &.active {
      background-color: #3664d4;
      color: #fff;
    }
  }
  .door-tab-wrapper {
    display: flex;
    align-items: center;
  }
  .door-content-wrapper {
    margin-top: 20px;
    margin-left: 20px;
  }
  .no-data {
    color: #fff;
    font-size: 14px;
    text-align: center;
    padding-top: 80px;
  }
  .chart {
    width: 100%;
    height: 30vh;
  }
}
</style>
<style lang="scss" scoped>
</style>
