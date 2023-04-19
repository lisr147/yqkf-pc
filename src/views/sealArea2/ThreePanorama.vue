<template>
  <el-dialog custom-class="three-panorama"  top="8vh"  :visible="true" width="80vw" @close="$emit('close')">
    <template slot="title">
      <div class="risk-title">{{activeName}}</div>
    </template>
    <div v-if="showTab">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="720度全景" name="720度全景"></el-tab-pane>
        <el-tab-pane label="实景三维" name="实景三维"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="box">
      <iframe class="iframe"  ref="frame" :src="iframeUrl"></iframe>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: "three-panorama",
  props: ['url'],
  data() {
    return {
      showTab: true,
      iframeUrl:'https://www.720yun.com/t/80vk6yrypfh?scene_id=102421634',
      activeName:'720度全景'
    }
  },
  mounted() {
    if(this.url) {
      this.iframeUrl = this.url
      this.showTab = false
    }
  },
  methods:{
    handleClick(e){
      this.activeName = e.name
      if (e.name === '实景三维') {
        this.iframeUrl = 'https://172.29.5.52:8443/3D/#/'
        // this.iframeUrl = 'http://172.29.5.52:8080/3D/#/'
      } else {
        this.iframeUrl = 'https://www.720yun.com/t/80vk6yrypfh?scene_id=102421634'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .three-panorama{
    top:8vh!important;
  }
}
.three-panorama {
  .risk-title {
    font-size: 22px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;
  }
  .box {
    width: 100%;
    height: 75vh;
    overflow-y: auto;
    .iframe {
      width: 100%;
      height: 100%;
      border: 0 none;
    }
  }
}
</style>

