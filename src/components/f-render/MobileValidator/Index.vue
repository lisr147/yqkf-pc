<template>
  <div :class="desc.class" :style="desc.style" v-on="desc.on">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12">
        <div>
          <el-input
            placeholder="请填写手机号码"
            prefix-icon="el-icon-mobile-phone"
            v-model="phone"
            @change="phoneChange"
            :disabled="readonly || disabled"
          ></el-input>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" class="warp">
        <el-input
          placeholder="验证码"
          v-model="code"
          @keyup.native="codeChange"
          type="tel"
          maxlength="6"
          prefix-icon="el-icon-unlock"
          :disabled="readonly || disabled"
        >
          <el-button slot="append" size="small" v-if="isLoading"
            >请求中...</el-button
          >
          <el-button
            slot="append"
            size="small"
            v-else
            @click="handleGetCode"
            :disabled="phone.length !== 11 || readonly || disabled"
            >获取验证码</el-button
          >
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import formMixin from "vue-ele-form/lib/mixins/formMixin";
import { getSmsCode, verifySmsCode } from "@/api/fRander.js";

export default {
  name: "mobile-validator", // name 属性必须填写, 在使用时, 需要和这里定义的 name 一致
  mixins: [formMixin], // 必须引入mixin
  props: {
    // value 是传递过来的值
    value: Object,
    // desc是此组件的描述, 结构为
    // { style: {}, class: {}, on: {}, attrs: {} }
    desc: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      phone: "", //手机号码
      code: "", //验证码
      isLoading: false,
      isValid: false, //是否验证正确
    };
  },
  // 加载数据
  watch: {
    value: {
      handler(value, oldValue) {
        console.log(value, oldValue);
        if (value && !oldValue) {
          this.phone = this.value.phone;
          this.emitValue()
        }
      },
      deep: true,
    },
  },
  methods: {
    async handleGetCode() {
      console.log(this.desc);
      //发送验证码
      this.isLoading = true;
      await getSmsCode({ formKey: this.desc.formKey, phone: this.phone });

      this.$message({
        type: "success",
        message: "已发送验证码",
      });
      this.isLoading = false;
    },
    phoneChange() {
      this.code = "";
      this.isValid = false;
      this.emitValue();
    },
    codeChange(evt) {
      if(this.phone.length === 11 && this.code.length===6){
      this.emitValue();
      this.verifySmsCode();}
    },
    verifySmsCode() {
      if (!this.code) {
        return;
      }

      verifySmsCode({ phone: this.phone, code: this.code })
        .then((res) => {
          this.isValid = true;
        })
        .catch((e) => {
          this.isValid = false;
        });
      return;
    },
    emitValue() {
      this.$emit("input", {
        phone: this.phone,
        code: this.code,
        verify: this.verify,
      });
    },
    async verify(callback) {
      if (this.phone) {
        if (this.phone.length !== 11) {
          callback(new Error("手机号码不正确"));
          return;
        }
        if (!this.isValid) {
          if (!this.code) {
            callback(new Error("请输入验证码"));
            return;
          }
          verifySmsCode({ phone: this.phone, code: this.code })
            .then((res) => {
              this.isValid = true;
              callback();
            })
            .catch((e) => {
              this.isValid = false;
              callback(new Error("手机号码验证码不正确"));
            });
          return;
        }
      }
      callback();
    },
  },
};
</script>
<style type="text/scss" scoped>
.el-alert {
  margin-top: 0.5em;
}

@media only screen and (max-width: 768px) {
  .el-col-xs-24 + .el-col-xs-24 {
    margin-top: 10px;
  }
}
</style>
