<template>
  <div class="c-color-statistics">
    <ul class="c-color-statistics-list">
      <li
        v-for="item in statistics"
        :key="item.town"
        class="c-color-statistics-item"
      >
        <div class="c-color-statistics-name">{{ item.town }}</div>
        <div class="c-color-statistics-detail">
          <span class="c-color-statistics-count">{{ item.num }}</span>
          <span class="c-color-statistics-sub">人</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    statistics: Array,
  },
};
</script>

<style lang="scss" type="text/scss">
.c-color-statistics {
  &-list {
    display: flex;
    margin-top: 7px;
  }
  &-name {
    height: 14px;
    font-size: 14px;
    line-height: 14px;
    color: #ffffff;
  }
  &-detail {
    margin-top: 2px;
    font-family: Bebas;
    line-height: 32px;
    height: 32px;
  }
  &-count {
    font-size: 24px;
    color: #00ea99;
    margin-right: 2px;
  }
  &-sub {
    font-size: 14px;
    color: #ffffff;
  }
}
.c-color-statistics-item {
  width: 170px;
  height: 66px;
  box-sizing: border-box;
  text-align: center;
  padding: 10px 0 7px;
  background: linear-gradient(
    90deg,
    rgba(29, 109, 104, 0.5) 0%,
    rgba(29, 109, 104, 0.1) 100%
  );
  &:not(:first-child) {
    margin-left: 16px;
  }
  &:nth-child(1) {
    background: linear-gradient(
      90deg,
      rgba(220, 30, 0, 0.2) 0%,
      rgba(220, 30, 0, 0.05) 100%
    );
    .c-color-statistics-count {
      color: #ff0000;
    }
  }
  &:nth-child(2) {
    background: linear-gradient(
      90deg,
      rgba(244, 151, 77, 0.2) 0%,
      rgba(241, 153, 71, 0.03) 100%
    );
    .c-color-statistics-count {
      color: #f4974e;
    }
  }
  &:nth-child(3) {
    background: llinear-gradient(
      90deg,
      rgba(0, 234, 233, 0.2) 0%,
      rgba(0, 234, 233, 0.05) 100%
    );
    .c-color-statistics-count {
      color: #00eae9;
    }
  }
}
</style>
