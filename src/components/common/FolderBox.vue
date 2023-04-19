<template>
  <div class="folder-box">
    <div class="folder-box-h">
      <h3>{{title}}</h3>
      <b class="trigger el-icon-arrow-up" :class="{'el-icon-arrow-down': isExpand}" @click="toggleMain"></b>
    </div>
    <div ref="main" v-show="isExpand">
      <slot/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "FolderBox",
    components: {},
    props:{
      title: {type: String, required: true}
    },
    data() {
      return {
        isExpand: true
      }
    },
    mounted() {
    },
    methods: {
      toggleMain(){
        this.isExpand = !this.isExpand
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  .folder-box {
    position: relative;
    padding: 0 0 1em;

    .folder-box-h {
      padding:1em 0;
      h3{
        display: inline-block;
        padding: 0 0.5em;
        color: #fff;
        border-left: 3px solid #345EF0;
      }
    }
    .trigger {
      position: absolute;
      top: 1em;
      right: 0em;
      cursor: pointer;
    }
  }
</style>
