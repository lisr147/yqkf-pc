<template>
  <iframe :src="src" class="HK-PC-Player" ref="iframe" />
</template>
<script>
export default {
  name: "HKPCPlayer",
  props: ["videoInfo", "index"],
  data() {
    return {
      position: null,
    };
  },
  computed: {
    src() {
      let { appKey, appSecret, host } = this.videoInfo.serverInfo;
      let index = this.videoInfo.deviceUid;
      let [ip, port] = host.split(":");
      return `./static/hkPlayer/hkPlayer.html?appkey=${appKey}&ip=${ip}&port=${port}&secret=${appSecret}&index=${index}`;
    },
  },
  mounted() {
    // console.log(this.$refs.iframe)
    // window.iframe = this.$refs.iframe
    // let { x, y } = this.$refs.iframe.getBoundingClientRect();
    // this.x = x;
    // this.y = y;
    this.poisitionChange();
  },
  methods: {
    poisitionChange() {
      let { x, y } = this.$refs.iframe.getBoundingClientRect();
    //   console.log("poisitionChange");
      if (!this.position || this.position.x !== x || this.position.y !== y) {
        //   console.log(this.$refs.iframe.contentWindow)
        if (this.$refs.iframe.contentWindow.positionChange) {
        //   console.log("位置移动", this.$refs.iframe.contentWindow);
          this.position = { x, y };
          this.$refs.iframe.contentWindow.positionChange(x, y);
        }
      }

      setTimeout(() => {
        this.poisitionChange();
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
.HK-PC-Player {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
