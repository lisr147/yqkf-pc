<template>
  <div class="three-group-detail">

    <table-page
      :data="tableListData"
      :filter="filter"
      @search="search"
      @resetSearch="resetSearch"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      :hideKeyFilter="true"
      :customClass="'staff_table'"
      :height="400">
      <template slot="searchFilter">
        <div class="search-box">
          <!-- <span class="tip">三人小组人员信息</span> -->
          <el-form :inline="true" :model="filter" label-width="360px">
            <el-input
                style="width: 200px;margin: 0 20px"
                v-model="filter.keyWord"
                placeholder="请输入关键词搜索"
            ></el-input>
            <el-select v-model="filter.sex" placeholder="请选择性别">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
              </el-option>
            </el-select>
          </el-form>

        </div>

      </template>

      <template v-slot:column_phoneNumber="row">
        <span v-cellphone>{{row.value.phoneNumber}}</span>
      </template>

    </table-page>

  </div>
</template>

<script>

  import TablePage from "zkzc-table-page";
  import TablePageFunc from "@/utils/tablepage";
  import {getThreeGroupList} from '@/api/mapData.js'

  export default {
    name: "ThreeGroupDetail",
    components: {
      TablePage
    },
    mixins: [TablePageFunc],
    props: {
      cond: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        options:[
          // {value: '0', label: '不限'},
          {value: '1', label: '男'},
          {value: '2', label: '女'},
        ],
        filter: {
          pageNum: 1,
          pageSize: 15,
          rowTotal: 1,
          pageSizes: [15, 50, 100, 200],
          condition: {}
        },
        tableListData: {
          selection: false,
          tableData: [],
          tableKeys: [
            {id: "groupName", label: "组名",width: 100,},
            {id: "belongGrid", label: "所属网格",width: 140},
            {id: "belongVillage", label: "所属村居",width: 100},
            {id: "belongTown", label: "所属镇街"},
            {id: "groupNature", label: "小组性质"},
            {id: "name", label: "组员姓名"},
            {id: "sex", label: "性别"},
            {id: "peopleCategory", label: "成员类别",width: 100},
            {id: "phoneNumber", label: "联系方式",width: 100},
          ],
          tableFunctions: [],
        },
      }
    },
    mounted() {
      console.log(66,this.cond);
      this.getData()
    },
    watch: {
      cond(val) {
        console.log(70,val);
        this.getData()
      }
    },
    methods: {

      async getData(){
        const {street, grid} = this.cond

        this.filter.condition = {
          belongGrid: grid,
          belongTown: street,
          groupSearchInfo:this.filter.keyWord,
          sex:this.filter.sex
        }
        const {data, total} = await getThreeGroupList(Object.assign({page: this.filter.pageNum}, this.filter))

        this.tableListData.tableData = data
        this.filter.rowTotal = total
      },
      search(){
        this.filter.pageNum = 1;
        this.getData();
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  .three-group-detail {
    .searchFilter{
      min-height: 40px;
      .search-box{
        .el-input--suffix{
          width: 150px;
        }
      }
    }
    &-h{
      padding: 1em 0;
      color: #fff;
    }

    .group-item{
      margin-bottom: 1em;
    }

    .base-info {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      width: 96%;

      .info-item {
        width: calc(50% - 1px);
        display: flex;
        border: 1px solid #465da3;
        margin-right: -1px;
        margin-bottom: -1px;
        position: relative;

        .box-label {
          width: 140px;
          min-height: 20px;
          padding: 8px 16px;
          flex-shrink: 0;
          background-color: rgba(45, 85, 208, 0.3);
        }
        .box-value {
          box-sizing: border-box;
          padding: 8px 16px;
          border-left: 1px solid #465DA3;
          width: 100%;
        }
      }
    }
    .members-table{

      table{
        width: calc(96% + 1px);
        border-collapse: collapse;
      }

      th,td{
        padding: .5em;
        border: 1px solid #465da3;
      }
    }


  }

</style>
