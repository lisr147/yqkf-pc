<template>
  <div class="meter-ring">
    <div
      class="ring-bg"
      :style="{ transform: `translate(-50%, -50%) scale(${size})` }"
    >
      <!--        静态文件引入build时出错-->
      <video :src="videoUrl" loop autoplay muted></video>
    </div>
    <div
      class="meter-ring-wrap"
      :style="{ transform: `translate(-50%, -50%) scale(${size})` }"
    >
      <div class="ring-main">
        <svg-ring :hasBlur="false" />
      </div>
      <div class="ring-text">
        <div class="ring-text-title" :style="{ color: '#fff' }">
          <count-to
            :start-val="0"
            :end-val="title.value"
            :decimals="0"
            :suffix="title.suffix"
            :duration="1000"
          />
        </div>
        <div class="ring-text-detail" :style="{ color: '#fff' }">
          {{ subTitle.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgRing from "./svg-ring.vue";
import CountTo from "vue-count-to";

export default {
  name: "ring-chart",
  components: {
    CountTo,
    SvgRing,
  },
  props: {
    series: { type: Object },
  },
  computed: {
    videoUrl() {
      //   return `http://localhost:8080/static/videos/ring-bg.mp4`;
      return `${process.env.VUE_APP_BASE_API}/static/videos/ring-bg.mp4`;
    },
  },
  watch: {
    series: {
      handler(val) {
        val.series.forEach((e, index) => {
          this.seriesData.push({
            label: val.yAxis[index],
            value: e,
          });
        });
        this.showIndex = 0;
        this.init();
      },
      deep: true,
    },
  },
  data() {
    return {
      title: {},
      subTitle: {},
      size: 1,
      seriesData: [],
      timer: null,
      showIndex: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      let { clientWidth, clientHeight } = this.$el;
      this.size = Math.max(1, Math.min(clientWidth, clientHeight) / 250);
    });
  },
  destroyed() {
    clearInterval();
    this.timer = null;
  },
  methods: {
    init() {
      try {
        // 求和
        let total = 0
        this.seriesData.forEach(e=>{
          total = e.value + total
        })
        if (this.timer) {
          clearInterval();
          this.timer = null;
        }
        this.title = {
          value: this.seriesData[this.showIndex].value*100/total,
          suffix: "%",
        };
        this.subTitle = { value: this.seriesData[this.showIndex].label };
        this.timer = setInterval(() => {
          this.title = {
            value: this.seriesData[this.showIndex].value*100/total,
            suffix: "%",
          };
          this.subTitle = { value: this.seriesData[this.showIndex].label };

          this.showIndex =
            this.showIndex < this.seriesData.length - 1 ? this.showIndex + 1 : 0;
        }, 5000);
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.meter-ring {
  position: relative;
  min-height: 200px;

  &-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250px;
    aspect-ratio: 12/7;
  }

  .ring-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250px;
    aspect-ratio: 12/7;
    mix-blend-mode: screen;

    video {
      width: 100%;
      height: 100%;
    }
  }

  .ring-main {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 160%;
    transform: translate3d(-50%, -50%, 0) rotateX(-65deg);
    text-align: center;
  }

  .ring-text {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -90%);
    display: flex;
    align-items: center;
    flex-direction: column;

    &-title {
      font-size: 32px;
      font-weight: bold;
    }

    &-detail {
      font-size: 14px;
    }
  }
}
</style>
