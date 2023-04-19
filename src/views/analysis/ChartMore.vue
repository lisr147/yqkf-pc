<template>
  <el-dialog
    class="more-chart-wrap"
    :modal="false"
    append-to-body
    :visible="true"
    :close-on-click-modal="false"
    top="5vh"
    @close="$emit('showBigClose', false)"
    width="96vw"
  >
    <template slot="title">
      <div class="risk-title">{{ data.title }}
        <span class="time" v-if="data.info.timePick&&data.info.activeTab==='使用情况查询'">({{data.info.timePick[0]}}至{{data.info.timePick[1]}})</span>
      </div>
      <el-button type="primary" class="btn" @click="Export">导出</el-button>
    </template>
    <div class="big-chart-box" :style="{ height: height }">
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
        from="analysis-more"
        @Export="Export"
        :style="{height:allHeight+'px'}"
      ></ChartBoard>
    </div>
  </el-dialog>
</template>

<script>
import ChartBoard from "@/components/charts/ChartBoard";
import {getPanelItemDataByCode} from "@/api/chart";

export default {
  name: "ChartMore",
  components: {ChartBoard},
  props: {
    data: {type: Object, required: true},
    height: {type: String, default: "80vh"},
  },
  data() {
    return {
      visible: false,
      scale: 1.2, //缩放比例
      timePick: "",
      allHeight: '500'
    };
  },
  mounted() {
    console.log(this.data);
    let dataCount = this.data.panelItemData.optionData?.series[0]?.data.length || 0
    this.allHeight = dataCount > 6 ? dataCount * 80 : 500
  },
  methods: {
    Export(){
      this.$refs.bigChart.Export()
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
.more-chart-wrap {
  overflow: hidden;

  .big-chart-box {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    margin-top: -20px;
    position: relative;

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
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    display: inline-block;

    .time {
      font-size: 16px;
    }
  }

  .btn {
    margin-left: 40px;
  }
}


</style>
