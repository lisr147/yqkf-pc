<template>
  <div class="el-main-path" >
  <el-breadcrumb separator="/" >
    <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
      <span v-if=" item.redirect == 'noRedirect' || index == levelList.length -1">{{item.meta.title}}</span>
      <router-link v-else :to="item.path">{{item.meta.title}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route (route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb () {
      // 将有meta的项过滤出来
      this.levelList = this.$route.matched.filter((item) => {
        return item.meta && item.meta.title
      })
    }
  }
}
</script>

<style lang="scss"  rel="stylesheet/scss">

  .el-breadcrumb__inner{
    color: #808286;
    .router-link-active {
      font-weight: normal;
      color:#333;
    }
  }
</style>
