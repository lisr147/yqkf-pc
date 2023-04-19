
<template>
  <div>
    <el-dialog  class="screen-wrap" title="详情" top="5vh" :visible="true" append-to-body @close="$emit('close')">
      <div class="info-table">
        <div class="info-item" v-for="(item, key) in dataList" :key="key">
          <div class="box-label">{{item.label}}</div>
          <div class="box-value" >{{item.value}}</div>
        </div>
        <div class="info-item" v-if="dataList.length%2==1">
          <div class="box-label"></div>
          <div class="box-value"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: "infoDetail",
  props: ["dataList"],
  data() {
    return {}
  },
};
</script>
<style lang="scss" scoped>
.info-table{
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: 98%;
  padding-bottom: 4px;
  color: #ffffff;
}

.info-item {
  width: calc(50% - 1px);
  display: flex;
  border: 1px solid #465da3;
  margin-right: -1px;
  margin-bottom: -1px;
  position: relative;

  .box-label{
    width: 120px;
    min-height: 20px;
    padding: 8px 16px;
    flex-shrink: 0;
    background-color: rgba(45, 85, 208, 0.3);
  }
  .box-value{
    box-sizing: border-box;
    padding: 8px 16px;
    border-left: 1px solid #465DA3;
    width: 100%;
  }
}
</style>
