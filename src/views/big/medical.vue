<template>
  <div class="medical" v-if="data">
    <div class="board">
      <div class="header">
        <h3 class="title">{{ town }}{{ village }}{{ grid }}医疗救治统计图表</h3>
      </div>
    </div>

    <div class="button-group">
      <el-button
        v-for="item in data.index"
        :key="item.code + 'button'"
        size="small"
        class="button"
        @click="activeName = item.code"
        :active="activeName === item.code"
        >{{ item.title }}</el-button
      >
    </div>

    <template v-for="item in data.index">
      <template v-if="activeName === item.code && hasData.includes(item.code)">
        <template v-for="card in item.item">
          <DataPanel
            v-if="card.type === 'dataPanel'"
            :title="card.title"
            :list="data[card.code]"
            :updateTime="data[card.code + 'UpdateTime']"
            :source="card.source"
            :key="item.code + card.code"
            @clickPanel="openDetail('outpatient', $event)"
            class="pointer"
          />

          <dataBoard
            v-if="card.type === 'dataBoard'"
            :title="card.title"
            :hideTitle="!card.title"
            :chartHeight="300"
            :visible="true"
            :showBigBtn="false"
            :key="item.code + card.code + town + grid + village"
            :code="card.code"
          />
        </template>
      </template>
    </template>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "medical",
  components: {
    DataPanel: () => import("@/components/allDataTotal/dataPanel.vue"),
    DataBoard: () => import("@/components/charts/DataBoard")
  },
  data() {
    return {
      data: null,
      activeName: "yljz", //默认标签
      hasData: [],
      //   带单顺序和内容
      /**
      index: [
        {
          code: "yljz",
          title: "医疗救治",
          item: [
            {
              code: "outpatient",
              type: "dataPanel",
              title: "医院门诊情况",
              source: "区卫生健康局（共享平台系统对接，每半小时更新）"
            },
            {
              code: "communityHospital",
              type: "dataPanel",
              title: "发热门诊/诊室情况（详细数据对接中）",
              source: "区卫生健康局（人工更新，按需调整）"
            },
            {
              code: "register",
              type: "dataPanel",
              title: "门急诊实时挂号情况（详细数据对接中）",
              source: "区卫生健康局（共享平台系统对接，每半小时更新）"
            },
            {
              code: "wait",
              type: "dataPanel",
              title: "门急诊实时候诊情况（详细数据对接中）",
              source: "区卫生健康局（共享平台系统对接，每半小时更新）"
            },
            {
              code: "consult",
              type: "dataPanel",
              title: "今日门急诊累计就诊情况（详细数据对接中）",
              source: "区卫生健康局（共享平台系统对接，每半小时更新）"
            },
            {
              code: "covid",
              type: "dataPanel",
              title: "发热门诊阳性确诊人员",
              source: "区卫生健康局（人工更新，每天更新）"
            },
            {
              code: "inHospital",
              type: "dataPanel",
              title: "住院实时业务量",
              source: "区卫生健康局（共享平台系统对接，每半小时更新）"
            }
          ]
        },
        {
          code: "tsrq",
          title: "特殊人群/场所",
          item: [
            {
              code: "special",
              type: "dataPanel",
              title: "特殊人群情况（分类及明细数据更新对接中）",
              source: ""
            },
            {
              code: "tsrq",
              type: "dataBoard",
              title: "特殊人群结构"
            },
            {
              code: "place",
              type: "dataPanel",
              title: "特殊场所情况（详细数据对接中）",
              source:
                "各委办局、区视频共享平台（场所通过人工更新，扫码数据通过系统对接，每天更新）"
            },
            // {
            //     code:'tscszrsmqk',
            //     type:'dataBoard',
            //     title:'特殊场所昨日扫码情况',
            //     source:''
            // },
            {
              code: "tscsgzryzthsqk",
              type: "dataBoard",
              title: "特殊场所工作人员昨日核酸情况"
            }
          ]
        },
        {
          code: "ylwz",
          title: "医疗物资",
          item: [
            {
              code: "medical",
              type: "dataPanel",
              title: "医疗人员情况",
              source: ""
            },
            {
              code: "ylryqktb",
              type: "dataBoard",
              title: "医疗人员构成"
            },
            {
              code: "material",
              type: "dataPanel",
              title: "医疗机构医疗物资情况（详细数据对接中）",
              source: "区市场监管局（人工更新）"
            },
            {
              code: "shopMaterial",
              type: "dataPanel",
              title: "药店医疗物资情况（详细数据对接中）",
              source: "区市场监管局（人工更新）"
            },
            {
              code: "car",
              type: "dataPanel",
              title: "救治车辆情况",
              source: "区卫生健康局（人工更新，按需调整）"
            }
          ]
        },
        {
          code: "ymjz",
          title: "疫苗接种",
          item: [
            {
              code: "vaccine",
              type: "dataPanel",
              title: "累计接种情况（数据对接中）",
              source: "区卫生健康局（人工更新）"
            },
            {
              code: "old",
              type: "dataPanel",
              title: "60以上老年人昨日疫苗接种情况（数据对接中）",
              source: "卫生健康局（人工更新，每天更新）"
            }
          ]
        }
      ]
       */
    };
  },
  computed: {
    ...mapState("common", ["town", "grid", "village"])
  },
  mounted() {
    this.initData();
  },
  watch: {
    town() {
      this.hasData = [];
      this.initData();
    },
    village() {
      this.hasData = [];
      this.initData();
    },
    grid() {
      this.hasData = [];
      this.initData();
    },
    activeName(val) {
      if (!this.hasData.includes(val)) {
        this.initData();
      }
    }
  },
  methods: {
    async initData() {
      const res = await this.$Api().YljzTjController.get_yljzTj.request({
        params: {
          sscj: this.village,
          sswg: this.grid,
          sszj: this.town
        },
        path: {
          yljzTjType: this.activeName
        }
      });

      // console.log("数据", res);
    //   if (this.activeName === "ymjz") {
    //     res.vaccine[1][1].value = (
    //       (100 * res.vaccine[1][0].value) /
    //       res.vaccine[0][0].value
    //     ).toFixed(2);
    //   }
      this.data = Object.assign(this.data || {}, res);
      //防止重复请求
      this.hasData.push(this.activeName);
    },
    openDetail(type, item) {
      console.log(type, item);
      let dialogTitle = `${item.name.replace("总", "").replace("数", "")}明细`;
      if (item.name === "特殊人群总数") {
        const dialog = {
          detailType: "specialPeopleDetailList",
          dialogId: "specialPeopleDetailList",
          street: this.town,
          village: this.village,
          grid: this.grid
        };
        this.$emit("showDialog", dialog);
        return;
      }

      if (item.name === "医院总数") {
        const dialog = {
          dialogTitle,
          dialogId: "medical",
          dialogComponent: () => import("./Dialog/medicalDialog.vue"),
          detailType: "medical",
          data: {
            type,
            item,
            town: this.town,
            village: this.village,
            grid: this.grid
          }
        };
        //   console.log("dialog", dialog);
        this.$emit("showDialog", dialog);
      }
      if (
        item.name === "科室总数" ||
        item.name === "发热门诊数" ||
        item.name === "儿科门诊数" ||
        item.name === "产科门诊数" ||
        item.name === "急诊门诊数" ||
        item.name === "其他门诊数"

          // 挂号情况
        // item.name === "挂号总数" ||
        // item.name === "发热门诊挂号数" ||
        // item.name === "儿科门诊挂号数" ||
        // item.name === "产科门诊挂号数" ||
        // item.name === "急诊门诊挂号数" ||
        // item.name === "其他门诊挂号数" ||
          // 门急诊就诊记录模块
        // item.name === "就诊总数" ||
        // item.name === "发热门诊就诊数" ||
        // item.name === "儿科门诊就诊数" ||
        // item.name === "产科门诊就诊数" ||
        // item.name === "急诊门诊就诊数" ||
        // item.name === "其他门诊就诊数"
      ) {
        const dialog = {
          dialogTitle,
          dialogId: "medical",
          dialogComponent: () => import("./Dialog/medicalDialog.vue"),
          detailType: "medical",
          data: {
            type,
            item,
            town: this.town,
            village: this.village,
            grid: this.grid
          }
        };
        this.$emit("showDialog", dialog);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.medical {
  .button-group {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    overflow-x: scroll;
  }
  .button {
    display: inline-block;
    margin: 0 4px;
    padding: 0.4em 0.5em;
    min-width: 76px;
    line-height: 1.2em;
    border: 2px solid #1a449c;
    background-color: #1a2446 !important;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    text-align: center;
    box-shadow: 0 0 5px #2f2d91 inset;
    transition: all 0.2s ease-in-out;

    &:hover {
      border-color: #2256cb;
    }
    &[active] {
      border-color: #01e6ff;
      box-shadow: 0 0 5px #01e6ff inset;
      color: #01e6ff;
      background-color: #122662;
    }
  }
  //   .block {
  //     display: flex;
  //     .left {
  //       .left-down {
  //         display: flex;
  //       }
  //     }
  //     .right {
  //     }
  //   }
  //   .panel {
  //     ::v-deep .container {
  //       .header {
  //         text-align: left;
  //         .title {
  //           display: initial;
  //         }
  //       }

  //       ::v-deep .data-panel {
  //         .header {
  //           text-align: left;
  //           .title {
  //             display: initial;
  //           }
  //         }
  //       }
  //     }
  //   }

  .pointer {
    ::v-deep .row {
      .col {
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
