<template>
  <div class="side-box line-up-list" :style="{height:preview?'300px':'auto'}"  >

    <div class="board">

      <div class="header">
        <h3 class="title">
          实时上报核酸采样点排队情况
        </h3>
      </div>

      <scrolling-box :data="dataList" :delay="5" class="main">

        <template v-slot:listItem="scope" class="item">
          <div class="desc">
            <p class="time">上报时间：{{ scope.time }}</p>
            <p>排队人数：{{ scope.num }}</p>
            <p>预计排队时间：1小时以上</p>
            <p>补充说明：有绿色通道</p>
            <p>来源：热心市民</p>
          </div>
          <div class="photo" @click="showGallery(scope)">
            <p>现在照片</p>
            <img :src="scope.imgs[0]" alt="">
          </div>

          <!--          <b v-if="scope.imgs" class="photo" @click="showGallery(scope)">点击查看图片</b>-->
        </template>

      </scrolling-box>
    </div>

    <!--图片浏览-->
    <viewer :images="imgList" class="gallery" ref="alarmGallery" style="display: none;">
      <img v-for="(item,index) in imgList" :src="item" :data-src="item" :key="index">
    </viewer>

  </div>
</template>
<script>

import {mapState} from 'vuex'
import {initAlarmWatcher} from '@/utils/watcher.js'
import ScrollingBox from "@/components/screen/ScrollingBox"
import {getNewestAlarmList} from '@/api/alarm.js'

export default {
  name: "RealTimeLineUp",
  components: {
    ScrollingBox
  },
  props: {
    preview: {type: Boolean, default: false},
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

    // this.initWatcher()

    setTimeout(() => {
      this.getData()
    }, 300)
  },

  methods: {

    async getData() {

      // let res = await getNewestAlarmList()
      //
      // this.dataList = res.map(item => {
      //   const {content, time, type, createTime} = item
      //   return {
      //     content, time, type, createTime
      //   }
      // })

      this.dataList = [{
        'num': '50-100人',
        'time': '2017-12-16 12:09:01',
        'type': '擅自外出高级',
        'imgs': ['https://yqfkfile.iot-cas.com:1443/vform/file/download/971792120526176256', 'https://yqfkfile.iot-cas.com:1443/vform/file/download/971792120526176256']
      },
        {
          'num': '300-500人',
          'time': '2017-12-16 12:09:01',
          'type': '擅自外出高级',
          'imgs': ['https://yqfkfile.iot-cas.com:1443/vform/file/download/971792120526176256', 'https://yqfkfile.iot-cas.com:1443/vform/file/download/971792120526176256']
        },
        {
          'num': '300-500人',
          'time': '2017-12-16 12:09:01',
          'type': '擅自外出高级',
          'imgs': ['https://yqfkfile.iot-cas.com:1443/vform/file/download/971792120526176256', 'https://yqfkfile.iot-cas.com:1443/vform/file/download/971792120526176256']
        },
        {
          'num': '300-500人',
          'time': '2017-12-16 12:09:01',
          'type': '擅自外出高级',
          'imgs': ['https://yqfkfile.iot-cas.com:1443/vform/file/download/971792120526176256', 'https://yqfkfile.iot-cas.com:1443/vform/file/download/971792120526176256']
        }]

    },

    initWatcher() {

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

    showGallery(item) {
      this.imgList = item.imgs

      const viewer = this.$refs['alarmGallery'].$viewer
      viewer.show()
    },

  }
}
</script>
<style lang="scss">
.line-up-list {
  position: relative;

  &-h {
    position: relative;
  }

  .main {
    position: relative;
    padding: 0 1em;
    height: 400px;
    width: 340px;
    overflow: auto;

    p {
      line-height: 1.5em;
      color: #738294;
    }

    .item {
      position: relative;
      margin: 0 0 .6em;
      padding: 0.5em 1em;
      min-height: 130px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 62, 62, 0.3);
      display: flex;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 0;
        border-right: 2px solid #ff3f3c;
      }

      &:before {
        content: '';
        position: absolute;
        top: 1px;
        left: 1px;
        width: 0;
        height: 0;
        border: 6px solid #ff3f3c;
        border-bottom-color: transparent;
        border-right-color: transparent;
      }

      .desc {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 2;
      }

      .time {
        color: #fff;
      }

      .tag {
        display: inline-block;
        padding: 0 4px;
        background-color: #203663;
        color: #8299c9;
        border-radius: 3px;
        border: 1px solid #798ebb;
        font-size: 12px;
      }

      .photo {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        img {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          margin-top: 5px;
        }
      }
    }

  }
}
</style>
