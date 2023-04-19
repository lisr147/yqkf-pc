<template>
  <div class="time-tabs">
    <div class="time-tabs-item" v-for="item in list" :key="item.value" :class="{'active': value==item.value}" @click="chooseItem(item)">
      {{item.label}}
    </div>
  </div>
</template>

<script>
  export default {
    name: "TimeTabs",
    components: {},
    props: {
      defaultValue: {
        type: String,
        default: 'day'
      }
    },
    data() {
      return {
        list: [
          {label: '日', value: 'day'},
          {label: '周', value: 'week'},
          {label: '月', value: 'month'},
        ],
        value: this.defaultValue
      }
    },
    watch:{
      value(val){
        this.$emit('change', val)
      }
    },
    mounted() {
    },
    methods: {
      chooseItem({value}) {
        this.value = value
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .time-tabs{
    display: inline-block;
    width: 160px;
    font-size: 12px;

    &-item{
      display: inline-block;
      margin-left: -1px;
      padding: 4px;
      width: 32%;
      box-sizing: border-box;
      border: 1px solid #314f98;
      text-align: center;
      cursor: pointer;

      &:first-child{
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      &:last-child{
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      &:hover{
        background-color: #3D4DBF;
      }

      &.active{
        background-color: #5166ff;
      }
    }
  }
</style>
