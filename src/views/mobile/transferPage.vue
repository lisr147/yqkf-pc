<template>
  <div class="big-container screen-wrap">
    <div class="screen-header" @click="openOverview">
      <div class="main" :style="`background-image:url(${bgUrl})`">
      </div>
    </div>
    <czcPanel></czcPanel>
  </div>
</template>
<script>
import czcPanel from "@/views/czcPanel/czcPanel.vue";
export default {
  name: "transferPage",
  components:{
    czcPanel
  },
  data() {
    return {
    };
  },
  computed:{
    bgUrl() {
      return require(`@/assets/image/head-top.svg`);
    },
  },
  methods:{
    openOverview(){
      // window.open("http://172.29.1.186/community-tf/#/overview",'_self');
      window.open("http://172.29.1.186/community-tf/#/overview?businessId=8a6010da6d134f0aa08ad995e007556e",'_self');
    }
  },
   mounted() {
     // window.open("http://172.29.1.186/community-tf/#/overview",'_self');
  },
};
</script>
<style lang="scss" scoped>
.big-container{
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #20326f;
}
.screen-header{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 76px;
  z-index: 9999;
  color: #fff;
  cursor: pointer;
  background-image: linear-gradient(
      0deg,
      rgba(8, 32, 71, 0) 10%,
      rgba(8, 32, 71, 1) 40%
  );

  .main {
    text-align: center;
    height: 80px;
    background-size: auto 100%;
    background-position: 50% 50%;
    img {
      width: 100%;
      max-width: 1902px;
    }
  }
}
</style>
