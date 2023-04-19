<template>
  <div class="reserve" :class="formType === 'readonly' ? 'readonly' : '' ">
    <div class="page-header">
      <div class="return" @click="goBack"><van-icon name="arrow-left" />返回</div>
      <div class="title">
        {{formType === 'readonly' ? '预约详情' : formType === 'reserveSuccess' ? '预约成功' : formType === 'newReserve' ? '司机预约' : '预约失败'}}
      </div>
    </div>
    <div class="form-list" :class="formType === 'readonly' || formType === 'reserveSuccess' ? 'readonly' : '' ">
      <div class="code-block" v-if="formType === 'reserveSuccess' || formType === 'readonly'">
        <codeBlock :qrCodeText="qrCodePath"/>
      </div>
      <div class="fail-block" v-if="formType === 'fail'">
        <fail :errorInfo="errorInfo"/>
      </div>
      <template v-if="formType === 'newReserve' || formType === 'readonly'">
        <div class="form-block">
          <div class="title">
            基本信息
          </div>
          <ele-form
            v-if="baseFormData && baseFormData.order.length"
            :formId="formId"
            :instanceId="formId"
            :formDesc="baseFormData.formDesc"
            :order="baseFormData.order"
            :formData="baseData"
            v-bind="formBindProps"
            ref="baseFormData"
            :readonly="formType === 'readonly'"
            :disabled="formType === 'readonly'"
            >
            <form-skeleton v-if="isLoading" />
          </ele-form>
        </div>
        <div class="form-block" v-for="(item, index) in personDatas" :key="item + index">
          <div class="title">
            {{(index >= 1 ? '随行人' : '司机') + (index >= 1 ? index : '')}}
            <div class="delete-btn" v-show="index > 0 && formType === 'newReserve'" @click="deletePerson(index)">删除</div>
          </div>
          <ele-form
            v-if="driverFormData && driverFormData.order.length"
            :formId="formId + index"
            :instanceId="formId + index"
            :formDesc="driverFormData.formDesc"
            :order="driverFormData.order"
            :formData="item"
            v-bind="formBindProps"
            ref="driverFormData"
            :readonly="formType === 'readonly'"
            :disabled="formType === 'readonly'"
            >
            <form-skeleton v-if="isLoading" />
          </ele-form>
          <div class="add-person" @click="newPerson" v-if="(index + 1) == personDatas.length && formType === 'newReserve'">
            <van-icon name="plus" color="#374BAE"/> 添加随行人
          </div>
        </div>
      </template>
    </div>
    <div class="bottom-button" v-if="formType === 'newReserve' ">
      <!-- <van-button v-if="!showWJButton" type="primary" @click="newReserve">提交预约</van-button> -->
      <van-button type="primary" @click="openCodeDialog">提交预约</van-button>
    </div>
    <div class="fail-buttons" v-if="formType === 'fail'">
      <van-button @click="backToIndex">返回首页</van-button>
      <van-button type="primary" @click="retryNewReserve">重新填写</van-button>
    </div>
    <div class="success-buttons" v-if="formType === 'reserveSuccess'">
      <van-button @click="backToIndex">返回首页</van-button>
    </div>
    <van-dialog
      use-slot
      title="请扫码打开微警认证小程序"
      v-model="showCodeDialog"
      :confirm-button-text="'关闭'"
      @confirm="showCodeDialog = false"
    >
      <div class="dialog-content" :class="!showWJButton ? 'un-set-button' : ''" v-if="WJCodeUrl">
        <img :src="WJCodeUrl" alt="">
        <div class="info">
          识别图中二维码打开小程序微警认证，微警认证完成后，请返回到当前页面，等待预约申请通过
        </div>
        <div class="info" v-if="showWJButton">
          或者直接点击下方按钮启动微警认证
        </div>
        <!-- 打开小程序的标签，在JSSDK初始化完成的时候才会出现 -->
        <wx-open-launch-weapp
          v-if="showWJButton"
          id="launch-btn"
          username="gh_01160f1babe4"
          path="pages/thirdCheck/thirdCheck"
          :extra-data="certToken"
          class="launch-btn"
          style="display: block;"
        >
          <script type="text/wxtag-template">
            <style>.btn { padding: 10px 15px; width: 100%;background-color: #2a44a5; border: 1px solid #2a44a5;color:#fff; border-radius: 3px;font-size:16px; display: flex;justify-content: center;align-items: center;}</style>
            <button class="btn">启动微警认证</button>
          </script>
        </wx-open-launch-weapp>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { getForm } from '@/api/form-public.js'
import EleForm from "@/components/f-render/main/ele-form.vue"
import FormSkeleton from "@/components/f-render-core/form-skeleton"
import { newReserveRequest, queryCompanyList, getLoginCode, getWeiJingInfo } from '@/api/truckReserve.js'
import codeBlock from './codeBlock.vue'
import fail from './fail.vue'
import moment from 'moment'

import axios from "axios";
// 引入JSSDK
let jssdk = document.createElement("script");
jssdk.src = "https://res.wx.qq.com/open/js/jweixin-1.6.0.js";
document.head.appendChild(jssdk);

export default {
  name: 'reserve',
  components: {
    EleForm,
    FormSkeleton,
    codeBlock,
    fail
  },
  data() {
    return {
      formId: '',
      baseFormData: null,
      driverFormData: null,
      formBindProps: {
        labelWidth: '100px',//该项必须设置否则element-ui报错
        labelPosition: "top",//文字标签显示位置
        isShowSubmitBtn: false ,
        isShowSaveDraft: false,
        isShowBackBtn: false,
        isShowResetBtn: false,
        isShowCancelBtn: false,
      },
      isLoading: false,
      personDatas: [],
      baseData: {},
      formType: 'newReserve', // 三种表单状态 readonly 点击预约列表查看预约详情 reserveSuccess 完成提交通过后返回 newReserve 新增预约 fail 预约失败
      errorInfo: '',
      editabel: false,
      companyList: [], // 公司列表
      certToken: "",
      showWJButton: false,
      showCodeDialog: false,
      WJCodeUrl: '',
      validPass: false
    }
  },
  methods: {
    /**
     * 初始化表单数据
     */
    initForm() {
      return new Promise(async (resolve) => {
        this.isLoading = true
        let baseFormData = await getForm({id: '967815896525889536'})
        let driverFormData = await getForm({id: '967834206218936320'})
        let companyList = await queryCompanyList()
        this.companyList = companyList.filter(item => {
          return item.ztmc && item.szxxdz
        })
        baseFormData = baseFormData.formJson
        driverFormData = driverFormData.formJson
        if (this.$route.params && this.$route.params.appointmentData) {
          this.formType = 'readonly'
          this.editabel = true
        }
        baseFormData.formDesc.lyd.attrs = Object.assign({}, baseFormData.formDesc.lyd.attrs, {unNeedInputAddress: true, editabel: this.editabel})
        baseFormData.formDesc.jhddsj.attrs = Object.assign({}, baseFormData.formDesc.jhddsj.attrs, {'value-format': 'yyyy-MM-dd HH:mm:ss'})
        baseFormData.formDesc.jhlcsj.attrs = Object.assign({}, baseFormData.formDesc.jhlcsj.attrs, {'value-format': 'yyyy-MM-dd HH:mm:ss'})
        let companyOptions = this.companyList.map(item => {
          return {
            value: item.ztmc,
            text: item.ztmc
          }
        })
        baseFormData.formDesc.ztmc._options = baseFormData.formDesc.ztmc.options = companyOptions
        this.baseFormData = this.handleFormDesc(baseFormData)
        this.driverFormData = this.handleFormDesc(driverFormData)
        this.isLoading = false
        this.$nextTick(() => { // 如果跳转有数据则为查看详情
          let data = this.$route.params
          if (data.appointmentData) {
            let baseData = data.appointmentData
            let personDatas = data.personDatas
            baseData.lyd = {code: baseData.lyd.slice(baseData.lyd.indexOf('=') + 1, baseData.lyd.indexOf(' door='))}
            console.log(baseData, personDatas)
            for (let i = 0; i < personDatas.length; i++) {
              let item = personDatas[i]
              this.personDatas.push({})  // 先加载组件，延迟加入数据
              item.skmid = '/vform/file/download/' + item.skmid
              item.xcmjtid = '/vform/file/download/' + item.xcmjtid
              item.hsjtid = '/vform/file/download/' + item.hsjtid
            }
            setTimeout(() => {  // 延迟加入数据
              this.baseData = baseData
              this.personDatas = personDatas
            }, 100)
          } else {
            this.personDatas.push({})
          }
        })
        resolve()
      })
    },
    /**
     * 处理表单数据
     */
    handleFormDesc(formJson) {
      if (formJson.formDesc) {
        for (let i in formJson.formDesc) {
          let item = formJson.formDesc[i];
          if(item.valueFormatter){
            item.valueFormatter = eval(`(${item.valueFormatter})`)
          }
          // 特殊处理 统一将选择时间组件的天数固定 只保留时分秒 方便后端搜索
          if (item.type === 'time-picker') {
            item.valueFormatter = (value) => {
              return moment(`1997-01-01 ${moment(value).format('HH:mm:ss')}`).valueOf()
            }
          }
          if (item.type === 'radio') {
            item.options.forEach(v => {
              v.value = v.text
            })
          }
          if(item.vif){
            item.vif = eval(`(${item.vif})`)
            if (i === 'yjgyjzdd') {
              item.vif = (form) => {
                return form["sfznsgy"] === '是'
              }
            }
            if (i === 'ztmc') {
              item.vif = (form) => {
                return form["dfd"] === '公司'
              }
              item.options.forEach(v => {
                v.value = v.text
              })
              item._options.forEach(v => {
                v.value = v.text
              })
            }
          }
          if(item.disabled){
            item.disabled = eval(`(${item.disabled})`)
          }
          if(item.rules){
            item.rules.forEach(rule=>{
              if(rule.validator){
                rule.validator = eval(`(${rule.validator})`)
              }
            })
          }
        }
      }
      let formConfig = Object.assign({}, {
        formDesc: formJson.formDesc || {},
        order: formJson.order || []
      })
      return formConfig
    },
    // 当设备不是Android时 显示二维码让用户手动扫码打开微警小程序
    async openCodeDialog() {
      await this.formValidate()
      this.handleBeforeValidate({baseData: this.baseData, personDatas: this.personDatas})
      this.showCodeDialog = true
    },
    /**
     * 提交预约
     */
    async newReserve() {
      for (let i = 0; i < this.personDatas.length; i++) {
        let skmid = this.personDatas[i].skmid.slice(this.personDatas[i].skmid.indexOf('download/') + 9)
        let xcmjtid = this.personDatas[i].xcmjtid.slice(this.personDatas[i].xcmjtid.indexOf('download/') + 9)
        let hsjtid = this.personDatas[i].hsjtid.slice(this.personDatas[i].hsjtid.indexOf('download/') + 9)
        let rylb = '乘客'
        // 手动添加人员类别
        if (i === 0) {
          rylb = '司机'
        }
        this.$set(this.personDatas, i, Object.assign({}, this.personDatas[i], {skmid, xcmjtid, hsjtid, rylb}))
      }
      newReserveRequest({
        appointmentData: this.baseData,
        personDatas: this.personDatas
      }).then(res => {
        this.formType = 'reserveSuccess'
        this.baseData.id = res
      }).catch(err => {
        this.errorInfo = JSON.stringify(err)
        this.formType = 'fail'
      })
    },
    /**
     * 新增随行人员
     */
    newPerson() {
      this.personDatas.push({})
    },
    /**
     * 表单校验
     */
    formValidate() {
      return new Promise(async (resolve, reject) => {
        await this.$refs.baseFormData.validate()
        let forms = this.$refs.driverFormData
        for (let i = 0; i < forms.length; i++) {
          await forms[i].validate()
        }
        resolve()
      })
    },
    handleBeforeValidate(data) {
      //清除历史提交记录
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (/^form_[0-9]+$/.test(key)) {
          localStorage.removeItem(key)
        }
      })
      if (this.formId) {
        //保存上次提交记录
        localStorage.setItem(`form_${this.formId}`, JSON.stringify(data))
      }
    },
    goBack() {
      this.$router.push({name: 'searchPages', params: {id: this.formId}})
    },
    /**
     * 回到首页
     */
    backToIndex() {
      this.$router.push({name: 'driversReserve'})
    },
    /**
     * 重新填写
     */
    retryNewReserve() {
      his.formType === 'newReserve'
    },
    /**
     * 查看详情
     */
    checkReserve() {
      this.formType === 'readonly'
    },
    /**
     * 删除随行人
     */
    deletePerson(index) {
      this.personDatas.splice(index, 1)
    },
    /**
     * 微警二维码
     */
    async getWJCodeUrl(certToken) {
      this.WJCodeUrl = '/yqfk/api/wj/qrCodePic?cert_token=' + certToken
    },
    /**
     * 微警认证
     */
    async getWJPass() {
      // const originUrl = process.env.NODE_ENV === 'production' ? location.origin : 'http://dn.product.iot-cas.com:8081'
        //   获取微警的token
      // let res = await axios.get(
      //   "/yqfk/api/wj/loginQrCode"
      // );
      let res = await getLoginCode()
      console.log(res);
      let { accessToken, certToken } = res;
      this.certToken = JSON.stringify({ certToken:certToken }) ;
      // if (this.showWJButton) {
        try {
          // 获取微信的JSSDK配置参数
          let url = encodeURIComponent(location.origin + location.pathname);
          let sign = await axios.get("/yqfk/api/asrYy/signature?url=" + url, {
            headers: {
              Origin: location.origin,
            },
          });
          console.log(sign);
          //   初始化JSSDK
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
            appId: sign.data.data.appId, // 必填，公众号的唯一标识
            timestamp: sign.data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: sign.data.data.nonceStr, // 必填，生成签名的随机串
            signature: sign.data.data.signature, // 必填，签名
            jsApiList: [], // 必填，需要使用的JS接口列表
            openTagList: ["wx-open-launch-weapp"], // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
          });
        } catch (e) {
          alert(e);
        }
        let _this = this
        wx.error(function (err) {
          // _this.showWJButton = false
          // _this.getWJCodeUrl(certToken)
        })

        // var btn = document.getElementById("launch-btn");
        // btn.addEventListener("launch",async function(e) {
        // });
        // btn.addEventListener("error", function(e) {
        //   alert('error')
        //   alert(JSON.stringify(e));
        // });
      // } else {
        this.getWJCodeUrl(certToken)
      // }

      // 循环获取微警验证的结果
      let getPass = async () => {
        let url = `/yqfk/api/wj/getUserInfo?cert_token=${certToken}`;
        let pass = await axios.get(url, {
          // from: "pc",
          // accessToken: res.data.data.accessToken,
          // certToken: res.data.data.certToken,
        });
        if (pass.data.code === "1") {
          // alert(JSON.stringify(pass.data));
          let bool1,bool2 = true
          if (location.origin.indexOf('dn') > -1 || location.origin.indexOf('localhost') > -1) {
            bool1 = this.personDatas[0].sfzhm === pass.data.data.idNumber
            bool2 = this.personDatas[0].xm === pass.data.data.fullName
          } else {
            let idNumber = pass.data.data.idNumber
            let fullName = pass.data.data.fullName
            let sfzhm = this.personDatas[0].sfzhm
            let xm = this.personDatas[0].xm
            idNumber = idNumber.replace('**************', '.*')
            let reg1 = new RegExp(`^${idNumber}$`)
            bool1 = !!sfzhm.match(reg1)
            let reg2 = new RegExp(`.${fullName}$`)
            bool2 = !!xm.match(reg2)
          }
          if (bool1 && bool2) {
            this.newReserve()
            this.showCodeDialog = false
          } else {
            this.getWJPass()
            this.$notify({message: '微警认证失败，请确认司机身份证号码与姓名', type: 'warning', duration: 0})
          }
        } else {
          setTimeout(getPass, 3000);
        }
      };
      getPass();

    },
    /**
     * 匹配当前操作系统 是否为IOS 或者 Window
     */
    matchCurrentDevice() {
      this.showWJButton = !!navigator.userAgent.match(/micromessenger/i) && !!navigator.userAgent.match(/Android/i)
    }
  },  
  computed: {
    qrCodePath() {
      return window.location.origin + '/mportal/index.html#/driverReserveScanDetail/' + this.baseData.id
    }
  },
  async mounted() {
    this.matchCurrentDevice()
    this.formId = this.$route.params.id
    //赋值缓存的填写历史
    let baseData = {}
    let personDatas = []
    try {
      let data = JSON.parse(localStorage.getItem(`form_${this.formId}`)) || {}
      if (data.baseData) {
        baseData = data.baseData
        personDatas = data.personDatas
      }
    } catch (err) {
    }
    if (baseData.lyd) {
      this.editabel = true
    }
    await this.initForm()
    if (personDatas.length) {
      // 提前加载表单组件
      for (let i = 0; i < personDatas.length - 1; i++) {
        this.personDatas.push({})
      }
      this.$nextTick(() => {
        if (this.formId && this.formType === 'newReserve') {
          this.baseData = Object.assign({},this.baseData,baseData)
          this.personDatas = personDatas
        }
      })
    }
    this.getWJPass()
  },
  watch: {
    'baseData.ztmc': {
      handler(newVal) {
        let szxxdz = ''
        let res = this.companyList.find(item => {
          return item.ztmc === newVal
        })
        szxxdz = res.szxxdz
        this.baseData.dfdxxdz = szxxdz
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reserve {
  position: relative;
  height: calc(100% - 75px);
  padding-bottom: 75px;
}
.reserve.readonly {
  position: relative;
  height: 100%;
  padding-bottom: 0px;
}
.code-block, .fail-block {
  margin: 15px 15px 0px 15px;
  width: calc(100% - 30px);
  height: 366px;
  background-color: #fff;
  border-radius: 5px;
}
.fail-block { 
  height: 250px;
}
.form-list {
  height: calc(100vh - 80px - 56px);
  margin-bottom: 5px;
  overflow: auto;
}
.form-list.readonly {
  height: calc(100vh - 56px);
  margin-bottom: 0px;
}
.form-block {
  margin: 15px 15px 0 15px;
  padding: 0 15px;
  background-color: #fff;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.05);
  border-radius: 5px;
  width: calc(100% - 60px);
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 25px;
    padding: 15px 0;
    box-shadow: 0px 1px 0px 0px rgba(235,235,235,1);
    display: flex;
    justify-content: space-between;
    .delete-btn {
      color: #f00;
    }
  }
  .add-person {
    color: #374BAE;
    text-align: center;
    line-height: 50px;
    box-shadow: 0px -1px 0px 0px rgba(235,235,235,1);
  }
}
.page-header {
  height: 56px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  .return {
    flex-shrink: 0;
    font-size: 14px;
    margin-left: 15px;
  }
  .title {
    flex: 1;
    color: #000;
    text-align: center;
    text-indent: -50px;
  }
}
.bottom-button, .fail-buttons, .success-buttons {
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% - 30px);
  height: 45px;
  padding: 15px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    width: 100%;
  }
}
::v-deep .launch-btn {
  width: 100%;
}
.fail-buttons, .success-buttons {
  display: flex;
  justify-content: space-around;
  bottom: 30%;
  background-color: #F7F7F7;
  button {
    flex: 1;
    margin-right: 10px;
  }
}
.dialog-content {
  width: calc(100% - 30px);
  padding: 0 15px;
  height: 400px;
  position: relative;
  img {
    width: 200px;
    height: 200px;
    margin: 20px auto;
    display: block;
  }
  .info {
    margin-bottom: 10px;
    width: 100%;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
}
.dialog-content.un-set-button {
  height: 300px;
}
::v-deep .el-radio__input.is-checked+.el-radio__label {
  color: #2A44A5;
}
::v-deep .el-radio__input.is-checked .el-radio__inner {
    border-color: #2A44A5;
    background: #2A44A5;
}
::v-deep .ele-upload-image {
  height: 80px !important;
}
::v-deep .el-upload, ::v-deep .el-image {
  height: 80px !important;
  width: 80px !important;
  div {
    height: 80px !important;
    width: 80px !important;
    line-height: 80px !important;
  }
}
::v-deep .el-input.is-disabled input{
  color: #5f5e5e;
}
::v-deep .el-textarea.is-disabled textarea{
  color: #5f5e5e;
}
::v-deep .el-radio__input.is-disabled+span.el-radio__label {
  color: #5f5e5e;
}
</style>