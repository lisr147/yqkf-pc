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
      <el-button type="text"  style="font-size: 1.5em;">点击上传EXCEL文件</el-button>
    </el-upload>
  </el-dialog>
</template>
<script>

export default {
  name: "uploadFile2",
  props:{
    tableId:{type:Number,required: true}
  },
  data() {
    return {
      file: {
        fileList: [],
      },
      uploadFailMsg:'',
      token:null
    };
  },
  async mounted() {
    this.token = this.$route.query.token;
  },
  methods: {
    //用于购药记录核查记录上传，无需token校验
    uploadCheck(file) {
      if(this.tableId===10057){
        this.$Api().DrugController.post_importDrugData.request({
          data: {
            uploadFile: file,
            token:this.token
          },
          headers: {
            hideNotify: true,
          },
        }).then((res) => {
          if(res){
            this.$alert("上传成功", "提示", {
              confirmButtonText: "确定",
              customClass:'alert-box',
              callback: () => {
                location.reload();
              },
            });
          }});
      }else if(this.tableId===12138){
        this.$Api().PopulationVerificationController.post_importCheckResult.request({
          data: {
            multipartFile: file,
            token:this.token
          },
          headers: {
            hideNotify: true,
          },
        }).then((res) => {
          if(res){
            this.$alert("导入成功", "提示", {
              confirmButtonText: "确定",
              customClass:'alert-box',
              callback: () => {
                location.reload();
              },
            });
          }});
      }

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
