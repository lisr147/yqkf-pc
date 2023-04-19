<template>
  <el-checkbox-group
    :class="desc.class"
    :style="desc.style"
    v-model="selectValue"
  >
    <el-checkbox
      :key="option.value"
      :label="option.value"
      v-for="(option, index) of options"
      class="checkbox-line"
      >{{ option.text }}
      <el-input
        v-if="option.input"
        v-model="inputValue[index]"
        class="checkbox-line-input"
        placeholder="请输入"
        :disabled="!selectValue.includes(option.value)"
      />
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
import formMixin from "vue-ele-form/lib/mixins/formMixin";
// import { isUnDef } from "vue-ele-form/lib/tools/utils";

export default {
  name: "CheckboxInput",
  mixins: [formMixin],
  props: {
    value: {
      type: Array,
      // default() {
      //   return [];
      // },
    },
  },
  data() {
    return {
      type: "Array",
      mockRule: "checkbox",
      newValue: [],
      inputValue: [],
      selectValue: [],
    };
  },
  watch: {
    selectValue: {
      handler() {
        this.updateValue();
      },
      deep: true,
    },
    inputValue: {
      handler() {
        this.updateValue();
      },
      deep: true,
    },
    value: {
      handler(val) {
        // 初始化加载数据
        let selectValue = []
        let inputValue = []
        let options = {};
        this.options.forEach((v, i) => {
          v.index = i;
          options[v.value] = v;
        });
        val.forEach(v=>{
          selectValue.push(v.value)
          inputValue[options[v.value].index] = v.input
        })
        if(JSON.stringify(selectValue)===JSON.stringify(this.selectValue)&&JSON.stringify(inputValue)===JSON.stringify(this.inputValue)){
          return
        }
        this.selectValue=selectValue
        this.inputValue = inputValue
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // customInit(val) {
    //   if (isUnDef(val)) {
    //     val = [];
    //   }
    //   return val;
    // },
    updateValue() {
      let options = {};
      this.options.forEach((v, i) => {
        v.index = i;
        options[v.value] = v;
      });
      this.newValue = [];
      this.selectValue.forEach((v) => {
        let data = {
          value: v,
          input: this.inputValue[options[v].index],
        };
        this.newValue.push(data);
      });
      this.$emit("input", this.newValue);
    },
  },
};
</script>
<style lang="scss">
.checkbox-line {
  display: block;
  .el-checkbox__label {
    display: inline-block;
    word-break: break-all;
    white-space: normal;
    display: inline-flex;
  }
  .checkbox-line-input {
    width: 80%;
    display: inline-block;
  }
}
</style>
