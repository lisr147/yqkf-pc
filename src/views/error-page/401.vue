<template>
  <div class="page flex-col">
    <div class="block1 flex-col">
      <div class="outer2 flex-col">
        <div class="bd4 flex-col">
          <div class="bd1 flex-col"></div>
          <span class="txt1">您没有访问权限</span>
          <div class="main1 flex-col">
            <div class="group3 flex-row justify-between">
              <div class="box1 flex-col"></div>
              <span class="info1"
                >若您的账号是粤政易的账号，请联系上级主管部门开通权限，再登录！</span
              >
            </div>
          </div>
        </div>
        <img
          class="img1"
          referrerpolicy="no-referrer"
          src="@/assets/image/error/1.png"
        />
      </div>
      <button class="main2 flex-col" @click="onClick_1">
        <span class="word2">返回登录页</span>
      </button>
    </div>
  </div>
</template>
<script>
import { removeToken } from '@/utils/auth'
export default {
  data () {
    return {
      constants: {}
    }
  },
  methods: {
    onClick_1 () {
      removeToken()
      document.location.href = document.location.origin + '/yqfk/tenant_logout'
    }
  }
}
</script>
<style lang="scss" scoped>
button {
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  outline: none;
  background-color: transparent;
}

button:active {
  opacity: 0.6;
}
.flex-col {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.justify-start {
  display: flex;
  justify-content: flex-start;
}
.justify-center {
  display: flex;
  justify-content: center;
}

.justify-end {
  display: flex;
  justify-content: flex-end;
}
.justify-evenly {
  display: flex;
  justify-content: space-evenly;
}
.justify-around {
  display: flex;
  justify-content: space-around;
}
.justify-between {
  display: flex;
  justify-content: space-between;
}
.align-start {
  display: flex;
  align-items: flex-start;
}
.align-center {
  display: flex;
  align-items: center;
}
.align-end {
  display: flex;
  align-items: flex-end;
}

.page {
  position: relative;
  height: 100vh;
  background-color: rgba(255, 255, 255, 1);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.block1 {
  width: 1366px;
  height: 626px;
}

.outer1 {
  width: 1366px;
  height: 50px;
  background-color: rgba(233, 237, 242, 1);
}

.outer2 {
  z-index: 4;
  height: 420px;
  background: url('../../assets/image/error/4.png') 100% no-repeat;
  width: 500px;
  position: relative;
  margin: 0px 0 0 433px;
}

.bd4 {
  width: 310px;
  height: 231px;
  margin: 181px 0 0 158px;
}

.bd1 {
  width: 155px;
  height: 73px;
  background: url('../../assets/image/error/3.png') 0px -1px no-repeat;
  margin-left: 9px;
}

.txt1 {
  width: 140px;
  height: 28px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(12, 16, 20, 1);
  font-size: 20px;
  font-family: PingFangSC-Medium;
  white-space: nowrap;
  line-height: 28px;
  text-align: left;
  margin-top: 56px;
}

.main1 {
  height: 62px;
  background-color: rgba(232, 232, 232, 1);
  margin-top: 12px;
  width: 310px;
  opacity: 1;
}

.group3 {
  width: 281px;
  height: 44px;
  margin: 9px 0 0 16px;
}

.box1 {
  width: 31px;
  height: 30px;
  background: url('../../assets/image/error/2.png') 0vw 0vw no-repeat;
  margin-top: 7px;
}

.info1 {
  width: 235px;
  height: 44px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(12, 16, 20, 1);
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}

.img1 {
  z-index: 248;
  position: absolute;
  left: 311px;
  top: 211px;
  width: 42px;
  height: 65px;
}

.main2 {
  height: 36px;
  border-radius: 4px;
  background-color: rgba(52, 94, 240, 1);
  width: 118px;
  margin: 20px 0 0 590px;
}

.word2 {
  width: 70px;
  height: 22px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  white-space: nowrap;
  line-height: 22px;
  text-align: left;
  margin: 7px 0 0 24px;
}
</style>
