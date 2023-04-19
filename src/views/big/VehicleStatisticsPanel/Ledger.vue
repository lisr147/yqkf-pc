<template>
  <div class="ledger">
    <div class="ledger-h">
      <h3>台账</h3>
      <el-popover
        width="360"
        popper-class="screen-popover"
        trigger="hover">
        <div v-html="infoData.description"></div>
        <i slot="reference" class="el-icon-question"></i>
      </el-popover>

      <time-tabs :default-value="tabValue" @change="handleTabChange($event)"/>
    </div>
    <div class="ledger-b" >
      <table class="stable" v-if="list.length>0">
        <thead>
        <tr>
          <th width="300px"></th>
          <th>日常状态</th>
          <th>战时状态</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in list" :key="index">
            <td>{{item.name}}</td>
            <td class="tc">{{item.dailyState}}</td>
            <td class="tc">{{item.wartimeState}}</td>
          </tr>
        </tbody>
      </table>
      <data-empty-box v-else/>
    </div>
  </div>
</template>

<script>
  import TimeTabs from "./TimeTabs"
  import {getStandBookOfVehical} from '@/api/bigCharts'
  import DataEmptyBox from "../layer/DataEmptyBox";

  export default {
    name: "Ledger",
    components: {
      DataEmptyBox,
      TimeTabs
    },
    data() {
      return {
        tabValue: 'day',
        list: [],
        infoData:{
          description: `
            1、负压车辆台账，可以按日、按周、按月来统计。<br/>
            2、按日统计，是显示最新一个生成任务日期记录的总数。<br/>
            3、按周统计，是显示最近一周（从系统当前日期往前推7天）记录的总数。<br/>
            4、按月统计，是显示最近一个月（从系统当前日期往前推30天）记录的总数。
          `
        }
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {

        let res = await getStandBookOfVehical({type: this.tabValue})
        res.forEach(item => {
          item.name = item.name || '未知'
        })
        this.list = res
      },
      handleTabChange(val){
        this.tabValue = val
        this.getData()
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .ledger{
    color: #fff;
    &-h{
      padding: 0.5em 0;
      h3{
        display: inline-block;
        padding: 0 0.5em;
        color: #fff;
      }
      .el-icon-question{
        display: inline-block;
        margin: 0 0.5em 0 0;
      }
    }
    &-b{

    }
    table{
      width: 100%;
      border-collapse: collapse;

      th{
        background-color:#364F9A;
      }

      th, td {
        padding: 6px;
        border:1px solid #314f98;
      }
      .tc {
        text-align: center;
      }
    }
  }
</style>
