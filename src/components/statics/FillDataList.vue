<template>
  <el-dialog
    title="查看未填写人员名单"
    :visible="true"
    :append-to-body="true"
    width="800px"
    top="4vh"
    @close="$emit('close')"
  >
      <table-page
        :data="vdata"
        :filter="filter"
        :hideSearch="true"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      />
  </el-dialog>
</template>

<script>
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
import TablePageFunc from "@/utils/tablepage.js";
import {  getUnCompleteList } from "@/api/statics";
export default {
  name: "GroupList",
  components: {
    TablePage,
  },
  mixins: [TablePageFunc],
  props: {
    formKey: {
      type: [Number, String],
    },
  },
  data() {
    return {
      filter: {
        formKey: this.formKey,
        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
      },
      vdata: {
        tableData: [],
        tableKeys: [
          {
            id: "index",
            width: "60",
            label: "序号",
          },
          {
            id: "mobile",
            label: "手机号码",
          },
          {
            id: "name",
            label: "姓名",
          },
          {
            id: "remark",
            label: "备注",
          },
        ]
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      // this.isLoading = true;
      let params = JSON.parse(JSON.stringify(this.filter));
      delete params.rowTotal;
      delete params.pageSizes;
      let res = await getUnCompleteList(params);
      res.content.forEach((v, i) => {
        v.index = i + 1 + res.pageable.pageNumber * res.pageable.pageSize;
      });
      this.vdata.tableData = res.content;
      this.filter.pageNum = res.pageable.pageNumber + 1;
      this.filter.pageSize = res.pageable.pageSize;
      this.filter.rowTotal = res.totalElements;
      // this.isLoading = false;
    }
  }
};
</script>
