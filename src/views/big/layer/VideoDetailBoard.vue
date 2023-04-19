<template>
  <div
    class="el-dialog"
    v-dialogDrag
    style="width: 900px; z-index: 99999"
    v-if="visible"
  >
    <div class="el-dialog__header">
      <div>实时视频</div>
      <button
        type="button"
        aria-label="Close"
        class="el-dialog__headerbtn"
        @click="close()"
      >
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </button>
    </div>
    <div class="el-dialog__body">
      <div class="video-detail-board">
        <div class="video-detail-board-wrap" :class="dynamicClass">
          <div
            class="vbox"
            v-for="(item, index) in $store.state.map.floatVideoList"
            :key="index"
          >
            <video-player
              :ref="'player_' + index"
              :title="item.name"
              :isLive="true"
              :videoUrl="item.url"
              :videoInfo="item.videoInfo"
              :index="index === 0 ? index + '' : item.deviceUid"
            ></video-player>
            <div class="vbox-tool">
              <i
                class="el-icon-delete icon"
                title="删除"
                @click="removeItem(index)"
              ></i>
              <i
                class="el-icon-refresh icon"
                title="刷新"
                @click="refreshItem(index)"
              ></i>
            </div>
          </div>
          <div
            class="vbox"
            v-if="[3, 5, 7].includes($store.state.map.floatVideoList.length)"
          ></div>
        </div>
        <!--一个视频都没有-->
        <!--<data-empty-box v-if="list.length==0" title="暂无视频"/>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
// import DataEmptyBox from "./DataEmptyBox";
// import VideoPlayer from "@/components/EasyPlayer/VideoPlayer.vue"

export default {
  name: "VideoDetailBoard",
  components: {
    // DataEmptyBox,
    VideoPlayer: () => import("@/components/EasyPlayer/VideoPlayer.vue"),
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    // ...mapState('map', {
    //   list: state => state.floatVideoList
    // }),
    dynamicClass() {
      return this.$store.state.map.floatVideoList.length > 4
        ? "grid9"
        : this.$store.state.map.floatVideoList.length > 1
        ? "grid4"
        : "grid1";
    },
  },
  watch: {
    //视频有增加
    "$store.state.map.floatVideoList.length"(nVal) {
      if (nVal) {
        setTimeout(() => {
          // 当前为多屏画面时,驱使海康播放器画面适应新窗口大小
          this.$store.state.map.floatVideoList.forEach((item, index) => {
            if (
              this.$refs[`player_${index}`][0].$refs.hasOwnProperty(
                "H5player"
              ) &&
              this.$refs[`player_${index}`][0].$refs.H5player.player
            ) {
              this.$refs[
                `player_${index}`
              ][0].$refs.H5player.player.JS_Resize();
            }
          });
        }, 500);
      }
    },
  },
  mounted() {},
  methods: {
    ...mapMutations("map", ["ADD_VIDEO", "DELETE_VIDEO", "CLEAN_VIDEO"]),
    ...mapActions("map", ["refreshVideo"]),

    close() {
      this.$store.commit("map/CLEAN_VIDEO");
      this.hide();
    },

    removeItem(index) {
      this["DELETE_VIDEO"](index);

      // 解决当前为多屏画面时,删除海康播放器组件被复用问题
      if (
        this.$refs[`player_${index + 1}`][0].$refs.hasOwnProperty("H5player") &&
        this.$store.state.map.floatVideoList.length
      ) {
        this.$store.state.map.floatVideoList.forEach((item, _index) => {
          if (
            _index >= index &&
            _index + 1 <= this.$store.state.map.floatVideoList.length
          ) {
            if (
              this.$refs[`player_${_index + 1}`][0].$refs.hasOwnProperty(
                "H5player"
              ) &&
              this.$refs[`player_${_index + 1}`][0].$refs.H5player.player
            ) {
              this.$refs[`player_${_index}`][0].$refs.H5player.play(
                item.videoInfo.url
              );
            }
          }
        });
      }
    },

    refreshItem(index) {
      this.refreshVideo(index);

      if (
        this.$refs[`player_${index}`][0].$refs.hasOwnProperty("H5player") &&
        this.$refs[`player_${index}`][0].$refs.H5player.player
      ) {
        let item = this.$store.state.map.floatVideoList[index];
        this.$refs[`player_${index}`][0].$refs.H5player.play(
          item.videoInfo.url
        );
      }
    },

    show() {
      this.visible = true;
    },

    hide() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" type="text/scss">
.video-detail-popup {
  z-index: 99999;
}
.el-dialog__body{
//   padding-top: 30px !important;
//   padding-bottom: 30px !important;
}
.video-detail-board {
  padding: 32px 0 16px;
  color: #fff;
  min-height: 200px;

  &-head {
    border-bottom: 1px solid #fff;

    .el-icon-close {
      position: absolute;
      top: 4px;
      right: 10px;
    }
  }

  &-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .vbox {
    position: relative;
    // background-color: #000;

    &-tool {
      display: none;
      position: absolute;
      top: 3em;
      right: 1em;
      z-index: 999;

      .icon {
        margin: 0 0.5em;
        cursor: pointer;
      }
    }

    &:hover {
      .vbox-tool {
        display: block;
      }
    }
  }

  .grid1 {
    .vbox {
      flex: 1;
      height: 480px;
    }
  }

  .grid4 {
    .vbox {
      margin: 10px;
      width: calc(50% - 20px);
      height: 230px;
    }
  }

  .grid9 {
    .vbox {
      margin: 10px;
      width: calc(33.3% - 20px);
      height: 150px;
    }
  }
}
</style>
