<template>
  <div>
    <el-dialog
      :visible="serviceReportListVisible"
      top="10vh"
      title="查看服务情况"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="500px"
      :custom-class="darkScreen ? 'c-service-report-list c-service-report-list__dark' : 'c-service-report-list'"
    >
      <div class="c-service-report-list-item" v-for="(item, index) in reportList" :key="item.id">
        <div class="c-service-report-list-index">
          {{index + 1}}
        </div>
        <el-form label-suffix=":" label-width="80px">
        <el-form-item label="当前状态" prop="currentStatus">
          <div>{{ item.status }}</div>
        </el-form-item>
        <el-form-item label="服务描述" prop="serviceDetail">
          <div :title="item.serviceDetail">{{ item.serviceDetail }}</div>
        </el-form-item>
        <el-form-item label="上报人" prop="reporter">
          <div>{{ item.reporter }}</div>
        </el-form-item>
        <el-form-item label="上报时间" prop="createTime">
          <div>{{ parseTime(item.createTime) }}</div>
        </el-form-item>
      </el-form>
      </div>
      <div v-if="!reportList.length">
        <Empty description="暂无服务情况"></Empty>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from '@/utils/common'
import Empty from '@/components/common/Empty'
export default {
  name: "ServiceReportList",
  props: {
    serviceReportListVisible: Boolean,
    reportList: Array,
    darkScreen: Boolean
  },
  components: { Empty },
  methods: {
    close() {
      this.$emit("update:serviceReportListVisible", false);
    },
    parseTime(val) {
      return parseTime(val);
    }
  }
};
</script>
<style lang="scss" type="text/scss">
.c-service-report-list {
  &-item {
    border: 1px solid #ebeef5;
    padding: 10px;
    display: flex;
    margin: 16px 0;
    background: #fafafa;
    align-items: center;
  }
  &__dark {
    .c-service-report-list-item {
      background: transparent;
    }
    .c-service-report-list-index {
      border: 1px solid #fff;
      color: #fff;
    }
  }
  &-index {
    width: 36px;
    height: 36px;
    margin: 0 30px 0 10px;
    border: 1px solid #333;
    border-radius: 50%;
    flex: none;
    color: #333;
    text-align: center;
    line-height: 36px;
  }
  .el-form {
    flex: auto;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
  .el-form-item--small .el-form-item__content {
    line-height: 26px;
  }
  .el-dialog__body {
     max-height: 70vh;
    overflow: auto;
  }
  .el-form-item__content div {
    line-height: 32px;
    color: #409EFF;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
  }
}
</style>
