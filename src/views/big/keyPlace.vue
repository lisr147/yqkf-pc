<template>
  <div class="side-box key-place">
    <div class="board">
      <div class="header">
        <h3 class="title">今日公共场所告警信息</h3>
      </div>
      <scrolling-box :data="keyPlaceData" ref="scrollbox" :duration="0.5" empty-msg="今日目前暂无红黄码人员告警信息">
        <template v-slot:listItem="scope">
          <!--条目内容-->
          <div class="label">
            <span class="time">{{scope.item.logTime}}</span>
            <span class="name">{{scope.item.address}}（{{scope.item.fullName}}）</span>
            <span class="skm" :class="{red:scope.item.skmStatus==='2',yellow:scope.item.skmStatus==='3'}">{{scope.item.skmStatus==='3'?'黄码':(scope.item.skmStatus==='2'?'红码':'绿码')}}</span>
          </div>
        </template>
      </scrolling-box>
      <div class="footer">
      <span>
        <!-- 更新时间：{{
          updateTime && updateTime !== "null" ? updateTime : "2022-01-20 09:39:18"
        }}
        <br> -->
        数据来源：{{ source }}
      </span>
      </div>
    </div>
  </div>
</template>
<script>
import ScrollingBox from "@/components/screen/ScrollingBox"
import { getAlarmList } from '@/api/bigCharts'
import {mapState } from 'vuex'
export default {
  name: "keyPlace",
  components:{ScrollingBox},
  data() {
    return {
      //重点场所警告
      keyPlaceData:[],
      updateTime:"",
      source:"",
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
    this.getAlarmList()
  },
  methods: {
    async getAlarmList () {
      let res = await getAlarmList()
      this.keyPlaceData = res.data
      this.updateTime = res.time
      this.source = res.source
    },
  },
};
</script>
<style lang="scss" scoped>
.key-place{
  .label{
    display: inline-block;
    position:relative;
    padding:0 5px 0 15px;
    margin-bottom:15px;
    line-height:1.5;
    box-sizing: border-box;
    &:before{
      position: absolute;
      width: 6px;
      height: 6px;
      left: 0;
      top: 8px;
      content: "";
      background: #fff;
      border-radius: 50%;
    }
    .time{
      margin-right: 10px;
    }
    .skm{
      color: #46e20e;
    }
    .yellow{
      color: #FFFF00;
    }
    .red{
      color: #F42A34;
    }
  }
}
</style>
