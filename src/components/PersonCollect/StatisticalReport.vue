<template>
  <div class="count-data-box">
    <div class="searchControl">
      查询时间段：
      <el-date-picker
        v-model="searchTime"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm"
      />

      <el-button style="margin-left: 20px " type="primary" @click="search">查询</el-button>
      <el-button @click="resetSearch">重置</el-button>

      <el-button type="primary" @click="">导出</el-button>
    </div>
    <el-table
      :data="tableListData.tableData"
      border
      :span-method="arraySpanMethod"
      style="width: 100%">
      <el-table-column label="统计报表" align="center">
        <el-table-column v-for="item in tableListData.tableKey" :key="item.index"
                         :prop="item.key"
                         :label="item.name"
                         align="center"
        >
          <template slot-scope="scope">

          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import {
  getsSatisticHsData,
} from "@/api/collect";

import {formatDate} from '@/utils/common'
import Pagination from '@/components/form/Pagination'


export default {
  name: 'StatisticalReport',
  components: {Pagination},
  props: {
    showme: {type: Boolean},
    countType: {type: String},
  },
  model: {
    prop: 'showme',
    event: 'toggle'
  },
  computed: {
    // 默认时间
    timeDefault() {
      //获取当前时间
      let defalutStartTime = formatDate(new Date(new Date() - 24 * 60 * 60 * 1000)) + ' 00:00'
      // let defalutStartTime = formatDate(new Date(new Date() - 24 * 60 * 60 * 1000))
      let defalutEndTime = formatDate(new Date(new Date() - 24 * 60 * 60 * 1000)) + ' 23:59'
      return [defalutStartTime, defalutEndTime] //默认前一天数据
    },

    departmentName() {
      return this.$store.getters.departmentName
    }
  },
  data() {
    return {
      searchTime: '',
      currentAttr: '', //当前点击单元格
      tableListData: {
        tableData: [],
        tableKey: [
          {name: '所属镇街', key: 'sszj'},
          {name: '人员类型', key: 'name'},
          {name: '人员数量', key: 'rysl'},
          {name: '未核酸检测人数', key: 'whsjcrs'},
          {name: '核酸检测人次', key: 'hsjcrc'},
          {name: '核酸检测人数', key: 'hsjcrs'},
          {name: '覆盖率', key: 'fgl'},
          {name: '阴性人数', key: 'yxrs'},
          {name: '未出结果人数', key: 'wcjgrs'}
        ],
      },
      page: {
        pageNum: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        rowTotal: 0
      },
      //当前选择的快捷时间段 24,48,72,73
      currHourTag: null
    }
  },
  watch: {},


  mounted() {

  },
  methods: {


    //核酸检测情况
    async getsSatisticHsData() {
      let params = {}

      getsSatisticHsData(params).then((res) => {
        let arr = res
        //合并单元格
        let tempCount = [] //合并的行
        let tempIndex = 0 //合并的行的索引
        arr.forEach((item, index) => {
          if (index === 0) {
            tempCount.push(1)
            tempIndex = 0
          } else {
            if (arr[index].sszj == arr[index - 1].sszj) {
              tempCount[tempIndex] += 1
              tempCount.push(0)
            } else {
              tempCount.push(1)
              tempIndex = index
            }
          }
        })
        tempCount.forEach((v, index) => {
          arr[index].rowSpan = v
        })
        this.tableListData.tableData = arr

      })
    },


    //按时段统计
    searchViaHour(val) {

      if (this.currHourTag == val) {
        return
      }
      this.currHourTag = val
      this.getsSatisticHsData();
    },
    search() {
      if (!this.searchTime) return this.$message({message: '请选择时间段', type: 'error'})
      this.currHourTag = null
      this.getsSatisticHsData();
    },
    resetSearch() {
      this.currHourTag = null
      this.searchTime = null
    },


    handleSizeChange(v) {
      this.page.pageSize = v
      this.page.pageNum = 1

    },
    handleCurrentChange(v) {
      this.page.pageNum = v

    },
    //合并单元格
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex == 0) {
        return [row.rowSpan, 1]
      } else {
        return [1, 1]
      }
    },
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.count-data-box {
  margin: 20px;

  .searchControl {
    margin: 0 0 15px;
  }

  ::v-deep.el-dialog__body {
    padding: 10px 20px;
  }

  .count-time {
    margin: 10px 0 50px;
  }

  .link {
    color: #409EFF;
  }
}


</style>
