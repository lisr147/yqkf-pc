<template>
  <div class="diagnose-filter">
    <div class="diagnose-filter__top">
      <img src="../../assets/image/box_top.png" alt="" />
      <span>阳性人员</span>
      <el-button type="primary" @click="changeAllState">
        全部落图</el-button>
    </div>
    <div class="diagnose-filter__content">
      <div class="event-filter" @click="switchEventListPopup" tabindex="0" ref="EventFilter" @blur="handleEventListBlur">
        <span class="selected-item">
          {{eventList[selectedEventIdx].sjmc}}
        </span>
        <i :class="isEventListPopupOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        <ul class="event-list-popup" v-show="isEventListPopupOpen">
            <li v-for="(item,index) in eventList" :key="index" @click.stop="selectEventItem(index)">{{item.sjmc}}</li>
        </ul>
      </div>
      <ul class="diagnose-filter__ul">
        <li class="item" v-for="(item, index) in dataList" :key="index">
          <a :class="['diagnose-filter__box', { isTop: item.isTop }]">
            <div class="diagnose-filter__img" @click="getDetail(item)">
              <img :src="item.ico" class="ico" />
            </div>
            <div class="diagnose-filter__info" @click="getDetail(item)">
              {{ item.name }}
              <p>{{ item.mobile }}</p>
            </div>

            <div class="diagnose-filter__btn">
              <el-button :class="['btn-change', { 'btn-active': item.checked }]" type="primary" v-model="item.checked"
                @click="item.checked = !item.checked">落图
              </el-button>
              <el-button class="btn-detail" type="primary" @click="getDetail(item)">详情</el-button>
              <el-button class="btn-detail" type="primary" @click="switchTrace(item)">轨迹</el-button>
            </div>
          </a>
        </li>
      </ul>
      <div class="el-dialog diagnose-detail" v-show="detailVisible">
        <div class="el-dialog__header">
          <span class="el-dialog__title">{{ detail.name }}的个人信息</span>
          <button type="button" class="el-dialog__headerbtn" @click="closeDetail">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <table>
            <tr>
              <td>
                <span>姓名：</span><span>{{ detail.name }}</span>
              </td>
              <td>
                <span>性别：</span><span>{{ detail.sex || "未知" }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>手机号码：</span><span>{{ detail.mobile || "未知" }}</span>
              </td>
              <td>
                <span>居住地址：</span><span>{{ detail.jzd || "未知" }}</span>
              </td>
            </tr>
            <tr>
              <td><span>病例类型：</span><span>阳性</span></td>
              <td>
                <span>身份证号码：</span><span>{{ detail.sfzhm || "未知" }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>列表置顶：</span>
                <el-switch v-model="detail.isTop" active-color="#17A514" @change="changeTop(detail.sfzhm)"></el-switch>
              </td>
            </tr>
          </table>

          <!-- <div class="timeline">
            <div v-for="(item, index) in detailTrace" :key="index">
              <div class="block" v-if="item.zdcs.length !== 0">
                <div class="block-h">{{ item.locusDate }}</div>
                <ul class="block-b">
                  <li v-for="(v, idx) in item.zdcs" :key="idx">
                    {{ v.csmc }} {{ getTimeRange(v.hdsj) }}
                  </li>
                  <li v-if="item.zdcs.length == 0">暂无数据</li>
                </ul>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getTop, cancelTop, getPositiveTrend } from "@/api/epidemiologicalSurvey";
import { Message } from "@/plugins/element";
import { getAllGlsj } from '@/api/epidemiologicalSurvey'

const allEventVal = '全部'

export default {
  name: "DiagnoseFilter",
  components: {},
  data() {
    return {
      allDataList: [],
      dataList: [],

      //确诊人员详情弹窗可见
      detailVisible: false,
      //确诊人员详情
      detail: {},
      //活动轨迹
      detailTrace: [],

      sickTypeMap: {
        1: "确诊",
        0: "无症状",
      },

      eventList: [{
        sjmc: allEventVal,
        sjid: ''
      }],
      selectedEventIdx: 0,
      isEventListPopupOpen:false
    };
  },
  computed: {
    data() {
      return this.$store.state.common.dispatchData;
    },
  },
  watch: {
    data(val) {
      this.dataList = [...val];

      this.dataList.forEach((item) => {
        item.ico = `./static/mapIcon/diagnose-1.svg`;
      });
      this.allDataList = this.dataList.slice();
    },
    dataList: {
      handler(val, oldVal) {
        if (oldVal.length == 0) {
          return;
        }
        const ids = val.filter((v) => v.checked).map((v) => v.id);
        this.$emit("selectChange", {
          layerIds: ["dispatch-person", "diagnose-place"],
          ids,
        });
      },
      deep: true,
    },
    selectedEventIdx(val){
      const {sjmc,sjid} = this.eventList[val]
      const events = []
      if(sjmc === allEventVal) {
        this.dataList = this.allDataList;
      } else {
        this.dataList = this.allDataList.filter(item=>item.glsj === sjmc)
        events.push(sjid)
      }
      this.$emit('updateDiagnoseHeatMapLayer',{events})
      this.$emit('updateScanRecordLayer', {events})
    }
  },
  mounted() {
    this.getData()
    this.getAllGlsj()
  },
  methods: {
    getData() {
      //阳性人员
      getPositiveTrend().then(res => {
        const arr = res.concat()
        arr.forEach(item => {
          item.checked = true
          item.id = item.sfzhm
        })
        this.$store.commit('common/SET_DIAGNOSE', arr)
      })
    },

    async getDetail({ id }) {
      if (this.detail.id == id) {
        this.closeDetail();
        return;
      }

      const { location, mobile, name, sex, trace, sfzhm, jzd, isTop } = this.data.find(
        (v) => v.id == id
      );
      this.detail = { location, mobile, id, name, sex, sfzhm, jzd, isTop };

      this.detailTrace = trace;

      this.detailVisible = true;
    },

    getTimeRange(str) {
      try {
        const [start, end] = str.split(",");
        if (start && end) {
          const mstart = moment(start),
            mend = moment(end);
          const diff = mend.diff(mstart, "minutes");
          const h = Math.floor(diff / 60); //相差的小时数
          const mm = diff % 60; //计算相差小时后余下的分钟数
          return `${mstart.format("HH:mm:ss")}-${mend.format(
            "HH:mm:ss"
          )} ${h}小时 ${mm}分钟`;
        } else {
          return str;
        }
      } catch (error) {
        return str;
      }
    },

    closeDetail() {
      this.detail = {};
      this.detailVisible = false;
    },

    // 全部落图
    changeAllState() {

      // 遍历dataList
      this.dataList.forEach(item => item.checked = true)
    },
    // 改变置顶功能
    async changeTop(sfzhm) {
      // 根据sfzhm找到数组的index
      let index = this.dataList.findIndex(item => item.sfzhm === sfzhm)
      let flag = this.dataList[index].isTop;
      if (!flag) {
        let res = await getTop(sfzhm)
        if (res === '设置成功') {
          Message({
            message: res,
            type: "success",
            duration: 5 * 1000,
          });
        }
      } else {
        let res = await cancelTop(sfzhm)
        if (res === '设置成功') {
          Message({
            message: res,
            type: "success",
            duration: 5 * 1000,
          });
        }
      }
      this.getData()
    },
    // 展示/隐藏某阳性人员轨迹
    switchTrace({ id }) {
      const enableShowTrace = this.dataList.find((v) => v.id === id).checked;
      this.$emit("switchTraceDialog", { id, enableShowTrace });
    },
    async getAllGlsj(){
      //关联事件
      const glsjList = await getAllGlsj()
      const glsjListOptions = glsjList.filter(v =>  v.status === '进行中').map(v => {return {sjmc:v.sjmc,sjid:v._id}})
      this.eventList = this.eventList.concat(glsjListOptions)
    },
    // 显示事件选项弹出层
    switchEventListPopup() {
      this.isEventListPopupOpen = !this.isEventListPopupOpen
      if(this.isEventListPopupOpen) {
        this.$refs.EventFilter.focus()
      }
    },
    selectEventItem(index){
      this.selectedEventIdx = index
      this.isEventListPopupOpen = false
    },
    handleEventListBlur() {
      this.isEventListPopupOpen = false
    }
  },
};
</script>

<style lang="scss" type="text/scss">
.diagnose-filter {
  position: fixed;
  top: 9em;
  left: 3em;
  color: #fff;
  min-width: 80px;

  .diagnose-filter__top {
    position: relative;
    width: 412px;
    height: 46px;
    font-size: 16px;
    margin-left: -32px;
    margin-top: -4px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;



    img {
      width: 100%;
      height: 100%;
    }

    &>span {
      position: absolute;
      left: 42px;
      top: 10px;
      font-size: 20px;
      font-weight: 500;
      color: #eef2ff;
      line-height: 30px;
    }

    .el-button--small {
      position: absolute;
      top: 8px;
      right: 20px;
      display: inline-block;
      font-size: 16px;
      padding: 4px 12px;
      font-weight: bold;
      color: #ffffff;
      line-height: 24px;
      border: none;
      background: #319df8;
      border-radius: 2px;
    }

    .btn-active {
      background: rgba(49, 157, 248, 0.4);
    }
  }

  .diagnose-filter__content {
    position: fixed;
    top: 12em;
    left: 3em;
    color: #fff;
    width: 380px;
    box-sizing: border-box;
    background: rgba(20, 37, 98, 0.7);
    border-left: 1px solid #385cd4;
    border-right: 1px solid #385cd4;

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 314px;
      height: 27px;
      top: -15px;
      left: 0;
      background: url("~@/assets/image/box_top_line.png") no-repeat;
    }

    &::after {
      content: "";
      display: block;
      position: absolute;
      width: 314px;
      height: 27px;
      bottom: -13px;
      left: 0;
      background: url("~@/assets/image/box_bottom.png") no-repeat;
    }

    .event-filter {
      width: 100%;
      height: 46px;
      background: rgba(20, 37, 98, .7);
      border-bottom: 1px solid #385CD4;
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #EEF2FF;
      display: flex;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      position: relative;
      cursor: pointer;
      z-index: 111;
      .selected-item{
        margin-right: 16px;
      }
      .event-list-popup{
        width: 100%;
        position: absolute;
        top: 47px;
        left: 0;
        background: rgba(20, 37, 98,.95);
        border-bottom: 1px solid #385CD4;
        padding: 10px 0;
        max-height: calc(32px * 8);
        overflow: auto;
          li{
            height: 32px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 20px;
            box-sizing: border-box;
            &:hover{
              background-color: #1e4ccd;
            }
          }
      }
    }

    .diagnose-filter__ul {
      position: relative;
      height: calc(100vh - 250px);
      overflow: auto;
      padding: 10px 16px 0 16px;
    }

    // 底部图片
    .diagnose-filter__bottom {
      width: 334px;
      height: 27px;

      img {
        width: 100%;
        height: 50%;
      }
    }

    .item {
      .ico {
        display: inline-block;
        vertical-align: middle;
        width: 49px;
        height: 56px;
      }

      .diagnose-filter__box {
        display: flex;
        flex-direction: row;
        position: relative;
        padding: 11px 0;
        line-height: 28px;
        box-shadow: inset 0px -1px 0px 0px rgba(235, 235, 235, 0.15);

        &:hover {
          background: url("~@/assets/image/box_hover.png") no-repeat;
        }
      }

      // 置顶样式
      .isTop {
        &::before {
          content: '已置顶';
          display: block;
          position: absolute;
          top: 0;
          left: 28px;
          width: 48px;
          height: 18px;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          line-height: 18px;
          z-index: 100;
          background: url('../../assets/image/sealArea/isTop.png') no-repeat;
        }
      }

      .diagnose-filter__img {
        flex: 1;
        display: flex;
        flex-direction: row;
        position: relative;
        display: inline-block;
        padding: 0 9px 0 0;
        min-width: 49px;
        line-height: 28px;
      }

      .diagnose-filter__info {
        display: inline-block;
        padding: 0.4em 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        text-align: left;
        font-size: 16px;
        color: #fff;
        line-height: 22px;

        p {
          font-size: 14px;
          color: #9aa0a3;
          line-height: 20px;
          padding-top: 2px;
          font-weight: 400;
          font-family: PingFangSC-Regular, PingFang SC;
        }
      }

      .diagnose-filter__btn {
        padding: 13px 0 13px 10px;

        .btn-change,
        .btn-detail {
          font-size: 16px;
          font-weight: bold;
          color: #ffffff;
          border-radius: 2px;
          padding: 8px 12px;
          border: none;
          font-family: SourceHanSansCN-Bold, SourceHanSansCN;
          background: #319DF8;
        }

        .btn-change {
          background: rgba(49, 157, 248, 0.15);

        }

        .btn-active {
          background: #319df8;
        }

        .btn-detail {
          background: rgba(49, 157, 248, 0.15);
          margin-left: 6px;
        }
      }
    }

    .diagnose-detail {
      position: absolute;
      top: 0em;
      left: 24.5em;
      width: 600px;
      transform: none;
      color: #fff;
      box-shadow: inset 0px 0px 4px 0px rgba(60, 137, 219, 0.58);
      overflow: hidden;

      .el-dialog__header {
        padding: 3px 0 18px 11px;

        .el-dialog__title {
          font-size: 22px;
          font-weight: 500;
          line-height: 30px;
        }

        .el-dialog__close {
          font-size: 18px;
        }

        .el-dialog__headerbtn {
          top: 0.57em;
          right: 0.7em;
          vertical-align: middle;
        }
      }

      .el-dialog__body {
        padding: 0.72em 0.28em;
        color: #c3c5cd;
      }

      table {
        td {
          padding: 0.5em;
          color: #fff;
        }
      }

      .timeline {
        position: relative;
        margin: 1em 0 0;
        padding: 0 0 0 1.5em;
        color: #fff;
        max-height: 300px;
        overflow: auto;

        .block {
          position: relative;
          padding: 0 0 1em;

          .block-h {
            display: inline-block;
            width: 224px;
            height: 34px;
            box-sizing: border-box;
            font-weight: 600;
          }

          &::before {
            content: "";
            position: absolute;
            top: 12px;
            left: -21px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #fff;
          }

          &::after {
            content: "";
            position: absolute;
            top: 0;
            left: -16px;
            bottom: 0;
            border-left: 1px solid #fff;
          }

          &-h {
            position: relative;
            padding: 0.5em 0.8em;
            background-color: #195786;
            color: #00eae9;

            &::after {
              content: "";
              position: absolute;
              top: 8px;
              left: -14px;
              width: 0px;
              height: 0px;
              border: 8px solid transparent;
              border-right-color: #195786;
            }
          }

          &-b {
            padding: 0.5em 0 0 1em;
            color: #c3c5cd;

            li {
              line-height: 1.5em;
            }
          }
        }
      }
    }
  }
}
</style>
