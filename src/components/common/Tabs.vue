<template>
  <div class="c-tabs">
    <template v-if="!isMobile">
      <div
        v-for="item in tabs"
        class="c-tabs-item"
        type="primary"
        @click="changeTab(item.value || item)"
        :class="{ 'is-active': (item.value || item) === currentTab }"
        :key="item.value || item"
      >
        {{ `${(item.label || item)}${item.extra || item.extra === 0 ? ` (${item.extra})`: ''}` }}
      </div>
    </template>
    <template v-else>
      <el-dropdown @command="changeTab" trigger="click">
        <span class="el-dropdown-link">
          {{tabs.find(v => v.value === currentTab).label}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <template v-for="item in tabs">
            <el-dropdown-item
              :key="item.value || item"
              :command="item.value || item"
              >{{ `${(item.label || item)}${item.extra || item.extra === 0 ? ` (${item.extra})`: ''}` }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    currentTab: {
      type: String,
      default: ""
    }
  },
  model: {
    prop: 'currentTab',
    event: 'changeTab'
  },
  computed: {
    isMobile() {
      return this.$store.state.common.isMobile;
    }
  },
  methods: {
    changeTab(value) {
      if(this.$listeners.beforeChangeTab) {
        this.$emit('beforeChangeTab', value);
      } else {
        this.$emit('changeTab', value);
      }
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.c-tabs {
  display: flex;
  margin: 10px 0;
  &::after {
    content: "";
    flex: auto;
    border-bottom: 1px solid #dcdfe6;
  }
  &-item {
    flex: none;
    cursor: pointer;
    text-align: center;
    padding: 10px 0;
    border: 1px solid rgba(220, 223, 230, 1);
    border-left: none;
    width: 140px;
    font-size: 14px;
    color: #aaaaaa;
    box-sizing: content-box;
    height: 20px;
    background-color: rgba(245, 245, 245, 1);
    &.is-active {
      color: rgb(64, 158, 255);
      border-bottom: none;
      background-color: #fff;
    }
    &:first-child {
      border-top-left-radius: 4px;
      border-left: 1px solid rgba(220, 223, 230, 1);
    }
    &:last-child {
      border-top-right-radius: 4px;
    }
  }
}
</style>
