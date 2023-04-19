<template>
  <div class="map-legend">
    <div class="search-btn" :class="{active:locaSearchVisible}" @click="toggleLocation">
      <img v-show="!locaSearchVisible" src="@/assets/image/search.svg"/>
      <img v-show="locaSearchVisible" src="@/assets/image/search-active.svg"/>
      搜索地址
    </div>
    <div class="search-box" v-show="locaSearchVisible" :class="{active:locaAutoList.length>0}">
      <div style="display: flex;align-items: center;margin: 15px 0 15px 20px">
        <el-input
          size="medium"
          class="search-input"
          prefix-icon="el-icon-search"
          placeholder="请输入地址"
          v-model="locaKeyword"
          clearable
        ></el-input>
        <el-button
          class="btn"
          @click="searchLocation"
        >查找</el-button>
      </div>
      <div class="match-list"
           v-loading="loadingDetail"
           element-loading-text="加载数据中"
           element-loading-custom-class="loading-mask">
        <div
          class="match-list-item"
          v-for="(item, index) in locaAutoList"
          :key="index"
          @click="gotoLocation(item)"
        >
          <img src="@/assets/image/point.svg"/>
          <span v-html="keySign(item.label)"></span>
        </div>
      </div>
      <div class="popper_arrow"></div>
    </div>
  </div>
</template>

<script>
import {debounce, throttle} from "@/utils/common";
import AMapLoader from "@amap/amap-jsapi-loader";
import {WMTS_Layers} from "@/config/WMTS";
import {GZ2000} from "@/config/WMTS";
import Point from "@arcgis/core/geometry/Point";

