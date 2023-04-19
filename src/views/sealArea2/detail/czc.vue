<!-- 城中村统计数据 -->
<template>
  <folder-box title="城中村治理">
    <div
      class="c-sealarea-detail-count"
      v-loading="loadingCzc"
      element-loading-text="加载数据中"
      element-loading-custom-class="loading-mask"
    >
      <div class="c-sealarea-detail-count__col__3">
        <div>
          <count-card
            v-for="item in czcData"
            :key="item.key"
            :itemName="item.key"
            :num="item.value"
            column="col-3"
            :unit="item.unit"
            class="c-sealarea-detail-item__clickable"
            @click.native="checkCzc(item.key, item.type)"
          ></count-card>
        </div>
      </div>
    </div>
  </folder-box>
</template>
<script>
import yqfkArcgisUrls from "../yqfkArcgisUrls.js";
import axios from "axios";
import moment from "moment";
export default {
  name: "czc-detail",
  props: ["areaAttribute"],
  components: {
    CountCard: () => import("@/components/charts/CountCard"),
    FolderBox: () => import("@/components/common/FolderBox"),
  },
  data() {
    return {
      loadingCzc: false,
      czcData: {
        csbjCount: {
          value: 0,
          key: "城市部件",
          unit: "",
          type: "csbj",
          chartData: {
            id: 7713038,
            title: "城中村治理统计",
            itemType: "PIE",
            panelItemData: {
              data: null,
              optionData: {
                title: {
                  text: "城市部件类型统计",
                },
                series: [
                  {
                    data: [],
                    type: "pie",
                  },
                ],
                updateTime: "2022-11-03 15:39:30",
              },
              updateTime: "2022-11-03 15:39:30",
            },
            optionData: "",
            code: "cityVillageManageLx",
            source: "城规院",
            updateTime: "2022-11-03 15:39:30",
          },
        },
        gfssCount: {
          value: 0,
          key: "公服设施",
          unit: "",
          type: "gfss",
          chartData: {
            id: 7713038,
            title: "城中村治理统计",
            itemType: "PIE",
            panelItemData: {
              data: null,
              optionData: {
                title: {
                  text: "城中村治理统计",
                },
                series: [
                  {
                    data: [],
                    type: "pie",
                  },
                ],
                updateTime: "2022-11-03 15:39:30",
              },
              updateTime: "2022-11-03 15:39:30",
            },
            optionData: "",
            code: "cityVillageManageLx",
            source: "城规院",
            updateTime: "2022-11-03 15:39:30",
          },
        },
        zdcsCount: {
          value: 0,
          key: "重点场所",
          unit: "",
          type: "zdcs",
          chartData: {
            id: 7713038,
            title: "城中村治理统计",
            itemType: "PIE",
            panelItemData: {
              data: null,
              optionData: {
                title: {
                  text: "城中村治理统计",
                },
                series: [
                  {
                    data: [],
                    type: "pie",
                  },
                ],
                updateTime: "2022-11-03 15:39:30",
              },
              updateTime: "2022-11-03 15:39:30",
            },
            optionData: "",
            code: "cityVillageManageLx",
            source: "城规院",
            updateTime: "2022-11-03 15:39:30",
          },
        },
      },
    };
  },
  mounted() {
    this.cityVillageManageTotal();
  },
  methods: {
    async cityVillageManageTotal() {
      //   const areaId = this.areaAttribute.id;
      // 获取城中村设施数据
      //   console.log("获取城中村设施数据", this.areaAttribute, areaId);
      this.loadingCzc = true;
      // 修改成直接在地图上查找数据
      const geometry = this.areaAttribute.target.graphic.geometry;
      const data = new FormData();
      data.append("geometry", JSON.stringify(geometry));
      data.append("geometryType", "esriGeometryPolygon");
      data.append("spatialRel", "esriSpatialRelIntersects");
      data.append("returnGeometry", true);
      data.append("returnTrueCurves", false);
      data.append("outFields", "MC,LX");
      data.append("f", "pjson");
      //   重点场所
      const czczdcsData = await axios.post(
        `${yqfkArcgisUrls.CZCZDCS}/0/query`,
        data
      );
      this.czcData.zdcsCount.value = czczdcsData.data.features.length;
      const zdcsChartData = {};
      czczdcsData.data.features.forEach((v) => {
        const key = v.attributes.LX;
        if (!zdcsChartData[key]) {
          zdcsChartData[key] = 0;
        }
        zdcsChartData[key]++;
      });
      this.czcData.zdcsCount.chartData.panelItemData.optionData.series[0].data =
        [];
      for (let i in zdcsChartData) {
        this.czcData.zdcsCount.chartData.panelItemData.optionData.series[0].data.push(
          {
            name: i,
            value: zdcsChartData[i],
          }
        );
      }
      this.czcData.zdcsCount.chartData.updateTime = moment().format(
        "YYYY-MM-DD HH:mm:ss"
      );

      //   公服设施
      const GGFWSSData = await axios.post(
        `${yqfkArcgisUrls.GGFWSS}/0/query`,
        data
      );
      this.czcData.gfssCount.value = GGFWSSData.data.features.length;
      const gfssChartData = {};
      GGFWSSData.data.features.forEach((v) => {
        const key = v.attributes.LX;
        if (!gfssChartData[key]) {
          gfssChartData[key] = 0;
        }
        gfssChartData[key]++;
      });
      this.czcData.gfssCount.chartData.panelItemData.optionData.series[0].data =
        [];
      for (let i in gfssChartData) {
        this.czcData.gfssCount.chartData.panelItemData.optionData.series[0].data.push(
          {
            name: i,
            value: gfssChartData[i],
          }
        );
      }
      this.czcData.gfssCount.chartData.updateTime = moment().format(
        "YYYY-MM-DD HH:mm:ss"
      );

      //   城市部件
      let SZGYSSsData = []
      const list = await axios.get(yqfkArcgisUrls.CSBJList);
      const listData = list.data.services;
      data.delete('outFields')
      for (let i in listData) {
        const url = `${yqfkArcgisUrls.baseUrl}/${listData[i].name}/MapServer/0/query`;
        const res = await axios.post(url, data);
        // console.log("城市部件", res,url);
        SZGYSSsData=SZGYSSsData.concat(res.data.features.map(v=>{
            v.attributes.LX = listData[i].name.replace('城市部件/','')
            return v
        }))
      }

      this.czcData.csbjCount.value = SZGYSSsData.length;
      const csbjChartData = {};
    //   console.log('SZGYSSsData',SZGYSSsData)
      SZGYSSsData.forEach((v) => {
        const key = v.attributes.LX;
        if (!csbjChartData[key]) {
          csbjChartData[key] = 0;
        }
        csbjChartData[key]++;
      });
      this.czcData.csbjCount.chartData.panelItemData.optionData.series[0].data =
        [];
      for (let i in csbjChartData) {
        this.czcData.csbjCount.chartData.panelItemData.optionData.series[0].data.push(
          {
            name: i,
            value: csbjChartData[i],
          }
        );
      }
      this.czcData.csbjCount.chartData.updateTime = moment().format(
        "YYYY-MM-DD HH:mm:ss"
      );

      this.loadingCzc = false;
    },
    checkCzc(name, key) {
      const dialogProp = {
        tag: name,
        areaId: this.areaAttribute.id,
        originTag: name,
        type: key,
        data: this.czcData[key + "Count"].chartData,
      };
      const dialogType = "czcDetail";
      this.$emit("showDialog", dialogProp, dialogType);
    },
  },
};
</script>
