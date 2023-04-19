<template>
  <el-dialog
    title="分派酒店"
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
          label="选择酒店"
          prop="selectHotel"
          :rules="{
            required: true,
            message: '请选择酒店',
            trigger: 'blur',
          }"
        >
          <el-select v-model="form.selectHotel">
            <el-option
              v-for="item in hotelList"
              :key="item.id"
              :value="item.id"
              :label="item.jkgcjd"
              >{{ item.jkgcjd }}</el-option
            >
          </el-select>
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
export default {
  name: "switch-hotel",
  data() {
    return {
      hotelList: [],
      form: {
        selectHotel: "",
      },
    };
  },
  async mounted() {
    this.hotelList = await this.$Api().HotelController.get_getAllHotelList.request();
  },
  methods: {
    async submit() {
      await this.$refs.baseForm.validate();
      this.$emit(
        "submit",
        this.hotelList.filter((v) => v.id === this.form.selectHotel)[0]
      );
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
