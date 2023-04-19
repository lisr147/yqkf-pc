<template>
  <el-dialog
    title="选择人员去向"
    :visible="true"
    append-to-body
    @close="$emit('close')"
    width="520px"
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
          label="人员去向"
          prop="ryqx"
          :rules="{
            required: true,
            message: '请选择',
            trigger: ['blur', 'change'],
          }"
        >
        <el-select v-model="form.ryqx">
          <el-option value="居家隔离" />
          <el-option value="已确定可转运" />
          <el-option value="拟转外区管理" />
          <el-option value="找不到人" />
          <el-option value="其他" />
        </el-select>
           
        </el-form-item>
        <el-form-item
          label="备注"
          prop="ryqxbz"
        >
          <el-input type="textarea" v-model="form.ryqxbz" style="width:215px;" rows="5"/>
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
        ryqx: "",
        ryqxbz: '',
      },
    };
  },
  methods: {
    async submit() {
      await this.$refs.baseForm.validate();
      // [
      //   {
      //     id:'sdafjkalsdf',
      //     asfklasdf:'sadfkjasdl',
      //     asdfASDf:'sdafdsafsd'
      //   }
      // ]


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
