<template>
  <div class="wrap">
    <div class="chart_title">{{ title }}风险地区流入人口情况排行</div>
    <div class="_content">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="item-title">
          <div class="name">{{ item.orderName }}</div>
          <div>
            <span class="num">{{ item.totalNum }}</span
            >人
          </div>
        </div>
        <el-progress
          :percentage="item.percent"
          color="#F4974E"
          :show-text="false"
          :stroke-width="8"
        ></el-progress>
      </div>
      <div v-if="list.length === 0" class="chart_no-content">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { highRiskAreaPeopleRanking } from "@/api/EpidemicAreaVisiter";

export default {
  props: {
    msg: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      title: "",
      list: [],
    };
  },
  watch: {
    msg: {
      handler() {
        this.setTitle();
      },
      deep: true,
    },
  },
  mounted() {
    this.getData();
    this.setTitle();
  },
  methods: {
    setTitle() {
      let dict = {
        0: "低",
        1: "中",
        2: "高",
      };

      this.title = dict[this.msg.riskLevel];
    },
    getData() {
      let params = JSON.parse(JSON.stringify(this.msg));
      highRiskAreaPeopleRanking(params)
        .then((res) => {
          res = res || [];
          let total = 0;
          res.forEach((v) => {
            let totalNum = v.totalNum || 0;
            total += totalNum;
          });
          this.list = res.map((m, i) =>
            Object.assign(m, {
              percent: (m.totalNum / total) * 100,
              orderName: `${i + 1}、${m.sourceName}`,
            })
          );
        })
        .then(() => {
          this.$emit("ranking", this.list);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
// .wrap {
//   height: 100%;
//   display: flex;
//   flex-direction: column;
// }
.chart_title {
  font-size: 18px;
  color: #ffffff;
  padding: 10px 0 26px 0;
}
.chart_no-content {
  font-size: 14px;
  color: #fff;
  padding: 10px 0 26px 0;
}
._content {
  flex: 1;
  max-height: 568px;
  overflow: auto;
  padding-right: 6px;
}
.item {
  &:not(:first-child) {
    margin-top: 20px;
  }
}
.item-title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #ffffff;
  line-height: 21px;

  .num {
    font-size: 16px;
    color: #f4974e;
  }
}
::v-deep .el-progress-bar__outer {
  background: #324279;
}
</style>
