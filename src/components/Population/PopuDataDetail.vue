<!-- 新增、编辑、查看详细数据-->
<template>
  <el-dialog
    :visible="true"
    top="4vh"
    title="核查详情"
    append-to-body
    :close-on-click-modal="false"
    custom-class="popu-dialog"
    @close="$emit('close')"
    width="1140px"
  >
    <div class="tip">
      <p>核查结果：<span class="tip-stats" :class="{red:afterDataForm.hcjg !=='正常'}">{{ afterDataForm.hcjg}}</span></p>
      <p>备注：{{ afterDataForm.bz }}</p>
    </div>
    <div class="popu-box">
      <div class="editForm">
        <div class="btn">
          核查前
        </div>
        <el-form
          :model="beforeDataForm"
          ref="dataForm"
          label-width="140px"
          v-if="dataType"
        >
          <template v-for="item in this.optionsKeys">
            <el-form-item
              :key="item.storeFiled"
              :label="item.fieldName"
              :prop="item.storeFiled"
              :class="{red:diffArr.includes(item.storeFiled)}"
            >
            <span v-if="type === 'view'" class="view">{{
                beforeDataForm[item.storeFiled] || "暂无数据"
              }}</span>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div class="editForm">
        <div class="btn">
         核查后
        </div>
        <el-form
          :model="afterDataForm"
          ref="dataForm"
          label-width="140px"
          v-if="dataType"
        >
          <template v-for="item in this.optionsKeys">
            <el-form-item
              :key="item.storeFiled"
              :label="item.fieldName"
              :prop="item.storeFiled"
              :class="{red:diffArr.includes(item.storeFiled)}"
            >
            <span v-if="type === 'view'" class="view">{{
                afterDataForm[item.storeFiled] || "暂无数据"
              }}</span>

            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "popuDataDetail",
  components: {},
  props: ["keys", "data", "type", "tableId"],
  data() {
    return {
      beforeDataForm: {},
      afterDataForm: {},
      dataType: null, // 数据类型校验
      optionsKeys: [],
      diffArr: []
    };
  },
  async mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.dataType = {};
      this.optionsKeys = Object.assign([], this.keys).filter(v => {
        return !['id', 'bz', 'createTime', 'xfph', 'hczt', 'hcjg', 'hcry', 'hcsj', 'xfsj'].includes(v.storeFiled)
      })
      this.keys.forEach((v) => {
        if (!v.fieldName) {
          return;
        }
        this.dataType[v.storeFiled] = v;
        let beforeData = this.data.before ? this.data.before[v.storeFiled] || "" : "";
        let afterData = this.data.after ? this.data.after[v.storeFiled] || "" : "";
        this.$set(this.beforeDataForm, v.storeFiled, beforeData);
        this.$set(this.afterDataForm, v.storeFiled, afterData);
      });
      this.diffArr = this.data.differences
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .popu-dialog {
  .popu-box {
    display: flex;

    .editForm {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      .el-form-item {
        margin-bottom: 6px;
      }
      .btn {
        text-align: center;
        width: 130px;
        height: 33px;
        line-height: 33px;
        margin-bottom: 20px;
        background: #F8F8F8;
        border-radius: 4px;
        opacity: 0.8;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
      }

    }

  }

  .tip {
    display: flex;
    padding: 0 0 30px;
    margin-bottom: 30px;
    flex-direction: column;
    justify-content: center;
    border-bottom: 2px solid #E8E8E8;

    &-stats {
      font-size: 18px;
      color: #75CE1D;
    }
    p {
      padding-left: 120px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5E6367;
      line-height: 30px;
    }
  }
  .red {
    color: #E8283F;

    .el-form-item__label {
      color: red;
    }
  }
}
</style>

