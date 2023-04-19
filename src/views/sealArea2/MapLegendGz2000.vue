<template>
  <div class="map-legend">
    <!--图层切换-->
    <!-- <div class="map-legend-item cursor" @click="toggleMapList"  v-if="mapList[curMapIndex]">
      {{mapList[curMapIndex].label}} <i class="el-icon el-icon-arrow-down"></i>
    </div>
    <div class="map-list-box" v-show="isMapListVisible">
      <ul >
        <li v-for="(item,index) in mapList" :key="index" :class="{'active':index == curMapIndex}" @click="switchMap(index)">{{item.label}}</li>
      </ul>
    </div> -->



    <!--图例-->

    <div :class="['map-legend-item','right-legend', 'cursor', { 'active-legend': isLayerTypeVisible['tl'] }]" @click="toggleLegend"
      v-if="hasLegend">
      <!-- <img src="../../assets/image/sealArea/icon-legend.svg" alt="" /> -->
      <svg-icon :name="`icon-${icons[0]}`" class="custom-icon"></svg-icon>
      <span>图例</span>
    </div>

    <template v-for="(group, index) in layerTypes">
      <div :class="['map-legend-item','right-legend', 'cursor', { 'active': isLayerTypeVisible[group.type] }]"
        @click="toggleLayerType(group.type, index)" :key="group.group + 'item'">
        <svg-icon :name="`icon-${icons[index+1]}`" class="custom-icon"></svg-icon>
        <span>{{ group.group }} </span>
      </div>
      <div class="map-legend-box" ref="mapbox" v-show="isLayerTypeVisible[group.type]" :key="group.group + 'box'">
        <div class="top-line">
        </div>
        <ul>
          <li @click="checkLayerType(item)" class="cursor" v-for="(item, index) in group.layers" :key="index">
            <div :class="[{ 'checked': item.active }, 'checkbox']">
              <img :src="require(`../../assets/image/sealArea/${item.value}.png`)" alt="">
            </div>
            <span>{{ item.label }}</span>
          </li>
        </ul>
        <div class="bottom-line">
        </div>
      </div>
    </template>

    <div class="map-legend-item" v-if="hasGrid">
      网格
      <el-switch v-model="isGridVisible" active-color="#13ce66"></el-switch>
      <i class="el-icon el-icon-arrow-down" @click="gridFilterVisible = !gridFilterVisible"></i>
    </div>
    <div class="map-legend-item search-box" v-show="gridFilterVisible">
      <p>
        <el-input placeholder="请输入网格名称关键词" v-model="gridKeyword" size="mini" :disabled="!isGridVisible"
          style="width: 150px" @change="gridFilter" @clear="gridFilter" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 6px" @click="gridFilter"
          :disabled="!isGridVisible"></el-button>
      </p>
      <p>
        <span>匹配到{{ gridCount }}个网格</span>
      </p>
    </div>

    <!-- <div class="map-legend-item cursor" @click="toggleLocation">
      搜索地址 <i class="el-icon el-icon-arrow-down"></i>
    </div> -->
    <div class="map-legend-item search-box" v-show="locaSearchVisible">
      <el-input placeholder="请输入地址" v-model="locaKeyword" size="mini" clearable style="width: 150px"></el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 6px" @click="searchLocation">
      </el-button>
      <div class="match-list">
        <div class="match-list-item" v-for="(item, index) in locaAutoList" :key="index" @click="gotoLocation(item)">
          {{ item.label }}
        </div>
      </div>
    </div>

    <!-- 图例弹窗 -->
    <div class="map-legend-box" v-show="isLayerTypeVisible['tl']" style="
        width: 400px;
        max-height: 600px;
        position: absolute;
        right: 130px;
        top: 0;
        overflow: auto;
      ">
      <dl v-for="item in legendData" :key="item.title">
        <dt>{{ item.title }}</dt>
        <dd v-for="(v, index) in item.list" :key="index">
          <img :src="
            item.title === '其他'
              ? `./static/mapIcon/${v.icon}.svg`
              : `./static/gz2000mapIcon/${v.icon}.png`
          " />
          <span>{{ v.label }}</span>
        </dd>
      </dl>
    </div>

    <!-- 管理区类型 -->
    <div :class="['map-legend-item','right-legend', 'cursor', { 'active': isLayerTypeVisible['glqlx'] }]" @click="toggleAreaType">
      <svg-icon name="icon-manager" class="custom-icon"></svg-icon>
      <span>管理区类型</span>
    </div>
    <div class="map-legend-box" style="top: 480px" v-show="isLayerTypeVisible['glqlx']">
      <div class="top-line">
      </div>

      <ul>
        <li @click="checkAreaType(index)" class="cursor" v-for="(item, index) in areaTypes" :key="index">
          <div :class="[{ 'checked': item.active }, 'checkbox']">
            <img :src="require(`../../assets/image/sealArea/${item.value}.png`)" alt="">
          </div>
          <span>{{ item.label }}</span>
        </li>
      </ul>

      <div class="bottom-line">
      </div>
    </div>
  </div>
