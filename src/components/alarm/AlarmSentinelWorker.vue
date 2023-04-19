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
    <el-form label-width="120px" size="mini">
      <div>
        <el-form-item label="核酸检测规则" prop="lx" >
          <el-select size="small" v-model="data.hsThresholdValue" placeholder="请选择" style="width: 100%;z-index:200;">
            <el-option :value="item.value" :label="item.label" v-for="item in typeList" :key="item.label" />
          </el-select>
        </el-form-item>
        <!-- 用户选择 -->
        <div class="user-select">
          <el-form-item label="告警接收人员">
            <div class="user-select-item">
              <div
                  class="user-name"
                  v-for="(user, index) in hsReceiveUsers.select"
                  :key="index + user.fullName"
              >
                {{ user.fullName }}
                <i
                    class="el-icon-remove"
                    @click="
                      hsReceiveUsers.select.splice(index, 1)
                    "
                />
              </div>
              <el-button
                  @click="hsReceiveUsers.edit = true"
                  type="text"
              >+添加
              </el-button
              >
              <user
                  v-model="hsReceiveUsers.edit"
                  :showme="true"
                  @chooseUser="chooseUserhsReceiveUsers"
                  :selectedUsers="hsReceiveUsers.select"
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
import {getSentinelWorkerAlarmDetail,setSentinelWorkerAlarm} from "@/api/alarm";

export default {
  name: "AlarmSentinelWorker", //哨点人员告警
  components: {
    User,
  },
  props: {
    tableId: [String, Number],
    hotelrylb: [String],
    schoolRylb: [String],
  },
  data() {
    return {
      typeList:[
        {label:'一天一检',value:'1/1'},
        {label:'两天一检',value:'1/2'},
        {label:'三天一检',value:'1/3'},
        {label:'三天两检',value:'2/3'},
        {label:'五天一检',value:'1/5'},
        {label:'七天一检',value:'1/7'},
        {label:'七天两检',value:'2/7'},
        {label:'七天三检',value:'3/7'},
        {label:'十四天一检',value:'1/14'},
      ],
      showDialog: false,
      data: {
        hsReceiveUsers: [],
        hsThresholdValue:''
      },
      hsReceiveUsers :{
        edit: false,
        select: [],
      }
    };
  },
  mounted() {
    this.showSetting()
  },
  methods: {
    async showSetting() {
      let params={
        templateId:this.tableId
      }
      if(this.hsThresholdValue) params.rylb=this.hsThresholdValue
      if(this.schoolRylb) params.rylb=this.schoolRylb
      console.log(params);
      let res = await getSentinelWorkerAlarmDetail(params);
      res.hsReceiveUsers = res.hsReceiveUsers || []; //哨点推送任务人员
      res.hsReceiveUsers.forEach((v) => {
        v.id = v.userInfos.map((v) => v.userId).join(",");
        v.userInfos.forEach((user) => {
          user.id = user.userId;
          user.fullName = user.name;
        });
        this.hsReceiveUsers.select = v.userInfos;
      });
      this.data = res;
      this.showDialog = true;
    },

    chooseUserhsReceiveUsers(e) {
      this.hsReceiveUsers.select = e;
    },

    async save() {
      if(!this.data.hsThresholdValue) return this.$message.error('请选择核酸检测规则')

      this.data.hsReceiveUsers = [
        {
          userId: this.hsReceiveUsers.select
              .map((v) => v.id)
              .join(","),
        },
      ];

      let data = JSON.parse(JSON.stringify(this.data))
      if(this.schoolRylb) data.rylb=this.schoolRylb
      let res = await setSentinelWorkerAlarm(data,this.tableId)
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
