<!-- 大屏里的详情列表 -->
<template>
  <el-dialog
    append-to-body
    :visible="true"
    :title="fetchData.name"
    @close="$emit('close')"
    class="screen-dialog screen-wrap c-seal-area-dialog"
    width="1200px"
  >
    <table-page
      :data="tableListData"
      :filter="filter"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @search="search"
      @resetSearch="resetSearch"
      @tableSelectionChange="tableSelect"
      @setTableKeys="setTableKeys"
      :hideKeyFilter="true"
      v-if="tableShow"
      ref="table"
      customClass="staff_table"
      :id="`DataList_${tableId}`"
    >
      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" label-width="160px">
          <template v-for="item in dataKeys">
            <el-form-item
              :label="item.fieldName"
              :key="`filter_${item.storeFiled}`"
              :title="item.fieldName"
              :class="
                item.fieldType === 'date' || item.fieldType === 'datetime'
                  ? 'search2x'
                  : ''
              "
            >
              <template v-if="item.fieldType === 'date'">
                <el-date-picker
                  v-model="filter[item.storeFiled]"
                  type="daterange"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </template>
              <template v-else-if="item.fieldType === 'datetime'">
                <el-date-picker
                  v-model="filter[item.storeFiled]"
                  type="datetimerange"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </template>
              <template v-else-if="specialOption[item.storeFiled]">
                <el-select v-model="filter[item.storeFiled]">
                  <el-option
                    v-for="(option, index) in specialOption[item.storeFiled]"
                    :key="index"
                    :label="option.label || option"
                    :value="option.value || option"
                  />
                </el-select>
              </template>
              <el-input v-else v-model="filter[item.storeFiled]" />
            </el-form-item>
          </template>
        </el-form>
      </template>
      <!-- 控制栏 -->
      <template slot="controler">
        <el-button
          v-if="['户籍人口详情', '流动人口详情'].includes(fetchData.name)"
          type="primary"
          @click="exprotPopulation"
          >导出</el-button
        >
      </template>
    </table-page>

    <Info v-if="infoData" :data="infoData" @close="infoData = null" />
    <slot />
  </el-dialog>
