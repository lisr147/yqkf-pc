<template>
  <div class="voice-tip">
    <el-button class="trigger" :type="btnType" icon="el-icon-microphone" circle @click="play"></el-button>
    <div class="voice-tip-content">
      <span>{{ data.yyText || '未知' }}</span>
    </div>
    <!--<p style="color: #fff;">{{data.mediaInfoId}}: {{isPlaying}}</p>-->
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
      isPlaying: false
    }
  },
  computed:{
    btnType() {
      return this.isPlaying ? 'success' : 'primary'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      const t = this
      const {mediaInfoId} = this.data

      VoiceController.addEventListener('play', (targetId) => {
        if (targetId == mediaInfoId) {
          t.isPlaying = true
        }
      })
      VoiceController.addEventListener('stop', (targetId) => {
        if (targetId == mediaInfoId) {
          t.isPlaying = false
        }
      })
      VoiceController.addEventListener('end', (targetId) => {
        if (targetId == mediaInfoId) {
          t.isPlaying = false
        }
      })
    },
    play() {
      VoiceController.play(this.data.mediaInfoId)
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
