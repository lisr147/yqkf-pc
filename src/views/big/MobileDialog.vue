<template>
  <el-dialog
    v-dialogDrag
    :width="layerType[layer].width || '96vw'"
    :visible="true"
    :modal="false"
    :close-on-click-modal="false"
    @close="$emit('close')"
    :title="layerType[layer].name"
    custom-class="data-total-dialog"
    v-if="layerType[layer]"
  >
    <div slot="title" v-if="layerType[layer].tip">
      {{layerType[layer].name}}
      <el-popover popper-class="screen-popover" placement="top-start"  width="800" trigger="hover">
        <p v-for="(item,i) in layerType[layer].tip" :key="i">{{item}}</p>
        <i class="el-icon-warning-outline tip_icon" slot="reference"></i>
      </el-popover>
    </div>
    <div class="data-total">
      <component :is="layerType[layer].component" />
    </div>
  </el-dialog>
</template>
<script>
import MobileEpidemic from './MobileEpidemic2'
import MobileHSJC from './MobileHSJC'
import DataDescription from './DataDescription'
import AlarmEventPanel from './AlarmEventPanel'
import VehicleStatisticsPanel from './VehicleStatisticsPanel/VehicleStatisticsPanel'
import EpidemicAreaVisiter from './EpidemicAreaVisiter/Index.vue'
import PersonnelVerification from './Dialog/PersonnelVerification'
import BuyMedicineVerification from './Dialog/BuyMedicineVerification'
import publicOpinion from './Dialog/publicOpinion'
import CheckPointsRecommend from './CheckPointsRecommend/index'
import VolunteerCount from './VolunteerCount'

export default {
  name: 'MobileDialog',
  components: {
    MobileEpidemic,
    MobileHSJC,
    DataDescription,
    AlarmEventPanel,
    VehicleStatisticsPanel,
    EpidemicAreaVisiter,
    PersonnelVerification,
    BuyMedicineVerification,
    CheckPointsRecommend,
    publicOpinion,
    VolunteerCount,
  },
  props: ['layer'],
  data() {
    return {
      layerType: {
        6: {
          component: 'MobileEpidemic',
          name: '疫苗接种总览',
        },
        7: {
          component: 'MobileHSJC',
          name: '核酸检测',
        },
        'dataSpecification': {
          component: 'DataDescription',
          name: '数据说明',
          width: '1100px',
        },
        9: {
          component: 'AlarmEventPanel',
          name: '告警事件',
          width: '1360px',
        },
        10: {
          component: 'VehicleStatisticsPanel',
          name: '负压车辆',
          width: '1200px',
        },
        11: {
          component: 'EpidemicAreaVisiter',
          name: '涉疫地区来南沙人员',
          width: '1840px',
          tip: [
            '1、今日数据：统计今日0点至当前时刻的累计流入人口(按照号码去重)。',
            '2、中高风险地区：国家公布的中高风险地区所属的行政区，区县以下级别的区域对应到所属区县。当天公布的新增中高风险区域，会在次日计入。',
            '3、从中高风险地区流入：历史14天内，在中高风险地区停留4小时及以上的用户，进入目标区域停留连续3小时的用户（切换至3小时，统计数据为当日进入目标区域连续停留时长3小时及以上的用户。）',
            '4、从低风险地区流入∶历史14天内，未途径过中高风险地区的用户，即为从低风险地区流入。流入的低风险地区按照前—天停留区域判定。',
            '数据来源：移动运营商',
          ],
        },
        12: {
          component: 'PersonnelVerification',
          name: '密接次密接人员核查',
          width: '90vw',
        },
        13: {
          component: 'CheckPointsRecommend',
          name: '核酸采样点推荐',
          width: '1100px',
          tip: [
            `系统通过大规模核酸采样点附近2公里的昨日新增中高风险来粤返粤人员数、居家隔离次密接人员和黄码人员的总数，自动获取核酸采样点附近风险情况。`,
            `人员最多的前10个核酸采样点作为首要推荐核酸采样点。然后根据移动大数据提供的昨日高风险人员来各镇街人员数与各镇街常住人口数的占比，系统校验
            占比前3的镇街是否存在核酸检测推荐点。若没有，则按镇街各补一个核酸采样点作为最终的核酸推荐点。`
          ]
        },
        14: {
          component: 'BuyMedicineVerification',
          name: '购药核查',
          width: '90vw'
        },
        'publicOpinion': {
          component: 'publicOpinion',
          name: '舆情分析',
          width: '90vw'
        },
        'volunteer': {
          component: 'VolunteerCount',
          name: '志愿者统计',
          width: '90vw'
        }
      },
    }
  },
}
</script>
<style lang="scss">
.data-total-dialog {
  // left: 50% !important;
  top: 80px !important;
  box-sizing: border-box;
  .data-total {
    margin: 0px;
    width: 100%;
    max-height: calc(100vh - 170px);
    overflow: auto;
    overflow-x: hidden;
    display: block;
    .title {
      display: none;
    }
    .box {
      color: #fff;
      padding: 5px 0px;
      label {
        color: #fefe00;
        line-height: 22px;
        span {
          font-size: 14px;
        }
      }
    }
    .block {
      background-color: #233e7e;
      width: 100%;
      overflow: auto;
      //   display: flex;
      //   justify-content: center;
      margin: 5px;
      text-align: center;
      //   display: block;
      .block-content {
        width: fit-content;
        padding: 5px;
        box-sizing: border-box;
        display: inline-block;
        .root-line {
          .root.box {
            background: none !important;
          }
          .root::after {
            display: none;
          }
        }
        .data-line {
          margin-top: 0px;
          width: 100%;
          justify-content: center;
          .data.box {
            background-color: #314f96;
            .more {
              .more-info {
                background-color: #4060ae;
              }
              .more-info.font-red label {
                color: #df5512;
              }
            }
          }

          .data.box::before {
            display: none;
          }
        }
        .data-line::after {
          display: none;
        }
      }
      .total-line {
        background-color: #314f96;
        color: #fff;
        padding: 3px 40px;
        label {
          color: #fefe00;
        }
      }
      .update-time {
        background: none !important;
        color: #fff;
        padding: 0px;
      }
    }
    .block.tips {
      background: none;
      justify-content: flex-start;
      text-align: left;
      label {
        color: #ffad04 !important;
      }
    }
  }
}
.tip_icon{
  font-size: 16px;
  color: rgb(230, 253, 19);
  cursor: pointer;
}
</style>
