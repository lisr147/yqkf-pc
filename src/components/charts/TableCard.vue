<template>
  <div
    class="c-block-statistics"
    :data-code="code"
    v-loading="isLoading"
    element-loading-text="加载数据中"
    element-loading-custom-class="loading-mask"
  >
    <div class="header">
      <h3 class="title">
        {{ title }}
      </h3>
    </div>
    <div class="search-bar">
      <el-input
        v-model="keyWord"
        placeholder="请输入名称搜索"
        clearable
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
    </div>
    <div class="chart-real-wrapper" style="min-height: 200px" >
      <div class="block-statistics-wrapper">
        <div v-if="cardList.length">
          <div class="card-wrapper">
            <count-card
              v-for="(item,index) in cardList"
              :key="index"
              :itemName="item.name"
              :num="item.value"
              :color="item.color"
              :column="item.column"
              :unit="item.unit"
              :isCanClick="isCanClick"
              @onCardClick="onCardClick"
            ></count-card>
          </div>
        </div>
        <div v-else class="null">{{ errMsg }}</div>
      </div>
    </div>
    <el-pagination
      v-if="cardList.length"
      @current-change="handleCurrentChange"
      small
      :current-page="page.pageNum"
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      layout="prev, pager, next, total"
      :total="page.rowTotal"
      background
      style="margin:0px 15px;"
    />
  </div>
</template>

<script>
import CountCard from "./CountCard";
import {
  getClubData,
  getGridData
} from "@/api/volunteer";

export default {
  name: "TableCard",
  props: {
    code: { type: [String, Number], required: true },
    title: { type: String, default: null },
    isCanClick: { type: Boolean, default: false }
  },
  components: {
    CountCard,
  },

  data () {
    return {
      keyWord: null,
      // 加载中
      isLoading: false,
      cardList: [],
      errMsg: "暂无数据",
      page: {
        pageNum: 1,
        // pageSizes: [6, 9, 12],
        pageSize: 9,
        rowTotal: 0
      },
    };
  },
  async mounted () {
    this.isLoading = true;
    await this.initData(this.code);
    this.isLoading = false;
  },
  methods: {
    async initData (code, val) {
      switch (code) {
        case 'dyzyzsqtj': //党员志愿者社区统计
          this.getClubData(1)
          break
        case 'dyzyzwgtj': //党员志愿者网格统计
          this.getGridData(1)
          break
        case 'fdyzyzsqtj': //非党员志愿者社区统计
          this.getClubData(2)
          break
        case 'fdyzyzwgtj': //非党员志愿者网格统计
          this.getGridData(2)
          break
      }
    },
    async getClubData (isDy) {
      let params = {
        condition: {
          isDy: isDy,
          key: this.keyWord
        },
        page: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      let res = await getClubData(params)
      res.dataList.map((v) => {
        v.column = 'col-3'
      })
      this.cardList = res.dataList
      this.page.rowTotal = res.count
    },
    async getGridData (isDy) {
      let params = {
        condition: {
          isDy: isDy,
          key: this.keyWord
        },
        page: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      let res = await getGridData(params)
      res.dataList.map((v) => {
        v.column = 'col-3'
      })
      this.cardList = res.dataList
      this.page.rowTotal = res.count
    },
    handleCurrentChange (v) {
      this.page.pageNum = v
      this.initData(this.code)
    },
    handleSearch () {
      this.page = this.$options.data().page
      this.initData(this.code)
    },
    onCardClick (item) {
      this.$emit('onCardItemClick', item)
    }
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.c-block-statistics {
  margin: 3px 0;
  overflow: hidden;
  background-color: #102460;
  padding-bottom: 0;

  .search-bar {
    position: absolute;
    right: 0px;
    width: 200px;
    top: 5px;
  }

  .el-icon-question {
    color: #fff;
  }

  .el-popover__reference-wrapper {
    color: #fff;
  }

  .card-wrapper {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin: 3px 0;
    padding-left: 10px;

    .card {
      //cursor: pointer;
      width: 40%;
      color: #fff;
      padding: 10px;
      text-align: center;
      margin: 5px;
      display: flex;
      align-items: center;
      flex-direction: column;
      position: relative;
      background: linear-gradient(90deg, rgba(244, 151, 77, 0.2) 0%, rgba(241, 153, 71, 0.03) 100%);

      .t1 {
        font-size: 12px;
        color: #fff;
        margin: 2px auto;
        text-align: center;
      }

      .t2 {
        font-weight: 600;
        font-size: 24px;
        font-family: Bebas;
        color: #F4974E;
      }

      .icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .header {
    box-sizing: border-box;
    background: url(../../assets/image/bigCharts/title-bg1.png);
    width: 398px;
    height: 46px;
    background-size: 100%;
    margin: -1px;
    position: relative;

    .title {
      display: inline-block;
      margin-left: 16px;
      margin-top: 8px;
      padding: 0 0.5em;
      font-size: 16px;
      line-height: 1.1em;
      font-weight: normal;
      color: #95dafa;
    }

    .link {
      cursor: pointer;
      color: #fff;
      right: 60px;
      top: 0px;
      position: absolute;
    }
  }

  .footer {
    box-sizing: border-box;
    text-align: left;
    vertical-align: top;
    font-size: 12px;
    color: #6686e6;
    margin: 4px 20px 0;
    padding: 5px 10px;
    background-image: linear-gradient(to right, #18347c, #102460);
    word-wrap: break-word;

    .footer-m {
      display: inline-block;
      word-wrap: break-word;
    }

    span {
      display: inline-block;
      margin-right: 4px;
    }
  }

  .null {
    color: #fff;
    height: 180px;
    text-align: center;
    line-height: 180px;
  }

  ::v-deep.el-pagination__total {
    color: #fff;
  }

  ::v-deep.el-pagination {
    padding: 2px 5px;
  }
}
</style>
