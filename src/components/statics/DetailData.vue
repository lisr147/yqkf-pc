<template>
  <div>
    <table-page
      :data="vdata"
      :filter="filterData"
      @search="search"
      @resetSearch="resetSearch"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    >
      <!-- 控制栏 -->
      <template slot="controler">
        <el-popover
          popper-class="screen-popover"
          style="margin-right: 0.6em;"
          placement="top-start"
          width="200"
          trigger="hover"
          content="导出符合筛选条件的所有数据到excel文件并下载"
        >
          <el-button
            slot="reference"
            type="primary"
            size="small"
            icon="el-icon-download"
            @click="exportFormData"
            >导出数据到excel</el-button
          >
        </el-popover>
        <el-popover
          placement="top-start"
          popper-class="screen-popover"
          width="300"
          trigger="hover"
          content="导出符合筛选条件的表单附件，文件按'/用户id/问题列名/附件'整理"
        >
          <el-button
            slot="reference"
            type="primary"
            size="small"
            icon="el-icon-files"
            @click="exportAttachment"
            >导出所有附件/图片</el-button
          >
        </el-popover>
      </template>

      <!--搜索-->
      <template slot="searchFilter">
        <el-form
          :inline="true"
          :model="filterData"
          label-width="100px"
          class="area-main-filter"
          @keyup.enter.native="search"
        >
          <el-form-item label="客户端IP地址">
            <el-input
              v-model="filterData.submitIp"
              placeholder="比如 192.168.0.1"
            ></el-input>
          </el-form-item>

          <el-form-item label="提交时间">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
    </table-page>

    <el-dialog
      title="查看详情"
      :visible.sync="instanceVisible"
      append-to-body
      width="600px"
      top="5vh"
    >
      <iframe
        style="width:100%;height:75vh;border:0 none;background-color: #fff;"
        ref="instanceFrame"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
import {  removeFormInstance} from "@/api/form";
import {
  getFormInstanceList,
  exportData,
  exportAttachment,
  getFormInstanceStatics
} from "@/api/statics";

import { pageRange } from "@/config/setting";
import TablePage from "zkzc-table-page";
import moment from "moment";
import { download } from "@/api/fRander.js";

