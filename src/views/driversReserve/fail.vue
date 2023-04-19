<template>
  <div class="fail-page">
    <div class="fail">
      <van-icon name="fail" color="#FFFFFF" size="60px"/>
    </div>
    <div class="title">预约失败</div>
    <div class="info">{{errorInfo}}</div>
  </div>
</template>

<script>
export default {
  name: 'codePage',
  props: {
    errorInfo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.fail-page {
  width: 100%;
  height: 100%;
  position: relative;
  .fail {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 80px;
    background-color: #D7D7D7;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-weight: 500;
    color: #000000;
    font-size: 20px;
    font-weight: 600;
    position: absolute;
    bottom: 80px;
    width: 100%;
    text-align: center;
  }
  .info {
    color: #9AA0A3;
    font-size: 14px;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 40px;
  }
}
</style>