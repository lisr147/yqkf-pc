<template>
  <div class="side-box party-box">
    <div class="board">
      <div class="header">
        <h3 class="title">
          {{sszj}}网格党组织和党员概况
          <el-popover
              popper-class="screen-popover"
              width="360"
              trigger="hover">
            {{about}}
            <i slot="reference" style="color: #fff;" class="el-icon-question"></i>
          </el-popover>
          <span class="detail-btn" @click="openDetail">单位挂点支援镇街></span>
        </h3>
      </div>
      <div class="party-box-card">
        <el-row :span="24" :gutter="10">
          <el-col :span="12">
            <div class="card bgRed">
              <p class="t1">网格党组织总数</p>
              <p class="t2">{{ dataInfo.orgTotal }}</p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card">
              <p class="t1">党员总数</p>
              <p class="t2">{{ dataInfo.memberTotal }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="party-box-content">
        <div class="aside">
          <h3>网格党组织总数</h3>
          <div class="item" v-for="(item,index) in orgList" :key="index">
            <p class="item-title"><span class="name">{{ item.name }} </span> <span class="tip">{{item.value}}</span></p>
            <el-progress :percentage="item.percentage" color="#00EAE9" :show-text="false" :stroke-width="8"></el-progress>
          </div>
        </div>
        <div class="aside">
          <h3>党员总数</h3>
          <div class="item" v-for="(item,index) in memberList" :key="index">
            <p class="item-title"> <span  class="name">{{ item.name }} </span><span class="tip">{{item.value}}</span></p>
            <el-progress :percentage="item.percentage" color="#00EAE9" :show-text="false" :stroke-width="8"></el-progress>
          </div>
        </div>
        <data-empty-box v-if="orgList.length==0 && memberList.length ==0"/>
      </div>
      <div class="footer">
      <span>
        更新时间：{{updateTime}}
        <br>数据来源：{{ dataInfo.dateSource ||'区组织部'}}
      </span>
      </div>
    </div>
  </div>
</template>
<script>

import { getPartyGeneral } from '@/api/bigCharts'
import moment from "moment";
import DataEmptyBox from "./layer/DataEmptyBox";
import {mapState } from 'vuex'
export default {
  name: "party",
  components:{DataEmptyBox},
  data() {
    return {
      dataInfo:{},
      orgList:[],
      memberList:[],
      updateTime:'',
      about: `按镇街统计全区网格党组织数和党员总数，该数据由区委组织部通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新。`,
      sszj:'', //所属镇街过滤
    };
  },
  watch: {
    town(val){
      this.sszj  = val
      this.getPartyGeneral()
    },
  },
  computed: {
    ...mapState('common', ['town'])
  },
  async mounted() {
    this.getPartyGeneral()
  },
  methods: {
    async getPartyGeneral () {
      let res = await getPartyGeneral()
      this.dataInfo = res
      this.updateTime =res.updateTime?moment(res.updateTime).format("YYYY-MM-DD HH:mm:ss"):moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      this.memberList=res.memberDetail.map((item)=>{
        return {
          percentage: (item.value / res.memberTotal)*100,
          name:item.key,
          value:item.value
        }
      })
      this.orgList=res.orgDetail.map((item)=>{
        return {
          percentage:item.percentage = (item.value / res.orgTotal)*100,
          name:item.key,
          value:item.value
        }

      })
    },
    openDetail(){
      this.$emit('showUnitSupportStreet')
    },
  },
};
</script>
<style lang="scss" scoped>
.party-box{
  .detail-btn{
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #3987FF;
    position: absolute;
    right: 43px;
    top: 27px;
    font-size: 15px;
    cursor: pointer;
  }
  &-card{
    margin: 10px 0;
    .card{
      color: #fff;
      //background-color: #1d306d;
      background: linear-gradient(90deg, rgba(244, 151, 77, 0.2) 0%, rgba(241, 153, 71, 0.03) 100%);
      width: 160px;
      height: 67px;
      text-align: center;
      justify-content: center;
      display: flex;
      align-items: center;
      flex-direction: column;
      .t1{
        font-size: 12px;
        color: #fff;
        margin: 0 auto;
        text-align: center;
      }
      .t2{
        //margin-top: 4px;
        font-size: 23px;
        color: #ffff00;
        font-weight: 600;
      }
    }
    .bgRed{
      background: linear-gradient(90deg, rgba(220, 30, 0, 0.2) 0%, rgba(220, 30, 0, 0.05) 100%);
      .t2{
        color: #FF0000;
      }
    }
  }
  &-content{
    max-height: 350px;
    overflow-y: auto;
    display: flex;
    justify-content: space-between;
    padding-right: 10px;
    margin-bottom: 15px;
    h3{
      font-size: 14px;
      font-family: SourceHanSansCN-Bold, SourceHanSansCN;
      font-weight: bold;
      color: #FFFFFF;
      margin:10px 10px 0;
    }
    .aside{
      flex: 1;
      .item{
        color: #ffffff;
        margin: 20px 10px;
        font-size: 14px;
        &-title{
          color: #ffffff;
          margin: 5px 0;
          position: relative;
          .name{
            width: 84%;
            display: inline-block;
          }
          .tip{
            position: absolute;
            right: 0;
            font-family: Bebas;
            color: #FEFF00;
            line-height: 18px;
          }
        }
      }
    }
  }
  ::v-deep .el-progress-bar__outer {
    background: #21377D;
  }
}
</style>
