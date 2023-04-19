<template>
  <div class="all-data-container">
    <div class="left panel">
      <panel title="人员与住宅情况">
        <div class="card" v-for="(item,index) in personList" :key="index">
          <DataPanel
            :title="item.title"
            :list="item.cardList"
            class="pointer"
          />
          <template v-for="board in item.boardList">
            <dataBoard
              v-if="board.type==='dataBoard'"
              :title="board.title"
              :hideTitle="!board.title"
              :hideFooter="true"
              :key="board.code"
              :visible="true"
              :showBigBtn="false"
              :code="board.code"
              :chartHeight="board.height"
            />
          </template>

        </div>
      </panel>
    </div>
    <div class="middle">
      <div class="middle-top">
        <panel title="告警情况" :updateTime="updateTime">
          <template v-slot:tab>
            <div class="tab">
              <span
                @click="changeTab(index)"
                class="tab-item" :class="{active:currIndex===index}"
                v-for="(item,index) in tabList" :key="index">{{ item }}</span>
            </div>
          </template>
          <div
          >
            <div v-for="(item,index) in alarmList" :key="index">
              <DataPanel
                :title="item.title"
                :list="item.cardList"
                class="pointer"
              />
              <div class="chart-card" v-for="(board,index) in item.boardList" :key="index"
                   :class="{col2:currIndex!==0&&board.code==='gridAlarm'}">
                <dataBoard
                  v-if="board.type==='dataBoard'"
                  :ref="`${board.code}-chart`"
                  :title="board.title"
                  :hideTitle="!board.title"
                  :hideFooter="true"
                  :key="board.code"
                  :visible="true"
                  :showBigBtn="false"
                  :code="board.code"
                  from="czcPanel"
                  :chartHeight="board.height"
                  :alarmVillage="currVillage"
                />
              </div>
            </div>
          </div>
        </panel>
      </div>
      <div class="middle-bottom">
        <panel title="车辆出入情况" :updateTime="updateTime" style="margin-top: 0px">
          <div v-for="(item,index) in carList" :key="index">
            <DataPanel
              :title="item.title"
              :list="item.cardList"
              class="pointer"
            />
            <div class="chart-card" v-for="board in item.boardList">
              <dataBoard
                v-if="board.type==='dataBoard'"
                :title="board.title"
                :hideTitle="!board.title"
                :hideFooter="true"
                :key="board.code"
                :visible="true"
                :showBigBtn="false"
                :code="board.code"
              />
            </div>
          </div>
        </panel>
      </div>

    </div>
    <div class="right panel">
      <div class="right-top">
<!--        <panel title="人员流动情况" :updateTime="updateTime" style="height: 560px">-->
<!--          <div class="card" v-for="(item,index) in personMoveList" :key="index">-->
<!--            <DataPanel-->
<!--              :title="item.title"-->
<!--              :list="item.cardList"-->
<!--              class="pointer"-->
<!--            />-->
<!--            <el-carousel height="380px" :interval="10000" indicator-position="none" arrow="always" trigger="click"-->
<!--                         :autoplay="true">-->
<!--              <el-carousel-item v-for="(boards,bIndex) in item.boardList" :key="bIndex">-->
<!--                <template v-for="board in boards">-->
<!--                  <dataBoard-->
<!--                    style="height: 50%"-->
<!--                    v-if="board.type==='dataBoard'"-->
<!--                    :code="board.code"-->
<!--                    :title="board.title"-->
<!--                    :hideTitle="!board.title"-->
<!--                    :hideFooter="true"-->
<!--                    :key="board.code"-->
<!--                    :visible="true"-->
<!--                    :chartHeight="135"-->
<!--                    :showBigBtn="false"-->
<!--                  />-->
<!--                </template>-->
<!--              </el-carousel-item>-->
<!--            </el-carousel>-->
<!--          </div>-->
<!--        </panel>-->
        <panel title="告警处置情况">
          <div class="card" v-for="(item,index) in alarmSetList" :key="index">
            <template  v-for="(board,bIndex) in item.boardList">
              <dataBoard
                v-if="board.type==='dataBoard'"
                :code="board.code"
                :title="board.title"
                :hideTitle="!board.title"
                :hideFooter="true"
                :key="board.code"
                :visible="true"
                :chartHeight="320"
                :showBigBtn="false"
              />
            </template>

          </div>
        </panel>
      </div>
      <div class="right-bottom">
        <panel title="城中村部件">
          <div class="card" v-for="(item,index) in sectionList" :key="index">
            <el-carousel :interval="10000" indicator-position="none" arrow="always" trigger="click"
                         :autoplay="true">
              <el-carousel-item v-for="(board,bIndex) in item.boardList" :key="bIndex">
                <dataBoard
                  v-if="board.type==='dataBoard'"
                  :code="board.code"
                  :title="board.title"
                  :hideTitle="!board.title"
                  :hideFooter="true"
                  :key="board.code"
                  :visible="true"
                  :showBigBtn="false"
                />
              </el-carousel-item>
            </el-carousel>
          </div>
        </panel>
      </div>

    </div>
  </div>
