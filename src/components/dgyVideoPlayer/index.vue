<template>
  <div class="player" ref="dgyPlayer"       @click.self="bodyClick"
      @mousemove="mouseMove">
    <ali-player
      :source="playUrl"
      ref="player"
      :isLive="true"
      :autoplay="true"
      @ready="ready"
    ></ali-player>
    <div v-if="!videoUrl" class="no-video">
      无播放内容
    </div>
    <div
      v-if="stopScreenShot"
      class="preview no-video"
      :style="`background-image:url(${stopScreenShot});`"
    />
    <div class="no-video">
      <slot name="main" />
    </div>
    <div
      class="ui-layer"
      :ui-hidden="UIHideDT === 0"
      v-if="!hideControls"
    >
      <div class="title">
        {{ title }}
      </div>

      <!--<i class="el-icon-close video-close" @click="videoClose" v-if="hasVideoPlay"/>-->

      <!-- 播放进度条 -->
      <div
        class="progress-bar"
        v-if="!isLive && timeLineList && timeLineList.length"
        @mouseup="progressSeek"
        ref="progressBar"
      >
        <div class="time-line-list">
          <div
            class="time-line-item"
            v-for="(item, index) in timeLineList"
            :key="`tl_${index}`"
            :style="`left:${item[0]}%;width:${item[1] - item[0]}%;`"
          />
        </div>
        <div class="progress-dot" :style="`left:${progress}%;`" />
        <div class="progress" :style="`width:${progress}%;`" />
      </div>
      <!-- 控制栏 -->
      <div class="control-bar" v-if="controls">
        <div
          :class="[
            { 'control-bar-left-min': isMin && !isFullScreen },
            'control-bar-left',
          ]"
        >
          <template v-if="isLive">
            <img
              src="./icon/player_stop.svg"
              class="main-btn control-btn"
              alt=""
              title="停止"
              v-if="playing"
              @click="stop"
            />
            <img
              src="./icon/player_play.svg"
              class="main-btn control-btn"
              alt=""
              title="播放"
              v-else
              @click="play"
            />
          </template>
          <slot name="control-bar-left" />
        </div>
        <div
          :class="[
            { 'control-bar-right-min': isMin && !isFullScreen },
            'control-bar-right',
          ]"
          :style="{ width: isMin && !isFullScreen ? '50%' : '' }"
        >
          <!-- 插槽 -->
          <slot class="control-btn" />
          <!-- 云台控制入口按钮 -->
          <img
            src="./icon/player_control.svg"
            @click="onShowControl"
            class="control-btn"
            alt=""
            title="云台控制"
            v-if="isShowControl"
          />
          <!-- 录像 -->
          <div v-if="false ">
            <!-- 暂时屏蔽回放录像 -->
            <img
              v-if="isRecording"
              src="@/components/dgyVideoPlayer/icon/player_recording.svg"
              @click="setRecord"
              class="control-btn"
              alt=""
              title="停止录像"
            />
            <img
              v-else-if="playing && playUrl"
              src="@/components/dgyVideoPlayer/icon/player_record.svg"
              @click="setRecord"
              class="control-btn"
              alt=""
              title="录像"
            />
            <img
              v-else
              src="@/components/dgyVideoPlayer/icon/player_record_disabled.svg"
              class="control-btn"
              alt=""
              title="无法录像"
            />
          </div>
          <!-- 截屏 -->
          <!-- <img
            v-if="playing && playUrl"
            src="./icon/player_snapshot.svg"
            @click="setSnapshot"
            class="control-btn"
            alt=""
            title="截图"
          />
          <img
            v-else
            src="./icon/player_snapshot_disabled.svg"
            @click="setSnapshot"
            class="control-btn"
            alt=""
            title="视频暂停，无法截图"
          /> -->
          <!-- 音量 -->
          <div v-if="!hideVolume" style="position: relative;">
            <div class="volume-setting" v-if="showVolumeSetting">
              <el-slider
                v-model="volume"
                vertical
                :height="isMin ? '60px' : '100px'"
              />
            </div>
            <img
              src="./icon/player_volume.svg"
              @click="setVolume"
              class="control-btn"
              alt=""
              title="音量"
              v-if="volume > 0"
            />
            <img
              src="./icon/player_muted.svg"
              @click="setVolume"
              class="control-btn"
              alt=""
              title="音量"
              v-else
            />
          </div>
          <!-- 全屏 -->
          <img
            src="./icon/player_fullscreen.svg"
            @click="enterFullScreen"
            class="control-btn"
            alt=""
            title="全屏"
            v-if="!isFullScreen"
          />
          <img
            src="./icon/player_exitfullscreen.svg"
            @click="exitFullscreen"
            class="control-btn"
            alt=""
            title="退出全屏"
            v-else
          />
        </div>
      </div>
    </div>
    <!-- 云台控制 -->
    <!-- <slot name="camera-control" /> -->
    <!-- 录像计时显示 -->
    <!-- <slot name="record-box" class="record-box" /> -->
  </div>
