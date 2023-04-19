<template>
  <div class="data-empty">
    <img src="@/assets/image/icon-null.svg"/>
    <p>{{title}}</p>
    <p v-if="subTitle">{{subTitle}}</p>
  </div>
</template>

<script>
  export default {
    name: "DataEmptyBox",
    components: {},
    props:{
      title: {type: String, default: '暂无数据'},
      subTitle: {type: String, default: ''},
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
.data-empty{
  padding: 3em 2em;
  text-align: center;
  p{
    color: #fff;
  }
}

</style>
