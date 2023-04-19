<template>
  <div class="diagnose-trace-dialog">
    <div class="title" v-if="trackData && trackData.name">
      <img src="../../assets/image/box_top.png" alt="" />
      <span>{{ trackData.name }}的活动轨迹</span>
      <div class="dialog-close" @click="closeDiagnoseDialog"></div>
    </div>
    <div class="content" v-if="trackData">
      <div class="nav" v-if="trackData.traces && trackData.traces.length">
        <el-carousel
          class="stripe-container"
          height="36px"
          :autoplay="false"
          :arrow="`${trackData.traces.length === 1 ? 'never' : 'always'}`"
          :indicator-position="`none`"
          :loop="false"
        >
          <el-carousel-item
            v-for="(tt, index) in trackData.traces"
            :key="index + 'parent'"
          >
            <div class="item">
              <div
                class="item-content"
                v-for="(item, idx) in tt"
                :key="idx + 'child'"
              >
                <div
                  :class="[
                    'nav-item',
                    showTraceIdx === idx + index * 4 ? 'active' : '',
                  ]"
                  @click="showTraceIdx = idx + index * 4"
                >
                  <span v-if="item.locusDate !== 'all'">
                    {{ item.locusDate.split("-").slice(1, 3).join("-") }}
                  </span>
                  <span v-else>全部</span>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="trace-list" v-if="traceDataList && traceDataList.length">
        <div
          class="trace-item"
          v-for="(item, index) in traceDataList"
          :key="index"
          @click="openPlaceDetail(item)"
        >
          <div class="item-number">{{ index + 1 }}</div>
          <div class="item-line"></div>
          <div class="item-right">
            <div class="trace-place">{{ item.csmc }}</div>
            <div class="trace-in">进：{{ item.jtime }}</div>
            <div class="trace-out">出：{{ item.ctime }}</div>
            <div class="trace-way">{{ item.csdz }}</div>
          </div>
        </div>
      </div>
      <div class="no-traces" v-else>暂无轨迹</div>
    </div>
    <diagnose-place-detail
      :placeDetail="placeDetail"
      @closeDetail="handleCloseDetail"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getMediaUrl } from "@/utils/common";
