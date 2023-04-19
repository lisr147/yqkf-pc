<template>
  <div class="history-list">

    <table-page
      :data="tableListData"
      :filter="filter"
      :hideKeyFilter="true"
      :height="400"
      @search="search"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @resetSearch="resetSearch"
      customClass="staff_table"
    >
      <template slot="searchFilter">
        <div class="search-box">
          <el-form :inline="true" :model="filter" @keyup.enter.native="getData">
            <el-form-item label="涉疫城市地区" label-width="100px">
              <el-input v-model="filter.areaName" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-form-item label="截止统计时间" label-width="120px">
              <el-date-picker value-format="yyyy-MM-dd" v-model="filter.timeRange" type="date" ></el-date-picker>
            </el-form-item>

          </el-form>
        </div>
      </template>

    </table-page>

  </div>
</template>

<script>
  import TablePage from "zkzc-table-page";
  import TablePageFunc from "@/utils/tablepage";
  // import {formatTime} from '@/utils/common'
  import SETTING from '@/config/MapSetting.js'

  export default {
    name: "HistoryList",
    components: {
      TablePage,
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

        filter:{
          areaName: null,
          timeRange: null,
          pageNum: 1,
          pageSize: 15,
          rowTotal: 1,
          pageSizes: [15, 50, 100, 200],
        },

        tableListData: {
          selection: false,
          tableData: [],
          tableKeys: (function({layerId}){
            var res

            switch(layerId){
              case 'school':
                res = [
                  {id: 'sycsdq', label: '涉疫城市地区',width: 120},
                  {id: 'mcrqyl', label: '摸查日期以来',width: 120},
                  {id: 'sszj', label: '所属镇街',width: 100},
                  {id: 'xxlx', label: '学校类型',width: 100},
                  {id: 'szxxdz', label: '学校名称',width: 100},
                  {id: 'xsrs', label: '学生人数',width: 100},
                  {id: 'jzygrs', label: '教职员工人数',width:150},
                  {id: 'ybgsqjsjkglxsrs', label: '已报告社区接受健康管理学生人数',width:150},
                  {id: 'ybgjsjkgljzygrs', label: '已报告接受健康管理教职员工人数 ',width: 150},
                  {id: 'jztjsj', label: '截止统计时间 ',width: 200},
                ]
                break;
              default:
                break;
            }
            return res

          })(this.cond)
        },

      }
    },
    created() {
      // var date = new Date()
      // this.filter.timeRange = [formatTime(date.setDate(date.getDate() - 1)) , formatTime(new Date())]
    },
    mounted(){
      this.getData()
    },
    methods: {
      async getData(){

        const {layerId, szxxdz} = this.cond

        const layerSetting = SETTING.getLayerSetting(layerId)
        if (!layerSetting) {
          console.error('没有获取到图层${layerId} 的人员列表id')
          return
        }

        const {pageNum, pageSize, timeRange, areaName} = this.filter

        const params = {
          page: pageNum,
          pageSize: pageSize,
          condition: {
            jztjsj: timeRange ? [`${timeRange} 00:00:00`, `${timeRange} 23:59:59`] : [],//截止统计时间
            sycsdq: areaName || '',//涉疫城市地区
            szxxdz //所属学校地址
          }
        }

        switch (layerId) {
          case 'school':

            var res  = await layerSetting.getListData(params)
            this.tableListData.tableData = res.data
            this.filter.rowTotal = res.total
            break;

          default:
            break;
        }
      },

      resetSearch() {
        this.filter.areaName = null
        this.filter.timeRange = null
        this.filter.pageNum = 1
        this.filter.pageSize = 15
        this.getData()
      },

      search(){
        this.filter.pageNum = 1;
        this.getData()
      },
    }
  }
</script>

<style lang="scss" type="text/scss">
  .history-list{

  }
</style>
