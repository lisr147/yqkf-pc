<template>
  <div style="padding: 10px">
    <el-table
      stripe
      :data="gridData"
      style="width: 99.6%">
      <el-table-column
      v-for="item in headerData"
      :key ="item.name"
      :prop="item.name"
      :width="item.width"
      :label="item.label">
        <template slot-scope="scope" >
          <span >{{scope.row[item.name]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--<el-pagination-->
      <!--v-if="page.pageNumber==1 && page.rowTotal<=page.pageSize"-->
      <!--@current-change="handleCurrentChange"-->
      <!--@size-change="handleSizeChange"-->
      <!--:current-page.sync="page.pageNumber"-->
      <!--:page-sizes="pageRange"-->
      <!--:page-size="page.pageSize"-->
      <!--:pager-count="page.pagerCount"-->
      <!--layout="total, sizes, prev, pager, next"-->
      <!--:total="page.rowTotal">-->
    <!--</el-pagination>-->

  </div>
</template>

<script>
export default {
  name: 'GridChart',
  data () {
    return {
      // 头部
      headerData: [],
      // 表格主体
      gridData: [],
      // 页码信息
      // page: {
      //   pageNumber: 1,
      //   pageSize: 5,
      //   rowTotal: 1,
      //   pagerCount: 5
      // },
      updateTime: null
    }
  },
  computed: {
    pageRange () {
      return [5, ...this.$store.getters.pageRange]
    }
  },
  props: {
    info: {type: Object},
    data: {type: Object, required: true},
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {

      const data = this.data.panelItemData.data
      if(!data){
        return
      }
      this.headerData = data.data.xAxisDatas
      this.gridData = data.data.yAxisDatas
      // this.page.pageNumber = data.page.pageNumber
      // this.page.pageSize = data.page.pageSize
      // this.page.rowTotal = data.page.rowTotal
      // this.updateTime = data.update || data.updateTime
    },
    handleCurrentChange (newPageNumber) {
      this.page.pageNumber = newPageNumber
      this.getData()
    },
    handleSizeChange (newValue) {
      this.page.pageSize = newValue
      this.getData()
    }
  }
}
</script>

<style  lang="scss"  rel="stylesheet/scss"  scoped>
.el-pagination{
  padding:8px 0 0;
}
.desc{
  margin: 0;
  padding: 0 4px 10px;
  font-size: 12px;
  color: #aaa;
}
::v-deep .el-table td{
  padding: 10px 0;
}
</style>
