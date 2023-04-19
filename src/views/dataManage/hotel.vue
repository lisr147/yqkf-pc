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
      :defaultSearchMore="true"
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
  <el-form-item label="状态">
    <el-select v-model="filter.statu" >
            <!-- <el-option value="0" label="全部" /> -->
      <el-option value="1" label="待分派酒店" />
      <el-option value="6" label="已分派酒店" />
    </el-select>
  </el-form-item>          <el-form-item label="联系电话">
            <el-input
              type="text"
              v-model="filter.lxdh"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input
              type="text"
              v-model="filter.xm"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>

          <el-form-item label="隔离酒店">
            <el-select v-model="filter.jdid">
              <!-- <el-option
                value=""
                label="全部"
                >全部</el-option
              > -->
              <el-option
                v-for="item in hotelList"
                :key="item.id"
                :value="item.id"
                :label="item.jkgcjd"
                >{{ item.jkgcjd }}</el-option
              >
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
        <el-button type="primary" @click="active">分派酒店</el-button>
      </template>
    </table-page>
    <SwitchHotel
      v-if="dialog === 'hotel'"
      @close="dialog = null"
      @submit="submit"
    />
  </div>
</template>
<script>
import TablePageFunc from "@/utils/tablepage.js";
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
import SwitchHotel from "./hotel/switchHotel";
import getTableKeys from "./getTableKeys";

export default {
  name: "hotel",
  components: {
    TablePage,
    SwitchHotel,
  },
  mixins: [TablePageFunc, getTableKeys],
  data() {
    return {
      dialog: null, //弹出框控制
      // isLoading: true,
      filter: {
        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
        statu: "1",
        lxdh: "",
        jdid: "",
        mjlx: "",
        xm:''
      },
      tableListData: {
        selection: true,
        tableData: [],
        tableKeys: [],
        tableFunctions: [],
      },
      hotelList: [],
    };
  },
  async mounted() {
    this.hotelList = await this.$Api().HotelController.get_getAllHotelList.request();
    this.getTableKeys(["sfzhzhm", "lxdh", "xm", "jdmc"]);
  },
  methods: {
    async getData() {
      if(this.$route.query.statu){
        this.filter.statu = this.$route.query.statu
        this.$route.query.statu = null
      }
      let params = JSON.parse(JSON.stringify(this.filter));

      delete params.rowTotal;
      delete params.pageSizes;
      //   let res = await getSubmitUserGroup(params);
      // let res = await this.$Api().HotelController.post_searchByHotel.request({
      //   data: params,
      //   heaaders: {
      //     hideNotify: true,
      //   },
      // });
      let res = await this.$Api().ConnectionController.post_searchByInfo.request(
        {
          data: params,
          heaaders: {
            hideNotify: true,
          },
        }
      );
      this.tableListData.tableData = res.data;
      this.filter.pageNum = res.pageNum;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.rowTotal;
    },
    async submit(hotel) {
      this.dialog = null;

      console.log(hotel);

      await this.$Api().HotelController.post_assignByHotel.request({
        data: {
          ids: this.multiData.map((v) => v.id),
          jdid: hotel.id,
          jdmc: hotel.jkgcjd,
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
      this.dialog = "hotel";
    },
  },
};
</script>
