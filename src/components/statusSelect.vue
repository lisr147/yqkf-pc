<template>
  <el-form-item label="状态">
    <el-select v-model="selectData" @change="change">
      <el-option value="9" label="待追踪" />
      <el-option value="8" label="待转运" />
      <el-option value="5" label="已扫码登车" />
      <el-option value="1" label="待分派酒店" />
      <el-option value="6" label="已分派酒店" />
      <el-option value="4" label="待分派房间" />
      <el-option value="7" label="已分派房间" />
      <el-option value="3" label="隔离中" />
      <el-option value="2" label="已解除" />
      <el-option value="0" label="全部" />
    </el-select>
  </el-form-item>
</template>
<script>
export default {
  name: "status-select",
  props: ["value"],
  data() {
    return {
      selectData: "",
    };
  },
  watch:{
      value:{
          handler(val){
              this.selectData = val;
          },
          immediate:true
      }
  },
  methods: {
    change(val) {
      this.$emit("input", val);
    },
  },
};
</script>
