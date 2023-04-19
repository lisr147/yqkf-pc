<!--穗货运乘车人详情-->
<template>
  <div class="card">
    <div class="gird" v-for="(item,index) in data" :key="item.id">
      <div class="tip">乘车人信息</div>
      <div class="row">
        <label class="title">姓名</label>
        <label class="value">{{item.name}}</label>
      </div>
      <div class="row">
        <label class="title">联系电话</label>
        <label class="value">{{item.mobile}}</label>
      </div>
      <div class="row">
        <label class="title">证件号</label>
        <label class="value">{{item.idNo}}</label>
      </div>
      <div class="row">
        <label class="title">证件类型</label>
        <label class="value">{{item.idType}}</label>
      </div>
      <div class="row">
        <label class="title">是否司机</label>
        {{item.isDriver===0?'否':'是'}}
      </div>
      <div class="row">
        <label class="title">⾏程码是否带星</label>
        <label class="value">
          {{item.isTraceStar===0?'否':'是'}}
        </label>
      </div>
      <div class="row" v-if="item.isTraceStar===1">
        <label class="title">带星原因</label>
        <label class="value">
          {{item.traceStarRemark}}
        </label>
      </div>
      <div class="row">
        <label class="title">是否住宿</label>
        <label class="value">
          {{item.isLodging===0?'否':'是'}}
        </label>
      </div>
      <div class="row" v-if="item.isLodging===1">
        <label class="title">留宿地址</label>
        <label class="value">{{item.lodgingAddress}}</label>
      </div>
      <div class="row">
        <label class="title">落地核酸</label>
        <label class="value">
          <template v-if="item.nuclTest===0"></template>
          <template v-else-if="item.nuclTest===1">正常</template>
          <template v-else>未做</template>
        </label>
      </div>
      <div class="row">
        <label class="title">是否曾经阳性</label>
        <label class="value">
          {{item.unusual===0?'否':'是'}}
        </label>
      </div>
      <div class="row">
        <label class="title">健康码截图</label>
        <label class="value">
          <template v-for="i in item.healthFiles">
            <img alt="" :src="i" >
          </template>
        </label>
      </div>
      <div class="row">
        <label class="title">核酸检测码截图</label>
        <label class="value">
          <template v-for="i in item.reportFiles">
            <img alt="" :src="i" >
          </template>
        </label>
      </div>
      <div class="row">
        <label class="title">行程码截图</label>
        <label class="value">
          <template v-for="i in item.traceFiles">
            <img alt="" :src="i" >
          </template>
        </label>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "drivers",
  props: ["data"],
  data() {
    return {};
  },
  async mounted() {

  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.card{
  margin: 10px 0;
}
.gird {
  .tip{
    font-size: 16px;
    font-weight: bold;
    margin: 15px 0 5px;
  }
  .row {
    line-height: 200%;
    display: flex;
    justify-content: space-between;
    .title {
      width: 40%;
      font-weight: 600;
      flex-shrink: 0;
    }
    img{
      width: 100%;
      margin: 10px 0;
    }
  }
}
</style>
