<template>
  <div>
    <el-dialog
      :visible="true"
      top="10vh"
      title="核查流程"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="1000px"
      v-dialogDrag
      custom-class="c-process-view"
    >
      <div class="c-process-view-content">
        <el-steps :active="currentStatus">
          <el-step title="导入待核查人员" v-if="processData.importProcess">
            <div slot="description">
              <div class="c-process-view-block__import" v-for="(item, index) in processData.importProcess" :key="index">
                <div>导入人员： {{item.users? item.users.join(','): ''}}</div>
                <div>导入时间： {{item.time}}</div>
              </div>
            </div>
          </el-step>
          <el-step title="镇街认领" v-if="processData.claimProcess">
            <div slot="description">
              <div :class="item.duration ? 'c-process-view-block__normal' : 'c-process-view-block__danger'" v-for="(item, index) in processData.claimProcess" :key="index">
                <div class="c-process-view-marker">
                  <div class="c-process-view-marker-icon"></div>
                  <div class="c-process-view-marker-line"></div>
                </div>
                <div class="c-process-view-content">
                  <div class="c-process-view-time">
                    <div>
                      {{item.time}}<span class="c-process-view-highlight"
                        >{{item.processType}}</span
                      >
                    </div>
                  </div>
                  <div class="c-process-view-detail">
                    <template v-if="!item.alarmStatus || item.alarmStatus == '0'">
                      <div>认领人员：{{item.users.join(',')}}</div>
                      <div>历时{{item.duration}}</div>
                    </template>
                    <template v-else>
                      <div v-for="(user, index2) in item.users" :key="index2">
                        接收告警人员：{{user}}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </el-step>
          <el-step title="核查反馈" v-if="processData.handingProcess">
            <div slot="description">
              <div :class="item.duration ? 'c-process-view-block__normal' : 'c-process-view-block__danger'" v-for="(item, index) in processData.handingProcess" :key="index">
                <div class="c-process-view-marker">
                  <div class="c-process-view-marker-icon"></div>
                  <div class="c-process-view-marker-line"></div>
                </div>
                <div class="c-process-view-content">
                  <div class="c-process-view-time">
                    <div>
                      {{item.time}}<span class="c-process-view-highlight"
                        >{{item.processType}}</span
                      >
                    </div>
                  </div>
                  <div class="c-process-view-detail">
                    <template v-if="!item.alarmStatus || item.alarmStatus == '0'">
                      <div>核查反馈人员：{{item.users.join(',')}}</div>
                      <div>核查进展{{item.processPercent}}，历时{{item.duration}}</div>
                    </template>
                    <template v-else>
                      <div v-for="(user, index2) in item.users" :key="index2">
                        接收告警人员：{{user}}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </el-step>
        </el-steps>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { getProcessHistory } from '@/api/closeContactPersonnelWhereabouts'
import { getBuyProcessHistory } from '@/api/buyMedicine'

export default {
  name: "ProcessView",
  props: {
    analysisId: String,
    type: {
      //流程面板类型  closeContact 密接次密接人员核查, buyMedicine 购药核查
      type:String,
      default: 'closeContact'
    }
  },
  data() {
    return {
      processData: {
        importProcess: [],
        claimProcess: [],
        handingProcess: []
      }
    }
  },
  computed: {
    currentStatus() {
      const { processData } = this;
      return Object.keys(processData).map(key => processData[key].length).filter(v => v).length
    }
  },
  watch: {
    analysisId: {
      handler(val) {
        if(val) this.getData(val);
      },
      immediate: true
    }
  },
  methods: {
    getData(id) {

      switch (this.type) {
        case 'buyMedicine':
          getBuyProcessHistory({id}).then(res=>{
            this.processData = res
          })
          break
        default:
          getProcessHistory(id).then((res) => {
            this.processData = res
          })
          break
      }

    }
  }
};
</script>

<style lang="scss" type="text/scss">
.c-process-view {
  &-content {
    margin: 0 9px;
    max-height: 60vh;
  }
  &-block__import {
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 14px;
    color: #c3c5cd;
    line-height: 22px;
    padding: 6px 20px 5px 9px;
    width: 235px;
    margin-right: 26px;
    background: linear-gradient(
      90deg,
      rgba(0, 234, 233, 0.2) 0%,
      rgba(0, 234, 233, 0.05) 100%
    );
  }
  &-block__normal,
  &-block__danger {
    box-sizing: border-box;
    font-size: 14px;
    display: flex;
    margin-right: 26px;
  }
  &-content {
    margin-left: 14px;
    flex: auto;
    font-size: 14px;
    color: #c3c5cd;
    line-height: 22px;
    margin-top: 4px;
    padding-bottom: 10px;
  }
  &-detail {
    padding-left: 8px;
    margin-top: 3px;
  }
  &-time {
    width: 300px;
    height: 34px;
    line-height: 34px;
    background: #195786;
    position: relative;
    padding-left: 12px;
    color: #fff;
    font-size: 14px;
    &::before {
      content: "";
      position: absolute;
      left: -18px;
      top: 6px;
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-right: 10px solid #195786;
      border-left: 10px solid transparent;
      border-bottom: 10px solid transparent;
    }
  }
  &-highlight {
    font-weight: 600;
    color: #00eae9;
    margin-left: 12px;
  }
  &-block__danger &-marker {
    &-icon {
      right: -4px;
      top: 8px;
      width: 24px;
      height: 24px;
      background: url("~@/assets/image/icon-marker__danger.png");
      background-size: 100% 100%;
    }
  }
  &-marker {
    width: 16px;
    flex: none;
    display: flex;
    justify-content: center;
    position: relative;
    &-icon {
      position: absolute;
      right: 2px;
      top: 14px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ffffff;
    }
    &-line {
      width: 1px;
      height: 100%;
      background: rgba(255, 255, 255, 0.3);
    }
  }
  // 覆盖样式
  .el-dialog {
    &__body {
      height: 95%;
      overflow: auto;
    }
  }

  .el-dialog__wrapper &-wrapper {
    bottom: 2vh;
    background-color: rgba(32, 50, 111, 0.95);
  }
  .el-step {
    &__icon {
      width: 18px;
      height: 18px;

      background: #999eb1;
      // background: #345EF0;
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      line-height: 22px;
      border: none;
      top: 2px;
      right: 1px;
    }
    &__title {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      line-height: 22px;
      margin: 9px 0 12px;
    }
    .is-finish {
      .el-step__icon {
        background: #345ef0;
      }
    }
  }
}
</style>
