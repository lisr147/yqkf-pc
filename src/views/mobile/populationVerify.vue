<template>
  <div>
    <el-form
      :model="data"
      class="rkhc-wrap"
      v-if="data"
      label-width="100px"
      ref="form"
      :disabled="readonly"
    >
      <div class="title">
        待核查任务
      </div>
      <div class="card">
        <p>下发时间：{{data.sendTime}}</p>
        <p>下发批号：{{data.id}}</p>
        <p v-if="data.sszj">所属镇街：{{data.sszj}}</p>
        <p v-if="data.sswg">所属网格：{{data.sswg}}</p>
        <p>待核查人数：{{data.dhcrs}}</p>
      </div>
      <div class="btns">
        <el-button size="medium" plain @click="exportData">导出文件</el-button>
        <el-button size="medium" type="primary"  @click="dialog = 'importFile'">导入核查结果</el-button>
      </div>

    </el-form>
    <div class="no-data" v-else>暂无数据</div>
    <import-file
      :tableId="tableId"
      v-if="dialog === 'importFile'"
      @close="dialog = null"
      @update="getTaskDetail"
    />
  </div>
</template>
<script>

import ImportFile from "../common/uploadFile";
import {exportPopulaStat,getTaskDetail} from '@/api/PopulaStat'
export default {
  name: "populationVerify",
  components:{
    ImportFile
  },
  data() {
    return {
      token: "",
      data: null,
      rawData: null,
      readonly: false,
      tableId:12138,
      dialog: null,
    };
  },

  async mounted() {
    this.token = this.$route.query.token;
    this.getTaskDetail()
  },
  methods: {
    async getTaskDetail(){
      let params = {
        token:this.token
      }
      let res = await getTaskDetail(params)
      if(res){
        this.data = res
      }
    },
    //导出
    async exportData() {
      await exportPopulaStat(this.token)
    },
  },
};
</script>
<style lang="scss">
#app {
  overflow: auto;
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
.rkhc-wrap {
  padding: 1rem;
  font-size: 16px;
  .title {
    font-weight: 600;
    text-align: center;
  }
  .card {
    margin: 1rem 0rem;
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 4px;
    p{
      margin-block-start: 1em;
      margin-block-end: 1em;
      font-size: 16px;
    }
  }
  .btns{
    display: flex;
    justify-content: space-around;
    .el-button{
      width: 50%;
    }
  }
}
.no-data {
  text-align: center;
  padding: 5rem;
  color: #999;
}
</style>
