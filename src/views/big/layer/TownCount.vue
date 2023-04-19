<template>
  <el-dialog custom-class="town-count-wrap"  :modal="false" :visible="true" @close="$emit('closeTownCount')"  width="95vw">
    <template slot="title">
      <div class="risk-title">
        <template v-if="!grid">{{town}}</template>{{sealAreaData.name}}{{grid}}统计
      </div>
    </template>
    <div class="town-box iscroll">
      <!--数据总览-->
      <card-total-data :list="listData" :showTime="false" :town="town" :grid="grid"></card-total-data>
      <template v-if="townData.zdryList">
        <h3 class="type-title">重点人员</h3>
        <div class="charts">
          <div class="charts-item" v-for="(item,index) in townData.zdryList" :key="index">
            <data-board  v-if="item.type==='chart'" :grid="grid" :id="item.id" :code="item.code" :title="item.title" :from="`${from}townCount`" :chartHeight="chartHeight"></data-board>
            <block-statistics class="town-block" v-if="item.type === 'block'" :code="item.code" :grid="grid" :from="`${from}townCount`"></block-statistics>
          </div>
        </div>
      </template>
      <template v-if="townData.zybzList">
        <h3 class="type-title">资源保障</h3>
        <div class="charts charts2" >
          <div class="charts-item" v-for="(item,index) in townData.zybzList" :key="index">
            <data-board v-if="item.type==='chart'" :grid="grid" :id="item.id" :code="item.code" :title="item.title" :from="`${from}townCount`" :chartHeight="item.height"></data-board>
            <block-statistics class="town-block" v-if="item.type === 'block'" :code="item.code" :grid="grid" :from="`${from}townCount`" ></block-statistics>
          </div>
        </div>
      </template>

      <epidemic-explaination
          v-show="isVisible"
          :txtList="txtList"
          title="数据说明"
          @closed="isVisible = false"
      />
    </div>

  </el-dialog>
</template>

<script>
// import ChartBoard from "@/components/charts/ChartBoard";
import DataBoard from '@/components/charts/DataBoard'
import BlockStatistics from '@/components/charts/BlockStatistics'
import EpidemicExplaination from "../MobileEpidemicExplaination";
import CardTotalData from "./CardTotalData";
import {getStreetStatistics,getWgStatistics} from "@/api/bigCharts";
import {mapState} from "vuex";
export default {
  name: 'TownCount',
  components: {
    DataBoard,
    BlockStatistics,
    EpidemicExplaination,
    CardTotalData
  },
  props: {
    grid:{type:String},
    town:{type:String},
    from:{type:String,required: true},

  },

  data () {
    return {
      chartHeight:280, //图表高度
      // town:'',//所属镇街
      isVisible:'',//数据总览说明
      txtList: [
        '网格数量：由区委政法委不定时更新。',
        '总人口：总人口=户籍人口+流动人口。',
        '户籍人口：户籍人口由区公共信息资源共享服务平台对接到本系统，本平台按镇街进行统计。',
        '流动人口：流动人员由区委政法委提供数据，不定时导入到疫情防控指挥平台数据台账管理系统，本平台按镇街进行统计。',
        '中高风险来粤返粤今日需核查人员：指今日推送的中高风险来粤返粤人员数。该数据市公安局南沙区分局负责，通过在疫情防控指挥平台数据台账管理系统上传数据方式每日更新。',
        '当前密接人员：指当前还在继续观察的密接人员数量。该数据由区卫生健康局通过在疫情防控指挥平台数据台账管理系统上传数据方式每日更新。',
        '当前次密接人员：指当前还在继续观察的次密接人员数量。该数据由区卫生健康局通过在疫情防控指挥平台数据台账管理系统上传数据方式每日更新。',
        '当前红码人员：指当前为红码的人员数量。该数据通过区共享平台对接，每日更新一次。',
        '当前黄码人员：指当前为黄码的人员数量。该数据通过区共享平台对接，每日更新一次。',
  ],
      updateTime:"",
      dataSource:"",
      townData: {},
      listData:[],//统计
      sswg:'',
      sealAreaData:{},//封控区
    }
  },
  computed: {
    ...mapState("common", ["sealarea"]),
  },
  mounted () {
    if(this.from==='index'&&this.grid){
      this.sswg = this.grid
      this.getWgStatistics()
    }else if(this.from==='sealArea'&& this.sealarea){
      this.sealAreaData =Object.assign({},this.sealarea)
      this.sswg = this.sealAreaData.sswg
      this.getWgStatistics()
    } else {
      this.getStreetStatistics()
    }

  },
  methods: {
    //镇街统计
    async getStreetStatistics(){
      let params = {
        sszj:this.town
      }
      let res = await getStreetStatistics(params)
      res.zybzList.map(i=>{
        i.height = 260
      })
      this.listData=res.listData.map((i,index)=>{
        i.desc = this.txtList[index]
        if(i.key==='当前密接人员'||i.key==='当前红码人员') i.color= '#D3230D'
        if(i.key==='当前次密接人员') i.color= '#F4974E'
        return i
      })
      this.townData = res
    },
    //网格统计
    async getWgStatistics(){
      let params = {
        sswg:this.sswg
      }
      let res = await getWgStatistics(params)
      res.zybzList.map(i=>{
        i.height = 260
      })
      this.txtList.splice(0,1)
      this.listData=res.listData.map((i,index)=>{
        i.desc = this.txtList[index]
        if(i.key==='当前密接人员'||i.key==='当前红码人员') i.color= '#D3230D'
        if(i.key==='当前次密接人员') i.color= '#F4974E'
        return i
      })
      this.townData = res
    },
    lookDesc() {
      this.isVisible = true;
    },
  }

}
</script>

