<template>
  <div class="player-wrap">
    <div class="player" :id="'player_'+index"></div>
    <div class="video-control">
      <div class="control-right">
        <div class="full" @click="wholeFullScreen"></div>
      </div>
    </div>

    <div v-show="imageSrc" class="img">
      <img :src="imageSrc" width="100%" height="100%">
    </div>

    <span v-show="showLoading" class="loading">{{ loadingTxt }}</span>
    <span v-show="showError" class="error">{{ errorTxt }}</span>
  </div>

</template>

<script>
import {BASE_URL} from '@/config/setting'
import { mapMutations } from 'vuex'

export default {
  name: 'H5player',
  props: {
    'videoInfo': {type: Object}, //视频信息
    'index': {type: String, default: '0'}, //视频索引,海康播放器多屏存在时使用
  },
  data() {
    return {
      showLoading: true,
      loadingTxt: '加载中...',
      showError: false,
      errorTxt: '视频播放失败',

      player: null, // 实例
      mode: 0, // 0:普通 1:高级
      isMobile: false,
      imageSrc: '',
      isMulti: false // 是否多路
    }
  },
  mounted() {
    console.log(37, 'videoInfo', this.videoInfo)
    if(!window.JSPlugin) {
      // console.log('没有安装插件')
      this.loadScript(`${BASE_URL}/player/h5player/h5player.min.js`).then(()=>{
        this.init()
      })
    } else {
      this.init()
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.stopPlay();
      window.removeEventListener('resize', ()=>{
        this.player.JS_Resize()
      })
      this.handleDestroy();
    }
  },
  watch: {
    '$store.state.map.taskList'(nVal) {
      // 有任务，执行播放器初始化
      if (!this.$store.state.map.taskRunState && nVal.includes(this.index)) {
        this['TASK_STATE'](true);
        this.initPlater();
      }
    }
  },
  methods: {
    ...mapMutations('map',[
      'ADD_TASK',
      'DELETE_TASK',
      'TASK_STATE'
    ]),
    handleDestroy(){
      this.player = null
    },
    // 创建js挂载点
    loadScript(src){
      return new Promise(resolve => {
        let scriptEl = document.createElement("script");
        scriptEl.type = 'text/javascript';
        scriptEl.src = src;
        scriptEl.onload = () => {
          resolve();
        }
        document.body.appendChild(scriptEl)
      })
    },
    // 播放
    play(url) {
      this.showLoading = true
      this.showError = false
      let { player, mode, videoInfo } = this,
          index = player.currentWindowIndex,
          playURL = url || videoInfo.url

      player.JS_Play(playURL, { playURL, mode }, index).then(
        () => {
          console.log('realplay success')
        },
        e => {
          console.error('play', e)
          this.handleError(e)
          this.showLoading = false
        }
      )
    },
    // 停止播放
    stopPlay() {
      this.showLoading = false
      this.showError = false
      this.player.JS_Stop(this.player.currentWindowIndex).then(
        () => { console.log('stop realplay success') },
        e => {
          console.error('stopPlay', e)
          this.handleError(e)
        }
      )
    },
    // 全屏
    wholeFullScreen() {
      this.player.JS_FullScreenDisplay(true).then(
        () => { console.log(`wholeFullScreen success`) },
        e => {
          console.error('wholeFullScreen', e)
          this.handleError(e)
        }
      )
    },
    capture(imageType = 'JPEG') {
      let player = this.player,
        index = player.currentWindowIndex

      return new Promise(resolve => {
        // 弹窗进行下载
        /*player.JS_CapturePicture(index, 'img', imageType).then(
          () => {
            console.log('capture success', imageType)
          },
          e => { console.error(e) }
        )*/

        // 不进行下载，数据回调
        //2.1.0开始全是base64，之前的版本存在blob或者是base64
        player.JS_CapturePicture(index, 'img', imageType, imageData => {
          console.info('JS_CapturePicture success', imageData);
          this.imageSrc = imageData
          resolve(imageData)
        })
      })
    },
    init() {
      // 多路模式，进入任务列表
      if (this.index !== '0') {
        this.isMulti = true;
        this.showLoading = true;
        this['ADD_TASK'](this.index);
      } else {
        this.isMulti = false;
        this.initPlater();
      }
    },
    initPlater(){
      this.initAddEvent()
      this.createPlayer()
      this.play()
    },
    initAddEvent() {
      // 设置播放容器的宽高并监听窗口大小变化
      window.addEventListener('resize', () => {
        this.player.JS_Resize()
      })
    },
    createPlayer() {
      this.player = new window.JSPlugin({
        szId: `player_${this.index}`,
        szBasePath: `${BASE_URL}/player/h5player/`,
        iMaxSplit: 1,
        iCurrentSplit: this.isMobile ? 1 : 2,
        openDebug: true,
        oStyle: {
          borderSelect: "#000",
        }
      })


      const player = this.player,
        index = player.currentWindowIndex

      player.JS_SetConnectTimeOut(index, 20).then(
        () => { console.log('JS_SetConnectTimeOut success')},
        e => { console.error('JS_SetConnectTimeOut failed', e)}
      );

      // 事件回调绑定
      player.JS_SetWindowControlCallback({
        windowEventSelect: (iWndIndex) => {  //插件选中窗口回调
          console.log('windowSelect callback: ', iWndIndex);
        },
        pluginErrorHandler: (iWndIndex, iErrorCode, oError) => {  //插件错误回调
          console.log('pluginError callback: ', iWndIndex, iErrorCode, oError);
          this.handleError(iErrorCode)

          // 多路模式当前视频执行完成开始执行下一个视频加载
          this.isMulti && this.doNext()
        },
        firstFrameDisplay: (iWndIndex, iWidth, iHeight) => {  //首帧显示回调
          console.log('firstFrame loaded callback: ', iWndIndex, iWidth, iHeight);
          this.showLoading = false
          this.imageSrc = ''

          // 多路模式当前视频执行完成开始执行下一个视频加载
          this.isMulti && this.doNext()
        },
        performanceLack: () => {  //性能不足回调
          console.log('performanceLack callback: ');
        },
        windowEventOver: function (iWndIndex) {  //鼠标移过回调
          //console.log(iWndIndex);
        },
        windowEventOut: function (iWndIndex) {  //鼠标移出回调
          //console.log(iWndIndex);
        },
        windowEventUp: function (iWndIndex) {  //鼠标mouseup事件回调
          //console.log(iWndIndex);
        },
        windowFullCcreenChange: function (bFull) {  //全屏切换回调
          console.log('fullScreen callback: ', bFull);
        },
      });
    },
    // 执行下一个任务
    doNext() {
      this['DELETE_TASK']();
    },
    handleError(code){
      const errObj = {
        '0x12f900001': '接口调用参数错误',
        '0x12f900002': '不在播放状态',
        '0x12f900003': '仅回放支持该功能',
        '0x12f900004': '普通模式不支持该功能',
        '0x12f900005': '高级模式不支持该功能',
        '0x12f900006': '高级模式的解码库加载失败',
        '0x12f900008': 'url格式错误',
        '0x12f900009': '取流超时错误',
        '0x12f900010': '设置或者是获取音量失败，因为没有开启音频的窗口',
        '0x12f900011': '设置的音量不在1-100范围',
        '0x12f910000': 'websocket连接失败，请检查网络是否通畅，URL是否正确',
        '0x12f910010': '取流失败',
        '0x12f910011': '流中断，电脑配置过低，程序卡主线程都可能导致流中断',
        '0x12f910014': '没有音频数据',
        '0x12f910015': '未找到对应websocket，取流套接字被动关闭的报错',
        '0x12f910016': 'websocket不在连接状态',
        '0x12f910017': '不支持智能信息展示',
        '0x12f910018': 'websocket长时间未收到message',
        '0x12f910019': 'wss连接失败，原因：端口尚未开通、证书未安装、证书不安全',
        '0x12f910020': '单帧回放时不能暂停',
        '0x12f910021': '已是最大倍速',
        '0x12f910022': '已是最小倍速',
        '0x12f910023': 'ws/wss连接超时，默认6s超时时间，原因：网络异常，网络不通',
        '0x12f910026': 'jsdecoder1.0解码报错视频编码格式不支持',
        '0x12f910027': '后端取流超时，主动关闭连接（设备突然离线或重启，网络传输超时20s）',
        '0x12f910028': '设置的缓冲区大小无效，大小0-510241024，不在该范围的报错',
        '0x12f910029': '普通模式的报错，码流异常导致黑屏,尝试重新取流',
        '0x12f910031': '普通模式下播放卡主会出现',
        '0x12f910032': '码流编码格式普通模式下不支持，可切换高级模式尝试播放',
        '0x12f920015': '未调用停止录像，再次调用开始录像',
        '0x12f920016': '未开启录像调用停止录像接口错误',
        '0x12f920017': '紧急录像目标格式不支持，非ps/mp4',
        '0x12f920018': '紧急录像文件名为null',
        '0x12f930010': '内存不足',
        '0x12f930011': '首帧显示之前无法抓图，请稍后重试',
        '0x12f950000': '采集音频失败，可能是在非https域下使用对讲导致',
        '0x12f950001': '对讲不支持这种音频编码格式',
        '0x02201013': '设备不在线或其它问题【错误码释义】sip INVITE请求失败；请查看日志，确认具体原因',
      }
      let txt = '视频播放失败'
      if (errObj[code]) {
        txt = `【${code}】 ${errObj[code]}`
      } else if (code) {
        txt = `视频播放失败 【${code}】`
      }
      this.errorTxt = txt
      this.showError = true

      return txt
    }
  }
}
</script>

<style lang="scss" scoped>
.player-wrap {
  position: relative;
  width: 100% !important;
  height: 100% !important;
  &:hover{
    .video-control {
      //display: block;
    }
  }
  .player {
    position: relative;
    z-index: 1;
    width: 100% !important;
    height: 100% !important;
  }
  .img{
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .video-control {
    display: none;
    position: absolute;
    z-index: 3;
    left: 1px;
    bottom: 2px;
    right: 2px;
    height: 30px;
    background-color: rgba(43,51,63,.7);
    .control-right {
      display: flex;
      justify-content: flex-end;
      height: 100%;
    }
    .full {
      cursor: pointer;
      font-family: VideoJS;
      font-weight: 400;
      font-style: normal;
      text-align: center;
      line-height: 30px;
    }
    .full {
      width: 40px;
      height: 100%;
      color: #fff;
      &::before{
        content: "\F108";
        font-size: 18px;
      }
    }
  }
  .loading,.error {
    position: absolute;
    z-index: 4;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 26px;
    text-align: center;
    color: #fff;
  }
  .loading {
    height: 26px;
  }
  .error {
    min-height: 26px;
  }
}

</style>
