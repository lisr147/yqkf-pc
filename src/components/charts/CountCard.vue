<template>
  <div class="c-count-card" :class="[color, column, {'pointer': isCanClick}]" ref="CountCard" @click="handleClick">
    <p class="t1">{{ itemName }}</p>
    <p class="t2">
      <count-to
        :endVal="parseFloat(num)"
        :decimals="getDecimals(num)"
        :duration="1000"
      ></count-to>
      <span class="unit" v-if="unit">{{ unit }}</span>
    </p>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
export default {
  name: "CountCard",
  components: {
    CountTo,
  },
  props: {
    isCanClick: { type: Boolean, default: false },
    itemName: String,
    num: [Number, String],
    id: [Number, String],
    color: String,
    //每行展示数（col-3）
    column: {
      type: String,
      default: "col-2",
      validator(value) {
        try {
          const num = Number(value.split("-")[1]);
          if (value.indexOf("col-") !== 0) {
            console.log(`参数需以"col-"开头!输入为${value}`);
            return false;
          }
          if (num < 0 || num > 5) {
            console.log(`列数应在[1,2,3,4,5]之内!输入为${num}`);
            return false;
          }
          return true;
        } catch (e) {
          console.log(e);
        }
      },
    },
    unit: String, //单位
  },
  methods: {
    handleClick() {
      this.$emit("onCardClick", {cardName: this.itemName, cardId: this.id, cardNum: this.num});
    },
    getDecimals(val) {
      let str = val.toString();
      return str.indexOf(".") > -1 ? str.length - str.indexOf(".") - 1 : 0;
    },
  },
};
</script>

<style lang="scss" type="text/scss">
.c-count-card {
  cursor: default;
  color: #fff;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  margin: 5px 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  background: linear-gradient(
    90deg,
    rgba(244, 151, 77, 0.2) 0%,
    rgba(241, 153, 71, 0.03) 100%
  );
  &.pointer {
    cursor: pointer;
    &:hover {
      opacity: .8;
    }
  }
  .t1 {
    font-size: 12px;
    color: #fff;
    margin: 2px auto;
    text-align: center;
  }
  .t2 {
    font-weight: 600;
    font-size: 24px;
    font-family: Bebas;
    color: #f4974e;

    .unit {
      color: #ffffff;
      font-size: 12px;
      margin-left: 5px;
      font-weight: normal;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    }
  }
  .icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
$cols: (1, 2, 3, 4, 5);

@for $i from 1 through length($cols) {
  $item: nth($cols, $i);
  .c-count-card.col-#{$item} {
    flex: 0 0 #{calc(100 / $item)}#{"%"};
  }
}
.green {
  background: linear-gradient(
    90deg,
    rgba(29, 109, 104, 0.5) 0%,
    rgba(29, 109, 104, 0.1) 100%
  ) !important;
  .t2 {
    color: #00ea99 !important;
  }
}
.red {
  background: linear-gradient(
    90deg,
    rgba(220, 30, 0, 0.2) 0%,
    rgba(220, 30, 0, 0.05) 100%
  ) !important;
  .t2 {
    color: #dc1e00 !important;
  }
}
.blue {
  background: linear-gradient(
    90deg,
    rgba(0, 234, 233, 0.2) 0%,
    rgba(0, 234, 233, 0.05) 100%
  ) !important;
  .t2 {
    color: #00eae9 !important;
  }
}
</style>
