<template>
  <div>
    <div class="volunteer-box iscroll">
      <div class="total-data">
        <h3 class="type-title">志愿者数据总览</h3>
        <div class="card-list">
          <div
            v-for="(item, index) in listData"
            :key="index"
            :class="['list-item', {'canClick': String(item.isDy)}]"
            @click="handleClickTotalItem(item)"
          >
            <div class="item-title">
              {{ item.name }}
            </div>
            <div class="item-value">
              <b>{{ item.value }}</b>
              <span>人</span>
            </div>
          </div>
        </div>
        <div class="charts">
          <div class="charts-item" v-for="(item,index) in chartsTotalList" :key="index">
            <data-board v-if="item.type==='chart'" :code="item.code" :title="item.title"
                        :hideFooter="true" :showBigBtn="false"></data-board>
          </div>
        </div>
      </div>
      <template>
        <h3 class="type-title">党员志愿者</h3>
        <div class="charts">
          <div class="charts-item" :style="{width:item.width}" v-for="(item,index) in dyzyzList" :key="index">
            <data-board v-if="item.type==='chart'" :code="item.code" :title="item.title" :ref="`${item.code}-chart`" from="volunteer" :hideFooter="true" :showBigBtn="false"/>
            <div class="opt-type" v-if="item.selectList">
              <el-select v-model="selectType" placeholder="请选择" @change="handleChangeType($event, item)">
                <el-option
                  v-for="item in item.selectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <TableCard class="town-block board" v-if="item.type === 'tableCard'" :code="item.code"
                       @onCardItemClick="(cardItem) => {onCardItemClick(item, cardItem)}" :isCanClick="true"
                       :title="item.title"/>
          </div>
        </div>
      </template>
      <template>
        <h3 class="type-title">非党员志愿者</h3>
        <div class="charts">
          <div class="charts-item" v-for="(item,index) in fdyzyzList" :key="index">
            <data-board v-if="item.type==='chart'" :code="item.code" :title="item.title" :hideFooter="true" :showBigBtn="false">
            </data-board>
            <TableCard class="town-block board" v-if="item.type === 'tableCard'" :code="item.code"
                       :title="item.title" @onCardItemClick="(cardItem) => {onCardItemClick(item, cardItem)}" :isCanClick="true"></TableCard>
          </div>
        </div>
      </template>
      <template>
        <volunteer-detail-dialog v-if="vDetailDialogVisible" v-model="vDetailDialogVisible" :data="vDetailData"></volunteer-detail-dialog>
      </template>
    </div>
  </div>
</template>

