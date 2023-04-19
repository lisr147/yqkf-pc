<template>
  <div class="hcamera">
    <iframe :src="videoUrl" ref="frame"></iframe>
    <div class="refresh-btn" @click="refreshFrame">刷新</div>

    <div class="ctrl"  :class="{folder: !isCtrlOpen}">
      <div class="ctrl-h" @click="toggleCtrl">
        云台 <span class="ico"></span>
        <div class="tip">
          <el-popover
            popper-class="screen-popover"
            placement="top-end"
            :offset="1000"
            width="200"
            trigger="hover"
            :value="tipVisible"
            content="视频画面有10秒左右的延迟,操作后请稍等">
            <i class="el-icon-info" slot="reference"></i>
          </el-popover>
        </div>
      </div>
      <div class="ctrl-b">
        <div class="dir">
          <b class="btn" v-for="(item,index) in btnList" :key="index" :title="item.title"
             @mousedown="handleMouseDown(item.params)" @mouseup="handleMouseUp(item.params)"><img :src="baseUrl+item.icon+'.png'"/></b>
        </div>
        <div class="zoom">
          <b class="btn" v-for="(item,index) in rbList" :key="index" :title="item.title"
             @mousedown="handleMouseDown(item.params)" @mouseup="handleMouseUp(item.params)"><img :src="baseUrl+item.icon+'@2x.png'"/></b>
        </div>
      </div>
      <div class="ctrl-f">
        <el-slider
          v-model="extent"
          :min="1"
          :max="7"
          :step="1"
          size="small"
          title="调节镜头移动速度"
          >
        </el-slider>
        <div class="ipt">{{extent}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {BASE_URL} from '@/config/setting'
  import {operateHdDirection, operateHdZoom, operateHdRotate} from '@/api/mapData'

  export default {
    name: "HCamera",
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
        videoUrl:'',
        btnList: [
          {title:'上左',params:{pan:-1, tilt: 1}, icon:`1`},
          {title:'上',params:{pan:0, tilt: 1}, icon:`2`},
          {title:'上右',params:{pan:1, tilt: 1}, icon:`3`},
          {title:'左',params:{pan:-1, tilt: 0}, icon:`4`},
          {title:'开始旋转/停止旋转',params:{rotate: true}, icon:`5`},
          {title:'右',params:{pan:1, tilt: 0}, icon:`6`},
          {title:'下左',params:{pan:-1, tilt: -1}, icon:`7`},
          {title:'下',params:{pan:0, tilt: -1}, icon:`8`},
          {title:'下右',params:{pan:1, tilt: -1}, icon:`9`},
        ],
        rbList: [
          {title:'靠近',params:{zoom: 1}, icon:`+`},
          {title:'远离',params:{zoom: -1}, icon:`-`},
        ],
        baseUrl: `${BASE_URL}/static/images/hdcamera/`,
        //操作程度，比如旋转程度
        extent: 4,
        //正在按下
        isPressing: false,
        //正在旋转中
        isRotating: false,
        //是否展开控制面板
        isCtrlOpen: true,
        tipVisible: false
      }
    },
    computed:{
      extentValue() {
        return Math.min(100, this.extent * 15)
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
      setTimeout(()=>{
        this.tipVisible = true
      },1000)
      setTimeout(()=>{
        this.tipVisible = false
      },6000)
    },
    methods: {
      initFrame() {

        const {deviceUid, livePlayUrl} = this.attributes
        this.videoUrl = `${location.origin}${BASE_URL}/player/liveplayer/player.html?deviceUid=${deviceUid}&videoUrl=${livePlayUrl}`
        // this.videoUrl = `http://develop.iot-cas.com:8081/yqfk/player/liveplayer/player.html?deviceUid=${deviceUid}&videoUrl=${livePlayUrl}`
      },

      toggleCtrl() {
        this.isCtrlOpen = !this.isCtrlOpen
      },

      //按下
      handleMouseDown(params){

        const t = this
        this.isPressing = true

        if (params.pan !== undefined) {
          //移动
          const p = {pan: params.pan * t.extentValue, tilt: params.tilt * t.extentValue }
          operateHdDirection(t.attributes.id, p)

        } else if(params.zoom !== undefined){
          //缩放
          const p = {zoom: params.zoom * t.extentValue }
          operateHdZoom(t.attributes.id, p)

        } else if(params.rotate){
          //旋转
          t.isRotating = !t.isRotating
          const p = {autoPan: t.isRotating ? t.extentValue : 0}
          operateHdRotate(t.attributes.id, p)
        }

      },

      //弹起
      handleMouseUp(params){
        const t = this
        this.isPressing = false

        if(params.pan !==undefined){
          //停止移动
          const p = {pan: 0, tilt: 0}
          operateHdDirection(t.attributes.id, p)

        } else if (params.zoom !== undefined) {
          //停止缩放
          const p = {zoom: 0}
          operateHdZoom(t.attributes.id, p)

        }
        this.$message({
          message: `操作指令已发送，视频画面有延迟，请稍等`,
          type: 'success'
        })

      },

      refreshFrame() {
        this.$refs['frame'].src = this.videoUrl + '&time=' + parseInt(Math.random() * 100000)
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
.hcamera{
  position: relative;
  height: 100%;
  min-height: 430px;
  background-color: #000;

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
  .ctrl{
    position: absolute;
    bottom: 0;
    right: 0;
    width: 210px;
    height: 240px;
    background: rgba(0, 31, 76, 0.9);
    color: #fff;

    &-h{
      padding: 10px 16px;
      cursor: pointer;

      .ico{
        position: absolute;
        top: 8px;
        left: 3.5em;
        width: 10px;
        height: 20px;
        background: url("~@/assets/image/hdcamera/right.png") center center no-repeat;
      }
      .tip {
        position: absolute;
        right: 14px;
        top: 6px;
        font-size: 20px;
      }
    }
    &-b{
      position: relative;
      padding: 4px 14px;
      .dir{
        width:140px;
      }
      .zoom{
        position: absolute;
        top: 4px;
        right: 15px;
        width: 40px;
      }
      .btn{
        display: inline-block;
        margin: 5px;
        width: 34px;
        height: 34px;
        background-color: #345EF0;
        cursor: pointer;
        opacity: 0.8;
        img {
          width: 100%;
        }

        &:hover{
          opacity: 1;
        }
        &:active{
          transform: translateY(2px);
        }
      }
    }
    &-f{
      position: relative;
      padding: 0 80px 0  28px;

      .ipt{
        position: absolute;
        right: 20px;
        top: 5px;
        padding: 5px;
        width: 30px;
        height: 20px;
        border-radius: 2px;
        text-align: center;
        background-color: #345EF0;
        color: #fff;
      }
    }

    &.folder{
      width: 100px;
      height: 40px;
      bottom: 46px;

      .ctrl-h{
        .ico{
          background-image: url("~@/assets/image/hdcamera/left.png");
        }
      }
      .ctrl-b{
        display: none;
      }
      .ctrl-f{
        display: none;
      }
    }
  }
}
</style>
