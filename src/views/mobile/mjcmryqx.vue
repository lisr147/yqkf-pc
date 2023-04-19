<template>
  <div>
    <el-form
      :model="data"
      class="mjcmryqx"
      v-if="data"
      label-width="100px"
      ref="form"
      :disabled="readonly"
    >
      <div class="title">
        {{
          !(!data.status || data.status === "待领取")
            ? "待反馈任务"
            : "待核查任务"
        }}
      </div>
      <!-- 批次数据 -->
      <div class="card">
        <div class="line">
          批次号
          <el-input :value="data.analysisId" disabled />
        </div>
        <div class="line">
          创建人
          <el-input :value="data.createUserName" disabled />
        </div>
        <div class="line">
          创建时间
          <el-input :value="data.createTime" disabled />
        </div>
        <div class="line">
          待核查人数
          <el-input :value="data.verificationNum" disabled />
        </div>
      </div>
      <!-- 人员详细 -->
      <el-collapse v-model="activeName" class="card">
        <el-collapse-item
          :title="`${index + 1}`"
          :name="`${index + 1}`"
          v-for="(item, index) in data.personnelData"
          :key="item.id"
        >
          <div class="person-card" :model="data.personnelData[index]">
            <el-form-item class="line">
              <div class="title" slot="label">现场组跟进人及联系方式</div>
              <el-input :value="item.xczgjrjlxfs" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">姓名</div>
              <el-input :value="item.xm" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">国籍</div>
              <el-input :value="item.gj" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">性别</div>
              <el-input :value="item.xb" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">出生日期</div>
              <el-input :value="item.csrq" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">证件类型</div>
              <el-input :value="item.zjlx" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">有效证件号</div>
              <el-input :value="item.sfzhm" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">联系方式</div>
              <el-input v-model="item.sjhm"/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">目前所在位置</div>
              <el-input  v-model="item.mqszwz"/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">住址</div>
              <el-input :value="item.szxxdz" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">职业</div>
              <el-input :value="item.zy" disabled />
            </el-form-item>

            <el-form-item class="line">
              <div class="title" slot="label">工作单位</div>
              <el-input :value="item.gzdw" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">关联病例</div>
              <el-input :value="item.glbl" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">密接类型</div>
              <el-input :value="item.mjlx" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">关联密接</div>
              <el-input :value="item.glmj" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">与患者/密接关系</div>
              <el-input :value="item.yhzmjgx" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">判定事由</div>
              <el-input :value="item.pdsy" disabled />
            </el-form-item>

            <el-form-item class="line">
              <div class="title" slot="label">最后接触日期</div>
              <el-input :value="item.zhjcrq" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">关联重点场所</div>
              <el-input :value="item.glzdcs" disabled />
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">密接风险类型</div>
              <el-input :value="item.mjfxlx" disabled />
            </el-form-item>
            <!-- 没有所属行政区了 -->
            <!-- <el-form-item
              class="line"
              :rules="{ required: true, message: '请选择所属行政区' }"
              :prop="`personnelData[${index}].ssxzq`"
            >
              <div class="title" slot="label">所属行政区</div>
              <el-select
                v-model="item.ssxzq"
                @change="item.sszj = ''"
                :disabled="!(!data.status||data.status==='待领取')"
              >
                <el-option value="南沙区" />
                <el-option value="不在本区" />
              </el-select>
            </el-form-item> -->
            <el-form-item
              class="line"
              :rules="{ required: true, message: '请选择所属镇街' }"
              :prop="`personnelData[${index}].sszj`"
            >
              <div class="title" slot="label">所属镇街</div>
              <el-select
                v-model="item.sszj"
                :disabled="!data.status || data.status === '待领取'"
              >
                <el-option value="南沙街" />
                <el-option value="黄阁镇" />
                <el-option value="东涌镇" />
                <el-option value="大岗镇" />
                <el-option value="榄核镇" />
                <el-option value="横沥镇" />
                <el-option value="万顷沙镇" />
                <el-option value="珠江街" />
                <el-option value="龙穴街" />
              </el-select>
            </el-form-item>
            <el-form-item class="line" v-if="item.ssxzq === '不在本区'">
              <div class="title" slot="label">备注</div>
              <el-input type="textarea" v-model="item.bz" />
            </el-form-item>

            <template v-if="!(!data.status || data.status === '待领取')">
              <el-form-item
                class="line"
                :rules="{ required: false, message: '请选择' }"
                :prop="`personnelData[${index}].qxdl`"
              >
                <div class="title" slot="label">去向类型</div>
                <!-- lv1 -->
                <el-select
                  v-model="item.qxdl"
                  @change="
                    item.qxlx = '';
                    item.qxxq = '';
                  "
                >
                  <el-option value="本区" />
                  <el-option value="不在本区" />
                  <el-option value="无法落地" />
                  <el-option value="已排除是密接/次密接人员" />
                </el-select>
              </el-form-item>
              <el-form-item
                class="line"
                v-if="item.qxdl && item.qxdl !== '无法落地'"
                :rules="{ required: false, message: '请选择' }"
                :prop="`personnelData[${index}].qxlx`"
              >
                <div class="title" slot="label"></div>
                <!-- lv2 -->
                <el-select v-model="item.qxlx" @change="item.qxxq = ''">
                  <el-option value="居家健康监测" v-if="item.qxdl === '本区'" />
                  <el-option value="集中隔离" v-if="item.qxdl === '本区'" />
                  <el-option value="居家隔离" v-if="item.qxdl === '本区'" />
                  <el-option value="就医送医" v-if="item.qxdl === '本区'" />
                  <el-option value="隔离点无房间" v-if="item.qxdl === '本区'" />
                  <!--  -->
                  <el-option value="外省" v-if="item.qxdl === '不在本区'" />
                  <el-option value="外市区" v-if="item.qxdl === '不在本区'" />
                </el-select>
              </el-form-item>
              <el-form-item
                class="line"
                v-if="
                  item.qxlx &&
                    item.qxlx !== '隔离点无房间' &&
                    item.qxlx !== '外省'
                "
                :rules="{ required: false, message: '请选择' }"
                :prop="`personnelData[${index}].qxxq`"
              >
                <div class="title" slot="label"></div>
                <!-- lv3 -->
                <el-select v-model="item.qxxq">
                  <el-option value="珠江嘉园" v-if="item.qxlx === '集中隔离'" />
                  <el-option value="越秀东坡" v-if="item.qxlx === '集中隔离'" />
                  <el-option value="其他" v-if="item.qxlx === '集中隔离'" />
                  <!--  -->
                  <el-option
                    value="14岁及以下儿童"
                    v-if="item.qxlx === '居家隔离'"
                  />
                  <el-option value="孕产妇" v-if="item.qxlx === '居家隔离'" />
                  <el-option value="老年人" v-if="item.qxlx === '居家隔离'" />
                  <el-option
                    value="有基础性疾病的人员"
                    v-if="item.qxlx === '居家隔离'"
                  />
                  <el-option
                    value="半自理或无自理能力人员"
                    v-if="item.qxlx === '居家隔离'"
                  />
                  <el-option
                    value="临期密接次密人员"
                    v-if="item.qxlx === '居家隔离'"
                  />
                  <el-option
                    value="过期密接次密人员"
                    v-if="item.qxlx === '居家隔离'"
                  />
                  <!--  -->
                  <el-option
                    value="入境人员、境内密接/次密接人员（罹患其他疾病）"
                    v-if="item.qxlx === '就医送医'"
                  />
                  <el-option
                    value="入境人员、境内密接/次密接人员（合并精神障碍）"
                    v-if="item.qxlx === '就医送医'"
                  />
                  <!--  -->
                  <el-option value="本市" v-if="item.qxlx === '外市区'" />
                  <el-option value="外市" v-if="item.qxlx === '外市区'" />
                </el-select>
              </el-form-item>

              <el-form-item class="line">
                <div class="title" slot="label">备注</div>
                <el-input
                  type="textarea"
                  v-model="item.bz"
                  :placeholder="bzPlaceHolder(item)"
                />
              </el-form-item>
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div class="control" v-if="!readonly">
        <!-- <el-button>取消</el-button> -->
        <el-button
          type="primary"
          @click="renling"
          v-if="!data.status || data.status === '待领取'"
          >认领</el-button
        >
        <el-button type="primary" @click="tijiao" v-else>提交</el-button>
      </div>
    </el-form>
    <div class="no-data" v-else>暂无数据</div>
  </div>
