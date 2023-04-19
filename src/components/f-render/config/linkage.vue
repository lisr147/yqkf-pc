<template>
  <div>
    <div v-for="(item, index) in ruleData" :key="`rule${index}`">
      <el-select
        v-model="item.field"
        class="select"
        @change="item.value = null"
      >
        <el-option
          v-for="option in formSelectItem"
          :key="option.field"
          :value="option.field"
          :label="option.label"
        />
      </el-select>
      选择了
      <el-select v-model="item.value" class="select" @change="selectChange">
        <template v-if="formSelectValue[item.field]">
          <el-option
            v-for="option in formSelectValue[item.field]"
            :key="`${index}_value_${option.value}`"
            :value="option.value"
            :label="option.text"
          />
        </template>
      </el-select>
      <el-button
        type="text"
        @click="
          ruleData.splice(index, 1);
          selectChange();
        "
        >删除</el-button
      >
    </div>
    <el-button @click="addRule" type="primary"><i class="el-icon-circle-plus" /> 增加规则</el-button>
  </div>
</template>
<script>
import formMixin from "vue-ele-form/lib/mixins/formMixin";
import serialize from "serialize-javascript";

export default {
  name: "linkage",
  mixins: [formMixin],
  inject: ["frender"], //注入frender,获取当前表单实例
  data() {
    return {
      ruleData: [],
    };
  },
  computed: {
    formSelectItem() {
      let result = this.frender.formItemList.filter((v) => {
        return ["select", "radio"].includes(v.type);
      });
      return result;
    },
    formSelectValue() {
      let result = {};
      this.formSelectItem.forEach((v) => {
        result[v.field] = v.options;
      });
      return result;
    },
  },
  mounted() {
    if (this.value) {
      // 函数转换回对象，神经病代码……
      let valueStr = serialize(this.value, { space: 2 });
      valueStr = valueStr.split("return")[1];
      valueStr = valueStr.split(";")[0];
      let valueArr = valueStr.split("||");
      valueArr.forEach((v) => {
        let kv = v.split("===");
        let field = kv[0].replace('form["', "").replace('"]', "");
        field = field.trim()
        // 查找FIELD中option对应的value是数字还是字符串
        let value = kv[1];
        value = value.trim()
        let options = this.formSelectValue[field].map(v=>{return v.value})
        if(options.includes(parseInt(value))){
          value = parseInt(value)
        }
        this.ruleData.push({
          value,
          field
        });
      });
    }
  },
  methods: {
    addRule() {
      this.ruleData.push({
        value: null,
        field: null,
      });
    },
    //   提交数据
    selectChange() {
      let result = "";
      this.ruleData.forEach((v) => {
        if (v.value) {
          if (result) {
            result += "||";
          }
          result += `form["${v.field}"] === ${v.value}`;
        }
      });

      if (!result) {
        this.$emit("input", "");
        return;
      }
      // this.$emit('input',result)
      let r = `function resultFunc(form) {
        return ${result};
      }
      `;
      console.log(r);
      r = eval(`(${r})`);
      console.log(r);
      this.$emit("input", r);
    },
  },
};
</script>
<style lang="scss" scoped>
.select {
  width: 90px;
  margin-bottom: 5px;
}
</style>