export default {
  name: "MapLegend",
  components: {},
  inject: ["handleItemChoosed"],
  props: {
    hasAlarmCtrl: {
      type: Boolean,
      default: false,
    },
    hasParty: {
      type: Boolean,
      default: true,
    },
    hasLegend: {
      type: Boolean,
      default: true,
    },
    hasGrid: {
      type: Boolean,
      default: true,
    },
    isGz2000: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //是否显示图例
      isLegendVisible: false,
      //底图列表
      mapList: [],
      curMapIndex: 0,
      isMapListVisible: false,

      //过滤网格的关键词
      gridKeyword: "",
      gridFilterVisible: false,

      //地址搜索
      locaKeyword: "",
      locaSearchVisible: false,
      locaAutoComplete: null,
      locaAutoList: [],
      loadingDetail:false
    };
  },
  watch: {
    locaKeyword(val) {
      if (val == "") {
        this.locaAutoList = [];
        this.$emit("clearLocation");
      } else {
        this.searchLocation();
      }
    },
    locaSearchVisible(val){
      if(!val){
        this.locaKeyword = null
        this.locaAutoList = []
        this.$emit("clearLocation")
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
          label: "GZ2000",
        },
        {
          id: "gdmap",
          label: "高德地图",
        },
      ];
    } else {
      this.mapList = WMTS_Layers.map((v) => {
        return {
          id: v.id,
          label: v.title,
        };
      }).concat({
        id: "gz2000",
        label: "GZ2000",
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
        version: "2.0",
      });

      AMap.plugin("AMap.AutoComplete", function () {
        t.locaAutoComplete = new AMap.AutoComplete({ city: "广州" });
      });
    },

    //根据关键词返回最多5个匹配地址
    searchLocation: throttle(async function () {
      this.loadingDetail = true
      // 搜索
      if (this.isGz2000) {
        const searchApi = await import('@/api/mapData.js')
        const { gz2000SearchLocation } = searchApi
        const res = await gz2000SearchLocation(this.locaKeyword)
        // console.log('查找结果',res)
        this.locaAutoList = res.map(v => {
          // const lngLat = [v.location.x,v.location.y]
          const lngLat = new Point({
            x: v.location.x,
            y: v.location.y,
            spatialReference: GZ2000,
          });
          v.location
          lngLat.spatialReference = GZ2000
          // lngLat.

          return {
            label: v.address,
            lngLat
          }
        })
        return
      }
      this.locaAutoComplete.search(this.locaKeyword, (status, result) => {
        if (status == "complete") {
          let arr = result.tips.splice(0, 10).map((v) => {
            const { lng, lat } = v.location;
            return {
              label: v.name,
              lngLat: [lng, lat],
            };
          });

          this.locaAutoList = arr;
          return
        }

        this.locaAutoList = [];
      });
      setTimeout(() => {
        this.loadingDetail = false
      },800)
    }, 500),
    keySign(title) {
      let s = this.locaKeyword
      let str = title //原文本
      // 去除中间空格且字符之间用逗号隔开
      let inputValue = s.replace(/\ +/g, ',') // 把空格分开的字符串转换成以逗号分割
      let keyWordArr2 = inputValue.split(',') // 把字符串分割转换成数组(方便截取)
      // 判断文本段落(原文本)是否为空
      if (str && str != '') {
        // 遍历分割后的字符串
        keyWordArr2.forEach((e) => {
          let regStr = "" + `(${e})`
          let reg = new RegExp(regStr, "g")
          str = str.replace(
            reg,
            '<span style="color:#FFFF33;">' +
            e +
            "</span>"
          )
        })
      }
      return str
    },
    gotoLocation(item) {
      this.$emit("gotoLocation", item);
    },

    gridFilter: throttle(function () {
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
          location.href = "index.html#/big/index";
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
    toggleLocation() {
      this.locaSearchVisible = !this.locaSearchVisible;
      if (this.locaSearchVisible) {
        this.handleItemChoosed(null,'locaSearchVisible')
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes menu-show {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.map-legend {
  position: absolute;
  left: 426px;
  bottom: 160px;

  .search-btn {
    width: 84px;
    height: 83px;
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: rgba(12, 33, 59, 0.9);
    font-size: 16px;
    color: #82b2ef;
    img{
      margin-bottom:10px;
    }
    &.active{
      background: linear-gradient(-90deg, #08274F, #0D5198, #04344E);
      color: #ffffff;
    }
    &:hover{
      background: linear-gradient(-90deg, #08274F, #0D5198, #04344E);
      color: #ffffff;
      img{
        content: url("~@/assets/image/search-active.svg");
      }
    }

  }

  .search-box {
    width: 317px;
    min-height: 83px;
    height: auto;
    background: rgba(41,75,116,0.9);
    display: flex;
    text-align: left;
    cursor: default;
    flex-direction: column;
    position: absolute;
    left: 95px;
    top: 0;
    animation: menu-show 0.3s;
    transform-origin: left;
    z-index: 20;
    color: #333333;
    &.active{
      min-height: 560px;
      top: -400px;
      .popper_arrow{
        bottom: 108px;
      }
    }
    .search-input {
      width: 210px;
      height: 54px;
    }
    .btn{
      width: 58px;
      height: 54px;
      //line-height: 54px;
      background: #3399CC;
      border: none;
      font-size: 15px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #FFFFFF;
      box-shadow: 0 0;
    }
    ::placeholder {
      color: #8496AC;
      font-size: 18px;
    }
    p {
      padding: 0.5em 0;
    }
    .popper_arrow{
      content: "";
      position: absolute;
      bottom: 32px;
      left: -15px;
      margin-left: -5px;
      border-width: 10px;
      border-style: solid;
      border-color: transparent  rgba(41,75,116,0.9) transparent  transparent;
    }
  }

  .match-list {
    max-height: 470px;
    overflow: auto;
    &-item {
      position: relative;
      cursor: pointer;
      padding:12px 0 12px 20px;
      font-size: 16px;
      font-weight: 400;
      box-sizing: border-box;
      color: #FFFFFF;
      display: flex;
      img{
        width: 19px;
        height: 23px;
        margin-right: 9px;
      }
      &:hover {
        background-color: rgba(64, 158, 255, 0.3);
      }
    }
  }
  ::v-deep.el-input--medium .el-input__inner {
    height: 54px;
    background:#D5E1EF;
    border-radius: 4px;
    box-shadow:0;
    font-size: 18px;
  }
  ::v-deep.el-input__inner{
    color: #333333;
  }
}
</style>
