<template>
  <div class="el-dialog diagnose-place-detail" v-if="placeDetail" v-dialogDrag>
    <div class="el-dialog__header">
      <span class="el-dialog__title">{{ placeDetail.csmc || "-" }}</span>
      <button type="button" class="el-dialog__headerbtn" @click="closeDetail">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </button>
    </div>

    <div class="el-dialog__body">
      <div class="title">基本信息</div>
      <table class="base-info">
        <tr>
          <td>
            <span>进入场所时间：</span
            ><span>{{ placeDetail.jtime || "-" }}</span>
          </td>
        </tr>
        <tr>
            <td>
            <span>离开场所时间：</span
            ><span>{{ placeDetail.ctime || "-" }}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>场所电话：</span><span>{{ placeDetail.csdh || "-" }}</span>
          </td>
        </tr>
        <tr>
            <td>
            <span>场所地址：</span><span>{{ placeDetail.csdz || "-" }}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>备注：</span><span>{{ placeDetail.ldcszbxx || "-" }}</span
            ><span></span>
          </td>
        </tr>
      </table>

      <div class="title">现场照片</div>

      <div class="place-imgs">
        <data-empty-box v-if="imgList.length == 0" title="暂无图片" />
        <el-image
          class="img-item"
          v-for="(id, idx) in imgList"
          :key="idx"
          :src="id"
          :preview-src-list="imgList"
          fit="cover"
        >
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
    </div>
  </div>
</template>

  <script>
import DataEmptyBox from "@/views/big/layer/DataEmptyBox";

import { getMediaUrl } from "@/utils/common";
export default {
  name: "DiagnosePlaceDetail",
  components: { DataEmptyBox },
  props: {
    placeDetail: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {};
  },
  computed: {
    imgList() {
      let pics = this.placeDetail.ldcsrypclb || [];
      return pics.map((id) => getMediaUrl(id));
    },
  },
  watch: {},
  mounted() {},
  methods: {
    getMediaUrl,
    closeDetail() {
      this.$emit("closeDetail");
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.diagnose-place-detail {
  width: 640px;
  overflow-x: hidden;
  right: 3em;
  left: unset;
  margin: 0;
  transform: none;
  z-index: 11111111;
  .el-dialog__title {
    font-size: 20px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #ffffff;
  }
  .el-dialog__body {
    max-height: 700px;
    overflow-y: scroll;
    .title {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 16px;
      padding-left: 16px;
      position: relative;
      &:nth-of-type(2) {
        margin-top: 24px;
      }
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
      width: 100%;
      tr {
        width: 100%;
        td {
          font-size: 18px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          padding: 8px 0;
          width: 100%;
          box-sizing: border-box;
          &:nth-of-type(2) {
            padding-left: 16px;
          }
          span:first-child {
            color: #c3c5cd;
          }
        }
      }
    }

    .place-imgs {
      min-height: 200px;
      .img-item {
        width: calc((100% - 24px) / 2);
        height: 160px;
        margin-bottom: 2em;
        box-sizing: border-box;
        &:nth-child(odd) {
          margin-right: 24px;
        }
        .image-slot{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        ::v-deep .el-image__inner {
          width: 100%;
          height: 100%;
          // margin: 0 auto;
          display: block;
          border-radius: 4px;
          position: absolute;
          left: 0;
        }
      }
    }
  }
}
</style>
