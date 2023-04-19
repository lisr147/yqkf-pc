<!-- 关联场所明细 -->
<template>
  <div>
    <el-dialog
      destroy-on-close
      append-to-body
      class="screen-dialog screen-wrap c-seal-area-dialog"
      :visible="true"
      width="1400px"
      :title="title"
      @close="$parent.isCorrelatePlaceVisible = false"
    >
      <table-page
        :data="tableListData"
        :filter="filter"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @search="search"
        @resetSearch="resetSearch"
        customClass="table__dark three-group-table"
      >
        <template slot="searchFilter">
          <div class="search-box">
            <el-form :inline="true" :model="filter">
              <el-form-item label="场所名称" style="margin-right: 60px">
                <el-input
                  v-model="filter.site"
                  placeholder="请输入场所名称"
                  style="width: 180px"
                ></el-input>
              </el-form-item>
              <el-form-item label="关联病例">
                <el-input
                  v-model="filter.relateName"
                  placeholder="请输入关联病例"
                  style="width: 180px"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </table-page>
    </el-dialog>
  </div>
</template>
<script>
import TablePage from "zkzc-table-page";
import {queryCorrelateSite} from '@/api/sealarea2'
import { mapState } from "vuex";

export default {
  name: "CorrelatePlace",
  components: { TablePage },
  props: ["title"],
  data() {
    return {
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        site:'',
        relateName:''
      },
      tableListData: {
        selection: false,
        columnFunctionsWidth: 60, // 操作栏宽度
        tableData: [],
        tableKeys: [
          {
            id: "related_key_site",
            label: "场所名称"
          },
          {
            id: "related_cases",
            label: "关联病例"
          },
          {
            id: "contact_last_Date",
            label: "最后接触日期"
          }
        ],
        tableFunctions: [],
      },
    };
  },
  computed: {
    ...mapState("common", ["dispatchData"]),
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const name = this.dispatchData.map((v) => v.name);
      const { site,relateName, pageSize, pageNum } = this.filter;
      const params = {
        pageSize,
        page: pageNum,
        condition: {
          site,
          relateName,
          name
        },
      };
      const res = await queryCorrelateSite(params);
      this.$set(this.tableListData, "tableData", res.dataList);
      this.filter.rowTotal = res.count;
      this.filter.pageSize = res.pageSize;
      this.filter.pageNum = res.pageNumber;
    },
    sizeChange(val) {
      this.filter.pageSize = val;
      this.filter.pageNum = 1;
      this.getData();
    },
    currentChange(val) {
      this.filter.pageNum = val;
      this.getData();
    },
    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    resetSearch() {
      this.filter = this.$options.data().filter;
      this.getData();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
  