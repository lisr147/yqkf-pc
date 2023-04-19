<template>
  <div style="padding: 2em;">
    <el-input v-model="phoneNumber" style="width: 300px;margin-right: 20px" />
    <el-button @click="login">重新登录</el-button>
    <el-button @click="startCallOut">外呼</el-button>
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
      phoneNumber: "",
      link: null,
    };
  },
  mounted() {
    this.initScript();
  },
  methods: {
    async initScript() {
      await Promise.all([
        loadScript("/assets/call/adapter.min.js"),
        loadScript("/assets/call/janus.js"),
        loadScript("/assets/call/xml2json.min.js")
       ]);
      this.initialSip();
    },
    initialSip() {
      let sipCall;
      const audio = document.getElementById("remoteAudio");
      Janus.init({
        debug: true,
        callback: () => {
          const janusClient = new Janus({
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
                  const { event, code, reason } = msg.result || {};
                  switch (event) {
                    // 注册成功事件
                    case "registered":
                      this.initialCtilink();
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
                          console.log('error: ', data);
                          jsep.send({
                            message: { request: "decline", code: 480 },
                          });
                        },
                      });
                      break;
                    // 挂机事件
                    case "hangup":
                      break;
                    // 电话接通事件
                    case "accepted":
                      audio.play();
                      break;
                    default:
                      break;
                  }
                },
                onremotestream: (stream) => {
                  audio.srcObject = stream;
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

      link.onReady = function() {
        console.log("onReady");
        link.setDebug(1);
        link.connect('wss://testagent.qnzsai.com', '443/ctilink/');
      };

      link.onConnect = function(success, data) {
        console.log("onConnect------开始连接-------> " + success);
        if (success) {
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

      link.onError = function(data) {
        console.log("onError------异常-------> " + data);
      };

      link.onLoginSuccess = function(data, data2) {
        link.subscribeClientStatus(1); //订阅别人的状态消息
        link.getAllStatus(); //获取所有坐席的状态
        console.log("onLoginSuccess----------->登陆成功");
      };

      link.onLogout = function(reason) {
        console.log("onLogout-----退出------>: " + reason);
      };

      link.onClose = function() {
        console.log("onClose-----连接断开------>");
      };

      link.onLoginFail = function(data) {
        console.log("onLoginFail-----登陆失败------>" + data);
      };
        link.setup('socket');
    },
    login() {
      location.reload();
    },

    logout() {
      if (this.link) {
        this.link.logout();
      }
    },
    startCallOut() {
      if (this.link) {
        this.link.callOut(this.phoneNumber, "02022044635");
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
