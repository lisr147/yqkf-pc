<!-- 扫码记录明细 -->
<template>
  <div>
    <el-dialog
      destroy-on-close
      append-to-body
      class="screen-dialog screen-wrap c-seal-area-dialog"
      :visible="true"
      width="1400px"
      title="扫码记录详情"
      @close="$parent.scanRecordDetail = null"
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
              <el-form-item label="关联人员">
                <el-input
                  v-model="filter.glry"
                  placeholder="请输入关联人员"
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
import { queryScanRecordDetail } from "@/api/sealarea2";

export default {
  name: "ScanRecord",
  components: { TablePage },
  props: {
    scanRecordDetail: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        glry: "",
      },
      tableListData: {
        selection: false,
        columnFunctionsWidth: 60, // 操作栏宽度
        tableData: [],
        tableKeys: [
          {
            id: "csmc",
            label: "场所名称",
          },
          {
            id: "csdz",
            label: "场所地址",
          },
          {
            id: "glsj",
            label: "关联事件",
          },
          {
            id: "glry",
            label: "关联人员",
          },
        ],
        tableFunctions: [],
      },
    };
  },
  computed: {},
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const { glry, pageSize, pageNum } = this.filter;
      const { lngLat, glsjId } = this.scanRecordDetail;
      const params = {
        pageSize,
        page: pageNum,
        condition: {
          glry,
          lngLat,
          glsjId
        },
      };
      const res = await queryScanRecordDetail(params);
      this.$set(this.tableListData, "tableData", res.data);
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
    