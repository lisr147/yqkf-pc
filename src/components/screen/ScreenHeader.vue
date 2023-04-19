<template>
  <div class="screen-header">
    <!-- 左侧tabs -->
    <div class="button-group left" v-if="navItemVisible">
      <template v-for="item in navList.leftSide">
        <div :key="item.id" v-if="item.children" class="menu-item">
          <div class="button">{{ item.label }}</div>
          <ul class="menu-item-sub">
            <li
              v-for="subItem in item.children"
              @click="handleNavItemClick(subItem)"
              :key="subItem.id"
            >
              {{ subItem.label }}
            </li>
          </ul>
        </div>
        <div
          class="button"
          v-else
          :key="item.id"
          :class="{ active: layer == item.id }"
          @click="handleNavItemClick(item)"
        >
          {{ item.label }}
        </div>
      </template>
    </div>
    <!-- 右侧tabs -->
    <div class="button-group right" v-if="navItemVisible">
      <template v-for="item in navList.rightSide">
        <div :key="item.id" v-if="item.children" class="menu-item">
          <div class="button">{{ item.label }}</div>
          <ul class="menu-item-sub">
            <li
              v-for="subItem in item.children"
              @click="handleNavItemClick(subItem)"
              :key="subItem.id"
            >
              {{ subItem.label }}
            </li>
          </ul>
        </div>
        <div
          class="button"
          v-else
          :key="item.id"
          :class="{ active: layer == item.id }"
          @click="handleNavItemClick(item)"
        >
          {{ item.label }}
        </div>
      </template>
    </div>

    <div class="button-group end">
      <div class="menu-item">
        <div class="info" :title="username">
          <i class="el-icon-user-solid"></i>
          {{ userInfo.fullName || userInfo.username }}
          <i class="el-icon-arrow-down" />
        </div>
        <ul class="menu-item-sub tr">
          <li
            v-for="item in navList.actionBar"
            :key="item.id"
            @click="handleNavItemClick(item)"
          >
            <i class="iconfont el-icon-s-home"></i> {{ item.label }}
          </li>
        </ul>
      </div>
    </div>

    <div class="main" :style="`background-image:url(${bgUrl})`">
      <div class="support">
        <span>技术支持：中科智城</span>
      </div>
    </div>
    <div class="fbtn" @click="exit" v-show="isFullScreen">
      <img style="vertical-align: middle" src="@/assets/image/ico-full.svg" />
    </div>
  </div>
</template>

