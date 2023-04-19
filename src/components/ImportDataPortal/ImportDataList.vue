<!-- 导入数据列表窗口 -->
<template>
  <div>
    <table-page
      :data="tableListData"
      :filter="filter"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @search="search"
      @resetSearch="resetSearch"
      @tableSelectionChange="tableSelect"
      v-if="tableShow"
      ref="table"
      :id="`importData_${tableId}`"
    >
      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" label-width="160px">
          <!-- <el-form-item label="隔离酒店" v-if="tableId === '10001'">
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
          <template v-for="item in dataKeys">
            <el-form-item
              :label="item.fieldName"
              :key="`filter_${item.storeFiled}`"
              :title="item.fieldName"
              v-if="item.searchable"
              :class="item.fieldName.includes('日期')||item.fieldName.includes('时间')?'search2x':''"
            >
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

              <template
                v-else-if="item.storeFiled === 'gfxrylb' && tableId === '10002'"
              >
                <el-select v-model="filter[item.storeFiled]">
                  <el-option value="密切接触者" />
                  <el-option value="密接的密接" />
                  <el-option value="一般接触者" />
                  <el-option value="公安反馈未定密级数" />
                </el-select>
              </template>

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
              <el-select
                  v-else-if="item.storeFiled==='sszj'"
                  v-model="filter[item.storeFiled]"
              >
                <el-option
                    v-for="option in sszjList"
                    :key="item.storeFiled + option"
                    :value="option"
                />
              </el-select>
              <el-input v-else v-model="filter[item.storeFiled]" />
            </el-form-item>
          </template>
        </el-form>
      </template>

      <!-- 控制栏 -->
      <template slot="controler">
        <!-- <el-select style="margin-right:10px;" v-model="tableId " @change="getTableKeys" >
            <el-option v-for="item in tablesList" :key="`tables_${item.id}`"  :value="item.id" :label="item.name" />
          </el-select> -->
        <el-button
          icon="el-icon-circle-plus"
          type="primary"
          @click="add"
          v-if="auth.new"
          >新增</el-button
        >
        <!-- <el-button
          icon="el-icon-remove"
          type="primary"
          plain
          @click="remove()"
          v-if="delAble || delAble === ''"
          >删除选中</el-button
        > -->
        <el-button
          icon="el-icon-upload2"
          type="primary"
          plain
          v-if="auth.import"
          @click="dialog = 'importFile'"
          >批量导入</el-button
        >
        <el-button
          icon="el-icon-download"
          v-if="download || download === ''"
          type="primary"
          plain
          @click="exportFile"
          >批量导出</el-button
        >
      </template>
    </table-page>
    <import-file
      :tableId="tableId"
      v-if="dialog === 'importFile'"
      @close="dialog = null"
      @update="getData"
    />
    <import-data-edit
      :keys="dataKeys"
      :tableId="tableId"
      :data="detailData"
      :type="dialog"
      v-if="dialog === 'edit' || dialog === 'new' || dialog === 'view'"
      @close="dialog = null"
      @update="getData"
    />
  </div>
