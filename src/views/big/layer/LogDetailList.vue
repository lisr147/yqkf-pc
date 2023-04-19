<template>
  <div>
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
          <!-- <span class="tip">购药记录明细</span> -->
          <el-form :inline="true" :model="filter" >
            <el-input
                style="width: 450px;"
                v-model="filter.keyWord"
                placeholder="请输入药者姓名、购药者身份证、患者姓名、患者身份证、药品名等"
            ></el-input>
          </el-form>
        </div>
      </template>
    </table-page>
  </div>
</template>

<script>
  import {getMapLayerData} from '@/api/mapData.js'
  import SETTING from '@/config/MapSetting.js'
  import TablePage from "zkzc-table-page";
  import TablePageFunc from "@/utils/tablepage";
  export default {
    name: "LogDetailList",
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
            {
              id: "mc",
              label: "药店名称",
              minWidth: 150,
            },
            {
              id: "gyrxm",
              label: "购药人姓名",
              minWidth: 100,
            },
            {
              id: "sfzhm",
              label: "购药人身份证",
              minWidth: 150,
            },
            {
              id: "hzlxfs",
              label: "购药人联系方式",
              minWidth: 100,
            },
            {
              id: "hzxm",
              label: "患者姓名",
              minWidth: 100,
            },
            {
              id: "hzsfzh",
              label: "患者身份证",
              minWidth: 100,
            },
            {
              id: "hzlxfs",
              label: "患者联系方式",
              minWidth: 100,
            },
            {
              id: "gmyptymc",
              label: "药品名称",
            },
            {
              id: "gmsl",
              label: "药品数量",
            },
            {
              id: "hzmqjzdz",
              label: "患者目前居住地址",
              minWidth: 180,
            },
            {
              id: "sszj",
              label: "所属街镇",
            },
            {
              id: "sswg",
              label: "所属网格",

            },
            {
              id: "belongVillage",
              label: "所属村居",
            }
          ],
          tableFunctions: [],
        },
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {
        const {layerId,mc} = this.cond

        // 以下图层有购药记录列表
        // 药店
        const layerSetting = SETTING.getLayerInfo(layerId)
        if (!layerSetting) {
          console.error('没有获取到图层${layerId} 的购药记录id')
          return
        }

        const {keyWord, pageNum,pageSize} = this.filter
        var params = {
          page: pageNum,
          pageSize,
          //查询条件
          templateId: layerSetting.logListId,
          condition: {
            searchInfo: keyWord || '',
            mc
          },
        }
        var res = await getMapLayerData(params)

        this.tableListData.tableData = res.data
        this.filter.rowTotal = res.total


      }
    }
  }
</script>

<style lang="scss" type="text/scss">

</style>
