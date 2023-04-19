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
      :defaultSearchMore="true"
      v-if="tableListData.tableKeys.length"
      class="data-view-table"
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
          <StatusSelect v-model="filter.statu" />

          <el-form-item label="密接类型">
            <el-select v-model="filter.mjlx">
              <el-option value="" label="全部" />
              <el-option value="密切接触者" />
              <el-option value="密接的密接" />
              <el-option value="一般接触者" />
              <el-option value="重点人群" />
              <el-option value="一般人群" />
              <el-option value="其他" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否运转">
            <el-select v-model="filter.yz">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否分配隔离酒店">
            <el-select v-model="filter.fpgljd">
              <el-option value="" label="全部" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-form-item>

          <el-form-item label="隔离酒店">
            <el-select v-model="filter.jdid">
              <el-option value="" label="全部">全部</el-option>
              <el-option
                v-for="item in hotelList"
                :key="item.id"
                :value="item.id"
                :label="item.jkgcjd"
                >{{ item.jkgcjd }}</el-option
              >
            </el-select>
          </el-form-item>

          <el-form-item label="房间人数">
            <el-select v-model="filter.fjrs">
              <el-option value="" label="全部" />
              <el-option value="1" label="1" />
              <el-option value="2" label="2" />
              <el-option value="3" label="2个以上" />
            </el-select>
          </el-form-item>

          <el-form-item label="导入时间" class="search2x">
            <el-date-picker
              v-model="filterTime.CreateTime"
              type="datetimerange"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="登车时间" class="search2x">
            <el-date-picker
              v-model="filterTime.Dcsj"
              type="datetimerange"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="到达酒店时间" class="search2x">
            <el-date-picker
              v-model="filterTime.Jdsmsj"
              type="datetimerange"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="开始隔离时间" class="search2x">
            <el-date-picker
              v-model="filterTime.Ksglsj"
              type="datetimerange"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="应解除观察日期" class="search2x">
            <el-date-picker
              v-model="filterTime.Yjcgcrq"
              type="daterange"
              placeholder="选择日期时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
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
        <el-button icon="el-icon-download" type="primary" @click="exportFile"
          >导出筛选结果</el-button
        >
        <label style="margin-left: 10px">房间数 : {{ fjsCount }}</label>
      </template>
    </table-page>
  </div>
</template>
<script>
import TablePageFunc from "@/utils/tablepage.js";
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
// import HealtyInfo from "./hotel/healtyInfo.vue";
// import Timeline from "./hotel/timeLine.vue";
import getTableKeys from "@/views/dataManage/getTableKeys.js";
import StatusSelect from "@/components/statusSelect.vue";

export default {
  name: "data-view",
  components: {
    TablePage,
    StatusSelect,
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
        mjlx: "",
        yz: "",
        fpgljd: "",
        jdid: "",
        fjrs: "",
        statu: "",
        jsjzgcsj: "",
        ksgcrq:'',
        jssj:''
      },
      tableListData: {
        selection: false,
        columnFunctionsWidth: 220,
        tableData: [],
        tableKeys: [],
        tableFunctions: [],
      },
      hotelList: [],
      detail: null,
      dataKeys: [],
      fjsCount: "",
      filterTime: {},
    };
  },
  async mounted() {
    this.hotelList = await this.$Api().HotelController.get_getAllHotelList.request();
    this.getTableKeys(["sfzhzhm", "lxdh", "xm"]);
    // this.getData();
    // this.tableListData.tableFunctions.push({
    //   label: "查看健康信息",
    //   method: this.viewInfo,
    // });
    // this.tableListData.tableFunctions.push({
    //   label: "时间轴查看",
    //   method: this.viewTL,
    // });
  },
  methods: {
    async getData() {
      let params = JSON.parse(JSON.stringify(this.filter));
      delete params.rowTotal;
      delete params.pageSizes;
      for(let i in params){
        if(!params[i]){
          delete params[i]
        }
      }
      //   let res = await getSubmitUserGroup(params);
      for (let i in this.filterTime) {
        if (this.filterTime[i]) {
          params["start" + i] = this.filterTime[i][0];
          params["end" + i] = this.filterTime[i][1];
        }
      }
      for(let i in params){
        if(!params[i]){
          delete params[i]
        }
      }
      let res = await this.$Api().ConnectionController.post_searchDataByInfo.request(
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
      this.fjsCount = res.fjsCount;
    },
    async submit(data) {
      this.dialog = null;

      console.log(data);
      if (!this.multiData.length) {
        this.$message({
          type: "warn",
          message: "请先选择人员",
        });
        return;
      }

      await this.$Api().RoomController.post_assignByRoom.request({
        data: {
          ids: this.multiData.map((v) => v._id),
          fjh: data.fjh,
          ksglsj: data.ksglsj,
        },
      });
      this.getData();
    },
    viewInfo(scope) {
      this.detail = scope.row;
      this.dialog = "healty";
    },
    viewTL(scope) {
      this.detail = scope.row;
      this.dialog = "timeline";
    },
    async exportFile() {
      // 导出数据
      // eslint-disable-next-line no-unused-vars
      let params = JSON.parse(JSON.stringify(this.filter));
      delete params.rowTotal;
      delete params.pageSizes;
      //   let res = await getSubmitUserGroup(params);
      for (let i in this.filterTime) {
        if (this.filterTime[i]) {
          params["start" + i] = this.filterTime[i][0];
          params["end" + i] = this.filterTime[i][1];
        }
      }
      for(let i in params){
        if(!params[i]){
          delete params[i]
        }
      }
      let res = await await this.$Api().ConnectionController.post_exportData.request(
        {
          data: params,
          responseType: "blob",
        }
      );
      // console.log(res)
      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true,
      });
    },
    resetSearch() {
      let pageNum = this.filter.pageNum;
      let pageSize = this.filter.pageSize;
      let rowTotal = this.filter.rowTotal;
      this.filter = this.$options.data().filter;
      this.filterTime = this.$options.data().filterTime;
      this.filter.pageNum = pageNum;
      this.filter.pageSize = pageSize;
      this.filter.rowTotal = rowTotal;
      this.getData();
    },
  },
};
</script>
<style lang="scss">
.el-form-item__label {
  flex-shrink: 0 !important;
}

.data-view-table
  .showMore-searchFilter
  .searchInput
  .el-form--inline
  .search2x {
  width: 640px !important;
}
</style>
