<template>
  <div class="track-info">

    <section v-for="(item,index) in dataList" :key="index">
      <div class="item-h">
        <h4 class="title">{{ item.locusDate }}</h4>
        <el-popover
            v-if="item.zdcs"
            @show="showKeyplace(item, index)"
            popper-class="screen-popover"
            placement="bottom"
            width="270"
            trigger="click">
          <div class="spot-popup" >
            <table v-for="spot in item.zdcs" :key="spot.id">
              <tr><td>场所名称：</td><td>{{spot.csmc}}</td></tr>
              <tr><td>场所地址：</td><td>{{spot.csdz}}</td></tr>
              <tr><td>活动时间：</td><td>{{spot.hdsj}}</td></tr>
              <tr><td>密接人员：</td><td>{{spot.mjry}}</td></tr>
              <tr><td>次密接人员：</td><td>{{spot.cmjry}}</td></tr>
              <tr><td>重点人群：</td><td>{{spot.zdrq}}</td></tr>
            </table>
          </div>
          <el-button v-show="item.zdcs.length>0" slot="reference" size="mini" type="primary">重点场所</el-button>
        </el-popover>

      </div>
      <div class="item-b">
        <div>{{item.locus}}</div>
        <voice-tip v-for="(v, vIndex) in item.locusYyWb" :key="vIndex" :data="v"></voice-tip>
<!--        <div v-if="!item.locusYyWb || item.locusYyWb.length == 0">暂无数据</div>-->
      </div>
    </section>


    <photo-frame :ids="photoIds"/>

  </div>
</template>

<script>
import VoiceTip from "./VoiceTip"
import PhotoFrame from "./PhotoFrame"
import {getMapLayerData} from "@/api/mapData"
export default {
  name: "TrackInfo",
  components: {PhotoFrame, VoiceTip},
  props: ['id'],
  data() {
    return {
      //轨迹列表
      dataList: [],
      //重点场所
      spotMap: {},
      //照片
      photoIds: ''
    }
  },
  mounted() {
  },
  computed:{
    trackInfo(){
      return this.$store.state.dispatch.trackInfo
    }
  },
  watch: {
    trackInfo: {
      handler(obj = {}) {
        this.dataList = obj.locus
        this.photoIds = obj.gjzp
      },
      deep: true,
      immediate: true
    }
  },
  methods: {

    async showKeyplace(item, index){

      if (this.spotMap[index]?.length > 0) {
        return
      }

      const res = await getMapLayerData({
        condition: {
          ldId: this.id, //流调信息id
          gjId: item.id  //单个轨迹记录id
        },
        templateId: 10098
      })

      const arr = res.data.map(item=>{
        const {csmc, csdz, hdsj} = item
        return {
          name: csmc,
          address: csdz,
          time: hdsj,
          people: ''
        }
      })
      this.$set(this.spotMap, index, arr)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.track-info{
  max-height: 500px;
  overflow: auto;

  section{
    margin: 1em 0;
    padding: 0 0 1em;
    color: #fff;
    border-bottom: 1px dotted  #fff;
  }
  .item-h{
    position: relative;
    padding: .5em ;
    text-align: right;
    min-height: 32px;

    .title{
      position: absolute;
      top: 0.5em;
      left: 0;
      color: #fff;
    }
  }
  .item-b{
    padding: 0 0 0 1em;
  }
  .title{
    padding: 0.5em 0;
    color: #fff;
  }
}
</style>

<style lang="scss" type="text/css">
.spot-popup {
  table {
    margin: .5em 0;
    width: 100%;
    border-bottom: 1px dotted #fff;

    tr {
      td:first-child {
        width: 90px;
      }
      td{
        vertical-align: text-top;
      }
    }

    &:last-child {
      border-bottom-color: transparent;
    }
  }
}
</style>
