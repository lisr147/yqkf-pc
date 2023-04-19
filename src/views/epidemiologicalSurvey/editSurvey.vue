<template>
  <div class="p-edit-epidemiological-survey">
    <header class="p-edit-epidemiological-survey-header">
      编辑被流调人员
      <button type="button" class="el-dialog__headerbtn" @click="getBack">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </button>
    </header>
    <main class="p-edit-epidemiological-survey-main">
      <tabs :tabs="tabs" v-model="currentTab"></tabs>
      <base-info
        v-show="currentTab === 'baseInfo'"
        :baseInfo="baseInfo"
        ref="baseInfo"
      ></base-info>
      <core-locus
        v-show="currentTab === 'coreLocus'"
        :coreLocus="coreLocus"
        @refresh="refresh"
        ref="coreLocus"
      ></core-locus>
      <vaccination-status
        v-show="currentTab === 'vaccinationStatus'"
        :vaccinationStatus="vaccinationStatus"
        ref="vaccinationStatus"
      ></vaccination-status>
      <nucleic-acid-status
        v-show="currentTab === 'nucleicAcidStatus'"
        :nucleicAcidStatus="nucleicAcidStatus"
        ref="nucleicAcidStatus"
      ></nucleic-acid-status>
      <scan-record
        v-show="currentTab === 'scanRecord'"
        :scanRecord="scanRecord"
        :personnelId="id"
        ref="scanRecord"
      />
      <relation-member
        v-show="currentTab === 'relationMember'"
        :relationMember="relationMember"
        :personnelId="id"
        ref="relationMember"
      />
      <other v-show="currentTab === 'other'" :other="other" ref="other"></other>
    </main>
    <footer class="p-edit-epidemiological-survey-footer">
      <el-button
        size="medium"
        type="primary"
        class="p-edit-epidemiological-survey-submit"
        @click="submit"
      >
        保存
      </el-button>
      <el-button
        size="medium"
        type="primary"
        class="p-edit-epidemiological-survey-submit"
        @click="finishEpiDemiologicalSurvey"
        :disabled="baseInfo.zt === '已完成'"
      >
        流调完成
      </el-button>
      <el-button
        size="medium"
        class="p-edit-epidemiological-survey-cancel"
        @click="getBack"
      >
        返回
      </el-button>
    </footer>
    <find-duplicate-dialog
      :visible.sync="findDuplicateDialogVisible"
      :tableData="findDuplicateTableData"
      @selectThis="selectIdToFinish"
    ></find-duplicate-dialog>
  </div>
</template>
<script type="text/javascript">
import Tabs from "@/components/common/Tabs";
import { finshEpidemiologicalSurvey } from "@/api/epidemiologicalSurvey";
import { deepCompare, cloneNormalObject } from "@/utils/common";
import {
  baseInfoFormTemplate,
  coreLocusFormTemplate,
  epidemiologicalSurveyMaps,
  vaccinationStatusFormTemplate,
  nucleicAcidStatusFormTemplate,
} from "./config";
import { getTemplateData } from "@/api/common";
import Watcher from "@/class/watcher";

import {
  BaseInfo,
  CoreLocus,
  VaccinationStatus,
  NucleicAcidStatus,
  Other,
  FindDuplicateDialog,
  ScanRecord,
  RelationMember
} from "./components";

const excludeTab = ["other", "scanRecord", "relationMember"];