</template>
<script>
export default {
  name: "mjcmryqx",
  data() {
    return {
      activeName: [],
      token: "",
      data: null,
      rawData: null,
      readonly: false,
    };
  },
  //   created() {
  //     document.title = "密接、次密接人员去向定位";
  //   },
  async mounted() {
    this.token = this.$route.query.token;
    this.readonly = this.readonly || this.$route.query.readonly;
    this.data = await this.$Api().ContactPersonnelVerificationController.get_detail.request(
      {
        params: {
          token: this.token,
        },
      }
    );
    if (!this.data) {
      return;
    }
    this.data.personnelData.forEach((v) => {
      delete v.analysisId;
      delete v.zt;
    });
    this.rawData = JSON.parse(JSON.stringify(this.data.personnelData));
    this.data.personnelData.forEach((v, i) => {
      // if (v.sszj) {
      //   v.ssxzq = "南沙区";
      // }
      this.$set(
        this.data.personnelData,
        i,
        Object.assign(
          {
            // ssxzq: "",
            sszj: "",
            bz: "",
            qxdl: "",
            qxlx: "",
            qxxq: "",
          },
          v
        )
      );

      this.activeName.push(`${i + 1}`);
      //   v = Object.assign({
      //       ssxzq:'',
      //       sszj:'',
      //       bz:'',
      //       qxdl:'',
      //       qxlx:'',
      //       qxxq:'',
      //   },v)
    });
  },
  methods: {
    bzPlaceHolder(item) {
      if (item.qxdl === "无法落地") {
        return "填写原因";
      }
      if (item.qxlx === "外省") {
        return "填写地址（含省+市+区）";
      }
      if (item.qxxq === "本市") {
        return "填写外区地址（含区级地址）";
      }
      if (item.qxxq === "外市") {
        return "填写地址（含市+区地址）";
      }
      return "";
    },
    // 认领
    async renling() {
      // await this.$refs.form.validate();
      await this.$Api().ContactPersonnelVerificationController.get_claim.request(
        {
          params: {
            token: this.token,
          },
        }
      );
      this.$alert("认领成功", "提示", {
        confirmButtonText: "确定",
        callback: () => {
          location.reload();
        },
      });
      // location.reload();
    },
    async tijiao() {
      await this.$refs.form.validate();
      // await this.$Api().ContactPersonnelVerificationController.put_data.request(
      //   {
      //     data: this.data.personnelData,
      //     params: { token: this.token },
      //   }
      // );

      // 有没有修改镇街的
      let newData = [];
      this.data.personnelData.forEach((v) => {
        let rawData = this.rawData[this.rawData.map((r) => r.id).indexOf(v.id)];
        if (v.sszj !== rawData.sszj) {
          newData.push(v);
        }
      });
      if (newData.length) {
        await this.$Api().ContactPersonnelVerificationController.put_data.request(
          {
            data: newData,
            params: { token: this.token },
          }
        );
      }
      // 提交数据
      await this.$Api().ContactPersonnelVerificationController.put_handing.request(
        {
          data: this.data.personnelData,
          params: {
            token: this.token,
          },
        }
      );
      this.$alert("提交成功", "提示", {
        confirmButtonText: "确定",
        callback: () => {
          this.readonly = true;
          // location.reload();
        },
      });
    },
  },
};
</script>
<style lang="scss">
#app {
  overflow: auto;
}
</style>
<style lang="scss">
.mjcmryqx {
  padding: 1rem;
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
