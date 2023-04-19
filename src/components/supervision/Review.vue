<template>
  <div class="view-wrapper" v-if="editType === 'view'">
    <el-divider></el-divider>
    <div class="dt-wrapper">
      <div class="t4 tt">所有动态</div>
      <div class="dt-list">
        <div class="dt-item" v-for="(item,index) in supervisionTaskProcess" :key="index">
          <div class="dt-item-left">
            <div class="t4">{{item.createUserName}}</div>
            <div class="flex-space">
              <div class="t4 flex-item">{{formData.taskStatus == 1 && (index === supervisionTaskProcess.length - 1) ? '完成了任务：' : ''}}{{item.content || '-'}}</div>
              <div class="t4 flex-item">{{item.createTime}}</div>
            </div>
            <div style="display: flex">
              <div class="t4 link" v-if="item.images && item.images.length" @click="handleImgPreview(item.images)">查看图片</div>
              <div class="t4 link" v-if="item.attachments && item.attachments.length" @click="previewFile(item.attachments)">查看附件</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-wrapper" v-if="formData.taskStatus !== 1">
      <el-divider></el-divider>
      <el-form ref="reviewForm" :model="reviewForm">
        <el-form-item  label-width="80px" label="进展更新">
          <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="reviewForm.content">
          </el-input>
        </el-form-item>
        <el-form-item label-width="80px" label="图片上传">
          <el-upload
              ref="imgUpload"
              class="upload-demo"
              :action="uploadUrl"
              :on-error="handleImgError"
              accept="image/jpeg, image/jpg, image/png"
              :on-success="handleImgSuccess"
              :on-remove="handleImgRemove"
              multiple
              :limit="10"
              :file-list="imgList">
            <el-button size="small" palin>点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label-width="80px" label="附件上传">
          <el-upload
              ref="fileUpload"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.zip,.rar, .doc, .docx, .xls, .xlsx, .pptx, .ppt, .txt"
              class="upload-demo"
              :action="uploadUrl"
              :on-error="handleImgError"
              :on-success="handleFileSuccess"
              :on-remove="handleFileRemove"
              :limit="1"
              :file-list="fileList">
            <el-button size="small" palin>点击上传</el-button>
          </el-upload>
        </el-form-item>

      </el-form>
      <div class="dialog-footer flex-space">
        <div style="display: flex">
<!--          <div class="upload-box">-->

<!--          </div>-->
<!--          <el-button size="small" palin>添加附件</el-button>-->
        </div>
        <el-button size="small" type="primary" @click="saveProcess">发送</el-button>
      </div>
    </div>
    <el-image-viewer
        v-if="previewVisible"
        :zIndex="10000"
        :on-close="()=>{previewVisible=false}"
        :url-list="previewImgList" />
  </div>
</template>