import DiagnosePlaceDetail from "./DiagnosePlaceDetail.vue";
import { GZ2000 } from "@/config/WMTS";
import Point from "@arcgis/core/geometry/Point";
export default {
  name: "DiagnoseTraceDialog",
  components: { DiagnosePlaceDetail },
  props: {
    tracePeopleId: {
      type: String,
    },
  },
  data() {
    return {
      showTraceIdx: 0,
      placeDetail: null,
    };
  },
  computed: {
    ...mapState("common", ["dispatchData"]),
    ...mapState("map", ["mapType"]),
    trackData() {
      const trackData = this.dispatchData.find(
        (item) => item.id === this.tracePeopleId
      );
      if (trackData) {
        // const trace = trackData.trace.slice(0, 3);
        // 过滤有途径场所的轨迹
        const trace = trackData.trace.filter((item) => item.zdcs.length > 0);
        // 添加全部轨迹
        if (trace[0]?.id) {
          // 获取近3天所有轨迹
          let allZdcss = [];
          trace
            .slice()
            .reverse()
            .forEach((trk) => {
              if (trk?.zdcs?.length) {
                allZdcss = allZdcss.concat(trk.zdcs);
              }
            });
          trackData.trace = [
            { id: null, locusDate: "all", zdcs: allZdcss },
            ...trace,
          ];
          trackData.traces = this.spliceIntoChunks(
            JSON.parse(JSON.stringify(trackData.trace)),
            4
          );
        }
        // 默认展示全部轨迹
        this.$emit("selectChange", {
          id: trackData.id,
          locusDate: trackData?.trace[this.showTraceIdx]?.locusDate,
        });
      }
      return trackData || {};
    },
    traceDataList() {
      if (!this.trackData.trace) {
        return [];
      }
      let list = this.trackData.trace[this.showTraceIdx].zdcs || [];
      list.forEach((v) => {
        const times = v.hdsj.split(",");
        v.jtime = times[0];
        v.ctime = times[1];
      });

      return list;
    },
  },
  watch: {
    tracePeopleId() {
      this.showTraceIdx = 0;
    },
    showTraceIdx(val) {
      const locusDate = this.trackData?.trace[val]?.locusDate;
      this.$emit("selectChange", { id: this.tracePeopleId, locusDate });
    },
  },
  mounted() {},
  methods: {
    getMediaUrl,
    openPlaceDetail(item) {
      this.placeDetail = item;
      const isGz2000 = this.mapType === "gz2000";
      const longitude = item[isGz2000 ? "gzLongitude" : "longitude"];
      const latitude = item[isGz2000 ? "gzLatitude" : "latitude"];
      // 地图移动至场所对应位置
      if (longitude && latitude) {
        const movePoint = new Point({
          x: longitude,
          y: latitude,
          spatialReference: { wkt: GZ2000.wkt },
        });
        this.$parent.$refs["baseMapLayer"].view.goTo({
          center: movePoint,
          zoom: 18,
        });
      }
    },
    handleCloseDetail() {
      this.placeDetail = null;
    },
    closeDiagnoseDialog() {
      this.$emit("closeTraceDialog", "", false);
    },
    /**
     * 拆分数组
     */
    spliceIntoChunks(arr, chunkSize) {
      const res = [];
      while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize);
        res.push(chunk);
      }
      return res;
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.diagnose-trace-dialog {
  position: fixed;
  top: 9em;
  left: 3em;
  color: #fff;
  .title {
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

    & > span {
      position: absolute;
      left: 42px;
      top: 10px;
      font-size: 20px;
      font-weight: 500;
      color: #eef2ff;
      line-height: 30px;
    }
    .dialog-close {
      width: 16px;
      height: 16px;
      background-image: url("../../assets/icons/close-icon.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }

  .content {
    position: fixed;
    box-sizing: border-box;
    top: 12em;
    left: 3em;
    color: #fff;
    width: 380px;
    height: calc(100vh - 193px);
    background: rgba(20, 37, 98, 0.7);
    border-left: 1px solid #385cd4;
    border-right: 1px solid #385cd4;
    margin: 0;

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
    .nav {
      display: flex;
      margin-bottom: 16px;
      margin-top: 16px;

      cursor: pointer;
      .nav-item {
        padding: 8px 12px;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        background: rgba(49, 157, 248, 0.15);
        border-radius: 2px;
        margin-right: 6px;
        &.active {
          background-color: #319df8;
        }
      }
    }
    .trace-list {
      overflow: auto;
      height: calc(100% - 84px);
      padding: 0 16px 16px;
      box-sizing: border-box;

      .trace-item {
        padding: 8px 16px 8px;
        margin-bottom: 10px;
        background: linear-gradient(
          315deg,
          rgba(79, 158, 253, 0.05) 0%,
          rgba(79, 158, 253, 0.2) 100%
        );
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        &:hover {
          background: linear-gradient(
            315deg,
            rgba(79, 158, 253, 0.15) 0%,
            rgba(79, 158, 253, 0.3) 100%
          );
        }
        .item-number {
          width: 30px;
          height: 30px;
          background: #4f9efe;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          position: absolute;
          left: 16px;
          top: 8px;
        }
        .item-line {
          width: 1px;
          background-color: #4f9efe;
          margin-top: 10px;
          position: absolute;
          left: 31px;
          top: 40px;
          bottom: 0;
        }
        .item-right {
          margin-left: 48px;
          .trace-place {
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .trace-in,
          .trace-out,
          .trace-way {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999eb1;
            line-height: 20px;
          }
        }
      }
    }

    .no-traces{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
    }
  }

  .diagnose-place-detail {
    .el-dialog__title {
      font-size: 20px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #ffffff;
    }
    .el-dialog__body {
      .title {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        &::before {
          content: "";
          width: 3px;
          height: 24px;
          background: #319df8;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
      .base-info {
        tr {
          td {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            margin-bottom: 16px;
            padding: 0.5em;
            span:first-child {
              color: #c3c5cd;
            }
          }
        }
      }
      .place-imgs {
        img {
          margin-right: 8px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
.stripe-container {
  width: 100%;
  .item {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    .item-content {
      //   flex: 1;
      //   display: flex;
    }
  }
}
::v-deep .el-carousel__arrow--right {
  right: -8px;
}
::v-deep .el-carousel__arrow--left {
  left: -8px;
}
</style>
