<template>
  <div class="layer-search">
    <div class="map-legend-item search-box">
      <el-select
        v-model="currDrawType"
        placeholder="图层"
        class="type-select"
        size="mini"
      >
        <el-option
          v-for="item in drawTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        placeholder="请输入地址搜索"
        class="search-box-input"
        v-model="searchText"
        size="mini"
        clearable
        @clear="clearLocation"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        style="margin-left: 5px"
        @click="searchLocation"
      ></el-button>
      <div class="match-list" style="max-height:300px;overflow:auto;">
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

    <div class="map-legend-item search-box" v-if="selectAreas.length">
      <div class="selected">已选区域</div>

      <div class="match-list" style="max-height:300px;overflow:auto;">
        <div
          class="match-list-item select-list"
          v-for="(item, index) in selectAreas"
          :key="'selectAreas' + index"
        >
          <div>[{{ item.typeName }}]{{ item.label }}</div>
          <el-button type="text" @click="delArea(item)" size="mini"
            ><i class="el-icon-error" style="color: #fff; font-size: 16px"
          /></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import yqfkArcgisUrls from "./yqfkArcgisUrls";
import Point from "@arcgis/core/geometry/Point";
import { GZ2000 } from "@/config/WMTS";
import { streetGz2000, villageGz2000 } from "@/api/gz2000Json";
import * as TURF from "@turf/turf";

