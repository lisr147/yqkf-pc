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
      :id="`jaImportant_table`">

      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" label-width="120px" @keyup.enter.native="getData">
          <el-form-item label="姓名">
            <el-input v-model="filter.condition.xm" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="户籍" >
            <el-input v-model="filter.condition.hj" placeholder="请输入户籍" />
          </el-form-item>
          <el-form-item label="重点人群类别" >
            <el-select v-model="filter.condition.zdrqlb">
              <el-option value="" label="全部" />
              <el-option :value="item.label" :label="item.label" v-for="item in typeList" :key="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="地址" >
            <el-input v-model="filter.condition.dz" placeholder="请输入地址" />
          </el-form-item>
          <el-form-item label="监护人" >
            <el-input v-model="filter.condition.jhr" placeholder="请输入监护人" />
          </el-form-item>
          <el-form-item label="联系方式" >
            <el-input v-model="filter.condition.lxfs" placeholder="请输入联系方式" />
          </el-form-item>
          <el-form-item label="目前管理状态" >
            <el-select v-model="filter.condition.mqzt">
              <el-option value="" label="全部" />
              <el-option value="居家隔离" label="居家隔离" />
              <el-option value="集中隔离" label="集中隔离" />
            </el-select>
          </el-form-item>
          <el-form-item label="最后一次核酸结果" label-width="120px">
            <el-select v-model="filter.condition.hs">
              <el-option value="" label="全部" />
              <el-option value="阴性" label="阴性" />
              <el-option value="阳性" label="阳性" />
            </el-select>
          </el-form-item>
        </el-form>
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
  import {searchJahyzdrqPageList} from '@/api/mapData'
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
          condition: {
            xm: '',
            hj: '',
            zdrqlb: '',
            dz: '',
            jhr: '',
            lxfs: '',
            mqzt: '',
            hs: '',
          },
          pageSize: 10, // 每页条数
          pageNum: 1, // 当前页
          rowTotal: 0, // 总条数
          pageSizes: [10, 20, 50, 100]
        },
        typeList: [
          {
            label: '精神病',
            value: '1'
          },
          {
            label: '残疾人',
            value: '2'
          },
          {
            label: '独居老人',
            value: '3'
          },{
            label: '低保户',
            value: '4'
          },
          {
            label: '怀孕',
            value: '5'
          },
          {
            label: '困境儿童',
            value: '6'
          },
          {
            label: '重大疾病（尿毒症）',
            value: '7'
          },
          {
            label: '重大疾病（胆囊手术、心脏病）',
            value: '8'
          },
          {
            label: '重大疾病（胆囊手术、心脏病）',
            value: '9'
          },
          {
            label: '重大疾病（卵巢癌）',
            value: '10'
          },
          {
            label: '重大疾病（骨髓癌）',
            value: '11'
          },
          {
            label: '重大疾病（肺癌）',
            value: '12'
          },
          {
            label: '重大疾病（乳腺癌）',
            value: '13'
          }
        ],
        tableListData: {
          selection: false,
          columnFunctionsWidth: 250, // 操作栏宽度
          tableData: [],  //表格内容
          tableKeys: [
            {
              id: "xm",
              label: "姓名",
              allways: true,
            },
            {
              id: "hj",
              label: "户籍",
              allways: true,
            },
            {
              id: "zdrqlb",
              label: "重点人群类别",
              allways: true,
            },
            {
              id: "dz",
              label: "地址",
              allways: true,
            },
            {
              id: "jhr",
              label: "监护人",
            },
            {
              id: "lxfs",
              label: "联系方式",
            },
            {
              id: "mqzt",
              label: "目前管理状态",
            },
            {
              id: "hs",
              label: "最后一次核酸结果",
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
        let filter = {
          condition: this.filter.condition,
          page: this.filter.pageNum,
          pageSize: this.filter.pageSize
        }
        console.log('传给后端的filter', filter)
        searchJahyzdrqPageList(filter).then(res=>{
          this.tableListData.tableData = res.data
          // this.filter.page = res.pageber
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
        console.log(' this.filter', this.filter)
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
