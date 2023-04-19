<template>
  <div class="risk-place-detail">
    <table-page
        :data="tableListData"
        :filter="filter"
        @search="search"
        @sizeChange="sizeChange"
        @resetSearch="resetSearch"
        @currentChange="currentChange"
        v-if="tableListData.tableKeys.length"
        :customClass="'staff_table'"
        :hideKeyFilter="true"
        :height="400"
    >
      <template slot="searchFilter">
        <el-form :inline="true" :model="filter">
          <el-form-item label="日期" class="date-box">
            <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
<!--      <template v-slot:column_address="row">-->
<!--        {{row.value.address?row.value.address:'-'}}-->
<!--      </template>-->

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
import {getPersonTrackList} from '@/api/mapData'
import moment from "moment";
export default {
  name: "RyList",
  components: {
    TablePage,
  },
  props: ["data"],
  mixins: [TablePageFunc],
  computed: {
    // 默认时间
    timeDefault () {
      //获取当前时间
      // let yy = new Date().getFullYear();
      // let mm = new Date().getMonth()+1;
      // let dd = new Date().getDate();
      // let hh = new Date().getHours();
      // let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
      // let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
      // let currentDay= `${yy}-${mm}-${dd}`
      let defalutEndTime= moment(new Date(new Date())).format("YYYY-MM-DD HH:mm:ss")
      let defalutStartTime = moment(new Date(new Date() - 24 * 60 * 60 * 1000)).format("YYYY-MM-DD HH:mm:ss")
      return [defalutStartTime, defalutEndTime]
    }
  },
  data () {
    return {
      dateRange: [],  //时间范围
      filter: {
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
            id: "logTime",
            label: "时间",
            width: 200,
          },
          {
            id: "address",
            label: "地点",
            minWidth: 200,
          },
          {
            id: "skmStatus",
            label: "健康码状态",
          },

        ],
        tableFunctions: [],
      },
    }
  },
  mounted() {
    this.dateRange=this.timeDefault
    this.getData()
  },
  methods : {
    async getData () {
      let params = {
        idNum:this.data.idNum,
        page:this.filter.pageNum,
        pageSize:this.filter.pageSize,
      }
      params.startTime =this.dateRange[0]
      params.endTime =this.dateRange[1]
      Object.assign(params, {
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      })
      await getPersonTrackList(params).then(res => {
        res.dataList.map((item)=>{
          for (let key in item){
            if(!item[key]) return item[key] = '-'
          }
        })
        this.tableListData.tableData = res.dataList
        console.log(128,this.tableListData.tableData);
        this.filter.rowTotal = res.pageTotal
      })
    },
    resetSearch() {
      this.dateRange=this.timeDefault
      this.filter.pageNum =1
      this.getData()
    },
  },

}
</script>

<style scoped lang="scss">
.risk-place-detail {
  .date-box{
    .el-input__inner{
      //background: #fff;
    }
  }
}
</style>
