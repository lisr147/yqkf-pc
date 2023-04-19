<template>
  <div class="close-contact" >
    <table-page
        :data="tableListData"
        :filter="filter"
        @search="search"
        @resetSearch="resetSearch"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @tableSelectionChange="tableSelectionChange"
        v-if="tableListData.tableKeys.length"
        :customClass="'staff_table'"
        :hideKeyFilter="true"

    >
      <template slot="searchFilter">
        <div class="search-box">
          <el-form :inline="true" :model="filter" >
            <el-input
                style="width: 300px;"
                v-model="filter.keyWord"
                placeholder="请输姓名、身份证搜索"
            ></el-input>
          </el-form>
        </div>
      </template>
      <template v-slot:column_mjlx="row">
        <span :style="`color:${row.value.mjlx === '密接的密接' ? '#FFFF00' : '#F42A34'}`">
       {{row.value.mjlx}}</span>
      </template>
    </table-page>
  </div>
</template>

<script>
import TablePage from "zkzc-table-page";
import "@/assets/css/screenDialog.scss";
import TablePageFunc from "@/utils/tablepage";
import SETTING from '@/config/MapSetting.js'
export default {
  name: "CloseContactList",
  components: {
    TablePage,
  },
  props: {
    cond: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  mixins: [TablePageFunc],
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
          {id: "xm", label: "姓名", width: 100},
          {id: "xb", label: "性别", width: 80},
          {id: "nl", label: "年龄", width: 80},
          {id: "sfzhzhm", label: "身份证号", width: 180},
          {id: "lxdh", label: "联系电话", width: 180},
          {id: "jtzz", label: "家庭住址", width: 180},
          {id: "glblxm", label: "关联病例", width: 180},
          {id: "yhzgx", label: "与患者关系", width: 100},
          {id: "gxlx", label: "关系类型", width: 100},
          {id: "sfjwry", label: "是否境外人员", width: 120}
        ],
        tableFunctions: [],
      },
    }
  },
  watch: {
    cond(){
      this.getData()
    }
  },
  methods : {

    async getData () {
      // console.log(90,this.cond);
      let params = {
        condition: {
          gz:this.cond.fromKey==='CounterBoard'?'': "继续观察",
          sswg:this.cond.from==='sealAreaLeft'?this.cond.sswg:undefined
        },
        page: this.filter.page,
        pageSize: this.filter.pageSize,
      }
      if (this.filter.keyWord) {
        params.condition['key'] = this.filter.keyWord
      }
      //所属 集中医学集中观察场所
      if (this.cond.jzyxgccs) {
        params.condition['jzyxgccs'] = this.cond.jzyxgccs
      }
      if(this.cond.grid){
        params.condition['sswg'] = this.cond.grid
      }

      Object.assign(params, {
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      })
      let layerId = this.cond.layerId

      let res = await SETTING.getLayerSetting(layerId).getListData(params)
      this.tableListData.tableData = res.data
      this.filter.rowTotal = res.total

    },
    editRow ({row}) {
      this.$emit('showCloseContactDetail',row)
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
        method: this.editRow,
      }
    ]
  }
}
</script>

<style scoped lang="scss">
.close-contact {
  height: calc(70vh);
  overflow-y: auto;
  ::v-deep .showMore-searchFilter{
    margin-top: 20px;
    padding-right: 10px;
    min-height: 40px;
  }
}
</style>
