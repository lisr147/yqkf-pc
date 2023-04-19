<template>
  <div class="detect-info">
    <div class="base-props">
      <p>姓名：{{props.name}}</p>
      <p>身份证：{{props.id}}</p>
      <p>所属哨点类别：{{sentinelInfo}}</p>
    </div>

    <template v-if="voiceList.length>0">
      <h4 class="title">语音</h4>
      <voice-tip v-for="(v,index) in voiceList" :data="v"  :key="index"></voice-tip>
    </template>

    <div class="detect-info-list">
      <table  v-for="(item,index) in dataList" :key="index">
        <tr>
          <td>核酸检测结果：</td>
          <td>
            {{item.jcjg}}
            <b v-show="item.jcjg=='阴性'" class="el-icon-success"/>
            <b v-show="item.jcjg=='阳性'" class="el-icon-warning"/>
          </td>
        </tr>
        <tr><td>核酸检测机构：</td><td>{{item.jcdw}}</td></tr>
        <tr><td>核酸检测时间：</td><td>{{item.jcsj}}</td></tr>
        <tr><td>核酸采样时间：</td><td>{{item.cyrq}}</td></tr>
      </table>
      <data-empty-box v-if="dataList.length == 0" title="暂无核酸检测数据"/>
    </div>

    <photo-frame :ids="photoIds"/>
  </div>
</template>

<script>
import PhotoFrame from "./PhotoFrame";
import VoiceTip from "@/components/Dispatch/VoiceTip";
import DataEmptyBox from "../../big/layer/DataEmptyBox";

export default {
  name: "DetectInfo",
  components: {
    DataEmptyBox,
    VoiceTip,
    PhotoFrame
  },
  data() {
    return {
      props: {
        name: '',
        id: ''
      },
      dataList: [],
      voiceList: [],
      photoIds: ''
    }
  },
  computed:{
    detectionInfo(){
      return this.$store.state.dispatch.detectionInfo
    },
    sentinelInfo(){
      let info = '';
      const sdxx=this.detectionInfo.sdxx;
      if(typeof sdxx === 'string'){
        info=sdxx;
      }else if(Array.isArray(sdxx)){
        sdxx.forEach((item,index)=>{
          info+=`${index>0?'；':''}${item.ztlx}（核酸规则：${item.hsgz?item.hsgz:'暂无设置'}）`
        })
      }
      return info;
    }
  },
  watch:{
    detectionInfo:{
      handler(obj){
        const {xm, sfzhm, data, hszp, hsjcqkyywb} = obj

        this.props = {
          name: xm || '未知',
          id: sfzhm || '未知',
        }
        if (data) {
          this.dataList = data
        }
        this.photoIds = hszp
        this.voiceList = hsjcqkyywb || []
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {

    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.detect-info {
  max-height: 500px;
  overflow: auto;
  color: #fff;

  .base-props {
    padding: 0 0 .5em;
    p{
      line-height: 1.5em;
      color: #fff;
    }
  }
  &-list {

    table {
      margin: 0.5em 0;
      width: 95%;
      border-bottom: 1px dotted #fff;

      tr {
        td:first-child{
          width: 100px;
        }
      }
      td{
        padding: 0.3em;
        vertical-align: text-top;
      }
    }
    .el-icon-success{
      color: #36c02f;
    }
    .el-icon-warning{
      color: rgba(224, 102, 81, 1);
    }
  }

  .title{
    color: #fff;
  }
}
</style>
