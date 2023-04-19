<template>
  <div class="el-main-body">

    <div class="area-main" >

      <div class="area-main-head">
        <h4>统计数据</h4>
      </div>

      <div class="area-main-box">

        <div style="padding: 1em 0;">
          <label>当前表单 </label>
          <el-select v-model="currFormId" placeholder="请选择表单" filterable style="width:400px;">
            <el-option
              v-for="item in formList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>

        <el-tabs v-if="currFormData" v-model="tabIndex">
          <el-tab-pane label="明细数据" name="0">
            <detail-data :form-id="currFormData.id" :form-data="currFormData"  v-if="tabIndex==='0'" :filterIp="filterIp" ref="detailData"></detail-data>
          </el-tab-pane>

          <el-tab-pane label="填写情况" name="1">
            <fill-data :form-id="currFormData.id" :form-data="currFormData" v-if="tabIndex==='1'"></fill-data>
          </el-tab-pane>

        </el-tabs>

      </div>

    </div>

  </div>
</template>

<script>
  import DetailData from "@/components/statics/DetailData"
  import FillData from "@/components/statics/FillData"
  import {getForm,getAccessFormList} from '@/api/form'


  export default {
    name: "StaticsIndex",
    components: {
      DetailData,
      FillData
    },
    data() {
      return {
        //当前表单id
        currFormId: null,
        currFormData:null,
        //可选表单列表
        formList: [],
        tabIndex:'0',
        filterIp:null
      }
    },
    mounted() {

      const {id} = this.$route.query
      this.currFormId = id
      this.getFormList()
    },
    watch:{
      currFormId:{
        async handler(val){
          if(!val){return}
          this.currFormData = await getForm({ id: val });
        },
        immediate:true
      }
    },
    methods: {
      getFormList(){
        getAccessFormList().then(res => {

          this.formList = res.map(item => {
            return {
              value: item.formKey,
              label: item.formName
            }
          })

          // 给当前表单赋予默认值
          if (this.formList.length && !this.currFormId) {
            this.currFormId = this.formList[0].value
          }

        })
      },
      handleViewViaDate({date}){
        this.tabIndex = '0'
        this.$refs['detailData'].startSearch({startTime: date + ' 00:00:00', endTime: date + ' 23:59:59'})
      },
      async handleViewIpDetail(ip){
        this.filterIp = ip
        this.tabIndex='0'
        await this.$nextTick()
        this.filterIp = null
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
