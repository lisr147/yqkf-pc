<template>
  <el-dialog
      v-dialogDrag
      title="确诊病例详情"
      top="15vh"
      width="1200px"
      @close="handleClose"
      :visible="showme"
      :modal="false">

    <div class="patient-detail">
      <div class="baseinfo">
        <p>地址：{{info.address}}</p>
        <p>确诊人数：{{info.num}}</p>
      </div>
      <div>

        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column prop="name" label="患者姓名"  width="80"></el-table-column>
          <el-table-column prop="identity" label="有效证件号"  width="170"></el-table-column>
          <el-table-column prop="sex" label="性别"  width="60"></el-table-column>
          <el-table-column prop="birth" label="出生日期" width="90"></el-table-column>
          <el-table-column prop="age" label="年龄"  align="center" width="60"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="130"></el-table-column>
          <!--<el-table-column prop="age" label="现在详细地址"></el-table-column>-->
          <el-table-column prop="type" label="病例分类" width="80"></el-table-column>
          <el-table-column prop="testDate" label="诊断时间" width="160"></el-table-column>
          <el-table-column prop="remark" label="备注" ></el-table-column>
          <el-table-column prop="testDegree" align="center" label="临床严重程度" width="120"></el-table-column>
        </el-table>


      </div>
    </div>

  </el-dialog>
</template>
<script>
  import axios from 'axios'
  import { BASE_URL} from '@/config/setting'
  // import TablePage from "zkzc-table-page";

  export default {
    name: 'PatientDetail',
    components: {
      // TablePage
    },
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
    data() {
      return {
        info: {},
        tableData: []

      }
    },
    mounted() {
    },
    methods: {
      async getData(){
        const res = await axios.get(`${BASE_URL}/static/mock/patient-spots.json`)
        const match = res.data.data.find(item => {
          return item.id == this.id
        })
        const {address, num ,list} = match
        this.info = {address, num }
        this.tableData = list
      },

      handleClose(){
        this.$emit('toggle', false)
      },
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
::v-deep {
  .el-dialog {
    left: 50% !important;
    transform: translate(-50%, -0%);
  }
}
.patient-detail{
  width: 1140px;
  padding: 0 .5em;
  .baseinfo{
    p{
      line-height: 1.6em;
      font-size: 16px;
      color: #fff;
    }
  }

::v-deep {
  .el-table {
    border: 0;
    th {
      background-color: #132a65;
      border: 0;
      .cell {
        color: #4E7CFC;
        font-weight: normal;
      }
    }
    &::before {
      height: 0px;
    }
  }
  .el-table--border td {
    border-right: 1px solid #223b79;
  }
  .el-table td {
    border-bottom: 1px solid #24366c;
  }
  .has-gutter tr > th {
    border-bottom: 0 !important;
  }
  .el-table__row td{
    background-color: #243d78;
    color: #FFFFFF;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #3e568f;
  }
  .el-table__body-wrapper {
    background-color: #243d78;
  }
  .el-table--border::after {
    width: 0;
  }
  .el-button--primary {
    background-color: #3B56F4;
    border: 0;
  }
  .el-form-item__label {
    color: #fff;
  }
  .el-input__inner {
    background-color: #3f60ad;
    border: 0;
  }
  .searchFilter .el-input {
    width: 72px;
  }
  .el-table {
    border: 0;
    th {
      background-color: #132a65;
      border: 0;
      .cell {
        color: #4E7CFC;
        font-weight: normal;
      }
    }
    &::before {
      height: 0px;
    }
  }
  .el-table--border td {
    border-right: 1px solid #223b79;
  }
  .el-table td {
    border-bottom: 1px solid #223b79;
  }
  .has-gutter tr > th {
    border-bottom: 0 !important;
  }
  .el-table__row td{
    background-color: #243d78;
    color: #FFFFFF;
    border-bottom: 1px solid #24366c;
  }
  .el-table__row .el-button span {
    text-decoration: underline;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #3e568f;
  }
  .el-table__body-wrapper {
    background-color: #243d78;
  }
  .el-table--border::after {
    width: 0;
  }
  .el-button--primary {
    background-color: #3B56F4;
    border: 0;
  }
  .el-form-item__label {
    color: #fff;
  }
  .el-input__inner {
    background-color: #3f60ad;
    border: 0;
  }
  .searchFilter .el-input {
    width: 108px;
  }
  .el-pagination__total {
    color: #fff;
  }
  .el-input .el-input__inner{
    color: #fff;
  }
  .el-select-dropdown {
    background-color: #3f60ad;
  }
  &.el-select-dropdown {
    background-color: #3f60ad;
    border: 1px solid #1f57d7;
    .el-select-dropdown__item {
      color: #fff;
    }
    .selected {
      background-color: #243d78;
    }
    .hover {
      background-color: #3e568f;
    }
  }
  .el-pagination {
    .btn-prev, .btn-next, .el-pager li{
      background-color: #3f60ad;
      color: #fff;
    }
  }
}


}
</style>
