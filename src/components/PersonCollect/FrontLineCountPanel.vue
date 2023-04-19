<template>
  <el-dialog
      :visible="true"
      top="10vh"
      :title="`一线人员数据统计`"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="70vw">

    <div class="frontline-count-panel">

      <div class="toolbar">
        <span>值岗日期：</span>
        <el-date-picker
            v-model="filter.date"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"/>
        <el-button type="primary" style="margin-left: 1em;" @click="getData">查询</el-button>
        <el-button icon="el-icon-download" type="primary" plain @click="exportFile">导出</el-button>
      </div>

      <el-table
          :data="tableData"
          :span-method="arraySpanMethod"
          max-height="500px"
          style="width: 100%">
        <el-table-column
            prop="unitType"
            label="单位类型"
            width="150">
        </el-table-column>
        <el-table-column
            prop="unit"
            label="所属单位">
        </el-table-column>
        <el-table-column
            label="总人数"
            align="center"
            width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.total>0" class="link"  @click="seeMore(scope.row, 'total')">{{scope.row.total}}</span>
            <span v-else>{{scope.row.total}}</span>
          </template>
        </el-table-column>
        <el-table-column label="3天内未做核酸">
          <el-table-column
              prop="never_count"
              label="人数"
              align="center"
              width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.never_count" class="link" @click="seeMore(scope.row, 'never_count')">{{scope.row.never_count}}</span>
              <span v-else>{{scope.row.never_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="never_percent"
              label="占比"
              align="center"
              width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column label="3天内核酸1次">
          <el-table-column
              prop="one_count"
              label="人数"
              align="center"
              width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.one_count" class="link" type="text" @click="seeMore(scope.row, 'one_count')">{{scope.row.one_count}}</span>
              <span v-else>{{scope.row.one_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="one_percent"
              label="占比"
              align="center"
              width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column label="3天内核酸2次及以上">
          <el-table-column
              prop="two_count"
              label="人数"
              align="center"
              width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.two_count" class="link" @click="seeMore(scope.row, 'two_count')">{{scope.row.two_count}}</span>
              <span v-else>{{scope.row.two_count}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="two_percent"
              label="占比"
              align="center"
              width="120">
          </el-table-column>
        </el-table-column>
      </el-table>

    </div>


  </el-dialog>
</template>

<script>
import {getNucleicStatistics, exportFrontLineStatistics} from '@/api/frontLineStaff'
import {formatDate} from '@/utils/common'
export default {
  name: "FrontLineCountPanel",
  components: {},
  data() {
    return {

      filter: {
        date: ''
      },

      tableData: [],

      dictMap: {
        total: 'all',
        one_count: 'jcyc',
        two_count: 'jclcjys',
        never_count: 'wjc'
      }
    }
  },
  mounted() {
    this.filter.date = formatDate(new Date()- 24*60*60*1000)
    this.getData()
  },
  methods: {

    async exportFile(){
      await exportFrontLineStatistics({tjsj: this.filter.date})
    },

    async getData() {

      const res = await getNucleicStatistics({
        tjsj: this.filter.date
      })

      const arr = []
      res.forEach(item=>{
        const {dwlx} = item
        const len = item.data.length
        item.data.forEach((v,index)=>{
          const {total, ssdw, wzhs, hsyc, hslcys} = v
          arr.push({
            rowSpan: index == 0 ? len: 0,
            unitType: dwlx,
            unit: ssdw,
            total: total,
            never_count: wzhs.num,
            never_percent: wzhs.percent,
            one_count:  hsyc.num,
            one_percent: hsyc.percent,
            two_count:  hslcys.num,
            two_percent: hslcys.percent
          })
        })

      })

      this.tableData = arr

    },

    seeMore(row, type){

      const {unitType, unit} = row
      const cond = {
        tjsj: this.filter.date, //统计时间
        dwlx: unitType, //单位类型
        ssdw: unit, //所属单位
        hsjcqk: this.dictMap[type] //核酸检测情况
      }
      this.$emit('popDetail', {cond})
    },

    //table 单元格合并
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {

      if (columnIndex == 0) {
        return [row.rowSpan, 1]
      } else {
        return [1, 1]
      }
    },

  }
}
</script>

<style lang="scss" type="text/scss">
.frontline-count-panel{
  .toolbar{
    padding: 1em 0;
  }
  .link{
    display: inline-block;
    color: #409EFF;
    font-size: 14px;
    cursor: pointer;

    &:hover{
      text-decoration: underline;
    }
  }
}
</style>
