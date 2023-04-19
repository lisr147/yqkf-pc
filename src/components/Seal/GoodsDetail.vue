<template>
  <el-dialog
    v-dialogDrag
    title="珠江街封控管理物资每日供应数据情况表"
    top="20vh"
    width="1100px"
    @close="handleClose"
    :visible="showme"
    :modal="false">

    <div class="goods-detail">
      <el-form class="filter-field" :inline="true" :model="filter">
        <el-form-item label="日期">
          <el-select v-model="filter.date">
            <el-option :label="item" :value="item" :key="index" v-for="(item,index) in dateList"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-button type="primary" @click="getData">查找</el-button>-->
      </el-form>
      <div class="fake-table">
        <el-image :src="imgUrl" >
          <div slot="error" class="fake-table-empty">没有对应的数据</div>
        </el-image>
      </div>
    </div>

  </el-dialog>
</template>

<script>
  import {BASE_URL} from '@/config/setting'
  export default {
    name: "GoodsDetail",
    components: {},
    props: {
      showme: {type: Boolean},
      id: {type: [String, Number]}
    },
    model:{
      prop: 'showme',
      event: 'toggle'
    },
    watch:{
      showme: {
        handler: function (val) {
          if (val == true && this.id) {
            this.getData()
          }
        },
        immediate: true
      }
    },
    computed:{
      imgUrl() {
        const {date} = this.filter
        return `${BASE_URL}/static/file/${date}.png`
      }
    },
    data() {
      return {
        filter: {
          date: null
        },
        dateList: [
          '2021-06-30',
          '2021-06-29',
          '2021-06-28',
          '2021-06-27',
          '2021-06-26',
          '2021-06-25',
          '2021-06-24',
          '2021-06-22',
          '2021-06-21',
          '2021-06-20',
          '2021-06-18',
          '2021-06-17',
          '2021-06-16',
        ],
      }
    },
    mounted() {
      this.filter.date = this.dateList[0]
    },
    methods: {

      handleClose(){
        this.$emit('toggle', false)
      },
    }
  }
</script>

<style lang="scss" type="text/scss">
.goods-detail{
  min-height: 400px;

  .filter-field{
    padding: 1em 2em 0;
  }

  .el-form-item__label{
    color: #fff;
  }

  .fake-table{
    padding: 1em 3em;
    text-align: left;

    &-empty{
      padding: 3em;
      text-align: center;
      color: #f0f0f0;
    }

    .el-image{
      min-width: 900px;
    }

    img{
      /*width: 100%;*/
      max-width: 1000px;
    }
  }
}
</style>
