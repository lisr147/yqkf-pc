<template>
  <div class="base-info">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item v-for="(item,index) in dataList" :key="index" :label="item.label"  >
          <el-input :value="item.value" style="width: 300px;" readonly/>
          <voice-tip v-for="v in item.voiceList" :data="v" :key="v.id"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VoiceTip from "./VoiceTip";
export default {
  name: "BaseInfo",
  components: {VoiceTip},
  data() {
    return {
      form: {},
      dataList: [
        {label: '姓名',value: '张居正',voiceList: [{id:1, content:'我的名字是张居正'}]},
        {label: '性别',value: '张居正',voiceList: [{id:1, content:'我的名字是张居正'}]},
        {label: '年龄',value: '张居正',voiceList: [{id:1, content:'我的名字是张居正'}]},
        {label: '现住址',value: '张居正',voiceList:  [{id:1, content:'我的名字是张居正'}]},
        {label: '户籍地址',value: '张居正',voiceList:  [{id:1}]},
        {label: '身份证号码',value: '1235588'},
        {label: '职业',value: '张居正',},
        {label: '工作单位',value: '张居正',},
        {label: '联系方式',value: '13570563256',},
        // {label: '照片',value: '',},
      ]
    }
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" type="text/scss" scoped>
.base-info{
  max-height: 500px;
  overflow: auto;
}
</style>
