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
          label-width="140px"
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
              <el-option :value="hotelAllIds" label="全部">全部</el-option>
              <el-option
                v-for="item in hotelList"
                :key="item.id"
                :value="item.id"
                :label="item.jkgcjd"
                >{{ item.jkgcjd }}</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filter.glzt">
              <el-option value="隔离中" />
              <el-option value="已解除" />
              <el-option value="已转诊" />
              <el-option value="转密接" />
              <el-option label="全部" value="" />
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
          <el-form-item label="开始观察日期" class="search2x">
            <el-date-picker
              v-model="filter.ksgcrq"
              type="daterange"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="结束集中观察时间" class="search2x">
            <el-date-picker
              v-model="filter.jsjzgcsj"
              type="daterange"
              placeholder="选择日期时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="结束时间" class="search2x">
            <el-date-picker
              v-model="filter.jssj"
              type="daterange"
              placeholder="选择日期时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form>
      </template>
      <!-- 操作栏 -->
      <template slot="controler">
        <el-button type="primary" @click="removeIsolation">解除隔离</el-button>
        <el-button type="primary" @click="transferTreatment">转诊</el-button>
        <el-button type="primary" @click="transferConnection">转密接</el-button>
      </template>
    </table-page>
    <HealtyInfo v-if="detail" @close="detail = null" :data="detail" />
  </div>
</template>
<script>
import TablePageFunc from "@/utils/tablepage.js";
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
import HealtyInfo from "./hotel/healtyInfo.vue";
import getTableKeys from "./getTableKeys";

export default {
  name: "hotel",
  components: {
    TablePage,
    HealtyInfo,
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
        glzt: "",
        jdid: "",
        phone: "",
        mjlx: "",
        jsjzgcsj: null,
        ksgcrq:null,
        jssj:null,
        bm:true
      },
      tableListData: {
        selection: true,
        columnFunctionsWidth: 120,
        tableData: [],
        tableKeys: [],
        tableFunctions: [],
      },
      hotelList: [],
      detail: null,
      hotelAllIds: "",
    };
  },
  async mounted() {
    // this.hotelList = await this.$Api().HotelController.get_getHotelList.request();
    this.hotelList = await this.$Api().HotelController.get_getAllHotelList.request();
    // this.hotelAllIds = this.hotelList.map(item=>item.id).join(',')
    // this.filter.jdid = this.hotelAllIds

    this.getTableKeys([
      "jdmc",
      "sfzhzhm",
      "lxdh",
      "xm",
      "fjh",
      "ksglsj",
      "yglsc",
      "glzt",
    ]);
  },
  methods: {
    resetSearch() {
      let pageNum = this.filter.pageNum;
      let pageSize = this.filter.pageSize;
      let rowTotal = this.filter.rowTotal;
      this.filter = this.$options.data().filter;
      this.filter.pageNum = pageNum;
      this.filter.pageSize = pageSize;
      this.filter.rowTotal = rowTotal;
      this.filter.jdid = this.hotelAllIds;
      this.getData();
    },
    async getData() {
      //  let {jdid} = this.filter
      // // if(jdid.length){
      // //   jdid=
      // // }
      // jdid = jdid.length?jdid.split(','):[]
      // let params = JSON.parse(JSON.stringify(Object.assign({}, this.filter, {jdid})));
      // let params = JSON.parse(JSON.stringify(this.filter));
      // const {jdid} = this.filter
      // Object.assign(params, {jdid: jdid.split(',')})

      let params = JSON.parse(JSON.stringify(this.filter));

      delete params.rowTotal;
      delete params.pageSizes;
      //   let res = await getSubmitUserGroup(params);
      // let res = await this.$Api().IsolationStatusController.post_searchByStatu.request(
      //   {
      //     data: params,
      //     heaaders: {
      //       hideNotify: true,
      //     },
      //   }
      // );
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
    viewInfo(scope) {
      this.detail = scope.row;
    },
    async removeIsolation() {
      if (!this.multiData.length) {
        this.$message({
          type: "warn",
          message: "请先选择人员",
        });
        return;
      }
      await this.$Api().IsolationStatusController.post_removeIsolation.request({
        data: {
          ids: this.multiData.map((v) => v.id),
        },
      });
      this.getData();
    },
    async transferConnection() {
      if (!this.multiData.length) {
        this.$message({
          type: "warn",
          message: "请先选择人员",
        });
        return;
      }
      await this.$Api().IsolationStatusController.post_transferConnection.request(
        {
          data: {
            ids: this.multiData.map((v) => v.id),
          },
        }
      );
      this.getData();
    },
    async transferTreatment() {
      if (!this.multiData.length) {
        this.$message({
          type: "warn",
          message: "请先选择人员",
        });
        return;
      }
      await this.$Api().IsolationStatusController.post_transferTreatment.request(
        {
          data: {
            ids: this.multiData.map((v) => v.id),
          },
        }
      );
      this.getData();
    },
  },
};
</script>
