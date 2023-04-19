<template>
  <div class="lpicker">
    <div ref="container" class="container"></div>

    <div class="tool">
      <el-button  @click="hide">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>

    <div class="brand">
      <!--定位到当前地址-->
      <!-- <div class="am" @click="getPosition">
        <i class="el-icon-aim" />
      </div> -->
      <div class="brand-list">
        <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索地点"
        input-align="center"
        prefix-icon="el-icon-search"
        @input="handleSearchInput"
      ></el-input>
        </div>
      <div v-for="(item, index) in addressList" :key="`address_${index}`" @click="handleChooseItem(item,index)" >
        <template v-if="item.lngLat[0]">
        <div class="search-result" :class="(currAddrIndex == index)?'active':''">
          <i class="el-icon-success checked" v-if="currAddrIndex === index" />
          <div class="title">{{item.name}}</div>
          <div class="desc">{{item.district}}</div>
        </div>
        </template>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initMap, getMap, destroyMap,getGeoLoation } from "./mainMap";
var GeoLocation;

export default {
  name: "LocationPicker",
  props: {
    // 初始坐标
    lngLat: {
      type: Array,
      default: function () {
        return [113.533339, 22.794258];
      },
    },
  },
  model: {
    prop: "visible",
    event: "toggle",
  },
  data() {
    return {
      //地点关键词
      keyword: "",
      // 地图坐标和地址转换实例
      geoInstance: null,
      autocomplete: null,
      // 点标记实例
      marker: null,

      // 匹配到的地址列表
      addressList: [],
      currAddrIndex: 0,
      // 当前位置信息
      currAddress: {
        name: "",
        district: "",
        lngLat: "",
      },
    };
  },
  async mounted() {
    GeoLocation = await getGeoLoation();
      // 定位成功
      AMap.event.addListener(GeoLocation, "complete", (event) => {
        // console.log("GeoLocation complete",event);
        let { position, formattedAddress } = event;
        // this.address = formattedAddress;
        this.lngLat = [position.lng, position.lat];
        this.getAddrFromLngLat(this.lngLat)
      });

      // 定位失败
      AMap.event.addListener(GeoLocation, "error", (error) => {
        console.error(error)
        // Dialog.confirm({
        //     title: "获取定位失败",
        //     message: `获取定位失败,请打开手机的定位功能，并且确保浏览器拥有使用定位权限`,
        //     confirmButtonText: "查看教程",
        //   }).then(() => {
        //     // this.showHelp = true
        //     location.href="http://www.iot-cas.com/yhdglbzsm"
        //   });
      });
      this.init()
  },
  destroyed() {
    destroyMap();
  },
  // watch: {
  //   visible(val) {
  //     if (val && this.geoInstance == null) {
  //       this.init();
  //     }
  //   },
  // },
  methods: {
    async init() {
      await initMap({
        dom: this.$refs["container"],
      });
      getMap().on("complete", () => {
        // 初始化地图坐标和位置转换工具
        AMap.plugin(["AMap.Geocoder", "AMap.Autocomplete"], () => {
          this.geoInstance = new AMap.Geocoder({ city: "广州" });
          this.getAddrFromLngLat(this.lngLat);
          this.autocomplete = new AMap.Autocomplete({
            // city: "广州",
            citylimit: false,
          });
        });
      });
      getMap().on("click", (event) => {
        let pos = event.lnglat;
        this.getAddrFromLngLat([pos.lng, pos.lat]);
        this.keyword = "";
      });
    },

    getContainer() {
      return this.$el;
    },

    getAddrFromLngLat(lngLat) {
      // console.log(lngLat)
      this.geoInstance.getAddress(lngLat, (status, result) => {
        if (status === "complete" && result.regeocode) {
          let { formattedAddress, addressComponent } = result.regeocode;

          this.currAddress = {
            name: formattedAddress,
            district: addressComponent.district,
            lngLat: lngLat,
          };
          this.setCenter(lngLat);
          this.addressList = [this.currAddress];
          this.currAddrIndex = 0;

          //console.log(JSON.stringify(this.currAddress))
        }
      });
    },

    getLngLatFromAddr() {
      this.autocomplete.search(this.keyword, (status, result) => {
        if (status === "complete") {
          let arr = [];

          result.tips.forEach((item) => {
            arr.push({
              name: item.name,
              district: item.district,
              lngLat: [item.location.lng, item.location.lat],
            });
          });

          this.addressList = [].concat([this.currAddress], arr);
          this.currAddrIndex = 0;
        }
      });
    },
    setCenter(lngLat) {
      if (!this.marker) {
        this.marker = new AMap.Marker({
          map: getMap(),
        });
      }
      this.marker.setPosition(lngLat);
      getMap().setZoomAndCenter(14, lngLat);
    },
    handleSearchInput() {
      // console.log('handleSearchInput')
      this.getLngLatFromAddr();
    },

    handleChooseItem(item, index) {
      if (this.currAddrIndex == index) {
        return;
      }
      this.currAddrIndex = index;
      this.currAddress = item;
      this.setCenter(item.lngLat);
    },

    hide() {
      this.$emit("close");
    },
    confirm() {
      // console.log('confirm',this.currAddress)
      this.$emit("choosed", this.currAddress);
      this.hide();
    },
    getPosition(){
      GeoLocation.getCurrentPosition();
    }
  },
};
</script>

<style lang="scss" scoped>
.lpicker {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 100;

  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #cccccc;
  }

  .tool {
    position: absolute;
    top: 1em;
    left: 1em;
    right: 1em;
    min-height: 2em;

    .rb {
      float: right;
    }
  }

  .brand {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    // overflow: visible;
    
    background-color: #fff;
    .search-bar{
      padding: 10px;
      ::v-deep .el-input__inner{
        background-color: #eee;
        border: none;
      }
    }
    .search-result{
      padding: 10px;
      line-height:1.5em;
      position: relative;
      border-bottom: 1px solid #eee;
      .desc{
        font-size: .8em;
        color: #999;
      }
      .checked{
        position: absolute;
        right: 20px;
        top: 1.8em;
        color: #2f89ef;
      }
    }
    .am {
      position: absolute;
      top: -44px;
      left: 10px;
      background-color: #fff;
      padding: 6px;
      display: flex;
      border-radius: 4px;
      cursor: pointer;
    }
    .brand-list{
      max-height: 250px;
      overflow:auto;
    }
  }
}
</style>
