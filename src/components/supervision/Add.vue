<!--modal-append-to-body必须设置为 "false"-->
<!--否则富文本编辑器会因此功能异常-->
<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="close"
      width="600px"
      :title="dialogTitle"
      :visible="showme"
      :show-close="dialogConfig.showClose"
      :fullscreen="dialogConfig.fullscreen"
      :modal="true"
      class="supervision-dialog"
    >
      <el-form
        class="supervision-form"
        label-width="auto"
        ref="addTaskForm"
        :rules="editType === 'add' ? formRules : {}"
        :model="form"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input
            v-if="editType === 'add'"
            type="text"
            size="small"
            placeholder="请输入"
            v-model="form.name"
          />
          <span v-else class="view view1" @click="testChangeMo">{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-select
            v-if="editType === 'add'"
            size="small"
            v-model="form.type"
            placeholder="请选择"
            style="width: 100%;z-index:200;"
          >
            <el-option
              :value="item.label"
              :label="item.label"
              v-for="item in supervisionTypeList"
              :key="item.value"
            />
          </el-select>
          <span v-else class="view">{{ form.typeName }}</span>
        </el-form-item>
        <el-form-item prop="source">
          <span slot="label" class="supervision-form-label">
            <span class="supervision-form-label__tips">任务来源</span>
            <!-- <el-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right">
              <i class="el-icon-info"></i>
            </el-tooltip> -->
          </span>
          <div class="tips-form-item-box">
            <el-input
              v-if="editType === 'add'"
              type="text"
              size="small"
              placeholder="请输入"
              v-model="form.source"
            />
            <span v-else class="view">{{ form.source }}</span>
          </div>
        </el-form-item>
        <el-form-item label="执行人员" prop="userIds">
          <el-select
            v-if="editType === 'add'"
            v-model="form.userIds"
            multiple
            placeholder="请选择"
            size="small"
            @remove-tag="onzxryRemove"
            @focus="onzxryFocus"
            style="width: 100%"
          >
            <el-option
              v-for="item in selectedzxryList"
              :key="item.id"
              :label="item.fullName"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <span v-else class="view"
            >{{ form.executors }}
            <el-button
              v-if="form.taskStatus != 1 && !dialogConfig.token"
              @click="urge"
              class="cui-btn"
              type="text"
              size="normal"
              >催一下</el-button
            ></span
          >
        </el-form-item>
        <el-form-item label="截止时间" prop="endTime">
          <el-date-picker
            style="width: 100%;"
            v-if="editType === 'add'"
            v-model="form.endTime"
            :default-value="defaultValue"
            type="datetime"
            ref="datePicker"
            @change="handleEndTimeChange"
            @blur="handleEndTimeBlur"
            :picker-options="pickerOptions"
            placeholder="选择日期时间"
          >
          </el-date-picker>
          <span v-else class="view">{{ form.endTime }}</span>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input
            v-if="editType === 'add'"
            type="textarea"
            size="small"
            placeholder="请输入"
            v-model="form.content"
          />
          <span v-else class="view">{{ form.content }}</span>
        </el-form-item>
        <el-form-item
          label="当前状态"
          prop="taskStatus"
          v-if="editType === 'view'"
        >
          <span class="view">{{
            this.supervisionStatusList.find((v) => v.value == form.taskStatus)
              ? this.supervisionStatusList.find(
                  (v) => v.value == form.taskStatus
                ).label
              : "进行中"
          }}</span>
        </el-form-item>
        <el-form-item label="附件" prop="attachmentName">
          <el-upload
            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.zip,.rar, .doc, .docx, .xls, .xlsx, .pptx, .ppt, .txt"
            v-if="editType === 'add'"
            ref="fileUploader"
            class="supervision-form-attachment"
            :action="uploadUrl"
            :limit="1"
            :file-list="fileList"
            :on-success="handleAttachmentUploadSuccess"
            :on-error="handleAttachmentUploadError"
          >
            <el-button
              v-if="fileList.length === 0"
              size="small"
              icon="el-icon-upload2"
              >点击上传</el-button
            >
          </el-upload>
          <span v-else class="view">
            <span v-if="form.attachments && form.attachments.length">
              <template v-for="item in form.attachments">
                <a
                  href="javascript:;"
                  :key="item.id"
                  style="margin-right: 10px"
                  @click="previewFile(item)"
                  >{{ item.name }}</a
                >
<!--                <a-->
<!--                  :href="item.url"-->
<!--                  :key="item.id"-->
<!--                  style="margin-right: 10px"-->
<!--                  v-else-->
<!--                  >{{ item.name }}</a-->
<!--                >-->
              </template>
            </span>
            <span v-else>无</span>
          </span>
        </el-form-item>
        <el-form-item label="图片" prop="tp">
          <el-upload
            v-if="editType === 'add'"
            class="supervision-form-image"
            ref="imgUploader"
            accept="image/jpeg, image/jpg, image/png"
            list-type="picture-card"
            :action="uploadUrl"
            :multiple="true"
            :on-preview="handleImagePreview"
            :on-remove="handleImageRemove"
            :on-success="handleImageUploadSuccess"
            :on-error="handleImageUploadError"
          >
            <!-- <template v-if="form.images.length > 0">
              <img class="supervision-form-image-preview" v-for="img in form.images" :key="img.id" :src="img.url">
            </template> -->
            <!-- <div class="supervision-form-image-add">
              <i class="el-icon-plus supervision-form-image-add-icon"></i>
              <div class="supervision-form-image-add-hint">上传照片</div>
            </div> -->
            <i class="el-icon-plus supervision-form-image-add-icon"></i>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
          <div v-else-if="form.images && form.images.length > 0">
            <el-image
              class="supervision-form-image-preview"
              v-for="img in form.images"
              :key="img.id"
              :src="img.url"
              :z-index="10000"
              :preview-src-list="form.images.map((v) => v.url)"
            >
            </el-image>
          </div>
          <div v-else>暂无</div>
        </el-form-item>
      </el-form>

      <div class="complete-wrapper" v-if="editType === 'complete'">
        <el-divider></el-divider>
        <el-form>
          <el-form-item
            ref="completeForm"
            :inline="true"
            :model="completeForm"
            label="任务完成描述"
            label-width="100px"
          >
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="completeForm.content"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer" v-if="editType === 'add'">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="handleAddTask"
          >确定</el-button
        >
      </div>
      <div slot="footer" class="dialog-footer" v-if="editType === 'complete'">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="handleComplete"
          >确定完成</el-button
        >
      </div>
      <!--      动态及任务评论模块-->
      <review
        :editType="editType"
        @updateList="updateList"
        :showme="showme"
        :currId="currId"
        :supervisionTaskProcess="supervisionTaskProcess"
        :formData="form"
        :mobilePreview="mobilePreview"
        :token="dialogConfig.token"
        @success="close"
      ></review>
    </el-dialog>
    <user
      v-model="userVisible"
      :showme="showme"
      @chooseUser="chooseUser"
      :selectedUsers="selectedzxryList"
    ></user>
    <el-dialog :visible.sync="imagePreviewVisible">
      <img width="100%" :src="previewUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { supervisionTypeList, supervisionStatusList } from "@/config/setting";
import {
  addTask,
  getSupervisionDetail,
  getProcessByMobile,
  stopTask,
  urgeSupervision,
  getJsTicket,
} from "@/api/supervision";
import Review from "@/components/supervision/Review";
import { parseTime } from "@/utils/common";
import User from "./User";
// import wx from 'weixin-js-sdk'
// import VConsole from 'vconsole';
export default {
  name: "supervisionAdd",
  props: {
    showme: { type: Boolean },
    editType: { type: String },
    currId: { type: [String, Number] },
    dialogConfig: {
      type: Object,
      default: () => {
        return { showClose: true, fullscreen: false, token: "" };
      },
    },
  },
  components: {
    User,
    Review,
  },
  model: {
    prop: "showme",
    event: "toggle",
  },
  computed: {
    dialogTitle() {
      let nameMapping = {
        edit: "编辑任务",
        view: "查看进展",
        add: "新增任务",
        complete: "任务完成",
      };
      return nameMapping[this.editType];
    },
    uploadUrl() {
      return `${location.protocol}//${location.host}/yqfk/api/mediaInfo/upload/dcdb`;
    },
  },
  data() {
    return {
      form: {
        name: "",
        type: "",
        source: "",
        userIds: "",
        endTime: "",
        content: "",
        departmentIds: "",
        attachments: [],
        images: [],
      }, //新建表单
      supervisionStatusList,
      completeForm: {
        content: "",
      }, //任务完成表单
      defaultValue: "",
      addExecutiveVisible: false,
      selectedzxryList: [],
      supervisionTaskProcess: [],
      userVisible: false, //执行人员dialog
      supervisionTypeList,
      // 表单校验
      formRules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        type: [{ required: true, message: "请选择", trigger: "blur" }],
        source: [{ required: true, message: "请输入", trigger: "blur" }],
        userIds: [{ required: true, message: "请输入", trigger: "blur" }],
        endTime: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      pickerOptions: {
        selectableRange: (() => {
          const data = new Date();
          const hour = data.getHours();
          const minute = data.getMinutes();
          const second = data.getSeconds();
          return [`${hour}:${minute}:${second} - 23:59:59`];
        })(),
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000;
        },
      },
      // defaultTime: '',
      fileList: [],
      previewUrl: "",
      imagePreviewVisible: false,
      mobilePreview: false, //能否使用粤政易文件预览接口
    };
  },

  watch: {
    showme(val) {
      if (val && this.editType === "add") {
        this.$nextTick(() => {
          this.$refs["addTaskForm"].clearValidate();
        });
      }
      if (val && this.currId) {
        this.getData();
      }
      const date = new Date();
      if (this.defaultValue) {
        if (date.getTime() != this.defaultValue.getTime()) {
          this.defaultValue = date;
        }
      } else {
        this.defaultValue = date;
      }
    },
    "dialogConfig.token": {
      handler(token) {
        if (token) {
          this.getData();
        }
      },
      immediate: true,
    },
  },
  async mounted() {
    if(!window.wx){
      return
    }
    let res = await getJsTicket({url: location.href.split("#")[0]});
    let _this = this;
    wx.config({
      beta: true, // 调用wx.invoke形式的接口值时，该值必须为true。
      debug: location.href.includes("debug"), // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      // appId: location.href.includes("dn.product.iot-cas.com") ? 'wld341060039' : 'wl2bee594e73', // 必填，粤政易的cropID
      appId: res['appId'],
      timestamp: res["x-tif-timestamp"], // 必填，生成签名的时间戳
      nonceStr: res["x-tif-nonce"], // 必填，生成签名的随机串
      signature: res["x-tif-signature"], // 必填，签名，见附录1
      jsApiList: ["previewImage", "previewFile"], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(() => {
      wx.checkJsApi({
        jsApiList: ["previewImage","previewFile"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
          console.log('checkJsApi success res',res)
          _this.mobilePreview = res.checkResult.previewFile;
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        },
        error: function (res) {
          console.log('checkJsApi error res',res)
        }
      });
    });
    wx.error((res) => {
      // alert(res)
      console.log('checkJsApi1 error res',res)
    });
  },
  methods: {
    getData() {
      let request = getSupervisionDetail;
      let params = this.currId;
      if (this.dialogConfig.token) {
        request = getProcessByMobile;
        params = { token: this.dialogConfig.token };
      }
      request(params).then((res) => {
        console.log("获取任务详情", res);
        const { supervisionTask } = res;
        this.form = {
          ...supervisionTask,
          executors: supervisionTask.userInfos
            ? supervisionTask.userInfos
                .map(
                  (i) =>
                    `${i.departmentName ? i.departmentName + "-" : ""}${i.name}`
                )
                .join("，")
            : "",
          endTime: parseTime(supervisionTask.endTime),
          images:
            supervisionTask.images && supervisionTask.images.length
              ? supervisionTask.images.map((item) => ({
                  ...item,
                  url: `/yqfk/api/mediaInfo/preview/${item.id}`,
                }))
              : null,
          typeName: supervisionTypeList.find(
            (v) => v.value === res.supervisionTask.type
          ).label,
          attachments:
            supervisionTask.attachments && supervisionTask.attachments.length
              ? supervisionTask.attachments.map((item) => ({
                  ...item,
                  url: `${location.protocol}//${location.host}/yqfk/api/mediaInfo/preview/${item.id}`,
                }))
              : null,
        };
        this.supervisionTaskProcess = res.supervisionTaskProcess.map((item) => {
          return { ...item, createTime: parseTime(item.createTime) };
        });
        this.previewUrl =
          supervisionTask.images && supervisionTask.images.length
            ? `/yqfk/api/mediaInfo/preview/${res.supervisionTask.images[0].id}`
            : "";
      });
    },
    updateList() {
      this.$emit("updateList");
    },
    handleAddTask() {
      this.$refs["addTaskForm"].validate((valid) => {
        // 表单校验失败则退出
        if (valid === false) {
          return false;
        }
        console.log(this.form);
        const { type, userIds } = this.form;
        this.form = {
          ...this.form,
          type: supervisionTypeList.find((v) => v.label === type).value,
          userIds: userIds.join(","),
        };
        addTask(this.form).then(() => {
          this.$message.success("新增任务成功");
          this.updateList();
          this.close();
        });
      });
    },
    chooseUser(list) {
      this.selectedzxryList = [...list];
      this.form.departmentIds = [
        ...new Set(list.map((v) => v.departmentId)),
      ].join(",");
      this.form.userIds = list.map((item) => item.id);
    },
    close() {
      this.form = {
        name: "",
        type: "",
        source: "",
        userIds: "",
        endTime: "",
        content: "",
        attachments: [],
        departmentIds: "",
        images: [],
      };
      this.fileList = [];
      this.completeForm.content = "";
      this.selectedzxryList = [];
      if (this.$refs.imgUploader) this.$refs.imgUploader.clearFiles();
      if (this.$refs.fileUploader) this.$refs.fileUploader.clearFiles();
      this.$refs["addTaskForm"].clearValidate();
      this.$emit("toggle", false);
    },
    handleImagePreview(file) {
      this.previewUrl = file.url;
      this.imagePreviewVisible = true;
    },
    handleImageRemove(file) {
      const index = this.form.images.findIndex((v) => v.name === file.name);
      this.form.images.splice(index, 1);
    },
    onzxryFocus() {
      this.userVisible = true;
    },
    onzxryRemove(val) {
      console.log("onzxryRemove", val);
      let index = this.selectedzxryList.findIndex((item) => item.id === val);
      this.selectedzxryList.splice(index, 1);
    },
    handleAttachmentUploadSuccess(res) {
      if(res.code!='1') {
        this.fileList = []
        this.$message.error(res.msg);
        return
      }
      const { id, type, name, previewUrl: url, size } = res.data;
      const attachment = {
        id,
        type,
        name,
        url,
        size
      };
      this.form.attachments =
        this.form.attachments.length > 0
          ? [...this.form.attachments, attachment]
          : [attachment];
    },
    handleAttachmentUploadError() {
      this.$message.error("附件上传失败");
    },
    handleImageUploadSuccess(res) {
      const { id, type, name, previewUrl: url, size } = res.data;
      this.previewUrl = url;
      const image = {
        id,
        type,
        name,
        url,
        size
      };
      this.$set(
        this.form,
        "images",
        this.form.images.length > 0 ? [...this.form.images, image] : [image]
      );
    },
    handleImageUploadError() {
      this.$message.error("图片上传失败");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleEndTimeChange(value) {
      console.log(value);
      this.form.endTime = parseTime(value);
    },
    handleEndTimeBlur(instance) {
      console.log(instance);
    },
    urge() {
      urgeSupervision([this.currId])
        .then(() => {
          this.$message.success("催办成功");
        })
        .catch((e) => {
          this.$message.warning("催办失败");
        });
    },
    // 任务完成
    handleComplete() {
      // if (!this.completeForm.content) {
      //   this.$message.warning('请输入任务完成描述')
      //   return
      // }
      let params = {
        content: this.completeForm.content,
        taskId: this.currId,
      };
      let request = stopTask;
      if (this.token) {
        params.token = this.token;
      }
      request(params).then((res) => {
        this.$message.success("操作成功");
        this.updateList();
        this.close();
      });
    },
    previewFile(file) {
      console.log('file',{
        url: file.url, // 需要预览文件的地址(必填，可以使用相对路径)
        size: file.size,
        name: file.name,
      })
      if (this.mobilePreview) {
        wx.previewFile({
          url: file.url, // 需要预览文件的地址(必填，可以使用相对路径)
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
    testChangeMo () {
      this.mobilePreview = !this.mobilePreview
      // if (this.mobilePreview) {
      //   console.log('测试预览图片接口')
      //   wx.previewImage({
      //     current: 'http://dn.product.iot-cas.com:8081/yqfk/api/mediaInfo/preview/951486992036708352',
      //     urls: ['http://dn.product.iot-cas.com:8081/yqfk/api/mediaInfo/preview/951486992036708352', 'http://dn.product.iot-cas.com:8081/yqfk/api/mediaInfo/preview/951486992036708352'],
      //   })
      // }
      console.log('this.mobilePreview',this.mobilePreview)
    }
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.supervision-form {
  padding: 0 60px;
  &-label {
    &__tips {
      margin-right: 5px;
    }
  }
}
.supervision-form-image-preview {
  width: 88px;
  height: 88px;
  border-radius: 4px;
}
.supervision-form-image-add {
  width: 88px;
  height: 88px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #ced1db;
  &-icon {
    padding-top: 18px;
    font-size: 28px;
  }
  &-hint {
    font-size: 12px;
    color: #4b5869;
    line-height: 1.5;
  }
}
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
    color: #3f9ffe;
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
    .supervision-form,
    .dt-wrapper {
      padding: 0 10px;
    }
    .dt-wrapper {
    }
    .el-dialog__body {
      padding: 10px 10px;
    }
  }
}
.cui-btn {
  padding: 0;
  margin-left: 10px;
}
</style>
<style lang="scss">
@media screen and (max-width: 1024px) {
  .supervision-dialog {
    .el-dialog__body {
      padding: 10px 10px 20px;
    }
  }
}
</style>
