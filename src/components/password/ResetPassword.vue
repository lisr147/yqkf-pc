<template>
  <div class="my-account-wrapper">
      <!--修改密码-->
      <el-dialog title="修改密码" :visible.sync="pwdPanelVisible" :append-to-body="true" :close-on-click-modal="false"
        @close="resetPwdForm" width="450px">
        <el-form :model="pwdForm" ref="pwdForm" :rules="userRule">
          <el-form-item label="当前密码" :label-width="formLabelWidth" required>
            <el-input show-password v-model.trim="pwdForm.password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
            <el-input show-password v-model.trim="pwdForm.newPassword" :placeholder="userRule.newPassword[0].message">
            </el-input>
          </el-form-item>
          <el-form-item label="密码强度" :label-width="formLabelWidth">
            <div class="pwd-indicator" :class="[passwordLevel]">
              <ul>
                <li></li>
                <li></li>
                <li></li>
              </ul>
              <el-tooltip effect="dark" placement="bottom">
                <div slot="content">
                  强度高：至少8字符，至少1数字，至少1字母,至少1特殊字符<br />
                  强度中：至少8字符，至少1数字字符，至少1小写字母<br />
                  强度低：至少8字符<br />
                  特殊字符包括：@$!%*#?/<>&
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
              <span>{{ descDict.password[passwordLevel] }}</span>
            </div>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPassword">
            <el-input show-password v-model.trim="pwdForm.confirmPassword"
              :placeholder="userRule.confirmPassword[0].message"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="pwdPanelVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSaveChangePws">保存</el-button>
        </div>
      </el-dialog>

    </div>
</template>
<script>
import { updatePassword } from '@/api/account'
// import HeaderBar from '@/components/common/HeaderBar'
import { mapActions, mapState } from 'vuex';
import { removeToken } from '@/utils/auth'
const Reg = {
  password: /^[A-Za-z\d@$!%*#?\\/<>&]+$/
}
export default {
  name: 'reset-password',
  components: {
    // HeaderBar
  },
  data() {
    let validConfirmPwd = (rule, value, callback) => {
      if (value !== this.pwdForm.newPassword) {
        callback(new Error('与新密码不一致'))
      } else {
        callback()
      }
    }

    let validPassword = (rule, value, callback) => {
      if (!Reg.password.test(value)) {
        callback(new Error('存在非法字符'))
      } else {
        callback()
      }
    }

    return {
      // 用户信息
      userInfo: {},
      // 是否显示修密码弹窗
      pwdPanelVisible: false,
      // 修改密码表单
      pwdForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },

      formLabelWidth: '90px',
      descDict: {
        password: { high: '高', ok: '中', low: '低' }
      },

      // 用户信息校验规则
      userRule: {
        newPassword: [
          { required: true, message: '请输入长度为8-20的字符', trigger: 'blur' },
          { min: 8, max: 20, message: '请输入长度为8-20的字符', trigger: 'blur' },
          { validator: validPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认新密码', trigger: 'blur' },
          { validator: validConfirmPwd, trigger: 'blur' }
        ],
        verifCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', ['username']),
    // ...mapState('common', ['isFullScreen']),
    passwordLevel() {
      let value = this.pwdForm.newPassword
      if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?\\/<>&])[A-Za-z\d@$!%*#?\\/<>&]{8,20}$/.test(value)) {
        return 'high'
      } else if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?\\/<>&]{8,20}$/.test(value)) {
        return 'ok'
      } else if (/^.{8,20}$/.test(value)) {
        return 'low'
      }
      return value;
    }
  },
  async mounted() {
    await this.getUserInfo();
  },
  methods: {
    ...mapActions('user', ['getInfo', 'setFullName']),
    async getUserInfo() {
      if (!this.username) {
        await this.getInfo();
      }
      this.userInfo = this.$store.state.user;
    },
    // 修改密码
    handleChangePws() {
      this.pwdPanelVisible = true
    },
    handleSaveChangePws() {
      this.$refs['pwdForm'].validate(valid => {
        // 表单校验失败则退出
        if (valid === false) {
          return false
        }
        updatePassword({
          userId: this.userInfo.id,
          oldPassword: this.pwdForm.password,
          newPassword: this.pwdForm.newPassword
        }).then(() => {
          this.$message({
            message: '修改密码成功,请重新登录~',
            type: 'success'
          })
          this.pwdPanelVisible = false
          // 重新登陆
          removeToken()
          document.location.href = document.location.origin + '/yqfk/tenant_logout'
        })
      })
    },
    // 重置密码表单
    resetPwdForm() {
      this.pwdForm.password = ''
      this.pwdForm.newPassword = ''
      this.pwdForm.confirmPassword = ''
      this.$refs['pwdForm'].clearValidate()
    },
  }
}
</script>

<style  lang="scss"  rel="stylesheet/scss"  scoped>
.pwd-indicator {
  ul {
    display: inline-block;
    width: 80%;
  }

  li {
    display: inline-block;
    margin-right: 3px;
    width: 32%;
    height: 9px;
    border-radius: 2px;
    line-height: 0;
    background-color: #d0d0d0;
  }

  .el-tooltip {
    margin: 0 4px;
    color: #929090;
  }

  span {}

  &.low {
    li:nth-child(1) {
      background-color: #f6764a;
    }
  }

  &.ok {

    li:nth-child(1),
    li:nth-child(2) {
      background-color: #d8d022;
    }
  }

  &.high {
    li {
      background-color: #88d403;
    }
  }
}
</style>
