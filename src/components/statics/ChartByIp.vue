<template>
  <div>
    <table-page :data="vdata" :filter="filterData" :hideSearch="true" />
    <chart-board
      :data="chartData"
      v-if="chartData"
      :key="`ip_charts_${formId}`"
    />
  </div>
</template>

<script>
import TablePage from "zkzc-table-page";
import ChartBoard from "@/components/echarts/ChartBoard.vue";

import { topIp } from "@/api/statics";
export default {
  name: "ChartByIp",
  components: { TablePage, ChartBoard },
  props: {
    formId: { type: String },
  },
  watch: {
    formId: {
      handler(val) {
        if (!val) return;
        this.init();
      },
      immediate: true,
    },
  },
  data() {
    return {
      filterData: {
        pageNum: 1,
        rowTotal: 0,
      },
      vdata: {
        tableData: [],
        tableKeys: [
          {
            id: "ip",
            label: "IP地址",
          },
          {
            id: "num",
            label: "填写次数",
          },
        ],
        columnFunctionsWidth: 160,
        tableFunctions: [
          {
            label: "查看详情",
            method: this.showList,
          },
        ],
      },
      chartData: null,
    };
  },
  mounted() {},
  methods: {
    async init() {
      this.chartData = null;
      let res = await topIp({ formKey: this.formId });
      if (!res.series[0].data) {
        return;
      }
      this.chartData = res;
      this.chartData.series[0].barWidth = "30";
      this.chartData.series[0].label = {
        show: true,
        color: "#fff",
      };
      this.vdata.tableData = [];

      res.series[0].data.forEach((v) => {
        this.vdata.tableData.push({
          num: v,
        });
      });
      res.yAxis[0].data.forEach((v, i) => {
        this.vdata.tableData[i].ip = v;
      });
    },
    showList(data) {
      this.$emit("showIpDetail", data.row.ip);
    },
  },
};
</script>

<style lang="scss" scoped></style>
