<template>
  <div class="red-yellow-list-dialog staff_table">
    <table-page
        :data="tableListData"
        :filter="filter"
        @search="search"
        @resetSearch="resetSearch"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @tableSelectionChange="tableSelectionChange"
        v-if="tableListData.tableKeys.length"

        :hideKeyFilter="true"
        :hideSearch="true"
    >
    </table-page>
  </div>
</template>

<script>
import TablePage from "zkzc-table-page";
import "@/assets/css/screenDialog.scss";
import TablePageFunc from "@/utils/tablepage";
import SETTING from "@/config/MapSetting.js";
import {getNucleicAcidStreetMore} from '@/api/bigCharts.js'

export default {
  name: "SamplingPointList",
  components: {
    TablePage,
  },
  props: ["data"],
  mixins: [TablePageFunc],
  watch: {
    data(val) {
      this.getData()
    }
  },
  data () {
    return {
      keyWord:"",
      filter: {
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
            id: "spotName",
            label: "核酸采样点",
          },
          {
            id: "fwrq",
            label: "服务人群",
          },
          {
            id: "szxxdz",
            label: "所在详情地址",
          },
          {
            id: "spotType",
            label: "规模",
            width: "60"
          },
          {
            id: "updateTime",
            label: "更新时间",
            width: 150,
          },
        ],
        tableFunctions: [],
      },
    }
  },
  methods : {
    async getData () {
      // console.log(75,this.data);
      const {templateId, externalTemplateId} = SETTING.getDict().find(v=>v.id == 'detectionPoint')
      if(this.$store.state.common.town){
        this.data.sszj = this.$store.state.common.town
      }
      let res = await getNucleicAcidStreetMore({
        templateIds: [templateId,externalTemplateId].join(','),
        condition: this.data,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      });

      res.data.forEach(item => {
        //大规模
        if (item.templateId == templateId) {
          item.spotType = '大规模'
          item.spotName = item.yljg
        } else {
          //常规
          item.spotType = '常规'
          item.spotName = item.cghsjcd
        }
      })

      this.tableListData.tableData = res.data
      this.filter.rowTotal = res.total
    },
    editRow ({row}) {
      this.$emit('showSamplingPointDetail',row)
    },
    search(){
      this.filter.page = 1;
      this.getData();
    }
  },
  mounted() {
    this.getData()
    this.tableListData.tableFunctions = [
      {
        label: '详情',
        width: 80,
        method: this.editRow
      }
    ]
  }
}
</script>

<style scoped lang="scss">
.red-yellow-list-dialog {
  height: calc(70vh);
  overflow-y: auto;
  .search-box{
    display: flex;
    align-items: center;
    .tip{
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4E7CFC;
      line-height: 28px;
    }
    .el-input{
      margin-left: 50px;
      width: 300px;
    }
  }
  ::v-deep .showMore-searchFilter{
      margin-top: 20px;
      padding-right: 10px;
      min-height: 40px;
  }
  ::v-deep .el-table__fixed-right-patch{
    display: none;
  }
  ::v-deep .el-table__fixed-right::before, .el-table__fixed::before{
    display: none;
  }
}
</style>
