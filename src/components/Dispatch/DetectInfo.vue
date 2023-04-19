<template>
  <div class="detect-info">
    <div class="base-props">
      <p>姓名：{{props.name}}</p>
      <p>身份证：{{props.id}}</p>
    </div>
    <div class="detect-info-list">
      <table  v-for="(item,index) in dataList" :key="index">
        <tr><td>核酸检测结果：</td><td>{{item.result}} <b class="el-icon-success"/></td></tr>
        <tr><td>核酸检测机构：</td><td>{{item.unit}}</td></tr>
        <tr><td>核酸检测时间：</td><td>{{item.detectTime}}</td></tr>
        <tr><td>核酸采样时间：</td><td>{{item.sampleTime}}</td></tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetectInfo",
  components: {},
  data() {
    return {
      props: {
        name: '张飒',
        id: 445188783434234200
      },
      dataList: [{
        result: '阴性',
        unit: '广州银华医学检查中心',
        detectTime: '2022-03-19 20:12:26',
        sampleTime: '2022-03-19 20:12:26'
      },{
        result: '阴性',
        unit: '广州银华医学检查中心',
        detectTime: '2022-03-19 20:12:26',
        sampleTime: '2022-03-19 20:12:26'
      },{
        result: '阴性',
        unit: '广州银华医学检查中心',
        detectTime: '2022-03-19 20:12:26',
        sampleTime: '2022-03-19 20:12:26'
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
.detect-info {
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
    .el-icon-success{
      color: #36c02f;
    }
  }
}
</style>
