<template>
  <div>
    <table-page
      :data="tableListData"
      :filter="filter"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @search="search"
      @resetSearch="resetSearch"
      ref="table"
      :id="`notice_table`">

      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" label-width="60px" @keyup.enter.native="getData">
          <el-form-item label="关键词" >
            <el-input v-model="filter.keyword" placeholder="请输入信息内容" style="width: 300px"/>
          </el-form-item>
        </el-form>
      </template>
      <template slot="controler">
        <el-button icon="el-icon-circle-plus" type="primary" @click="add" v-show="authority.saveOrUpdateNotice">发布新信息</el-button>
      </template>
    </table-page>

    <notice-editor v-model="editorVisible" @publiced="getData"></notice-editor>

    <notice-detail v-model="detailVisible" :id="currId"></notice-detail>

  </div>
</template>

<script>
  import TablePage from 'zkzc-table-page'
  import NoticeEditor from "@/components/notice/NoticeEditor"
  import NoticeDetail from "@/components/notice/NoticeDetail"
  import { queryNotices, removeNotice} from "@/api/notice"

  export default {
    name: "Notice",
    components: {
      NoticeDetail,
      NoticeEditor,
      TablePage
    },
    data() {
      return {
        filter: {
          keyword: '',
          pageSize: 10, // 每页条数
          pageNum: 1, // 当前页
          rowTotal: 0, // 总条数
          pageSizes: [10, 20, 50, 100]
        },
        tableListData: {
          selection: false,
          columnFunctionsWidth: 250, // 操作栏宽度
          tableData: [],  //表格内容
          tableKeys: [{
            id: "msgTitle",
            label: "标题",
            allways: true,
          },{
            id: "sendTime",
            label: "发布时间",
            width: 180,
          },{
            id: "ownerName",
            label: "作者",
            width: 150,
          },{
            id: "source",
            label: "来源",
            width: 250,
          },{
            id: "sendDepartmentName",
            label: "所属部门",
            width: 250
          }],  //表头
          tableFunctions: []
        },

        editorVisible: false,
        detailVisible: false,
        currId: null
      }
    },
    computed:{
      userId() {
        return this.$store.getters.userId
      },
      authority() {
        //功能权限
        return this.$store.state.authority.methAuthority
      }
    },
    mounted() {
      this.initTableFn()
      this.getData()
    },

    methods: {

      initTableFn(){
        var t = this
        this.tableListData.tableFunctions = [
          {
            label: '查看',
            method: this.view
          },
          {
            label: '删除',
            hidden: (scope) => {
              //非自己创建，且没有删除权限
              return scope.row.userId != t.userId && !t.authority.DeleteNotice
            },
            method: this.remove
          }
        ]
      },

      async getData () {

        queryNotices({
          msgTitle: this.filter.keyword,
          rp: this.filter.pageSize,
          page: this.filter.pageNum
        }).then(res=>{
          this.tableListData.tableData = res.dataList
          this.filter.pageNum = res.pageNumber
          this.filter.pageSize = res.pageSize
          this.filter.rowTotal = res.rowTotal
        })

      },
      remove ({row}) {

        this.$confirm('确定删除该通知公告?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          removeNotice({
             id: row.id
          }).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getData()
          })
        })
      },

      view({row}){
        this.currId = row.id
        this.detailVisible = true
      },

      add(){
        this.editorVisible = true
      },

      search () {
        this.filter.pageNum = 1
        this.getData()
      },
      resetSearch () {
        let whiteList = ['pageNum', 'pageSize', 'rowTotal', 'pageSizes']
        for (let i in this.filter) {
          if (!whiteList.includes(i)) {
            this.filter[i] = ''
          }
        }
        this.filter.pageNum = 1
        this.getData()
      },
      sizeChange (val) {
        this.filter.pageSize = val
        this.filter.pageNum = 1
        this.getData()
      },
      currentChange (val) {
        this.filter.pageNum = val
        this.getData()
      },
    }
  }
</script>

<style lang="scss" type="text/scss">

</style>
