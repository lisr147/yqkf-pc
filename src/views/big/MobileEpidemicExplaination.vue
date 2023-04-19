<template>
  <div class="explaination" @click="handleClose">
    <div class="tool">
      <!-- <button
        type="info"
        size="small"
        icon="cross"
        @click="handleClose"
        color="#4170f2"
      ></button> -->
      <span>{{ title }}</span>
    </div>
    <section>
      <div class="item" v-for="(item, index) in txtList" :key="index">
        {{ item.txt }}
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    txtList: {
      type: Array
    },
    title: {
      type: String,
      default: "数据说明"
    }
  },
  name: "EpidemicExplaination",
  methods: {
    handleClose() {
      this.$emit("closed");
    }
  }
};
</script>

<style lang="scss" type="text/scss" scpoed>
.explaination {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0,0,0,.7);
  z-index: 99999;
  overflow: auto;
  padding: 20px;
  // .tool {
  //   // position: relative;
  //   // padding: 0.5em 2.5em;
  //   // min-height: 2em;
  //   // line-height: 2em;
  //   // z-index: 1;
  //   // background-color: #4170f2;
  //   // color: #fff;
  //   // text-align: center;

  //   // .van-button {
  //   //   position: absolute;
  //   //   top: 0.5em;
  //   //   left: 0em;
  //   //   min-width: 40px;
  //   // }
  // }
  section {
    // margin: 0 0 1em;
    // position: relative;
    // padding: 1em;
    // border-radius: 4px;
    // background-color: #fff;

    h2 {
      font-size: 16px;
      // font-weight: bold;
    }

    .item {
      text-align: justify;
      margin: 1em;
    }
  }
}
</style>
