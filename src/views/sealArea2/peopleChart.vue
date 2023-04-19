<!-- 2022-2-17 增加，通过接口同步数据的查看列表 -->
<!-- 导入数据列表窗口 -->
<template>
  <div class="box">
<!--    <el-dialog-->
<!--      destroy-on-close-->
<!--      append-to-body-->
<!--      class="screen-dialog screen-wrap c-seal-area-dialog"-->
<!--      :visible="true"-->
<!--      width="500px"-->
<!--      title="楼栋人员信息"-->
<!--      @close="$emit('close')"-->
<!--    >-->
      <div slot="title" class="title">
<!--        <span>楼栋人员信息</span>-->
        <el-button type="text" @click="showDetail">查看人口详情</el-button>
      </div>
      <div class="c-sealarea-detail-count__col__3">
        <div
          v-loading="loadingPopulation"
          element-loading-text="加载数据中"
          element-loading-custom-class="loading-mask"
        >
          <count-card
            v-for="item in population"
            :key="item.name"
            :itemName="item.name"
            :num="item.value"
            column="col-3"
            unit="人"
          ></count-card>
        </div>
      </div>
      <div class="c-sealarea-detail-chart-wrapper">
        <chart-board :data="ageData" v-if="ageData" :showBigBtn="false"/>
      </div>
      <div class="c-sealarea-detail-chart-wrapper">
        <chart-board :data="sexData" v-if="sexData" :showBigBtn="false"/>
      </div>
<!--    </el-dialog>-->
  </div>
</template>
<script>
import CountCard from "@/components/charts/CountCard";
import ChartBoard from "@/components/charts/ChartBoard";
export default {
  name: "peopleChart",
  components: { CountCard, ChartBoard },
  props: ["peopleData"],
  data() {
    return {
      loadingPopulation: false,
      population: [],
      ageData: null,
      sexData: null,
    };
  },
  provide() {
    return {
      handleItemChoosed: this.handleItemChoosed,
    };
  },
  computed: {},
  async mounted() {
    const { features } = this.peopleData;
    this.population = [
      { name: "总人口", value: features.length },
      {
        name: "户籍人口",
        value: features.filter(
          (v) => v.attributes.RYLX.indexOf('户籍人口') > -1
        ).length,
      },
      {
        name: "流动人口",
        value: features.filter(
          (v) => v.attributes.RYLX.indexOf('流动人口') > -1
        ).length,
      },
    ];
    const processData = features.map((v) => {
      let { attributes } = v;
      return {
        ...v,
        age: attributes["AGE"],
        sex: attributes["SEX"],
      };
    });
    console.log(93,processData);
    this.loadingPopulation = false;
    const ageData = [
      {
        name: "0-12岁",
        value: processData.filter((v) => v["age"] <= 12).length,
      },
      {
        name: "12-24岁",
        value: processData.filter(
          (v) =>
            v["age"] > 12 && v["age"] <= 24
        ).length,
      },
      {
        name: "24-60岁",
        value: processData.filter(
          (v) =>
            v["age"] > 24 && v["age"] <= 60
        ).length,
      },
      {
        name: "60-120岁",
        value: processData.filter(
          (v) =>
            v["age"] > 60 && v["age"] <= 120
        ).length,
      },
    ];
    const sexData = [
      {
        name: "男",
        value: processData.filter((v) => v["sex"] === "男").length,
      },
      {
        name: "女",
        value: processData.filter((v) => v["sex"] === "女").length,
      },
    ];
    this.ageData = {
      panelItemData: {
        optionData: {
          series: [
            {
              data: ageData.map((v) => v.value),
              name: "人口数量",
              type: "bar",
            },
          ],
          xAxis: [
            {
              data: ["0-12岁", "12-24岁", "24-60岁", "60-120岁"],
              type: "category",
              axisLine: { lineStyle: { color: "#364f9a" } },
            },
          ],
          yAxis: [
            {
              type: "value",
              axisLine: { lineStyle: { color: "#364f9a" } },
              axisLabel: {
                formatter: {
                  _custom: {
                    type: "function",
                    display: "<span>ƒ</span> formatter(value)",
                  },
                },
              },
            },
          ],
        },
      },
      title:"各年龄段人口数据",
      code: "getPopulationByAge-custom",
      info: {"title":"各年龄段人口数据","showInfo":true,"code":"getPopulationByAge"}
    };
    this.sexData = {
      panelItemData: {
        optionData: {
          series: [
            {
              data:sexData,
              type: "pie",
              label: { formatter: "{b}\n{@1}({d}%)" },
              radius: [0, "50%"],
            },
          ],
        },
      },
      code: "getPopulationBySex-custom",
      title: "性别人口数据",
      info: {"title":"性别人口数据","showInfo":true,"code":"getPopulationBySex"}
    };
  },
  methods: {
    calculateAge(idCard) {
      const yearBirth = idCard.substring(6, 10);
      const monthBirth = idCard.substring(10, 12);
      const dayBirth = idCard.substring(12, 14);
      const currentDate = new Date();
      const monthNow = currentDate.getMonth() + 1;
      const dayNow = currentDate.getDay();
      let age = currentDate.getFullYear() - yearBirth;
      if (
        monthNow < monthBirth ||
        (monthNow == monthBirth && dayNow < dayBirth)
      ) {
        age--;
      }
      console.log(201,yearBirth,monthBirth,dayBirth,age)
      return age;
    },
    calculateSex(idCard) {
      return parseInt(idCard.substr(16, 1)) % 2 == 1 ? "男" : "女";
    },
    showDetail() {
      this.$emit('showDetail');
    }
  },
};
</script>
<style lang="scss" scoped>
.c-sealarea-detail-chart-wrapper {
  height: 400px;
}
</style>
