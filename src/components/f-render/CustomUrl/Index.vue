<template>
  <el-input
    placeholder="请输入URL"
    v-model="newValue"
    @input="handleChange"
    :class="desc.class"
    :style="desc.style"
    v-bind="attrs"
    v-on="desc.on"
  >
    <template slot="prepend"
    >Http://</template
    >
    <template slot="append"
    >.com</template
    >
  </el-input>
</template>
<script>
  import formMixin from 'vue-ele-form/lib/mixins/formMixin'

  export default {
    name: 'custom-url', // name 属性必须填写, 在使用时, 需要和这里定义的 name 一致
    mixins: [formMixin], // 必须引入mixin
    props: {
      // value 是传递过来的值
      value: String,
      // desc是此组件的描述, 结构为
      // { style: {}, class: {}, on: {}, attrs: {} }
      desc: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data () {
      return {
        // 用于v-model绑定, 因为 v-model无法绑定props值
        newValue: this.value
      }
    },
    methods: {
      // 上面是用 @input 事件触发，如果你是富文本编辑器或者代码编辑器之类的
      // 这种操作就过于频繁，会导致卡顿
      // 如果有 blur 事件，可以使用 @blur来触发，或者使用防抖、节流函数，限制次数，减少卡顿
      handleChange(value) {
        this.$emit('input', value) // 当值变化时, 一定要触发input事件
      }
    }
  }
</script>
