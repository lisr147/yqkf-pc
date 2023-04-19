<template>
<div class="device-detail">
  <el-dialog
    ref="dialog"
    v-dialogDrag
    :title="attributes.deviceName"
    top="20vh"
    @close="handleClose"
    :visible="showme"
    custom-class="device-detail-dialog"
    :modal="false"
    :close-on-click-modal="false"
    width="800px">

    <div v-if="loading">
    </div>
    <template v-else>
      <!--<camera :deviceUid="attributes.deviceUid" :deviceType="attributes.deviceType"></camera>-->
      <component :is="module" :attributes="attributes"></component>
    </template>

    <b class="stick" @click="stickToBoxs"></b>
  </el-dialog>
</div>
</template>

<script>
// import {getIotDeviceDetail} from '@/api/szg'
import { DeviceMap } from "@/config/setting";

import Camera from "@/components/Seal/Camera.vue";
// import EmptyBox from "@/components/EmptyBox"

export default {
  name: "DeviceDetail",
  components: {
    Camera,
  },
  props: {
    showme: { type: Boolean },
    attributes: { type: Object },
  },
  model: {
    prop: "showme",
    event: "toggle",
  },
  data() {
    return {
      loading: true,
      module: null,
      detail: {},
    };
  },
  watch: {
    attributes(obj) {
      console.log(obj);
      if (Object.keys(obj).length <= 0) {
        return;
      }
      this.getDetail()
    },
    showme(val) {
      if (val == false) {
        this.loading = true;
      }
    },
  },
  computed: {
    title() {
      return this.detail.deviceName || "设备详情";
    },
  },
  mounted() {},
  methods: {
    getDetail() {
      const { deviceType } = this.attributes
      const fn = DeviceMap[deviceType].fn

      //根据设备类型加载对应组件
      this.module = ()=> import(`@/components/Seal/${fn}.vue`)
      this.loading = false

    },
    stickToBoxs() {
      this.handleClose();

      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
        this.$refs["dialog"].$el.children[0];
      const { deviceUid } = this.attributes;

      this.$store.commit("ADD_FLOATING", {
        data: this.attributes,
        style: {
          top: offsetTop,
          left: offsetLeft,
          width: offsetWidth,
          height: offsetHeight,
          zIndex: 0,
        },
        type: "StickPanel",
        id: deviceUid,
      });
    },
    handleClose() {
      this.$emit("toggle", false);
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.device-detail {
  .device-detail-dialog{
    pointer-events: auto;
  }
  // .el-dialog__wrapper {
  //   pointer-events: none; // 可点击dialog区域外的html元素
  // }
  .el-dialog {
    border: 1px solid #09a3e6;
    border-radius: 0;
    color: #fff;
    background-color: rgba(20, 63, 103, 0.9) !important;
    pointer-events: auto;

    &.draging {
      cursor: move;
    }

    .stick,
    .sticked{
      position: absolute;
      top: -8px;
      right: 2.5em;
      width: 40px;
      height: 40px;
      cursor: pointer;
      background:url("~@/assets/image/ico-stick1.svg") center center no-repeat;
      opacity: 0.5;

      &:hover{
        opacity: 1;
      }
    }
    .sticked{
      background:url("~@/assets/image/ico-stick2.svg") center center no-repeat;
      right: 0.5em;
    }

    &__header {
      padding: 8px 20px !important;
      background-image: linear-gradient(
        90deg,
        rgba(15, 53, 95, 1) 60%,
        rgba(20, 63, 103, 0.6)
      );
    }
    &__title {
      color: #fff !important;
    }
    &__headerbtn {
      top: 12px !important;
      right: 12px !important;
      font-weight: bolder;
    }
    &__close {
      color: #fff !important;
    }
    &__body {
      padding: 10px 10px !important;
      background: transparent;
      min-height: 200px;
      color: #fff !important;
      & > div {
        transition: height 0.4s;
      }
    }
  }
}
</style>
