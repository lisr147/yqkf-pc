<template>
  <div class="mobile-wrapper">
    <div class="sidebar">
      <medical />
    </div>
  </div>
</template>
<script>
import ReportLayer from "@/components/report/ReportLayer";
import Medical from '@/views/big/medical'
export default  {
  components: {
    ReportLayer,
    Medical
  },
  // 父组件中返回要传给下级的数据
  provide() {
    return {
      handleItemChoosed: this.handleItemChoosed
    };
  },
  //触发事件
  handleItemChoosed(event, type) {

  },
}
</script>
<style lang="scss">
.mobile-wrapper {
  .medical {
    .button {
      min-width: 65px;
    }
  }
}
</style>
<style lang="scss" scoped>
.mobile-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #1b2e93;
}
.sidebar{
  width: 100%;
  height: 100vh;
  overflow: scroll;
  transition: width ease-in-out .4s;
  z-index: 10;
  box-sizing: border-box;
  border: 20px solid transparent;
  border-image: url("~@/assets/image/sidebar-bg.png") 20;
  background: url("~@/assets/image/sidebar-bg-unit.png");
  background-clip: padding-box;
  background-repeat: repeat;

  &.folder{
    width:0 !important;
    border:0 none;
    border-image: none;
  }

  & > main{
    position: absolute;
    top:0px;
    bottom:0;
    left: -10px;
    right: -20px;
    overflow: auto;
    padding: 5px 0;
  }

  &-title{
    position: absolute;
    top: -22px;
    left: 40%;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 700;
    color: #FFFFFF;
  }
  .side-header{
    margin-bottom: 0.5em;
    padding:0 1em;
    height:36px;
    line-height: 36px;
    font-size: 14px;
    transition: transform ease-in-out .4s;
  }

  .fl{
    transform: translateX(-370px);
  }
  .fr{
    transform: translateX(370px);
  }

  .trb{
    position: absolute;
    top:0;
    z-index: 99;
    width: 16px;
    height: 56px;
    line-height: 56px;

    text-align: center;
    cursor: pointer;
  }

  &.pl{
    left: 20px;
    .trb{
      left:-20px;
    }
  }
  &.pr{
    right: 20px;
    .trb{
      right:-20px;
    }
  }

  .side-box {
    display: block;
    position: relative;
    padding: 0 0 8px;
    width: 100%;
    box-sizing: border-box;

    &.side-box1 {

    }
    &-mask {
      position: absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      padding: 10px;
      box-sizing: border-box;
      text-align: right;
      z-index: 2001;
      .btns{
        position: absolute;
        bottom: 15px;
        left: 25%;
        .btn{
          cursor: pointer;
          margin: 0 10px;
        }
      }

    }
    .swiper-box {
      position: relative;
    }
  }
  .side-add{
    position: relative;
    margin: 0 0 1em;
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    padding: 10px;
    text-align: right;
    .btn {
      line-height: 0;
    }
  }
  &>.btn{
    padding: 10px 20px;
    border: none;
  }
}
</style>