<script>
import VolunteerDetailDialog from "@/views/big/VolunteerDetailDialog";
import DataBoard from '@/components/charts/DataBoard'
import TableCard from '@/components/charts/TableCard'
import {getCountData} from '@/api/volunteer'
import { getPanelItemDataByCode } from "@/api/bigCharts";
import ChartBoard from "@/components/charts/ChartBoard";
export default {
  name: 'VolunteerCount',
  components: {
    DataBoard,
    TableCard,
    ChartBoard,
    VolunteerDetailDialog
  },
  props: {},
  data () {
    return {
      keyWord: null,
      chartHeight: 280, //图表高度
      isVisible: '',//数据总览说明
      listData: [],//统计
      selectType: 1,
      vDetailDialogVisible: false,
      vDetailData: {} ,// 志愿者明细弹窗筛选条件
      chartsTotalList: [
        { code: 'zyzlxfb', type: 'chart', title: '志愿者类型分布' },
        { code: 'zyzzjfb', type: 'chart', title: '志愿者镇街分布' },
      ],
      dyzyzList: [
        {
          code: 'dyzyzzjfb',
          type: 'chart',
          title: '党员志愿者镇街分布', isDy: 1,
          selectList: [{ label: '总览', value: 1 }, { label: '分类', value: 2 }]
        },
        { code: 'dyzyzsqtj', type: 'tableCard', title: '党员志愿者社区统计', detailSearchKey: 'sssq' , isDy: 1},
        { code: 'dyzyzwgtj', type: 'tableCard', title: '党员志愿者网格统计', detailSearchKey: 'sswg' , isDy: 1 },
      ],
      fdyzyzList: [
        { code: 'fdyzyzzjfb', type: 'chart', title: '非党员志愿者镇街分布', isDy: 0 },
        { code: 'fdyzyzsqtj', type: 'tableCard', title: '非党员志愿者社区统计', detailSearchKey: 'sssq', isDy: 0 },
        { code: 'fdyzyzwgtj', type: 'tableCard', title: '非党员志愿者网格统计', detailSearchKey: 'sswg', isDy: 0 }
      ],
    }
  },

  mounted () {
    this.getCountData()
  },
  methods: {
    //总览
    async getCountData () {
      let res = await getCountData({isBase:1})
      this.listData = res.map(item => {
        let mapping = {
          '志愿者总数': '',
          '党员志愿者总数': 1,
          '非党员志愿者总数': 0,
        }
        return {
          ...item,
          isDy: mapping[item.name] //是否党员
        }
      })
    },
    async handleChangeType(type,item){
      let code = item.code
      let res = await getPanelItemDataByCode({code, type, showModal: false})
      this.$refs[`${code}-chart`][0].$refs.component.updateData(res);
    },
    // 点击总数统计
    handleClickTotalItem (item) {
      if (String(item.isDy)) {
        this.vDetailDialogVisible = true
        this.vDetailData = {
          title: item.name,
          isDy: item.isDy,
        }
      }
    },
    onCardItemClick (item,cardItem) {
      let tableCardList = [...this.dyzyzList, ...this.fdyzyzList]
      let current = tableCardList.find(i => i.code === item.code)
      this.vDetailDialogVisible = true
      this.vDetailData = {...cardItem, ...item, [current.detailSearchKey]: cardItem.cardName, isDy: item.isDy}
    }
  }

}
</script>

<style lang="scss" scoped>
.volunteer-box {
  height: 75vh;
  overflow: auto;
  color: #fff;

  .total-data {
    //background-color: rgba($color: #223e7e, $alpha: 1);
    padding: 10px 20px 20px 15px;

    .title-wrap {
      display: flex;
      align-items: center;
      font-size: 16px;

      i {
        margin-left: 10px;
      }
    }

    .card-list {
      display: flex;
      flex-wrap: wrap;

      .list-item {
        background-color: #324f96;
        margin: 6px;
        padding: 15px;
        min-width: 130px;
        text-align: center;
        font-size: 12px;
        &.canClick {
          cursor: pointer;
          &:hover {
            opacity: .8;
          }
        }
        .item-title {
          //white-space: nowrap;
          //height: 35px;
          margin-bottom: 5px;
        }

        .item-value {
          font-size: 18px;
          font-weight: 600;
          white-space: nowrap;
          color: #FFFE00;

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
    }

    .char-list {
      display: flex;
    }

    .update-time {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      opacity: 0.5;
      margin-top: 5px;
    }
  }

  .type-title {
    font-size: 16px;
    font-weight: 500;
    color: #FFFFFF;
    margin: 15px 0 10px;
  }

  .charts {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    ::v-deep .board {
      background: #223E7E;

      .header {
        //background:none;
        .title {
          display: inline-block;
        }
      }

      .board-item {
        background: #223E7E;
      }

      .footer {
        background: #223E7E;
        color: #909ebe;
      }
    }

    &-item {
      width: 31%;
      margin: .5em;
      padding: .5em;
      background: #223E7E;
      position: relative;
      .opt-type{
        position: absolute;
        width: 120px;
        right: 10px;
        top: 10px;
      }
    }
  }

  .c-block-statistics {
    background-color: inherit;
  }
}
</style>
