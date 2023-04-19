<!-- 2022-2-17 增加，通过接口同步数据的查看列表 -->
<!-- 导入数据列表窗口 -->
<template>
  <div>
    <el-dialog
      destroy-on-close
      append-to-body
      class="screen-dialog screen-wrap c-seal-area-dialog"
      :visible="true"
      width="1400px"
      title="楼栋人员信息"
      @close="$emit('close')"
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
        ref="table"
        :id="`peopledata`"
        :hideSearch="props"
        class="big"
        customClass="staff_table"
      >
        <!-- 控制栏 -->
      </table-page>
    </el-dialog>
  </div>
</template>
<script>
import TablePage from "zkzc-table-page";
import AlarmSet from "@/components/alarm/AlarmSet";
import { exportYellowList } from "@/api/mapData";
import { areaIsKey } from "@/api/sealarea";
import {
  setKeyPlaceAlarm,
  getKeyPlaceAlarm,
  setYellowCodeAlarm,
  getYellowCodeAlarm,
} from "@/api/alarm";

import moment from "moment";
const tableKeysMap = {
  楼层: "楼层",
  房号: "房号",
  ZJHM: "证件号码",
  XM: "姓名",
  AGE: "年龄",
  SEX: "性别",
  SJHM: "手机号码",
  JZD: "居住地",
  JD: "街道",
  JZDCJ: "居住地村居",
  RYLX: "人员类型",
  HJXZ: "户籍详址",
  SJYMC: "数据源名称",
  UPDATE_TIME: "更新时间",
};
export default {
  name: "peopleDialog",
  components: { TablePage },
  //   mixins: [getTableKeys],
  props: ["props"],
  data() {
    return {
      sszjList: [
        "南沙街",
        "珠江街",
        "龙穴街",
        "大岗镇",
        "榄核镇",
        "黄阁镇",
        "东涌镇",
        "横沥镇",
        "万顷沙镇",
      ], //3街6镇列表
      dialog: null,
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100, 500, 1000],
      },
      multiData: [],
      tableListData: {
        selection: false,
        columnFunctionsWidth: 60, // 操作栏宽度
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
        ],
      },
      detailData: null, // 详情数据
      dataKeys: [], // 所有的KEY
      // tablesList: [],
      tableId: "",
      tableShow: true, // 刷新表格数据
      video: "",
      api: null,
      infoData: null,
      alarmSetVisible: false, //告警设置
      specialOption: {
        sszj: [
          "南沙街",
          "珠江街",
          "龙穴街",
          "大岗镇",
          "榄核镇",
          "黄阁镇",
          "东涌镇",
          "横沥镇",
          "万顷沙镇",
        ],
        is_key: [
          { value: "", label: "全部" },
          { value: "0", label: "是" },
          { value: "1", label: "否" },
        ],
        SKMSTATUS: [
          { value: "0", label: "无" },
          { value: "1", label: "正常" },
          { value: "2", label: "红码" },
          { value: "3", label: "黄码" },
        ],
        COLOR: [
          { value: "0", label: "正常" },
          { value: "20", label: "红码" },
          { value: "10", label: "黄码" },
        ],
        // 数据来源
        type: ["流动人口", "户籍人口"],
      },
      tableData: [],
    };
  },
  computed: {
    auth() {
      let auth = {
        import: true,
        dataManage: true,
        new: true,
      };
      return auth;
    },
    timeDefault() {
      //获取当前时间
      let defalutEndTime = moment(new Date(new Date())).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let defalutStartTime = moment(
        new Date(new Date() - 24 * 60 * 60 * 1000 * 2)
      ).format("YYYY-MM-DD HH:mm:ss");
      return [defalutStartTime, defalutEndTime];
    },
  },
  async mounted() {
    // 优先排序
    const firstFields = [
      {
        alias: "房号",
        name: "房号",
      },
      {
        alias: "楼层",
        name: "楼层",
      },
    ];
    for (let i in firstFields) {
      let key = {
        id: firstFields[i].alias,
        label: tableKeysMap[firstFields[i].name],
        minWidth: "100",
      };
      this.tableListData.tableKeys.push(key);
    }

    for (let i in this.props.fields) {
      if (
        [
          "楼层",
          "房号",
          "FID",
          "OBJECTID",
          "location_x1",
          "location_y1",
          "location_x",
          "location_y",
          "数据源名称",
          "优先级",
        ].includes(this.props.fields[i].alias)
      ) {
        continue;
      }
      let key = {
        id: this.props.fields[i].alias,
        label: tableKeysMap[this.props.fields[i].name],
        // minWidth: this.props.fields[i].name * 30,
        minWidth: "100",
        // searchable: true,
      };
      // if (tableData.formatter && tableData.formatter[i]) {
      //   key.formatter = tableData.formatter[i];
      // }
      this.tableListData.tableKeys.push(key);
    }

    // tableData.filter.forEach((v) => {
    //   this.dataKeys.push({
    //     fieldName: tableData.keys[v],
    //     storeFiled: v,
    //     fieldType: [
    //       "TUISONG_TIME",
    //       "UPDATE_TIME",
    //       "LOGTIME",
    //       "input_time",
    //       "DUMP_TIME",
    //       "JCSJ",
    //     ].includes(v)
    //       ? "datetime"
    //       : "input",
    //   });
    // })

    // this.api = tableData.api

    // if(this.props){
    //   this.tableListData.tableFunctions = []
    //   this.tableListData.selection = false
    //   Object.assign(this.filter,this.props.condition)
    const tableData = this.props.features.map((v) => {
      // v['手机号'] = (v['手机号']||'').replace('tel:','')
      return v.attributes;
    });
    this.tableData = tableData.map((v) => ({
      ...v,
      SJHM: (v["SJHM"] + "" || "").replace("tel:", ""),
      ZJHM: (v["ZJHM"] + "").slice(3),
      UPDATE_TIME: moment(new Date(v["UPDATE_TIME"])).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    }));
    this.filter.rowTotal = this.props.features.length;
    this.getData();
    //   return
    // }
    // this.resetSearch()
  },
  methods: {
    async getData() {
      // this.tableListData.tableData = this.props.features.map(
      //   (v) => v.attributes
      // );
      const { tableData, filter } = this;
      const { pageSize, pageNum } = filter;
      this.tableListData.tableData = tableData.slice(
        pageSize * (pageNum - 1),
        pageSize * pageNum
      );

      return;
      if (!this.tableId) {
        this.$message({
          message: `暂无数据模板`,
          type: "warning",
          duration: 5 * 1000,
          showClose: true,
        });
        return;
      }

      let condition = {};
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }
      let data = {
        condition: condition,
        page: this.filter.pageNum,
        pageSize: this.filter.pageSize,
      };
      // 穗康扫码通行记录、公安扫码通行记录、核酸检测 日期赋初始值2天
      if (["gasmtxjl"].includes(this.tableId) && !this.filter.DUMP_TIME) {
        data.condition.DUMP_TIME = this.timeDefault;
      } else if (["ggcssmjl"].includes(this.tableId) && !this.filter.LOGTIME) {
        data.condition.LOGTIME = this.LOGTIME;
      } else if (["hsjc"].includes(this.tableId) && !this.filter.JCSJ) {
        data.condition.JCSJ = this.timeDefault;
      }
      let res = await this.api.request({
        data,
        headers: {
          hideNotify: true,
        },
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
      this.infoData = {
        keys: this.tableListData.tableKeys,
        data: scope.row,
      };
    },
    add() {
      this.dialog = "new";
      this.detailData = null;
    },
    async exportFile() {
      if (this.tableId == "publicsecurityyellowcode") {
        //公安黄码数据
        await exportYellowList({
          condition: this.filter,
          page: this.filter.pageNum,
          pageSize: this.filter.rowTotal,
        });
      } else {
        await this.$Api().ImportDataController.post_exportData.request({
          path: {
            templateId: this.tableId,
          },
          data: this.filter,
          responseType: "blob",
        });
      }

      this.$message({
        message: `导出成功`,
        type: "success",
        duration: 3 * 1000,
        showClose: true,
      });
    },
    async exportTemplate() {
      // 导出数据
      // eslint-disable-next-line no-unused-vars
      // let data = Object({},{condition:{
      //     id:-1
      // }},this.filter)
      // 2022-2-16 特殊处理的下载模板
      if (this.tableId === 10066) {
        var anchor = document.createElement("a");
        let filename = encodeURIComponent(
          "南沙区国际进口邮件快件直接接触从业人员汇总-模板.xls"
        );
        anchor.href = `./template/${filename}`;
        // let filename = response.headers['content-disposition'].split('=')[1]
        anchor.download = decodeURIComponent(filename);
        anchor.target = "_blank";
        anchor.click();
        return;
      }
      if (this.tableId === 10014) {
        var anchor = document.createElement("a");
        let filename = encodeURIComponent("疫苗接种每日统计-模板.xls");
        anchor.href = `./template/${filename}`;
        // let filename = response.headers['content-disposition'].split('=')[1]
        anchor.download = decodeURIComponent(filename);
        anchor.target = "_blank";
        anchor.click();
        return;
      }

      let res = await this.$Api().ImportDataController.post_exportData.request({
        path: {
          templateId: this.tableId,
        },
        data: {
          // condition:{
          id: -1,
          // }
        },
        responseType: "blob",
      });
      // console.log(res)
      // this.$message({
      //   message: `导出成功`,
      //   type: "success",
      //   duration: 3 * 1000,
      //   showClose: true,
      // });
    },

    batchDelete() {
      var ids = this.multiData.map((v) => v.id);

      if (ids.length <= 0) {
        this.$message({
          message: "请先勾选至少一个数据",
          type: "warning",
        });
        return;
      }

      this.$confirm("此操作将永久删除数据, 是否继续?", "警告", {
        type: "warning",
      })
        .then(() => {
          this.$Api()
            .ImportDataController.delete_data.request({
              path: {
                ids: ids.join(","),
              },
            })
            .then((res) => {
              this.$message({
                message: `批量删除成功`,
                type: "success",
              });
              this.getData();
            });
        })
        .catch(() => {});
    },
    setTableKeys(index) {
      console.log("setTableKeys", index);
      localStorage[`importData_${this.tableId}`] = JSON.stringify(index);
    },
    //告警设置
    async showAlarmSet() {
      // const that = this;
      let alarmData = "";
      switch (this.tableId) {
        case "ggcs":
          alarmData = getKeyPlaceAlarm;
          break;
        case "hhmry":
          alarmData = getYellowCodeAlarm;
          break;
      }
      await alarmData()
        .then((res) => {
          this.alarmSetting = res;
          this.alarmSetVisible = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleAlarmSet(data) {
      const { createReceiveUsers, handingTownThresholdValue } = data;
      if (!handingTownThresholdValue) {
        this.$message.error("请完整填写表单");
        return;
      }
      let setAlarmData = "";
      switch (this.tableId) {
        case "ggcs":
          setAlarmData = setKeyPlaceAlarm;
          break;
        case "hhmry":
          setAlarmData = setYellowCodeAlarm;
          break;
      }
      setAlarmData({
        createReceiveUsers,
        handingTownThresholdValue,
      })
        .then(() => {
          this.$message.success("设置成功！");
          this.alarmSetVisible = false;
        })
        .catch((e) => {
          this.$message.error("设置失败！ " + e);
          this.alarmSetVisible = false;
        });
    },
    //设置重点场所
    setKeyPlace(type) {
      var ids = this.multiData.map((v) => v.ID);
      var names = this.multiData.map((v) => v.stationName);
      if (ids.length <= 0) {
        this.$message({
          message: "请先勾选至少一个数据",
          type: "warning",
        });
        return;
      }
      let params = {
        stationName: names.join(","),
      };
      params.isKey = type;
      if (type === 0) {
        this.$confirm(
          `确定要将所选的${ids.length}个场所设置为重点场所吗?`,
          "警告",
          {
            type: "warning",
          }
        )
          .then(() => {
            areaIsKey(params).then((res) => {
              this.$message({
                message: `设置成功`,
                type: "success",
              });
              this.getData();
            });
          })
          .catch(() => {});
      } else {
        this.$confirm(
          `确定要将所选的${ids.length}个场所取消重点场所吗?`,
          "警告",
          {
            type: "warning",
          }
        )
          .then(() => {
            areaIsKey(params).then((res) => {
              this.$message({
                message: `设置成功`,
                type: "success",
              });
              this.getData();
            });
          })
          .catch(() => {});
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.big {
  ::v-deep .button-group {
    display: none;
  }
}
</style>