<script>
import {supervisionUpdate ,getUploadDCDBfileUrl} from "@/api/supervision";
export default {
  name: "Review",
  data () {
    return {
      reviewForm: {
        content: ''
      }, //评论表单
      previewImgList: [],
      previewVisible: false,
      imgList: [], //
      fileList: [], //
      uploadUrl: ''
    }
  },
  props: {
    editType: {
      type: String,
      default: 'add'
    },
    showme: { type: Boolean },
    formData: { type: Object },
    mobilePreview: { type: Boolean },
    supervisionTaskProcess: {
      type: Array,
      default: () => {
        return []
      }
    },
    token: {
      type: String,
      default: ''
    },
    currId: { type: [String, Number] },
  },
  mounted() {
    this.uploadUrl = getUploadDCDBfileUrl()
  },
  watch: {
    formData (val) {
      console.log('formData',val, this.showme)
      if (val && this.showme && this.editType === 'view') {
        // 还原表单里的内容
        this.$nextTick(() => {
          this.reviewForm.content = ''
          this.fileList = []
          this.imgList = []
          this.$refs.imgUpload && this.$refs.imgUpload.clearFiles();
          this.$refs.imgUpload && this.$refs.fileUpload.clearFiles();
        })
      }
    }
  },
  components: {
    'el-image-viewer':()=>import('element-ui/packages/image/src/image-viewer'),
  },
  methods: {
    // 更新进展
    saveProcess () {
      if (!this.reviewForm.content) {
        this.$message.warning('请输入进展更新内容')
        return
      }
      let images = this.imgList.filter(item => item.response && item.response.code == 1).map(item => {
        let responseData = item.response.data
        return {
          id: responseData.id,
          name: responseData.name,
          type: responseData.type,
          size: responseData.size,
        }
      })
      let attachments = this.fileList.filter(item => item.response && item.response.code == 1).map(item => {
        let responseData = item.response.data
        return {
          id: responseData.id,
          name: responseData.name,
          type: responseData.type,
          size: responseData.size,
        }
      })
      let params = {
        content: this.reviewForm.content,
        taskId: this.currId,
        images,
        attachments
      }
      console.log('imgList',this.imgList)
      let request = supervisionUpdate
      if (this.token) {
        params.token = this.token
      }
      request(params).then(res => {
        console.log('更新进展', res)
        this.$emit('updateList')
        this.$message.success("发送成功");
        if (this.token) {
          // 移动端打开的
          location.reload()
        }else {
          this.getSuccess()
        }
      })
    },
    // 预览图片
    handleImgPreview (list) {
      console.log('预览图片',list)
      this.previewImgList = list.map(item => `/yqfk/api/mediaInfo/preview/${item.id}`)
      this.previewVisible = true
    },
    getSuccess () {
      this.$emit('success')
    },
    previewFile(fileList) {
      let file = fileList[0]
      console.log('fileList1',fileList)
      console.log('mobilePreview1',this.mobilePreview)
      if (this.mobilePreview) {
        wx.previewFile({
          url: `${location.protocol}//${location.host}/yqfk/api/mediaInfo/preview/${file.id}`,
          size: file.size,
          name: file.name,
        });
      }else {
        this.handleFilePreview(file.id)
      }
    },
    async handleFilePreview (id) {
      // 导出附近
      // eslint-disable-next-line no-unused-vars
      let res = await this.$Api().MediaInfoController.get_download.request({
        path: {
          mediaInfoId: id,
        },
        responseType: "blob",
      });
    },
    handleImgRemove (file,fileList) {
      console.log('上传文件移除', file, fileList)
      this.imgList = fileList
    },
    handleImgError (err, file, fileList) {
      // console.log('err',JSON.parse(err), err, file, fileList)
      // this.$message.error(err)
    },
    handleImgSuccess (response, file, fileList) {
      console.log('上传成功', response, file, fileList)
      // this.fileList.push(response.data)
      this.imgList = fileList
    },
    handleFileRemove (file,fileList) {
      console.log('上传文件移除', file, fileList)
      this.fileList = fileList
    },
    handleFileSuccess (response, file, fileList) {
      this.fileList = fileList
    }
  }
}
</script>

<style lang="scss" scoped>
.dt-wrapper {
  padding: 0 60px;
  width: 100%;
  box-sizing: border-box;
}
.flex-item {
  flex: 1;
}
.flex-space {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.t4 {
  margin-bottom: 4px;
  &.link {
    color: #3F9FFE;
    cursor: pointer;
    margin-right: 10px;
  }
}
.tt {
  margin-bottom: 24px;
}
.dt-item {
  margin-bottom: 20px;
}
@media screen and (max-width: 1024px) {
  .supervision-dialog {
    .supervision-form, .dt-wrapper {
      padding: 0 10px;
    }
    .dt-wrapper {
    }
    .el-dialog__body {
      padding: 10px 10px;
    }
  }
}
.upload-box {
  margin-right: 10px;
}
.prev-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>
