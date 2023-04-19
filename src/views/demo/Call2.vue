<template>
  <div style="padding: 2em;">
    <el-input v-model="phoneNumber" style="width: 300px;margin-right: 20px" />
    <el-button @click="login">重新登录</el-button>
    <el-button @click="startCallOut(phoneNumber)">外呼</el-button>
    <el-button @click="handUp">挂机</el-button>
    <el-button @click="logout">登出</el-button>
    <audio id="remoteAudio" autoplay></audio>
  </div>
</template>

<script>
import { loadScript } from "@/utils/common";

export default {
  name: "Call2",
  components: {},
  data() {
    return {
      phoneNumber: "15625085251",
      link: null,
    };
  },
  mounted() {
    console.clear();
    this.initCall();
  },
  methods: {
    async initializeEnvironment() {
      await Promise.all([
        loadScript("./assets/call/adapter.min.js"),
        loadScript("./assets/call/janus.js"),
        loadScript("./assets/call/xml2json.min.js"),
        loadScript("./assets/call/ctilink.js"),
        loadScript("./assets/call/ctimsg.js")
       ]);
    },
    async initCall() {
      if(!window.Janus) {
          await this.initializeEnvironment();
      }
      let sipCall;
      const that = this;
      const audio = document.getElementById("remoteAudio");
      window.Janus.init({
        debug: true,
        callback: () => {
          const janusClient = new window.Janus({
            server: `wss://testagent.qnzsai.com/janus/`,
            success: () => {
              janusClient.attach({
                plugin: "janus.plugin.sip",
                opaqueId: new Date().getTime() + "",
                success: (plugin) => {
                  sipCall = plugin;
                  sipCall.send({
                    message: {
                      type: "secret",
                      authuser: "3638",
                      display_name: "3638",
                      request: "register",
                      secret: "123456",
                      username: `sip:3638@172.26.50.112:50961`,
                      proxy: `sip:172.26.50.112:50961`,
                    },
                  });
                },
                onmessage: (msg, jsep) => {
                  console.log("jauns message", msg, 123, jsep);
                  const { event, code, reason } = msg.result || {};
                  switch (event) {
                    // 注册成功事件
                    case "registered":
                      that.initialCtilink();
                      break;
                    // 注册失败事件
                    case "registration_failed":
                      break;
                    // 电话呼入事件
                    case "incomingcall":
                      sipCall.createAnswer({
                        jsep: jsep,
                        media: { audio: true, video: false },
                        success: (data) => {
                          sipCall.send({
                            message: { request: "accept" },
                            jsep: data,
                          });
                        },
                        error: (data) => {
                          console.log(data, 'error', jsep);
                          jsep.send({
                            message: { request: "decline", code: 480 },
                          });
                        },
                      });
                      break;
                    // 挂机事件
                    case "hangup":
                      that.$message.warnning('已挂断')
                      that.handleClose();
                      break;
                    // 电话接通事件
                    case "accepted":
                      // audio.play();
                      break;
                    default:
                      break;
                  }
                },
                // onremotestream: (stream) => {
                //   audio.srcObject = stream;
                // },
                iceState: (state) => {
                    if (state === 'connected') {
                      audio.srcObject = sipCall.webrtcStuff.remoteStream;
                      audio.oncanplay = () => {
                        audio.play();
                      };
                    }
                  },
              });
            },
            error: (error) => {
              console.log("janus error", error);
            },
            destroyed: () => {},
          });
        },
      });
    },
    async initialCtilink() {
      const link = new CtiLink();
      window.cti = link;
      this.link = link;
      console.log(this.link);

      link.onReady = function() {
        console.log("onReady");
        link.setDebug(1);
        link.connect('wss://testagent.qnzsai.com', '443/ctilink/');
      };

      link.onConnect = function(success, data) {
        console.log("onConnect------开始连接-------> " + success);
        if (success) {
          console.log('登陆。。。');
          link.login(
              '13725001081',
              '$2y$10$a.zILSo2Ci7kPJIf2v74O.CTlnm5XL/6a8eSH.mDyWhcni2W2V.uG',
              '',
              '3638',
          );
        } else {
          $("#status").text("连接服务器失败");
          console.log(
            "onConnect------->连接服务器失败,请联系管理员.原因：" + data
          );
        }
      };
      link.onLoginSuccess = function(data, data2) {
        link.subscribeClientStatus(1); //订阅别人的状态消息
        link.getAllStatus(); //获取所有坐席的状态
        console.log("onLoginSuccess----------->登陆成功");
      };

      link.onError = function(data) {
        console.log("onError------异常-------> " + data);
      };
      link.onLogout = function(reason) {
        console.log("onLogout-----退出------>: " + reason);
      };

      link.onQueueOff = function(reason) {
        console.log("onQueueOff-----排队挂断事件------>: " + reason);
      };

      link.onDialSuccess = function(caller,callee,confno,callNo,fileName) {
        console.log("onDialSuccess-----呼叫成功后响应事件------>: " + caller,callee,confno,callNo,fileName);
      };

      link.onClose = function() {
        console.log("onClose-----连接断开------>");
      };

      link.onLoginFail = function(data) {
        console.log("onLoginFail-----登陆失败------>" + data);
      };
      link.setup("socket");
      this.isInitReady = true;
    },
    login() {
      location.reload();
    },

    logout() {
      if (this.link) {
        this.link.logout();
      }
    },
    startCallOut(val) {
      if (this.link) {
        console.clear();
        this.link.callOut(val, "02022044635");
      }
    },
    handUp() {
      if (this.link) {
        this.link.hangUp();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
