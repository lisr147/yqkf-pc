<template>
  <el-dialog
    title="分派房间"
    :visible="true"
    append-to-body
    @close="$emit('close')"
    width="720px"
    top="30px"
  >
    <div>
      <el-form
        label-position="left"
        :model="form"
        ref="baseForm"
        label-width="120px"
      >
        <el-form-item
          label="输入房间"
          prop="fjh"
          :rules="{
            required: true,
            message: '请输入',
            trigger: ['blur', 'change'],
          }"
        >
          <el-input v-model="form.fjh" style="width:220px;"/>
        </el-form-item>
        <el-form-item
          label="开始隔离时间"
          prop="ksglsj"
          :rules="{
            required: true,
            message: '请选择',
            trigger: 'blur',
          }"
        >
          <el-date-picker
            v-model="form.ksglsj"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script> 
import moment from 'moment'
export default {
  name: "switch-hotel",
  data() {
    return {
      hotelList: [],
      form: {
        fjh: "",
        ksglsj: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    };
  },
  async mounted() {
    this.hotelList = await this.$Api().HotelController.get_getHotelList.request();
  },
  methods: {
    async submit() {
      await this.$refs.baseForm.validate();
      this.$emit("submit", this.form);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tips {
  display: inline-block;
  p {
    margin: 0;
  }
}
</style>
