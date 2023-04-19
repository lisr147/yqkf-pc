<template>
  <el-dialog
    :visible="true"
    top="10vh"
    title="告警设置"
    append-to-body
    :close-on-click-modal="false"
    @close="$emit('close')"
    width="600px"
    custom-class="alert-dialog"
  >
    <el-form label-width="120px" size="mini" :model="ruleForm"  :rules="rules" ref="ruleForm" style="margin-top: -20px">
      <div>
        <!-- 用户选择 -->
        <div class="user-select" v-for="(item,index) in userList" :key="index">
          <p class="title" v-if="item.rylb">{{ item.rylb }}：</p>
          <el-form-item label="核酸检测规则" required>
            <el-select size="small" v-model="item.hsThresholdValue" placeholder="请选择" style="width: 100%;z-index:200;">
              <el-option :value="tItem.value" :label="tItem.label" v-for="tItem in typeList" :key="tItem.label"/>
            </el-select>
          </el-form-item>
          <el-form-item label="告警接收人员">
            <div class="user-select-item">
              <div class="user-name" v-for="(user, index) in item.hsReceiveUsers.select" :key="index + user.fullName">
                {{ user.fullName }}
                <i class="el-icon-remove" @click=" item.hsReceiveUsers.select.splice(index, 1)"/>
              </div>
              <el-button @click="addUser(item)" type="text">+添加
              </el-button>
              <user
                v-model="item.hsReceiveUsers.edit"
                :showme="true"
                @chooseUser="chooseUserhsReceiveUsers"
                :selectedUsers="item.hsReceiveUsers.select"
              ></user>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button @click="save" type="primary">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import User from "@/components/supervision/User";
import {getSentinelWorkerAlarmDetail, setSentinelWorkerAlarm} from "@/api/alarm";

export default {
  name: "AlarmSentinelWorker", //哨点人员告警
  components: {
    User,
  },
  props: {
    tableId: {String, Number, required: true},
    hotelrylb: [String],
    schoolRylb: [String],
  },
  data() {
    return {
      ruleForm:{},
      typeList: [
        {label: '一天一检', value: '1/1'},
        {label: '两天一检', value: '1/2'},
        {label: '三天一检', value: '1/3'},
        {label: '三天两检', value: '2/3'},
        {label: '五天一检', value: '1/5'},
        {label: '七天一检', value: '1/7'},
        {label: '七天两检', value: '2/7'},
        {label: '七天三检', value: '3/7'},
        {label: '十四天一检', value: '1/14'},
      ],
      rules: {

      },
      showDialog: false,
      userList: [
        {rylb: '', hsReceiveUsers: {edit: false, select: []}},
      ],
      currType: null, //当前类型
    };
  },
  mounted() {
    this.showSetting()
  },
  methods: {
    async showSetting() {
      let params = {
        templateId: this.tableId
      }
      if (this.hotelrylb) params.rylb = this.hotelrylb
      if (this.schoolRylb) params.rylb = this.schoolRylb
      let res = await getSentinelWorkerAlarmDetail(params);
      res.map(v => {
        if(v.hsReceiveUsers){
          v.hsReceiveUsers.map((k) => {
            k.userInfos.map((user) => {
              user.id = user.userId;
              user.fullName = user.name;
            });
            k.select = k.userInfos
            v.hsReceiveUsers = {
              edit: false, select:k.userInfos
            }
          })
        }else {
          v.hsReceiveUsers = {edit: false, select: []}
        }
      })

      this.userList = res;
      if(this.schoolRylb){
        let item = this.userList.find(i=>i.rylb===this.schoolRylb)
        this.userList =  [item]
      }
      if(this.hotelrylb){
        let item = this.userList.find(i=>i.rylb===this.hotelrylb)
        this.userList =  [item]
      }
      this.showDialog = true;
    },
    addUser(item) {
      item.hsReceiveUsers.edit = true
      this.currType = item.rylb
    },
    chooseUserhsReceiveUsers(e) {
      this.userList.find(i => i.rylb === this.currType).hsReceiveUsers.select = e;
    },

    async save() {
      const {userList} = this
      for (const key in userList) {
        if (!userList[key].hsThresholdValue) {
          return this.$message.error(`${this.userList[key].rylb || ''}请选择核酸检测规则`)
        }
        this.userList[key].userId = this.userList[key].hsReceiveUsers.select.map(k => k.id).join(',')
      }
      let params = this.userList.map(v => {
        const {rylb, hsThresholdValue, userId} = v
        return {
          rylb,
          hsReceiveUsers: [{userId}],
          hsThresholdValue
        }
      })
      let res = await setSentinelWorkerAlarm(params, this.tableId)
      if (res === "设置成功") {
        this.$message.success(res);
        this.$emit('close')
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

  .user-select {
    display: flex;
    flex-wrap: wrap;
    background-color: #f9f9f9;
    margin: 10px 0px;
    padding: 5px 0px;

    .title {
      margin: 3px 10px;
      font-weight: 600;
    }

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
