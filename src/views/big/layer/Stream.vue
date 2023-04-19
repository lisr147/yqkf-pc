<template>
  <el-dialog custom-class="stream-warp" :modal="false" top="5vh" :visible="true" width="90vw"
             @close="dismissRoom">
    <template slot="title">
      <div class="risk-title">{{ userName }}发起的视频会议
        <span>{{ remoteStreamList.length + 1 }}人在会议中</span>
        <span style="margin: 0 10px">房间号：{{roomId}}</span>
      </div>
    </template>
    <div class="stream-panel">
      <div class="stream-panel-b scroller">
        <!-- 本地流区域 -->
        <div v-if="localStream" class="local-stream-container" >
          <!-- 本地流播放区域 -->
          <div id="local_stream" class="stream-content"  :class="classObject">
            <p class="tip"><span>发起人</span>{{userName}}</p>
            <div class="noVideo" v-if="!cameraOn">
              摄像头已关闭
            </div>
          </div>
          <!-- 远端流区域 -->
          <div
            v-for="(item,index) in remoteStreamList"
            :key="item.id"
            :id="'remote_stream-'+item.id"
            class="stream-content"
            :class="classObject"
          >
            <p class="tip">
              <img src="@/assets/image/stream/voice.png" alt="" v-if="item.hasMic"  @click="muteRemoteAudio(item,index)">
              <img src="@/assets/image/stream/close-voice.png" alt="" v-else @click="unmuteRemoteAudio(item,index)">

              {{item.cyd}}（{{item.name}}）
            </p>
            <div class="noVideo" v-if="!item.hasVideo">
              摄像头已关闭
            </div>
          </div>

          <!-- 本地流操作栏 -->
          <div class="local-stream-control">
            <div class="audio-control control">
              <div @click="muteLocalAudio" v-if="micOn">
                <img src="@/assets/image/stream/voice.png" alt="" >
                <p>静音</p>
              </div>
              <div v-else @click="unmuteLocalAudio">
                <img src="@/assets/image/stream/close-voice.png" alt="">
                <p>静音</p>
              </div>
            </div>
            <div class="video-control control">
              <div v-if="cameraOn" @click="muteLocalVideo">
                <img src="@/assets/image/stream/video.png" alt="" >
                <p>关摄像头</p>
              </div>
              <div v-else @click="unmuteLocalVideo">
                <img src="@/assets/image/stream/close-video.png" alt="">
                <p>开摄像头</p>
              </div>
            </div>
            <div class="video-control control">
              <div @click="showStreamUser =true">
                <img src="@/assets/image/stream/add-member.png" alt="" >
                <p>成员（{{remoteStreamList.length+1}}）</p>
              </div>
             </div>
            <div class="control end-btn" @click="dismissRoom">
              <img src="@/assets/image/stream/end.png" alt="">
              <p>结束会议</p>
            </div>
          </div>
        </div>

        <!--成员列表-->
        <div class="aside">
          <h3>成员管理</h3>
          <div class="nav-member">
            <div class="nav-item" :class="{active:currIndex===index}" v-for="(item,index) in navList"
                 @click="chageNav(item,index)">
              {{ item }} <span v-if="item==='已入会'">（{{ remoteStreamList.length + 1 }}）</span>
              <span v-if="item==='未入会'">（{{ noJoinMember.length }}）</span>
            </div>
          </div>
          <div class="stream-list" v-if="currIndex===0">
            <div class="stream-list-item">
              <div class="member-img" style="background-color: #e6e6e6">
                <img src="@/assets/image/stream/member.png" alt="">
              </div>
              <div class="desc">
                <p class="name">我
<!--                  {{ userId }}-->
                </p>
                <p>发起人</p>
              </div>
            </div>
            <div class="stream-list-item" v-for="(item,index) in remoteStreamList" :key="index">
              <div class="member-img">
                <img src="@/assets/image/stream/member.png" alt="">
              </div>
              <div class="desc">
                <p class="name">{{ item.name || '' }} </p>
                <p>{{ item.cyd }}</p>
                <template>
                  <img class="v-icon" src="@/assets/image/stream/voice.png" alt="" v-if="item.hasMic"  @click="muteRemoteAudio(item,index)">
                  <img class="v-icon" src="@/assets/image/stream/close-voice.png" alt="" v-else @click="unmuteRemoteAudio(item,index)">
                </template>
              </div>
            </div>
          </div>
          <div class="stream-list" v-else>
            <div class="stream-list-item" v-for="(item,index) in noJoinMember" :key="index">
              <div class="member-img">
                <img src="@/assets/image/stream/member.png" alt="">
              </div>
              <div class="desc">
                <p class="name">{{ item.name }} </p>
                <p>{{ item.cyd }}</p>
              </div>
            </div>
          </div>
          <div style="position: absolute;bottom: 15px;left: 20px">
            <el-button type="primary" size="large" @click="showStreamUser=true">邀请</el-button>
