<template>
  <div class="phone-call-panel"
       v-show="visible"
       v-loading="!isLoginReady"
       element-loading-text="正在登陆外呼系统"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div v-show="isKickOut" class="b-msg">
      <p class="msg">其他人正在登录当前账号，您已经被踢下线</p>
      <el-button type="success"  @click="login">重新登陆</el-button>
      <el-button type="danger"  @click="handleClose">关闭</el-button>
    </div>

    <div class="tel">{{currNumber}}</div>

    <div class="con" v-if="status == 0">
      <p class="msg">是否呼叫电话？</p>
      <el-button type="primary" @click="launchCall" >呼叫</el-button>
      <el-button type="danger" @click="handleClose" >关闭</el-button>
    </div>
    <div class="con" v-else-if="status == 1">
      <p class="msg">正在呼叫电话 </p>
      <el-button type="primary" @click="cancelCall" >取消呼叫</el-button>
    </div>
    <div class="con" v-else-if="status == 2">
      <p class="msg">电话已接通</p>
      <el-button type="danger" @click="unlinkCall">挂断</el-button>
    </div>
    <div class="con" v-else-if="status == 3">
      <p class="msg">电话已挂断</p>
      <el-button type="primary" @click="launchCall" >重新呼叫</el-button>
      <el-button type="danger" @click="handleClose" >关闭</el-button>
    </div>

  </div>
</template>

