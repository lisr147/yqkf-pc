<template>
  <div>
    <table-page
      :data="tableListData"
      :filter="filter"
      @search="search"
      @resetSearch="resetSearch"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @tableSelectionChange="tableSelectionChange"
      v-if="tableListData.tableKeys.length"
    >
      <!--搜索栏-->
      <template slot="searchFilter">
        <el-form
          :inline="true"
          :model="filter"
          label-width="80px"
          class="area-main-filter"
          @keyup.enter.native="search"
        >
          <el-form-item label="联系电话">
            <el-input
              type="text"
              v-model="filter.phone"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input
              type="text"
              v-model="filter.name"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="隔离酒店">
            <el-select v-model="filter.jdid">
              <el-option
                :value="hoteAllIds"
                label="全部"
                >全部</el-option
              >
              <el-option
                v-for="item in hotelList"
                :key="item.id"
                :value="item.id"
                :label="item.jkgcjd"
                >{{ item.jkgcjd }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filter.statu">
              <el-option
                value=""
                label="全部"
                >全部</el-option
              >
              <el-option value="0" label="待分派房间" />
              <el-option value="1" label="已分派房间" />
            </el-select>
          </el-form-item>
                    <el-form-item label="密接类型">
            <el-select v-model="filter.mjlx">
              <el-option value="" label="全部" />
              <el-option value="密切接触者" />
              <el-option value="密接的密接" />
              <el-option value="一般接触者" />
              <el-option value="重点人群" />
              <el-option value="一般人群" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <!-- 操作栏 -->
      <template slot="controler">
        <el-button type="primary" @click="active">分派房间</el-button>
      </template>
    </table-page>
    <SwitchRoom
      v-if="dialog === 'room'"
      @close="dialog = null"
      @submit="submit"
    />
  </div>
</template>
<script>
import TablePageFunc from "@/utils/tablepage.js";
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
import SwitchRoom from "./hotel/switchRoom.vue";
import getTableKeys from './getTableKeys'

export default {
  name: "room",
  components: {
    TablePage,
    SwitchRoom,
  },
  mixins: [TablePageFunc,getTableKeys],
  data() {
    return {
      dialog: null, //弹出框控制
      // isLoading: true,
      filter: {
        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
        statu: "0",
        jdid: "",
        phone:'',
        mjlx:''
      },
      filterHotel:'',//当前已筛选酒店
      tableListData: {
        selection: true,
        tableData: [],
        tableKeys: [],
        tableFunctions: [],
      },
      hotelList: [],
      hoteAllIds: ''
    };
  },
  async mounted() {
    this.hotelList = await this.$Api().HotelController.get_getHotelList.request();
    this.hoteAllIds = this.hotelList.map(item=>item.id).join(',')

    this.getTableKeys(['sfzhzhm','lxdh','xm','jdmc','fjh']);
  },
  methods: {
    resetSearch () {
      let pageNum = this.filter.pageNum
      let pageSize = this.filter.pageSize
      let rowTotal = this.filter.rowTotal
      this.filter = this.$options.data().filter
      this.filter.pageNum = pageNum
      this.filter.pageSize = pageSize
      this.filter.rowTotal = rowTotal
      this.filter.jdid = this.hoteAllIds
      this.getData()
    },
    async getData() {
      let {jdid} = this.filter
      // if(jdid.length){
      //   jdid=
      // }
      jdid = jdid.length?jdid.split(','):[]
      let params = JSON.parse(JSON.stringify(Object.assign({}, this.filter, {jdid})));
      // let params = JSON.parse(JSON.stringify(this.filter))
      delete params.rowTotal;
      delete params.pageSizes;
      //   let res = await getSubmitUserGroup(params);
      let res = await this.$Api().RoomController.post_searchByRoom.request({
        data: params,
        heaaders: {
          hideNotify: true,
        },
      });
      this.filterHotel = params.jdid
      this.tableListData.tableData = res.data;
      this.filter.pageNum = res.pageNum;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.rowTotal;
    },
    async submit(data) {
      this.dialog = null;

      console.log(data);
      // if(!this.multiData.length){
      //   this.$message({
      //   type: "warn",
      //   message: "请先选择人员",
      // });
      // return
      // }

      await this.$Api().RoomController.post_assignByRoom.request({
        data: {
          ids: this.multiData.map((v) => v._id),
          fjh: data.fjh,
          ksglsj: data.ksglsj,
        },
      });
      this.getData();
    },
    async active() {
      if (!this.multiData.length) {
        this.$message({
          type: "warn",
          message: "请先选择人员",
        });
        return;
      }
      if(!this.filterHotel){
        this.$message({
          type: "warn",
          message: "请先按隔离酒店筛选数据",
        });
        return;
      }
      this.dialog = "room";
    },
  },
};
</script>
