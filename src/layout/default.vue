<template>
  <el-container direction="vertical">

    <HeaderBar v-show="!isFullScreen"></HeaderBar>

    <el-container>

      <el-aside :width="isCollapse? '60px': '200px'" class="sidebar-container iscroll" v-show="!isFullScreen">

        <div class="toggle" @click="toggleSide()">
          <i class="iconfont menu"></i>
        </div>

        <nav-menu :isCollapse="isCollapse"/>

      </el-aside>

      <el-main class="iscroll" :class="{'fixed': isFixed}">

        <Breadcrumb/>

        <transition name="fade-transform" mode="out-in">
          <router-view :key="$route.name"/>
        </transition>
      </el-main>

    </el-container>

  </el-container>
</template>

<script>
import HeaderBar from  '@/components/common/HeaderBar'
import Breadcrumb from '@/components/common/Breadcrumb'
import NavMenu from    '@/components/common/NavMenu'

export default {
  name: 'Layout',
  components: {
    NavMenu,
    HeaderBar,
    Breadcrumb
  },
  data() {
    return {
      // 是否折叠导航区域
      isCollapse: false,
      // 面包屑
      currentBread: [],
    }
  },
  created() {
    this.isCollapse = this.$store.state.common.isMobile;
  },
  computed: {
    isFixed() {
      return this.$route.path == '/form/detail'
    },
    isFullScreen(){
      return this.$store.state.common.isFullScreen
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    toggleSide() {
      this.isCollapse = !this.isCollapse
    }
  }
}

</script>

<style lang="scss"  rel="stylesheet/scss">
  .sidebar-container{
    transition: width .4s ease-in-out;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.28s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all .5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateY(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

</style>
