<template>
  <div
    class="phone-call-panel"
    v-show="visible"
    v-loading="isLoading"
    element-loading-text="加载数据中"
    element-loading-custom-class="loading-mask"
  >
    <div class="tel">{{ currNumber }}</div>

    <div class="con" v-if="status == 0 && !isLoading">
      <p class="msg">是否呼叫电话？</p>
      <el-button type="primary" @click="launchCall">呼叫</el-button>
      <el-button type="danger" @click="handleClose">关闭</el-button>
    </div>
    <div class="con" v-else-if="status == 1">
      <p class="msg">正在呼叫电话</p>
      <el-button type="primary" @click="cancelCall">取消呼叫</el-button>
    </div>
    <div class="con" v-else-if="status == 2">
      <p class="msg">电话已接通</p>
      <el-button type="danger" @click="unlinkCall">挂断</el-button>
    </div>
    <div class="con" v-else-if="status == 3">
      <p class="msg">电话已挂断</p>
      <el-button type="primary" @click="launchCall">重新呼叫</el-button>
      <el-button type="danger" @click="handleClose">关闭</el-button>
    </div>
    <audio id="remoteAudio" autoplay></audio>
  </div>
</template>

<script>
import { loadScript } from "@/utils/common";
export default {
  name: "PhoneCallPanel",
  components: {},
  data() {
    return {
      visible: false,

      //是否初始化
      isLoading: false,

      //当前状态
      status: 0, //0 待机 1呼叫中 2已接通 3已挂断

      // 连接实例
      link: null
    };
  },
  destroyed() {
    this.handleClose();
  },
  mounted() {
    // console.clear();
  },
  computed: {
    currNumber() {
      return this.$store.state.common.curCallNumber;
    }
  },
  watch: {
    async currNumber(val) {
      if (val) {
        this.visible = true;
        this.isLoading = true;
        if (this.isLoading) {
          if (!window.Janus) {
            this.initializeEnvironment().then(() => {
              this.initCall();
            });
          } else this.initCall();
        }
      } else {
        this.visible = false;
      }
    }
  },
  methods: {
    initializeEnvironment() {
      return Promise.all([
        loadScript("./assets/call/adapter.min.js"),
        loadScript("./assets/call/janus.js"),
        loadScript("./assets/call/xml2json.min.js"),
        loadScript("./assets/call/ctilink.js"),
        loadScript("./assets/call/ctimsg.js")
      ]);
    },
    async initCall() {
      const { Janus } = window;
      let sipCall;
      const that = this;
      const audio = document.getElementById("remoteAudio");
      Janus.init({
        debug: false,
        callback: () => {
          const janusClient = new Janus({
            server: `wss://testagent.qnzsai.com/janus/`,
            success: () => {
              janusClient.attach({
                plugin: "janus.plugin.sip",
                opaqueId: new Date().getTime() + "",
                success: plugin => {
                  sipCall = plugin;
                  sipCall.send({
                    message: {
                      type: "secret",
                      authuser: "3638",
                      display_name: "3638",
                      request: "register",
                      secret: "123456",
                      username: `sip:3638@172.26.50.112:50961`,
                      proxy: `sip:172.26.50.112:50961`
                    }
                  });
                },
                onmessage: (msg, jsep) => {
                  const { event } = msg.result || {};
                  console.log(event, jsep, 233);
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
                        success: data => {
                          sipCall.send({
                            message: { request: "accept" },
                            jsep: data
                          });
                        },
                        error: data => {
                          console.log("error: ", data);
                          try {
                            jsep.send({
                              message: { request: "decline", code: 480 }
                            });
                          } catch (e) {
                            that.$message.warning("请确保输入设备正常连接");
                          }
                        }
                      });
                      break;
                    // 挂机事件
                    case "hangup":
                      that.$message.warnning("已挂断");
                      that.handleClose();
                      break;
                    // 电话接通事件
                    case "accepted":
                      // audio.play();
                      // console.log("接通事件");
                      break;
                    default:
                      break;
                  }
                },
                // onremotestream: (stream) => {
                //   audio.srcObject = stream;
                // },
                iceState: state => {
                  if (state === "connected") {
                    audio.srcObject = sipCall.webrtcStuff.remoteStream;
                    audio.oncanplay = () => {
                      audio.play();
                    };
                  }
                }
              });
            },
            error: error => {
              console.log("janus error", error);
            },
            destroyed: () => {}
          });
        }
      });
    },
    async initialCtilink() {
      const link = new window.CtiLink();
      window.cti = link;
      this.link = link;
      const that = this;

      link.onReady = function() {
        console.log("onReady");
        link.setDebug(1);
        link.connect("wss://testagent.qnzsai.com", "443/ctilink/");
      };
      link.onDialSuccess = (caller, callee, confno, callNo, fileName) => {
        console.log("电话接通", caller, callee, confno, callNo, fileName);
        this.status = 2
      };
      link.onConnect = function(success, data) {
        console.log("onConnect------开始连接-------> " + success);
        if (success) {
          link.login(
            "13725001081",
            "$2y$10$a.zILSo2Ci7kPJIf2v74O.CTlnm5XL/6a8eSH.mDyWhcni2W2V.uG",
            "",
            "3638"
          );
        } else {
          window.$("#status").text("连接服务器失败");
          console.log(
            "onConnect------->连接服务器失败,请联系管理员.原因：" + data
          );
        }
      };

      link.onError = function(data) {
        console.log("onError------异常-------> " + data);
      };

      link.onLoginSuccess = function() {
        link.subscribeClientStatus(1); //订阅别人的状态消息
        link.getAllStatus(); //获取所有坐席的状态
        console.log("onLoginSuccess----------->登陆成功");
        console.log(link, 234);
        that.isLoading = false;
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
      link.setup("socket");
    },

    handleClose() {
      switch (this.status) {
        case 0: //待机
          break;
        case 1: //呼叫中
          this.cancelCall();
          break;
        case 2: //已接通
          this.unlinkCall();
          break;
        case 3: //已挂断
          break;
        default:
          break;
      }

      this.$store.commit("common/SET_CUR_CALL_NUMBER", null);
      this.status = 0;

      this.logout();
    },

    login() {
      location.reload();
    },

    logout() {
      if (this.link) {
        this.link.logout();
      }
    },

    //开始外呼
    launchCall() {
      this.status = 1;
      if (this.link) {
        this.link.callOut(this.currNumber.replace("-", ""), "02022044635");
      }
    },

    //取消外呼
    cancelCall() {
      if (this.link) {
        this.link.hangUp();
      }
      this.status = 0;
    },

    //挂断
    unlinkCall() {
      if (this.link) {
        this.link.hangUp();
      }
      this.status = 3;
    }
  }
};
</script>

<style lang="scss" type="text/scss">
.phone-call-panel {
  position: fixed;
  bottom: 2em;
  right: 2em;
  width: 300px;
  min-height: 100px;
  z-index: 9999;
  padding: 2em 1em;
  background-color: #0c1840;
  border: 1px solid #3757ab;
  border-radius: 10px;
  color: #fff;
  animation: flyin 0.5s;
  text-align: center;
  overflow: hidden;

  @keyframes flyin {
    0% {
      transform: translateX(120%);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateX(0%);
    }
  }

  p {
    color: #fff;
  }

  .close {
    position: absolute;
    top: 1em;
    right: 1em;
    cursor: pointer;
  }

  .tel {
    font-size: 2.5em;
    color: #fffa19;
    text-align: center;
  }
  .msg {
    padding: 2em 0;
  }

  .b-msg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 2em 0 0;

    text-align: center;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    z-index: 9999;
  }
}
</style>