export default {
  name: "DetailData",
  components: {
    TablePage,
  },
  props: {
    formId: { type: String },
    formData: { type: Object },
    filterIp: { type: String },
  },
  data() {
    return {
      filterData: {
        startTime: "",
        endTime: "",
        submitIp: "",

        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
      },
      //时间范围1
      dateRange: [],

      //表格描述
      vdata: {
        tableData: [],
        tableKeys: [
          {
            id: "formName",
            label: "表单名称",
            minWidth: 160,
          },
          {
            id: "createUser",
            label: "填单人",
            minWidth: 160,
          },
          {
            id: "clientMobile",
            label: "填写人手机号码",
            minWidth: 160,
          },
          {
            id: "endTime",
            label: "截止填写时间",
            minWidth: 160,
          },
          {
            id: "createTime",
            label: "提交时间",
            minWidth: 160,
          },
          {
            id: "updateTime",
            label: "更新时间",
            minWidth: 160,
          },
          {
            id: "submitIp",
            label: "客户端IP",
            minWidth: 160,
          },
        ],
        columnFunctionsWidth: 150,
        tableFunctions: [
          // 操作栏
          {
            label: "查看详情",
            method: this.viewDetail,
          },
          {
            label: "删除",
            method: this.removeItem,
          },
        ],
        statistics:{
          formName:'合计'
        }
      },

      // 表单实例是否可见
      instanceVisible: false,
    };
  },
  watch: {
    formId: {
      handler(val) {
        if (val) {
          let res = this.formData
          // 排序
          let formKeys=[]
          res.formJson.order.forEach(v=>{
            res.formJson.formDesc[v].key = v
            formKeys.push(res.formJson.formDesc[v])
          })

          this.vdata.tableKeys = this.$options.data().vdata.tableKeys;
            formKeys.forEach(v=>{

            let i = v.key
            let data = {
              id: `valueMap.${i}`,
              label: v.label,
              width: 200,
            };
            if (["image","text"].includes(v.type)) {
              return
            }

            // 不同类型返回值整理
            if (v.type === "mobile-validator") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return row.valueMap[i].phone;
              };
            }
            if (v.type === "address-input") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return row.valueMap[i].desc;
              };
            }
            if (v.type === "location-picker") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return row.valueMap[i].name;
              };
            }

            if (v.type === "switch") {
              data.formatter = (row) => {
                return row.valueMap[i] ? "是" : "否";
              };
            }
            if (v.type === "checkbox") {
              let options = {};
              v.options.forEach((v) => {
                options[v.value] = v.text;
              });
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return row.valueMap[i]
                  .map((v) => {
                    return options[v];
                  })
                  .join("<br>");
              };
            }
            // 单选
            if (["radio", "select"].includes(v.type)) {
              let options = {};
              v.options.forEach((v) => {
                options[v.value] = v.text;
              });
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return options[row.valueMap[i]];
              };
            }
            // 带输入单选
            if (v.type==='radio-input') {
              let options = {};
              v.options.forEach((v) => {
                options[v.value] = v.text;
              });
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return options[row.valueMap[i].value]+(row.valueMap[i].input?' : '+row.valueMap[i].input:'');
              };
            }
            // 带输入复选
            if (v.type === "checkbox-input") {
              let options = {};
              v.options.forEach((v) => {
                options[v.value] = v.text;
              });
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return row.valueMap[i]
                  .map((v) => {
                    return options[v.value]+(v.input?' : '+v.input:'');
                  })
                  .join("<br>");
              };
            }
            // 文件和图片
            if (["upload-file", "image-uploader"].includes(v.type)) {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                let fileDownloadLinks = row.valueMap[i].map((v) => {
                  return `<a href="${download(v.fileId).url}" target="_blank">${
                    v.fileName
                  }</a>`;
                });
                return fileDownloadLinks.join("<br>");
              };
            }

            if (v.type === "datetimerange") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return (
                  moment(row.valueMap[i][0] * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) +
                  "~" +
                  moment(row.valueMap[i][1] * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                );
              };
            }
            if (v.type === "date") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return moment(row.valueMap[i] * 1000).format("YYYY-MM-DD");
              };
            }
            if (v.type === "month") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return moment(row.valueMap[i] * 1000).format("YYYY-MM");
              };
            }
            if (v.type === "year") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return moment(row.valueMap[i] * 1000).format("YYYY");
              };
            }
            if (v.type === "timerange") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return (
                  moment(row.valueMap[i][0] * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) +
                  "~" +
                  moment(row.valueMap[i][1] * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                );
              };
            }
            if (v.type === "week") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return moment(row.valueMap[i] * 1000).format("W");
              };
            }
            if (v.type === "datetime") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return moment(row.valueMap[i] * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              };
            }
            if (v.type === "daterange") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return (
                  moment(row.valueMap[i][0] * 1000).format("YYYY-MM-DD") +
                  "~" +
                  moment(row.valueMap[i][1] * 1000).format("YYYY-MM-DD")
                );
              };
            }
            if (v.type === "monthrange") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return (
                  moment(row.valueMap[i][0] * 1000).format("YYYY-MM") +
                  "~" +
                  moment(row.valueMap[i][1] * 1000).format("YYYY-MM")
                );
              };
            }
            if (v.type === "time-picker") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return moment(row.valueMap[i]).format("HH:mm:ss");
              };
            }
            if (v.type === "dates") {
              data.formatter = (row) => {
                if(!row.valueMap[i])return
                return row.valueMap[i]
                  .map((v) => {
                    return moment(v * 1000).format("YYYY-MM-DD");
                  })
                  .join(",");
              };
            }

            // console.log(v.type, data, v);
            this.vdata.tableKeys.push(data);
          })
          console.log("getForm", res);

          if(this.filterIp){
            // 统一IP重复填写跳转
            this.filterData.submitIp = this.filterIp
          }
          this.getData();
        }
      },
      immediate: true,
    },
  },
  async mounted() {
    // this.getData()
  },
  methods: {
    async getData() {
      if (!this.formId) {
        return;
      }
      const {
        startTime,
        endTime,
        submitIp,
        pageNum,
        pageSize,
      } = this.filterData;
      getFormInstanceList({
        startTime,
        endTime,
        submitIp,
        pageNum,
        pageSize,
        formKey: this.formId,
      }).then((res) => {
        this.vdata.tableData = res.content;
        Object.assign(this.filterData, {
          pageNum: res.number + 1,
          pageSize: res.size,
          rowTotal: res.totalElements,
        });
      });

      let res = await getFormInstanceStatics(this.formId)
      let statics = {}
      for(let i in res){
        statics['valueMap.'+i] = res[i]
      }
      this.vdata.statistics = Object.assign(this.$options.data().vdata.statistics,statics)
    },
    search() {
      this.filterData.pageNum = 1;
      this.filterData.startTime = (this.dateRange && this.dateRange[0]) || "";
      this.filterData.endTime = (this.dateRange && this.dateRange[1]) || "";
      this.getData();
    },
    resetSearch() {
      this.resetFilter();
      this.getData();
    },
    resetFilter() {
      this.filterData = {
        startTime: "",
        endTime: "",
        submitIp: "",

        pageNum: 1,
        pageSize: pageRange[0],
        rowTotal: 0,
        pageSizes: pageRange,
      };
      this.dateRange = [];
    },
    sizeChange(val) {
      this.filterData.pageSize = val;
      this.filterData.pageNum = 1;
      this.getData();
    },
    currentChange(val) {
      this.filterData.pageNum = val;
      this.getData();
    },
    viewDetail({ row }) {
      this.instanceVisible = true;
      this.$nextTick(() => {
        this.$refs["instanceFrame"].src = `${location.origin}${
          process.env.NODE_ENV === "production"
            ? process.env.VUE_APP_BASE_API
            : ""
        }/form.html?#/client/${this.formId}?readonly=1&instanceId=${row.id}`;
      });
    },
    removeItem({ row }) {
      this.$confirm(
        "删除该项后，关联的附件也会被删除，确认要继续吗？",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          removeFormInstance({
            formKey: this.formId,
            id: row.id,
          }).then((res) => {
            this.$message({
              type: "success",
              message: `操作成功`,
            });
            this.getData();
          });
        })
        .catch(() => {
          //该代码不能删除否则js报错
        });
    },
    //导出表单数据
    exportFormData() {
      exportData({
        formKey: this.formId,
        submitIp: this.filterData.submitIp,
        startTime: this.filterData.startTime,
        endTime: this.filterData.endTime,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "导出成功，开始下载文件",
        });
      });
    },
    //导出附件图片
    exportAttachment() {
      exportAttachment({
        formKey: this.formId,
        submitIp: this.filterData.submitIp,
        startTime: this.filterData.startTime,
        endTime: this.filterData.endTime,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "导出成功，开始下载文件",
        });
      });
    },

    // 修改筛选条件，触发search
    startSearch({startTime = '', endTime = '', submitIp = ''}) {
      this.resetFilter()
      this.filterData.startTime = startTime
      this.filterData.endTime = endTime
      this.filterData.submitIp = submitIp

      this.getData()
    }
  },
};
</script>

<style lang="scss" scoped></style>