<!--            <el-button type="primary" size="small" v-if="!isAllMute" @click="closeAllAudio">全员静音</el-button>-->
<!--            <el-button type="primary" size="small" v-else @click="openAllAudio">关闭静音</el-button>-->
          </div>
        </div>
      </div>
    </div>

    <StreamUserTree v-show="showStreamUser" :templateId="data.templateId" :roomId="roomId" :cydData="data" @closeStreamUser="closeStreamUser"></StreamUserTree>
  </el-dialog>

</template>

<script>
//前端测试要导入demo里lib-generate-test-usersig.min.js，不然签名无法成功，后面要从后端签名后返回值。
// import LibGenerateTestUserSig from "@/assets/js/lib/lib-generate-test-usersig.min.js";
import StreamUserTree from "./StreamUserTree";
//导入sdk
import TRTC from "trtc-js-sdk";
import {getSDKAppID,getUserSig,dismissRoom} from "@/api/stream";

export default {
  components: {StreamUserTree},
  props:{
    data:{type:Object}
  },
  data() {
    return {
      noJoinMember: [],//未入会成员
      showStreamUser: true,
      sdkAppId: null,
      secretKey: null,
      userSig:null,
      roomId: parseInt(Math.random() * 10000, 10),//房间号
      // roomId: 8888,//房间号
      client: "", //客户端服务
      remoteStream: "", //远方播放流
      localStream: "", //本地流
      remoteStreamList: [], //远方流列表
      showLocalStream: false,
      showRemoteStream: false,
      micOn: true,
      cameraOn: true,
      //是否加入房间
      isInRoom: false,
      inviteUserId: '',
      userSigGenerator: '',
      inviteUserSig: '',
      inviteLink: '',
      navList: ['已入会', '未入会'],
      currIndex: 0,
      currLeaveUserId: "",
      isAllMute:false,

    };
  },
  watch: {
    natPrincipals(list) {
      this.noJoinMember = list
    },
    remoteStreamList(list) {
      console.log('监听远程列表', list);
      let result  = this.natPrincipals.filter(item => {
        let idList = list.map(val => val.userId)
        return idList.indexOf(item.userId) == -1
      })
      this.noJoinMember = result

    },
  },
  computed: {
    natPrincipals() {
      return this.$store.state.common.natPrincipals
    },
    userName() {
      return this.$store.getters.username
    },
    userId() { //取当前用户电话号码
      return this.$store.state.user.mobile
    },
    classObject(){
      return {
        'col-3': this.remoteStreamList.length>3,
        'col-4': this.remoteStreamList.length>8,
        'col-5': this.remoteStreamList.length>11,
      }
    }
  },

  mounted() {
    this.initDevice()
    //测试用，所以直接创建了，其他需求可自行更改
    // this.createClient(this.userId);
    this.getSDKAppID();
  },
  destroyed() {
    // 停止本地流，关闭本地流内部的音视频播放器
    this.leaveRoom()
  },

  methods: {
    async initDevice(){
      const cameraList = await TRTC.getCameras();
      const micList = await TRTC.getMicrophones();
      const speakerList = await TRTC.getSpeakers();
      const hasCameraDevice = cameraList.length > 0;
      const hasMicrophoneDevice = micList.length > 0;
      const hasSpeakerDevice = speakerList.length > 0;
      if(!hasCameraDevice) alert('摄像头异常')
      if(!hasMicrophoneDevice) alert('麦克风异常')
    },
    async getSDKAppID() {
      await getSDKAppID().then((res) => {
        this.sdkAppId=res.SDKAppID
        this.secretKey=res.key
        this.getUserSig()
      })
    },
    async getUserSig() {
      let params ={
        userId:this.userId,
        expire:86400
      }
      await getUserSig(params).then((res) => {
        this.userSig = res
        this.createClient()
      }).catch((error)=>{
        alert('获取userSig失败')
        console.error("获取userSig失败 " + error);
      })
    },
    closeStreamUser() {
      this.showStreamUser = false
    },
    //主要检测推流方公共方法内
    publicMonitor(client) {
      // 新增人员
      client.on('peer-join', evt => {
        console.log('远端新入人员----peer-join', evt)

      })
      // 删减人员
      client.on('peer-leave', evt => {
        console.log('删减人员peer-leave', evt)
        let updateIndex =this.remoteStreamList.findIndex(item => item.userId ==evt.userId)
        this.remoteStreamList.splice(updateIndex, 1);
      })
      // 推流方关闭音频
      client.on('mute-audio', evt => {
        console.log('mute-audio', evt)
      })
      // 推流方开启音频
      client.on('unmute-audio', evt => {
        console.log('unmute-audio', evt)
      })

      client.on('stream-updated', event => {
        const remoteStream = event.stream;
        let updateIndex = this.remoteStreamList.findIndex(item => item.userId == remoteStream.getUserId())
        this.remoteStreamList[updateIndex].hasVideo = remoteStream.hasVideo()
      });
    },

    //创建链接
    createClient() {
      const {sdkAppId,userId,userSig,roomId} =this
      console.log('直播info',`房间号:${roomId}`,`userId：${userId}`,`userSig:${userSig}`);
      if(!sdkAppId||!userSig||!userId) return
      //获取签名
      // const config = this.genTestUserSig(userId);
      // const sdkAppId = config.sdkAppId;
      // const userSig = config.userSig;
      this.localStream = "";
      this.remoteStreamList = [];
      this.client = TRTC.createClient({
        mode: "rtc", //音视频rtc、视频直播live
        sdkAppId,
        userId,
        userSig,
      });
      //注册远程监听，要放在加入房间前--这里用了发布订阅模式
      this.subscribeStream(this.client);
      this.publicMonitor(this.client)
      this.joinRoom(this.client, this.roomId);
    },


    //加入房间
    joinRoom(client, roomId) {
      client
        .join({roomId})
        .catch((error) => {
          console.error("进房失败 " + error);
        })
        .then(() => {
          console.log("进房成功");
          //创建本地流
          this.createStream(this.userId);
          console.log('发起者', this.userId);
          //播放远端流
          this.playStream(this.client);
        })
    },
    //创建本地音视频流
    createStream(userId) {
      const localStream = TRTC.createStream({
        userId,
        audio: true,
        video: true,
      });
      this.localStream = localStream;
      // 自定义视频分辨率、帧率和码率
      localStream.setVideoProfile({ width: 640, height: 480, frameRate: 15, bitrate: 900 /* kpbs */});
      localStream
        .initialize()
        .catch((error) => {
          console.error("初始化本地流失败 " + error);
        })
        .then(() => {
          console.log("初始化本地流成功");
          // 创建好后才能播放 本地流播放 local_stream 是div的id
          localStream.play("local_stream");
          //创建好后才能发布
          this.publishStream(localStream, this.client);
        })

    },

    //发布本地音视频流
    publishStream(localStream, client) {
      client
        .publish(localStream)
        .catch((error) => {
          console.error("本地流发布失败 " + error);
          alert("本地流发布失败,请检查设备和网络情况" + error)
        })
        .then(() => {
          console.log("本地流发布成功");
        });
    },

    //订阅远端流--加入房间之前
    subscribeStream(client) {
      client.on("stream-added", (event) => {
        const remoteStream = event.stream;
        console.log("远端流增加3333: " + remoteStream.getUserId());
        //订阅远端流
        client.subscribe(remoteStream);
      });
    },

    //播放远端流
    playStream(client) {
      client.on("stream-subscribed", (event) => {
        const remoteStream = event.stream;
        console.log("远端流订阅成功：" + remoteStream.getId());
        // 创建远端流标签，因为id是动态的，所以动态创建，用了v-html
        let remoteStreamItem = `<div id="${
          "remote_stream-" + remoteStream.getId()
        }"></div>`;
        let isExist = this.remoteStreamList.find(
          (item) => item.userId === remoteStream.getUserId()
        );
        let item = this.natPrincipals.find(i => i.userId == remoteStream.getUserId())
        if (!isExist) {
          this.remoteStreamList.push({
            id: remoteStream.getId(),
            userId: remoteStream.getUserId(),
            view: remoteStreamItem,
            stream: remoteStream,
            name: item.name,
            phoneNumber: item.phoneNumber,
            cyd: item.cyd,
            hasVideo: true, // 是否开启了摄像头
            hasMic: true, // 是否开启了麦克风
          });
          // 做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
          this.$nextTick(() => {
            remoteStream.play("remote_stream-" + remoteStream.getId());
          });
        }
      });
    },

    //停止播放远端流
    stopRemoteStream(remoteStream) {
      console.log("停止远端流>>>>", remoteStream)
      remoteStream.stream.stop("remote_stream-" + remoteStream.id)
    },

     dismissRoom(){
      this.$confirm('此操作将结束会议并解散房间, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         dismissRoom(this.roomId).then((res)=>{
          this.$store.commit('common/SET_NATPRINCIPALS', [])
           this.leaveRoom()
        })
      }).catch(() => {
      });

    },

    //退出音视频
    async leaveRoom() {
      this.client && this.client.enableAudioVolumeEvaluation(-1);
      if(this.localStream){
        this.client.unpublish(this.localStream)
        this.localStream.stop()
        this.localStream.close()
        this.localStream = null
      }
      await this.client.leave()
        .then(() => {
          console.log("退房成功");
          // 停止本地流，关闭本地流内部的音视频播放器
          this.client = null;
          this.$emit('closeStream')
          // 退房成功，可再次调用client.join重新进房开启新的通话。
        })
        .catch((error) => {
          console.error("退房失败 " + error);
          // 错误不可恢复，需要刷新页面。
        });
    },
    /**
     * 禁止本地音频
     */
    muteLocalAudio() {
      this.micOn = false
      return this.localStream.muteAudio();
    },

    /**
     * 打开本地音频
     */
    unmuteLocalAudio() {
      this.micOn = true
      return this.localStream.unmuteAudio();
    },

    /**
     * 禁止本地视频
     */
    muteLocalVideo() {
      this.cameraOn = false
      return this.localStream.muteVideo();
    },

    /**
     * 打开本地视频
     */
    unmuteLocalVideo() {
      this.cameraOn = true
      return this.localStream.unmuteVideo();
    },

    /**
     * 禁止远端音频
     */
    muteRemoteAudio(remoteStream,index) {
      console.log('禁止远端音频',remoteStream.stream.muteAudio(),remoteStream.stream);
      this.remoteStreamList[index].hasMic =false
      return remoteStream.stream.muteAudio()
    },

    /**
     * 开启远端音频
     */
    unmuteRemoteAudio(remoteStream,index) {
      console.log('开启远端音频',remoteStream.stream.unmuteAudio(),remoteStream.stream);
      this.remoteStreamList[index].hasMic =true
      return remoteStream.stream.unmuteAudio()
    },

    //全员静音
    closeAllAudio(){
      this.remoteStreamList.map(item=>{
        item.hasMic =false
        this.isAllMute = true
        return item.stream.unmuteAudio()

      })
    },
    //打开全员声音
    openAllAudio(){
      this.remoteStreamList.map(item=>{
        item.hasMic =true
        this.isAllMute = false
        return item.stream.muteAudio()
      })
    },


    handleClose() {
      this.leaveRoom(this.client);
      this.$emit("close");
    },
    chageNav(i, index) {
      this.currIndex = index
    },



    //获取用户签名--前端测试用
    genTestUserSig(userID) {
      /**
       * 腾讯云 SDKAppId，需要替换为您自己账号下的 SDKAppId。
       *
       * 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav ) 创建应用，即可看到 SDKAppId，
       * 它是腾讯云用于区分客户的唯一标识。
       */
      // const SDKAPPID = 1400643843;
      const SDKAPPID = 1400676048;
      /**
       * 签名过期时间，建议不要设置的过短
       * <p>
       * 时间单位：秒
       * 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
       */
      const EXPIRETIME = 86400;
      /**
       * 计算签名用的加密密钥，获取步骤如下：
       *
       * step1. 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav )，如果还没有应用就创建一个，
       * step2. 单击“应用配置”进入基础配置页面，并进一步找到“帐号体系集成”部分。
       * step3. 点击“查看密钥”按钮，就可以看到计算 UserSig 使用的加密的密钥了，请将其拷贝并复制到如下的变量中
       *
       * 注意：该方案仅适用于调试Demo，正式上线前请将 UserSig 计算代码和密钥迁移到您的后台服务器上，以避免加密密钥泄露导致的流量盗用。
       * 文档：https://cloud.tencent.com/document/product/647/17275#Server
       */
      const SECRETKEY =
        // "1c8e2acb19746306e7b7b7d73288d527cfb345ab17a219b7ad66073837242587";
      "87b20ab889136c0de48d137f320cd9c22b9313979274f9da7396d0b5e709018b"

      // a soft reminder to guide developer to configure sdkAppId/secretKey
      if (SDKAPPID === "" || SECRETKEY === "") {
        alert(
          "请先配置好您的账号信息： SDKAPPID 及 SECRETKEY " +
          "\r\n\r\nPlease configure your SDKAPPID/SECRETKEY in js/debug/GenerateTestUserSig.js"
        );
      }
      const generator = new LibGenerateTestUserSig(
        SDKAPPID,
        SECRETKEY,
        EXPIRETIME
      );
      const userSig = generator.genTestUserSig(userID);
      return {
        sdkAppId: SDKAPPID,
        userSig: userSig,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.stream-panel {
  width: 100%;
  border-radius: 4px;

  &-b {
    //max-height: calc(100vh - 35px);
    height: 80vh;
    overflow-y: auto;
    display: flex;

    .noVideo {
      z-index: 2;
      position: absolute;
      top: 50%;
      left: 50%;
      color: #fff;
      transform: translate(-50%, -50%);
    }

    .stream-camera {
      z-index: 2;
      position: absolute;
      right: 54px;
      bottom: 4px;
      font-size: 18px;
    }

    .list-name {
      font-size: 14px;
      padding: 1px 2px;
      background: rgba(37, 215, 59, 1);
      color: white;
      border-radius: 4px;
    }

    .isActive {
      border: 4px solid #25D73B;
    }

    .info {
      margin: 12px 0;

      .row {
        padding: 8px 0;

        .name {
          color: #4b5869;
        }
      }
    }
  }

  .local-stream-container {
    flex:3;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    padding-bottom: 70px;
    .stream-content {
      display: flex;
      flex-wrap: wrap;
      width: 48%;
      height: 49%;
      //max-height: 345px;
      margin:0 8px 8px;
      position: relative;
      border-radius: 5px;
      overflow: hidden;
      .tip{
        position: absolute;
        padding: 0 10px;
        line-height: 28px;
        background: rgba(0, 0, 0, .6);
        border-radius: 5px;
        color: #FFFFFF;
        z-index: 9;
        bottom: 10px;
        left: 15px;
        img{
          height: 14px;
          cursor: pointer;
          margin-right: 3px;
        }
        span{
          height: 20px;
          font-size: 12px;
          line-height: 20px;
          background: #25D73B;
          border-radius: 2px;
          padding: 2px 5px;
          margin-right: 8px;
        }
      }
    }
    .col-3{
      width: 31.5%;
      height: auto;
    }
    .col-4{
      width: 23%;
      height: auto;
    }
    .col-5{
      width: 18%;
      height: auto;
    }
    .local-stream-control {
      width: 100%;
      height: 65px;
      position: absolute;
      background: #333333;
      bottom: 0;
      display: flex;
      .control {
        margin: 0 20px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        cursor: pointer;
        >div{
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }
        p {
          color: #fff;
          margin-top: 5px;
        }

        i {
          font-size: 30px;
        }
        img{
          height: 24px;
        }
      }
      .end-btn{
        position: absolute;
        top: 10px;
        right: 20px;
      }
    }
  }

  .aside {
    background: #223E7E;
    border: 1px solid #4060B2;
    color: #FFFFFF;
    position: relative;
    flex:1;
    h3 {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      height: 54px;
      line-height: 54px;
      background: #223E7E;
      box-shadow: inset 0px -1px 0px 0px #4060B2;
      padding: 0 15px;
    }

    .nav-member {
      display: flex;
      width: 100%;
      height: 48px;
      line-height: 48px;
      background: rgba(255, 255, 255, 0);
      box-shadow: inset 0px -1px 0px 0px rgba(255, 255, 255, 0.15);
      justify-content: space-around;

      .nav-item {
        cursor: pointer;
      }

      .active {
        color: #4C99FF;
        border-bottom: solid 2px #4C99FF;
      }
    }

    .stream-list {
      flex: 1;
      display: flex;
      padding: 15px;
      flex-direction: column;
      height: 72%;
      overflow: auto;

      &-item {
        display: flex;
        margin: 5px 0;
        position: relative;
        .member-img{
          background-color: RGBA(105, 112, 117, 1);
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 10px;
          img {
            width:46px;
          }
        }
        .desc {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .name{
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
          }
          .v-icon{
            position: absolute;
            right: 15px;
            top: 18px;
            height:24px;
          }
          p {
            margin: 3px 0;
            display: flex;
            color: #cccccc;
            img{
              height: 20px;
              margin-right: 5px;
              cursor: pointer;
            }
          }
        }
      }

      //本地流
      .local-stream {
        position: relative;
      }

      //远端流列表
      .remote-stream-panel {
        width: 100px;
        height: 100px;
        // display: flex;
        // flex-direction: column;
        // position: relative;
        .remote-stream {
          width: 100%;
          height: 100%;
          position: relative;
          // height: 475px;
        }
      }
    }
  }

}
</style>

<style lang="scss">
.stream-warp {
  top: 8vh !important;
  z-index: 999;
  .risk-title {
    font-size: 22px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;

    span {
      font-size: 16px;
    }
  }
  ::v-deep.el-dialog__body{
    padding: 0;
  }
}
</style>
