<template>
  <div class="camera">
    <iframe :src="videoUrl" ref="frame"></iframe>
    <div class="refresh-btn" @click="refreshFrame">刷新</div>
  </div>
</template>

<script>
  // 摄像头共3种：
  // 灾害监测 三防摄像头
  // 城市治理 普通摄像头
  // 视频分析摄像头 deviceUid 44011542001320100049
  export default {
    name: "Camera",
    components: {},
    props: {
      attributes: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        videoUrl:''
      }
    },
    watch: {
      attributes: {
        handler: function () {
          this.initFrame()
        },
        immediate: true
      }
    },
    mounted() {
      // this.initFrame()
    },
    methods: {
      initFrame() {
        const {deviceUid} = this.attributes
        this.videoUrl = `${location.origin}/cyjk/player/qufu/player.html?id=${deviceUid}&fullbtn=0`
      },
      refreshFrame() {
        this.$refs['frame'].src = this.videoUrl + '&time=' + parseInt(Math.random() * 100000)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
.camera{
  position: relative;
  height: 100%;
  min-height: 430px;

  iframe{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height: 100%;
    border:0 none;
  }
  .refresh-btn{
    position: absolute;
    top: 50px;
    right: 20px;
    cursor: pointer;
    color: #fff;
  }
}
</style>
