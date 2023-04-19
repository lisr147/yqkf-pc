<template>
  <ele-upload-image
    :class="desc.class"
    :style="desc.style"
    v-bind="attrs"
    v-model="uploadFiles"
    v-on="onEvents"
    @resultData="resultData"
    :responseFn="uploadSuccess"
    :httpRequest="httpRequest"
  />
</template>

<script>
import EleUploadImage from "./EleUploadImage.vue";
import formMixin from "vue-ele-form/lib/mixins/formMixin";
import uploadMixin from "vue-ele-form/lib/mixins/uploadMixin";
const cloneDeep = require("clone");
import { upload, download, uploadImg } from "@/api/fRander.js";

export default {
  name: "image-uploader",
  mixins: [formMixin, uploadMixin],
  components: {
    EleUploadImage,
  },
  watch: {
    // 加载数据
    value(value, oldValue) {
      if (value && !oldValue) {
        console.log("image value", value,this.attrs.multiple);
        if (this.attrs.multiple || Array.isArray(value)) {
          value.forEach((v) => {
            let url = v;
            if (typeof v === "object") {
              url = download(v.fileId).url;
              this.uploadFilesIndex[url] = {
                fileName: v.fileName,
                id: v.fileId,
              };
            } else {
              this.uploadFilesIndex[url] = {
                fileName: url,
                id: url,
              };
            }
            if (this.attrs.multiple) {
              this.uploadFiles = value.map(v=>{
                return download(v.fileId).url
              });
            } else {
              this.uploadFiles = url;
            }
          });
        } else {
          this.uploadFiles = value;
        }
      }
    },
    // uploadFiles: {
    //   /**
    //    * emit格式应该是[{
    //    * fileId:'',
    //    * fileName:''
    //    * }]
    //    */
    //   handler(value) {
    //     console.log(value);
    //     let imageUrls;
    //     if (typeof value === "string") {
    //       imageUrls = [value];
    //     } else {
    //       imageUrls = value;
    //     }
    //     let result = [];
    //     imageUrls.forEach((v) => {
    //       result.push({
    //         fileId: this.uploadFilesIndex[v].id,
    //         fileName: this.uploadFilesIndex[v].fileName,
    //       });
    //     });

    //     console.log('result',result);
    //     this.$emit("input", result);
    //   },
    //   deep: true,
    // },
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
  },
  data() {
    return {
      defaultAttrs: {
        size: 150,
      },
      uploadFiles: '',
      uploadFilesIndex: {}, //上传文件ID对应的地址
      // uploadFileData: null,
    };
  },
  methods: {
    uploadSuccess(v) {
      console.log("uploadSuccess", v);
      let url = download(v.id).url;
      this.uploadFilesIndex[url] = v;
      return url;
    },
    resultData(val) {
      let result = val.map((v) => {
          let data = this.uploadFilesIndex[v];
          return {
            fileId: data.id,
            fileName: data.fileName,
          };
        })
      console.log("input", val,result);
      this.uploadFiles = val
      this.$emit('input',result);
    },
    httpRequest(data) {
      return new Promise(async (resolve) => {
        // console.log(data);
        let size = Number(((data.file.size * (20 / 100)) / 1024).toFixed(2));
        let cfile = await this.compression(data.file, size, 6);
        // console.log(res);
        let res = await uploadImg(this.desc.formKey, cfile.file);
        // console.log(res)
        // this.uploadFileData = res;
        resolve(res);
      });
    }, //压缩图片方法
    compression(file, size = 20, device = 4, maxWidth = 1024) {
      if (file[0]) {
        return Promise.all(
          Array.from(file).map((e) => this.compression(e, size))
        ); // 如果是 file 数组返回 Promise 数组
      } else {
        return new Promise((resolve) => {
          const reader = new FileReader(); // 创建 FileReader
          reader.onload = ({ target: { result: src } }) => {
            const fileSize = Number((file.size / 1024).toFixed(2));
            if (fileSize <= size) {
              resolve({
                file: file,
                origin: file,
                beforeSrc: src,
                afterSrc: src,
                beforeKB: fileSize + "KB",
                afterKB: fileSize + "KB",
                detail: [],
                quality: null,
              });
            } else {
              const image = new Image(); // 创建 img 元素
              image.onload = async () => {
                const canvas = document.createElement("canvas"); // 创建 canvas 元素
                let cWidth = Math.min(image.width, maxWidth);
                let r = cWidth / image.width;
                let cHeight = image.height * r;

                // canvas.width = image.width;
                // canvas.height = image.height;
                canvas.width = cWidth;
                canvas.height = cHeight;
                canvas.getContext("2d").drawImage(image, 0, 0, cWidth, cHeight); // 绘制 canvas
                let canvasURL, miniFile;
                let L = true;
                let quality = 0;
                const detail = [];
                let start = Date.now();
                for (let i = 1; i <= device; i++) {
                  canvasURL = canvas.toDataURL(
                    "image/jpeg",
                    L ? (quality += 1 / 2 ** i) : (quality -= 1 / 2 ** i)
                  );
                  // console.log("canvasUrl>>>>",canvasURL)
                  const buffer = atob(canvasURL.split(",")[1]);
                  // console.log("buffer>>>>",buffer)
                  let length = buffer.length;
                  const bufferArray = new Uint8Array(new ArrayBuffer(length));
                  // console.log("bufferArray>>>>",bufferArray)
                  while (length--) {
                    bufferArray[length] = buffer.charCodeAt(length);
                  }
                  miniFile = new File([bufferArray], file.name, {
                    type: "image/jpeg",
                  });
                  // console.log("miniFile>>>>",miniFile)
                  miniFile.size / 1024 > size ? (L = false) : (L = true);
                  detail.push({
                    quality,
                    size: miniFile.size,
                    kb: Number((miniFile.size / 1024).toFixed(2)),
                    time: Date.now() - start,
                  });
                  // console.log("detail>>>>",detail)
                  start = Date.now();
                }
                resolve({
                  detail,
                  quality,
                  file: miniFile,
                  origin: file,
                  beforeSrc: src,
                  afterSrc: canvasURL,
                  beforeKB: Number((file.size / 1024).toFixed(2)),
                  afterKB: Number((miniFile.size / 1024).toFixed(2)),
                });
              };
              image.src = src;
            }
          };
          reader.readAsDataURL(file);
        });
      }
    },
  },
};
</script>
