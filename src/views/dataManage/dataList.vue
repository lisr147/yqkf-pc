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
          label-width="170px"
          class="area-main-filter"
          @keyup.enter.native="search"
        >
        <StatusSelect v-model="filter.statu" />
          <el-form-item label="人员去向">
            <el-select v-model="filter.ryqx">
              <el-option value="" label="全部" />
              <el-option value="居家隔离" />
              <el-option value="已确定可转运" />
              <el-option value="拟转外区管理" />
              <el-option value="找不到人" />
              <el-option value="其他" />
            </el-select>
          </el-form-item>

          <template v-for="item in dataKeys">
            <el-form-item
              v-if="item.searchable"
              :key="item.storeFiled"
              :label="item.fieldName"
              :prop="item.storeFiled"
                            :class="item.fieldName.includes('日期')||item.fieldName.includes('时间')?'search2x':''"

            >
              <!-- {{dataType[item.storeFiled]}} -->
              <el-select
                v-model="filter[item.storeFiled]"
                v-if="item.storeFiled === 'mjlx'"
              >
                <el-option value="" label="全部" />
                <el-option value="密切接触者" />
                <el-option value="密接的密接" />
                <el-option value="一般接触者" />
                <el-option value="重点人群" />
                <el-option value="一般人群" />
              </el-select>
              <el-select
                v-model="filter.jdid"
                v-else-if="item.storeFiled === 'jdid'"
              >
                <el-option value="" label="全部">全部</el-option>
                <el-option
                  v-for="item in hotelList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.jkgcjd"
                  >{{ item.jkgcjd }}</el-option
                >
              </el-select>
              
               <template v-else-if="item.fieldName.includes('日期')">
            <!-- <el-input
              v-model="dataForm[item.storeFiled]"
              :disabled="true"
              placeholder="请输入"
            ></el-input> -->
            <el-date-picker
            v-model="filter[item.storeFiled]"
            type="daterange"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
          </template>
          <template v-else-if="item.fieldName.includes('时间')">
            <!-- <el-input
              v-model="dataForm[item.storeFiled]"
              :disabled="true"
              placeholder="请输入"
            ></el-input> -->
            <el-date-picker
            v-model="filter[item.storeFiled]"
            type="daterange"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
          </template>
<!-- 
              <el-date-picker
                v-else-if="item.storeFiled === 'jsjzgcsj'"
                v-model="filter.jsjzgcsj"
                type="datetimerange"
                placeholder="选择日期时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
              /> -->
              <el-input
                v-model="filter[item.storeFiled]"
                v-else
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
      </template>
      <!-- 操作栏 -->
      <template slot="controler">
        <!-- <el-button
          type="primary"
          @click="dialog = 'room'"
          @close="dialog = null"
          @submit="submit"
          >导出</el-button
        > -->
        <el-button icon="el-icon-download" type="primary" @click="exportFile"
          >批量导出</el-button
        >
      </template>
    </table-page>
    <HealtyInfo
      v-if="dialog === 'healty'"
      @close="
        detail = null;
        dialog = null;
      "
      :data="detail"
    />
    <Timeline
      v-if="dialog === 'timeline'"
      @close="
        detail = null;
        dialog = null;
      "
      :data="detail"
    />
  </div>
</template>
<script>
import TablePageFunc from "@/utils/tablepage.js";
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
import HealtyInfo from "./hotel/healtyInfo.vue";
import Timeline from "./hotel/timeLine.vue";
import getTableKeys from "./getTableKeys";
import StatusSelect from '@/components/statusSelect.vue'
export default {
  name: "data-list",
  components: {
    TablePage,
    HealtyInfo,
    Timeline,
    StatusSelect
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
        glblxm: "",
        glmjxm: "",
        jdid: "",
        lxdh: "",
        rylx: "",
        ssjd: "",
        statu: "",
        ryqx:'',
        bm:true
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
    };
  },
  async mounted() {
    this.hotelList = await this.$Api().HotelController.get_getAllHotelList.request();
    this.getTableKeys(["sfzhzhm", "lxdh", "xm"]);
    // this.getData();
    this.tableListData.tableFunctions.push({
      label: "查看健康信息",
      method: this.viewInfo,
    });
    this.tableListData.tableFunctions.push({
      label: "时间轴查看",
      method: this.viewTL,
    });
  },
  methods: {
    async getData() {
      let params = JSON.parse(JSON.stringify(this.filter));
      delete params.rowTotal;
      delete params.pageSizes;
      //   let res = await getSubmitUserGroup(params);
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
      let res = await this.$Api().ImportDataController.post_exportData.request({
        path: {
          templateId: "10001",
        },
        data: {},
        responseType: "blob",
      });
      // console.log(res)
      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true,
      });
    },
  },
};
</script>
