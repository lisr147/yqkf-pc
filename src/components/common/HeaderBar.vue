<template>
  <el-header height="50px" style="font-weight: 400;
color: #C6E2FF;line-height:50px;text-align:center;">

    <div class="header-lg">
      <div class="logo" href="/"><img alt="" src="@/assets/logo.png"></div>
    </div>

    <div class="header-fr">
      <ul>
        <li>
          <a href="javascript:;" @click="gotoHelpDocument" class="header-icon-a">
            <span class="user-tip">帮助文档</span>
            <i class="iconfont icon-icon-test"></i>
          </a>
        </li>
        <!-- <li>
          <a @click="fullScreen" title="全屏"><img style="vertical-align: middle" src="@/assets/image/ico-full.svg"/></a>
        </li> -->
        <!-- <li>
          <a href="/portal/index.do" title='回到综合门户' target="_self"><img style="vertical-align: middle" src="@/assets/image/ico-index.svg"/></a>
        </li> -->
         <li>
          <a href="javascript:;" @click="openPasswordDialog" class="header-icon-a">
            <span class="user-tip">修改密码</span>
            <i class="iconfont icon-icon-test"></i>
          </a>
        </li>
        <li><a @click="logout" title="登出"><span class="user-tip">{{ userInfo.fullName || userInfo.username }}</span> <i
              class="iconfont logout"></i></a></li>
      </ul>
    </div>
    <div class="header-sh">
      <!--<el-input placeholder="全网搜索" size="mini" v-model="globalKeyword" @change="search">-->
      <!--<el-button slot="append" icon="el-icon-search" @click="search"></el-button>-->
      <!--</el-input>-->
    </div>

    技术支持 : 中科智城
    <reset-password ref="pwdBox"/>
  </el-header>

</template>

<script>
import { removeToken } from '@/utils/auth'
import { setFullScreen } from '@/utils/global.js'
import ResetPassword from '@/components/password/ResetPassword'

export default {
  name: 'HeaderBar',
  components: {
    ResetPassword
  },
  data() {
    return {
      systemName: '疫情防控'
    }
  },

  mounted() {
    // var t = this
    // document.addEventListener('keyup', function(e){
    //   const key = e.keyCode || e.which
    // })
  },
  computed: {
    userInfo() {
      return this.$store.state.user
    },
    isFullScreen() {
      return this.$store.state.common.isFullScreen
    }
  },
  methods: {
    // 退出
    logout() {
      removeToken()
      document.location.href = document.location.origin + '/yqfk/tenant_logout#url='+encodeURIComponent(document.location.href)
    },
    fullScreen() {
      this.$store.commit('common/SET_IS_FULLSCREEN', true)
      setFullScreen()
    },
    gotoHelpDocument() {
      window.open(`./help-document.html`)
    },
    openPasswordDialog() {
        this.$refs.pwdBox.pwdPanelVisible = true;
    }
  }
}
</script>
