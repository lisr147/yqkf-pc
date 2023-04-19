<template>
  <div class="all-data-container">
    <div class="left panel">
      <panel title="南沙人员概览">
        <nanshaPeople />
      </panel>
    </div>
    <div class="middle panel">
      <div class="middle-top">
        <panel
          title="密切接触者"
          :titleTips="contantTips"
          style="height: 360px"
        >
          <contact-people />
        </panel>
      </div>
      <div class="middle-bottom">
        <div class="middle-bottom-item">
          <panel title="社区监控重点人员" :titleTips="communityTips">
            <community-people />
          </panel>
        </div>
        <div class="middle-bottom-item">
          <panel title="重点行业人员" :titleTips="domainTips">
            <domain-people />
          </panel>
        </div>
      </div>
      <!-- <panel /> -->
    </div>
    <div class="right panel">
      <div class="right-top">
        <panel title="专项播报" style="height: 170px">
          <div class="no-data">暂无数据</div>
        </panel>
      </div>
      <div class="right-bottom">
        <panel title="常态化防疫监控">
          <moniter-panel />
        </panel>
      </div>
    </div>
  </div>
</template>

<script>
import Panel from "@/views/allDataTotal/panel.vue";
import NanshaPeople from "@/views/allDataTotal/nanshaPeople.vue";
import ContactPeople from "@/views/allDataTotal/contactPeople.vue";
import CommunityPeople from "@/views/allDataTotal/communityPeople.vue";
import DomainPeople from "@/views/allDataTotal/domainPeople.vue";
import MoniterPanel from "@/views/allDataTotal/moniterPanel.vue";
export default {
  name: "all-data-total",
  components: {
    Panel,
    NanshaPeople,
    ContactPeople,
    CommunityPeople,
    DomainPeople,
    MoniterPanel,
  },
  computed: {},
  data() {
    return {
      contantTips: [
        "1、密切接触者：该数据通过广州市疫情防控管理系统（防疫通）对接到本系统。",
        "更新时间：2022-11-23 14:27:40；",
        "2、现有密切接触者：即待确认、已确认待转运、已确认管控中状态的密切接触者；",
        "3、累计密切接触者：即所有密切接触者，包含已确认结束管控、无需管控以及无法落地状态的密切接触者。",
      ],
      communityTips: [
        "社区监控重点人员：该数据通过广州市疫情防控管理系统（防疫通）对接到本系统。更新时间：2022-11-23 14:27:40。",
      ],
      domainTips: [
        "1、重点行业人员：该数据由各重点行业对应委办局统筹、企业配合，通过在疫情防控指挥平台数据台账管理系统上传数据方式不定期更新；",
        "2、已做核酸人数：重点行业人员核酸数据定期通过区共享平台对接到本系统",
      ],
    };
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.all-data-container {
  z-index: 21;
  position: relative;
  top: 54px !important;
  height: 100%;
  width: 100%;
  padding: 30px 0px;
  background: linear-gradient(180deg, #0262ae 0%, #034395 18%, #00306d 100%);
  display: flex;

  .panel {
    margin: 0 12px;
    height: calc(100% - 120px);
    // border: 14px solid transparent !important;
    // border-image: url("~@/assets/image/dialog-bg.png") 14 !important;
    // background-color: #1D3372;
  }

  .left {
    flex: 1;
    width: 0px;
  }

  .middle {
    width: 972px;
    display: flex;
    flex-direction: column;

    &-top {
      height: 385px;
      margin: 0 0 24px 0;
    }

    &-bottom {
      height: calc(100% - 408px);
      display: flex;
      justify-content: space-between;

      &-item {
        width: 474px;
      }
    }
  }

  .right {
    flex: 1;
    width: 0px;
    display: flex;
    flex-direction: column;

    &-top {
      height: 196px;
      margin: 0 0 24px 0;
    }
    &-bottom {
      height: calc(100% - 220px);
    }
  }
}
.no-data {
  text-align: center;
  margin-top: 55px;
  color: #8a96a3;
  height: 22px;
  font-size: 16px;
}
</style>