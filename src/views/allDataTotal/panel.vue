<template>
  <div class="all-data-panel">
    <div class="container">
      <div class="header">
        <span class="title">{{ title }}
          <el-popover
            popper-class="screen-popover"
            width="360"
            trigger="hover"
            v-if="titleTips"
          >
            <div v-for="(tip, tipIndex) in titleTips" :key="tipIndex">
              {{ tip }}
            </div>
            <i slot="reference" class="el-icon-question"></i> </el-popover
        >
        </span>
        <slot name="tab"/>
        <span class="tip" v-if="updateTime">统计时间：{{updateTime}}</span>
      </div>
      <div class="body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "标题",
    },
    titleTips: {
      type: Array,
    },
    updateTime:{
      type: String,
    }
  },
};
</script>

<style lang="scss" scoped>
.all-data-panel {
  height: 100%;
  border: 14px solid transparent !important;
  border-image: url("~@/assets/image/dialog-bg.png") 14 !important;
  background-color: transparent;
  .container {
    height: calc(100% + 2px);
    background-color: rgba(32, 50, 111, 0.95);

    .header {
      margin: 0 10px;
      padding: 0 0 8px 0;
      border-bottom: 2px solid #364f9a;
      color: #fff;
      position: relative;
      .title {
        font-size: 20px;
        line-height: 28px;
        color: #fff;

      }
      .tip{
        position: absolute;
        right: 5px;
        top:6px;
        font-size: 13px;
      }
    }
    .body {
      position: relative;
      height: calc(100% - 70px);
      margin: 20px 10px;
      overflow-y: auto;
    }
  }
}
</style>
