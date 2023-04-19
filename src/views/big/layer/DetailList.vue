<template>
  <div class="l-detail-list">
    <div class="">
      <table-page :data="tableListData" :filter="filter" @search="search" @resetSearch="resetSearch"
        @sizeChange="sizeChange" @currentChange="currentChange" :hideKeyFilter="true" :customClass="'staff_table'"
        :height="400">
        <template slot="searchFilter">
          <div class="search-box">
            <el-form :inline="true" :model="filter" label-width="360px">
              <el-input style="width: 200px;margin: 0 20px" v-model="filter.keyword" :placeholder="searchPlaceHolder"
                @keyup.enter.native="search"></el-input>
            </el-form>
          </div>
        </template>
      </table-page>
    </div>
    <!-- 扫码统计 -->
    <!-- 大规模、常规核酸点统计 -->
    <RowStat v-if="rowStatData" :codeList="codeList" :data="rowStatData" @close="rowStatData = null" isBigStyle="custom-style" />
  </div>
</template>

<script>
import TablePage from "zkzc-table-page";
import TablePageFunc from "@/utils/tablepage";
import { getMapLayerData } from "@/api/mapData.js";
import { getSealAreaHsPointList } from "@/api/sealarea2.js";
import DETAIL_LIST_SETTING from "@/config/DetailListSetting.js";
import RowStat from '@/views/fetchDataList/rowStat'

export default {
  name: "DetailList",
  components: {
    TablePage,
    RowStat
  },
  props: {
    cond: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mixins: [TablePageFunc],
  watch: {
    cond() {
      this.getData();
    },
  },
  data() {
    return {
      // 扫码数据
      rowStatData: null,
      filter: {
        keyword: "",
        pageNum: 1,
        pageSize: 15,
        rowTotal: 1,
        pageSizes: [15, 50, 100, 200],
      },
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: DETAIL_LIST_SETTING[this.cond.detailType].tableKeys,
        tableFunctions: [
          {
            label: '查看',
            method: this.checkDetail,

          },
          {
            label: '扫码统计',
            method: this.count,
          }
        ],
        columnFunctionsWidth: 140
      },
      searchPlaceHolder:
        DETAIL_LIST_SETTING[this.cond.detailType].searchPlaceHolder,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    checkDetail({ row }) {
      this.$emit('layerClicked', {
        layerId: 'detectionPoint',
        attributes: row
      })
    },
    // 扫码统计
    count({row}) {
      this.rowStatData = row;
      this.codeList = {
        日: "nucleicCommonDay",
        周: "nucleicCommonWeek",
        月: "nucleicCommonMonth",
      }
    },
    async getData() {
      const keywordName = DETAIL_LIST_SETTING[this.cond.detailType].keywordName;
      const data = {
        condition: {
          [keywordName]: this.filter.keyword,
        },
        templateId: this.cond.templateId,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      };
      const res = this.cond.areaId ? await getSealAreaHsPointList(this.cond.areaId, this.cond.templateId, data) : await getMapLayerData(data);
      this.tableListData.tableData = res.data || res;
      if(this.cond.templateId === 10027 || this.cond.templateId === 10055){
        this.tableListData.tableData.forEach((item) => {
          if(item.ggcs.length === 0) {
            item.ggcs = '-'
          }else {
            item.ggcsIds =  item.ggcs.map(obj => obj.stationId).join(",")
            console.log('ggcsIds:',item.ggcsIds)
            item.ggcs = item.ggcs.map(obj => obj.stationName).join(",")
            item.templateId = this.cond.templateId
          }
        })
      }
      this.filter.rowTotal = res.total;
    },
    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    resetSearch() {
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i)) {
          this.filter[i] = "";
        }
      }
      this.filter.pageNum = 1;
      this.getData();
    },
    sizeChange(val) {
      this.filter.pageSize = val;
      this.filter.pageNum = 1;
      this.getData();
    },
    currentChange(val) {
      this.filter.pageNum = val;
      this.getData();
    },
  },
};
</script>

<style lang="scss" type="text/scss">
.l-detail-list {
  .searchFilter {
    min-height: 40px;

    .search-box {
      .el-input--suffix {
        width: 150px;
      }
    }
  }

  ::v-deep .showMore-searchFilter {
    margin-top: 20px;
    padding-right: 10px;
    min-height: 40px;
  }
}
.staff_table {
  .el-table__row {
    .el-button span {
      text-decoration: none !important;
    }
  }
}
</style>
