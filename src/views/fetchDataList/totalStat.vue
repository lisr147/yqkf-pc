<!-- 新增、编辑、查看详细数据-->
<template>
  <el-dialog :visible="true" top="4vh" title="扫码统计" append-to-body :close-on-click-modal="false" @close="$emit('close')"
    width="800px" class="stat-dialog">
    <el-button class="place-stat-btn" type="primary" @click="exportEachPlaceStatData">导出各场所统计明细</el-button>
    <div class="stat-wrapper" v-for="(item, index) in Object.keys(statData)" :key="index">
      <div class="stat-title" v-if="statData[item].title">
        {{ statData[item].title }}
      </div>
      <div class="filter-bar">
        <!-- 时间段选择 -->
        <div class="date-picker">
          <span class="date-label">日期</span>
          <el-date-picker v-model="dateValue[item]" value-format="yyyy-MM-dd" type="daterange" range-separator="-"
            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions[item]"
            @blur="handleDatePickerBlur(item)" @change="handleDatePickerChange(item)">
          </el-date-picker>
        </div>
        <!-- 导出数据 -->
        <el-button class="export-btn" type="primary" @click="exportData(item)">导出</el-button>
      </div>
      <div class="chart-wrapper">
        <chart-board :data="statData[item]" :ref="`${item}chart`" v-if="statData[item].panelItemData"
          :info="statData[item].info" :error-style="errorStyle" />
      </div>
    </div>
  </el-dialog>
</template>
<script>
import ChartBoard from "@/components/charts/ChartBoard";
import { getPanelItemDataByCode } from "@/api/chart";
import { exportSceneDayMoreStat, exportSceneDayStat, exportSceneDetialMoreStat } from '@/api/mapData';
import { mapState } from 'vuex';

const day1 = 24 * 3600 * 1000;
const day30 = 30 * day1;
const pickerMinDate = {};

export default {
  name: "totalDataStat",
  props: ["data"],
  components: { ChartBoard },
  provide() {
    return {
      handleItemChoosed: this.handleItemChoosed,
    };
  },
  computed: {
    ...mapState('user', ['departmentId'])
  },
  data() {
    return {
      statData: {
        totalStat: {},
        placeStat: {}
      },
      dateValue: {
        totalStat: '',
        placeStat: ''
      },
      codeList: {
        totalStat: 'commonPlaceDayMore',
        placeStat: 'commonPlaceDayScene'
      },
      pickerOptions: {},
      errorStyle: {
        color: '#333'
      }
    };
  },
  async mounted() {
    this.initPickerOptions();
    Object.keys(this.codeList).forEach((item) => {
      this.getChartData(item);
    })
  },
  methods: {
    async getChartData(key) {
      const code = this.codeList[key];
      const params = {
        code,
        start: (this.dateValue[key] && this.dateValue[key][0]) || '',
        end: (this.dateValue[key] && this.dateValue[key][1]) || '',
        sszj: this.departmentId || ''
      }
      const res = await getPanelItemDataByCode(params)
      this.statData[key] = { ...res, code, info: { code } }
    },
    initPickerOptions() {
      Object.keys(this.statData).forEach((item) => {
        this.pickerOptions[item] = {
          // eslint-disable-next-line no-unused-vars
          onPick: ({ maxDate, minDate }) => {
            if (minDate && pickerMinDate[item]) {
              pickerMinDate[item] = null;
            }
            else if (minDate) {
              pickerMinDate[item] = minDate.getTime();
            }
          },
          disabledDate(time) {
            const isAfter = time.getTime() > Date.now() - day1;
            if (pickerMinDate[item]) {
              return ((time.getTime() > (pickerMinDate[item] + day30)) || (time.getTime() < (pickerMinDate[item] - day30))) || isAfter;
            }
            return isAfter;
          }
        }
      })
    },
    handleDatePickerBlur(item) {
      pickerMinDate[item] = null;
    },
    handleItemChoosed() {

    },
    exportData(key) {
      const params = {
        start:(this.dateValue[key] && this.dateValue[key][0]) || '',
        end: (this.dateValue[key] && this.dateValue[key][1]) || '',
        sszj: this.departmentId || ''
      }
      const exportFn = key === 'totalStat' ? exportSceneDayMoreStat : exportSceneDayStat;
      exportFn(params);
    },
    exportEachPlaceStatData() {
      exportSceneDetialMoreStat({
        sszj: this.departmentId || ''
      })
    },
    async handleDatePickerChange(key) {
      await this.getChartData(key);
      const chartBoard = this.$refs[key + 'chart'];
      chartBoard[0].updateData(this.statData[key]);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  background-color: rgb(242, 242, 242);
  position: relative;
}

.place-stat-btn {
  position: absolute;
  top: 50px;
  right: 20px;
}

.stat-wrapper {
  background-color: #fff;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-top: 10px;

  .stat-title {
    text-align: center;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 500;
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

      .date-label {
        margin-right: 10px;
      }
    }
  }

  .chart-wrapper {
    height: 560px;
  }
}
</style>
