<template>
  <div class="special-people-detail-list">
    <div class="">
      <table-page
        :data="tableListData"
        :filter="filter"
        @search="search"
        @resetSearch="resetSearch"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        :hideKeyFilter="true"
        :customClass="'staff_table'"
        :height="400"
      >
        <template slot="searchFilter">
          <div class="search-box">
            <!-- <span class="tip">特殊人群</span> -->
            <el-form :inline="true" :model="filter" label-width="360px">
              <el-input
                style="width: 200px;margin: 0 20px"
                v-model="filter.keyWord"
                placeholder="请输入关键词搜索"
              ></el-input>
              <el-select v-model="filter.sex" placeholder="请选择性别">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form>
          </div>
        </template>
      </table-page>
    </div>
    <service-report-list
      :serviceReportListVisible.sync="serviceReportListVisible"
      @close="serviceReportListVisible = false"
      :reportList="reportList"
      darkScreen
    ></service-report-list>
  </div>
</template>

<script>
import TablePage from "zkzc-table-page";
import TablePageFunc from "@/utils/tablepage";
import { getSpecialPeopleList } from "@/api/mapData.js";
import { getServiceReport } from "@/api/alarm";
import ServiceReportList from "@/components/alarm/ServiceReportList";

export default {
  name: "SpecialPeopleDetailList",
  components: {
    TablePage,
    ServiceReportList,
  },
  props: {
    cond: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  mixins: [TablePageFunc],
  watch: {
    cond() {
      this.getData();
    },
  },
  data() {
    return {
      reportList: [],
      serviceReportListVisible: false,
      options: [
        { value: null, label: "不限" },
        { value: "1", label: "男" },
        { value: "2", label: "女" },
      ],
      filter: {
        pageNum: 1,
        pageSize: 15,
        rowTotal: 1,
        pageSizes: [15, 50, 100, 200],
      },
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: [
          {
            id: "name",
            label: "姓名",
            width: 50,
          },
          {
            id: "sex",
            label: "性别",
            width: 50,
          },
          {
            id: "age",
            label: "年龄",
            width: 50,
          },
          {
            id: "idcard",
            label: "身份证",
            width: 120,
          },
          {
            id: "phoneNumber",
            label: "联系方式",
          },
          {
            id: "peopleCategory",
            label: "人员类型",
            minWidth: 120,
          },
          {
            id: "belongVillage",
            label: "所属村居",
            width: 80,
          },
          {
            id: "noSelfRescueAbilityPersonnel",
            label: "有无自救能力",
            width: 60,
          },
          // {
          //   id: "dateSource",
          //   label: "数据来源",
          //   minWidth: 120,
          // },
        ],
        tableFunctions: [
          {
            label: "查看服务情况",
            method: this.getServiceDetails,
          },
        ],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      // console.log(122,this.cond);
      const { street, grid, peopleCategory } = this.cond;
      var res = await getSpecialPeopleList({
        condition: {
          belongTown: street,
          belongGrid: grid,
          peopleCategory,
          specialPeopleInfo: this.filter.keyWord,
          sex: this.filter.sex,
        },
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      });

      this.tableListData.tableData = res.data;
      this.filter.rowTotal = res.total;
    },
    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    async getServiceDetails({ row: { id } }) {
      await getServiceReport(id)
        .then((res) => {
          this.reportList = res.reverse();
          this.serviceReportListVisible = true;
        })
        .catch((e) => {
          this.$message.error("获取数据失败");
          console.log(e);
        });
    },
  },
};
</script>

<style lang="scss" type="text/scss">
.special-people-detail-list {
  .searchFilter {
    min-height: 40px;
    .search-box {
      .el-input--suffix {
        width: 150px;
      }
    }
  }
  ::v-deep .showMore-searchFilter {
    margin-top: 20px;
    padding-right: 10px;
    min-height: 40px;
  }
}
</style>
