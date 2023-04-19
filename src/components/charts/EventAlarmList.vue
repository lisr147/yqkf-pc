<template>
  <div class="side-box event-alarm-list">
    <div class="event-alarm-list-h">
      <h3>实时告警</h3>
    </div>
    <div class="event-alarm-list-b">
      <ul>
        <li v-for="(item, index) in dataList" :key="index" >
          <p class="name">{{item.title}}</p>
          <p class="time">{{item.time}}</p>
          <p ><span class="tag">{{item.type}}</span></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "EventAlarmList",
    components: {},
    data() {
      return {
        dataList: [{
          'title': '丽枫酒店有人擅自外出',
          'time': '2017-12-16 12:09:01',
          'type': '防疫酒店告警'
        }, {
          'title': '丽枫酒店有人擅自外出',
          'time': '2017-12-16 12:09:01',
          'type': '防疫酒店告警'
        }, {
          'title': '丽枫酒店有人擅自外出',
          'time': '2017-12-16 12:09:01',
          'type': '防疫酒店告警'
        },{
          'title': '丽枫酒店有人擅自外出',
          'time': '2017-12-16 12:09:01',
          'type': '防疫酒店告警'
        }]
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .event-alarm-list {
    position: relative;
    height: 300px;
    overflow: hidden;

    &-h{
      h3{
        padding:.5em;
        color: #95dafa;
        font-size: 16px;
        font-weight: normal;
      }
    }

    &-b{
      li{
        position: relative;
        margin: 0.4em 0;
        padding: 0.6em 1.2em;
        background-color: rgba(10,33,83,0.6);

        &:after{
          content:'';
          position: absolute;
          top:0;
          right:0;
          height: 90%;
          width: 0;
          border-right: 2px solid #ff3f3c;
        }
        &:before{
          content:'';
          position: absolute;
          top:1px;
          left:1px;
          width:0;
          height:0;
          border: 6px solid #ff3f3c;
          border-bottom-color: transparent;
          border-right-color: transparent;
        }
      }
      .name{
        color: #fff;
      }
      .time{
        color: #8299c9;
        font-size: 12px;
      }
      .tag{
        display: inline-block;
        padding: 0 4px;
        background-color: #203663;
        color: #8299c9;
        border-radius: 3px;
        border:1px solid #798ebb;
        font-size: 12px;
      }

    }

  }
</style>
