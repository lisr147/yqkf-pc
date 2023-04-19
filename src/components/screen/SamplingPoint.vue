<template>
  <div class="point-box board">
    <div class="header">
      <h3 class="title">
        {{town}}核酸检测采样点
        <el-popover
            popper-class="screen-popover"
            width="360"
            trigger="hover">
          {{about}}
          <i slot="reference" style="color: #fff;" class="el-icon-question"></i>
        </el-popover>
      </h3>
    </div>
    <el-table :data="areaName" border style="width: 100%;margin-top: 10px" :show-summary="false" @cell-click="handle" >
      <el-table-column
          fixed
          prop="name"
          label="镇街"
          align="center"
         >
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column v-for="(item,index) in tableKey" :key="item.index"
                       :prop="item.key"
                       :label="item.name"
                       :width="item.width"
                       align="center"
      >
        <template slot-scope="scope">
         <el-link>{{ scope.row[item.key]}}</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer" style="margin-top: 5px">
      <span>
        更新时间：{{dataInfo.updateTime||'2022-01-22 07:29:42'}}
        <br>数据来源：{{ dataInfo.source||'区卫健局' }}
      </span>
    </div>
  </div>
</template>

<script>


import {getNucleicAcidStreet} from "@/api/bigCharts";
import {mapState } from 'vuex'
export default {
  name: "SamplingPoint",
  components: {},
  props: ["data"],
  data() {
    return {
      dataInfo: {},
      tableKey: [
        {name: '应检尽检', key: 'YIJJJ', width: "65"},
        {name: '愿检尽检', key: 'YJJJ', width: "65"},
        {name: '黄码人员', key: 'HMRY',width: "65"},
        {name: '中高风险来南沙', key: 'ZGFXLNS',width: "65"}
      ],
      areaName: [],
      about: `按应检尽检、愿检尽检、黄码人员采样点、中高风险来南沙采样点四种服务人群类别，统计各镇街分布的常规核酸采样点和大规模核酸筛查社区采样点数量。
      该数据由区卫生健康局通过在疫情防控指挥平台数据台账管理系统上传数据方式每周更新。`
    }
  },
  watch: {
    town(val){
      this.sszj  = val
      this.getData()
    },
  },
  computed: {
    ...mapState('common', ['town'])
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData () {
      await getNucleicAcidStreet().then(res => {
        this.areaName = res.data
        this.dataInfo =res
      })
    },
    handle(row, column, cell, event) {

      let fwrq = column.label
      if (column.label.includes('中高风险来南沙')) {
        fwrq = '中高风险所在城市来（返）南沙'
      } else if (column.label.includes('黄码人员')) {
        fwrq = '黄码'
      } else if (column.label.includes('应检尽检')) {
        fwrq = '应检尽检人群'
      }

      let item = {
        sszj: this.sszj?this.sszj:(row.name === '合计' ? '' : row.name),
        fwrq
      }
      this.$emit('showSamplingPointList',item)

    }
  },

}
</script>

<style lang="scss">
$borderColor: #364f9a;
$backColor: rgba(19, 42, 101, 1);
$yellowColor: #ffff00;
.point-box {
  overflow-y: auto;
  padding-right: 10px;

  .el-table th {
    background: $backColor;
    color: #fff;
  }

  .el-table thead tr th {
    background-color: rgba(45, 85, 208, 0.3);
  }

  .el-table .cell,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell {
    padding: 0 2px;
  }

  .el-table th,
  .el-table tr {
    color: #fff;
    background: $backColor;
    border-color: $borderColor;
    text-align: center;
  }

  .el-table td {
    border-color: $borderColor;
  }

  .el-table tr {
    color: $yellowColor;
  }

  .el-table tr td:first-child {
    color: #fff;
    background-color: rgba(45, 85, 208, 0.3);

    &:hover {
      background-color: rgba(45, 85, 208, 0.3);
    }
  }

  .el-table .cell {
    padding: 0 2px;
  }

  .el-table--border,
  .el-table--group {
    border-color: $borderColor;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    //color: none;
    background: none
  }

  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: $borderColor;
  }

  .el-table__fixed-right::before, .el-table__fixed::before {
    background: none;
  }

  .el-table-row .hover-row {
    //color: none;
    background-color: transparent;
  }

  .has-gutter tr {
    //background-color:#ffffff;

  }

  .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
    background-color: transparent;
    color: $yellowColor;
  }

  .el-table__body tr.hover-row.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped > td,
  .el-table__body tr.hover-row > td {
    background-color: transparent;
    //background-color: rgba(45, 85, 208, 0.3);
  }
  .el-link.el-link--default{
    color: $yellowColor;
  }
}
</style>







