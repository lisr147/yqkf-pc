<template>
  <div class="map-legend" :class="{ fr: rightFolder }">
    <div
      class="map-legend-item danghui"
      @click="togglePartyLayer"
      v-if="hasParty"
    >
      <img src="static/images/svg/danghui.svg" style="margin-right: 4px" />
      <br />
      <span>网格党组织</span>
    </div>
    <div
      class="map-legend-item cursor"
      @click="toggleMapList"
      v-if="mapList[curMapIndex]"
    >
      {{ mapList[curMapIndex].label }}
      <i class="el-icon el-icon-arrow-down"></i>
    </div>
    <div class="map-list-box" v-show="isMapListVisible">
      <ul>
        <li
          v-for="(item, index) in mapList"
          :key="index"
          :class="{ active: index == curMapIndex }"
          @click="switchMap(index)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>

    <div class="map-legend-item cursor" @click="toggleLegend" v-if="hasLegend">
      图例 <i class="el-icon el-icon-arrow-down"></i>
    </div>

    <div class="map-legend-item" v-if="hasGrid">
      网格
      <el-switch v-model="isGridVisible" active-color="#13ce66"></el-switch>
      <i
        class="el-icon el-icon-arrow-down"
        @click="gridFilterVisible = !gridFilterVisible"
      ></i>
    </div>

    <div class="map-legend-item">
      村居
      <el-switch v-model="isVillageVisible" active-color="#13ce66"></el-switch>
      <!-- <i
        class="el-icon el-icon-arrow-down"
        @click="gridFilterVisible = !gridFilterVisible"
      ></i> -->
    </div>

    <div class="map-legend-item search-box" v-show="gridFilterVisible">
      <p>
        <el-input
          placeholder="请输入网格名称关键词"
          v-model="gridKeyword"
          size="mini"
          :disabled="!isGridVisible"
          style="width: 150px"
          @change="gridFilter"
          @clear="gridFilter"
          clearable
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          style="margin-left: 6px"
          @click="gridFilter"
          :disabled="!isGridVisible"
        ></el-button>
      </p>
      <p>
        <span>匹配到{{ gridCount }}个网格</span>
      </p>
    </div>

    <div class="map-legend-item cursor" @click="toggleLocation">
      搜索地址 <i class="el-icon el-icon-arrow-down"></i>
    </div>
    <div class="map-legend-item search-box" v-show="locaSearchVisible">
      <el-input
        placeholder="请输入地址"
        v-model="locaKeyword"
        size="mini"
        clearable
        style="width: 150px"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        style="margin-left: 6px"
        @click="searchLocation"
      ></el-button>
      <div class="match-list">
        <div
          class="match-list-item"
          v-for="(item, index) in locaAutoList"
          :key="index"
          @click="gotoLocation(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <div v-if="hasAlarmCtrl" class="map-legend-item cursor">
      告警
      <el-switch
        v-model="isAlarmLayerVisible"
        active-color="#13ce66"
      ></el-switch>
    </div>
    <div
      class="map-legend-item cursor"
      style="text-align: center"
      @click="$emit('showStream')"
      v-if="liveAccess"
    >
      核酸点现场连线
    </div>
    <div
      class="map-legend-item cursor"
      style="width: auto"
      @click="$emit('showLineUpMap')"
    >
      核酸采样点排队地图
    </div>
    <!--图例-->
    <div class="map-legend-box" v-show="isLegendVisible">
      <dl v-for="item in legendData" :key="item.title">
        <dt>{{ item.title }}</dt>
        <dd v-for="(v, index) in item.list" :key="index">
          <img :src="`./static/mapIcon/${v.icon}.svg`" />
          <span>{{ v.label }}</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { debounce, throttle } from "@/utils/common";
import AMapLoader from "@amap/amap-jsapi-loader";
import { mapState } from "vuex";
import { WMTS_Layers } from "@/config/WMTS";
import { GZ2000 } from "@/config/WMTS";
import Point from "@arcgis/core/geometry/Point";