export default {
  components: {
    Tabs,
    BaseInfo,
    CoreLocus,
    VaccinationStatus,
    NucleicAcidStatus,
    Other,
    FindDuplicateDialog,
    ScanRecord,
    RelationMember
  },
  name: "editSurvey",
  data() {
    return {
      initialized: [],
      tabs: epidemiologicalSurveyMaps,
      currentTab: "baseInfo",
      baseInfo: cloneNormalObject(baseInfoFormTemplate),
      vaccinationStatus: cloneNormalObject(vaccinationStatusFormTemplate),
      nucleicAcidStatus: cloneNormalObject(nucleicAcidStatusFormTemplate),
      coreLocus: cloneNormalObject(coreLocusFormTemplate),
      scanRecord: {},
      relationMember: [],
      other: {
        qtzp: "",
      },
      findDuplicateTableData: [],
      findDuplicateDialogVisible: false,
      id: "",
    };
  },
  watch: {
    "$route.query"() {
      this.id = this.$route.query.id;
      Object.assign(this.$data, this.$options.data.call(this));
    },
    id() {
      this.init();
    },
    currentTab(newVal) {
      if (!this.initialized.includes(newVal)) {
        this.fetchData(newVal);
      }
    },
  },
  created() {
    console.clear();
  },
  mounted() {
    this.init();
    this.initWatcher();
  },
  methods: {
    async submit() {
      const { initialized, currentTab } = this;
      const statusList = ["vaccinationStatus", "nucleicAcidStatus"];
      // 判断数据是否发生变动
      const needUpdate = initialized.filter(
        (v) =>
          excludeTab.indexOf(v) < 0 &&
          !deepCompare(this[v], this.$refs[v][v + "Form"])
      );
      if (needUpdate.length === 0) {
        this.$message.warning("信息未作修改");
        return;
      }
      // 校验表单
      try {
        const result = await Promise.all(
          needUpdate.map((v) => this.$refs[v].validate())
        );
        const checkList = [];
        result.forEach((c, i) => {
          if (!c)
            checkList.push(
              epidemiologicalSurveyMaps.find((v) => v.value === needUpdate[i])
                .label
            );
        });
        if (result.includes(false)) {
          this.$message.warning(
            `请检查${checkList.join("、")}表单是否填写正确`
          );
          return;
        }
        needUpdate.map((v) => {
          // 数据预处理
          const currentForm = this.$refs[v][v + "Form"];
          if (statusList.includes(v)) {
            this.$refs[v][v + "Form"].data = currentForm.data.map((item) => ({
              ...item,
              sfzhm: currentForm.sfzhm,
              xm: currentForm.xm,
              isDeleted: item.isDeleted === null ? false : item.isDeleted, // 全等于null则赋予默认值false
            }));
          }
          // 更新数据
          return this.update(v);
        });
        this.$message.success("保存成功");
        const relationMemberIdx = this.initialized.indexOf('relationMember');
        if(relationMemberIdx > -1) this.initialized.splice(relationMemberIdx,1);
        if (this.adding) this.adding = "";
        if (currentTab === "other") this.fetchData(currentTab);
      } catch (error) {
        console.error(error);
        this.$message.error("保存失败");
      }
    },
    init() {
      const { id } = this.$route.query;
      const { currentTab } = this;
      this.id = id;
      this.fetchData(currentTab);
    },
    initWatcher() {
      if (window["_watcher_voice"]) return;
      const ws = new Watcher({
        name: "dispatchWatcher",
        type: "voice",
        scope: this,
      });
      ws.addListener((data) => {
        this.updateViewFromSocket(data);
      });
    },
    resetFields(name) {
      this.$refs[name].resetFields();
    },
    //更新流调信息
    updateViewFromSocket(data) {
      const { id } = this;
      const {
        dataId, //流调id
        type, // 用于区分信息簇 base:基本信息 track:核心轨迹 vaccination:疫苗接种 detection:近7天核酸情况 other:其他 map:地图
      } = data;
      const tabMap = {
        base: "baseInfo",
        track: "coreLocus",
      };
      if (id == dataId && tabMap[type]) {
        this.updateView(tabMap[type], data);
      }
    },
    updateView(tab, data) {
      const { fieldName, value, index } = data;
      const { mediaInfoId, mediaInfoText: yyText = "" } = value;
      // 填充输入框
      if (fieldName !== "xb") {
        if (fieldName === "hxgj") {
          this.$refs[tab][tab + "Form"].locus[index].locus = yyText;
        } else {
          this.$refs[tab][tab + "Form"][fieldName] = yyText;
        }
      }
      // 更新语音气泡
      if (fieldName === "hxgj") {
        this.$refs[tab][tab + "Form"].locus[index].locusYyWb.unshift({
          yyText,
          mediaInfoId,
        });
      } else {
        this.$refs[tab][tab + "Form"][`${fieldName}yywb`].unshift({
          yyText,
          mediaInfoId,
        });
      }
    },
    refresh() {
      const { currentTab } = this;
      this.fetchData(currentTab);
    },
    fetchData(tab) {
      const { id, tabs } = this;
      const tabItem = tabs.find((v) => v.value === tab);
      const params = {};
      if (tabItem.apiType === "pages") {
        params.pageNum = 1;
        params.pageSize = 10;
      }
      tabItem.api(id, params).then((res) => {
        if (!this.initialized.includes(tab)) this.initialized.push(tab);
        this[tab] = cloneNormalObject({ ...this[`${tab}`], ...res });
      });
    },
    update(tab) {
      if (tab === "other") return;
      const { id, tabs } = this;
      const tabItem = tabs.find((v) => v.value === tab);
      try {
        tabItem.saveApi(id, this.$refs[tab][tab + "Form"]).then((res) => {
          if (tab !== "other") {
            if(tab ==='baseInfo'){
              this.fetchData(tab);
              return;
            }
            if (tab === "vaccinationStatus" || tab === "nucleicAcidStatus") {
              this[tab].data = cloneNormalObject([...res]);
            } else {
              this[tab] = cloneNormalObject({ ...this[`${tab}`], ...res });
            }
          }
        });
      } catch (error) {
        console.error(tabItem, error);
      }
    },
    getBack() {
      const { initialized } = this;
      // 判断数据是否发生变动
      const needUpdate = initialized.filter(
        (v) =>
          excludeTab.indexOf(v) < 0 &&
          !deepCompare(this[v], this.$refs[v][v + "Form"])
      );
      if (needUpdate.length) {
        this.$confirm("你有修改未保存, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/epidemiologicalSurvey");
          })
          .catch(() => {});
      } else {
        this.$router.push("/epidemiologicalSurvey");
      }
    },

    selectIdToFinish(id) {
      const { currentTab } = this;
      finshEpidemiologicalSurvey(id)
        .then(() => {
          this.$message.success("流调已完成");
          this.findDuplicateDialogVisible = false;
          this.fetchData(currentTab);
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    finishEpiDemiologicalSurvey() {
      getTemplateData({
        templateId: "10095",
        condition: {
          glsj: this.baseInfo.glsj,
          sfzhm: this.baseInfo.sfzhm,
        },
      }).then((res) => {
        if (res.total > 1) {
          this.findDuplicateTableData = res.data;
          this.findDuplicateDialogVisible = true;
        } else {
          this.selectIdToFinish(res.data[0].id);
        }
      });
    },
  },
};
</script>

<style
  lang="scss"
  src="@assets/scss/epidemiologicalSurvey/editEpidemiologicalSurvey.scss"
></style>
