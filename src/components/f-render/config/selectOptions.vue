<template>
  <div>
    <div
      v-for="(item, index) in newValue"
      :key="`options_${index}`"
      class="select-options"
    >
      <el-input v-model="item.text" class="input" />
      <el-checkbox v-model="item.input" v-if="formData.inputAble"
        >可输入</el-checkbox
      >
      <el-button type="text" @click="deleteOption(index)" v-if="isDel">删除</el-button>
    </div>
    <el-button @click="addOption" type="primary"
      ><i class="el-icon-circle-plus" /> 添加选项</el-button
    >
  </div>
</template>
<script>
import formMixin from "vue-ele-form/lib/mixins/formMixin";
export default {
  name: "selectOptions",
  mixins: [formMixin],
  inject:['detail'],
  data() {
    return {
      newValue: [],
      isDel:false,
    };
  },
  mounted(){
      console.log(this.detail)
      this.isDel = this.detail.delable
  },
  methods: {
    deleteOption(index) {
      this.newValue.splice(index, 1);
    },
    addOption() {
      let index = this.newValue.length
        ? this.newValue[this.newValue.length - 1].value + 1
        : 1;
      this.newValue.push({
        text: `选项${index}`,
        value: index,
        input: false,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.select-options {
  padding: 2px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  * + * {
    margin-left: 5px;
  }
}
</style>
