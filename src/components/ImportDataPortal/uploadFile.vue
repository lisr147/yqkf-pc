<!-- 导入文件选择 -->
<template>
  <el-dialog
    :visible="true"
    append-to-body
    width="300px"
    :modal="false"
    :close-on-click-modal="false"
    @close="$emit('close')"
    top="8vh"
    title="导入文件"
  >
    <el-upload
      class="upload-demo"
      action="#"
      :file-list="file.fileList"
      :show-file-list="false"
      :before-upload="uploadCheck"
      style="text-align:center;"
    >
      <el-button type="text"  @click="uploadId = tableId" style="font-size: 1.5em;">点击上传EXCEL文件</el-button>
      <div>
      {{uploadFailMsg}}
      </div>
    </el-upload>
<!-- 
    <div slot="footer">
      <el-checkbox v-model="isSelectAll" @change="changeSelectAll">全选</el-checkbox>
      <el-button icon="el-icon-upload2" type="primary" @click="importData"
        >导入</el-button
      >
    </div> -->
  </el-dialog>
</template>
<script>
// import TablePage from "zkzc-table-page";
import { MessageBox } from "@/plugins/element";

export default {
  name: "uploadFile",
  props:['tableId'],
//   components: { TablePage },
  data() {
    return {
      tableData: [], // 主页面表格数据
      filter: {
        name: "",
        code: "",
      },
      uploadId: null,
      isSelectAll: false,
      selectData: [],
      file: {
        fileList: [],
      },
      uploadFailMsg:'',
      uploadSucceed:false
    };
  },
  computed: {
    tableListData() {
      let tableData = {
        selection: true,
        columnFunctionsWidth: 120, // 操作栏宽度
        tableData: this.tableData,
        selectable: (row, index) => {
          return row.uploadSucceed;
        },
        rowStyle: (row, index) => {
          let style = {};
          if (row.row.uploadFailMsg && !row.row.uploadSucceed) {
            style.backgroundColor = "rgb(37, 23, 87)";
          }
          return style;
        },

        tableKeys: [
          // 表格标签
          {
            id: "name",
            label: "数据类型",
            width: "150",
            allways: true,
          },
          {
            id: "templateName",
            label: "模板文件",
            minWidth: "150",
          },
          {
            id: "fileName",
            label: "上传文件",
            minWidth: "150",
          },
          {
            id: "uploadFailMsg",
            label: "校验状态",
            minWidth: "300",
          },
          {
            id: "upload",
            label: "选择文件",
            minWidth: "120",
          },
        ],
        tableFunctions: [
          // {
          //   label: '回滚',
          //   method: this.revent
          // }
        ],
      };
      return tableData;
    },
  },
  async mounted() {
    let res = await this.$Api().ImportDataController.post_list.request({
      data: {
        // useCurrentDept: true
      },
      headers: {
        hideNotify: true,
      },
    });
    this.tableData = res.map((v) => {
      v.fileName = "";
      v.uploadSucceed = false;
      v.uploadFailMsg = null;
      v.uploadId = null;
      return v;
    });
  },
  methods: {
    uploadCheck(file) {
      // console.log('uploadCheck', file, this.uploadId)
      // 更新导入列表文件名
      let tableData = this.tableData.filter((v) => v.id+'' === this.uploadId+'')[0];
      tableData.fileName = file.name;
      this.$Api()
        .ImportDataController.post_checkData.request({
          data: {
            uploadFile: file,
          },
          path: {
            id: this.uploadId,
          },
          headers: {
            hideNotify: true,
          },
        })
        .then((res) => {
          if (!res.code && res.code !== 0) {
            this.uploadSucceed = true;
            this.uploadFailMsg = "校验成功";
            this.uploadId = res;
            this.importData()
          } else {
            this.uploadFailMsg = res.msg;
            this.uploadSucceed = false;
          }
        });
      return false;
    },
    changeSelectAll(v) {
      this.$refs.table.checkAll(v);
    },
    tableSelect(data) {
      this.selectData = data;
      this.isSelectAll = !(
        this.selectData.length <
        this.tableData.filter((v) => v.uploadSucceed).length
      );
    },
    async importData() {
      if (!this.uploadSucceed) {
        this.$message({
          message: `请先上传正确的文件`,
          type: "info",
          duration: 5 * 1000,
          showClose: true,
        });
        return;
      }
      let res = await this.$Api().ImportDataController.post_import.request({
        data: [this.uploadId],
        headers: {
          hideNotify: true,
          returnRawMsg: true,
        },
      });
      console.log(res);
      if (!res || !res.data.unusualUnits) {
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 5 * 1000,
        });
        this.$emit("close");
        this.$emit("update");
      } else {
        MessageBox.alert(res.msg, "警告", {
          onfirmButtonText: "查看详情",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          showCancelButton: true,
          type: "warning",
        }).then(() => {
          console.log("异常企业跳转");
          this.$store.commit("global/SET_UNUSUALUNITS", res.data.unusualUnits);
          this.$emit("closeAll");
        });
      }

      this.selectData.forEach((v) => {
        v.uploadSucceed = false;
        v.uploadFailMsg = null;
        v.uploadId = null;
        v.fileName = null;
      });
      this.changeSelectAll(false);
      this.isSelectAll = false;
      this.$emit("update");
    },
    revent(scope) {
      MessageBox.alert(
        "请确认回滚操作，该操作将导致本数据恢复到上一次导入的数据值",
        "警告",
        {
          onfirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          showCancelButton: true,
          type: "warning",
        }
      ).then(async () => {
        await this.$Api().ImportDataController.post_rollback.request({
          path: {
            id: scope.row.id,
          },
        });
        this.$emit("update");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  margin: 0px 10px;
}
</style>
