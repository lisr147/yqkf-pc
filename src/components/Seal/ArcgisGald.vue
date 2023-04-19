<template>
  <div class="layer">
    <div class="arrow-box" v-if="popullationNum" @click="leftPopullationVisible = !leftPopullationVisible">
      <i class="arrow-icon" :class="[leftPopullationVisible?'el-icon-arrow-left' :'el-icon-arrow-right']"></i>
    </div>
    <div class="popullation" v-if="popullationNum" :class="{'p-hide':!leftPopullationVisible}">
      <div class="popullation-body">
        <div class="popullation-item" v-for="(item, index) in popullationNum" :key="index">
          <label>{{ item.suffix }}</label>
          <span><b class="prim">{{ item.num }}</b> km²</span>
        </div>
        <div class="popullation-item tlink">
          <span @click="viewDetail"><i class="el-icon-info" @click="viewDetail" ></i> 分级管理措施</span>
        </div>
      </div>
    </div>

    <div class="popullation pr" v-if="description">
      <div class="popullation-body">
        <div class="popullation-item" v-for="(item, index) in description" :key="index">
          <i v-if="item.color" :style="{backgroundColor: item.color}" class="dot"></i>
          <label v-html="item.suffix"></label>
          <span><b class="prim">{{ item.num }}</b> 人</span>
        </div>
      </div>
    </div>
    <policy-detail v-model="policyDetailVisible"></policy-detail>
  </div>
</template>
<script>

import PolicyDetail from './PolicyDetail.vue';
export default {
  components: { PolicyDetail },
  name: "ArcgisGald",
  data() {
    return {
      popullationNum: null,
      description:null,
      policyDetailVisible:false,
      leftPopullationVisible: true
    };
  },
  async mounted() {
    this.popullationNum = [
      {suffix: "封闭管理区", num: "0.16",},
      {suffix: "封控管理区", num: "3",},
      {suffix: "防控区", num: "28",},
      {suffix: "健康管理区", num: "156",}
    ];

    this.description = [
      {suffix: "封闭管理区",num: "3729", color: '#f00'},
      {suffix: "封控管理区",num: "23000",color: '#ff9800 '},
      {suffix: "防控区",num: "36158",color: '#3266ff'},
      {suffix: "健康管理区<br/>(常住)",num: "127036",color: '#3bd0fd'},
    ]
  },
  methods: {

    viewDetail(){
      this.policyDetailVisible = true
    }

  },
};
</script>
<style lang="scss" type="text/scss" scoped>
@keyframes showIn {
  0% {
    opacity: 0;
    transform: scale(0);
    transform-origin: left top;
  }
  100% {
    opacity: 1;
    transform: scale(1);
    transform-origin: left top;
  }
}
.layer {
  z-index: 2;
  position: fixed;
  background-color: #f00;
  .arrow-box {
    position: absolute;
    top: 120px;
    transform: translateY(-50%);
    left: 30px;
    background: #0f286a;
    border-radius: 4px;
    padding: 8px 4px;
    cursor: pointer;
  }
  .arrow-icon {
    color: #fff;
    background: #0f286a;
  }
  .popullation {
    position: fixed;
    top: 100px;
    left: 60px;
    color: #ffffff;
    line-height: 30px;
    animation: showIn 0.5s;
    box-sizing: border-box;
    border: 10px solid;
    border-image: url('~@/assets/image/community/rect-btn.png') 10;
    background: transparent;
    transition: all .5s;
    opacity: 1;
    &.p-hide {
      left: -300px;
      opacity: 0;
    }
    &.pr{
      top: 100px;
      right: 60px;
      left: inherit;
    }

    img {
      display: block;
    }
    &-body {
      position: relative;
      padding: 0px 20px;
      line-height: 40px;
      font-size: 16px;

      &:before{
        @include adaptBox(#0f286a)
      }

      label {
        display: inline-block;
        width: 100px;
        vertical-align: middle;
        line-height: 1.6em;
      }
      span {
        vertical-align: middle;
      }
      .prim{
        color: #fff000;
        font-size: 20px;
        font-family: BeBas;
        font-weight: normal;
      }
    }
    &-item{
      position: relative;

      .dot{
        position: absolute;
        top: 20px;
        left: -20px;
        width: 10px;
        height: 6px;
        background-color: #fff000;
      }
    }

    .tlink{
      cursor: pointer;
      opacity: 0.5;

      &:hover{
        opacity: 1;
      }
    }
  }

}
</style>