<script>
import { exitFullScreen } from "@/utils/global.js";
import { removeToken } from "@/utils/auth";
export default {
  name: "ScreenHeader",
  props: {
    layer: {
      type: [Number, String]
    },
    navItemVisible: {
      type: Boolean,
      default: function() {
        return true;
      }
    }
  },
  components: {},
  data() {
    return {
      showMore: false,
      activeIndex: 0,
      navList: {
        leftSide: [
          { label: "首页", id: 20 },
          { label: "云上方舱", id: "cabin" },
          { label: "疫苗接种", id: 6 },
          // { label: "告警事件", id: 9 },
          // { label: "负压车辆", id: 10 },
          { label: "城中村治理", id: "cityVillage" },
          { label: "志愿者统计", id: "volunteer" },
          {
            label: "更多",
            id: "more",
            width: "100",
            children: [
              { label: "AI智能分析", id: "ai" },
              { label: "核酸检测", id: 7 },
              { label: "流调数据总览", id: 5 },
              { label: "告警事件", id: 9 },
              { label: "负压车辆", id: 10 },
              { label: "舆情分析", id: "publicOpinion" },
              { label: "核酸采样点推荐", id: 13, width: "auto" }
            ]
          }
        ],
        rightSide: [
          { label: "调度中心", id: "zhdd" },
          // { label: '密接次密接人员核查', id: 12 },
          {
            label: "任务核查",
            width: "auto",
            children: [
              { label: "密接次密接人员核查", id: 12 },
              { label: "购药核查", id: 14 }
            ]
          },
          { label: "涉疫地区来南沙人员", id: 11, width: "auto" }
        ],
        actionBar: [
          { label: "数据台账系统", id: "dataAdmin" },
          { label: "AI智能分析后台", id: "aiAdmin" },
          { label: "数据说明", id: "dataSpecification" },
          { label: "登出", id: "logout" }
        ]
      },
      streetList: [
        "榄核镇",
        "南沙街",
        "横沥镇",
        "珠江街",
        "万顷沙镇",
        "大岗镇",
        "龙穴街",
        "东涌镇",
        "黄阁镇"
      ]
    };
  },
  computed: {
    isReportEdit() {
      return this.$store.state.report.isEdit;
    },
    isFullScreen() {
      return this.$store.state.common.isFullScreen;
    },
    backToIndexVisible() {
      return (
        this.$route.path.includes("/sealarea") ||
        location.href.includes("sealarea.html")
      );
    },
    bgUrl() {
      //   return require(`@/assets/image/${
      //     location.href.includes("sealarea.html") ? "head-bg2" : "head-bg1"
      //   }.png`);
      return require(`@/assets/image/head-bg1.png`);
    },
    menuData() {
      return this.$store.state.authority.menuData.filter(
        v => v.path !== "/big/index"
      );
    },
    username() {
      return this.$store.state.user.username;
    },
    userInfo() {
      return this.$store.state.user;
    }
  },
  mounted() {},
  methods: {
    exit() {
      this.$store.commit("common/SET_IS_FULLSCREEN", false);
      exitFullScreen();
    },
    handleEditLayout() {
      this.$store.commit("report/CHANGE_EDIT");
    },
    handleSaveLayout() {
      this.$store.commit("report/SWITCH_SAVING", true);
    },
    handleCancel() {
      this.$store.commit("report/SWITCH_CANCEL", true);
    },
    gotoPage(url) {
      location.href = url || "./index.html#/big/index";
    },
    handleNavItemClick(item) {
      console.log("item", item.id);
      switch (item.id) {
        case "zhdd":
          window.open("/yqfk-dispatch/index.html?fromPortal=true");
          break;
        case "cabin":
          window.open("http://157.255.122.79:18000/chinaunicom-digitward-portal-web-view/#/login?redirect=%2F",'_blank');
          break;
        case "cityVillage":
          // window.open("http://172.29.1.186/community-tf/#/overview", "_blank");
          // window.open("/yqfk/transferPage.html#/transferPage", "_blank");
          let routeData = this.$router.resolve({ path: '/transferPage'});
          window.open(routeData.href, '_blank');
          break;
        case "ai":
          if (this.streetList.includes(this.$store.state.user.departmentName)) {
            window.open(
              "http://172.29.1.167/nanshaAI-dashboard/#/nanshaAI?streetName=" +
                this.$store.state.user.departmentName,
              "_blank"
            );
          } else {
            window.open(
              "http://172.29.1.167/nanshaAI-dashboard/#/nanshaAI",
              "_blank"
            );
          }
          break;
        case "aiAdmin":
          if (this.streetList.includes(this.$store.state.user.departmentName)) {
            window.open(
              "http://172.29.1.167/dashboard-front?streetName=" +
                this.$store.state.user.departmentName,
              "_blank"
            );
          } else {
            window.open("http://172.29.1.167/dashboard-front", "_blank");
          }
          break;
        case "logout":
          removeToken();
          document.location.href =
            document.location.origin +
            "/yqfk/tenant_logout#url=" +
            encodeURIComponent(document.location.href);
          break;
        case "dataAdmin":
          if (this.menuData.length == 0) {
            return this.$message({ type: "warning", message: "用户无权限" });
          } else {
            this.gotoPage(`./index.html#${this.menuData[0].path}`);
          }
          break;
        case 20:
          if (this.layer === 20) {
            this.$emit("layer", 0);
          } else {
            this.$emit("layer", item.id);
          }
          break;
        default:
          this.$emit("layer", item.id);
          break;
      }
    }
  }
};
</script>

<style lang="scss" type="text/scss">
.screen-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 9999;
  color: #fff;
  background-image: linear-gradient(
    0deg,
    rgba(8, 32, 71, 0) 10%,
    rgba(8, 32, 71, 1) 40%
  );

  .main {
    text-align: center;
    img {
      width: 100%;
      max-width: 1902px;
    }
    height: 85px;
    background-size: auto 100%;
    background-position: 50% 50%;
  }
  .fbtn {
    position: absolute;
    top: 1em;
    right: 1em;
    cursor: pointer;
    color: #fff;
  }

  .support {
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
  }

  .menu-item {
    position: relative;
    color: #fff;

    &-sub {
      position: absolute;
      top: 26px;
      left: 6px;
      width: 160px;
      height: 0;
      padding: 10px 0 0;
      opacity: 0;
      overflow: hidden;
      transition: all 0.5s ease-in-out;

      li {
        padding: 0.6em;
        cursor: pointer;
        background-color: rgba(10, 33, 83, 0.8);

        &:first-child {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
        &:last-child {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        &:hover,
        &.active {
          background-color: #1e4ccd;
        }
      }
    }

    &:hover {
      .menu-item-sub {
        height: auto;
        opacity: 1;
      }
    }

    .tr {
      left: inherit;
      right: 2px;
    }

    .info {
      cursor: pointer;
      max-width: 120px;
      line-height: 2em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .button-group {
    display: flex;
    position: absolute;
    top: 6px;
    &.left {
      left: 10px;
    }
    &.right {
      right: 140px;
    }
    &.end {
      right: 10px;
    }

    .button {
      display: inline-block;
      margin: 0 4px;
      padding: 0.4em 0.5em;
      min-width: 80px;
      line-height: 1.2em;
      border: 2px solid #1a449c;
      background-color: #1a2446;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      text-align: center;
      box-shadow: 0 0 5px #2f2d91 inset;
      transition: all 0.2s ease-in-out;

      &:hover {
        border-color: #2256cb;
      }
      &.active {
        border-color: #01e6ff;
        box-shadow: 0 0 5px #01e6ff inset;
        color: #01e6ff;
        background-color: #122662;
      }
    }
  }
}
</style>
