<template>
  <div class="track-info">
    <section v-for="(item,index) in dataList" :key="index">
      <div class="item-h">
        <h4 class="title">{{ item.time }}</h4>
        <el-popover
            popper-class="screen-popover"
            placement="bottom"
            width="350"
            trigger="click">
          <div class="spot-popup">
            <table v-for="c in item.spotList" :key="c.name">
              <tr><td>场所名称：</td><td>{{c.name}}</td></tr>
              <tr><td>场所地址：</td><td>{{c.address}}</td></tr>
              <tr><td>活动时间：</td><td>{{c.time}}</td></tr>
              <tr><td>密接人员：</td><td>{{c.people}}</td></tr>
            </table>
          </div>
          <el-button slot="reference" size="mini" type="primary">重点场所</el-button>
        </el-popover>

      </div>
      <div class="item-b">
        <voice-tip v-for="v in item.voiceList" :key="v.id" :data="v"></voice-tip>
      </div>
    </section>
  </div>
</template>

<script>
import VoiceTip from "./VoiceTip";
export default {
  name: "TrackInfo",
  components: {VoiceTip},
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(){
      this.dataList = [{
        time: '2022-04-09',
        voiceList: [
          {id: 11,src: 'http://dn.product.iot-cas.com:8081/vform/file/download/966297101123969024', content: '4月9日早上大约9点驾电动车去合辉早餐档食早餐，然后10点左右去了榄核市场买菜，大概11点回家，当天就没外出了'},
          {id: 12,src: 'http://dn.product.iot-cas.com:8081/vform/file/download/966297101123969024', content: '4月9日中午大约9点驾电动车去合辉早餐档食早餐，当天就没外出了'},
          {id: 13,src: 'http://dn.product.iot-cas.com:8081/vform/file/download/966297101123969024', content: '4月9日下午大约9点驾电动车去合辉早餐档食早餐，然后10点左右去了榄核市场买菜，洗洗睡了'},
        ],
        spotList: [
          {
            name: '文记酒店',
            address: '南沙区榄核镇感觉大街7号',
            time: '2022-04-04 12:11:10 ~ 2022-04-04 14:11:10',
            people: '张一, 李二'
          },
          {
            name: '文记酒店',
            address: '南沙区榄核镇感觉大街7号',
            time: '2022-04-04 12:11:10 ~ 2022-04-04 14:11:10',
            people: '张一, 李二'
          }
        ]
      },{
        time: '2022-04-08',
        voiceList: [
          {src: 'http://dn.product.iot-cas.com:8081/vform/file/download/966297101123969024', content: '4月9日早上大约9点驾电动车去合辉早餐档食早餐，然后10点左右去了榄核市场买菜，大概11点回家，当天就没外出了'},
          {src: 'http://dn.product.iot-cas.com:8081/vform/file/download/966297101123969024', content: '4月9日中午大约9点驾电动车去合辉早餐档食早餐，当天就没外出了'},
        ],
        spotList: [
          {
            name: '文记酒店',
            address: '南沙区榄核镇感觉大街7号',
            time: '2022-04-04 12:11:10 ~ 2022-04-04 14:11:10',
            people: '张一, 李二'
          }
        ]
      }]
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.track-info{

  section{
    margin: 1em 0;
    padding: 0 0 1em;
    color: #fff;
    border-bottom: 1px dotted  #fff;
  }
  .item-h{
    position: relative;
    padding: .5em 0;
    text-align: right;

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
}
</style>

<style lang="scss" type="text/css">
.spot-popup {
  table {
    margin: .5em 0;
    border-bottom: 1px dotted #fff;
    max-height: 300px;
    overflow: auto;

    tr {
      td:first-child {
        width: 76px;
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
