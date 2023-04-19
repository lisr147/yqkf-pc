<template>
  <div class="staff_table">
    <!-- StaffTable-->
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
      <!--搜索栏-->
      <!-- <template slot="searchFilter">
        <el-form
          :inline="true"
          :model="filter"
          label-width="80px"
          class="area-main-filter"
          @keyup.enter.native="search"
        >
          <el-form-item label="房号" label-width="50px">
            <el-input
              type="text"
              v-model="filter.fh"
              placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-width="50px">
            <el-input
              type="text"
              v-model="filter.xm"
              placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="80px">
            <el-input
              type="text"
              v-model="filter.lxfs"
              placeholder=""
            ></el-input>
          </el-form-item>
        </el-form>
      </template> -->
      <template v-slot:column_xm="row">
        <el-button type="text" @click="showPersonDetail(row.value)">{{
          row.value.xm
        }}</el-button>
      </template>
    </table-page>
  </div>
</template>

<script>
import TablePageFunc from "@/utils/tablepage.js";
import TablePage from "zkzc-table-page";
import getTableKeys from "./getTableKeys";
import { getRoomStatistics, getRoomStaff, jaList } from "@/api/mapData.js";

import "@/assets/css/screenDialog.scss";

export default {
  name: "StaffTable",
  mixins: [TablePageFunc, getTableKeys],
  props: ["data"],
  components: {
    TablePage,
  },
  data() {
    return {
      filter: {
        pageNum: 1,
        pageSize: 15,
        rowTotal: 1,
        pageSizes: [15, 50, 100, 200],
        // xm: '',
        // fh: '',
        // lxfs: ''
        jdfh: "",
        sortOrder : 'asc',
        sortName : 'fh'
      },
      tableListData: {
        selection: false,
        tableData: [],
        tableKeys: [
          {
            id: "fh",
            label: "房号",
            minWidth: 60,
          },
          {
            id: "xm",
            label: "姓名",
            minWidth: 80,
          },
          {
            id: "lxfs",
            label: "联系方式",
            minWidth: 120,
          },
          {
            id: "jj",
            label: "居家",
            minWidth: 80,
          },
          {
            id: "zydgl",
            label: "隔离酒店",
            minWidth: 80,
          },
          {
            id: "lkhwhjadzzjxn",
            label: "离开后是否在珠江辖内",
            minWidth: 120,
          },
        ],
        tableFunctions: [],
      },
    };
  },
  methods: {
    async showRoomDetail(params) {
      const data = {
        d: this.data.d,
        j: this.data.j,
        fh: params.fh,
      };
      let res = await getRoomStaff(data);
      this.$emit("addDetail", {
        tableData: res,
        id: "RoomDetail",
        name: params.fh + "人员情况",
        component: "RoomDetail",
        class:'dialog-staff'
      });
    },
    showPersonDetail (data) {
      this.$emit('addDetail', {...data, name: '人员情况', component: 'PersonDetail',class:'dialog-person'})
    },
    async getData() {
      // let params = {
      //   d: this.data.d,
      //   fh: this.filter.fh,
      //   j: this.data.j,
      //   lxfs: this.filter.lxfs,
      //   xm: this.filter.xm,
      //   page: this.filter.pageNum,
      //   pageSize: this.filter.pageSize
      // }
      // for(const key in params) {
      //   if (!params[key]) delete params[key]
      // }
      // let res = await getRoomStatistics(params)
      // this.tableListData.tableData = res.data
      // this.filter.pageNum = res.page
      // this.filter.pageSize = res.pageSize
      // this.filter.rowTotal = res.total

      // let filter = {}
      // Object.keys(this.filter).forEach((key, index ) => {
      //   if (this.filter[key] !== '') {
      //     filter[key] = this.filter[key]
      //   }
      // })
      // filter.page = filter.pageNum
      // delete filter.rowTotal
      // delete filter.pageSizes
      // delete filter.pageNum
      // let filter = JSON.parse(JSON.stringify(this.filter));

      let filter={
        d: this.data.d,
        j: this.data.j,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize      
        }
      for (const key in filter) {
        if (!filter[key]) delete filter[key];
      }
      delete filter.pageSizes
      // filter.jdfh = this.data.j + this.data.d;
      // console.log(filter)
      let res = await this.$Api().ExaminePeopleController.get_people.request({
        params:filter
      })
      this.tableListData.tableData = res.data;

              this.filter.pageNum = res.page;
        this.filter.pageSize = res.pageSize;
        this.filter.rowTotal = res.total;
      // jaList(filter).then((res) => {
      //   this.tableListData.tableData = res.data;
      //   this.tableListData.tableData.sort((a,b)=>{
      //     return b.fh - a.fh
      //   })
      //   this.filter.pageNum = res.page;
      //   this.filter.pageSize = res.pageSize;
      //   this.filter.rowTotal = res.total;
      // });
    },
  },
  mounted() {
    this.getTableKeys([]);
    this.getData();
  },
};
</script>

<style lang="scss">
.community .el-dialog.dialog-staff{
  top: 2vh ;
  left: 50vw ;
}
</style>
