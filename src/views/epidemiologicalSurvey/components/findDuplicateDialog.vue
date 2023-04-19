<template>
  <el-dialog
    title="提示:系统检测到有重复流调人员，请确认选择以下哪条记录作为最终流调记录"
    width="968px"
    :visible.sync="findDuplicateDialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <table-page
      :filter="findDuplicateTableFilter"
      :tableConfig="findDuplicateTableConfig"
      :tableData="findDuplicateTableData"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      hideKeyFilter
      hideSearch
      ref="findDuplicateTable"
      id="findDuplicateTable"
    >
    </table-page>
  </el-dialog>
</template>

<script type="text/javascript">
import { findDuplicateTableKeys } from "../config";
import TablePage from "@zkzc/table-page";
import TablePageFunc from "@/utils/tablepage.js";
export default {
  name: "",
  mixins: [TablePageFunc],
  components: {
    TablePage,
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    tableData: {
      handler(val) {
        this.findDuplicateTableData = val.map((item, index) => ({
            index:
              (this.findDuplicateTableFilter.pageNum - 1) *
                this.findDuplicateTableFilter.pageSize +
              (index + 1),
            ...item,
          }));
      },
      deep: true,
      immediate: true,
    },
    visible: {
      handler(val) {
        this.findDuplicateDialogVisible = val;
      },
    }
  },
  data() {
    return {
      findDuplicateTableData: [],
      findDuplicateTableFilter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100],
      },
      findDuplicateDialogVisible: false,
      findDuplicateTableConfig: Object.freeze({
        columnFunctionsWidth: 250, // 操作栏宽度
        tableKeys: findDuplicateTableKeys,
        // 表格函数
        tableFunctions: [
          {
            label: "选择并编辑",
            method: this.selectAndEdit,
          },
          {
            label: "选择此项",
            method: this.selectThis,
          },
          {
            label: "详情",
            method: this.detail,
          },
        ],
      }),
    };
  },
  methods: {
    selectAndEdit({ row: { id } }) {
      this.$emit('update:visible', false);
      this.$router.push({ query: { id } });
    },
    selectThis({ row: { id } }) {
      this.$emit("selectThis", id);
    },
    detail({ row: { id } }) {
      const routeData = this.$router.resolve({
        name: "editSurvey",
        query: {
          id,
        },
      });
      window.open(routeData.href, "_blank"); //打开新标签
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-table__fixed-right::before, .el-table__fixed::before {
  background: none;
}
</style>
