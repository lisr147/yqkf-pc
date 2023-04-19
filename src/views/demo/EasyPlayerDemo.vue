<template>
  <div class="easyplayer-demo">

    <EasyPlayer :videoUrl="videoUrl" fluent autoplay live stretch ></EasyPlayer>

    <div style="padding:1em;">
      <el-input v-model="inputUrl" placeholder="请输入播放地址" size="mini"></el-input>
      <el-button type="primary" @click="play">播放</el-button>
    </div>

  </div>
</template>

<script>
  import EasyPlayer from '@easydarwin/easyplayer'
  export default {
    name: "EasyPlayerDemo",
    components: {
      EasyPlayer
    },
    data() {
      return {
        videoUrl: '',
        inputUrl: "http://121.8.172.202:41021/hls/440115258113271100060/index.m3u8?token=33b621ec-4b9c-3c0e-a1ff-049b47f7bf82"
      }
    },
    mounted() {
    },
    methods: {
      play() {
        this.videoUrl = this.inputUrl
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
.easyplayer-demo{
  width: 600px;
  height: 400px;
}
</style>
