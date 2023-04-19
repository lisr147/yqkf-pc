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
            <el-form :inline="true" :model="filter">
                <el-input style="width: 150px;" v-model="filter.keyWord" placeholder="车牌号"></el-input>
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
    name: "TransitVehiclesList",
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
          pageNum: 1,
          pageSize: 15,
          rowTotal: 1,
          pageSizes: [15, 50, 100, 200],
        },
        tableListData: {
          selection: false,
          tableData: [],
          tableKeys: [
              {id: 'fyccph', label: '负压车车牌号',width: 120},
              {id: 'cdrq', label: '初登日期',width: 120},
              {id: 'fycssyy', label: '负压车所属医院',width: 200},
              {id: 'fycxsydw', label: '负压车现使用单位',minWidth: 150}
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

        const {keyWord, pageNum,pageSize} = this.filter
        var params = {
          page: pageNum,
          pageSize,
          //查询条件
          templateId: layerSetting.transitVehiclesListId,
          condition: {
            fyccph: keyWord || '',
            fycxsydw: mc
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
