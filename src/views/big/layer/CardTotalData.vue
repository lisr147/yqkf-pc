q<template>
  <div class="total-data">
    <div class="title-wrap">
      <div class="m-title">
        <template v-if="!grid">{{ town }}</template
        >{{ grid }}数据总览
      </div>
      <!--          <i class="el-icon-question" @click="lookDesc" />-->
    </div>

    <!-- 数据总览卡片 -->
    <div class="data-list">
      <div
        v-for="(sub, index) in list"
        :key="index"
        class="list-item"
        :class="detailList[sub.key] ? 'detail' : ''"
        @click="showDetail(sub)"
      >
        <div class="item-title">
          {{ sub.key }}
          <el-popover
            popper-class="screen-popover"
            v-if="sub.desc"
            width="360"
            trigger="hover"
          >
            <div>
              {{ sub.desc }}
              <template v-if="sub.updateTime"
                >更新时间：{{ sub.updateTime }}</template
              >
            </div>
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </div>
        <div class="item-value">
          <b :style="{ color: sub.color }">{{ sub.value }}</b>
          <span>{{ sub.unit }}</span>
        </div>
      </div>
    </div>
    <div class="update-time" v-if="showTime">
      更新时间：{{ data.updateTime }}
      <span style="margin: 0 10px">数据来源：{{ data.source }}</span>
    </div>

    <el-dialog
      v-dialogDrag
      :title="showDetailData.name"
      :width="'1200px'"
      :visible="true"
      :modal="false"
      :close-on-click-modal="false"
      v-if="showDetailData"
      @close="showDetailData = null"
      class="screen-dialog screen-wrap"
    >
      <templateData
        v-if="showDetailData.type === 'template'"
        :props="showDetailData"
      />
      <fetchData v-if="showDetailData.type === 'api'" :props="showDetailData" />
    </el-dialog>
  </div>
</template>

<script>
import templateData from "@/views/common/importData.vue";
import fetchData from "@/views/fetchDataList/index.vue";
import { getGridList } from "@/api/sealarea.js";
export default {
  name: "CardTotalData",
  components: { templateData, fetchData },
  props: {
    data: { type: Object },
    list: { type: Array, required: true },
    showTime: { type: Boolean, default: true },
    town: { type: String },
    grid: { type: String },
  },
  data() {
    return {
      showDetailData: null,
      gridCode: "",
    };
  },
  computed: {
    //有详情的项目
    detailList() {
      return {
        户籍人口: {
          type: "api",
          id: "hjrk",
          condition: { street: this.town, sex: this.gridCode,rylx: '户籍人口' },
          // api:
        },
        流动人口: {
          type: "api",
          id: "ldrk",
          condition: { street: this.town, sex: this.grid,rylx: '流动人口' },
        },
        中高风险来粤返粤今日需核查人员: {
          type: "template",
          id: "10065",
          condition: {
            sszj: this.town,
            sswg: this.grid,
          },
        },
        当前密接人员: {
          type: "template",
          id: "10001",
          condition: {
            mjlx: "密切接触者",
            sszj: this.town,
            gz: "继续观察",
            sswg: this.grid,
          },
        },
        当前次密接人员: {
          type: "template",
          id: "10001",
          condition: {
            mjlx: "密接的密接",
            sszj: this.town,
            gz: "继续观察",
            sswg: this.grid,
          },
        },
        当前红码人员: {
          type: "api",
          id: "hhmry",
          condition: {
            hh_type: "红码",
            STREET: this.town,
            GRID_CODE: this.gridCode,
          },
        },
        当前黄码人员: {
          type: "api",
          id: "hhmry",
          condition: { 
            hh_type: "黄码",
            STREET: this.town,
            GRID_CODE: this.gridCode
          },
        },
      };
    },
  },
  async mounted() {
    // 获取gridcode
    if (this.grid) {
      let res = await getGridList({
        condition: { name: this.grid },
        page: 1,
        pageSize: 10,
      });
      this.gridCode = res.data[0].code;
    }
  },
  methods: {
    async showDetail(sub) {
      console.log(this.detailList[sub.key]);
      this.showDetailData = Object.assign(this.detailList[sub.key], {
        name: sub.key,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.total-data {
  background-color: rgba($color: #223e7e, $alpha: 1);
  margin-top: 5px;
  padding: 20px 20px 20px 15px;

  .title-wrap {
    display: flex;
    align-items: center;
    font-size: 16px;

    i {
      margin-left: 10px;
    }
  }

  .data-list {
    display: flex;
    flex-wrap: wrap;

    .list-item {
      background-color: #324f96;
      margin: 6px;
      padding: 15px;
      min-width: 130px;
      text-align: center;
      font-size: 12px;

      .item-title {
        //white-space: nowrap;
        //height: 35px;
        margin-bottom: 5px;
      }

      .item-value {
        font-size: 18px;
        font-weight: 600;
        white-space: nowrap;
        color: #fffe00;

        span {
          font-size: 14px;
          font-weight: normal;
          color: #fff;
        }

        .green {
          color: #19de43 !important;
        }
      }
    }
    .detail {
      cursor: pointer;
    }
  }

  .update-time {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    opacity: 0.5;
    margin-top: 5px;
  }
}
</style>
