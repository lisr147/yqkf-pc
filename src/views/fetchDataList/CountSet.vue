<template>
  <el-dialog
    :visible="true"
    top="5vh"
    :title="`统计设置`"
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="500px"
    custom-class="alarm-box"
  >
    <template>
      <el-form :model="form" ref="form" :rules="{
        value: [{required: true, message: '请输入判定时长（单位为小时）'},  { type: 'number', message: '必须为数字值'}]
      }">
        <el-form-item label="未做核酸判定时长：" prop="value">
          <el-input
            v-model.number="form.value" autocomplete="off"
            placeholder="请输入判定时长（单位为小时)"
            style="width:280px;display: inline-block"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  setTruckConfig,
  getTruckConfig,
} from "@/api/freight";

export default {
  name: "CountSet",
  data () {
    return {
      form: {
        value: null
      },
    };
  },
  mounted () {
    this.getTruckConfig()
  },
  methods: {
    async getTruckConfig(){
      let res = await getTruckConfig()
      if(res){
        this.form.value = res
      }
    },
      async save () {
        await this.$refs.form.validate()
        setTruckConfig(this.form).then((res) => {
          this.$message.success('设置成功')
          this.$emit('close')
        })
      },
  }
};
</script>
