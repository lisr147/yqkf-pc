<template>
  <el-dialog
    title="流调信息"
    width="750px"
    :visible="true"
    class="screen-dialog"
    v-dialogDrag
    @close="close"
  >
    <el-tabs v-model="currTab" type="card">
      <el-tab-pane label="基本信息" name="base">
        <base-info :id="id" />
      </el-tab-pane>
      <el-tab-pane label="核心轨迹" name="track">
        <track-info :id="id" />
      </el-tab-pane>
      <el-tab-pane label="疫苗接种情况" name="vaccination">
        <vaccination-info :id="id" />
      </el-tab-pane>
      <el-tab-pane label="近14日核酸情况" name="detection">
        <detect-info :id="id" />
      </el-tab-pane>
      <el-tab-pane label="近14日扫码记录" name="record">
        <record-info :id="id" />
      </el-tab-pane>
      <el-tab-pane label="关联人员" name="relation">
        <relation-members :id="id" />
      </el-tab-pane>
      <el-tab-pane label="其他" name="other">
        <other-info :id="id" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import BaseInfo from "./BaseInfo";
import TrackInfo from "./TrackInfo";
import VaccinationInfo from "./VaccinationInfo";
import DetectInfo from "./DetectInfo";
import RecordInfo from "./RecordInfo";
import RelationMembers from './RelationMembers'
import OtherInfo from "./OtherInfo";

export default {
  name: "DispatchPanel",
  components: { OtherInfo, DetectInfo, VaccinationInfo, TrackInfo, BaseInfo, RecordInfo, RelationMembers},
  props: {
    id: { type: String },
  },
  data() {
    return {
      currTab: "base",
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.$store.dispatch("dispatch/getData", { id: this.id });
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" type="text/scss">
</style>
