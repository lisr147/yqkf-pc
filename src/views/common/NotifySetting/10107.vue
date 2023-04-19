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
        <h2>镇街接收推送任务人员</h2>
        <!-- 用户选择 -->
        <div class="user-select">
          <el-form-item
              v-for="item in zhenjie"
              :key="`revicer_${item}`"
              :label="item"
              class="user-select-1"

          >
            <div class="user-select-item">
              <div
                  class="user-name"
                  v-for="(user, index) in appointmentZjReceiveUsers[item].select"
                  :key="item + user.fullName"
              >
                {{ user.fullName }}
                <i
                    class="el-icon-remove"
                    @click="appointmentZjReceiveUsers[item].select.splice(index, 1)"
                />
              </div>
              <el-button
                  @click="appointmentZjReceiveUsers[item].edit = true"
                  type="text"
              >+添加
              </el-button
              >
              <user
                  v-model="appointmentZjReceiveUsers[item].edit"
                  :showme="true"
                  @chooseUser="chooseUser(item, $event)"
                  :selectedUsers="appointmentZjReceiveUsers[item].select"
              ></user>
            </div>
          </el-form-item>
        </div>

        <h2>住建交通局推送任务人员</h2>
        <div>
          <!-- 用户选择 -->
          <div class="user-select">
            <el-form-item label="住建交通局">
              <div class="user-select-item">
                <div
                    class="user-name"
                    v-for="(user, index) in appointmentZjbReceiveUsers.select"
                    :key="item + user.fullName"
                >
                  {{ user.fullName }}
                  <i
                      class="el-icon-remove"
                      @click="
                      appointmentZjbReceiveUsers.select.splice(index, 1)
                    "
                  />
                </div>
                <el-button
                    @click="appointmentZjbReceiveUsers.edit = true"
                    type="text"
                >+添加
                </el-button
                >
                <user
                    v-model="appointmentZjbReceiveUsers.edit"
                    :showme="true"
                    @chooseUser="chooseUserappointmentZjbReceiveUsers"
                    :selectedUsers="appointmentZjbReceiveUsers.select"
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
import {getTruckDriverAlarmDetail,truckDriverAlarmSet} from "@/api/truckReserve";

export default {
  name: "Notify10107",
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
    let appointmentZjReceiveUsers = {};
    let appointmentZjbReceiveUsers = {
      edit: false,
      select: [],
    };
    zhenjie.forEach((v) => {
      appointmentZjReceiveUsers[v] = {
        edit: false,
        select: [],
      };
    });

    return {
      showDialog: false,
      zhenjie,
      data: {
        // 住建交通局推送任务人员
        appointmentZjbReceiveUsers: [],
        //镇街用户
        appointmentZjReceiveUsers: [],
      },
      appointmentZjReceiveUsers,
      appointmentZjbReceiveUsers,
    };
  },
  methods: {
    async showSetting() {
      let res = await getTruckDriverAlarmDetail();

      res.appointmentZjReceiveUsers = res.appointmentZjReceiveUsers || [];   //镇街
      res.appointmentZjbReceiveUsers = res.appointmentZjbReceiveUsers || []; //住建交通局推送任务人员
      // 住建交通局推送任务人员
      res.appointmentZjbReceiveUsers.forEach((v) => {
        v.id = v.userInfos.map((v) => v.userId).join(",");
        v.userInfos.forEach((user) => {
          user.id = user.userId;
          user.fullName = user.name;
        });
        this.appointmentZjbReceiveUsers.select = v.userInfos;
      });
      res.appointmentZjReceiveUsers.forEach((v) => {
        v.id = v.userInfos.map((v) => v.userId).join(",");
        v.userInfos.forEach((user) => {
          user.id = user.userId;
          user.fullName = user.name;
        });
        this.appointmentZjReceiveUsers[v.town].select = v.userInfos;
      });
      this.data = res;
      this.showDialog = true;
    },
    chooseUser(zhenjie, e) {
      this.appointmentZjReceiveUsers[zhenjie].select = e;
    },


    chooseUserappointmentZjbReceiveUsers(e) {
      this.appointmentZjbReceiveUsers.select = e;
    },

    async save() {
      // 住建局
      this.data.appointmentZjbReceiveUsers = [
        {
          userId: this.appointmentZjbReceiveUsers.select
              .map((v) => v.id)
              .join(","),
        },
      ];
      // 镇街用户和镇街领导
      this.data.appointmentZjReceiveUsers = [];
      this.zhenjie.forEach((v) => {
        // 操作用户
        if (this.appointmentZjReceiveUsers[v].select.length) {
          this.data.appointmentZjReceiveUsers.push({
            town: v,
            userId: this.appointmentZjReceiveUsers[v].select
                .map((v) => v.id)
                .join(","),
          });
        }
        // end
      });
      let data = JSON.parse(JSON.stringify(this.data));
      console.log(this.data);
      let res = await truckDriverAlarmSet(data)
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
