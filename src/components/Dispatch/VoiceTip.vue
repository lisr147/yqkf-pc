<template>
  <div class="voice-tip">
    <el-button class="trigger" type="primary" icon="el-icon-microphone" circle @click="play"></el-button>
    <div class="voice-tip-content">
      <span>{{ data.content || '我跟你讲不要相信任何人的鬼话'}}</span>
    </div>
  </div>
</template>

<script>
import VoiceController  from "@/class/VoiceController"

export default {
  name: "VoiceTip",
  components: {},
  props: {
    data: {type: Object}
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    play() {
      VoiceController.play(this.data)
    }
  }
}
</script>

<style lang="scss" type="text/scss">
.voice-tip{
  position: relative;
  padding: 0.5em ;

  .trigger{
    position: absolute;
    top: 5px;
    left: 0;
  }

  &-content{
    display: inline-block;
    max-width: 500px;
    position: relative;
    margin-left: 2.6em;
    border-radius: 4px;
    padding: 6px;
    min-height: 20px;
    line-height: 1.5em;
    background-color: #b2e77f;
    color: #242c1a;

    &:before{
      content:'';
      position: absolute;
      top: .7em;
      left: -12px;
      width:0;
      height: 0;
      border: 6px solid transparent;
      border-right-color: #b2e77f;
    }
  }
}
</style>