<style lang="scss" scoped>
.town-box{
  height: 75vh;
  overflow: auto;
  color: #fff;
  .total-data {
    background-color: rgba($color: #223e7e, $alpha: 1);
    margin-top: 5px;
    padding: 20px 20px 20px 15px;
    .title-wrap {
      display: flex;
      align-items: center;
      font-size: 16px;
      i {
        margin-left: 10px;
      }
    }
    .data-list {
      display: flex;
      flex-wrap: wrap;
      .list-item {
        background-color: #324f96;
        margin: 6px;
        padding: 15px;
        min-width: 130px;
        text-align: center;
        font-size: 12px;
        .item-title {
          //white-space: nowrap;
          //height: 35px;
          margin-bottom: 5px;
        }
        .item-value {
          font-size: 18px;
          font-weight: 600;
          white-space: nowrap;
          color: #FFFE00;
          span {
            font-size: 14px;
            font-weight: normal;
            color: #fff;
          }
          .green{
            color: #19de43!important;
          }
        }
      }
    }
    .update-time {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      opacity: 0.5;
      margin-top: 5px;
    }
  }
  .type-title{
    font-size: 16px;
    font-weight: 500;
    color: #FFFFFF;
    margin: 15px 0 10px;
  }
  .town-block{
    padding-bottom: 35px;
  }
  ::v-deep.block-statistics{
    //padding: 0;
    background: none;
    position: relative;
    height: 100%;
    .header{
      background: none;
    }
    .footer{
      background: none;
      color: #909ebe;
      position: absolute;
      bottom:40px;
    }
  }
  .charts{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    ::v-deep .board{
      background: #223E7E;
      .header{
        background:none;
      }
      .board-item{
        background: #223E7E;
      }
      .footer{
        background: #223E7E;
        color: #909ebe;
      }
    }
    &-item{
      width: 23.3%;
      margin: .5em;
      padding: .5em;
      background: #223E7E;
    }
  }
  .charts2{
    ::v-deep .board{
      .footer{
        position: absolute;
        bottom: 0;
      }
    }
  }
}
</style>
