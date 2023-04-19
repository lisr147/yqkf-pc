<template>
  <div class="sidebar-panel">
    <div class="sidebar-panel-h">
      {{title}}
    </div>
    <div class="sidebar-panel-b">
      <slot name="default"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SidebarPanel",
    components: {},
    props:{
      title: {type: String, default: '我是标题'}
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss" type="text/scss">
.sidebar-panel {
  position: relative;
  width: 398px;
  box-sizing: border-box;
  border: 34px solid transparent;
  border-image: url("~@/assets/image/sidebar-bg.png") 34;
  color: #fff;

  &-b{
    position: absolute;
    top: 1em;
    left: -0.5em;
    right: -0.5em;
    bottom: -0.5em;
    padding: 1em 0;
    background-color:rgba(21,37,91,0.97);
    overflow: auto;
  }
  &-h{
    position: absolute;
    top: -1em;
    left: -1em;
    right: -1em;
    z-index: 2;
    box-sizing: border-box;
    padding: .2em 0 0 1.2em;
    height: 40px;
    background: rgba(21, 37, 91, 0.97) url("~@/assets/image/sidebar-h.png") left center no-repeat;
    color: #7bdcfe;
    font-size: 1.2em;
  }
}
</style>