export default {
  name: "layerSearch",
  data() {
    return {
      drawTypeList: [
        { label: "镇街", value: "ZJ" },
        { label: "村居", value: "CJ" },
        { label: "网格", value: "WG" },
        { label: "小区范围", value: "NSQXQ" },
        { label: "基础路网", value: "JCLW" },
        { label: "河流水系", value: "HL" }
      ],
      currDrawType: null, // 划设类型
      //地址搜索
      searchText: "",
      locaAutoList: [],
      //   currAreaData: {
      //     type: null,
      //     rings: [],
      //   },
      selectAreas: [] //已选择的区域
    };
  },
  //   mounted(){
  //     console.log('layerSearch')
  //   },
  //   beforeDestroy(){
  //     console.log('layerSearch beforeDestroy')
  //   },
  methods: {
    async searchLocation() {
      if (!this.currDrawType) return this.$message.error("请选择划设类型");
      if (!this.searchText) return this.$message.error("请输入地址搜索");
      if (this.currDrawType === "ZJ") {
        // 镇街搜索
        const res = await streetGz2000();
        const results = res.features
          .filter(v => v.attributes["镇名"].includes(this.searchText))
          .map(v => {
            return {
              label: v.attributes["镇名"],
              rings: v.geometry.rings
            };
          });
        // console.log('搜索',this.searchText,res,results)
        return (this.locaAutoList = results);
      }
      if (this.currDrawType === "CJ") {
        // 村居搜索
        const res = await villageGz2000();
        // console.log("搜索", this.searchText, res);

        const results = res.features
          .filter(v => v.attributes["名字"].includes(this.searchText))
          .map(v => {
            return {
              label: v.attributes["名字"],
              rings: v.geometry.rings
            };
          });
        return (this.locaAutoList = results);
      }

      let params = {
        searchText: this.searchText,
        layers: 0,
        f: "pjson"
      };
      let data = new FormData();
      for (let i in params) {
        data.append(i, params[i]);
      }
      axios
        .post(`${yqfkArcgisUrls[`${this.currDrawType}`]}/find`, data)
        .then(res => {
          //   console.log("搜索图层结果", res.data.results);
          this.locaAutoList = res.data.results.splice(0, 5).map(v => {
            return {
              label: v.attributes.name || v.value,
              rings: v.geometry.rings || v.geometry.paths,
              id: v.attributes.FID
            };
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    clearLocation() {
      this.searchText = null;
      this.locaAutoList = [];
      this.selectAreas = this.$options.data().selectAreas;
    },
    gotoLocation(item, layerType) {
      //   console.log(
      //     item,
      //     this.drawTypeList,
      //     this.currDrawType,
      //     this.drawTypeList.find(v => v.value === this.currDrawType)
      //   );
      const type = this.drawTypeList.find(v => v.value === this.currDrawType);
      const typeName = type.label;
      const currAreaData = {
        typeName,
        label: item.label,
        id: item.id || item.label,
        type: layerType || this.currDrawType,
        rings: item.rings
      };

      const index = this.selectAreas
        .map(v => v.type + v.id)
        .indexOf(currAreaData.type + currAreaData.id);
      if (index >= 0) {
        this.selectAreas.splice(index, 1);
      } else {
        this.selectAreas.push(currAreaData);
      }

      this.$parent.$refs["baseMapLayer"].clearDrawLayer();
      this.$emit("addArea", this.selectAreas);
    },
    delArea(item) {
      this.gotoLocation(item, item.type);
    },
    async layerClicked({ event }) {
      //   console.log("layer Search layer click", event);
      if (!this.currDrawType) {
        return;
      }
      const mapPoint = [event.mapPoint.x, event.mapPoint.y];
      //镇街和村居使用本地JSON数据获取多边形
      if (this.currDrawType === "ZJ") {
        const res = await streetGz2000();
        const point = TURF.point(mapPoint);
        let data = null;
        res.features.forEach(v => {
          const polygon = TURF.polygon(v.geometry.rings);
          if (TURF.booleanPointInPolygon(point, polygon)) {
            data = v;
          }
        });
        this.gotoLocation({
          label: data.attributes["镇名"],
          rings: data.geometry.rings
        });
      }
      if (this.currDrawType === "CJ") {
        const res = await villageGz2000();
        const point = TURF.point(mapPoint);
        let data = null;
        res.features.forEach(v => {
          const polygon = TURF.polygon(v.geometry.rings);
          if (TURF.booleanPointInPolygon(point, polygon)) {
            data = v;
          }
        });
        this.gotoLocation({
          label: data.attributes["名字"],
          rings: data.geometry.rings
        });
      }
      if (this.currDrawType === "WG") {
        let params = {
          geometry: `${mapPoint[0]},${mapPoint[1]}`,
          geometryType: "esriGeometryPoint",
          spatialRel: "esriSpatialRelIntersects",
          outFields: "name,FID",
          f: "pjson"
        };
        let data = new FormData();
        for (let i in params) {
          data.append(i, params[i]);
        }
        const res = await axios.post(
          `${yqfkArcgisUrls[`${this.currDrawType}`]}/0/query`,
          data
        );
        if (!res.data.features.length) {
          return;
        }
        const resData = res.data.features[0];
        this.gotoLocation({
          label: resData.attributes.name,
          rings: resData.geometry.rings,
          id: resData.attributes.FID
        });
      }
      if (this.currDrawType === "NSQXQ") {
        let params = {
          geometry: `${mapPoint[0]},${mapPoint[1]}`,
          geometryType: "esriGeometryPoint",
          spatialRel: "esriSpatialRelIntersects",
          outFields: "名称,FID",
          f: "pjson"
        };
        let data = new FormData();
        for (let i in params) {
          data.append(i, params[i]);
        }
        const res = await axios.post(
          `${yqfkArcgisUrls[`${this.currDrawType}`]}/0/query`,
          data
        );
        if (!res.data.features.length) {
          return;
        }
        const resData = res.data.features[0];
        this.gotoLocation({
          label: resData.attributes["名称"],
          rings: resData.geometry.rings,
          id: resData.attributes.FID
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.layer-search {
  position: absolute;
  left: 3em;
  top: 9em;
}
.search-box {
  width: 300px;
  color: #fff;

  .type-select {
    width: 100px;
  }
  &-input {
    width: 130px;
    margin-top: 5px;
    margin-left: 5px;
  }
}
.select-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
