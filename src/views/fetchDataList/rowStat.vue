<!-- 新增、编辑、查看详细数据-->
<template>
  <el-dialog :visible="true" top="4vh" :title="title" append-to-body :close-on-click-modal="false"
    @close="$emit('close')" width="800px" class="stat-dialog" :custom-class="isBigStyle">
    <div class="filter-bar">
      <!-- 选择日、周、月 -->
      <div class="category">
        <el-button v-for="(item, index) in ['日', '周', '月']" :key="index" type="primary"
          :plain="choosedCategory !== item" @click="chooseFilterCategory(item)">
          {{ item }}
        </el-button>
      </div>
      <!-- 时间段选择 -->
      <div class="date-picker">
        <span class="date-label">日期</span>
        <el-date-picker v-model="dateValue" value-format="yyyy-MM-dd" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期" :disabled="choosedCategory !== '日'"
          :picker-options="pickerOptions" @blur="handleDatePickerBlur" @change="handleDatePickerChange" size="small">
        </el-date-picker>
      </div>
      <!-- 导出数据 -->
      <el-button class="export-btn" type="primary" @click="exportData">导出数据</el-button>
    </div>
    <div class="chart-wrapper">
      <chart-board ref="chartBoard" :data="statData" :info="statData.info" v-if="statData" :error-style="errorStyle"
        :show-big-btn="false" />
    </div>
  </el-dialog>
</template>
<script>
import ChartBoard from "@/components/charts/ChartBoard";
import { getPanelItemDataByCode } from "@/api/chart";
import { exportSceneDetailStat } from "@/api/mapData";

const day1 = 24 * 3600 * 1000;
const day30 = 30 * day1;

let pickerMinDate = null;
let startTime = ""; //本月第一天日期
let endTime = ""; // 当天日期

export default {
  name: "rowDataStat",
  props: {
    data:{
      type:Object,
    },
    isBigStyle: {
      type: String,
      default: ''
    },
    codeList:{
      type:Object,
      default:{
        日: "commonPlaceDay",
        周: "commonPlaceWeek",
        月: "commonPlaceMonth",
      }
    }
  },
  components: { ChartBoard },
  provide() {
    return {
      handleItemChoosed: this.handleItemChoosed,
    };
  },
  computed: {
    title() {
      if (this.data.stationName) {
        return this.data.stationName + "场所扫码统计";
      } else {
        return "扫码统计";
      }

    },
  },
  data() {
    return {
      statData: null,
      choosedCategory: "日",
      dateValue: "", // 用户选择的起始日期
      // codeList: {
      //   日: "commonPlaceDay",
      //   周: "commonPlaceWeek",
      //   月: "commonPlaceMonth",
      // },
      pickerOptions: {
        // eslint-disable-next-line no-unused-vars
        onPick: ({ maxDate, minDate }) => {
          if (minDate && pickerMinDate) {
            pickerMinDate = null;
          } else if (minDate) {
            pickerMinDate = minDate.getTime();
          }
        },
        disabledDate(time) {
          const isAfter = time.getTime() > Date.now() - day1;
          if (pickerMinDate) {
            return (
              time.getTime() > pickerMinDate + day30 ||
              time.getTime() < pickerMinDate - day30 ||
              isAfter
            );
          }
          return isAfter;
        },
      },
      errorStyle: {
        color: "#333",
      },
    };
  },
  async mounted() {
    if([10027,10055].includes(this.data.templateId)){
      if(this.data.ggcsIds){
        this.data.stationId = this.data.ggcsIds
      }else {
        this.data.stationId =''
      }
    }
    this.getCurrentMonthDays();
    this.getChartData();
  },
  methods: {
    async getChartData() {
      const params = {
        code: this.codeList[this.choosedCategory],
        id: this.data.stationId,
      };
      if (this.choosedCategory === "日") {
        params.start = (this.dateValue && this.dateValue[0]) || startTime;
        params.end = (this.dateValue && this.dateValue[1]) || endTime;
      }
      const res = await getPanelItemDataByCode(params);
      this.statData = {
        ...res,
        info: { code: this.codeList[this.choosedCategory] },
      };
    },
    handleItemChoosed() { },
    async chooseFilterCategory(item) {
      if (item === this.choosedCategory) return;
      if (["周", "月"].includes(item)) {
        this.dateValue = "";
      }
      this.choosedCategory = item;
      await this.getChartData();
      this.$refs.chartBoard.updateData(this.statData);
    },
    exportData() {
      exportSceneDetailStat({
        start: (this.dateValue && this.dateValue[0]) || "",
        end: (this.dateValue && this.dateValue[1]) || "",
        id: this.data.stationId,
      });
    },
    handleDatePickerBlur() {
      pickerMinDate = null;
    },
    async handleDatePickerChange() {
      await this.getChartData();
      this.$refs.chartBoard.updateData(this.statData);
    },
    /**
     * 获取当天和前30天日期
     */
    getCurrentMonthDays() {
      // 获取当天日期
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      endTime = this.formatDate(year, month, day);

      // 获取当天日期前第30天日期
      date = new Date(date - day30);
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
      startTime = this.formatDate(year, month, day);
    },
    /**
     * 格式化日期
     */
    formatDate(year, month, day) {
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return year + "-" + month + "-" + day;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  background-color: rgb(242, 242, 242);
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 50px;

  .category {
    display: flex;
  }

  .date-picker {
    background-color: #fff;
    padding: 10px;
    margin: 0 20px;

    .date-label {
      margin: 0 5px 10px;
    }
  }
}

.chart-wrapper {
  height: 400px;
}
</style>
<style lang="scss">
// el-dialoge的自定义样式
.custom-style {
  background-color: rgba(32, 50, 111, 0.95) !important;

  .el-dialog__title {
    color: #fff;
  }
  
  .el-dialog__body {
    .filter-bar {
      .category {
        .el-button--primary {
          background-color: #3B56F4;
          border: none;
        }

        .el-button--primary.is-plain {
          color: #606266;
          border-radius: 3px;
          background-color: #fff;

          &:hover,
          &:active {
            background-color: #3B56F4;
            color: #fff;
          }
        }
      }

      // 导出按钮样式
      .el-button--primary {
        background-color: #3B56F4;
        border: none;
      }

      .date-picker {
        background-color: transparent;
        border: none;
        color: #fff;
        border-radius: 4px;


        .el-range-editor.el-input__inner {
          background-color: #3f60ad;
          border: none;

          input {
            background-color: transparent !important;
            color: #fff;
          }

          span {
            color: #fff;
          }

        }
      }

    }

    .chart-wrapper {
      .box {
        .chart{
          .error {
            color: #fff !important;
          }
        }
      }
    }

  }


}
</style>