</template>
<script>
import VueAliplayer from './VueAliplayer.vue'

export default {
  name: 'videoPlayer',
  props: [
    'videoUrl',
    'id',
    'obj',
    'hideControls',
    'title',
    'isLive',
    'playTime',
    'timeLineList',
    'hideVolume', // 是否隐藏音量键
    'showRecord', // 是否显示录像键
    'showControl', // 是否显示云台控制
    'progress',
    'isMin',
    'logicPlaying',
    'isRecording' // 是否录像中
  ],
  components: {
    'ali-player': VueAliplayer
  },
  // inject: ['videoPlay'],
  data () {
    return {
      playUrl: '',
      /**
       * 测试地址
       * http://img.ksbbs.com/asset/Mon_1704/15868902d399b87.flv
          http://1011.hlsplay.aodianyun.com/demo/game.flv
          http://ivi.bupt.edu.cn/hls/cctv2hd.m3u8
          rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov
           rtmp://58.200.131.2:1935/livetv/hunantv
       */
      player: null,
      playing: false,
      isFullScreen: false,
      showVolumeSetting: false, // 是否显示调节音量
      volume: 0, // 音量
      UIHideDT: 5,
      UIHideTimer: null,
      stopScreenShot: null // 暂停的时候截图
    }
  },
  computed: {
    // hasVideoPlay () {
    //   return !!this.videoPlay
    // },
    controls () {
      if (this.hideControls) {
        return false
      }
      return true
    },
    canRecord () {
      if (this.isLive) {
        return this.playing
      } else {
        return this.logicPlaying
      }
    },
    isShowControl () {
      return this.isFullScreen && this.isLive && this.showControl
    }
  },
  watch: {
    videoUrl (val, oldVal) {
      this.getPlayUrl()
    },
    volume (val) {
      if (!this.player) {
        return
      }
      this.player.setVolume(val / 100)
    },
    isFullScreen (val) {
      this.$emit('isFullscreen', val)
    }
  },
  async mounted () {
    let _this = this
    this.UIHideTimer = setInterval(() => {
      _this.UIHideDT = Math.max(0, _this.UIHideDT - 1)
    }, 1000)
    this.getPlayUrl()
    // 全屏事件监听
    window.addEventListener('webkitfullscreenchange', this.fullScreenEvent)
    window.addEventListener('fullscreenchange', this.fullScreenEvent)
    window.addEventListener('mozFullScreenchange', this.fullScreenEvent)
  },
  methods: {
    fullScreenEvent (evt) {
      let fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement
      this.isFullScreen = !!fullscreenElement
    },

    enterFullScreen () {
      let de = this.$refs.dgyPlayer
      if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen()
      } else if (de.requestFullscreen) {
        de.requestFullscreen()
      } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen()
      }
    },
    exitFullscreen () {
      document.exitFullscreen()
    },
    play () {
      this.playing = true
      this.stopScreenShot = null
      if (this.isLive) {
        this.getPlayUrl()
      }
    },
    stop () {
      if (this.isRecording) {
        window.parent.frameEvent({
          type: 'message',
          msg: '录像过程中不能暂停播放视频，请先停止录像',
          showType: 'warning'
        })
        return
      }
      this.playing = false
      this.stopScreenShot = this.getSnapShot()
      if (this.isLive) {
        this.playUrl = ''
        // c.log('stop')
        this.$emit('playStatus', false)
      }
    },
    ready (player) {
      this.player = player
      this.player.setVolume(this.volume / 100)
      this.player.play()
      window.player = this.player
      let _this = this
      this.player.on('playing', () => {
        if (!this.playUrl) {
          return
        }
        _this.playing = true
        _this.$emit('playStatus', true)
      })
      this.player.on('pause', () => {
        _this.playing = false
        // c.log('pause')
        _this.$emit('playStatus', false)
      })
      this.player.on('ended', () => {
        _this.playing = false
        // c.log('ended')
        _this.$emit('playStatus', false)
      })

      this.player.on('liveStreamStop', () => {
        _this.playing = false
        // c.log('liveStreamStop')
        _this.$emit('playStatus', false)
      })
      this.player.on('error', (evt) => {
        // c.log('error', evt)
        _this.playing = false
        _this.$emit('playStatus', false)
      })
      // this.volume = this.player.getVolume() * 100
      this.player.setVolume(this.volume / 100)
    },

    async getPlayUrl () {
      // test
      // this.playUrl =
      //   'https://rtmp01open.ys7.com:9188/v3/openlive/791132449_1_2.flv?expire=1668669172&id=382911319192719360&t=1a6e524f9a9a53b28c99fdd0bc0b8414e53c5c8010795b06e0159bce56d52ea5&ev=100'
      // return

      // 处理是否转码
      let playUrl = this.videoUrl
      // let url = `http://videox.dev.iot-cas.com:8081/index/api/addStreamProxy?vhost=__defaultVhost__&secret=035c73f7-bb6b-4889-a715-d9eb2d1925cc&app=proxy&stream=${this.deviceUid}&enable_rtsp=1&enable_rtmp=1&enable_hls=1&url=${playUrl}`
      // if (!playUrl.includes('m3u8') && !playUrl.includes('flv')) {
      //   let res = await axios.get(url)
      //   if (res.data.code === 0) {
      //     playUrl = `http://videox.dev.iot-cas.com:8081/proxy/${
      //       this.deviceUid
      //     }/hls.m3u8?st=${Math.floor(Math.random() * 1000000)}`
      //   }
      // }
      this.playUrl = playUrl
    },
    // 显示云台控制面板
    onShowControl () {
      this.$emit('onShowControl')
    },
    // 录像
    setRecord () {
      if (this.canRecord) {
        // this.isRecording = !this.isRecording
        this.$emit('setRecord', this.isRecording)
      } else {
        window.parent.frameEvent({
          type: 'message',
          msg: '视频已停止播放，无法录像',
          showType: 'warning'
        })
      }
    },
    // 下载截图
    setSnapshot () {
      if (!this.playing) {
        window.parent.frameEvent({
          type: 'message',
          msg: '视频已停止播放，无法截图',
          showType: 'warning'
        })
        return
      }
      let img = this.getSnapShot()
      let anchor = document.createElement('a')
      anchor.href = img
      let filename = `截图${new Date()}.jpg`
      anchor.download = decodeURIComponent(filename)
      anchor.target = '_blank'
      anchor.click()
    },
    getSnapShot () {
      // 截图
      if (!this.player) {
        return
      }
      let canvas = document.createElement('canvas')
      let tag = this.player.tag
      if (!tag) {
        return
      }
      let { videoWidth, videoHeight } = tag
      canvas.width = videoWidth
      canvas.height = videoHeight
      let ctx = canvas.getContext('2d')
      ctx.save()
      ctx.drawImage(tag, 0, 0, videoWidth, videoHeight)
      ctx.restore()
      let img = canvas.toDataURL('image/jpg')
      return img
    },
    // 显示音量设置
    setVolume () {
      this.showVolumeSetting = !this.showVolumeSetting
    },
    bodyClick () {
      this.UIHideDT = 5
      this.showVolumeSetting = false
    },
    // 鼠标移动时，显示UI，3秒后UI隐藏
    mouseMove () {
      this.UIHideDT = 5
    },
    // 视频进度点击
    progressSeek (evt) {
      // c.log(
      //   'progressSeek',
      //   evt.layerX / this.$refs.progressBar.offsetWidth,
      //   evt.layerX,
      //   this.$refs.progressBar.offsetWidth
      // )
      this.$emit('seek', evt.layerX / this.$refs.progressBar.offsetWidth)
    },
    seek (t) {
      // c.log('player seek', t)
      this.player.seek(t)
    },
    getPlayTime (time) {
      let min = Math.floor(time / 60)
      let sec = time % 60
      if (sec < 10) {
        sec = '0' + sec
      }
      return `${min}:${sec}`
    },
    // videoClose () {
    //   this.videoPlay.videoClose(this)
    // }
  },
  beforeDestroy () {
    // if (this.player) {
    //   this.player.dispose()
    // }
    window.removeEventListener('webkitfullscreenchange', this.fullScreenEvent)
    window.removeEventListener('fullscreenchange', this.fullScreenEvent)
    window.removeEventListener('mozFullScreenchange', this.fullScreenEvent)
    clearInterval(this.UIHideTimer)
  }
}
</script>
<style lang="scss" scoped>
.player {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000;
  *{
    box-sizing: border-box;
  }
  .preview {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-position: center;
    // background-color: #000;
    background-repeat: no-repeat;
  }
  .no-video {
    width: 100%;
    height: 100%;
    position: absolute;
    // background-color: #ff445e;
    top: 0px;
    font-size: 14px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    background-position: 50% 50%;
    background-size: 90%;
    background-repeat: no-repeat;
    z-index: 1;
  }
  .ui-layer {
    &[ui-hidden] {
      opacity: 0;
    }
    transition: all 0.5s;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    // background-color: rgba(250, 0, 0, 0.8);

    .title {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
      height: 42px;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      color: #fff;
      line-height: 42px;
      padding-left: 16px;
      font-size: 14px;
      z-index: 2;
    }
    .video-close{
      position: absolute;
      right: 0px;
      top: 0px;
      color: #fff;
      line-height: 42px;
      padding-right: 16px;
      font-size: 14px;
      cursor: pointer;
      z-index: 2;
    }
    .progress-bar {
      z-index: 2;
      position: absolute;
      width: 100%;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.2);
      bottom: 60px;
      cursor: pointer;
      .progress {
        height: 100%;
        background-color: #00f;
      }
      .progress-dot {
        width: 12px;
        height: 12px;
        position: absolute;
        background-color: #00f;
        border-radius: 50%;
        top: 2px;
        margin-left: -6px;
        margin-top: -6px;
      }
      .time-line-list {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        pointer-events: none;
        .time-line-item {
          position: absolute;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
    .control-bar {
      z-index: 2;
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 60px;
      padding: 0px 16px;
      // background-color: rgba($color: #000000, $alpha: 0.7);
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, #000000 100%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      .control-bar-left {
        display: flex;
      }
      .control-bar-right {
        display: flex;
        justify-content: space-around;
      }
      .control-btn {
        cursor: pointer;
        // margin: 5px;
        width: 16px;
        height: 16px;
        display: block;
      }
      .control-btn.main-btn {
        width: 32px;
        height: 32px;
      }
      .control-btn.main-btn.play-time {
        display: flex;
        justify-content: center;
        align-items: center;
        width: auto;
        cursor: default;
      }
      .control-bar-left {
        .control-btn {
          margin-left: 16px;
        }
      }
      .control-bar-left-min {
        .control-btn {
          width: 20px;
          height: 20px;
        }
      }
      .control-bar-right {
        .control-btn {
          margin-right: 24px;
        }
        .volume-setting {
          position: absolute;
          left: -11px;
          bottom: 20px;
          background-color: rgba(0, 0, 0, 0.4);
          padding: 16px 0px 10px;
        }
      }
      .control-bar-right-min {
        .control-btn {
          margin-right: 0;
          width: 12px;
          height: 12px;
        }
      }
    }
  }

  .record-box {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -80px;
    .record-time {
      background-color: #ff445e;
      color: #fff;
      padding: 2px 16px;
      height: 24px;
      border-radius: 4px;
    }
  }
}

</style>
<style lang="scss">
.prism-auto-stream-selector{
  display: none;
}
</style>