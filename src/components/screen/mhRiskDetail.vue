<template>
  <div>
    <div class="mh-risk-detail iscroll">
      <div class="type-bar" v-if="!data.onlyTable">
        <div class="type-list">
          <div class="type-button" :active="index === 0" @click="index = 0">
            总表
          </div>
          <div class="type-button" :active="index === 1" @click="index = 1">
            当天清零表
          </div>
        </div>
        <el-input
          placeholder="请输入关键词搜索"
          class="key-word"
          suffix-icon="el-icon-search"
          v-model="keyword"
          clearable
          @blur="getData"
          @keyup.enter.native="getData"
        />
      </div>

      <div class="total-bar" v-if="totalData">
        <div
          class="item"
          v-for="item in totalData.filter(
            (v) => !['更新时间', '数据来源'].includes(v.name)
          )"
          :key="item.name"
        >
          <div class="key">{{ item.name }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
      <table-page
        :data="tableListData"
        :filter="filter"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        ref="table"
        id="mhRiskDetail"
        :hideSearch="true"
        customClass="staff_table"
      >
      </table-page>

    </div>
    <div class="update-time">更新时间：{{ updateTime }}</div>
  </div>
</template>

<script>
import { getRiskAreasList, getRiskAreasMsgPc } from "@/api/bigCharts";
import TablePage from "zkzc-table-page";
import TablePageJs from "@/utils/tablepage.js";

import getTableKeys from "@/views/dataManage/getTableKeys.js";
export default {
  components: { TablePage },
  name: "mhRiskDetail",
  props: ["data"],
  mixins: [TablePageJs, getTableKeys],
  data() {
    return {
      index: null,
      list: [[], []],

      filter: {
        pageSize: 10, // 每页条数
        page: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100, 500, 1000],
      },
      keyword: "",
      tableListData: {
        tableKeys: [],
        tableData: [],
      },

      dataDict: {}
    };
  },
  computed: {
    updateTime() {
      let type = this.index == 0 ? "zongbiao" : "dangri"

      if (!this.dataDict[type]) {
        return ''
      } else {
        return this.dataDict[type].filter((v) => v.name === "更新时间")[0].value
      }
    },
    totalData() {
      return this.dataDict[this.index == 0 ? "zongbiao" : "dangri"];
    },
  },
  watch: {
    index() {
      this.keyword = "";
      this.getData()
    },
  },

  async mounted() {
    console.log("RISK DATA", this.data);

    this.index = this.data.index;

    // 统计修改成请求接口获取
    let res = await getRiskAreasMsgPc({
      sszj: this.data.street,
    });
    console.log("getRiskAreasMsgPc", res);
    this.dataDict = res;

  },
  methods: {
    async getData() {
      let template = this.index === 0 ? 10058 : 10059;

      let condition = {
        key: this.keyword
      };
      if (this.data.street) {
        condition.sszj = this.data.street;
      }
      let res = await getRiskAreasList(template, Object.assign(this.filter, {condition}));
      // this.tableListData.tableData = res
      await this.getTableKeys([], template, false);
      let key = Array.from(this.tableListData.tableKeys);
      key = key.filter(
        (v) =>
          !["updateTime", "createTime", "creatorName", "tjsj"].includes(v.id)
      );
      this.tableListData.tableKeys = key;
      this.tableListData.tableData = res.data;
      this.filter.page = res.page;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.total;
    },

    sizeChange(val) {
      this.filter.pageSize = val
      this.filter.page = 1
      this.getData()
    },
    currentChange(val) {
      this.filter.page = val
      this.getData()
    },
    /**
     *@Description:查询重置
     */
    resetSearch () {
      let page = this.filter.page
      let pageSize = this.filter.pageSize
      let rowTotal = this.filter.rowTotal
      this.filter = this.$options.data().filter
      this.filter.page = page
      this.filter.pageSize = pageSize
      this.filter.rowTotal = rowTotal
      this.getData()
    }
  },
};
</script>
<style lang="scss" scoped>
.time {
  color: #1ee7e7;
  font-size: 14px;
  margin-left: 20px;
}
.mh-title {
  color: #fff;
  font-size: 16px;
  padding: 20px 0;
  padding-left: 10px;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 14px;
    width: 3px;
    background: #0064ab;
  }
}
.mh-table {
  margin-bottom: 20px;
  .mh-data {
    display: flex;
    flex-wrap: wrap;
    color: #fff;

    .mh-data-cell,
    .group,
    .group-cell {
      box-sizing: border-box;
      width: 30%;
      padding: 2%;
      background-color: rgba(19, 42, 101, 0.5);
      margin-bottom: 1%;
      margin-right: 1%;

      .title {
        font-size: 14px;
        font-weight: 600;
        margin: 2% 0px;
      }
      .value {
        font-size: 18px;
        color: #ffff00;
      }
    }
    .group {
      width: 92%;
      display: flex;
      flex-wrap: wrap;
      // padding-left: ;
      .group-title {
        width: 100%;
        padding: 1% 0px;
        color: #1ee7e7;
        // border: 1px solid #f0f;
      }
    }
  }
}
</style>
<style lang="scss">
$borderColor: #364f9a;
$backColor: rgba(19, 42, 101, 1);
$yellowColor: #ffff00;
.mh-risk-detail {
  height: 70vh;
  overflow-y: auto;
  // padding-right: 10px;
  .mh-table .el-table th {
    background: $backColor;
    color: #fff;
  }
  .el-table .cell,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell {
    padding: 0 2px;
  }
  .el-table th,
  .el-table tr {
    color: #fff;
    background: $backColor;
    border-color: $borderColor;
  }
  .el-table td {
    border-color: $borderColor;
  }
  .el-table tr {
    color: $yellowColor;
  }
  .el-table .cell {
    padding: 0 2px;
  }
  .mh-table .el-table th .cell {
    color: #fff;
    background: $backColor;
  }
  .el-table--border,
  .el-table--group {
    border-color: $borderColor;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    color: $yellowColor;
    background: $backColor;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: $borderColor;
  }
  .is-scrolling-left {
  }
}
</style>
<style lang="scss" scoped>
.type-bar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: #fff;
  border-bottom: 1px solid rgba($color: #3462f0, $alpha: 0.5);
  .type-list {
    display: flex;
    .type-button {
      font-size: 18px;
      margin-right: 40px;
      position: relative;
      height: 100%;
      cursor: pointer;
      &[active] {
        color: #4c99ff;
        &::after {
          content: " ";
          height: 5px;
          background-color: #4c99ff;
          position: absolute;
          bottom: 0px;
          left: 0px;
          right: 0px;
        }
      }
    }
  }
  .key-word {
    width: 200px;
    margin-bottom: 9px;
    ::v-deep .el-input__inner {
      background-color: rgba($color: #fff, $alpha: 0.1);
      border-color: #787878;
      color: #fff;
    }
  }
}
// 数据总览
.total-bar {
  display: flex;
  padding: 21px 0px;
  .item {
    padding: 8px 13px;
    background: linear-gradient(
      90deg,
      rgba(244, 151, 77, 0.2) 0%,
      rgba(241, 153, 71, 0.03) 100%
    );
    margin-right: 16px;
    text-align: center;
    .key {
      font-size: 14px;
      color: #fff;
    }
    .value {
      font-size: 24px;
      color: #ff9900;
      line-height: 32px;
      font-family: Bebas;
    }
  }
}

.table {
  color: #fff;
  width: 100%;
  border: 1px solid #455384;
  border-collapse: collapse;
  text-align: center;
  th {
    padding: 18px 25px;
  }
  td {
    padding: 8px;
  }
}

.update-time {
  color: #4971ce;
}

.el-table, .el-table__expanded-cell{
  background: none;
}
</style>