export default {
  name: "MapLegend",
  components: {},
  props: {
    hasAlarmCtrl: {
      type: Boolean,
      default: false
    },
    hasParty: {
      type: Boolean,
      default: true
    },
    hasLegend: {
      type: Boolean,
      default: true
    },
    hasGrid: {
      type: Boolean,
      default: true
    },
    isGz2000: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //是否显示图例
      isLegendVisible: false,
      //底图列表
      mapList: [],
      curMapIndex: 0,
      isMapListVisible: false,
      //图例源数据
      legendData: [
        {
          title: "重点人群",
          list: [
            { label: "中高风险地区来返粤人员", icon: "dangerPeople" },
            { label: "密接人员", icon: "mjPeople" },
            { label: "次密接人员", icon: "cmjPeople" },
            { label: "红码人员", icon: "icon-red" },
            { label: "黄码人员", icon: "icon-yellow" },
            { label: "特殊人群", icon: "special" }
            // {label:'跨境司机',icon:'driver'},
          ]
        },
        {
          title: "重点场所",
          list: [
            { label: "隔离酒店", icon: "hotel" },
            { label: "常规核酸采样点", icon: "hesuan_spot_cq" },
            { label: "大规模核酸采样点", icon: "hesuan_spot_ls" },
            { label: "核酸采样点周边", icon: "key_places" },
            { label: "道路出入口", icon: "roadgate" },
            { label: "公共场所", icon: "key_places_blue" },
            { label: "冷链仓库", icon: "coldWarehouse" },
            { label: "出入境口岸", icon: "inout" },
            { label: "跨境司机作业点", icon: "driverWorkPoint" },
            { label: "学校", icon: "school" },
            { label: "国际进口邮件快件处理场所", icon: "email" },
            { label: "进口物料企业", icon: "importedMaterial" },
            { label: "养老院", icon: "nurseHouse" },
            { label: "月子中心", icon: "maternityCenter" },
            { label: "工业企业", icon: "industry" },
            { label: "重点场所", icon: "gcyKeyplace" }
          ]
        },
        {
          title: "物资保障",
          list: [
            { label: "医院", icon: "hospital" },
            { label: "药店", icon: "pharmacy" },
            { label: "工疗站", icon: "therapyStation" },
            { label: "肉菜市场", icon: "foodMarket" },
            { label: "商超", icon: "market" },
            { label: "水产品生产企业", icon: "seafoodEmp" },
            { label: "防疫物资生产企业", icon: "factory" },
            { label: "畜禽生产企业", icon: "farmEmp" },
            { label: "建筑项目", icon: "building" },
            { label: "运输企业", icon: "busEmp" },
            { label: "物流中转仓库", icon: "transitWarehouse" }
          ]
        },
        {
          title: "人力保障",
          list: [
            { label: "网格党组织", icon: "party" },
            { label: "志愿者机构", icon: "volunteer" },
            { label: "三人小组", icon: "three_group" },
            { label: "核酸检测小组", icon: "hesuan_group" },
            { label: "安保力量", icon: "security" },
            { label: "快递配送人员", icon: "delivery" }
          ]
        },
        {
          title: "视频",
          list: [{ label: "视频", icon: "video" }]
        },
        {
          title: "封控管理区",
          list: [
            { label: "封闭区", icon: "seal1" },
            { label: "封控区", icon: "seal2" },
            { label: "防控区", icon: "seal3" },
            { label: "健康管理区", icon: "seal4" }
          ]
        }
      ],

      isGridVisible: false,
      isVillageVisible: false,
      isPartyVisible: false,

      //过滤网格的关键词
      gridKeyword: "",
      gridFilterVisible: false,

      //地址搜索
      locaKeyword: "",
      locaSearchVisible: false,
      locaAutoComplete: null,
      locaAutoList: [],

      //告警图层
      isAlarmLayerVisible: false
    };
  },
  computed: {
    ...mapState("report", ["rightFolder"]),
    gridCount() {
      return this.$store.state.map.matchGridCount;
    },
    // 直播会议权限
    liveAccess() {
      let liveAccess = this.$store.state.authority.methAuthority["hyzb"];
      if (liveAccess) return true;
    }
  },
  watch: {
    isGridVisible(val) {
      if (val) {
        this.isVillageVisible = false;
      }
      this.$emit("gridLayerSwitch", {
        visible: val,
        gridKeyword: this.gridKeyword
      });
    },
    isVillageVisible(val) {
      if (val) {
        this.isGridVisible = false;
      }
      this.$emit("villageLayerSwitch", {
        visible: val
      });
    },
    isPartyVisible(val) {
      this.$emit("partyLayerSwitch", { visible: val });
    },
    isAlarmLayerVisible(val) {
      this.$emit("toggleAlarm", { visible: val });
    },
    locaKeyword(val) {
      if (val == "") {
        this.locaAutoList = [];
        this.$emit("clearLocation");
      } else {
        this.searchLocation();
      }
    }
  },
  mounted() {
    document.body.addEventListener("click", this.hideOtherLayer);
    this.initLocationSearch();
    this.curMapIndex = this.isGz2000 ? 0 : 2;

    if (this.isGz2000) {
      this.mapList = [
        {
          id: "gz2000",
          label: "GZ2000"
        },
        {
          id: "gdmap",
          label: "高德地图"
        }
      ];
    } else {
      this.mapList = WMTS_Layers.map(v => {
        return {
          id: v.id,
          label: v.title
        };
      }).concat({
        id: "gz2000",
        label: "GZ2000"
      });
    }
  },
  methods: {
    //初始化高德地址编码
    async initLocationSearch() {
      var t = this;
      var AMap = await AMapLoader.load({
        key: "96c44e4b9d6a4bb04b520127932bdf0e",
        plugins: ["AMap.AutoComplete", "AMap.HeatMap"],
        version: "2.0"
      });

      AMap.plugin("AMap.AutoComplete", function() {
        t.locaAutoComplete = new AMap.AutoComplete({ city: "广州" });
      });
    },

    //根据关键词返回最多5个匹配地址
    searchLocation: throttle(async function() {
      // 搜索

      if (this.isGz2000) {
        const searchApi = await import("@/api/mapData.js");
        const { gz2000SearchLocation } = searchApi;
        const res = await gz2000SearchLocation(this.locaKeyword);
        // console.log('查找结果',res)
        this.locaAutoList = res.map(v => {
          // const lngLat = [v.location.x,v.location.y]
          const lngLat = new Point({
            x: v.location.x,
            y: v.location.y,
            spatialReference: GZ2000
          });
          v.location;
          lngLat.spatialReference = GZ2000;
          // lngLat.

          return {
            label: v.address,
            lngLat
          };
        });
        return;
      }
      this.locaAutoComplete.search(this.locaKeyword, (status, result) => {
        if (status == "complete") {
          let arr = result.tips.splice(0, 5).map(v => {
            const { lng, lat } = v.location;
            return {
              label: v.name,
              lngLat: [lng, lat]
            };
          });

          this.locaAutoList = arr;
          console.log("this.locaAutoList", this.locaAutoList);
          return;
        }

        this.locaAutoList = [];
      });
    }, 1000),

    gotoLocation(item) {
      this.$emit("gotoLocation", item);
    },

    gridFilter: throttle(function() {
      this.$emit("gridLayerFilter", { gridKeyword: this.gridKeyword });
    }, 1000),
    toggleLegend() {
      this.isLegendVisible = !this.isLegendVisible;
    },
    toggleMapList() {
      this.isMapListVisible = !this.isMapListVisible;
    },
    switchMap(index) {
      if (this.isGz2000) {
        if (index === 1) {
          location.href = "index.html#/big/gd";
        }
        return;
      }
      if (this.mapList[index].id === "gz2000") {
        location.href = "big.html#/gz2000";
        return;
      }
      this.curMapIndex = index;
      this.isMapListVisible = false;
      this.$emit("bgMapChange", this.mapList[index]);
    },
    hideOtherLayer() {
      //如果点击位置不在当前组件内，则折叠所有菜单
      if (this.$el.contains(event.target)) {
        return;
      }
      this.isMapListVisible = false;
      this.isLegendVisible = false;
    },
    togglePartyLayer() {
      this.isPartyVisible = !this.isPartyVisible;
    },
    toggleAlarm() {
      this.isAlarmLayerVisible = !this.isAlarmLayerVisible;
    },
    toggleLocation() {
      this.locaSearchVisible = !this.locaSearchVisible;
    }
  }
};
</script>