</template>

<script>
import { throttle } from "@/utils/common";
import AMapLoader from "@amap/amap-jsapi-loader";
import { WMTS_Layers } from "@/config/WMTS";

export default {
  name: "MapLegend",
  components: {
  },
  props: {
    hasLegend: {
      type: Boolean,
      default: true,
    },
    hasGrid: {
      type: Boolean,
      default: true,
    },
    filterIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      //底图列表
      mapList: [],
      curMapIndex: 2,
      //图例源数据
      legendData: [
        {
          title: "公共服务设施",
          list: [
            { label: "综合服务中心", icon: "zhfwzx" },
            { label: "老人活动中心", icon: "lrhdzx" },
            { label: "社区卫生站", icon: "sqwsz" },
            { label: "基层党支部", icon: "jcdzb" },
            { label: "党员志愿者", icon: "dyzyz" },
            { label: "公交车站", icon: "gjcz" },
            { label: "物流点", icon: "wld" },
            { label: "市场", icon: "sc" },
            { label: "警务室", icon: "jws" },
            { label: "学校", icon: "xx" },
          ],
        },
        {
          title: "市政设施（城市部件）",
          list: [
            { label: "公共厕所", icon: "ggcs" },
            { label: "供电井盖", icon: "gdjg" },
            { label: "垃圾收集点", icon: "ljsjd" },
            { label: "市政消火栓", icon: "szxhx" },
            { label: "微型消防站", icon: "wxxfz" },
            { label: "监控电子眼", icon: "jkdzy" },
            { label: "排水井盖", icon: "psjg" },
            { label: "上水井盖", icon: "ssjg" },
            { label: "积水点", icon: "jsd" },
            { label: "照明设施", icon: "zmss" },
          ],
        },
        {
          title: "重点场所",
          list: [
            { label: "快递服务场所", icon: "kdfwcs" },
            { label: "美容美发店", icon: "mrmfd" },
            { label: "时租日租公寓", icon: "szrzgy" },
            { label: "洗浴推拿场所", icon: "xytncs" },
            { label: "固定烧烤档", icon: "gdskd" },
            { label: "KTV", icon: "KTV" },
            { label: "网吧", icon: "wb" },
            { label: "台球厅", icon: "tqt" },
            { label: "棋牌室", icon: "qps" },
            { label: "邮政", icon: "yz" },
            { label: "再生资源回收店档", icon: "zszyhsdd" },
          ],
        },
        {
          title: "医疗资源",
          list: [
            { label: "医院", icon: "yy" },
            { label: "社区中心", icon: "sqzx" },
          ],
        },
        {
          title: "其他",
          list: [
            { label: "阳性人员", icon: "diagnose-1" },
            // {label:'无症状',icon:'diagnose-0'},
            { label: "家", icon: "home-1" },
            // {label:'家-无症状',icon:'home-0'},
            { label: "场所", icon: "place-1" },
            // {label:'场所-无症状',icon:'place-0'},
          ],
        },
      ],
      //管理区类型
      areaTypes: [
        { label: "高风险区", value: "seal", active: true },
        // { label: "中风险区", value: "manage", active: false },
        { label: "低风险区", value: "prevention", active: true },
        { label: "管控网格", value: "managewga", active: false },
        { label: "识别区域", value: "managewgb", active: false },
      ],
      // 图层切换开关图层列表
      layerTypes: [
        {
          group: "基础图层",
          layers: [
            { label: "镇街", value: "street-gz2000", active: false },
            { label: "村居", value: "village-gz2000", active: false },
            // { label: "网格", value: "grid-gz2000", active: false },
            // { label: "小区", value: "houseEstate-gz2000", active: false },
            // { label: "小区内楼宇", value: "building-gz2000", active: false },
            // { label: "河流", value: "rivers-gz2000", active: false },
            // { label: "路网河流", value: "road-gz2000", active: false },
            { label: "村界底图", value: "gz-cj", active: false },
            { label: "网格底图", value: "gz-wg", active: false },

            { label: "路网图层", value: "gz-yq", active: false },
            { label: "房屋图层", value: "gz-fw", active: false },
            { label: "房屋人口图层", value: "gz-fwp", active: false },
            { label: "党员志愿者", value: "gz-dyzyzfw", active: false },
            { label: "特殊人群", value: "tsrq", active: false },
            { label: "金洲三维视图", value: "jinzhou-gz2000", active: false },
            // { label: "金洲村三维地图点", value: "gz-jzcswdt", active: false },
            { label: "金洲村三维地图点", value: "jinzhou-UAV", active: false },
          ],
          type: "base",
        },
        {
          group: "疫情图层",
          layers: [
            { label: "疑似病例", value: "dispatch-person", active: true },
            { label: "重点场所", value: "diagnose-place", active: true },
            // {label: '消防设施', value: 'gz-xfss', active: true},

            { label: "风险人员轨迹", value: "person-locus", active: false },
            { label: "扫码记录", value: "scan-record", active: false },
            { label: "疑似病例热力图", value: "diagnose-heatmap", active: false },
          ],
          type: "yq",
        },
        {
          group: "城中村治理",
          layers: [
            { label: "城中村公共服务设施", value: "gz-ggfwss", active: false },
            // { label: "城中村市政公用设施", value: "gz-szgyss", active: true },
            { label: "城中村重点场所", value: "gz-czczdcs", active: false },
            { label: "城中村商铺", value: "gz-czcsp", active: false },
          ],
          type: "czc",
        },
        {
          group: "市政设施",
          layers: [
            { label: "上水井盖", value: "city-ssjg", active: false },
            { label: "供电井盖", value: "city-gdjg", active: false },
            { label: "公共厕所", value: "city-ggcs", active: false },
            { label: "垃圾收集点", value: "city-ljsjd", active: false },
            { label: "市政消火栓", value: "city-szxhx", active: false },
            { label: "微型消防站", value: "city-wxxfz", active: false },
            { label: "排水井盖", value: "city-psjg", active: false },
            { label: "照明设施", value: "city-zmss", active: false },
            { label: "监控电子眼", value: "city-jkdzy", active: false },
            { label: "积水点", value: "city-jsd", active: false },
          ],
          type: "szss",
        },
        {
          group: "医疗资源",
          layers: [
            { label: "医院卫生中心", value: "yywszx", active: false },
          ],
          type: "ylzy",
        },
      ],
      // 控制图层切换开关的显示和隐藏
      isLayerTypeVisible: {
        tl: false,
        base: false,
        yq: false,
        czc: false,
        szss: false,
        glqlx: false,
        ylzy: false
      }, //图层开关开关

      // 图标名
      icons: ['tl','base','yq','czczl','szss','ylzy'],

      isGridVisible: false,
      isPartyVisible: false,

      //过滤网格的关键词
      gridKeyword: "",
      gridFilterVisible: false,

      //地址搜索
      locaKeyword: "",
      locaSearchVisible: false,
      locaAutoComplete: null,
      locaAutoList: [],
    };
  },
  computed: {
    gridCount() {
      return this.$store.state.map.matchGridCount;
    },
  },
  watch: {
    filterIds(val) {
      //过滤需要单选
      if (val) {
        this.layerTypes[0].layers.map((v) => {
          if (val.includes(v.value)) {
            v.active = false;
          }
        });

      }
    },
    isGridVisible(val) {
      this.$emit("gridLayerSwitch", {
        visible: val,
        gridKeyword: this.gridKeyword,
      });
    },
    locaKeyword(val) {
      if (val == "") {
        this.locaAutoList = [];
        this.$emit("clearLocation");
      } else {
        this.searchLocation();
      }
    },
  },
  mounted() {
    document.body.addEventListener("click", this.hideOtherLayer);
    this.initLocationSearch();

    this.mapList = WMTS_Layers.map((v) => {
      return {
        id: v.id,
        label: v.title,
      };
    });
    this.$store.commit("common/SET_GZ2000LAYERS", this.layerTypes);
    // setTimeout(()=>{
    //   let data =[
    //     {
    //       "label": "高风险区",
    //       "value": "seal",
    //       "active": true
    //     },
    //     {
    //       "label": "低风险区",
    //       "value": "prevention",
    //       "active": true
    //     }
    //   ]
    //   this.$emit("changeAreaType", { data });
    // },5000)
  },
  methods: {
    // 改变map-legend-box的位置
    changePosition(index) {
      // 获取map-legend-box
      const box = this.$refs.mapbox;
      let top = 0;
      if (index <= 1) {
        top = (index + 1) * 94;
      } else if (index == 2) {
        top = 185;
      } else if (index == 4) {
        top = 435;
      } else {
        top = 94;
      }
      box[index].style.top = top + "px";
    },
    //初始化高德地址编码
    async initLocationSearch() {
      var t = this;
      var AMap = await AMapLoader.load({
        key: "96c44e4b9d6a4bb04b520127932bdf0e",
        plugins: ["AMap.AutoComplete", "AMap.HeatMap"],
        version: "2.0",
      });

      AMap.plugin("AMap.AutoComplete", function () {
        t.locaAutoComplete = new AMap.AutoComplete({ city: "广州" });
      });
    },

    //根据关键词返回最多5个匹配地址
    searchLocation: throttle(function () {
      this.locaAutoComplete.search(this.locaKeyword, (status, result) => {
        if (status == "complete") {
          let arr = result.tips.splice(0, 5).map((v) => {
            const { lng, lat } = v.location;
            return {
              label: v.name,
              lngLat: [lng, lat],
            };
          });

          this.locaAutoList = arr;
        } else {
          this.locaAutoList = [];
        }
      });
    }, 1000),

    gotoLocation(item) {
      this.$emit("gotoLocation", item);
    },

    gridFilter: throttle(function () {
      this.$emit("gridLayerFilter", { gridKeyword: this.gridKeyword });
    }, 1000),
    toggleLegend() {
      this.isLayerTypeVisible['tl'] = !this.isLayerTypeVisible['tl'];
      this.isOpenLayer('tl');
    },
    toggleAreaType() {
      this.isLayerTypeVisible['glqlx'] = !this.isLayerTypeVisible['glqlx'];
      this.isOpenLayer('glqlx');
    },
    toggleLayerType(type, index) {
      this.isLayerTypeVisible[type] = !this.isLayerTypeVisible[type];
      this.isOpenLayer(type);

      // 改变位置
      this.changePosition(index);
    },
    checkAreaType(index) {
      this.areaTypes[index].active = !this.areaTypes[index].active;
      this.$emit("changeAreaType", {
        data: this.areaTypes.filter((v) => {
          return v.active;
        }),
      });
    },

    checkLayerType(item) {
      item.active = !item.active;
      this.$emit("layerSwitch", item);
    },
    // switchMap(index){
    //   // this.$refs["baseMapLayer"].toggleOneLayer("grid", visible);
    //   this.$emit('layerSwitch',false)
    //   // this.curMapIndex = index
    //   // this.isMapListVisible = false
    //   // this.$emit('bgMapChange', this.mapList[index])
    // },
    hideOtherLayer() {
      //如果点击位置不在当前组件内，则折叠所有菜单
      if (this.$el.contains(event.target)) {
        return;
      }
      this.isOpenLayer();
    },
    toggleLocation() {
      this.locaSearchVisible = !this.locaSearchVisible;
    },
    isOpenLayer(type = 'closeAll') {
      for (let i in this.isLayerTypeVisible) {
        if (i !== type) {
          this.isLayerTypeVisible[i] = false;
        }
      }
    }
  },
};
</script>

