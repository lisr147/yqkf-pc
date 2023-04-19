<template>
  <div class="p-alarm-query">
    <table-page
        :data="tableListData"
        :filter="filter"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @search="search"
        @resetSearch="resetSearch"
        ref="alarmQueryTable"
        id="alarm_query_table">

      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" label-width="60px" @keyup.enter.native="() => {}">
 
        </el-form>
      </template>
    </table-page>
  </div>
</template>

<script>
import TablePage from 'zkzc-table-page';
import TablePageFunc from "@/utils/tablepage.js";
export default {
  name: "alarmQuery",
  components: {
    TablePage,
  },
  mixins: [TablePageFunc],
  data() {
    return {
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100],
        dateRange: []
      },
      tableListData: {
        selection: true,
        columnFunctionsWidth: 250, // 操作栏宽度
        tableData: [],  //表格内容
        tableKeys: [{
          id: "index",
          label: "序号",
          width: 50,
        },{
          id: "name",
          label: "任务名称",
          allways: true,
          width: 200,
        },{
          id: "type",
          label: "任务类型",
          width: 80,
        },{
          id: "source",
          label: "任务来源",
          width: 100,
        },{
          id: "taskStatus",
          label: "当前状态",
          width: 100,
        },{
          id: "department",
          label: "执行部门",
          minWidth: 200
        },{
          id: "executors",
          label: "执行人员",
          minWidth: 100
        },{
          id: "createTime",
          label: "发起时间",
          width: 150
        },{
          id: "endTime",
          label: "截止时间",
          width: 150
        },{
          id: "createUserName",
          label: "发起人",
          width: 80
        }],  //表头
        tableFunctions: [{
          label: '查看进展',
          method: this.view
        },
        {
          label: '任务完成',
          method: this.complete,
          hidden({ row }) {
            return row.taskStatus === '已结束'
          }
        },
        {
          label: '删除',
          method: this.remove
        }]
      },
    }
  },

  computed:{
    
  },
  mounted() {
    
  },

  methods: {
    sizeChange() {},
    currentChange() {

    }
  }
}
</script>
<style lang="scss" type="text/scss">
.p-alarm-query {
  .searchInput {
    overflow: visible;
    .el-input {
      width: 140px;
    }
  }
  .el-date-editor {
    width: 300px;
  }
  .el-popover {
    border-color: #ccc;
    background-color: #fff;
    background: #fff;
  }
}
</style>
