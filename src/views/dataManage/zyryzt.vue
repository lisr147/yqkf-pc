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
          label-width="170px"
          class="area-main-filter"
          @keyup.enter.native="search"
        >
          <!-- <el-form-item label="隔离酒店">
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
          </el-form-item> -->
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
          <!-- <el-form-item label="关联病例">
            <el-input
              type="text"
              v-model="filter.glblxm"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input
              type="text"
              v-model="filter.mobile"
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
          <el-form-item label="关联密接">
            <el-input
              type="text"
              v-model="filter.glmjxm"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属街道">
            <el-input
              type="text"
              v-model="filter.ssjd"
              placeholder="请输入"
            ></el-input>
          </el-form-item> -->

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
        <!-- <el-button
          icon="el-icon-download"
          type="primary"
          @click="exportFile"
          >批量导出</el-button
        > -->
        <el-button type="primary" @click="showRYQX">人员去向</el-button>
      </template>
    </table-page>

    <EditRYQX
      @submit="submit"
      @close="dialog = null"
      v-if="dialog === 'ryqx'"
    />
  </div>
</template>
<script>
import TablePageFunc from "@/utils/tablepage.js";
import TablePage from "zkzc-table-page";
import { pageRange } from "@/config/setting";
import getTableKeys from "./getTableKeys";
import EditRYQX from "./hotel/editRYQX.vue";
import StatusSelect from "@/components/statusSelect.vue";

export default {
  name: "zyryzt",
  components: {
    TablePage,
    EditRYQX,
    StatusSelect
  },
  mixins: [TablePageFunc, getTableKeys ],
  data() {
    return {
      dialog: null, //弹出框控制
      // isLoading: true,
      filter: {
        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
        ryqx: "",
        statu: "9",
        bm:true
      },
      tableListData: {
        selection: true,
        columnFunctionsWidth: 220,
        tableData: [],
        tableKeys: [],
        tableFunctions: [],
      },
      hotelList: [],
      dataKeys: [],
    };
  },
  async mounted() {
    this.hotelList = await this.$Api().HotelController.get_getAllHotelList.request();
    this.getTableKeys(["sfzhzhm", "lxdh", "ryqxbz", "ryqx", "xm"]);
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
    showRYQX() {
      if (!this.multiData.length) {
        this.$message({
          type: "warn",
          message: "请先选择人员",
        });
        return;
      }
      this.dialog = "ryqx";
    },
    async submit(data) {
      this.dialog = null;

      console.log(data);

      console.log(data);
      let datas = [];
      this.multiData.forEach((v) => {
        let p = Object.assign(
          {
            id: v.id,
          },
          data
        );
        datas.push(p);
      });

      await this.$Api().ImportDataController.put_datas.request({
        data: datas,
      });
      this.getData();
    },
  },
};
</script>
