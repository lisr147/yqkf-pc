<template>
  <div class="c-service-report-submit">
    <el-dialog
      top="10vh"
      title="新增事件"
      :visible="addEventsDialogVisible"
      :close-on-click-modal="false"
      @close="close"
      width="500px"
    >
      <el-form :model="form" ref="eventForm" :rules="formRules" label-width="100px">
        <el-form-item label="事件名称" prop="sjmc">
          <el-input
            v-model="form.sjmc"
            placeholder="请填写事件名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="处置时间线" prop="czsjx">
          <el-input
            v-model="form.czsjx"
            placeholder="请输入处置时间线"
            :rows="5"
            size="small"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { submitServiceReport } from "@/api/alarm";
import { addTemplateData } from "@/api/common";

export default {
  name: "addEventsDialog",
  props: {
    addEventsDialogVisible:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      form: {
        sjmc: "",
        czsjx: ""
      },
      // 表单校验
      formRules: {
        sjmc: [{ required: true, message: "请填写事件名称", trigger: "change" }],
      },
    };
  },
  mounted() {
  },
  methods: {
    async save() {
      this.$refs.eventForm.validate(async valid => {
        if (valid) {
          addTemplateData({
            ...this.form,
            templateId: 10120,
            status:'进行中'
          }).then(() => {
            this.$message.success("新增事件成功");
            this.$parent.getData();
            this.close();
          }).catch(()=>{
            this.$message.error("新增事件失败");
          })
        }
      })
    },
    close() {
      this.form.sjmc = "";
      this.form.czsjx = "";
      this.$emit('close');
      this.$nextTick(() => {
          this.$refs.eventForm.clearValidate()
      })
    },
  },
};
</script>
