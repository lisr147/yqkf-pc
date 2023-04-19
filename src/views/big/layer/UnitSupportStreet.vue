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
        :hideSearch="true"
        :customClass="'staff_table'"
        :height="400">
    </table-page>
  </div>
</template>

<script>
import {getMapLayerData} from '@/api/mapData.js'
import TablePage from "zkzc-table-page";
import TablePageFunc from "@/utils/tablepage";
import {mapState } from 'vuex'
export default {
  name: "UnitSupportStreet",
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
  computed: {
    ...mapState('common', ['town'])
  },
  data() {
    return {
      sszj:'',//所属镇街过滤
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
          // {
          //   id: "name",
          //   label: "序号",
          //   width: 80
          // },
          {
            id: "kfqsgdw",
            label: "开发区（区）属各单位",
            minWidth: 400
          },
          {
            // id: "gdlxzj",
            id: "sszj",
            label: "挂点联系镇（街）",
            minWidth: 120
          },
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
      const { pageNum,pageSize} = this.filter
      let params = {
        page: pageNum,
        pageSize,
        //查询条件
        condition:{
          sszj:this.town
        }
      }
      let res =await getMapLayerData(Object.assign({templateId: 10064},params)).then(res => {
        this.tableListData.tableData = res.data
        this.filter.rowTotal = res.total
      })

    }
  }
}
</script>

<style lang="scss" type="text/scss">

</style>
