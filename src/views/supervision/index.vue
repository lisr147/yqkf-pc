<template>
  <div class="p-supervision">
    <table-page
        :tableData="tableData"
        :tableConfig="tableConfig"
        :filter="filter"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @search="search"
        @tableSelectionChange="tableSelectionChange"
        @resetSearch="resetSearch"
        ref="supervisionTable"
        id="supervision_table">

      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" label-width="60px" @keyup.enter.native="getData">
          <el-form-item label="任务名称" :label-width="labelWidth">
            <el-input v-model="filter.name" placeholder="请输入任务名称"/>
          </el-form-item>
          <el-form-item label="任务来源" :label-width="labelWidth">
            <el-input v-model="filter.source" placeholder="请输入任务来源" />
          </el-form-item>
          <el-form-item label="任务状态" :label-width="labelWidth">
            <el-select v-model="filter.taskStatusText">
              <el-option value="" label="全部" />
              <el-option :value="item.label" :label="item.label" v-for="item in supervisionStatusList" :key="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="发起时间" :label-width="labelWidth">
            <el-date-picker
                v-model="filter.dateRange"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="执行部门" :label-width="labelWidth">
            <group-selector class="de-box" v-model="filter.departmentId" :inputable="false" value-mode="id" @change="handleGradeChange"></group-selector>
          </el-form-item>
        </el-form>
      </template>
      <template slot="controler">
        <el-button icon="el-icon-circle-plus" type="primary" @click="add" >新建任务</el-button>
        <el-button  type="primary" plain @click="urge">一键催办</el-button>
        <el-button icon="el-icon-download" type="primary" plain @click="exportFile">批量导出</el-button>
<!--        <el-button icon="el-icon-download" type="primary" plain @click="exportAllFile">全部导出</el-button>-->

      </template>
    </table-page>

    <add v-model="editorVisible" @updateList="getData" :currId="currId" :editType="editType"></add>

  </div>
</template>

<script>
import TablePage from '@zkzc/table-page';
import TablePageFunc from "@/utils/tablepage.js";
import Add from "@/components/supervision/Add";
import { getTaskList, exportSupervision, urgeSupervision, deleteTask } from "@/api/supervision";
import {supervisionStatusList, supervisionTypeList} from '@/config/setting';
import { parseTime } from '@/utils/common';
import GroupSelector from '@/components/common/GroupSelector'

export default {
  name: "Supervision",
  components: {
    Add,
    TablePage,
    GroupSelector
  },
  mixins: [TablePageFunc],
  data() {
    return {
      filter: {
        name: '',
        source: '',
        endTime: '',
        taskStatus: '',
        taskStatusText: '',
        departmentId: '',
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100],
        dateRange: []
      },
      selectedIds: [],
      editType: 'add', //add 新增 //view 查看详情
      labelWidth: '100px',
      tableData: [],  //表格内容
      tableConfig: {
        selection: true,
        columnFunctionsWidth: 250, // 操作栏宽度
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
      supervisionTypeList,
      supervisionStatusList,
      departmentList: [],

      editorVisible: false,
      detailVisible: false,
      currId: null,
    }
  },

  computed:{
    userId() {
      return this.$store ? this.$store.getters.userId : ''
    },
    authority() {
      //功能权限
      return this.$store.state.authority.methAuthority
    }
  },
  mounted() {
    console.log(supervisionStatusList);
    this.getData()
  },

  methods: {
    async getData () {
      const taskStatusSelected = this.supervisionStatusList.find(v => v.label === this.filter.taskStatusText);
      const condition = {};
      this.filter.taskStatus = taskStatusSelected ? taskStatusSelected.value : "";
      this.filter.startTime = this.filter.dateRange && this.filter.dateRange.length > 0 ? this.filter.dateRange[0] : '';
      this.filter.endTime = this.filter.dateRange && this.filter.dateRange.length > 0 ? this.filter.dateRange[1] : '';
      const whiteList = ["pageNum", "pageSize", "pageSizes", "rowTotal", "dateRange", "departments"];
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      getTaskList({
        condition,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      }).then(res=>{
        this.tableData = res.data.map((item, index) => ({
          ...item,
          index: (this.filter.pageNum - 1) * this.filter.pageSize + (index + 1),
          taskStatus: this.supervisionStatusList.find(v => v.value == item.taskStatus).label || '进行中',
          type: supervisionTypeList.find(v => v.value === item.type) ? supervisionTypeList.find(v => v.value == item.type).label : '其他',
          createTime: parseTime(item.createTime),
          endTime: parseTime(item.endTime),
          department: item.userInfos ? item.userInfos.filter(v => v.departmentName).map(i => i.departmentName).join(',') : '',
          executors: item.userInfos ? item.userInfos.filter(v => v.name).map(i => i.name).join(',') : ''
        }))
        this.filter.rowTotal = res.total
      })
    },
    remove ({row}) {
      this.$confirm('确定删除该任务?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask(row.id)
          .then(() => {
            this.$message.success("删除成功");
            this.getData();
          })
          .catch(e => {
            this.$message.warning("删除失败");
            console.log(e);
          })
      })
    },
    add(){
      this.editType = 'add'
      this.editorVisible = true
      this.currId = ''
    },
    view({row}){
      this.editType = 'view'
      this.editorVisible = true
      this.currId = row.id
    },

    urge () {
      if (!this.selectedIds.length) {
        this.$message.warning("请选择催办的任务");
       return
      }
      // 催办数据
      urgeSupervision(this.selectedIds)
        .then(() => {
          this.$message.success("催办成功");
          this.selectedIds = [];
          this.$refs.supervisionTable.$children.find(v => v.clearSelection).clearSelection();
        })
        .catch((e) => {
          this.$message.warning("催办失败");
          console.log('UrgeSupervision Error:', e, this.$refs.supervisionTable);
        })
    },
    search () {
      this.filter.pageNum = 1
      this.getData()
    },
    complete ({row}) {
      this.editType = 'complete'
      this.editorVisible = true
      this.currId = row.id
    },
    tableSelectionChange(data) {
      this.selectedIds = data.map(v => v.id)
    },
    handleSelectDepartments() {
      this.showTree = true;
    },
    resetSearch() {
      this.filter = {
        name: '',
        source: '',
        endTime: '',
        taskStatus: '',
        departmentId: '',
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100],
        dateRange: []
      }
      this.groupName = '';
      this.getData();
    },
    async exportFile () {
      let params = {}
      if (!this.selectedIds.length) {
        params = {
          condition: {
            name: this.filter.name,
            source: this.filter.source,
            startTime: this.filter.startTime,
            taskStatus: this.filter.taskStatus,
            // type: this.filter.type,
            endTime: this.filter.endTime,
          },
          page: 1,
          pageSize: 10000000
        }
      }else {
        params = {
          condition: {
            ids: this.selectedIds
          }
        }
      }
      // 导出数据
      exportSupervision(params)

    },
    handleGradeChange (val) {
      console.log(val)
      this.filter.departmentId = val
    },

  }
}
</script>
<style lang="scss" type="text/scss">
.p-supervision {
  .searchInput {
    overflow: visible;
    .el-input {
      width: 140px;
    }
  }
  .el-date-editor {
    width: 300px;
  }
  .area-sub {
    z-index: 10;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10ox;
    min-height: 300px;
  }

  .el-popover {
    border-color: #ccc;
    background-color: #fff;
    background: #fff;
  }
}
</style>
