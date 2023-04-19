<template>
  <el-dialog
      :visible="true"
      top="10vh"
      :title="`一线人员数据明细`"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="70vw">

    <div class="frontline-staff-panel">

      <table-page
        :data="tableListData"
        :filter="filter"
        :hideSearch="true"
        :height="500"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        ref="table"
        id="frontlineStaffList"
      >
        <template slot="controler">
          <el-button icon="el-icon-download" type="primary" plain @click="exportFile">导出</el-button>
        </template>

      </table-page>

    </div>

  </el-dialog>
</template>

<script>
import TablePage from "zkzc-table-page"
import getTableKeys from "@/views/dataManage/getTableKeys.js"
import {getFrontLineStaffList, exportFrontLineList} from '@/api/frontLineStaff'
import {getTemplateConfig } from '@/api/mapData'
export default {
  name: "FrontLineStaffPanel",
  components: {
    TablePage
  },
  props: {
    cond: {
      type:Object,
      default(){
        return {}
      }
    }
  },
  mixins: [getTableKeys],
  data() {
    return {
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100, 500],
      },
      tableListData: {
        selection:  false,
        tableData: [],
        tableKeys: [
          // {id: '', label: '', width: 200}
        ],
      }
    }
  },
  async created(){
    const res = await getTemplateConfig({id: '10091'})

    this.tableListData.tableKeys = res.columns.map(v=>{
      const {storeFiled, fieldName} = v
      return {
        id: storeFiled,
        label: fieldName
      }
    })

  },
  mounted() {
    this.getData()
  },
  methods: {

    async getData(){

      const res = await getFrontLineStaffList({
        condition: this.cond,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize
      })

      this.tableListData.tableData = res.data
      this.filter.pageNum = res.page
      this.filter.pageSize = res.pageSize
      this.filter.rowTotal = res.total
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

    async exportFile() {
      await exportFrontLineList({
        condition: this.cond,
        page: this.filter.pageNum,
        pageSize: this.filter.rowTotal
      })
    }

  }
}
</script>

<style lang="scss" type="text/scss">
.frontline-staff-panel{
  .toolbar{
    text-align: right;
  }
}
</style>
