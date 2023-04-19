<template>
  <div class="p-personnel-verification">
    <div class="p-personnel-verification-header">
      <h3 class="p-personnel-verification-title">待核查记录</h3>
      <color-statistics :statistics="statistics" v-if="statistics.length"></color-statistics>
      <div v-else class="p-personnel-verification-no-content">暂无待核查记录</div>
    </div>
    <table-page
      :data="tableListData"
      :filter="filter"
      :hideKeyFilter="true"
      @search="search"
      @resetSearch="resetSearch"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      customClass="staff_table"
    >
      <template slot="searchFilter">
        <div class="search-box">
          <el-form :inline="true" :model="filter" label-width="360px">
            <el-form
              :inline="true"
              :model="filter"
              label-width="60px"
              @keyup.enter.native="getData"
            >
              <el-form-item label="任务状态" label-width="60px">
                <el-select v-model="filter.status">
                  <el-option value="" label="全部" />
                  <el-option
                    :value="item.value"
                    :label="item.label"
                    v-for="item in statusMap"
                    :key="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="导入时间" label-width="60px">
                <el-date-picker
                  v-model="filter.dateRange"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-form>
        </div>
      </template>

      <template v-slot:column_status="row">
        <span :style="{color: row.value.status === '1' ? '#00EA99' : '#FF0000'}">
          {{row.value.status === '1' ? '已完成' : '未完成'}}
        </span>
      </template>
      <template v-slot:column_feedbackProgress="row">
        <span :style="{color: row.value.status === '1' ? '#00EA99' : '#FF0000'}">
          {{row.value.feedbackProgress}}
        </span>
      </template>
    </table-page>

    <process-view
      v-if="processViewVisible"
      type="buyMedicine"
      :analysisId="analysisId"
      @close="processViewVisible = false"
    ></process-view>
  </div>
</template>
<script>
import TablePage from 'zkzc-table-page';
import TablePageFunc from "@/utils/tablepage.js";
import ColorStatistics from "@/components/charts/ColorStatistics";
import ProcessView from "@/components/charts/ProcessView";
import { getBuyMedicineList, getStatisticsBuyMedicine } from '@/api/buyMedicine';
import {mapState } from 'vuex';

export default {
  name: "BuyMedicineVerification",
  components: {
    ColorStatistics,
    ProcessView,
    TablePage
  },
  watch: {
    town(val){
      this.sszj  = val;
    },
  },
  computed: {
    ...mapState('common', ['town'])
  },
  mixins: [TablePageFunc],
  data() {
    return {
      analysisId: '',
      processViewVisible: false,
      sszj: '',
      statusMap: [
        {
          label: '未完成',
          value: 0
        },
        {
          label: '已完成',
          value: 1
        }
      ],
      statistics: [],
      filter: {
        status: "",
        dateRange: [],
        pageNum: 1,
        pageSize: 15,
        rowTotal: 1,
        pageSizes: [15, 50, 100, 200],
      },
      tableListData: {
        columnFunctionsWidth: 250, // 操作栏宽度
        tableData: [], //表格内容
        tableKeys: [
          {
            id: "analysisId",
            label: "批次号",
            allways: true,
            minWidth: 100,
          },
          {
            id: "createTime",
            label: "导入时间",
            minWidth: 100,
          },
          {
            id: "feedbackFinishTime",
            label: "反馈完成时间",
            minWidth: 100,
          },
          {
            id: "status",
            label: "当前状态",
            width: 80,
          },
          {
            id: "personNum",
            label: "总数",
            width: 100,
          },
          {
            id: "verifiedNum",
            label: "已核查人数",
            width: 100,
          },
          {
            id: "toBeVerifiedNum",
            label: "未反馈人数",
            width: 100,
          },

          {
            id: "feedbackProgress",
            label: "反馈进展",
            width: 80,
          },
        ], //表头
        tableFunctions: [
          {
            label: "查看详情",
            method: this.checkProcess,
          },
        ],
      },
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      //数据量统计
      const res1 = await getStatisticsBuyMedicine()
      this.statistics = res1['待核查人员']

      //列表
      const { status, dateRange, pageNum, pageSize } = this.filter
      const res = await getBuyMedicineList({
        page: pageNum,
        pageSize,
        condition: {
          status,
          createTimeLine: dateRange.join(',')
        },
      })
      res.data.forEach(v => Object.keys(v).forEach(key => {if(v[key] === null) v[key] = '-'}))
      this.tableListData.tableData = res.data
      this.filter.rowTotal = res.total
    },
    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    resetSearch() {
      this.filter = {
        status: "",
        dateRange: [],
      };
      this.getData();
    },
    checkProcess({row: {analysisId}}) {
      this.processViewVisible = true;
      this.analysisId = analysisId;
    }
  },
};
</script>

<style lang="scss" type="text/scss">
.p-personnel-verification {
  &-header {
    &:first-child {
      margin-bottom: 24px;
    }
  }
  &-no-content {
    color: #cdd7e1;
    margin-top: 10px;
    margin-bottom: 40px;
  }
  &-title {
    font-size: 18px;
    color: #ffffff;
  }
  .showMore-searchFilter .searchInput .el-form--inline .el-form-item {
    margin-right: 20px;
  }
}
</style>
