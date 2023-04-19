<template>
  <el-dialog
    v-dialogDrag
    width="96vw"
    :visible="true"
    :modal="false"
    :close-on-click-modal="false"
    @close="$emit('close')"
    title="流调数据总览"
    custom-class="data-total-dialog"
  >
    <DataTotal />
  </el-dialog>
</template>
<script>
import DataTotal from "@/views/dataService/dataTotal.vue";
export default {
  name: "big-data-total",
  components: {
    DataTotal,
  },
};
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
        span{
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
</style>