<template>
  <el-button @click="showSetting" type="primary" plain>
    告警设置
    <el-dialog
      :visible="true"
      top="4vh"
      title="告警设置"
      append-to-body
      v-if="showDialog"
      :close-on-click-modal="false"
      @close="showDialog = false"
      width="600px"
      custom-class="alert-dialog"
    >
      <el-form label-width="100px" size="mini">
        <h2>镇街接受核查任务用户</h2>
        <!-- 用户选择 -->
        <div class="user-select">
          <el-form-item
            v-for="item in zhenjie"
            :key="`revicer_${item}`"
            :label="item"
            class="user-select-1"
          >
            <!-- <el-input
              readonly class="user-select-input"
              :value="createReceiveUsers[item].select.map((v) => v.fullName).join(',')"
              :title="createReceiveUsers[item].select.map((v) => v.fullName).join(',')"
              @focus="createReceiveUsers[item].edit = true"
            /> -->
            <div class="user-select-item">
              <div
                class="user-name"
                v-for="(user, index) in createReceiveUsers[item].select"
                :key="item + user.fullName"
              >
                {{ user.fullName }}
                <i
                  class="el-icon-remove"
                  @click="createReceiveUsers[item].select.splice(index, 1)"
                />
              </div>
              <el-button
                @click="createReceiveUsers[item].edit = true"
                type="text"
                >+添加</el-button
              >
              <user
                v-model="createReceiveUsers[item].edit"
                :showme="true"
                @chooseUser="chooseUser(item, $event)"
                :selectedUsers="createReceiveUsers[item].select"
              ></user>
            </div>
          </el-form-item>
        </div>

        <h2>认领告警</h2>
        <div>
          系统推送待核查人员到镇街账号，镇街若
          <el-input
            type="number"
            class="number-input"
            min="0"
            size="mini"
            v-model="data.claimTownThresholdValue"
          />
          分钟内没有认领则产生告警推送给镇领导。
          <!-- 用户选择 -->
          <div class="user-select">
            <el-form-item
              v-for="item in zhenjie"
              :key="`zhenjie_renling_${item}`"
              :label="item + '领导'"
            >
              <!-- <el-input
                readonly
                class="user-select-input"
                :value="
                  claimTownReceiveUsers[item].select
                    .map((v) => v.fullName)
                    .join(',')
                "
                :title="
                  claimTownReceiveUsers[item].select
                    .map((v) => v.fullName)
                    .join(',')
                "
                @focus="claimTownReceiveUsers[item].edit = true"
              />
              <user
                v-model="claimTownReceiveUsers[item].edit"
                :showme="true"
                @chooseUser="chooseUserClaimTownReceiveUsers(item, $event)"
                :selectedUsers="claimTownReceiveUsers[item].select"
              ></user> -->

              <div class="user-select-item">
                <div
                  class="user-name"
                  v-for="(user, index) in claimTownReceiveUsers[item].select"
                  :key="item + user.fullName"
                >
                  {{ user.fullName }}
                  <i
                    class="el-icon-remove"
                    @click="claimTownReceiveUsers[item].select.splice(index, 1)"
                  />
                </div>
                <el-button
                  @click="claimTownReceiveUsers[item].edit = true"
                  type="text"
                  >+添加</el-button
                >
                <user
                  v-model="claimTownReceiveUsers[item].edit"
                  :showme="true"
                  @chooseUser="chooseUserClaimTownReceiveUsers(item, $event)"
                  :selectedUsers="claimTownReceiveUsers[item].select"
                ></user>
              </div>
            </el-form-item>
          </div>
        </div>
        <div>
          镇街若
          <el-input
            type="number"
            class="number-input"
            size="mini"
            min="0"
            v-model="data.claimAreaThresholdValue"
          />
          分钟内没有认领则产生告警推送给区领导。
          <!-- 用户选择 -->
          <div class="user-select">
            <el-form-item label="区领导">
              <!-- <el-input
                readonly
                class="user-select-input"
                :value="
                  claimAreaReceiveUsers.select.map((v) => v.fullName).join(',')
                "
                :title="
                  claimAreaReceiveUsers.select.map((v) => v.fullName).join(',')
                "
                @focus="claimAreaReceiveUsers.edit = true"
              />
              <user
                v-model="claimAreaReceiveUsers.edit"
                :showme="true"
                @chooseUser="chooseUserClaimAreaReceiveUsers"
                :selectedUsers="claimAreaReceiveUsers.select"
              ></user> -->
              <div class="user-select-item">
                <div
                  class="user-name"
                  v-for="(user, index) in claimAreaReceiveUsers.select"
                  :key="item + user.fullName"
                >
                  {{ user.fullName }}
                  <i
                    class="el-icon-remove"
                    @click="claimAreaReceiveUsers.select.splice(index, 1)"
                  />
                </div>
                <el-button
                  @click="claimAreaReceiveUsers.edit = true"
                  type="text"
                  >+添加</el-button
                >
                <user
                  v-model="claimAreaReceiveUsers.edit"
                  :showme="true"
                  @chooseUser="chooseUserClaimAreaReceiveUsers"
                  :selectedUsers="claimAreaReceiveUsers.select"
                ></user>
              </div>
            </el-form-item>
          </div>
        </div>
        <h2>管控告警</h2>
        <div>
          从系统导入待核查人员名单，若
          <el-input
            type="number"
            class="number-input"
            min="0"
            size="mini"
            v-model="data.handingTownThresholdValue"
          />
          小时内人员去向反馈没反馈完成，则系统推送告警到镇领导。
          <!-- 用户选择 -->
          <div class="user-select">
            <el-form-item
              v-for="item in zhenjie"
              :key="`zhenjie_guankong_${item}`"
              :label="item + '领导'"
            >
              <!-- <el-input
                readonly
                class="user-select-input"
                :value="
                  handingTownReceiveUsers[item].select
                    .map((v) => v.fullName)
                    .join(',')
                "
                :title="
                  handingTownReceiveUsers[item].select
                    .map((v) => v.fullName)
                    .join(',')
                "
                @focus="handingTownReceiveUsers[item].edit = true"
              />
              <user
                v-model="handingTownReceiveUsers[item].edit"
                :showme="true"
                @chooseUser="chooseUserHandingTownReceiveUsers(item, $event)"
                :selectedUsers="handingTownReceiveUsers[item].select"
              ></user> -->
              <div class="user-select-item">
                <div
                  class="user-name"
                  v-for="(user, index) in handingTownReceiveUsers[item].select"
                  :key="item + user.fullName"
                >
                  {{ user.fullName }}
                  <i
                    class="el-icon-remove"
                    @click="
                      handingTownReceiveUsers[item].select.splice(index, 1)
                    "
                  />
                </div>
                <el-button
                  @click="handingTownReceiveUsers[item].edit = true"
                  type="text"
                  >+添加</el-button
                >
                <user
                  v-model="handingTownReceiveUsers[item].edit"
                  :showme="true"
                  @chooseUser="chooseUserHandingTownReceiveUsers(item, $event)"
                  :selectedUsers="handingTownReceiveUsers[item].select"
                ></user>
              </div>
            </el-form-item>
          </div>
        </div>
        <div>
          从系统导入待核查人员名单，若
          <el-input
            type="number"
            class="number-input"
            min="0"
            size="mini"
            v-model="data.handingAreaThresholdValue"
          />
          小时内人员去向反馈没反馈完成，则系统推送告警到区领导。
          <!-- 用户选择 -->
          <div class="user-select">
            <el-form-item label="区领导">
              <!-- <el-input
                readonly
                class="user-select-input"
                :value="
                  handingAreaReceiveUsers.select
                    .map((v) => v.fullName)
                    .join(',')
                "
                :title="
                  handingAreaReceiveUsers.select
                    .map((v) => v.fullName)
                    .join(',')
                "
                @focus="handingAreaReceiveUsers.edit = true"
              />
              <user
                v-model="handingAreaReceiveUsers.edit"
                :showme="true"
                @chooseUser="chooseUserHandingAreaReceiveUsers"
                :selectedUsers="handingAreaReceiveUsers.select"
              ></user> -->
              <div class="user-select-item">
                <div
                  class="user-name"
                  v-for="(user, index) in handingAreaReceiveUsers.select"
                  :key="item + user.fullName"
                >
                  {{ user.fullName }}
                  <i
                    class="el-icon-remove"
                    @click="
                      handingAreaReceiveUsers.select.splice(index, 1)
                    "
                  />
                </div>
                <el-button
                  @click="handingAreaReceiveUsers.edit = true"
                  type="text"
                  >+添加</el-button
                >
                <user
                  v-model="handingAreaReceiveUsers.edit"
                  :showme="true"
                  @chooseUser="chooseUserHandingAreaReceiveUsers"
                  :selectedUsers="handingAreaReceiveUsers.select"
                ></user>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button @click="save" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </el-button>
