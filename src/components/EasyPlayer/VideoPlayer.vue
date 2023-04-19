<template>
  <div class="video-player">
    <!-- 海康h5播放器 -->
    <H5player
      ref="H5player"
      v-if="playerType === 'HkH5'"
      :videoInfo="videoInfo"
      :index="index"
    ></H5player>

    <template v-else-if="playerType === 'normal'">
      <EasyPlayer
        ref="EasyPlayer"
        v-if="isReady"
        :video-title="title"
        :video-url="videoUrl"
        :aspect="aspect"
        fluent
        autoplay
        live
        stretch
        :reconnection="true"
        :has-audio="false"
      ></EasyPlayer>

    </template>

    <HkPcPlayer v-else-if="playerType === 'hkPc'" :videoInfo="videoInfo" :index="index" />

    <!--<data-empty-box v-if="!videoUrl" style="position: absolute; top:50%;left:50%;transform: translate(-50%,-50%);" title="获取视频地址失败"></data-empty-box>-->
  </div>
</template>

<script>
// easyplayer视频播放组件
// 当前版本为3.3.10 以下文件必须为该版本文件
// index.html中需要引用 EasyPlayer-lib.min.js 文件，文件可在任意位置
// crossdomain.xml 和 libDecoder.wasm 文件必须放在根目录

import EasyPlayer from "@easydarwin/easyplayer";
import HkPcPlayer from './HkPcPlayer.vue'

import H5player from "@/components/H5player/H5player";
// import H5player from '@/components/H5player/H5playerIframe';
// import DataEmptyBox from "@/views/big/layer/DataEmptyBox"
export default {
  name: "VideoPlayer",
  components: {
    // DataEmptyBox,
    EasyPlayer,
    H5player,
    HkPcPlayer
  },
  props: {
    videoUrl: { type: String }, //视频地址
    isLive: { type: Boolean, default: true }, //是否直播
    title: { type: String, default: "" }, //视频右上角显示的标题
    videoInfo: { type: Object }, //视频信息
    index: { type: String, default: "0" }, //视频索引,海康播放器多屏存在时使用
  },
  data() {
    return {
      //视频显示区域的宽高比，貌似无效果
      aspect: "16:9",
      //流畅模式
      fluent: true,
      //自动播放
      autoplay: true,
      isReady: false,
      easyPlayerRetryTimer:null,
      // showH5player: false,
      playerType: "normal", //normal:普通播放器,hkH5:网页版海康,hkPc:PC版海康，需要安装插件
    };
  },
  mounted() {
    // console.log('videoInfo', this.videoInfo)
    if (
      this.videoInfo.hasOwnProperty("videoProvider") &&
      this.videoInfo.videoProvider.includes('Hikvision') &&
      this.isLive
    ) {
      // this.showH5player = true
      if (navigator.userAgent.includes("Windows")) {
        this.playerType = "hkPc";
      } else {
        this.playerType = "hkH5";
      }
    } else {
      this.loadJs();
    }

    console.log('播放器类型',this.playerType,this.videoInfo.videoProvider)
  },
  destroyed(){
    if(this.easyPlayerRetryTimer){
        clearInterval(this.easyPlayerRetryTimer)
    }
  },
  methods: {
    showPlayerLog(event) {
      console.log(event);
    },
    loadJs() {
      if (document.getElementById("easyplayer-lib")) {
        this.isReady = true;
      } else {
        let tag = document.createElement("script");
        tag.setAttribute("id", "easyplayer-lib");
        tag.setAttribute("type", "text/javascript");
        tag.setAttribute("src", "./assets/easyplayer5/EasyPlayer-lib.min.js");
        document.body.appendChild(tag);
        tag.onload = () => {
          this.isReady = true;
        };
      }

      this.easyPlayerRetryTimer = setInterval(() => {
            // console.log('this.$refs.EasyPlayer',this.$refs.EasyPlayer,this.$refs.EasyPlayer.easyPlayer.playing)
            if(this.$refs.EasyPlayer.easyPlayer.playing){
                clearInterval(this.easyPlayerRetryTimer)
                return
            }
            this.$refs.EasyPlayer.restartPlayer()
          }, 15000);
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.video-player {
  position: absolute;
  width: 100%;
  height: 100%;
  top: -30px;
}
</style>
