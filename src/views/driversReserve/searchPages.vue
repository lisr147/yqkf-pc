<template>
  <div class="search-pages">
    <div class="page-header">
      <div class="return" @click="goBack"><van-icon name="arrow-left" />返回</div>
      <div class="search-input">
        <van-search v-model="searchInput" placeholder="请输入您的身份证号码搜索" :maxlength="18"/>
      </div>
      <div class="cancel">取消</div>
    </div>
    <!-- 渐变颜色效果 -->
    <div class="transition-color"></div> 
    <div class="data-list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell class="list-card" v-for="(item, index) in listData" :key="`${item.id}_${index}`" @click="checkDetail(item)">
          <div class="name_id">{{item.xm + ' ' + item.sfzhm}}</div>
          <div class="reserve_time">计划到场时间: {{item.jhddsj}}</div>
          <div class="pass_status">计划离场时间: {{item.jhlcsj}}</div>
          <div class="visit">到访地: {{item.dfdxxdz}}</div>
          <div class="icon">
            <van-icon name="arrow" color="#C7C7CC"/>
          </div>
        </van-cell>
      </van-list>
    </div>
    <div class="bottom-button">
      <van-button type="primary" @click="newReverse">新增预约</van-button>
    </div>
  </div>
</template>

<script>
import { queryDataPage, queryDataDetail } from '@/api/truckReserve.js'
export default {
  name: 'searchPages',
  data() {
    return {
      searchInput: '',
      listData: [],
      loading: false,
      finished: false,
      page: 1,
    }
  },
  methods: {
    /**
     * 返回
     */
    goBack() {
      this.$router.go(-1)
    },
    /**
     * 加载数据
     */
    async onLoad() {
      this.loading = true
      this.finished = false
      if (!this.searchInput) {
        this.$notify({message: '请填写需要查询的身份证号码', type: 'warning'});
        this.finished = true
        return
      }
      let res = await queryDataPage({pageSize: 10, page: this.page, templateId: '10107', condition: {sfzhm: this.searchInput}})
      res.data.forEach(item => {
        this.listData.push(item)
      })
      this.loading = false
      if (this.listData.length >= res.total || this.page >= res.totalPage) {
        this.finished = true
      }
      this.page++
    },
    /**
     * 新增预约
     */
    newReverse() {
      this.$router.push({name: 'reserve', params: {id: this.searchInput}})
    },
    /**
     * 查看详情
     */
    async checkDetail(data) {
      let res = await queryDataDetail({yydid: data.id})
      this.$router.push({name: 'reserve', params: res})
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.id) {
        vm.searchInput = to.params.id
      }
    })
  },
  mounted() {
    this.searchInput = localStorage.getItem(`form_sfzhm`)
  },
  watch: {
    searchInput(newVal) {
      this.page = 1
      this.listData = []
      this.onLoad()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-pages {
  height: 100vh;
  overflow: hidden;
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
  }
  .search-input {
    width: 70%;
    flex-shrink: 0;
    .van-search {
      padding: 0;
    }
  }
  .cancel {
    flex-shrink: 0;
    color: #345EF0;
    font-size: 14px;
  }
}
.transition-color {
  width: 100%;
  height: 10px;
  background: linear-gradient(180deg, rgba(23, 24, 25, 0.03) 0%, rgba(23, 24, 25, 0.02) 53%, rgba(23, 24, 25, 0) 100%);
}
.data-list { 
  margin: 5px 15px 10px 15px;
  width: calc(100% - 30px);
  height: calc(100% - 160px);
  background-color: #fff;
  border-radius: 5px;
  overflow: auto;
}
.list-card {
  position: relative;
  .name_id {
    color: #0C1014;
    line-height: 22px;
    font-size: 16px;
    margin-bottom: 5px;
  }
  .reserve_time,
  .pass_status,
  .visit {
    font-size: 14px;
    color: #999999;
    line-height: 19px;
  }
  .icon {
    position: absolute;
    right: 15px;
    top: 0;
    bottom: 0;
    .van-icon {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 40%;
    }
  }
}
.bottom-button {
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% - 30px);
  height: 45px;
  padding: 15px;
  background-color: #fff;
  button {
    width: 100%;
  }
}
</style>