<template>
  <div >

    <table-page
      @search="search"
      @resetSearch="resetSearch"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      :data="vdata"
      :filter="filterData">

      <template slot="controler">
        <chart-board
          class="time-chart"
          v-if="chartData"
          :data="chartData">
        </chart-board>
      </template>

      <!--搜索-->
      <template slot="searchFilter">
        <el-form class="area-main-filter" :inline="true" :model="filterData" @keyup.enter.native="search">
          <el-form-item label="提交日期">
            <el-date-picker
              v-model="filterData.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>

    </table-page>

  </div>
</template>

<script>
  import TablePage from 'zkzc-table-page'
  import ChartBoard from "@/components/echarts/ChartBoard"
  import {pageRange} from '@/config/setting'

  export default {
    name: "ChartByTime",
    components: {
      TablePage,
      ChartBoard
    },
    props: {
      formId: { type: String }
    },
    data() {
      return {
        filterData:{
          dateRange: '',

          pageNum: 1,
          pageSize: pageRange[0],
          rowTotal: 0,
          pageSizes: pageRange,
        },
        vdata: {
          tableData: [],
          tableKeys: [{
            id: "date",
            label: "日期",
            minWidth: 150
          },{
            id: "amount",
            label: "填写数量"
          },{
            id: "percent",
            label: "百分比",
            minWidth: 150
          }],
          tableFunctions:[
            //操作栏
            {
              label:"查看详细",
              method:this.viewDetail
            }
          ]
        },

        chartData: null

      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData(){

        setTimeout(()=>{

          const arr =[]
          for (let i = 0; i < 10; i++) {
            arr.push({
              date: '2021-02-02',
              amount:  parseInt(Math.random() * 200 ),
              percent: parseInt(Math.random() * 25),
              id: i
            })
          }
          this.vdata.tableData = arr

          this.filterData.pageNum = 1
          this.filterData.rowTotal = 120

          this.getChartData(arr)

        }, 500)

      },

      getChartData(arr){

        const xArr = [], yArr =[]
        arr.forEach(item => {
          xArr.push(item.date)
          yArr.push(item.amount)
        })

        this.chartData = {
          xAxis: {
            type: 'category',
            data: xArr
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: yArr,
            type: 'line',
            areaStyle: {},
            // smooth: true
          }],
          grid: {
            left: '4%',
            right:'4%',
            bottom: '8%'
          },
          tooltip: {
            trigger: 'axis',
            position: 'inside'
          }
        }

      },

      search() {
        this.filterData.pageNum = 1
        this.getData()
      },
      resetSearch() {
        this.reset()
        this.getData()
      },
      reset(){
        this.filterData = {
          dateRange: '',
          pageNum: 1,
          pageSize: pageRange[0],
          rowTotal: 0,
          pageSizes: pageRange
        }
      },
      sizeChange(val) {
        this.filterData.pageSize = val
        this.getData()
      },
      currentChange(val) {
        this.filterData.pageNum = val
        this.getData()
      },
      viewDetail({row}) {
        //查看指定时间段的表单实例
        // this.$router.push({path: '', query: {date:row.date, formId: this.formId} })
        this.$emit('viewViaDate', {date: row.date})
      }
    }
  }
</script>

<style lang="scss" scoped>
.time-chart{
  width: 100%;
  height: 400px;
  background: #fcfcfc;
}
</style>
