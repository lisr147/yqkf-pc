<template>
  <el-dialog custom-class="line-up-map" :modal="false" top="5vh" :visible="true" width="30vw"
             @close="$emit('closeLineUpMap')">
    <template slot="title">
      <div class="risk-title">核酸采样点排队地图
        <span v-if="pointName">({{ pointName }})</span>
      </div>
    </template>
    <div class="box">
      <iframe class="iframe" :class="{top:pointName}" ref="frame" :src="url"></iframe>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: "lineUpMap",
  props: ['pointName'],
  data() {
    return {
      url: 'https://cb.gzns.gov.cn/vform/ap.html',
    }
  },

  watch: {},
  mounted() {
    if (this.pointName) {
      this.url = `https://cb.gzns.gov.cn/vform/ap.html#/detail?name=${this.pointName}`
    }
  },
  methods: {}
}
</script>

<style lang="scss" type="text/scss">
.line-up-map {
  top: 9vh !important;

  .risk-title {
    font-size: 22px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;

    span {
      font-size: 16px;
    }
  }

  .box {
    width: 100%;
    height: 80vh;
    overflow-y: auto;

    .iframe {
      width: 100%;
      height: 100%;
      border: 0 none;
      &.top{
        margin-top: -8%;
        height: 105%;
      }
    }
  }
}

</style>
