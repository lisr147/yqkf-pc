<template>
  <div class="f-render-right" :class="{'unedit': !editable}">
    <!-- <el-tabs class="f-render-header" :stretch="true" v-model="activeTab">
      <el-tab-pane
        v-for="tab of rightTabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      ></el-tab-pane>
    </el-tabs> -->
    <perfect-scrollbar ref="scroll" class="f-render-scrollarea" >
      <component
        v-show="activeTab === tab.name"
        :is="tab.name"
        class="f-render-right-content"
        v-for="tab of rightTabs"
        :key="tab.name"
      />
    </perfect-scrollbar>
  </div>
</template>

<script>
  // import FormProps from "./form-props.vue"
  import FormItemAttrs from "./form-item-attrs.vue"
  import FormItemCommon from "./form-item-common.vue"

  export default {
    inject: ["frender"],
    props: {
      editable: {
        type: Boolean,
        default: true
      }
    },
    components: {
      // FormProps,
      FormItemAttrs,
      FormItemCommon
    },
    data() {
      return {
        activeTab: "",
        rightTabs: [{
          label: '表单项属性配置',
          name: 'form-item-common'
        }, {
          label: '组件属性配置',
          name: 'form-item-attrs'
        // },{
        //   label: '表单属性',
        //   name: 'form-props'
        }]
      };
    },
    watch: {
      // 切换Tab滚动到顶部
      activeTab() {
        this.$refs.scroll.$el.scrollTop = 0;
      }
    },
    mounted() {
      this.activeTab = this.frender.rightTabs[0].name;
    }
  };
</script>

<style lang="css">
  .f-render-right {
    position: relative;
    width: 310px;
    height: 100%;
  }
  .unedit::after{
    content: '';
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(255,255,255,0.4);
    z-index: 9999;
  }
  .f-render-right .form-item-placeholder {
    height: 300px;
    line-height: 300px;
    color: #909399;
    text-align: center;
  }
  .f-render-right .el-tabs__header {
    padding-top: 20px;
  }
  .f-render-right .el-tabs__nav-wrap {
    padding: 0 15px;
  }
  .f-render-right .el-tabs__item {
    padding: 0 10px;
  }
  .f-render-right .el-tabs__nav-wrap::after {
    height: 0;
  }
  .f-render-right .el-tabs__active-bar {
    height: 1px !important;
  }
  .f-render-right .f-render-right-content {
    padding: 20px 0;
  }
</style>
