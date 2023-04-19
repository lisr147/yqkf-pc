<template>
  <div class="transit-vehicles-list">
    <div class="">
      <table-page
        :data="tableListData"
        :filter="filter"
        @search="search"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @resetSearch="resetSearch"
        :hideKeyFilter="true"
        :customClass="'staff_table'"
        :height="400">

        <template slot="searchFilter">
          <div class="search-box">
            <el-form :inline="true" :model="filter" label-width="60px">
              <el-form-item label="">
                <el-input style="width: 100px;" v-model="filter.keyWord" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item label="工作开始日期" label-width="100px" style="margin:0 10px">
                <el-input style="width: 140px;" v-model="filter.gzksrq" placeholder="输入工作开始日期"></el-input>
              </el-form-item>
              <el-form-item label="工作结束日期" label-width="100px">
                <el-input style="width: 140px;" v-model="filter.gzjsrq" placeholder="输入工作结束日期"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </table-page>

    </div>
  </div>
</template>

<script>
  import TablePage from "zkzc-table-page";
  import TablePageFunc from "@/utils/tablepage";
  import {getMapLayerData} from '@/api/mapData.js'
  import SETTING from '@/config/MapSetting.js'

  export default {
    name: "AllocationHealthCareList",
    mixins: [TablePageFunc],
    components: {TablePage},
    props: {
      cond: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    watch: {
      cond(val) {
        console.log(67,val);
        this.getData()
      }
    },
    data() {
      return {
        filter: {
          keyWord: null,
          gzksrq: '',
          gzjsrq: '',
          pageNum: 1,
          pageSize: 15,
          rowTotal: 1,
          pageSizes: [15, 50, 100, 200],
        },
        tableListData: {
          selection: false,
          tableData: [],
          tableKeys: [
              {id: 'xm', label: '姓名',width: 70},
              {id: 'ssyy', label: '所属医院',minWidth: 90},
              {id: 'jzgfxrqlx', label: '接诊高风险人群类型',width: 120},
              {id: 'sfzhm', label: '身份证',width: 170},
              {id: 'gzksrq', label: '开始工作日期',width: 60},
              {id: 'gzjsrq', label: '结束工作日期',width: 60},
              {id: 'csgw', label: '从事岗位',width: 50},
              {id: 'sfbh', label: '是否闭环',width: 50},
              {id: 'sfdrdj', label: '是否单人单间',width: 50},
              {id: 'jtgj', label: '交通工具',width: 50},
            ],
          tableFunctions: [],
        }
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData(){
        const { layerId, mc } = this.cond
        const layerSetting = SETTING.getLayerInfo(layerId)

        if (!layerSetting) {
          console.error('没有获取到图层${layerId} 的人员列表id')
          return
        }

        const {keyWord, pageNum,pageSize, gzksrq, gzjsrq} = this.filter
        var params = {
          //模板id
          // templateId: layerSetting.staffListId,
          page: pageNum,
          pageSize,
          //查询条件
          templateId: layerSetting.allocationHealthCareListId,
          condition: {
            xm: keyWord || '',
            gzksrq,
            gzjsrq,
            ssyy: mc
          },
        }

        var res = await getMapLayerData(params)

        this.tableListData.tableData = res.data
        this.filter.rowTotal = res.total
      },

    }
  }
</script>

<style lang="scss" type="text/scss">
  .transit-vehicles-list {

    .content {
      .wrapper{
        .button-group{
          margin: 0;
        }
      }
    }

  }
</style>
