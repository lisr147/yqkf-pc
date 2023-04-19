<template>
  <div class="red-yellow-list-dialog staff_table">
    <table-page
        :data="tableListData"
        :filter="filter"
        @search="search"
        @resetSearch="resetSearch"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @tableSelectionChange="tableSelectionChange"
        v-if="tableListData.tableKeys.length"
        :customClass="'staff_table'"
        :hideKeyFilter="true"

    >
      <template slot="searchFilter">
        <div class="search-box">
          <el-form :inline="true" :model="filter" label-width="100px">
            <el-form-item label="">
              <el-input style="width: 240px;" v-model="filter.keyWord" placeholder="请输入姓名、身份证、手机号"></el-input>
            </el-form-item>

            <el-form-item label="数据来源">
              <el-select v-model="filter.source">
                <el-option v-for="(item,key) in sourceMap" :label="item.label" :key="key" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </div>
      </template>

      <template v-slot:column_skmStatus="row">
        <span :style="`color:${row.value.skmStatus === '3' ? '#FFFF00' : (row.value.skmStatus==='2'?'#F42A34':'#32C416') }`">
          {{row.value.skmStatus==='3'?'黄码':(row.value.skmStatus==='2'?'红码':'绿码')}}</span>
      </template>
    </table-page>
  </div>
</template>

<script>
import TablePage from "zkzc-table-page";
import "@/assets/css/screenDialog.scss";
import TablePageFunc from "@/utils/tablepage";
import {getPersonList} from '@/api/mapData'
import EleForm from "../f-render/main/ele-form";
export default {
  name: "RyList",
  components: {
    TablePage,
  },
  props: ["data"],
  mixins: [TablePageFunc],
  watch:{
    'data.ObjectID'(val,oldV){
      this.getData()
    }
  },
  data () {
    return {
      filter: {
        keyWord: "",
        source: "",
        pageNum: 1,
        pageSize: 15,
        rowTotal: 1,
        pageSizes: [15, 50, 100, 200],
      },
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: [
          {
            id: "fullName",
            label: "姓名",
            width: 100,
          },
          {
            id: "idNum2",
            label: "身份证号",
            minWidth: 150,
          },
          {
            id: "phoneNum",
            label: "手机号",
          },
          {
            id: "skmStatus",
            label: "健康码",
          },
          {
            id: "logTime",
            label: "通行时间",
            minWidth: 120,
          },
          {
            id: "source",
            label: "数据来源",
            minWidth: 120,
          },
        ],
        tableFunctions: [],
      },
      sourceMap: {
        1: {label: '公安扫码通行', value: 1},
        2: {label: '穗康扫码通行', value: 2},
      },
    }
  },
  methods : {
    async getData () {

      let params = {
        page:this.filter.page,
        pageSize:this.filter.pageSize,
        stationName: this.data.stationName
      }

      if (this.filter.keyWord) {
        params.fuzzyMatchingKey = this.filter.keyWord
      }
      if (this.filter.source) {
        params.source = this.filter.source
      }
      Object.assign(params, {
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      })

      await getPersonList(params).then(res => {
        res.dataList.map((item)=>{
          item.idNum2 = item.idNum.replace(/^(.{0})(?:\d+)(.{4})$/, "$1********$2")
          item.source = this.sourceMap[item.source].label
        })
        this.tableListData.tableData = res.dataList
        this.filter.rowTotal = res.pageTotal
      })
    },
    editRow ({row}) {
      this.$emit('showRiskPlaceDetail',row)
    },
    search(){
      this.filter.page = 1;
      this.getData();
    }
  },
  mounted() {
    this.getData()
    this.tableListData.tableFunctions = [
      {
        label: '轨迹',
        method: this.editRow
      }
    ]
  }
}
</script>

<style scoped lang="scss">
.red-yellow-list-dialog {
  height: calc(70vh);
  overflow-y: auto;
  ::v-deep .showMore-searchFilter{
      margin-top: 20px;
      padding-right: 10px;
      min-height: 40px;
  }
}
</style>
