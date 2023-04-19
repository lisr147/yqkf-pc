<template>
  <div class="vaccination-info">
    <div class="base-props">
      <p>姓名：{{props.name}}</p>
      <p>身份证：{{props.id}}</p>
    </div>
    <div class="vaccination-info-list">
      <table  v-for="(item,index) in dataList" :key="index">
        <tr><td>疫苗名称：</td><td>{{item.name}}</td></tr>
        <tr><td>针次：</td><td>{{item.num}}</td></tr>
        <tr><td>批号：</td><td>{{item.batchNum}}</td></tr>
        <tr><td>厂家名称：</td><td>{{item.factory}}</td></tr>
        <tr><td>接种单位：</td><td>{{item.unit}}</td></tr>
        <tr><td>接种时间：</td><td>{{item.time}}</td></tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "VaccinationInfo",
  components: {},
  data() {
    return {
      props: {
        name: '张飒',
        id: 445188783434234200
      },
      dataList: [{
        name: '新型冠状病毒灭活疫苗（Vero细胞）',
        num: 3,
        batchNum: '20220532B',
        factory: '北京生物',
        unit: '南沙街红岭预防接种门诊',
        time: '2021-06-19'
      },{
        name: '新型冠状病毒灭活疫苗（Vero细胞）',
        num: 3,
        batchNum: '20220532B',
        factory: '北京生物',
        unit: '南沙街红岭预防接种门诊',
        time: '2021-06-19'
      },{
        name: '新型冠状病毒灭活疫苗（Vero细胞）',
        num: 3,
        batchNum: '20220532B',
        factory: '北京生物',
        unit: '南沙街红岭预防接种门诊',
        time: '2021-06-19'
      },{
        name: '新型冠状病毒灭活疫苗（Vero细胞）',
        num: 3,
        batchNum: '20220532B',
        factory: '北京生物',
        unit: '南沙街红岭预防接种门诊',
        time: '2021-06-19'
      }]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {

    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.vaccination-info {
  color: #fff;
  .base-props {
    padding: 0 0 .5em;
    p{
      line-height: 1.5em;
      color: #fff;
    }
  }
  &-list {
    max-height: 400px;
    overflow: auto;

    table {
      margin: 0.5em 0;
      width: 95%;
      border-bottom: 1px dotted #fff;

      tr {
        td:first-child{
          width: 100px;
        }
      }
      td{
        padding: 0.3em;
        vertical-align: text-top;
      }
    }
  }
}
</style>
