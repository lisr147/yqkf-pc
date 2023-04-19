<template>
  <div class="c-service-report-submit">
    <el-dialog
      :visible="serviceReportSubmitVisible"
      top="10vh"
      title="上报服务情况"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="500px"
    >
      <el-form :model="form" ref="serviceForm">
        <el-form-item label="当前状态" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择"
            size="small"
            style="width: 80%"
          >
            <el-option
              v-for="item in STATUS_LIST"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务描述" prop="serviceDetail">
          <el-input
            v-model="form.serviceDetail"
            placeholder="请选择"
            :rows="5"
            size="small"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="上报人" prop="reporter">
          <div>{{ form.reporter }}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const STATUS_LIST = ["特殊人群", "不是特殊人群"]; // 03/03 liuyan comments
import { submitServiceReport } from "@/api/alarm";

export default {
  name: "ServiceReportSubmit",
  props: {
    serviceReportSubmitVisible: Boolean,
    ids: String,
  },
  data() {
    return {
      form: {
        status: "",
        serviceDetail: "",
        reporter: "",
      },
      // 表单校验
      formRules: {
        status: [{ required: true, message: "请选择", trigger: "blur" }],
        serviceDetail: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      STATUS_LIST,
    };
  },
  mounted() {
    this.form.reporter = this.$store.state.user.fullName || this.$store.state.user.username;
  },
  methods: {
    async save() {
      await this.$refs.serviceForm.validate();
      submitServiceReport(this.ids, this.form)
        .then(() => {
          this.$message.success("提交成功");
          this.close();
        })
        .catch((e) => {
          this.$message.error("提交失败");
          console.log(e);
        });
    },
    close() {
      this.form.status = "";
      this.form.serviceDetail = "";
      this.$emit("update:serviceReportSubmitVisible", false);
    },
  },
};
</script>