</template>
<script>
import TablePage from "zkzc-table-page";
import Info from "./info.vue";
export default {
  name: "DataList",
  components: { TablePage, Info },
  props: ["fetchData"],
  data() {
    return {
      dialog: null,
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100, 500, 1000]
      },
      multiData: [],
      tableListData: {
        selection: false,
        columnFunctionsWidth: 120, // 操作栏宽度
        tableData: [],
        tableKeys: [],
        tableIndex: [],
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
        ]
      },
      detailData: null, // 详情数据
      dataKeys: [], // 所有的KEY
      // tablesList: [],
      tableId: "",
      tableShow: true, // 刷新表格数据
      api: null,
      infoData: null,
      specialOption: {
        // sszj: [
        //   "南沙街",
        //   "珠江街",
        //   "龙穴街",
        //   "大岗镇",
        //   "榄核镇",
        //   "黄阁镇",
        //   "东涌镇",
        //   "横沥镇",
        //   "万顷沙镇",
        // ],
        // is_key: [
        //   { value: "", label: "全部" },
        //   { value: "0", label: "是" },
        //   { value: "1", label: "否" },
        // ],
        // SKMSTATUS: [
        //   { value: "0", label: "无" },
        //   { value: "1", label: "正常" },
        //   { value: "2", label: "红码" },
        //   { value: "3", label: "黄码" },
        // ],
        // COLOR: [
        //   { value: "0", label: "正常" },
        //   { value: "20", label: "红码" },
        //   { value: "10", label: "黄码" },
        // ],
        xb: ["不限", "男", "女"]
      }
    };
  },
  async mounted() {
    let tableData = this.fetchData;
    this.tableId = tableData.id;
    for (let i in tableData.keys) {
      let key = {
        id: i,
        label: tableData.keys[i],
        minWidth: tableData.keys[i].length * 30,
        searchable: true
      };
      if (tableData.formatter && tableData.formatter[i]) {
        key.formatter = tableData.formatter[i];
      }
      this.tableListData.tableKeys.push(key);
    }
    if (tableData.tableFunctions) {
      this.tableListData.tableFunctions = tableData.tableFunctions;
    }

    tableData.filter.forEach(v => {
      this.dataKeys.push({
        fieldName: v === "key" ? "关键字" : tableData.keys[v],
        storeFiled: v,
        fieldType: [
          "TUISONG_TIME",
          "UPDATE_TIME",
          "LOGTIME",
          "DUMP_TIME",
          "JCSJ"
        ].includes(v)
          ? "datetime"
          : "input"
      });
    });

    this.api = tableData.api;

    this.resetSearch();
  },
  methods: {
    async getData() {
      let condition = {};
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      let res = await this.api({
        data: {
          condition: condition,
          page: this.filter.pageNum,
          pageSize: this.filter.pageSize
        },
        headers: {
          hideNotify: true
        }
      });
      // console.log(res)
      // res.data.forEach((v) => {
      //   v.createTime = v.createTime
      //     ? moment(v.createTime).format("YYYY-MM-DD HH:mm:ss")
      //     : null;
      //   v.updateTime = v.updateTime
      //     ? moment(v.updateTime).format("YYYY-MM-DD HH:mm:ss")
      //     : null;
      // });

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
    // async remove(scope) {
    //   let ids = [];
    //   // 单选
    //   if (scope) {
    //     ids.push(scope.row.id);
    //   } else {
    //     // 多选
    //     ids = this.multiData.map((item) => {
    //       return item.id;
    //     });
    //   }
    //   if (ids.length === 0) {
    //     this.$message({
    //       message: `请先选择数据再进行操作。`,
    //       type: "info",
    //       duration: 5 * 1000,
    //       showClose: true,
    //     });
    //     return;
    //   }
    //   await MessageBox.alert(`确定删除选择的数据吗?`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     closeOnClickModal: false,
    //     showCancelButton: true,
    //     type: "warning",
    //   });
    //   // console.log(ids.join(','))
    //   // await new this.$Api().ImportTemplateController.delete_data.request({
    //   //   path: {
    //   //     ids: ids.join(',')
    //   //   }
    //   // })
    //   await new this.$Api().ImportDataController.delete_data.request({
    //     path: {
    //       ids: ids.join(","),
    //     },
    //   });
    //   this.getData();
    // },
    // edit(scope) {
    //   this.dialog = "edit";
    //   this.detailData = scope.row;
    // },
    view(scope) {
      this.infoData = {
        keys: this.tableListData.tableKeys,
        data: scope.row
      };
    },
    // add() {
    //   this.dialog = "new";
    //   this.detailData = null;
    // },
    // async exportFile() {
    //   // 导出数据
    //   // eslint-disable-next-line no-unused-vars
    //   let res = await this.$Api().ImportDataController.post_exportData.request({
    //     path: {
    //       templateId: this.tableId,
    //     },
    //     data: this.filter,
    //     responseType: "blob",
    //   });
    //   // console.log(res)
    //   this.$message({
    //     message: `导出成功`,
    //     type: "success",
    //     duration: 3 * 1000,
    //     showClose: true,
    //   });
    // },
    // async exportTemplate() {
    //   // 导出数据
    //   // eslint-disable-next-line no-unused-vars
    //   // let data = Object({},{condition:{
    //   //     id:-1
    //   // }},this.filter)
    //   // 2022-2-16 特殊处理的下载模板
    //   if (this.tableId === 10066) {
    //     var anchor = document.createElement("a");
    //     let filename = encodeURIComponent(
    //       "南沙区国际进口邮件快件直接接触从业人员汇总-模板.xls"
    //     );
    //     anchor.href = `./template/${filename}`;
    //     // let filename = response.headers['content-disposition'].split('=')[1]
    //     anchor.download = decodeURIComponent(filename);
    //     anchor.target = "_blank";
    //     anchor.click();
    //     return;
    //   }
    //   if (this.tableId === 10014) {
    //     var anchor = document.createElement("a");
    //     let filename = encodeURIComponent("疫苗接种每日统计-模板.xls");
    //     anchor.href = `./template/${filename}`;
    //     // let filename = response.headers['content-disposition'].split('=')[1]
    //     anchor.download = decodeURIComponent(filename);
    //     anchor.target = "_blank";
    //     anchor.click();
    //     return;
    //   }

    //   let res = await this.$Api().ImportDataController.post_exportData.request({
    //     path: {
    //       templateId: this.tableId,
    //     },
    //     data: {
    //       // condition:{
    //       id: -1,
    //       // }
    //     },
    //     responseType: "blob",
    //   });
    //   // console.log(res)
    //   // this.$message({
    //   //   message: `导出成功`,
    //   //   type: "success",
    //   //   duration: 3 * 1000,
    //   //   showClose: true,
    //   // });
    // },

    // batchDelete() {
    //   var ids = this.multiData.map((v) => v.id);

    //   if (ids.length <= 0) {
    //     this.$message({
    //       message: "请先勾选至少一个数据",
    //       type: "warning",
    //     });
    //     return;
    //   }

    //   this.$confirm("此操作将永久删除数据, 是否继续?", "警告", {
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.$Api()
    //         .ImportDataController.delete_data.request({
    //           path: {
    //             ids: ids.join(","),
    //           },
    //         })
    //         .then((res) => {
    //           this.$message({
    //             message: `批量删除成功`,
    //             type: "success",
    //           });
    //           this.getData();
    //         });
    //     })
    //     .catch(() => {});
    // },
    setTableKeys(index) {
      console.log("setTableKeys", index);
      localStorage[`importData_${this.tableId}`] = JSON.stringify(index);
    },
    exprotPopulation() {
      let condition = {};
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      this.$Api().SealManageAreaStatisticsController.post_exportSealAreaList.request(
        {
          data: {
            condition: {

            },
            page: 1,
            pageSize: 999999999
          },
          params: {
            areaId: this.fetchData.areaId,
              rylx: this.fetchData.name==='户籍人口详情'?'huji':'liudong'
          }, 
          responseType: "blob"
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped></style>
