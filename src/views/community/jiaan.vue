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
      :id="`jiaan_table`">

      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" label-width="180px" @keyup.enter.native="getData">
          <el-form-item label="街、栋、房号" label-width="120px">
            <el-input v-model="filter.jdfh" placeholder="请输入街、栋、房号" />
          </el-form-item>
          <el-form-item label="姓名" >
            <el-input v-model="filter.xm" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="联系方式" >
            <el-input v-model="filter.lxfs" placeholder="请输入联系方式" />
          </el-form-item>
          <el-form-item label-width="180px" label="是否精神病重点人群类别" >
            <el-select v-model="filter.jsbzdrqlb">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否其他情况人员" >
            <el-select v-model="filter.qt">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="200px" label="6月4日离开后已回嘉安花园" >
            <el-select v-model="filter.lkhyhjahy">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>
          <el-form-item其他 label-width="260px" label="6月4日离开后未回嘉安但在珠江辖内" >
            <el-select v-model="filter.lkhwhjadzzjxn">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item其他>
          <el-form-item label-width="260px" label="5月25日前离开嘉安，不在珠江辖内" >
            <el-select v-model="filter.wywrqlkjabzzjxn">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="220px" label="5月25日后离开，不在珠江辖内" >
            <el-select v-model="filter.wyeswrhlkbzzjxn">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="220px" label="是否转移到隔离酒店人员" >
            <el-select v-model="filter.zydgl">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:column_lkhyhjahy="row">
        <span>{{row.value.lkhyhjahy == 1 ? '是' : '否' }}</span>
      </template>
      <template v-slot:column_lkhwhjadzzjxn="row">
        <span>{{row.value.lkhwhjadzzjxn == 1 ? '是' : '否' }}</span>
      </template>
      <template v-slot:column_wywrqlkjabzzjxn="row">
        <span>{{row.value.wywrqlkjabzzjxn == 1 ? '是' : '否' }}</span>
      </template>
      <template v-slot:column_wyeswrhlkbzzjxn="row">
        <span>{{row.value.wyeswrhlkbzzjxn == 1 ? '是' : '否' }}</span>
      </template>
      <template v-slot:column_jsbzdrqlb="row">
        <span>{{row.value.jsbzdrqlb == 1 ? '是' : '否' }}</span>
      </template>
      <template v-slot:column_qt="row">
        <span>{{row.value.qt == 1 ? '是' : '否' }}</span>
      </template>
<!--      <template slot="controler">-->
<!--        <el-button icon="el-icon-circle-plus" type="primary" @click="add" v-show="authority.saveOrUpdateNotice">发布新信息</el-button>-->
<!--      </template>-->
    </table-page>

<!--    <notice-editor v-model="editorVisible" @publiced="getData"></notice-editor>-->

<!--    <notice-detail v-model="detailVisible" :id="currId"></notice-detail>-->

  </div>
</template>

<script>
  import TablePage from 'zkzc-table-page'
  // import NoticeEditor from "@/components/notice/NoticeEditor"
  // import NoticeDetail from "@/components/notice/NoticeDetail"
  import { jaList} from "@/api/mapData"

  export default {
    name: "Notice",
    components: {
      // NoticeDetail,
      // NoticeEditor,
      TablePage
    },
    data() {
      return {
        filter: {
          jdfh: '',
          xm: '',
          lxfs: '',
          jsbzdrqlb: '',
          lkhyhjahy: '',
          lkhwhjadzzjxn: '',
          wywrqlkjabzzjxn: '',
          wyeswrhlkbzzjxn: '',
          qt: '',
          zydgl: '',
          // keyword5: '',
          pageSize: 10, // 每页条数
          pageNum: 1, // 当前页
          rowTotal: 0, // 总条数
          pageSizes: [10, 20, 50, 100]
        },
        tableListData: {
          selection: false,
          columnFunctionsWidth: 250, // 操作栏宽度
          tableData: [],  //表格内容
          tableKeys: [
            {
              id: "jdfh",
              label: "街、栋、房号",
              allways: true,
            },
            {
              id: "xm",
              label: "姓名",
              allways: true,
            },
            {
              id: "lxfs",
              label: "联系方式",
              allways: true,
            },
            {
              id: "lkhyhjahy",
              label: "6月4日离开后已回嘉安花园",
            },
            {
              id: "lkhwhjadzzjxn",
              label: "6月4日离开后未回嘉安但在珠江辖内",
            },
            {
              id: "wywrqlkjabzzjxn",
              label: "5月25日前离开嘉安，不在珠江辖内",
            },
            {
              id: "wyeswrhlkbzzjxn",
              label: "5月25日后离开，不在珠江辖内",
            },
            {
              id: "qt",
              label: "是否其他情况人员",
            },
            {
              id: "jsbzdrqlb",
              label: "精神病重点人群类别（如残疾、独居老人、怀孕、困难人员、精神病、自闭症等",
            },
            // {
            //   id: "zydgl",
            //   label: "是否转移到隔离酒店人员",
            // },
            {
              id: "zydgl",
              label: "转移隔离酒店",
            },
          ],  //表头
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
      // this.initTableFn()
      this.getData()
    },

    methods: {


      async getData () {
        let filter = {}
        Object.keys(this.filter).forEach((key, index ) => {
          if (this.filter[key] !== '') {
            filter[key] = this.filter[key]
          }
        })
        filter.page = filter.pageNum
        delete filter.rowTotal
        delete filter.pageSizes
        delete filter.pageNum
        jaList(filter).then(res=>{
          this.tableListData.tableData = res.data
          // this.filter.pageNum = res.pageNumber
          // this.filter.pageSize = res.pageSize
          this.filter.rowTotal = res.total
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
        this.filter = this.$options.data().filter
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
