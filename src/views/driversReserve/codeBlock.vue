<template>
  <div class="code">
    <div class="code-img" ref="dom"></div>
    <template v-if="showInfo">
      <div class="title">通行码</div>
      <div class="info">到达南沙卡口时，请亮此二维码给卡口工作人</div>
      <div class="info1">建议截图保存</div>
    </template>
  </div>
</template>

<script>
import QRCode from './qrcode.js'
export default {
  name: 'codePage',
  props: {
    qrCodeText: {
      type: String,
      default: ''
    },
    showInfo: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      qrcode: null
    }
  },
  methods: {
    draw() {
      if (this.qrCodeText == '') {
        return
      }
      this.$nextTick(() => {
        if (this.qrcode == null) {
            this.qrcode = new QRCode(this.$refs['dom'], {
              text: this.qrCodeText,
              width: 200,
              height: 200,
              colorDark: "#2A44A5",
              colorLight: "#fff",
            })
          } else {
            this.qrcode.clear()
            this.qrcode.makeCode(this.qrCodeText)
          }
      })
    }
  },
  watch: {
    qrCodeText(newVal) {
      this.draw()
    }
  },
  mounted() {
    this.draw()
  },
}
</script>

<style lang="scss" scoped>
.code {
  width: 100%;
  height: 100%;
  position: relative;
  .code-img {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 200px;
  }
  .title {
    font-weight: 500;
    color: #000000;
    font-size: 20px;
    font-weight: 600;
    position: absolute;
    bottom: 80px;
    width: 100%;
    text-align: center;
  }
  .info, .info1 {
    color: #9AA0A3;
    font-size: 14px;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 40px;
  }
  .info1 {
    bottom: 22px;
  }
}
</style>