<script>
  export default {
    name: "PhoneCallPanel",
    components: {},
    data() {
      return {
        visible: false,

        callOptions: {
          identifier: 'gznsqwh', //企业编码
          cno: '2000', //座席工号
          password: 'Aa112233', //密码
          bindType: 3,// 1：普通电话、2：IP话机、3：软电话
          bindTel: '2000',//绑定电话
          loginStatus: 1,//登录状态，1：空闲、2：忙碌
        },

        //是否初始化
        isInitReady: false,

        //是否已登录
        isLoginReady: false,

        //当前状态
        status: 0, //0 待机 1呼叫中 2已接通 3已挂断

        //被踢下线
        isKickOut: false,
      }
    },
    destroyed(){
      this.handleClose()
    },
    computed:{
      currNumber() {
        return this.$store.state.common.curCallNumber
      }
    },
    watch: {
      async currNumber(val) {

        if (val) {
          this.visible = true

          if (!this.isInitReady) {
            await this.init()
          }
          if (!this.isLoginReady) {
            this.login()
          }

        } else {
          this.visible = false
        }

      }
    },
    mounted() {

    },
    methods: {

      async init(){

        var t = this

        return new Promise((resolve, reject)=>{

          if (this.isInitReady) {
            resolve()
          } else {
            ClinkAgent.setup({sipPhone: true, debug: false}, function (token){
              console.log(`外呼初始化`)

              ClinkAgent.registerListener(ClinkAgent.EventType.PREVIEW_OUTCALL, (e)=>{

                if (e.result == 'error') {
                  t.$message({
                    message: '外呼失败，请检查麦克风和音频输出设备是否正常连接',
                    type: 'error'
                  })
                  t.status = 0
                }
              })

              ClinkAgent.registerListener(ClinkAgent.EventType.PREVIEW_OUTCALL_START, (e)=>{
                console.log(`开始预览外呼 事件回调`)
                t.status = 1
              })

              ClinkAgent.registerListener(ClinkAgent.EventType.PREVIEW_OUTCALL_RINGING, (e)=>{
                console.log(`客户响铃 事件回调`)
                t.status = 1
              })

              ClinkAgent.registerListener(ClinkAgent.EventType.PREVIEW_OUTCALL_BRIDGE, (e)=>{
                console.log(`客户接听 事件回调`)
                t.status = 2
              })

              ClinkAgent.registerListener(ClinkAgent.EventType.KICKOUT,  (token) =>{
                console.log(`被踢下线 事件回调`)
                t.status = 0
                t.isKickOut = true
                t.isLoginReady = false
              })

              ClinkAgent.registerListener(ClinkAgent.EventType.BREAK_LINE, (e)=>{
                console.log(`断线 事件回调`)
                t.status = 3
              })

              //我方座席操作 回调
              ClinkAgent.registerCallback(ClinkAgent.ResponseType.PREVIEW_OUTCALL, (e)=>{
                console.log(`座席 外呼 事件回调`)
                t.status = 1
              })
              ClinkAgent.registerCallback(ClinkAgent.ResponseType.PREVIEW_OUTCALL_CANCEL, (e)=>{
                console.log(`座席 外呼取消 事件回调`)
                t.status = 0
              })
              ClinkAgent.registerCallback(ClinkAgent.ResponseType.REFUSE, (e)=>{
                console.log(`座席 拒接 事件回调`)
              })
              ClinkAgent.registerCallback(ClinkAgent.ResponseType.UNLINK, (e)=>{
                console.log(`座席 挂断 事件回调`)

                t.status = 3
              })
              ClinkAgent.registerCallback(ClinkAgent.ResponseType.SIP_LINK, (e)=>{
                console.log(`座席 软电话接听 事件回调`)
              })
              ClinkAgent.registerCallback(ClinkAgent.ResponseType.SIP_UNLINK, (e)=>{
                console.log(`座席 软电话挂断 事件回调`)
              })
              ClinkAgent.registerCallback(ClinkAgent.ResponseType.BREAKLINE, (e)=>{
                console.log(`座席 断线 事件回调`)
              })

            })
            t.isInitReady = true
            resolve()
          }

        })
      },

      handleClose(){

        switch(this.status){
          case 0: //待机
            break;
          case 1: //呼叫中
            this.cancelCall()
            break;
          case 2: //已接通
            this.unlinkCall()
            break;
          case 3: //已挂断
            break;
          default:
            break;
        }

        this.$store.commit('common/SET_CUR_CALL_NUMBER',null)
        this.status = 0

        this.logout()
      },

      login(callback){

        var t = this

        if (this.isLoginReady) {
          console.log(`已经登录`)
          if (typeof callback == 'function') {
            callback.call(t)
          }

        } else {
          //登录指令
          ClinkAgent.login(Object.assign({}, this.callOptions))
          //登录结果
          ClinkAgent.registerCallback(ClinkAgent.ResponseType.LOGIN, function (result) {

            if(result.code !== 0){
              console.log(`登录失败`)
              console.log(result)
              return
            }

            console.log(`登录成功`)
            t.isLoginReady = true
            t.isKickOut = false

            if (typeof callback == 'function') {
              setTimeout(function(){
                callback.call(t)
              }, 1000) //登录后需要延迟若干时间，执行呼叫才能成功
            }

          })
        }

      },


      logout(){
        var t = this
        ClinkAgent.logout({
          logoutMode: 0, //退出方式，0：退出后台在线、1：完全退出
          removeBinding: 1, //解绑电话，0：不解绑、1：解绑
        })
        ClinkAgent.registerCallback(ClinkAgent.ResponseType.LOGOUT, function(result) {
          console.log(`登出成功`)
          t.isLoginReady = false
        })

      },

      //开始外呼
      launchCall(){

        this.status = 1
        ClinkAgent.previewOutcall({
          tel: this.currNumber,
          timeout: 120,
        })

      },

      //取消外呼
      cancelCall(){
        ClinkAgent.previewOutcallCancel()
        this.status = 0

      },

      //挂断
      unlinkCall() {
        ClinkAgent.unlink()
        this.status = 3

      },


    }
  }
</script>

<style lang="scss" type="text/scss">
.phone-call-panel{
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
    0% {transform: translateX(120%); opacity:0;}
    50% { opacity:1;}
    100% {transform: translateX(0%);}
  }

  p{
    color: #fff;
  }

  .close{
    position: absolute;
    top:1em;
    right: 1em;
    cursor: pointer;
  }

  .tel{
    font-size: 2.5em;
    color: #fffa19;
    text-align: center;
  }
  .msg{
    padding: 2em 0;
  }

  .b-msg{
    position: absolute;
    top:0;
    left:0;
    right: 0;
    bottom: 0;
    padding: 2em 0 0;

    text-align: center;
    background-color: rgba(0,0,0,0.8);
    color: #fff;
    z-index: 9999;
  }

}
</style>
