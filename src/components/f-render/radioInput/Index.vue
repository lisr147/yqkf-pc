<template>
  <div>
    <div
      v-for="(option, index) of options"
      :key="option.value"
      v-bind="attrs"
      class="radio-line"
    >
      <el-radio
        v-bind="option.attrs"
        :class="desc.class"
        :style="desc.style"
        :label="option.value"
        v-model="selectValue"
        class="radio-line-select"
        >{{ option.text }}</el-radio
      >
      <el-input
        v-if="option.input"
        v-model="inputValue[index]"
        class="radio-line-input"
        placeholder="请输入"
        :disabled="selectValue!==option.value"
      />
    </div>
  </div>
</template>

<script>
import formMixin from "vue-ele-form/lib/mixins/formMixin";
export default {
  name: "RadioInput",
  mixins: [formMixin],
  data() {
    return {
      mockRule: "radio",
      type: ["Object"],
      newValue: this.value || null,
      inputValue: [],
      selectValue: null,
    };
  },
  mounted() {},
  watch: {
    selectValue() {
      this.updateValue();
    },
    inputValue: {
      handler() {
        this.updateValue();
      },
      deep: true,
    },
    value:{
      handler(val) {
      // 初始化加载数据
      let selectIndex = this.options
        .map((v) => {
          return v.value;
        })
        .indexOf(val.value);
      let selectValue = val.value;
      let inputValue = [];
      inputValue[selectIndex] = val.input;

      if (
        JSON.stringify(selectValue) === JSON.stringify(this.selectValue) &&
        JSON.stringify(inputValue) === JSON.stringify(this.inputValue)
      ) {
        return;
      }
      this.selectValue = selectValue;
      this.inputValue = inputValue;
    },
    deep:true,
    immediate:true
    }
  },
  methods: {
    updateValue() {
      let selectInputText = "";
      let selectIndex = this.options
        .map((v) => {
          return v.value;
        })
        .indexOf(this.selectValue);
      selectInputText += this.inputValue[selectIndex] || "";
      this.newValue = {
        value: this.selectValue,
        input: selectInputText,
      };
      this.$emit("input", this.newValue);
    },
  },
};
</script>
<style lang="scss">
.radio-line {
  .radio-line-input {
    width: 40%;
    display: inline-block;
  }
  .radio-line-select {
    max-width: 50%;
    .el-radio__label {
      display: inline-block;
      word-break: break-all;
      white-space: normal;
      vertical-align: top;
    }
  }
}
.radio-line + .radio-line {
  margin-top: 10px;
}
</style>
