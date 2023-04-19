<template>
  <el-dialog
    v-dialogDrag
    title="分级管理措施"
    top="25vh"
    width="800px"
    @close="handleClose"
    :visible="showme"
    :modal="false">

    <div class="policy-detail">
      <div class="fake-table">
        <!--<img :src="imgUrl" />-->
        <table>
          <tr>
            <th>管控级别</th>
            <th>面积(平方公里)</th>
            <th>实有人口</th>
            <th>管理措施</th>
          </tr>
          <tr :key="index" v-for="(item,index) in list">
            <td style="width:90px;">{{item.name}}</td>
            <td style="width:100px;">{{item.area}}</td>
            <td>{{item.population}}</td>
            <td>{{item.rule}}</td>
          </tr>
        </table>
      </div>
    </div>

  </el-dialog>
</template>

<script>
  // import {BASE_URL} from '@/config/setting'
  export default {
    name: "PolicyDetail",
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
        // return `${BASE_URL}/static/file/level-manage.png`
      }
    },
    data() {
      return {
        list:[
          {name: '封闭管理区', area: 0.16, population: 3729, rule: '人员车辆只进不出，住户居民严格居家隔离。居家隔离人员每日一检；一般接触人员前7天每日一检，后7天三日两检查。统一配送生活物资。' },
          {name: '封控管理区', area: 3, population: 23000, rule: '人员车辆只进不出，居民住户足不出户。核酸三日两检。 每 3 日每户限 1 人出门购买物资。 ' },
          {name: '防控区', area: 28, population: 36158, rule: '划分为 18 个治安管控片区，设卡口管控。核酸三日两检。 设置 3 个物资供应点，可线上购物。' },
          {name: '健康管理区 ', area: 156, population: '127036（常住）', rule: '不堂食；不聚集。非必要不外出，实行住家、单位“两点一线”健康管理。' },
        ]
      }
    },
    mounted() {
    },
    methods: {
      handleClose(){
        this.$emit('toggle', false)
      },
    }
  }
</script>

<style lang="scss" type="text/scss">
.policy-detail{
  min-height: 300px;

  .fake-table{
    padding: 1em 0;
    color: #fff;
    table{
      border-collapse: collapse;
    }
    th{
      font-weight: bold;
    }
    th,td{
      padding: 1em;
      border: 1px solid #0c69cf;
    }

  }
}
</style>
