<template>
  <div  class="el-steps el-steps--simple">
    <div  class="el-step is-simple" v-for="(item,idx) in list" :key="idx" @click="handleClick(item,idx)">
      <div class="el-step__head" :class="{'is-success': idx == index}">
        <div class="el-step__line" style="margin-right: 0px;">
          <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; width: 0%;"></i>
        </div>
        <div class="el-step__icon is-text">
          <i class="el-step__icon-inner is-status el-icon-check" ></i>
        </div>
      </div>
      <div class="el-step__main">
        <div class="el-step__title" :class="{'is-success': idx==index }">{{item.label}}</div>
        <div class="el-step__arrow"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "StepsBar",
    components: {},
    props:{
      index: {
        type: [Number,String],
        default: 0
      }
    },
    model:{
      prop:'index',
      event: 'change'
    },
    data() {
      return {
        list:[
          {label: '表单设计',},
          {label: '填单设置',},
          {label: '数据权限',},
        ],

      }
    },
    mounted() {
    },
    methods: {
      handleClick(item, index) {
        if (this.index == index) {
          return
        }
        this.$emit('change', index)
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-steps--simple{
  padding: 8px 30px;
  background: transparent;
}
.el-step{
  flex-basis: 50%;
  margin-right: 0px;
  cursor: pointer;
}
</style>
