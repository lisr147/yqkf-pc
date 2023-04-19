<template>
  <el-dialog
    class="c-big-chart"
    :modal="false"
    append-to-body
    :visible="true"
    :close-on-click-modal="false"
    top="11vh"
    @close="$emit('showBigClose', false)"
    custom-class="big-chart-wrap"
    width="1240px"
  >
    <template slot="title">
      <div class="risk-title">{{ town }}{{ data.title }}</div>
    </template>
    <div class="big-chart-box" :style="{ height: height }">
      <TimeTabs
        v-if="data.info.hasTabs"
        :default-value="data.tabValue"
        @change="handleTabChange($event, data)"
      ></TimeTabs>
      <div class="time" v-if="data.hasSelectTime">
        <el-date-picker
          v-model="timePick"
          @change="changeTime(data)"
          value-format="yyyy-MM-dd"
          type="daterange"
          size="large"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <ChartBoard
        class="chart"
        ref="bigChart"
        :data="data"
        :info="data.info"
        :scale="scale"
        :showBigBtn = "false"
      ></ChartBoard>
    </div>
  </el-dialog>
</template>

<script>
import ChartBoard from "@/components/charts/ChartBoard";
import TimeTabs from "../../views/big/VehicleStatisticsPanel/TimeTabs";
import { getPanelItemDataByCode } from "@/api/chart";
export default {
  name: "bigChart",
  components: { ChartBoard, TimeTabs },
  props: {
    data: { type: Object, required: true },
    height: { type: String, default: "600px" },
  },
  data() {
    return {
      visible: false,
      town: "", //所属镇街
      scale: 2, //缩放比例
      timePick: "",
    };
  },
  mounted() {
    console.log(35, this.data);
    this.town = this.$store.state.common.town;
    //密接、次密接累计趋势特殊处理
    if (this.data.info.title) {
      this.data.title = this.data.info.title;
    }
  },
  methods: {
    async handleTabChange(tabValue, item) {
      // console.log(44,tabValue,item);
      let code = item.info.code;
      let period = item.info.period;
      let pcode = code;
      let carCode = ["vehicleTimes", "vehicleMileage"]; //负压车辆
      if (carCode.includes(code)) {
        pcode = code;
      } else {
        switch (tabValue) {
          case "month":
            pcode = period[2];
            break;
          case "week":
            pcode = period[1];
            break;
          default:
            pcode = period[0];
            break;
        }
      }
      var res = await getPanelItemDataByCode({
        code: pcode,
        type: tabValue,
        showModal: false,
      });
      this.$refs[`bigChart`].updateData(res);
    },
    async changeTime(item) {
      let params = {
        code: item.code,
        showModal: false,
      };
      let time = this.timePick;
      if (time) {
        params.startTime = time[0];
        params.endTime = time[1];
      }
      var res = await getPanelItemDataByCode(params);
      this.$refs[`bigChart`].updateData(res);
    },
  },
};
</script>

<style lang="scss" scoped>
.big-chart-box {
  height: 100%;
  width: 100%;
  background-color: rgba(32, 50, 111, 1);
  position: relative;
  .time-tabs {
    width: 300px;
    font-size: 16px;
    color: #fff;
    .time-tabs-item {
      color: #fff;
    }
  }
  .time {
    position: absolute;
    z-index: 9999;
    right: 30px;
    top: 40px;
    ::v-deep.el-range-editor {
      width: 100%;
      background-color: #3f60ad;
      color: #ffffff;
      border: none;
      .el-range-input {
        background-color: #3f60ad;
        color: #ffffff;
      }
      .el-range-separator {
        color: #ffffff;
      }
    }
  }
}
.risk-title {
  font-size: 22px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #fff;
}
</style>
<style lang="scss" type="text/scss">
.c-big-chart {
  .el-dialog {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 11vh;
    margin: 0 auto !important;
    border: 14px solid transparent !important;
    border-image: url("~@/assets/image/dialog-bg.png") 14 !important;
    background-color: transparent;
    box-shadow: none;

    &__header {
      padding: 0px 10px 8px;
      border-bottom: 2px solid #364f9a;
      background-color: rgba(32, 50, 111, 0.95);
      color: #fff;
      margin: -1px;
      p {
        color: #fff;
        display: inline-block;
        margin: 0 4px;
      }
    }
    &__headerbtn {
      top: 4px;
      right: 10px;
      .el-dialog__close {
        color: #fff;
      }
    }
    &__body {
      padding: 10px 10px;
      margin: -1px;
      background-color: rgba(32, 50, 111, 0.95);
    }
    &__title {
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>
