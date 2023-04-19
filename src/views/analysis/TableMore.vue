<template>
  <el-dialog
    class="more-chart-wrap"
    :modal="false"
    append-to-body
    :visible="true"
    :close-on-click-modal="false"
    top="5vh"
    @close="$emit('showTableMore', false)"
    width="96vw"
  >
    <template slot="title">
      <div class="risk-title">{{ infoData.title }}
        <span class="time" v-if="infoData.timePick&&infoData.activeTab==='使用情况查询'">({{ infoData.timePick[0] }}至{{ infoData.timePick[1]}})</span>
      </div>
      <el-button type="primary" class="btn" @click="Export">导出</el-button>
    </template>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        border
        height="80vh"
        :span-method="objectSpanMethod"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column
          prop="name"
          :label="pageName"
          fixed
        >
        </el-table-column>
        <el-table-column
          v-for="(item,index) in tableKey"
          :prop="item.key"
          :label="item.label"
        >
        </el-table-column>
      </el-table>
    </div>

  </el-dialog>
</template>

<script>
import {
  exportUseWbj,
  exportMonthsUseZj,
  exportMonthsUseWbj,
  exportDayUseZj,
  exportDayUseWbj,
  exportRankWbj
} from "@/api/autoCount";

export default {
  name: "TableMore",
  props: {
    tableData: {type: Array, required: true},
    infoData: {type: Object, required: true},
    pageName: {type: String, required: true},
  },
  data() {
    return {
      visible: false,
      timePick: [],
      tableKey: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    initData() {
      switch (this.infoData.code) {
        case 'monthsUsageTrendZj': // 镇街月平台使用总量
        case 'monthsUsageTrendWbj': // 委办局月平台使用总量
        case 'datesUsageTrendZj': // 镇街日平台使用总量
        case 'datesUsageTrendWbj': // 委办局平台使用总量
          for (let iKey in this.tableData[0]) {
            if (iKey !== 'name') {
              this.tableKey.push({key: iKey, label: iKey})
            }
          }
          this.tableKey.sort((a, b) => {
            return a.key > b.key ? 1 : -1
          })
          break
        case 'frequencyRankZj': // 镇街使用率前三的功能模块
        case 'frequencyRankWbj': // 委办局使用率前三的功能模块
          this.tableKey = [
            {key: 'gnmk', label: '功能模板'},
            {key: 'count', label: '使用次数'},
            {key: 'total', label: '合计'},
          ]
          break
        default:
          this.tableKey = [
            {key: 'worker', label: '现有工作人员总数'},
            {key: 'workerUse', label: '使用过的工作人员数量'},
            {key: 'useCount', label: '平台使用次数'},
          ]
          break
      }
    },
    async Export() {
      let params = {}
      if (this.infoData.timePick) {
        params.start = !this.infoData.endDate ? this.infoData.timePick[0] : undefined
        params.end = this.infoData.timePick[1]
      }
      switch (this.infoData.code) {
        case 'monthsUsageTrendZj': // 镇街月平台使用总量
          await exportMonthsUseZj(params)
          break
        case 'monthsUsageTrendWbj': // 委办局月平台使用总量
          await exportMonthsUseWbj(params)
          break
        case 'datesUsageTrendZj': // 镇街日平台使用总量
          await exportDayUseZj(params)
          break
        case 'datesUsageTrendWbj': // 委办局平台使用总量
          await exportDayUseWbj(params)
          break
        case 'frequencyRankWbj': // 委办局使用率前三的功能模块
          await exportRankWbj(params)
          break
        default:
          await exportUseWbj(params)
          break
      }
    },

    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (['frequencyRankZj', 'frequencyRankWbj'].includes(this.infoData.code)) {
        let arr = this.tableData
        //合并单元格
        let tempCount = [] //合并的行
        let tempIndex = 0 //合并的行的索引
        arr.forEach((item, index) => {
          if (index === 0) {
            tempCount.push(1)
            tempIndex = 0
          } else {
            if (arr[index].name == arr[index - 1].name) {
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
        if (columnIndex == 0 || columnIndex == 3) {
          return [row.rowSpan, 1]
        } else {
          return [1, 1]
        }
      }
    }

  },
};
</script>

<style lang="scss" scoped>
.more-chart-wrap {
  overflow: hidden;

  ::v-deep.el-dialog__body {
    padding: 0;
  }

  .risk-title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    display: inline-block;

    .time {
      font-size: 16px;
    }
  }

  .table-wrap {
    width: 100%;
    margin-top: 20px;
    overflow: auto;
    //height: 80vh;
    //min-height: 480px;
  }

  .btn {
    margin-left: 40px;
  }
}
</style>