<style lang="scss" type="text/scss">
.map-legend {
  position: absolute;
  top: 80px;
  right: 440px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  transition: ease-in-out 0.4s;
  &.fr {
    right: 20px;
  }
  .danghui {
    height: 76px;
    text-align: center;
    cursor: pointer;
    img {
      width: 40px;
      margin-bottom: 5px;
    }
  }

  &-box {
    position: absolute;
    top: 0px;
    right: 130px;
    width: 400px;
    max-height: 600px;
    overflow: auto;
    box-sizing: border-box;
    border: 16px solid transparent;
    border-image: url("~@/assets/image/dialog-bg.png") 16;

    dl {
      background-color: rgba(32, 50, 111, 0.95);
      min-height: 50px;
    }
    dt {
      position: relative;
      display: block;
      padding: 12px 16px 4px;
      color: #fff;

      &:after {
        position: absolute;
        top: 12px;
        left: 0;
        content: "";
        height: 16px;
        width: 3px;
        font-size: 0;
        background-color: #345ef0;
      }
    }
    dd {
      position: relative;
      display: inline-block;
      padding: 14px 0px 14px 30px;
      color: #fff;
      width: 50%;
      min-height: 46px;
      box-sizing: border-box;
      font-size: 12px;
      vertical-align: top;

      &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 90%;
        border-bottom: 1px solid #35467b;
      }

      img {
        position: absolute;
        top: 10px;
        left: 0;
        width: 24px;
      }
    }
  }

  &-item {
    position: relative;
    width: 116px;
    height: 34px;
    margin-bottom: 10px;
    padding: 6px 6px;
    box-sizing: border-box;
    text-align: left;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(180deg, #0f2560 0%, #1c49b8 100%);
    box-shadow: 0px 0px 5px 0px #11245e, inset 0px 0px 5px 0px #2b5ff6;
    border: 1px solid #2b5ff6;

    img {
      vertical-align: middle;
    }
    p {
      color: #fff;
    }

    .el-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }

    &.cursor {
      cursor: pointer;
    }

    &.search-box {
      width: 220px;
      min-height: 50px;
      height: auto;
      text-align: left;
      cursor: default;

      input {
        outline: none;
        border: 0 none;
      }
      p {
        padding: 0.5em 0;
      }
    }
    .match-list {
      &-item {
        position: relative;
        padding: 0.5em;
        border-bottom: 1px dashed #b3caff;
        cursor: pointer;

        &:hover {
          background-color: rgba(64, 158, 255, 0.3);
        }

        &:last-child {
          border-bottom: 0 none;
        }
      }
    }
  }

  .map-list-box {
    margin: 0 0 1em;
    min-width: 116px;
    background: linear-gradient(180deg, #0f2560 0%, #1c49b8 100%);

    li {
      padding: 10px;
      color: #fff;
      cursor: pointer;

      &.active,
      &:hover {
        background-color: #2b5ff6;
      }
    }
  }
}
</style>
