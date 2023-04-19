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
                <el-input style="width: 100px;" v-model="filter.keyWord" placeholder="专家姓名"></el-input>
              </el-form-item>
              <el-form-item label="排班日期" label-width="100px" style="margin:0 10px">
                <el-input style="width: 140px;" v-model="filter.pbrq" placeholder="排班日期"></el-input>
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
    name: "ConsultationSchedulingList",
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
        this.getData()
      }
    },
    data() {
      return {
        filter: {
          keyWord: null,
          pageNum: 1,
          pageSize: 15,
          rowTotal: 1,
          pageSizes: [15, 50, 100, 200],
        },
        tableListData: {
          selection: false,
          tableData: [],
          tableKeys: [
              {id: 'xm', label: '专家姓名',width: 90},
              {id: 'zjzczw', label: '专家职称职务',width: 120},
              {id: 'zjssyy', label: '专家所属医院',minWidth: 50},
              {id: 'zjlxdh', label: '专家联系电话',width: 150},
              {id: 'pbrq', label: '排班日期',width: 150},
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

        const {keyWord, pbrq, pageNum,pageSize} = this.filter
        var params = {
          page: pageNum,
          pageSize,
          templateId: layerSetting.consultationSchedulingListId,
          condition: {
            xm: keyWord || '',
            pbrq,
            zjssyy: mc
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