</template>
<script>
import User from "@/components/supervision/User";
export default {
  name: "Notify10077",
  components: {
    User,
  },
  data() {
    let zhenjie = [
      "黄阁镇",
      "东涌镇",
      "大岗镇",
      "榄核镇",
      "横沥镇",
      "万顷沙镇",
      "南沙街",
      "珠江街",
      "龙穴街",
    ];
    let createReceiveUsers = {};
    let claimAreaReceiveUsers = {
      edit: false,
      select: [],
    };
    let claimTownReceiveUsers = {};
    let handingAreaReceiveUsers = {
      edit: false,
      select: [],
    };
    let handingTownReceiveUsers = {};
    zhenjie.forEach((v) => {
      createReceiveUsers[v] = {
        edit: false,
        select: [],
      };
      // claimAreaReceiveUsers[v] = {
      //   edit: false,
      //   select: [],
      // };
      claimTownReceiveUsers[v] = {
        edit: false,
        select: [],
      };
      // handingAreaReceiveUsers[v] = {
      //   edit: false,
      //   select: [],
      // };
      handingTownReceiveUsers[v] = {
        edit: false,
        select: [],
      };
    });

    return {
      showDialog: false,
      zhenjie,
      data: {
        // 认领区领导
        claimAreaReceiveUsers: [],
        // 认领告警事件触发时间-区
        claimAreaThresholdValue: 10,
        // 认领镇领导
        claimTownReceiveUsers: [],
        // claimTownThresholdValue
        claimTownThresholdValue: 10,
        // 管控区领导
        handingAreaReceiveUsers: [],
        // 管控告警事件触发时间-区
        handingAreaThresholdValue: 3,
        // 管控镇领导
        handingTownReceiveUsers: [],
        // 管控告警事件触发时间-镇
        handingTownThresholdValue: 2,
        // 处罚告警用户
        createReceiveUsers: [],
      },
      createReceiveUsers,
      claimAreaReceiveUsers,
      claimTownReceiveUsers,
      handingAreaReceiveUsers,
      handingTownReceiveUsers,
    };
  },
  methods: {
    async showSetting() {
      let res = await this.$Api().ContactPersonnelVerificationController.get_setting.request();
      console.log(res);
      res.claimAreaReceiveUsers = res.claimAreaReceiveUsers || [];
      res.handingAreaReceiveUsers = res.handingAreaReceiveUsers || [];
      res.claimTownReceiveUsers = res.claimTownReceiveUsers || [];
      res.handingTownReceiveUsers = res.handingTownReceiveUsers || [];
      res.createReceiveUsers = res.createReceiveUsers || [];
      // 区领导
      res.claimAreaReceiveUsers.forEach((v) => {
        v.id = v.userInfos.map((v) => v.userId).join(",");
        v.userInfos.forEach((user) => {
          user.id = user.userId;
          user.fullName = user.name;
        });
        this.claimAreaReceiveUsers.select = v.userInfos;
      });
      res.handingAreaReceiveUsers.forEach((v) => {
        v.id = v.userInfos.map((v) => v.userId).join(",");
        v.userInfos.forEach((user) => {
          user.id = user.userId;
          user.fullName = user.name;
        });
        this.handingAreaReceiveUsers.select = v.userInfos;
      });
      // 镇领导和操作员
      res.claimTownReceiveUsers.forEach((v) => {
        v.id = v.userInfos.map((v) => v.userId).join(",");
        v.userInfos.forEach((user) => {
          user.id = user.userId;
          user.fullName = user.name;
        });
        this.claimTownReceiveUsers[v.town].select = v.userInfos;
      });
      res.handingTownReceiveUsers.forEach((v) => {
        v.id = v.userInfos.map((v) => v.userId).join(",");
        v.userInfos.forEach((user) => {
          user.id = user.userId;
          user.fullName = user.name;
        });
        this.handingTownReceiveUsers[v.town].select = v.userInfos;
      });
      res.createReceiveUsers.forEach((v) => {
        v.id = v.userInfos.map((v) => v.userId).join(",");
        v.userInfos.forEach((user) => {
          user.id = user.userId;
          user.fullName = user.name;
        });
        this.createReceiveUsers[v.town].select = v.userInfos;
      });
      // 时间
      res.claimAreaThresholdValue = parseInt(res.claimAreaThresholdValue);
      res.claimTownThresholdValue = parseInt(res.claimTownThresholdValue);
      res.handingAreaThresholdValue =
        parseInt(res.handingAreaThresholdValue) / 60; //分钟转小时
      res.handingTownThresholdValue =
        parseInt(res.handingTownThresholdValue) / 60; //分钟转小时
      this.data = res;
      this.showDialog = true;
    },
    chooseUser(zhenjie, e) {
      this.createReceiveUsers[zhenjie].select = e;
    },
    chooseUserClaimAreaReceiveUsers(e) {
      this.claimAreaReceiveUsers.select = e;
    },
    chooseUserClaimTownReceiveUsers(zhenjie, e) {
      this.claimTownReceiveUsers[zhenjie].select = e;
    },
    chooseUserHandingAreaReceiveUsers(e) {
      this.handingAreaReceiveUsers.select = e;
    },
    chooseUserHandingTownReceiveUsers(zhenjie, e) {
      this.handingTownReceiveUsers[zhenjie].select = e;
    },
    async save() {
      // 区领导
      this.data.claimAreaReceiveUsers = [
        {
          userId: this.claimAreaReceiveUsers.select.map((v) => v.id).join(","),
        },
      ];
      this.data.handingAreaReceiveUsers = [
        {
          userId: this.handingAreaReceiveUsers.select
            .map((v) => v.id)
            .join(","),
        },
      ];
      // 镇街用户和镇街领导
      this.data.claimTownReceiveUsers = [];
      this.data.handingTownReceiveUsers = [];
      this.data.createReceiveUsers = [];
      this.zhenjie.forEach((v) => {
        // 认领镇领导
        if (this.claimTownReceiveUsers[v].select.length) {
          this.data.claimTownReceiveUsers.push({
            town: v,
            userId: this.claimTownReceiveUsers[v].select
              .map((v) => v.id)
              .join(","),
          });
        }
        // 核查镇领导
        if (this.handingTownReceiveUsers[v].select.length) {
          this.data.handingTownReceiveUsers.push({
            town: v,
            userId: this.handingTownReceiveUsers[v].select
              .map((v) => v.id)
              .join(","),
          });
        }
        // 操作用户
        if (this.createReceiveUsers[v].select.length) {
          this.data.createReceiveUsers.push({
            town: v,
            userId: this.createReceiveUsers[v].select
              .map((v) => v.id)
              .join(","),
          });
        }
        // end
      });
      let data = JSON.parse(JSON.stringify(this.data));
      data.handingAreaThresholdValue *= 60;
      data.handingTownThresholdValue *= 60;
      console.log(this.data);
      let res = await this.$Api().ContactPersonnelVerificationController.post_setting.request(
        {
          data,
        }
      );
      if (res === "设置成功") {
        this.$message.success(res);
        this.showDialog = false;
      } else this.$message.error(res);
    },
  },
};
</script>
<style lang="scss">
.alert-dialog {
  h2 {
    margin: 15px 0px;
  }
  .number-input {
    display: inline-block;
    width: 80px;
    margin: 0px 4px;
  }
  // .user-select-input{

  // }
  .user-select {
    display: flex;
    flex-wrap: wrap;
    background-color: #f9f9f9;
    margin: 5px 0px;
    padding: 5px 0px;
    .el-form-item {
      margin: 5px;
      width: 100%;
      .user-select-input {
        width: 100%;
      }
    }
    .user-select-item {
      display: flex;
      flex-wrap: wrap;
      .user-name {
        position: relative;
        margin-right: 20px;
        i {
          position: absolute;
          right: -15px;
          top: 0px;
          color: rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
