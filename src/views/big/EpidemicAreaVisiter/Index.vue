<template>
  <div class="wrap">
    <!-- 区域查询 -->
    <div class="_filter">
      <div>
        <label class="label">区域</label>
        <el-select
          v-model="filter.deptName"
          @change="refresh"
          style="width:280px;"
        >
          <el-option
            v-for="(item, i) in areaOptions"
            :key="i"
            :label="item.text"
            :value="item.text"
          ></el-option>
        </el-select>
      </div>
      <!-- tabs -->
      <el-radio-group
        v-model="model"
        style="margin-right:10px"
        @change="handleModel"
      >
        <el-radio-button label="current">今日数据</el-radio-button>
        <el-radio-button label="history">历史数据</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 日期查询 -->
    <div class="_filter2" v-if="model === 'history'">
      <label class="label">流入时间</label>
      <el-date-picker
        v-model="filter.date"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <el-button
        type="primary"
        size="mini"
        style="margin-left:20px;"
        @click="search"
        >查询</el-button
      >
      <el-button size="mini" @click="rest">重置</el-button>
    </div>
    <!-- 人口统计卡片 -->
    <CountingCard
      :msg="filter"
      @updateRiskLevel="updateRiskLevel"
      ref="CountingCard"
    />
    <div class="visualization">
      <!-- 左侧图表 -->
      <div class="chart left">
        <Percent :msg="filter" @ranking="ranking = $event" ref="Percent" />
      </div>
      <!-- 地图图表 -->
      <div class="map">
        <ChartMap :msg="filter" :ranking="ranking"></ChartMap>
      </div>
      <!-- 右侧图表 -->
      <div class="chart right">
        <ChartBoard
          class="chart"
          v-if="chartData"
          ref="bigChart"
          :data="chartData"
          :info="chartInfo"
        ></ChartBoard>
        <LineChart :msg="filter" ref="LineChart" />
      </div>
    </div>
  </div>
</template>

<script>
import CountingCard from "./countingCard.vue";
import Percent from "./chart_percent.vue";
import LineChart from "./chart_line.vue";
import ChartMap from "./chart_map.vue";
import ChartBoard from "@/components/charts/ChartBoard";
import { getPanelItemDataByCode } from "@/api/EpidemicAreaVisiter";

export default {
  name: "EpidemicAreaVisiter",
  components: {
    CountingCard,
    Percent,
    LineChart,
    ChartMap,
    ChartBoard,
  },

  data() {
    return {
      model: "current", //current、history
      ranking: [], //风险地区流入人口排行
      chartData: null,
      chartInfo: {},
      filter: {
        deptName: "南沙区",
        areaType: 2, //0省 1市 2区县 3街道
        date: "",
        riskLevel: 2, //风险级别 0低 1中 2高
      },
      areaOptions: [
        { text: "南沙区", areaType: 2 },
        { text: "南沙街", areaType: 3 },
        { text: "黄阁镇", areaType: 3 },
        { text: "万顷沙镇", areaType: 3 },
        { text: "东涌镇", areaType: 3 },
        { text: "榄核镇", areaType: 3 },
        { text: "横沥镇", areaType: 3 },
        { text: "大岗镇", areaType: 3 },
        { text: "珠江街", areaType: 3 },
        { text: "龙穴街", areaType: 3 },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  watch: {
    "filter.deptName"(val) {
      this.filter.areaType = this.areaOptions.find(
        (v) => v.text === val
      ).areaType;
    },
  },
  created() {
    this.fetchEpidemicData();
  },
  mounted() {},
  methods: {
    /**
     * 刷新
     */
    refresh() {
      console.log(this.filter);
      this.$nextTick(() => {
        this.$refs.LineChart.getData();
        this.$refs.Percent.getData();
        this.$refs.CountingCard.getData();
        this.fetchEpidemicData();
      });
    },
    fetchEpidemicData() {
      const {
        filter: { riskLevel },
      } = this;
      if (riskLevel === 3) {
        this.chartData = null;
        return;
      }
      const riskLevelText = ["低", "中", "高"];
      getPanelItemDataByCode({
        ...this.filter,
        code: "jrzgfxgzjpm",
      }).then((res) => {
        this.chartData = res;
        try {
          this.$refs["bigChart"].updateData(res);
        } catch(e) {
          console.log(e);
        }
        const { updateTime = "" } = res.panelItemData.optionData;
        this.chartInfo = {
          updateTime,
          code: res.code,
          title: `今日${riskLevelText[riskLevel]}风险地区流入各镇街人员排名`,
          showInfo: true
        };
      });
    },
    /**
     * 更新风险等级
     */
    updateRiskLevel(v) {
      this.$set(this.filter, "riskLevel", v);
      this.refresh();
    },
    /**
     * 查询
     */
    search() {
      //refresh
      this.refresh();
    },
    /**
     * 重置
     */
    rest() {
      let filter = JSON.parse(JSON.stringify(this.$options.data().filter));
      this.$set(this, "filter", filter);
      this.time = "";
      this.refresh();
    },
    /**
     * 切换 今日数据-历史数据
     */
    handleModel() {
      if (this.model === "current") {
        this.rest();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
._filter {
  display: flex;
  justify-content: space-between;
  padding: 7px 0 11px;
  box-shadow: inset 0px -1px 0px 0px rgba(255, 255, 255, 0.15);
}
._filter2 {
  padding: 17px 0 11px;
}
.label {
  width: 60px;
  display: inline-block;
  text-align: right;
  color: #ffffff;
  padding-right: 10px;
}
.visualization {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  .chart {
    flex: 1;
    &.left {
      padding: 0 69px 0 0;
    }
    &.right {
      padding: 0 0 0 75px;
    }
  }
  .map {
    width: 884px;
    height: 628px;
    position: relative;
    box-sizing: border-box;
    background-color: #223e7e;
  }
}

// 重置element UI
@import "@/assets/css/variables.scss";
::v-deep .el-input__inner {
  background-color: $input_background_color;
  color: #fff;
  border: 0;
}
::v-deep .el-range-input {
  background-color: $input_background_color;
  color: #fff;
}
::v-deep .el-range-separator {
  color: #fff;
}
::v-deep .el-radio-button__inner {
  background: $btn_background_color2;
  border: 1px solid $btn_border_color;
  border-left: 0;
  color: #ffffff;
  &:hover {
    background: $btn_background_color_hover2;
  }
}
::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-left: 1px solid $btn_border_color;
  border-right: 0;
}
::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #fff;
  background-color: $btn_background_color;
  border-color: $btn_background_color;
  box-shadow: -1px 0 0 0 $btn_background_color;
  &:hover {
    background-color: $btn_background_color_hover;
    border-color: $btn_background_color_hover;
    box-shadow: -1px 0 0 0 $btn_background_color_hover;
  }
}
::v-deep .el-button {
  color: #fff;
  background: $btn_background_color2;
  border: 1px solid $btn_border_color;
  &:hover {
    background: $btn_background_color_hover2;
  }
}
::v-deep .el-button--mini {
  padding: 9px 15px;
}
::v-deep .el-button--primary {
  color: #fff;
  background-color: $btn_background_color;
  border-color: $btn_background_color;
  &:hover {
    background-color: $btn_background_color_hover;
    border-color: $btn_background_color_hover;
  }
}
.chart {
  height: 280px;
}
</style>
