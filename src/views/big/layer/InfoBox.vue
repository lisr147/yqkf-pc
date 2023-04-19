<template>
  <div class="info-box">
    <div class="info-opt" v-if="!hiddenBtn">
      <div class="cu-btn" v-if="lineUpAble" @click="showlineUp">
        查看排队情况
      </div>
      <div class="cu-btn" v-if="videoListAble" @click="showVideoList">
        查看视频
      </div>
      <div class="cu-btn" v-if="connectionAble" @click="openMeeting">
        现场连线
      </div>
      <div class="cu-btn" v-if="staffListAble" @click="showStaffList">
        查看工作人员
      </div>
      <div class="cu-btn" v-if="logListAble" @click="showLogList">
        查看购药记录
      </div>
      <div
        class="cu-btn"
        v-if="transitVehiclesAble"
        @click="showTransitVehicles"
      >
        转运车辆
      </div>
      <div
        class="cu-btn"
        v-if="allocationHealthCareAble"
        @click="showAllocationHealthCare"
      >
        配置医护人员
      </div>
      <div
        class="cu-btn"
        v-if="consultationSchedulingAble"
        @click="showConsultationScheduling"
      >
        会诊排班
      </div>
      <div class="cu-btn" v-if="historyAble" @click="showHistory">
        查看历史数据
      </div>
    </div>
    <div class="info-table">
      <div class="info-item" v-for="(item, key) in dataList" :key="key">
        <div class="box-label">{{ item.label }}</div>

        <div
          class="box-value"
          v-if="item.label.includes('联系') || item.label.includes('电话')"
          v-cellphone
        >
          {{ item.value }}
        </div>
        <div class="box-value" v-else>{{ item.value }}</div>
      </div>
      <div class="info-item" v-if="dataList.length % 2 == 1">
        <div class="box-label"></div>
        <div class="box-value"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Moment from "moment";
import { getMapLayerData } from "@/api/mapData.js";
import SETTING from "@/config/MapSetting.js";

