<template>
  <div>
    <el-dialog
        v-dialogDrag
        title="户号列表"
        top="15vh"
        width="650px"
        @close="handleClose"
        class="red-yellow-list-dialog-container"
        :visible="showme"
        :modal="false">
      <div class="red-yellow-list-dialog staff_table">
        <div class="street-title-box">
          <h3 class="h3">户号：{{data.name}}</h3>
        </div>
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
            :hideSearch="true"
        >
          <template v-slot:column_s2="row">
            <span class="act-t1" @click="handleShowDetail(row.value)">{{row.value.s2 || '无'}}</span>
          </template>
        </table-page>
      </div>
    </el-dialog>
    <door-detail v-model="detailVisible" :data="currentDetail"></door-detail>
  </div>
</template>

<script>
import TablePage from "zkzc-table-page";
import DoorDetail from "@/components/door/DoorDetail";
import "@/assets/css/screenDialog.scss";
import TablePageFunc from "@/utils/tablepage";
export default {

  name: 'DoorList',
  props: {
    showme: {type: Boolean},
    data: {type: Object},
  },
  components: {
    TablePage,
    DoorDetail
  },
  model:{
    prop: 'showme',
    event: 'toggle'
  },
  mixins: [TablePageFunc],
  watch:{
    data: {
      handler: function () {
        this.initData()
      },
      immediate: true
    }
  },
  data() {
    return {
      filter: {
        pageNum: 1,
        pageSize: 10,
        rowTotal: 0,
        pageSizes: [10,15],
      },
      detailVisible: false,
      allTableData : [],
      currentDetail: {},

      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: [
          {
            id: "s2",
            label: "房号",
          },
          // {
          //   id: "deviceId",
          //   label: "设备ID",
          // },
          {
            id: "deviceImei",
            label: "设备imei",
          },
        ],
        tableFunctions: [],
      },
    }
  },
  mounted() {
  },
  methods: {

    async initData(){
      let data = this.data.data
      if (data && data.length === 1) {
        // data[0].s2 = '1房'
      }
      if (data && data.length) {
        this.filter = this.$options.data().filter
        this.allTableData = data.sort(function(a,b){
          return a.s2.localeCompare(b.s2)
        });
        this.filter.rowTotal = data.length
        this.getData()
      }
    },
    getData () {
      let allTableData = JSON.parse(JSON.stringify(this.allTableData))
      let tableData = allTableData.splice(((this.filter.pageNum - 1) * this.filter.pageSize) , this.filter.pageSize)
      this.$set(this.tableListData, 'tableData', tableData)
      // this.filter.pageNum = this.filter.pageNum + 1
      // console.log('this.tableListData.tableData',this.tableListData.tableData)

    },
    handleClose(){
      this.$emit('toggle', false)
    },
    handleShowDetail (row) {
      console.log('row',row)
      this.detailVisible = true
      this.currentDetail = row
    }
  }

}
</script>
<style lang="scss">
.red-yellow-list-dialog-container {
  .el-dialog {
    top: 14vh;
  }
}
.red-yellow-list-dialog.staff_table {
  max-height: 50vh;
  overflow-y: auto;
}
.red-yellow-list-dialog {

  .staff_table.content {
    margin: 0;
  }
  .act-t1 {
    color: #4E7CFC;
    cursor: pointer;
    font-size: 14px;
    text-decoration:underline;
  }
}
</style>
<style lang="scss" scoped>
.street-title-box {
  padding-top: 10px;
  .h3 {
    color: #fff;
    font-size: 14px;
  }
}
</style>
