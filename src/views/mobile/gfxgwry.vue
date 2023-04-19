<template>
  <div>
    <el-form
        :model="data"
        class="yddgyjl"
        v-if="data"
        label-width="100px"
        ref="form"
        :disabled="readonly"
    >
      <div class="title">详情</div>
      <!-- 批次数据 -->
      <div class="card">
        <div class="line">
          批次号
          <el-input :value="data.analysisId" disabled/>
        </div>
        <div class="line">
          创建人
          <el-input :value="data.creator" disabled/>
        </div>
        <div class="line">
          创建时间
          <el-input :value="data.createTime" disabled/>
        </div>
        <div class="line">
          未按规定核酸检测人数
          <el-input :value="data.count" disabled/>
        </div>
        <div class="down-link" @click="exportHighRiskData">点击下载核查明细表</div>
      </div>
    </el-form>
    <div class="no-data" v-else>暂无数据</div>
  </div>
</template>
<script>
import {exportHighRiskData, getHighRiskDetail} from '@/api/alarm'

export default {
  name: "gfxgwry",
  data() {
    return {
      activeName: ["1", "2"],
      token: "",
      data: null,
      rawData: null,
      readonly: false
    };
  },

  async mounted() {
    this.token = this.$route.query.token;
    // this.token = 'D172C0AC9B0D23C9307F8F7B2EA3DCD90D0B9980CC2766217F6691A701FE91A9';
    this.readonly = this.readonly || this.$route.query.readonly
    this.getHighRiskDetail({token: this.token})
  },
  methods: {
    async getHighRiskDetail(params) {
      let res = await getHighRiskDetail(params)
      if (!res) {
        return;
      }
      this.data = res
    },

    //导出
    async exportHighRiskData() {
      let res = await exportHighRiskData(this.token)
      console.log(res);
    }
  },
};
</script>
<style lang="scss">
#app {
  overflow: auto;
}
</style>
<style lang="scss">
.yddgyjl {
  padding: 1rem;

  .down-link {
    display: block;
    margin: 15px 0 5px;
    color: #3F9FFE;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
  }

  .title {
    font-weight: 600;
    text-align: center;
  }

  .card {
    margin: 1rem 0rem;
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 4px;

    .line {
      line-height: 2rem;

      & + .line {
        margin-top: 1rem;
      }
    }

    .el-collapse-item__header {
      background-color: #eee;
      // background: none;
      padding: 0rem 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .el-collapse-item__wrap {
      background: none;
    }

    .person-card {
      .line {
        // display: flex;
        .title {
          // width: 100px;
          // flex-shrink: 0;
          // text-align: left;
          font-weight: normal;
          display: inline;
        }
      }
    }
  }

  .control {
    display: flex;
    justify-content: space-between;

    .el-button {
      width: 100%;
    }
  }
}

.no-data {
  text-align: center;
  padding: 5rem;
  color: #999;
}
</style>
