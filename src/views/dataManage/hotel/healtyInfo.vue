<template>
  <el-dialog
    title="健康信息"
    :visible="true"
    append-to-body
    @close="$emit('close')"
    width="400px"
    top="30px"
  >
  <el-tabs v-model="type" type="card">
    <el-tab-pane label="核酸检查" name="0">
      <el-card class="box-card" v-for="(item,index) in nucleicData" :key="`healtyData${index}`">
        <div >
            核酸采样时间 : {{item.examinationTime}}
        </div>
        <div >
            核酸检测结果 : {{item.result==='0'?'阴性':'阳性'}}
        </div>
        <div >
            备注 : {{item.remarks}}
        </div>
        </el-card>

        <el-card class="box-card" v-if="nucleicData.length === 0">
        <div >
            暂无数据
        </div>
        </el-card>
    </el-tab-pane>
    <el-tab-pane label="健康监测" name="1">
       <el-card class="box-card" v-for="(item,index) in healtyData" :key="`healtyData${index}`">
        <div >
            健康监测时间 : {{item.examinationTime}}
        </div>
        <div >
            体温 : {{item.temperature}} 症状 : {{item.symptom==='1'?'有':'无'}}
        </div>
        <div >
            备注 : {{item.remarks}}
        </div>
        </el-card>
        <el-card class="box-card" v-if="healtyData.length === 0">
        <div >
            暂无数据
        </div>
        </el-card>
    </el-tab-pane>
  </el-tabs>
  </el-dialog>
</template>
<script>
export default {
  name: "healty-info",
  props:['data'],
  data() {
    return {
      healtyData:{},
      nucleicData:{},
    };
  },
  async mounted() {
      this.healtyData = await this.$Api().HealthExaminationController.get_searchExamination.request({path:{
          personId:this.data.id
      }})
      this.nucleicData = await this.$Api().NucleicAcidExaminationController.get_searchExamination.request({path:{
          personId:this.data.id
      }})
  },
};
</script>
<style lang="scss">
.box-card{
    margin-bottom: 10px;
}
</style>