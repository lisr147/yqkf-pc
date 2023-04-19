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
      <el-button type="text" @click="uploadId = tableId" style="font-size: 1.5em;">点击上传EXCEL文件</el-button>
      <div>
        {{ uploadFailMsg }}
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
import {MessageBox} from "@/plugins/element";
import {exportFailData} from "@/api/common";

export default {
  name: "uploadFile",
  props: ['tableId', 'ztlxType', 'hotelrylb','schoolRylb','positiveRylb'],
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
      uploadFailMsg: '',
      uploadSucceed: false,
      specialIds: [12138,12139], //特殊处理的模板ID
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
    if(!this.specialIds.includes(this.tableId)) {
      this.initData()
    }
  },
  methods: {
    async initData(){
      await this.$Api().ImportDataController.post_list.request({
        data: {
          // useCurrentDept: true
        },
        headers: {
          hideNotify: true,
        },
      }).then(res => {
        this.tableData = res && res.length ? res.map((v) => {
          v.fileName = "";
          v.uploadSucceed = false;
          v.uploadFailMsg = null;
          v.uploadId = null;
          return v;
        }) : [];
      })
    },
    uploadCheck(file) {
      // console.log('uploadCheck', file, this.uploadId)
      if(this.specialIds.includes(this.tableId)){
        return this.specialImportData(file)
      }
      // 更新导入列表文件名
      let tableData = this.tableData.filter((v) => v.id + '' === this.uploadId + '')[0];
      tableData.fileName = file.name;
      let data = {
        uploadFile: file,
      }
      if (this.ztlxType) data.ztlx = this.ztlxType
      if (this.hotelrylb) data.rylb = this.hotelrylb
      if (this.schoolRylb) data.rylb = this.schoolRylb
      if (this.positiveRylb) data.rylb = this.positiveRylb
      this.$Api()
        .ImportDataController.post_checkData.request({
        data: data,
        path: {
          id: this.uploadId,
        },
        headers: {
          hideNotify: true,
        },
      })
        .then((res) => {
          if(res){
            if (res.failDataFileId) {
              this.exportFailData(res.failDataFileId)
            }
            this.uploadSucceed = true;
            this.uploadId = res.checkId;
            this.importData(res)
          }else {
            this.uploadFailMsg = res.msg;
            this.uploadSucceed = false;
          }
        });
      return false;
    },

    async exportFailData(fileId) {
      let res = await exportFailData(fileId)
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
    async importData(data) {
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
      if (!res || !res.data.unusualUnits) {
        if(data.failDataFileId){
          this.$message({
            message: `导入成功${data.successCount}条数据，失败${data.failCount}条数据，下载失败记录文件请更正再重新导入`,
            type: "error",
            duration: 5 * 1000,
          });
        }else {
          this.$message({
            message: `导入成功${data.successCount}条数据`,
            type: "success",
            duration: 5 * 1000,
          });
        }
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
      this.isSelectAll = false;
      // this.$emit("update");
    },

     specialImportData(file) {
      this.$Api()
        .PopulationVerificationController.post_checkData.request({
        data: {
          uploadFile: file,
        },
        path: {
          id: this.uploadId,
        },
        headers: {
          hideNotify: true,
        },
      }).then((data) => {
          if(data){
            if (data.failDataFileId) {
              this.exportFailData(data.failDataFileId)
            }
            this.uploadSucceed = true;
            this.uploadId = data.checkId;
            if (!this.uploadSucceed) {
              this.$message({
                message: `请先上传正确的文件`,
                type: "info",
                duration: 5 * 1000,
                showClose: true,
              });
              return;
            }
            let res
            if(this.tableId===12138){ //任务核查
              res = this.$Api().PopulationVerificationController.post_importCheckResult.request({
                data: [this.uploadId],
                headers: {
                  hideNotify: true,
                  returnRawMsg: true,
                },
              })
            }else { //人员核查
              res =  this.$Api().PopulationVerificationController.post_inspectorImport.request({
                data: [this.uploadId],
                headers: {
                  hideNotify: true,
                  returnRawMsg: true,
                },
              })
            }
            if (res) {
              if(data.failDataFileId){
                this.$message({
                  message: `导入成功${data.successCount}条数据，失败${data.failCount}条数据，下载失败记录文件请更正再重新导入`,
                  type: "error",
                  duration: 5 * 1000,
                });
              }else {
                this.$message({
                  message: `导入成功${data.successCount}条数据`,
                  type: "success",
                  duration: 5 * 1000,
                });
              }
              setTimeout(()=>{
                this.$emit("close");
                this.$emit("update");
              },300)
            }
          }else {
            this.uploadFailMsg = res.msg;
            this.uploadSucceed = false;
          }
        });
      return false
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
