<template>
  <div class="data-panel">
    <div class="data-panel-head" v-if="title">
      <span class="title"
        >{{ title }}
        <el-popover
          popper-class="screen-popover"
          width="360"
          trigger="hover"
          v-if="titleTips"
        >
          <div v-for="(tip, tipIndex) in titleTips" :key="tipIndex">
            {{ tip }}
          </div>
          <i slot="reference" class="el-icon-question"></i>
        </el-popover>
      </span>
    </div>
    <div class="data-panel-content">
      <div class="row" v-for="(item, index) in list" :key="index">
        <div
          :class="['col', {'pointer': item2.dialogConfig}]"
          v-for="(item2, index2) in item"
          :key="index2"
          :style="(item2.bgColor ? getBgColor(item2.bgColor) : '')+(item2.name?'':'opacity:0;')"
          @click="handleClickPanel(item2)"
        >
          <div>
            {{ item2.name }}
            <el-popover
              popper-class="screen-popover"
              width="360"
              trigger="hover"
              v-if="item2.tips"
            >
              <div
                v-for="(colTip, colTipIndex) in item2.tips"
                :key="colTipIndex"
              >
                {{ colTip }}
              </div>
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div>
            <span
              class="num"
              :style="item2.bgColor ? getNumColor(item2.bgColor) : ''"
              >{{ item2.value || 0 }}</span
            >
            {{ item2.unit }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="data-panel-time"
      v-if="updateTime"
      :style="tipsInline ? 'display: inline-flex;' : ''"
    >
      <div>更新时间：{{ updateTime }}</div>
      <div>数据来源: {{ source }}</div>
    </div>
    <panel-dialog v-model="panelDialogVisible" :data="currentPanel"></panel-dialog>
  </div>
</template>

<script>
import PanelDialog from "@components/allDataTotal/PanelDialog";
export default {
  name: "data-panel",
  components: {
    PanelDialog,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
    },
    updateTime: {
      type: String,
    },
    source: {
      type: String,
    },
    tipsInline: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: "blue",
    },
    titleTips: {
      type: Array,
    },
  },
  computed: {
    backgroundColor() {
      return {
        blue: "background: linear-gradient(90deg,rgba(0, 234, 233, 0.2) 0%,rgba(0, 234, 233, 0.05) 100%)",
        orange:
          "background: linear-gradient(90deg,rgba(244,151,77, 0.2) 0%,rgba(244,151,77, 0.05) 100%)",
        red: "background: linear-gradient(90deg,rgba(220,30,0, 0.2) 0%,rgba(220,30,0, 0.05) 100%)",
        yellow:
          "background: linear-gradient(90deg,rgba(255,255,0, 0.2) 0%,rgba(255,255,0, 0.05) 100%)",
      };
    },
    numColor() {
      return {
        blue: "color : #00EAE9",
        orange: "color : #F4974E",
        red: "color : #FF0000",
        yellow: "color : #FFFF00",
      };
    },
  },
  data() {
    return {
      panelDialogVisible: false,
      currentPanel: {}, //当前点击的面板
    };
  },
  methods: {
    getBgColor(color) {
      return this.backgroundColor[color];
    },
    getNumColor(color) {
      return this.numColor[color];
    },
    handleClickPanel(item) {
        this.$emit('clickPanel',item)
      if (item.dialogConfig) {
        // 先关闭原来的
        this.panelDialogVisible = false
        this.$nextTick(() => {
          this.currentPanel = {...item};
          this.panelDialogVisible = true;
        })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.data-panel {
  margin-bottom: 14px;
  &-head {
    position: relative;
    margin-bottom: 12px;
    color: #fff;
    .title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      line-height: 22px;
      font-weight: 500;
      padding-left: 8px;
    }
    .title::before {
      content: "";
      width: 3px;
      background-color: #345ef0;
      display: block;
      top: 3px;
      height: 16px;
      position: absolute;
    }
  }

  &-content {
    .row {
      display: flex;
      align-content: space-between;
      color: #fff;
      margin-bottom: 16px;

      .col {
        flex: 1;
        text-align: center;
        padding: 8px 0 4px 0;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #ffffff;
        background: linear-gradient(
          90deg,
          rgba(0, 234, 233, 0.2) 0%,
          rgba(0, 234, 233, 0.05) 100%
        );
        margin-right: 16px;
        &.pointer {
          cursor: pointer;
          &:hover {
            opacity: .8;
          }
        }
        .num {
          font-size: 24px;
          font-family: Bebas;
          color: #00eae9;
        }
      }
      .col:last-child {
        margin-right: 0;
      }
    }
    .row:last-child {
      margin-bottom: 0;
    }
  }

  &-time {
    margin-top: 16px;
    font-size: 14px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #4971ce;
    line-height: 18px;
  }
}
</style>
