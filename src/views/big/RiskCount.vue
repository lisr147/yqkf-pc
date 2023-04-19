<template>
  <div class="side-box risk-count-box">
    <div class="board">
      <div class="header">
        <h3 class="title">
          <template v-if="from==='right'">{{town}}</template>
          中高风险地区来粤返粤人员核查情况
          <!-- <span class="detail-btn" @click="openDetail">详情></span> -->
        </h3>
      </div>
<!--      <p class="time">{{ data.title }}</p>-->
      <!-- <div class="card-wrap">
        <div class="card" v-for="(item,index) in countList" :key="index" @click="openDetail(index)">
          <p class="t1">{{ item.name }}</p>
          <p class="t2">{{ item.value }}</p>
          <i class="icon el-icon-right"  v-if="index%2===0"/>
        </div>
      </div> -->

      <div class="card-wrap">
        <div class="card" @click="openDetail(0,{street:sszj , onlyTable:false})">
          <p class="t1">累计专项推送人员数量</p>
          <p class="t2">{{showData.zongbiao['累计专项推送人员数量']}}</p>
          <i class="icon el-icon-right"  />
        </div>
        <div class="card" @click="openDetail(0,{street:sszj, onlyTable:false})">
          <p class="t1">核查进度</p>
          <p class="t2">{{showData.zongbiao['核查进度']}}</p>
        </div>

        <el-popover
            width="360"
            popper-class="screen-popover"
            trigger="hover">
          {{about1}}
          <i slot="reference" class="el-icon-question"></i>
        </el-popover>

      </div>
      <div class="footer">
        <span>
          更新时间：{{showData.zongbiao['更新时间']}}
          <br>数据来源：{{ showData.zongbiao['数据来源'] }}
        </span>
      </div>
    </div>


    <div class="board">

      <div class="card-wrap">
        <div class="card" @click="openDetail(1,{street:sszj, onlyTable:false})">
          <p class="t1">当天专项清零数量</p>
          <p class="t2">{{showData.dangri['当天专项清零数量']}}</p>
          <i class="icon el-icon-right"  />
        </div>
        <div class="card" @click="openDetail(1,{street:sszj, onlyTable:false})">
          <p class="t1">核查进度</p>
          <p class="t2">{{showData.dangri['核查进度']}}</p>
        </div>

        <el-popover
            width="360"
            popper-class="screen-popover"
            trigger="hover">
          {{about2}}
          <i slot="reference" class="el-icon-question"></i>
        </el-popover>


      </div>

      <div class="footer">
        <span>
          更新时间：{{showData.dangri['更新时间']}}
          <br>数据来源：{{ showData.dangri['数据来源'] }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { getRiskAreasMsgPc } from '@/api/bigCharts'
import {mapState } from 'vuex'
export default {
  name: "RiskCount",
  components: {},
  props: {
    from: {type:String }, //来源是左侧还是右侧报表
  },
  data() {
    return {
      sszj:'',
      data:{},
      updateTime:"",
      countList:null,
      about1: `“累计专项推送人员数量”指2022年1月1日以来，由省CAT系统推送南沙区公安分局的中高风险专项人员累计核查数量。该数据市公安局南沙区分局负责、各镇街配合，通过在疫情防控指挥平台数据台账管理系统上传数据数据明细，再由本系统进行统计汇总。`,
      about2: `“今日专项清零数量”指“从前天16点至昨天16点”由省CAT系统推送到南沙区公安分局的数量。该数据由市公安局南沙区分局负责、各镇街配合，通过在疫情防控指挥平台数据台账管理系统上传数据明细，再由本系统进行统计汇总。`
    };
  },
  watch: {
    town(val){
      if(this.from==='right'){
        this.sszj = val
        this.getRiskAreasMsg()
      }
    },
  },
  computed:{
    ...mapState('common', ['town']),
    showData(){

      if (!this.countList) {
        return {
          zongbiao: {},
          dangri: {}
        }
      }
      let result = {zongbiao:{},dangri:{}}
      this.countList.zongbiao.forEach(v=>{
        result.zongbiao[v.name]=v.value
      })
      this.countList.dangri.forEach(v=>{
        result.dangri[v.name]=v.value
      })
      return result
    }
  },
  async mounted() {
    this.sszj = this.town
    this.getRiskAreasMsg()
  },

  methods: {
    openDetail(index, extData = {}) {
      this.$emit('showMhRiskDetail', Object.assign(this.countList, {index: index}, extData))
    },
    async getRiskAreasMsg () {
      let res = await getRiskAreasMsgPc()
      this.countList = res
    },
  },
};
</script>
<style lang="scss" scoped>
.risk-count-box {
  .detail-btn{
    margin-left: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  .time{
    margin: 10px 15px;
    font-size: 12px;
    color: #8795C2;
  }
  .card-wrap{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin: 3px 0;

    .el-icon-question{
      position: absolute;
      top: 0em;
      right: 1em;
    }

    .card{
      cursor: pointer;
      width: 40%;
      color: #fff;
      //background-color: #1d306d;
      padding: 10px;
      text-align: center;
      margin:5px;
      display: flex;
      align-items: center;
      flex-direction: column;
      position: relative;
      background: linear-gradient(90deg, rgba(244, 151, 77, 0.2) 0%, rgba(241, 153, 71, 0.03) 100%);
      .t1{
        font-size: 12px;
        color: #fff;
        margin: 2px auto;
        text-align: center;
      }
      .t2{
        //margin-top: 4px;
        //color: #ffff00;
        font-weight: 600;
        font-size: 24px;
        font-family: Bebas;
        color: #F4974E;
      }
      .icon{
        position: absolute;
        right: 10px;
        top:50%;
        transform: translateY(-50%);
      }
    }
  }
  .bottom-label{
    display: flex;
    .el-row{
      flex: 1;
    }
  }
}
</style>
