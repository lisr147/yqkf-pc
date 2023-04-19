<template>
  <!-- 填写情况 -->
  <div class="fill-data">
    <table-page :data="vdata" :filter="filterData" :hideSearch="true" />
    <chart-board
      :data="chartData"
      v-if="chartData"
      class="fill-charts"
      :key="`fill_charts_${formId}`"
    />
    <fill-data-list :form-key="formId" v-if="dialog==='list'" @close="dialog=null"/>
  </div>
</template>
<script>
import {
  getFillingStatus,
  exportUnCompleteData
} from "@/api/statics";
import TablePage from "zkzc-table-page";
import ChartBoard from "@/components/echarts/ChartBoard.vue";
import FillDataList from './FillDataList'
export default {
  name: "FillData",
  components: {
    TablePage,
    ChartBoard,
    FillDataList
  },
  props: {
    formId: { type: String },
    formData: { type: Object },
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
            id: "fillType",
            label: "填写情况",
          },
          {
            id: "num",
            label: "数量",
          },
          {
            id: "ratio",
            label: "百分比",
          },
        ],
        columnFunctionsWidth: 160,
        tableFunctions: []
      },
      chartData: null,
      dialog:null
    };
  },
  methods: {
    async init() {
      this.chartData = null;
      let res = await getFillingStatus({ formKey: this.formId });
      console.log("getFillingStatus", res);
      this.chartData = res;
      this.vdata.tableData = [];
      let total = 0;
      let isCrowd = ['GOVERNMENT',"SELECTION"].includes( this.formData.submitSettings.submitScope ) ;
      res.series[0].data.forEach((v) => {
        total += v.value;
      });

      if (!isCrowd) {
        res.series[0].data = res.series[0].data.filter(
          (v) => v.name === "已填写"
        );
        this.vdata.tableFunctions=[]
      }
      else{
          this.vdata.tableFunctions = [
          // 操作栏
          {
            label: "查看名单",
            method: this.showList,
            hidden(data) {
              return data.row.fillType !== "未填写";
            },
          },
          {
            label: "导出名单",
            method: this.exportList,
            hidden(data) {
              return data.row.fillType !== "未填写";
            },
          },
        ]
      }
      res.series[0].data.forEach((v) => {
        this.vdata.tableData.unshift({
          fillType: v.name,
          num: v.value,
          ratio: total ? Math.floor((v.value / total) * 10000) / 100 + "%" : "",
        });
      });
      if (isCrowd) {
        this.vdata.tableData.unshift({
          fillType: "应填人数",
          num: total,
          ratio: "",
        });
      }
    },
    showList(){
        this.dialog='list'
    },
    exportList(){
        console.log('exportList')
        exportUnCompleteData({ formKey: this.formId });
    }
  },
};
</script>
<style lang="scss" scoped>
.fill-data {
  display: flex;
  width: 100%;
  .fill-charts {
    width: 40%;
    height: 400px;
  }
}
</style>
