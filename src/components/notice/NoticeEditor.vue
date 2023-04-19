<!--modal-append-to-body必须设置为 "false"-->
<!--否则富文本编辑器会因此功能异常-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="close"
    width="600px"
    title="发布新信息"
    :visible="showme"
    :modal="true"
  >

    <el-form label-width="auto" ref="baseForm" :rules="formRules" :model="form">

      <el-form-item label="标题" prop="msgTitle" >
        <el-input type="text" size="small" placeholder="请输入标题"  v-model="form.msgTitle" />
      </el-form-item>
      <el-form-item label="正文" prop="msgContent" >
        <keep-alive>
        <editor
          :init="editorInit"
          output-format="html"
          v-model="form.msgContent"
          ref="editor"/>
        </keep-alive>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input type="text" size="small" placeholder="默认使用当前用户所在部门作为消息来源" v-model="form.source" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="handlePublic">发布</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver/theme'
  import 'tinymce/icons/default/icons'
  import {publicNotice} from '@/api/notice'
  import {BASE_URL} from '@/config/setting'

  export default {
    name: "NoticeEditor",
    components: {
      Editor
    },
    props: {
      showme: { type: Boolean },
    },
    model: {
      prop: 'showme',
      event: 'toggle'
    },
    data() {

      let validContent = (rule, value, callback) => {
        let str = value
        console.log(str.length)

        if (str <= 0) {
          callback(new Error('请输入正文'))
        } else if (str < 10 || str > 10000) {
          callback(new Error('字符串长度范围限制在10-10000'))
        } else {
          callback()
        }
      }

      return {

        form: {
          msgTitle: '',
          msgContent: '',
          source: ''
        },

        editorInit: {
          // selector: "#tinymce",
          height: 300,
          menubar: false,
          language: 'zh_CN',
          branding: false, // 去水印
          language_url: `${BASE_URL}/static/tinymce/langs/zh_CN.js`,
          skin_url: `${BASE_URL}/static/tinymce/skins/ui/oxide`,
          content_css: `${BASE_URL}/static/tinymce/skins/content/default/content.min.css`,
          // toolbar: 'undo redo | fontsizeselect | styleselect | forecolor bold italic '
          toolbar: 'undo redo | fontsizeselect | forecolor bold italic '
        },

        // 表单校验
        formRules: {
          msgTitle: [
            { required: true, message: '请输入2-100字数的标题', trigger: 'blur' },
            { min: 2, max: 100, message: '请输入2-100字数的标题', trigger: 'blur' }
          ],
          msgContent: [
            { validator: validContent, trigger: 'blur' },
            { required: true, message: '请输入正文', trigger: 'blur' }
          ],
          source: [
            {min: 2, max: 100, message: '请输入2-100长度的字符', trigger: 'blur'}
          ]
        },
      }
    },
    mounted() {
      this.$nextTick(() => {
        tinymce.init({})
      })
    },
    methods: {

      handlePublic () {

        this.$refs['baseForm'].validate(valid => {
          // 表单校验失败则退出
          if (valid === false) {
            return false
          }

          //发布消息
          publicNotice(this.form).then(res => {

            this.$message({
              message: '消息已发布',
              type: 'success'
            })

            this.close()
            this.$emit('publiced')
          })
        })
      },

      close(){
        this.form = {
          msgTitle: '',
          msgContent: '',
          source: ''
        }
        this.$refs['baseForm'].clearValidate()
        this.$emit('toggle', false)
      }
    }
  }
</script>

<style lang="scss" type="text/scss">

</style>
