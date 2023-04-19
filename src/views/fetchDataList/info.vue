<!-- 新增、编辑、查看详细数据-->
<template>
  <el-dialog
    :visible="true"
    top="4vh"
    title="详细信息"
    append-to-body
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="500px"
  >
    <div class="gird">
      <div class="row" v-for="item in data.keys" :key="item.id">
        <label class="title">{{ item.label }}</label>
        <label class="value">
          <template v-if="item.id==='offFiles'">
            <template v-for="i in data.data['offFiles']">
              <img alt="" :src="i">
            </template>
          </template>
          <template v-else>{{item.formatter?item.formatter( data.data):data.data[item.id] }}</template>
        </label>
      </div>
    </div>
    <slot></slot>
  </el-dialog>
</template>
<script>

export default {
  name: "fetchDataInfo",
  props: ["data", "keys"],
  data() {
    return {};
  },
  async mounted() {
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.gird {
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
    }
  }
}
</style>