</template>
<script>
import TablePage from "zkzc-table-page";
import ImportFile from "./uploadFile";
import { MessageBox } from "@/plugins/element";
import ImportDataEdit from "./ImportDataEdit";
import getTableKeys from "@/views/dataManage/getTableKeys.js";
import moment from "moment";
// import { getList, getConfig, getDataPage, delData } from '@/api/importTemplate'
export default {
  name: "ImportDataList",
  props: ["tableId", "delAble", "download"],
  components: { TablePage, ImportFile, ImportDataEdit },
  mixins: [getTableKeys],
  data() {
    return {
      sszjList:['南沙街','珠江街','龙穴街','大岗镇','榄核镇','黄阁镇','东涌镇','横沥镇','万顷沙镇'],//3街6镇列表
      dialog: null,
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100],
      },
      multiData: [],
      tableListData: {
        selection: true,
        columnFunctionsWidth: 220, // 操作栏宽度
        tableData: [],
        tableKeys: [],
        tableFunctions: [
          // {
          //   label: "查看",
          //   method: this.view,
          // },
          // {
          //   label: "编辑",
          //   method: this.edit,
          // },
          // {
          //   label: '删除',
          //   method: this.remove
          // }
        ],
      },
      detailData: null, // 详情数据
      dataKeys: null, // 所有的KEY
      // tablesList: [],
      // tableId: '',
      tableShow: true, // 刷新表格数据
    };
  },
  computed: {
    auth() {
      let auth = {
        import: true,
        dataManage: true,
        new:true
      };
      if (this.tableId === "10001") {
        auth.import = this.$store.state.authority.methAuthority.jkImport;
        auth.dataManage = this.$store.state.authority.methAuthority.jkDataManage;
        auth.new  = auth.import
      }
      if (this.tableId === "10002") {
        auth.import = this.$store.state.authority.methAuthority.ldryImport;
        auth.dataManage = this.$store.state.authority.methAuthority.dataManage;
        auth.new  = this.$store.state.authority.methAuthority.ldryNew;
      }
      if (this.tableId === "10003") {
        auth.import = this.$store.state.authority.methAuthority.jahyImport;
        auth.dataManage = this.$store.state.authority.methAuthority.jahyData;
        auth.new  = auth.import
      }
      if (this.tableId === "10004") {
        auth.import = this.$store.state.authority.methAuthority.zjjfkqryImport;
        auth.dataManage = this.$store.state.authority.methAuthority.zjjfkqryData;
        auth.new  = auth.import
      }
      return auth;
    },
  },
  async mounted() {
    if (this.tableId === "10001") {
      this.hotelList = await this.$Api().HotelController.get_getAllHotelList.request();
    }
    await this.getTableKeys(["sfzhzhm", "lxdh", "xm"], this.tableId, false);
    this.tableListData.tableKeys = this.tableListData.tableKeys.filter((v) => {
      if (["glzt", "yglsc", "ksglsj"].includes(v.id)) {
        return false;
      }
      return true;
    });

    let userId = this.$store.getters.userId + "";
    let dataManage = this.auth.dataManage;
    this.tableListData.tableFunctions = [
      {
        label: "查看",
        method: this.view,
      },
      {
        label: "编辑",
        method: this.edit,
        hidden(scope) {
          if (scope.row.creator === userId || dataManage) {
            return false;
          }
          return true;
        },
      },
    ];
    if (this.delAble || this.delAble === "") {
      this.tableListData.tableFunctions.push({
        label: "删除",
        method: this.remove,
        hidden(scope) {
          console.log(scope.row.creator, userId);
          if (scope.row.creator === userId || dataManage) {
            return false;
          }
          return true;
        },
      });
    }

    this.resetSearch();
  },
  methods: {
    // async getTableKeys() {
    //   this.tableShow = false;
    //   this.tableListData = this.$options.data().tableListData;

    //   let res = await this.$Api().ImportDataController.get_config.request({
    //     path: { id: this.tableId },
    //   });
    //   this.dataKeys = res.columns;
    //   res.columns.forEach((v) => {
    //     if (v.show) {
    //       // test
    //       if (v.storeFiled === "jdid") {
    //         return;
    //       }
    //       this.tableListData.tableKeys.push({
    //         id: v.storeFiled,
    //         label: v.fieldName,
    //         minWidth: v.fieldName.length * 30,
    //         searchable: v.searchable,
    //         formatter: (item) => {
    //           // console.log(item, v)
    //           if (v.fieldType === "datetime" && item[v.storeFiled]) {
    //             return item[v.storeFiled].replace("T", " ");
    //           }
    //           return item[v.storeFiled];
    //         },
    //       });
    //     }
    //     if (v.searchable) {
    //       this.$set(this.filter, v.storeFiled, "");
    //       // this.filter[v.storeFiled] = ''
    //     }
    //   });
    //   this.tableShow = true;
    //   this.resetSearch();
    //   // this.getData()
    // },
    async getData() {
      let condition = {};
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      // let res = await this.$Api().ImportTemplateController.post_dataPage.request({
      //   path: {
      //     templateId: this.tableId
      //   },
      //   data: {
      //     condition: condition,
      //     page: this.filter.pageNum,
      //     pageSize: this.filter.pageSize
      //   },
      //   headers: {
      //     hideNotify: true
      //   }
      // })
      let res = await this.$Api().ImportDataController.post_dataPage.request({
        path: {
          templateId: this.tableId,
        },
        data: {
          condition: condition,
          page: this.filter.pageNum,
          pageSize: this.filter.pageSize,
        },
        headers: {
          hideNotify: true,
        },
      });
      // console.log(res)
      res.data.forEach((v) => {
        v.createTime = v.createTime
          ? moment(v.createTime).format("YYYY-MM-DD HH:mm:ss")
          : null;
        v.updateTime = v.updateTime
          ? moment(v.updateTime).format("YYYY-MM-DD HH:mm:ss")
          : null;
      });

      this.tableListData.tableData = res.data;
      this.filter.pageNum = res.page;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.total;
    },
    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    resetSearch() {
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i)) {
          this.filter[i] = "";
        }
      }
      this.filter.pageNum = 1;
      this.getData();
    },
    sizeChange(val) {
      this.filter.pageSize = val;
      this.filter.pageNum = 1;
      this.getData();
    },
    currentChange(val) {
      this.filter.pageNum = val;
      this.getData();
    },
    tableSelect(data) {
      this.multiData = data;
    },
    async remove(scope) {
      let ids = [];
      // 单选
      if (scope) {
        ids.push(scope.row.id);
      } else {
        // 多选
        ids = this.multiData.map((item) => {
          return item.id;
        });
      }
      if (ids.length === 0) {
        this.$message({
          message: `请先选择数据再进行操作。`,
          type: "info",
          duration: 5 * 1000,
          showClose: true,
        });
        return;
      }
      await MessageBox.alert(`确定删除选择的数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        showCancelButton: true,
        type: "warning",
      });
      // console.log(ids.join(','))
      // await new this.$Api().ImportTemplateController.delete_data.request({
      //   path: {
      //     ids: ids.join(',')
      //   }
      // })
      await new this.$Api().ImportDataController.delete_data.request({
        path: {
          ids: ids.join(","),
        },
      });
      this.getData();
    },
    edit(scope) {
      this.dialog = "edit";
      this.detailData = scope.row;
    },
    view(scope) {
      this.dialog = "view";
      this.detailData = scope.row;
    },
    add() {
      this.dialog = "new";
      this.detailData = null;
    },
    async exportFile() {
      // 导出数据
      // eslint-disable-next-line no-unused-vars
      let res = await this.$Api().ImportDataController.post_exportData.request({
        path: {
          templateId: this.tableId,
        },
        data: this.filter,
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
<style lang="scss" scoped></style>
