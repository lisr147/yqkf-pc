<template>
  <div class="vaccination-info">
    <div class="base-props">
      <p>姓名：{{props.name}}</p>
      <p>身份证：{{props.id}}</p>
    </div>

    <template v-if="voiceList.length>0">
      <h4 class="title">语音</h4>
      <voice-tip v-for="(v,index) in voiceList" :data="v"  :key="index"></voice-tip>
    </template>

    <div class="vaccination-info-list">
      <table  v-for="(item,index) in dataList" :key="index">
        <tr><td>疫苗名称：</td><td>{{item.ymmc}}</td></tr>
        <tr><td>针次：</td><td>{{item.ymzc}}</td></tr>
        <tr><td>批号：</td><td>{{item.ymph}}</td></tr>
        <tr><td>厂家名称：</td><td>{{item.cjmc}}</td></tr>
        <tr><td>接种单位：</td><td>{{item.jzdw}}</td></tr>
        <tr><td>接种时间：</td><td>{{item.jzsj}}</td></tr>
      </table>
      <data-empty-box v-if="dataList.length==0" title="暂无疫苗接种数据"/>
    </div>

    <photo-frame :ids="photoIds"/>

  </div>
</template>

<script>
import DataEmptyBox from "@/views/big/layer/DataEmptyBox";
import PhotoFrame from "./PhotoFrame";
export default {
  name: "VaccinationInfo",
  components: {PhotoFrame, DataEmptyBox},
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
    vaccinationInfo(){
      return this.$store.state.dispatch.vaccinationInfo
    }
  },
  watch: {
    vaccinationInfo:{
      handler(obj = {}) {

        const {data, sfzhm, xm, ymzp, ymjzyywb} = obj
        this.props = {
          id: sfzhm || '未知',
          name: xm || '未知'
        }
        if (data) {
          this.dataList = data
        }
        this.photoIds = ymzp
        this.voiceList = ymjzyywb || []
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
.vaccination-info {
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
  }
}
</style>