export default {
  name: "InfoBox",
  components: {},
  inject: ["handleItemChoosed"],
  props: {
    template: {
      //模板
      type: Array,
      default: function () {
        return [];
      },
    },
    datum: {
      //数据
      type: Object,
      default: function () {
        return {};
      },
    },
    attrs: {
      //其他可用属性
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      dataList: [],
      transitVehicles: [],
      consultationScheduling: [],
      allocationHealthCare: [],
    };
  },
  computed: {
    connectionAble() {
      // 现场连线
      try {
        let { layerId } = this.attrs;
        if (["detectionPoint"].includes(layerId)) {
          return true
        }
        return false
      } catch (e) {
        return false;
      }
    },
    videoListAble() {
      //以下图层可查看实时视频
      //隔离酒店 冷链仓库 跨境司行动点 公共场所 肉菜市场 商超
      let { layerId } = this.attrs;

      var res = false;

      if (
        [
          "hotel",
          "coldWarehouse",
          "driverWorkPoint",
          "keyPlaces",
          "foodMarket",
        //   "market",
          "pharmacy",
          "school",
          "detectionPoint",
          "nurseHouse",
          "maternityCenter",
          "detectPointAround",
          "industry",
          "gcyKeyplace",
          "therapyStation",
        ].includes(layerId)
      ) {
        res = true;
      }

      return res;
    },
    staffListAble() {
      //冷链仓库 跨境司机作业点 物业中转仓库 志愿者机构 可查看工作人员明细
      let { layerId } = this.attrs;
      return [
        "coldWarehouse",
        "driverWorkPoint",
        "transitWarehouse",
        "volunteer",
        "email",
        "importedMaterial",
        "party",
      ].includes(layerId);
    },
    logListAble() {
      let { layerId } = this.attrs;
      return ["pharmacy"].includes(layerId);
    },
    transitVehiclesAble() {
      return this.transitVehicles.length > 0;
    },
    consultationSchedulingAble() {
      return this.consultationScheduling.length > 0;
    },
    allocationHealthCareAble() {
      return this.allocationHealthCare.length > 0;
    },
    historyAble() {
      let { layerId } = this.attrs;
      return ["school"].includes(layerId);
    },
    lineUpAble() {
      let { layerId } = this.attrs;
      return ["detectionPoint"].includes(layerId);
    },
    hiddenBtn(){
      return this.$route.name==='sealareaIndex'
    }
  },
  watch: {
    template() {
      this.fixData();
    },
    datum(val) {
      this.fixData();
      let { layerId } = this.attrs;
      if ("hospital" === layerId && val.mc) {
        this.initHospitalData(val.mc);
      }
    },
  },
  mounted() {
    this.fixData();
    let { layerId } = this.attrs;
    if ("hospital" === layerId && this.datum.mc) {
      this.initHospitalData(this.datum.mc);
    }
  },
  methods: {
    isNotEmptyString(variant) {
      return (
        typeof variant !== "string" ||
        (typeof variant === "string" && !variant.match(/^\s*$/))
      );
    },
    initHospitalData(mc) {
      this.getData("transitVehicles", {
        fycxsydw: mc,
      });
      this.getData("consultationScheduling", {
        zjssyy: mc,
      });
      this.getData("allocationHealthCare", {
        ssyy: mc,
      });
    },
    fixData() {
      const detail = this.datum;
      var arr = [];
      this.template.forEach((item) => {
        const { fieldName, storeFiled, fieldType } = item;
        if (
          ![undefined, null].includes(detail[storeFiled]) &&
          ![
            "creator",
            "creatorName",
            "createTime",
            "longitude",
            "latitude",
          ].includes(storeFiled) &&
          this.isNotEmptyString(detail[storeFiled])
        ) {
          let value;
          switch (fieldType) {
            case "datetime":
              value = Moment(detail[storeFiled]).format("YYYY-MM-DD HH:mm:ss");
              break;
            default:
              value = detail[storeFiled];
              break;
          }
          arr.push({
            label: fieldName,
            value,
          });
        }
      });

      this.dataList = arr;
    },
    openMeeting() {
      if (this.datum.templateId === 10055 && !this.datum.cydzzsjhm)
        return this.$message.error("该采样点无站长手机号码，无法邀请");
      let attributes = { ...this.attrs, ...this.datum };
      this.handleItemChoosed(attributes, "meeting");
      // let room = Math.floor(Math.random()*10000)+100000
      // let room = '999'
      // window.open(`https://dnvideopre.iot-cas.com/video/index.html#/?name=${this.$store.state.user.username}&romm=${room}`)
    },

    showVideoList() {
      this.$emit("popUp", {
        eventType: "showVideoList",
        attributes: { ...this.attrs, ...this.datum },
      });
    },

    showStaffList() {
      this.$emit("popUp", {
        eventType: "showStaffList",
        attributes: { ...this.attrs, ...this.datum },
      });
    },

    showLogList() {
      this.$emit("popUp", {
        eventType: "showLogList",
        attributes: { ...this.attrs, ...this.datum },
      });
    },

    showTransitVehicles() {
      this.$emit("popUp", {
        eventType: "showTransitVehicles",
        attributes: {
          ...this.attrs,
          ...this.datum,
          tableData: this.transitVehicles,
        },
      });
    },

    showConsultationScheduling() {
      this.$emit("popUp", {
        eventType: "showConsultationScheduling",
        attributes: {
          ...this.attrs,
          ...this.datum,
          tableData: this.consultationScheduling,
        },
      });
    },

    showAllocationHealthCare() {
      this.$emit("popUp", {
        eventType: "showAllocationHealthCare",
        attributes: {
          ...this.attrs,
          ...this.datum,
          tableData: this.allocationHealthCare,
        },
      });
    },

    showHistory() {
      this.$emit("popUp", {
        eventType: "showHistory",
        attributes: { ...this.attrs, ...this.datum },
      });
    },
    showlineUp() {
      this.$emit("popUp", {
        eventType: "showlineUp",
        attributes: { ...this.attrs, ...this.datum },
      });
    },
    async getData(key, param) {
      const { layerId } = this.attrs;
      const layerSetting = SETTING.getLayerInfo(layerId);
      if (!layerSetting) {
        console.error("没有获取到图层${layerId} 的人员列表id");
        return;
      }
      const params = {
        //查询条件
        templateId: layerSetting[`${key}ListId`],
        condition: {
          searchInfo: "",
          ...param,
        },
      };
      const res = await getMapLayerData(params);
      this[key] = res.data;
      return res;
    },
  },
};
</script>

<style lang="scss" type="text/scss">
.info-box {
  .info-opt {
    padding: 0 1.5%;
    text-align: right;
  }

  .info-table {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 98%;
    padding-bottom: 4px;
  }

  .info-item {
    width: calc(50% - 1px);
    display: flex;
    border: 1px solid #465da3;
    margin-right: -1px;
    margin-bottom: -1px;
    position: relative;

    .box-label {
      width: 120px;
      min-height: 20px;
      padding: 8px 16px;
      flex-shrink: 0;
      background-color: rgba(45, 85, 208, 0.3);
    }
    .box-value {
      box-sizing: border-box;
      padding: 8px 16px;
      border-left: 1px solid #465da3;
      width: 100%;
    }
  }
}
</style>