</template>

<script>
import {getOverviewData, getUpdateTime} from '@/api/urban'
import { getPanelItemDataByCode } from "@/api/bigCharts";
export default {
  name: "czcPanel",
  components: {
    Panel: () => import("@/views/allDataTotal/panel.vue"),
    DataPanel: () => import("@/components/allDataTotal/dataPanel.vue"),
    DataBoard: () => import("@/components/charts/DataBoard")
  },
  provide() {
    return {
      handleItemChoosed: this.handleItemChoosed,
    };
  },
  data() {
    return {
      tabList: ['全部', '金洲村', '同兴村', '大元村', '太石村', '大同村', '北流村', '九比村', '板头村', '泰安社区', '龙穴社区'],
      currVillage: '',
      currIndex: 0,
      personList: [],
      alarmList: [],
      carList: [], //车辆出入情况
      personMoveList: [],// 人员流动情况
      alarmSetList: [],// 告警处置情况
      sectionList: [], //城中村部件
      updateTime: null,
      timer: null,
      loading:false,
      originData:{}
    };
  },
  watch: {
    currIndex(index) {
      this.currVillage = this.tabList[index]
      this.updateData()
    }
  },
  mounted() {
    this.initData()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    async initData() {
      let params = {
        village: this.currVillage
      }
      let res = await getOverviewData(params)
      this.updateTime = await getUpdateTime()
      if (res) {
        let cardList = res.map(v => {
          return {
            name: v.key,
            value: v.value,
            type: 'dataPanel',
            bgColor: ['今日未处置', '车辆离开数'].includes(v.key) ? 'orange' : ''
          }
        })
        this.personList = [
          {
            title: '人员构成情况',
            cardList: [cardList.filter(v => ['人员总数', '住户人数', '租户人数'].includes(v.name))],
            boardList: [
              { code: 'peopleConstitute', name: "人员构成情况", type: 'dataBoard', height: 180 },
              { code: 'zdPeopleChart', name: "重点关注人员", type: 'dataBoard', title: '重点关注人员', height: 220 }
            ]
          },
          {
            title: '住宅情况',
            cardList: [cardList.filter(v => ['楼栋总数', '住宅总数', '非住宅总数'].includes(v.name))],
            boardList: [
              { code: 'residenceChart', type: 'dataBoard' },
            ]
          },
        ]
        this.alarmList = [
          {
            cardList: [cardList.filter(v => ['今日告警总数', '今日已处置', '今日未处置'].includes(v.name))],
            boardList: [
              { code: 'alarmChart', name: "各村今日告警统计", type: 'dataBoard', title: '各村今日告警统计' },
              { code: 'weekAlarmTrend', name: "近7天告警趋势", type: 'dataBoard', title: '近7天告警趋势' },
              { code: 'weekAlarmChart', name: "近7天各村分布统计", type: 'dataBoard', title: '近7天各村分布统计' }
            ]
          },
        ]
        this.carList = [
          {
            cardList: [cardList.filter(v => ['车辆出入总数', '车辆进入数', '车辆离开数'].includes(v.name))],
            boardList: [
              { code: 'inOutChart', name: "各村今日出入情况统计", type: 'dataBoard', title: '各村今日出入情况统计' },
              { code: 'weekInOutTrendChart', name: "近7天车辆出入总数变化", type: 'dataBoard', title: '近7天车辆出入总数变化' },
              { code: 'weekInOutChart', name: "近7天出入车辆累计各村分布统计", type: 'dataBoard', title: '近7天出入车辆累计各村分布统计' }
            ]
          },
        ]
        this.personMoveList = [
          {
            title: '人员流动情况',
            cardList:
              [cardList.filter(v => ['人员累计流动总数', '迁入人数', '迁出人数'].includes(v.name))],
            boardList: [
              [
                { code: 'moveChart', name: "各村累计迁入迁出统计", type: 'dataBoard', title: '各村累计迁入迁出统计', height: 150 },
                { code: 'weekMoveChart', name: "近7天人员流动情况", type: 'dataBoard', title: '近7天人员流动情况', height: 150 },
              ],
              [
                {
                  code: 'weekMoveProportion',
                  name: "近7天迁入迁出占比统计",
                  type: 'dataBoard',
                  title: '近7天迁入迁出占比统计',
                  height: 150
                },
                {
                  code: 'weekMovePeopleChart',
                  name: "近7天各村迁入迁出累计人数占比统计",
                  type: 'dataBoard',
                  title: '近7天各村迁入迁出累计人数占比统计',
                  height: 150
                }
              ]
            ]
          },
        ]
        this.alarmSetList = [
          {
            boardList: [
              { code: 'AlarmDisposal', name: "告警处置情况", type: 'dataBoard', title: '告警处置情况' },
            ]
          },
        ]
        this.sectionList = [
          {
            boardList: [
              { code: 'componentType', name: "城中村部件类型占比统计", type: 'dataBoard', title: '城中村部件类型占比统计' },
              { code: 'componentVillage', name: "各村部件总数占比统计", type: 'dataBoard', title: '各村部件总数占比统计' },
            ]
          },
        ]
        setTimeout(() => {
          this.autoTab()
        }, 1000 * 10)
      }
    },
    async updateData() {
      let params = {
        village: this.currVillage !== '全部' ? this.currVillage : '',
        showModal: false
      }
      let res = await getOverviewData(params)
      let cardList = res.map(v => {
        return {
          name: v.key,
          value: v.value,
          type: 'dataPanel',
          bgColor: ['今日未处置', '车辆离开数'].includes(v.key) ? 'orange' : ''
        }
      })
      if (this.currIndex === 0) {
        this.alarmList = [
          {
            cardList: [cardList.filter(v => ['今日告警总数', '今日已处置', '今日未处置'].includes(v.name))],
            boardList: [
              { code: 'alarmChart', name: "各村今日告警统计", type: 'dataBoard', title: '各村今日告警统计' },
              { code: 'weekAlarmTrend', name: "近7天告警趋势", type: 'dataBoard', title: '近7天告警趋势' },
              { code: 'weekAlarmChart', name: "近7天各村分布统计", type: 'dataBoard', title: '近7天各村分布统计' }
            ]
          },
        ]
      } else {
        this.alarmList = [
          {
            cardList: [cardList.filter(v => ['今日告警总数', '今日已处置', '今日未处置'].includes(v.name))],
            boardList: [
              { code: 'singleAlarmChart', name: "今日村告警占比", type: 'dataBoard', title: '今日村告警占比' },
              { code: 'weekSingleAlarmChart', name: "近七天村告警占比", type: 'dataBoard', title: '近七天村告警占比' },
              { code: 'weekAlarmTrend', name: "近7天告警趋势", type: 'dataBoard', title: '近7天告警趋势' },
              // { code: 'gridAlarm', name: "各网格告警情况", type: 'dataBoard', title: '各网格告警情况'}
            ]
          },
        ]
        let boardList = this.alarmList[0].boardList
        for (const key in boardList) {
          let params = {
            village: this.currVillage,
            code: boardList[key].code,
            showModal: false
          }
          let upData = await getPanelItemDataByCode(params)
          if(res){
            setTimeout(() => {
              this.$refs[`${boardList[key].code}-chart`][0].$refs.component.updateData(upData);
            }, 300)
          }

        }
      }
    },
    changeTab(index) {
      this.clearTimer()
      this.currIndex = index
      setTimeout(() => {
        this.autoTab()
      }, 1000 * 10)
    },
    autoTab() {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.currIndex += 1
          if (this.currIndex == this.tabList.length) {
            this.currIndex = 0
          }
        }, 1000 * 30)

      }
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    }
  }
};
</script>

