<template>
  <div class="player-wrap">
    <iframe :src="videoUrl" ref="frame"></iframe>
  </div>

</template>

<script>
import {BASE_URL} from '@/config/setting'
export default {
  name: 'H5player',
  props: {
    'videoInfo': {type: Object}, //视频信息
    'index': {type: Number,default: 0}, //视频索引,海康播放器多屏存在时使用
  },
  data() {
    return {
      videoUrl: '',
    }
  },
  mounted() {
    console.log(37, 'videoInfo', this.videoInfo)
    this.initFrame()
  },
  beforeDestroy() {
    console.log('页面销毁前')
  },
  methods: {
    initFrame() {
      this.videoUrl = `${location.origin}/player/h5player/h5player.html?BASE_URL=${BASE_URL}&url=${this.videoInfo.url}&index=${this.index}&fullbtn=0`
    },

    handleDestroy(){
      this.player = null
    },
  }
}
</script>

<style lang="scss" scoped>
.player-wrap {
  position: relative;
  width: 100% !important;
  height: 100% !important;
  &:hover{
    .video-control {
      //display: block;
    }
  }
  .player {
    position: relative;
    z-index: 1;
    width: 100% !important;
    height: 100% !important;
  }
  .img{
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .video-control {
    display: none;
    position: absolute;
    z-index: 3;
    left: 1px;
    bottom: 2px;
    right: 2px;
    height: 30px;
    background-color: rgba(43,51,63,.7);
    .control-right {
      display: flex;
      justify-content: flex-end;
      height: 100%;
    }
    .full {
      cursor: pointer;
      font-family: VideoJS;
      font-weight: 400;
      font-style: normal;
      text-align: center;
      line-height: 30px;
    }
    .full {
      width: 40px;
      height: 100%;
      color: #fff;
      &::before{
        content: "\F108";
        font-size: 18px;
      }
    }
  }
  .loading,.error {
    position: absolute;
    z-index: 4;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 30px;
    text-align: center;
    color: #fff;
  }
  .loading {
    height: 30px;
  }
  .error {
    min-height: 30px;
  }
}

</style>
