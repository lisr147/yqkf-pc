<template>
  <div>
    <!-- test2
    <el-date-picker
      :class="desc.class"
      :style="desc.style"
      @input="handleChange"
      class="ele-form-full-line"
      v-bind="attrs"
      v-model="newValue"
      v-on="onEvents"
    > -->
    <el-row :gutter="20">
      <el-col :xs="22" :sm="10">
    <el-date-picker
      :class="desc.class"
      class="ele-form-full-line"
      :style="desc.style"
      type="datetime"
      v-bind="attrs"
      v-model="startDate"
      placeholder="选择开始日期时间"
      @change="changeDateTime"
      value-format="timestamp"
    />
      </el-col>
      <el-col :xs="2" :sm="2" style="text-align:center;">
        到
      </el-col>
    <el-col :xs="22" :sm="10">
    <el-date-picker
      v-model="endDate"
      class="ele-form-full-line"
      type="datetime"
      placeholder="选择结束日期时间"
      @change="changeDateTime"
      value-format="timestamp"
      >
    </el-date-picker>
    </el-col>
    </el-row>
    <!-- <el-date-picker
      :class="desc.class"
      :style="desc.style"
      class="ele-form-full-line"
      v-bind="attrs"
      v-model="endDate"
    />
      <template v-for="(render, key) of slots" v-slot:[key]>
        <extend-slot :key="key" :render="render" />
      </template>
    </el-date-picker> -->
  </div>
</template>

<script>
import formMixin from "vue-ele-form/lib/mixins/formMixin";
import timerangeMixin from 'vue-ele-form/lib/mixins/timerangeMixin'
// import mock from 'vue-ele-form/lib/tools/mock'

export default {
  name: 'EleFormDatetimerange2',
  mixins: [formMixin, timerangeMixin],
  data() {
    return {
      // mockRule: 'custom',
      startDate:null,
      endDate:null
    }
  },
  computed: {
    defaultAttrs() {
      return {
        type: 'datetimerange',
        startPlaceholder: this.t('ele-form.startDate'),
        endPlaceholder: this.t('ele-form.endDate')
      }
    }
  },
  watch:{
    value:{
      handler(value){
        if(!value){
          return
        }
        let change = false
        if(this.startDate!==value[0]){
          this.startDate = value[0]
          change = true
        }
        if(this.endDate!==value[1]){
          this.endDate = value[1]
          change = true
        }
        if(change){
          this.changeDateTime
        }
      },
      immediate:true
    }
  },
  methods: {
    // getCustomMockData() {
    //   const Mock = mock()
    //   if (Mock.mock) {
    //     const date1 = Mock.mock('@datetime')
    //     const date2 = Mock.mock('@datetime')
    //     if (date1 > date2) {
    //       return [date2, date1]
    //     } else {
    //       return [date1, date2]
    //     }
    //   }
    // }
    changeDateTime(){
      // console.log(this.startDate,this.endDate)
      if(!this.startDate&&!this.endDate){
        this.$emit('input','')
        return
      }
      this.$emit('input',[this.startDate/1000,this.endDate/1000])
    }
  }
}
</script>
<style type="text/scss" scoped>
@media only screen and (max-width: 768px) {
  .el-col-xs-2 + .el-col-xs-22 {
    margin-top: 10px;
  }
}
</style>
