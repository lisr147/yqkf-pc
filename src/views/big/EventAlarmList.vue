<template>
  <div class="side-box event-alarm-list">

    <div class="board">

      <div class="header">
        <h3 class="title">
          实时告警
        </h3>
        <!--<el-button style="position: absolute; top:0; right:5em;" @click="updateList">刷新</el-button>-->
      </div>

      <scrolling-box :data="dataList" :delay="5" class="main">

        <template v-slot:listItem="scope" class="item">
          <p class="name">{{scope.content}}</p>
          <p class="time">{{scope.time}}</p>
          <p><span class="tag">{{scope.type}}</span></p>
          <b v-if="scope.imgs" class="photo" @click="showGallery(scope)">点击查看图片</b>
        </template>

      </scrolling-box>
    </div>

    <!--图片浏览-->
    <viewer :images="imgList"  class="gallery" ref="alarmGallery" style="display: none;">
      <img v-for="(item,index) in imgList" :src="item.thumbnail" :data-src="item.url" :key="index">
    </viewer>


  </div>
</template>
<script>

  import {mapState} from 'vuex'
  import {initAlarmWatcher} from '@/utils/watcher.js'
  import ScrollingBox from "@/components/screen/ScrollingBox"
  import {getNewestAlarmList} from  '@/api/alarm.js'

  export default {
    name: "EventAlarmList",
    components: {
      ScrollingBox
    },
    props: {

    },
    data() {
      return {
        dataList: [],

        scrollOption: {
          step: 0.5,
          hoverStop: true
        },

        imgList: [],
      }
    },
    watch: {},
    computed: {
      ...mapState('common', ['town']),

    },
    async mounted() {

      this.initWatcher()

      setTimeout(() => {
        this.getData()
      }, 3000)
    },

    methods: {

      async getData(){

        let res = await getNewestAlarmList()

        this.dataList = res.map(item=>{
          const {content, time, type, createTime } = item
          return {
            content, time, type, createTime
          }
        })

        // this.dataList = [{
        //   'title': '黄阁镇有1条购药记录逾期未核查。',
        //   'time': '2017-12-16 12:09:01',
        //   'type': '擅自外出高级',
        //   'imgs': {
        //     capturePicture: 'https://gljd.gzonline.gov.cn:12342/hotel-city-web/api/device/getImgStream?name=48,4bdd6caaa0dccd',
        //     panoramaPicture: 'https://gljd.gzonline.gov.cn:12342/hotel-city-web/api/device/getImgStream?name=48,4bdd6caaa0dccd',
        //   }
        // }]

      },

      initWatcher(){

        const ws = initAlarmWatcher()
        ws.onmessage = (msg) => {

          if (msg.data.includes('连接成功')) {
            return
          }
          try {

            //更新图层
            const {data, type} = JSON.parse(msg.data)
            if (type == "alarmList") {
              this.updateList({data})
            }

          } catch (e) {
            console.error(e)
          }
        }
      },

      updateList({data}) {
        const arr = data.map(item => {
          const {content, time, type, createTime} = item
          return {
            content, time, type, createTime
          }
        })
        this.dataList = arr
      },

      showGallery(item){

        const {capturePicture, panoramaPicture} = item.imgs
        this.imgList = [
          {url: capturePicture, thumbnail: capturePicture},
          {url: panoramaPicture, thumbnail: panoramaPicture}
        ]

        const viewer = this.$refs['alarmGallery'].$viewer
        viewer.show()
      },

    }
  }
</script>
<style lang="scss">
  .event-alarm-list {
    position: relative;
    &-h {
      position: relative;
    }

    .main{
      position: relative;
      padding: 0 1em;
      height: 400px;
      width: 330px;
      overflow: hidden;

      p{
        line-height: 1.5em;
      }

      .item{
        position: relative;
        margin: 0 0 .6em;
        padding: 0.6em 1.2em;
        min-height: 80px;
        box-sizing: border-box;
        background-color: rgba(10,33,83,0.6);

        &:after{
          content:'';
          position: absolute;
          top:0;
          right:0;
          height: 100%;
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
        .photo{
          position: absolute;
          bottom: 0.6em;
          right: 1.6em;
          color: #175dbb;
          cursor: pointer;
        }
      }

    }
  }
</style>
