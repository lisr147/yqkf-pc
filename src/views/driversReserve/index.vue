<template>
  <div class="drivers-book">
    <div class="root-page">
      <div class="banner">
        <img src="static/images/banner.png" alt="">
      </div>
      <div class="search">
        <div class="title">
          司机自查登记/报备情况
        </div>
        <div class="search-input">
          <van-search v-model="searchInput" placeholder="请输入您的身份证号码搜索" :maxlength="18" />
        </div>
        <div class="buttons">
          <van-button type="primary" @click="searchRoute">自查</van-button>
          <van-button type="default" @click="newReverse">新增预约</van-button>
        </div>
        <div class="info">
          2022 © 南沙区政务服务数据管理局 版权所有
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'driversBook',
  data() {
    return {
      searchInput: ''
    }
  },
  methods: {
    /**
     * 自查跳转
     */
    searchRoute() {
      //保存上次提交记录
      localStorage.setItem(`form_sfzhm`, this.searchInput)
      this.$router.push({name: 'searchPages', params: { id: this.searchInput }})
    },
    /**
     * 新增预约
     */
    newReverse() {
      //保存上次提交记录
      localStorage.setItem(`form_sfzhm`, this.searchInput)
      this.$router.push({name: 'reserve', params: {id: this.searchInput}})
    }
  },
  mounted() {
    this.searchInput = localStorage.getItem(`form_sfzhm`)
  }
}
</script>

<style lang="scss" scoped>
.drivers-book {
  width: 100vw;
  height: 100vh;
  .root-page {
    width: 100%;
    height: 100%;
  }
  .banner {
    width: 100%;
    img {
      width: 100%;
      height: auto;
    }
  }
  .search {
    position: absolute;
    top: 0;
    bottom: 18px;
    width: calc(100% - 60px);
    margin: 40% 15px 0 15px;
    padding: 0 15px;
    background-color: #fff;
    border-radius: 10px;
    .title {
      font-weight: 500;
      color: #333333;
      font-size: 18px;
      width: 100%;
      line-height: 55px;
      text-align: center;
      margin-bottom: 15px;
      box-shadow: 0px 1px 0px 0px rgba(235,235,235,1);
    }
    .search-input {
      width: 100%;
      height: 50px;
      .van-search {
        padding: 0;
        height: 100%;
        .van-search__content, .van-cell__value {
          height: 100%;
        }
        ::v-deep .van-field__left-icon{
          height: 100%;
          display: flex;
          align-items: center;
        }
        ::v-deep .van-field__body {
          height: 100%;
          font-size: 18px;
        }
      }
    }
    .buttons {
      margin-top: 40px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      & > button {
        width: 100%;
      }
      button:first-child {
        margin-bottom: 15px;
      }
    }
    .info {
      margin-top: 40px;
      color: #C3C5CD;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>