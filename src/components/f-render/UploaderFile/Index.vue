<template>
  <div>
    <template v-if="isDisabled && !uploadFiles.length">
      <div class="disable-tips" v-if="disabled">上传功能已停用</div>
      <div class="disable-tips" v-else>用户未上传文件</div>
    </template>
    <ele-upload-file
      :class="desc.class"
      :style="desc.style"
      class="ele-form-upload-file"
      v-bind="attrs"
      v-model="uploadFiles"
      :responseFn="uploadSuccess"
      :on-progress="onProgress"
      :disabled="isDisabled"
      v-loading="uploading"
    />
  </div>
</template>

<script>
import EleUploadFile from "vue-ele-upload-file";
import formMixin from "vue-ele-form/lib/mixins/formMixin";
import uploadMixin from "vue-ele-form/lib/mixins/uploadMixin";
const cloneDeep = require("clone");
import { upload, download } from "@/api/fRander.js";

export default {
  name: "EleFormUploadFile",
  mixins: [formMixin, uploadMixin],
  components: {
    EleUploadFile,
  },
  data() {
    return {
      uploadFiles: [],
      uploading:false
    };
  },
  watch: {
    // 加载数据
    value(value, oldValue) {
      if (value && !oldValue) {
        this.uploadFiles = value.map((v) => {
          v.id = v.fileId;
          v.url = download(v.id).url;
          v.name = v.fileName;
          return v;
        });
        console.log(this.uploadFiles);
      }
    },
    uploadFiles: {
      handler(value) {
        if (!value) {
          return;
        }
        this.$emit(
          "input",
          value.map((v) => {
            return {
              fileId: v.id,
              fileName: v.fileName,
            };
          })
        );
      },
      deep: true,
    },
  },
  computed: {
    customAttrs() {
      const attrs = cloneDeep(this.desc._attrs || {});
      // 对 placeholder 做特殊处理，如果为空则删除，在下面的计算属性中，则可使用默认值
      if (!attrs.placeholder) {
        delete attrs.placeholder;
      }
      //   对ACTION特殊处理
      attrs.action = upload(this.desc.formKey).url;
      return attrs;
    },
    isDisabled() {
      return this.disabled || this.readonly;
    },
  },
  methods: {
    uploadSuccess(v) {
      v = v.data;
      v.name = v.fileName;
      v.url = download(v.id).url;
      this.uploading=false
      return v;
    },
    onProgress(){
      this.uploading=true
    }
  },
};
</script>

<style>
.ele-form-upload-file .el-upload__tip {
  line-height: 1.5;
}

.ele-form-upload-file .el-upload-list__item:first-child {
  margin-top: 5px;
}
.disable-tips {
  padding: 20px;
  background-color: #eee;
  display: inline-block;
  color: #999;
}
</style>
