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
      <div class="title">待核查任务</div>
      <!-- 批次数据 -->
      <div class="card">
        <div class="line">
          批次号
          <el-input :value="data.analysisId" disabled/>
        </div>
        <div class="line">
          创建人
          <el-input :value="data.createUserName" disabled/>
        </div>
        <div class="line">
          创建时间
          <el-input :value="data.createTime" disabled/>
        </div>
        <div class="line">
          待核查人数
          <el-input :value="data.verificationNum" disabled/>
        </div>
        <div class="down-link" @click="drugExportData">点击下载核查明细表</div>
        <div class="down-link"  @click="dialog = 'importFile'">点击上传核查结果</div>
      </div>
      <!-- 人员详细 -->
      <div class="title" style="margin-top: 20px">待核查人员信息</div>
      <el-collapse v-model="activeName" class="card">
        <el-collapse-item
            :title="`${index + 1}`"
            :name="`${index + 1}`"
            v-for="(item, index) in data.personnelData"
            :key="item.id"
        >
          <div class="person-card" :model="data.personnelData[index]">
            <el-form-item class="line">
              <div class="title" slot="label">填报时间</div>
              <el-input :value="item.gysj" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">填报单位</div>
              <el-input :value="item.mc" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">患者姓名</div>
              <el-input :value="item.hzxm" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">患者身份证号</div>
              <el-input :value="item.hzsfzh" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">患者联系方式</div>
              <el-input :value="item.hzlxfs" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">购买者联系方式</div>
              <el-input :value="item.sjhm" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">患者目前居住地址</div>
              <el-input :value="item.hzmqjzdz" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">14天内是否有境外旅居史</div>
              <el-input :value="item.jwjzs" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">是否发热</div>
              <el-input :value="item.sffr" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">其他症状</div>
              <el-input :value="item.qtzz" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">购买药品通用名称</div>
              <el-input :value="item.gmyptymc" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">购买数量</div>
              <el-input :value="item.gmsl" disabled/>
            </el-form-item>
            <el-form-item class="line">
              <div class="title" slot="label">港澳台及外国人购药登记</div>
              <el-input :value="item.gatjwgrgydj" disabled/>
            </el-form-item>

            <template>

              <el-form-item
                  class="line"
                  :rules="{ required: false, message: '请选择核实情况' }"
                  :prop="`personnelData[${index}].hsqkjg`"
              >
                <div class="title" slot="label">核实情况结果</div>
                <!-- lv1 -->
                <el-select
                    v-model="item.hsqkjg"
                   >
                  <el-option value="居家隔离"/>
                  <el-option value="集中隔离并医学观察"/>
                  <el-option value="自行就医"/>
                  <el-option value="三人小组送发热门诊"/>
                  <el-option value="已核查，不属于前四种情形"/>
                </el-select>
              </el-form-item>
              <el-form-item
                  class="line"
                  :rules="{ required: false, message: '请选择确诊结果' }"
                  :prop="`personnelData[${index}].qzjg`"
              >
                <div class="title" slot="label">确诊结果</div>
                <!-- lv1 -->
                <el-select
                    v-model="item.qzjg"
                  >
                  <el-option value="已确诊新冠肺炎"/>
                  <el-option value="已排除新冠肺炎"/>
                  <el-option value="未确诊新冠肺炎"/>
                </el-select>
              </el-form-item>

              <el-form-item class="line">
                <div class="title" slot="label">备注</div>
                <el-input
                    type="textarea"
                    v-model="item.bz"
                />
              </el-form-item>
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div class="control" v-if="!readonly">
<!--         <el-button>取消</el-button>-->
<!--        <el-button type="primary" @click="renling" v-if="!data.zt||data.zt==='待领取'"-->
<!--        >认领-->
<!--        </el-button>-->
        <el-button type="primary" @click="tijiao">提交</el-button>
      </div>
    </el-form>
    <div class="no-data" v-else>暂无数据</div>
    <import-file
        :tableId="tableId"
        v-if="dialog === 'importFile'"
        @close="dialog = null"
        @update="getDrugDetail"
    />
  </div>
</template>
<script>
import {drugExportData, getDrugDetail, getDrugClaim, drugHanding} from '@/api/alarm'
import ImportFile from "../common/uploadFile2";
import moment from "moment";
// import VConsole from 'vconsole';
export default {
  name: "yddgyjl",
  components:{
    ImportFile
  },
  data() {
    return {
      activeName: ["1", "2"],
      token: "",
      data: null,
      rawData: null,
      readonly: false,
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100, 500, 1000],
      },
      tableId:10057,
      dialog: null,
    }
  },

  async mounted() {
    // const vConsole = new VConsole();
    this.token = this.$route.query.token;
    // this.token = 'B3AA7838BCBF3C1F3AF783BF664BC1216484A3B5451ABB2067822ECEC5BB3062C9875ACAE38E78E0';
    this.readonly = this.readonly || this.$route.query.readonly
    this.getDrugDetail({token: this.token})
  },
  methods: {
    async getDrugDetail(params) {
      let res = await getDrugDetail(params)
      if (!res) {
        return;
      }
      res.personnelData.forEach(v => {
        delete v.analysisId
        delete v.zt
      })
      res.personnelData.forEach((v, i) => {
        this.$set(res.personnelData, i, Object.assign(
            {
              hsqkjg: "",
              qzjg: "",
              bz: "",
            }, v)
        );
      });
      this.data = res
      // console.log(254, this.data);
    },
    // 认领
    async renling() {
      let params = {token: this.token};
      let res = await getDrugClaim(params)
      if (res) {
        this.$alert('认领成功', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            location.reload();
          }
        });
      }
    },
    async tijiao() {
      await this.$refs.form.validate();
      // 提交数据
      let res = await drugHanding(this.data.personnelData,this.token)
      if (res) {
        this.$alert('提交成功', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            location.reload();
          }
        });
      }
    },

    //导出
    async drugExportData() {
      let res = await drugExportData(this.token)
      console.log(res);
    },
    async getData() {
      if (!this.tableId) {
        this.$message({
          message: `暂无数据模板`,
          type: "warning",
          duration: 5 * 1000,
          showClose: true,
        });
        return;
      }

      let condition = {
        usePlaintext: true,
        currentUserId: false,
        currentDepartmentId: false,
      };
      let whiteList = ["pageNum", "pageSize", "rowTotal", "pageSizes"];
      for (let i in this.filter) {
        if (!whiteList.includes(i) && this.filter[i]) {
          condition[i] = this.filter[i];
        }
      }

      let res = await this.$Api().ImportDataController.post_dataPage.request({
        path: {
          templateId: this.tableId,
        },
        data: {
          condition: condition,
          page: this.filter.pageNum,
          pageSize: this.filter.pageSize,
        },
        headers: {
          hideNotify: true,
        },
      });
      // console.log(res)
      res.data.forEach((v) => {
        v.createTime = v.createTime
            ? moment(v.createTime).format("YYYY-MM-DD HH:mm:ss")
            : null;
        v.updateTime = v.updateTime
            ? moment(v.updateTime).format("YYYY-MM-DD HH:mm:ss")
            : null;
      });

      this.tableListData.tableData = res.data;
      this.filter.pageNum = res.page;
      this.filter.pageSize = res.pageSize;
      this.filter.rowTotal = res.total;
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
.yddgyjl {
  padding: 1rem;
  background-color: #f0f2f5;
  ::v-deep.el-input.is-disabled .el-input__inner{
    color: #818691;
  }
  .down-link {
    display: block;
    margin:25px 0 5px;
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
.alert-box{
  width: 100%;
}
</style>
