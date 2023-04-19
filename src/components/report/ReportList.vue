<template>
  <el-dialog
      :visible="showme"
      append-to-body
      width="1180px"
      :modal="false"
      :close-on-click-modal="false"
      :customClass="'staff_table report_list_wrap'"
      @close="$emit('toggle',false)"
      title="添加图表">
    <el-form :inline="true" :model="filter" class="report-filter">
      <el-form-item label="">
        <el-input v-model="filter.title" placeholder="输入图表面板标题" size="small"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="filter.itemType" placeholder="请选择图表类型" size="small">
          <el-option :value="null" label="全部" :key="null"></el-option>
          <el-option v-for="(item, key) in panelTypeMap" :key="key" :label="item.label" :value="key">
          </el-option>
        </el-select>
      </el-form-item>

      <!--<el-form-item label="">-->
      <!--<el-select v-model="filter.appInfoId" placeholder="请选择应用系统"  size="small">-->
      <!--<el-option :value="null" label="全部"  :key="null"></el-option>-->
      <!--<el-option v-for="item in appList" :key="item.id" :label="item.appName" :value="item.id">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="" style="width:200px" >-->
      <!--<el-select v-model="filter.panelItemDomainIds" placeholder="请选择所属领域" multiple  size="small">-->
      <!--<el-option v-for="item in domainList" :key="item.id" :label="item.name" :value="item.id">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item style="width:50px">
        <el-button type="primary" @click="filterData" size="mini">搜索</el-button>
      </el-form-item>
    </el-form>

    <div class="report-list">
      <div class="report" v-for="item in data" :key="item.id">
        <div class="report-click" @click="selectReport(item)">选择</div>

        <!--中高风险地区来粤人员计数-->
        <risk-count v-if="item.code==='getRiskAreasMsgPC'" ref="riskCount"></risk-count>

        <!--实时告警 预览版-->
        <event-alarm-list v-else-if="item.code==='eventAlarmList'"></event-alarm-list>

        <!--实时上报核酸采样点排队情况 预览版-->
        <real-time-line-up v-else-if="item.code==='RealTimeLineUp'" preview="true"></real-time-line-up>

        <data-board v-else :id="item.id" :title="item.title" :code="item.code" :chartHeight="200" :visible="showme"/>

      </div>
      <div class="empty" v-show="data.length==0">
        没有图表数据
      </div>
    </div>

    <pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.rowTotal"
        background
        style="margin:0px 15px;"
    />

  </el-dialog>
</template>
<script>

import {getAllChartBoards, thumbnail} from '@/api/report'
import {panelTypeMap} from '@/config/dictionary'
import DataBoard from '@/components/charts/DataBoard'
import Pagination from '@/components/form/Pagination'
import RiskCount from "@/views/big/RiskCount";
import EventAlarmList from "@/components/charts/EventAlarmList"
import RealTimeLineUp from "@/views/big/RealTimeLineUp"

export default {
  name: 'ReportList',
  components: {EventAlarmList, DataBoard, Pagination,RiskCount,RealTimeLineUp},
  props: {
    showme: {type: Boolean, default: false}
  },
  model: {
    prop: 'showme',
    event: 'toggle'
  },
  data() {
    return {
      data: [],
      filter: {
        title: '', // 搜索数据
        appInfoId: '2854529', // 所属应用 2839805疫情防控、2854529疫情防大屏
        panelItemDomainIds: [], // 所属领域ids
        itemType: '', // 展现类型
        // departmentIds: [], // 关联部门
      },
      filter_params: {},
      page: {
        pageNum: 1,
        pageSizes: [6, 9, 12],
        pageSize: 6,
        rowTotal: 0
      },

      panelTypeMap: panelTypeMap
    }
  },
  created() {
    // this.initAppSelect()
  },
  mounted() {
    this.getData()
  },
  watch: {
    showme(val){
      if(val){
       this.resetData()
        this.getData()
      }
    }
  },
  computed: {
    // appList () {
    //   return this.$store.state.app.list
    // },
    // domainList(){
    //   return this.$store.state.app.domainList
    // }
  },
  methods: {
    //  初始化应用系统Select
    initAppSelect() {
      // this.$store.dispatch('app/getIds')
      // this.$store.dispatch('app/getDomainList')
    },
    getData() {
      getAllChartBoards({
        title: this.filter_params.title,
        appInfoId: this.filter.appInfoId,
        panelItemDomainIds: this.filter_params.panelItemDomainIds,
        itemType: this.filter_params.itemType,
        // departmentIds: this.filter_params.departmentIds,
        page: this.page.pageNum,
        rp: this.page.pageSize
      }).then(res => {
        this.page.pageNum = res.pageNumber
        this.page.pageSize = res.pageSize
        this.page.rowTotal = res.rowTotal
        this.data = res.dataList
        // console.log(138,res);
      })

    },
    filterData() {
      this.page.pageNum = 1
      this.filter_params = Object.assign(this.filter)
      this.getData()
    },

    selectReport(item) {
      this.$emit('select', item)
      this.$emit('toggle', false)
    },
    handleSizeChange(v) {
      this.page.pageSize = v
      this.getData()
    },
    handleCurrentChange(v) {
      this.page.pageNum = v
      this.getData()
    },
    getThumbnail(id) {
      return thumbnail(id)
    },
    resetData(){
      this.filter_params= {}
      this.page.pageNum = 1
      this.filter= {
        title: '', // 搜索数据
        appInfoId: '2854529', // 所属应用 2839805疫情防控、2854529疫情防大屏
        itemType: '', // 展现类型
      }
    }
  }
}
</script>
<style lang="scss" type="text/scss">
.report_list_wrap{
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}
.report-filter {
  padding: 0 10px;

  .el-form-item {
    margin-bottom: 4px;
    width: 160px;
  }
}

.report-list {
  display: flex;
  flex-wrap: wrap;

  .report {
    position: relative;
    width: 350px;
    height: 300px;
    margin: 10px;

    .report-click {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.7);
      display: none;
      font-size: 18px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 1;
      color: #fff;
    }
  }

  .report:hover {
    .report-click {
      display: flex;
    }
  }

  .empty {
    padding: 3em;
    width: 100%;
    text-align: center;
  }
  .board{
    .header{
      background: none;
    }
  }

}

</style>
