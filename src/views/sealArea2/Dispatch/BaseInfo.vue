<template>
  <div class="base-info">

    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item v-for="(item,index) in dataList" :key="index" :label="item.label"  >
          <template v-if="item.type =='gallery'">
            <photo-frame :ids="baseInfo[item.id]" :withTitle="false"/>
          </template>
          <template v-else>
            <el-input :value="baseInfo[item.id]" style="width: 300px;" readonly/>
            <div v-if="baseInfo[`${item.id}yywb`]"></div>
            <voice-tip v-for="(v, vIndex) in baseInfo[`${item.id}yywb`]" :data="v" :key="vIndex"/>
          </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VoiceTip from "./VoiceTip";
import PhotoFrame from "./PhotoFrame";
export default {
  name: "BaseInfo",
  components: {PhotoFrame, VoiceTip},
  data() {
    return {
      form: {},
      dataList: [
        {label: '姓名',id: 'xm'},
        {label: '性别',id: 'xb'},
        {label: '年龄',id: 'nl'},
        {label: '现住址',id: 'xzz'},
        {label: '户籍地址',id: 'hjdz'},
        {label: '身份证号码',id: 'sfzhm'},
        {label: '职业',id: 'zy',},
        {label: '工作单位',id: 'gzdw',},
        {label: '联系电话',id: 'lxdh',},
        {label: '照片', id: 'zp', type: 'gallery'},
      ]
    }
  },
  computed:{
    baseInfo(){
      return this.$store.state.dispatch.baseInfo
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
