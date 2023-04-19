<template>
  <el-dialog
      title="流调信息"
      width="750px"
      :visible="true"
      class="screen-dialog"
      v-dialogDrag
      @close="close"
  >
    <el-tabs v-model="currTab" type="card" >
      <el-tab-pane label="基本信息" name="base">
        <base-info :id="id"/>
      </el-tab-pane>
      <el-tab-pane label="核心轨迹" name="track">
        <track-info :id="id"/>
      </el-tab-pane>
      <el-tab-pane label="疫情接种情况" name="inoculation">
        <vaccination-info  :id="id"/>
      </el-tab-pane>
      <el-tab-pane label="近7天核酸情况" name="detection">
        <detect-info :id="id"/>
      </el-tab-pane>
      <el-tab-pane label="其他" name="other">
        <other-info :id="id"/>
      </el-tab-pane>
    </el-tabs>

  </el-dialog>
</template>

<script>
import BaseInfo from "./BaseInfo";
import TrackInfo from "./TrackInfo";
import VaccinationInfo from "./VaccinationInfo";
import DetectInfo from "./DetectInfo";
import OtherInfo from "./OtherInfo";
export default {
  name: "DispatchPanel",
  components: {OtherInfo, DetectInfo, VaccinationInfo, TrackInfo, BaseInfo},
  props: {
    id: {type: String}
  },
  data() {
    return {
      currTab: 'other'
    }
  },
  mounted() {
  },
  methods: {
    close(){
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" type="text/scss">

</style>