<style lang="scss" type="text/scss">
.map-legend {
  position: absolute;
  top: 80px;
  right: 21px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  &-box {
    position: absolute;
    width: 387px;
    top: 100px;
    right: 100px;
    // min-width: 11.4em;
    // max-height: 28.6em;
    margin-bottom: 0.5em;
    // overflow-y: auto;
    box-sizing: border-box;
    border-radius: 4px;
    background: rgba(21, 95, 194, .6);
    margin-right: 10px;


    .top-line,
    .bottom-line {
      width: 100%;
      height: 27px;
    }

    .top-line {
      background: url(~@/assets/image/sealArea/top-line.png) no-repeat;
      background-position-y: -13px;
    }

    .bottom-line {
      background: url(~@/assets/image/sealArea/bottom-line.png) no-repeat;
      background-position-y: 13px;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      min-height: 92px;
      color: #fff;
      min-width: 11.4em;
      max-height: calc(100vh - 250px);
      overflow-y: auto;


      li {
        position: relative;
        padding: 4px 0;
        text-align: center;
        padding: 26px 11px 6px 33px;

        span {
          // 文字超出width:76px时自动换行
          display: inline-block;
          width: 76px;
          margin-top: 8px;
        }

        .checkbox {
          width: 42px;
          height: 42px;
          margin: 0 auto;
          border-radius: 4px;
          background-color: #fff;
          overflow: hidden;
        }

        .checked {
          background-image: url('~@/assets/image/sealArea/checked.png');
        }
      }

      img {
        vertical-align: middle;
        padding: 9px;
      }

      b {
        display: inline-block;
        width: 14px;
        height: 14px;
      }

      .cursor {
        cursor: pointer;
      }
    }

    dl {
      background-color: rgba(32, 50, 111, 0.95);
      min-height: 50px;

      dt {
        position: relative;
        display: block;
        padding: 16px 16px 4px;
        color: #fff;

        &:after {
          position: absolute;
          top: 16px;
          left: 4px;
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
        padding: 14px 0px 14px 40px;
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
          left: 8px;
          width: 24px;
        }
      }
    }
  }

  &-item {
    position: relative;
    width: 116px;
    height: 34px;
    margin-bottom: 10px;
    text-align: left;
    color: #fff;
    font-size: 14px;
    box-sizing: border-box;
    color: #fff;
    font-size: 14px;
    font-weight: 500;

    .custom-icon {
      vertical-align: middle;
      padding: 26px 40px 4px 40px;
      font-size: 24px;
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
      padding: 6px 6px;
      text-align: left;
      cursor: default;
      background: linear-gradient(180deg, #0f2560 0%, #1c49b8 100%);
      box-shadow: 0px 0px 5px 0px #11245e, inset 0px 0px 5px 0px #2b5ff6;
      border: 1px solid #2b5ff6;

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
  .right-legend {
    width: 104px;
    height: 104px;
    margin-bottom: -10px;
    border: none;
    background: url('~@/assets/image/sealArea/primary-circle.png') no-repeat;
    box-sizing: border-box;
    text-align: center;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    padding: 0;
  }

  .active-legend {
    background: url('~@/assets/image/sealArea/white-circle.png') no-repeat;
    color: #666666;

    .custom-icon {
      color: rgb(0, 91, 212);
    }

  }

  .active {
    background: url('~@/assets/image/sealArea/white-circle.png') no-repeat;
    color: #666666;
    .custom-icon {
      color: rgb(0, 91, 212);
    }
    // 三角形
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      top: 40px;
      left: -15px;
      width: 0;
      height: 0;
      border: 8px solid rgba(21, 95, 194, .6);
      border-top: 8px solid transparent;
      border-left: 8px solid transparent;
      transform: rotate(-45deg);
    }

    img {
      // 改变图标
      filter: drop-shadow(0 0 0 rgb(0, 91, 212));
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