<style lang="scss" scoped>
.all-data-container {
  z-index: 21;
  position: relative;
  top: 54px !important;
  height: 100%;
  width: 100%;
  padding: 30px 10px;
  background: linear-gradient(180deg, #0262ae 0%, #034395 18%, #00306d 100%);
  display: flex;
  box-sizing: border-box;

  .panel {
    margin: 0 8px;
    height: calc(100% - 60px);

    //.card {
    //  margin-bottom: 10px;
    //}
  }

  .left {
    flex: 1;
    width: 0px;
  }

  .middle {
    width: 980px;
    display: flex;
    margin: 0 5px;
    flex-direction: column;
    //height: calc(100% - 35px);
    //overflow-y: auto;
    position: relative;

    &-top {
      height: 445px;
      margin: 0 0 40px 0;
    }

    &-bottom {
      height: calc(100% - 546px);
      display: flex;
      justify-content: space-between;
    }

    .chart-card {
      width: 33%;
      display: inline-block;
      margin-top: 15px;

      &.col2 {
        width: 66%;
      }
    }

    .tab {
      position: absolute;
      left: 90px;
      top: 2px;

      &-item {
        display: inline-block;
        font-size: 14px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #FFFFFF;
        padding: 2px 4px;
        background: rgba(0, 234, 233, 0.2);
        border-radius: 2px;
        margin: 0 3px;
        cursor: pointer;
      }

      .active {
        background: rgba(0, 234, 233, 0.7);
        border-radius: 2px;
      }
    }
  }

  .right {
    flex: 1;
    width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &-top {
      //height: 540px;
      margin: 0 0 10px 0;
      height: 445px;
    }

    &-bottom {
      height: calc(100% - 485px);
    }
  }

  ::v-deep.data-panel-content .row .col {
    padding: 3px 0 2px 0;
  }

  ::v-deep .el-carousel__arrow {
    font-size: 30px;
  }

  ::v-deep .el-carousel__arrow--left {
    left: -10px;
  }

  ::v-deep .el-carousel__arrow--right {
    right: -5px;
  }
}
</style>
