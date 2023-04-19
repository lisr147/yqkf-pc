<template>
  <div class="room_detail">
    <!-- StaffTable-->
    <table-page
      :data="tableListData"
      :filter="filter"
      :hideSearch="true"
      :hideKeyFilter="true"
      @search="search"
      @resetSearch="resetSearch"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @tableSelectionChange="tableSelectionChange"
      v-if="tableListData.tableKeys.length"
    >
      <template v-slot:column_xm="row">
        <el-button type="text" @click="showPersonDetail(row.value)">{{row.value.xm}}</el-button>
      </template>
    </table-page>
  </div>
</template>

<script>
import TablePageFunc from "@/utils/tablepage.js";
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
import getTableKeys from "./getTableKeys";
import '@/assets/css/screenDialog.scss'
export default {
  name: 'RoomDetail',
  props: ['data'],
  mixins: [TablePageFunc, getTableKeys],
  components: {
    TablePage
  },
  data () {
    return {
      filter: {
        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
        xm: '',
        fjh: '',
        sjhm: ''
      },
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: [
          {
            id: 'index',
            label: "序号",
            minWidth: 60,
          },
          {
            id: "xm",
            label: "姓名",
            minWidth: 100,
          },
          {
            id: "lxfs",
            label: "联系方式",
            minWidth: 160,
          },
          {
            id: "jj",
            label: "居家",
            minWidth: 60,
          },
          {
            id: "zydgl",
            label: "隔离酒店",
            minWidth: 120,
          },
          {
            id: "lkhwhjadzzjxn",
            label: "是否珠江街辖内",
            minWidth: 120,
          }
        ],
        tableFunctions: [],
      }
    }
  },
  methods: {
    showPersonDetail (data) {
      this.$emit('addDetail', {...data, name: '人员情况', component: 'PersonDetail'})
    },
    getData () {
      this.tableListData.tableData = this.data.tableData
    }
  },
  mounted () {
    this.getTableKeys([]);
    this.getData()
  }
}
</script>

<style lang="scss" scoped>

</style>