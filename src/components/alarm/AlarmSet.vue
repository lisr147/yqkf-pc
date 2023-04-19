<!-- 新增、编辑、查看详细数据-->
<template>
  <div>
    <el-dialog
        :visible="true"
        top="10vh"
        title="告警设置"
        :close-on-click-modal="false"
        @close="$emit('close')"
        width="500px"
        custom-class="alarm-box"
    >
      <el-form :model="form" ref="alarmForm" :rules="{
        handingTownThresholdValue: [{required: true,message: '请输入百分比', trigger: 'blue'}]
      }">
        <el-form-item>
          <template v-if="tableId === 'ggcs'">
            <h3>重点场所告警推送规则设置</h3>
            <el-form-item label="当昨日重点场所扫码数量少于上一周平均值的">
              <el-input
                  style="width:80px;display: inline-block"
                  v-model="form.handingTownThresholdValue">
              </el-input> %则告警
            </el-form-item>
            <select-users-from-street @updateSelected="updateSelected" :selected="selected"></select-users-from-street>

            <!--所有场所告警推送规则设置-->
            <div class="rule-card">
              <h3>所有场所告警推送规则设置</h3>
              <el-form-item label="当本周场所扫码数量小于近四周平均值的">
                <el-input
                  style="width:80px;display: inline-block"
                  v-model="form.commonAlarmTownThresholdValue">
                </el-input> %则告警
              </el-form-item>

              <!--            todo 别删，暂时隐藏2022-11-19-->
<!--              <h3>告警接收人员</h3>-->
<!--              <select-users-from-street @updateSelected="updateSelected($event,'common')" :selected="commonAlarmTownReceiveUsers"></select-users-from-street>-->
            </div>

            <!-- 公共场所红黄码告警推送规则设置 -->
            <h3>公共场所红黄码告警推送规则设置</h3>
              <el-form-item>
                <el-checkbox v-model="form.commonRedYellowThresholdValue">当场所码扫码时发现红黄码则告警</el-checkbox>
              </el-form-item>

          </template>
          <template v-if="tableId === 'hhmry'">
            <h3>告警规则：</h3>
            <el-form-item label="当天全南沙区的黄码人员总数>=">
              <el-input
                  style="width:80px;display: inline-block"
                  v-model="form.handingTownThresholdValue">
              </el-input> 人
            </el-form-item>
          </template>

          <!--药店的购药记录（特殊处理）这里是个坑，后端createReceiveUsers是任务核查人员，handingTownReceiveUsers是告警接收人员，和其他告警字段相反-->
          <template v-if="[10057].includes(tableId)">
            <el-form-item label="任务未核查逾期">
              <el-select v-model="form.handingTownThresholdValue">
                <el-option
                    v-for="item in thresholdValue"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
              <span>触发告警提醒</span>
            </el-form-item>
            <h3>任务核查人员</h3>
            <select-users-from-street @updateSelected="updateSelected" :selected="selected"></select-users-from-street>
            <h3>告警接收人员</h3>
            <select-users-from-street @updateSelected="updateSelected($event,'gjtsry')" :selected="selected2"></select-users-from-street>
          </template>

          <template  v-if="![10057,'hhmry','ggcs'].includes(tableId)">
            <h3>告警接收人员</h3>
            <select-users-from-street @updateSelected="updateSelected" :selected="selected"></select-users-from-street>
          </template>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import SelectUsersFromStreet from "@/components/alarm/SelectUsersFromStreet";

const thresholdValue = [
  {
    label: '24小时',
    value: '24'
  },
  {
    label: '48小时',
    value: '48'
  },
  {
    label: '72小时',
    value: '72'
  }
]

export default {
  name: "AlarmSet",
  props: {
    showme: Boolean,
    tableId: [String, Number],
    alarmSetting: Object
  },
  components: {
    SelectUsersFromStreet,
  },
  watch: {
    alarmSetting: {
      immediate: true,
      handler(val) {
        if(val) {
          this.form = val;
           if(val.createReceiveUsers){
            this.form.createReceiveUsers = val.createReceiveUsers.map(v => ({
              ...v,
              userId: v.userInfos.map(v => v.userId).join(',')
            }))
            this.selected = val.createReceiveUsers;
          }
          if(val.handingTownReceiveUsers){
            this.form.handingTownReceiveUsers = val.handingTownReceiveUsers.map(v => ({
              ...v,
              userId: v.userInfos.map(v => v.userId).join(',')
            }))
            this.selected2 = val.handingTownReceiveUsers;
          }
          if(val.commonAlarmTownReceiveUsers){
            this.form.commonAlarmTownReceiveUsers = val.commonAlarmTownReceiveUsers.map(v => ({
              ...v,
              userId: v.userInfos.map(v => v.userId).join(',')
            }))
            this.commonAlarmTownReceiveUsers = val.commonAlarmTownReceiveUsers;
          }
        }
      }
    }
  },
  data() {
    return {
      form: {
        handingTownThresholdValue : '',
        commonAlarmTownThresholdValue : '',
        createReceiveUsers : null,
        handingTownReceiveUsers: null,
        commonAlarmTownReceiveUsers: null,
        commonRedYellowThresholdValue: true
      },
      userVisible:false,
      selectedzxryList: [],
      thresholdValue,
      selected: [],//告警接收人员
      selected2: [], //购药记录核查人员
      commonAlarmTownReceiveUsers: [], //所有场所告警推送人员
    };
  },
  methods: {
    updateSelected(usersList,type) {
      if(type==='common'){
        this.form.commonAlarmTownReceiveUsers = usersList.map(item => ({
          town: item.town,
          userId: item.selected.map(v => v.id).join(',')
        }));
      } else if(type==='gjtsry'){
        this.form.handingTownReceiveUsers = usersList.map(item => ({
          town: item.town,
          userId: item.selected.map(v => v.id).join(',')
        }));
      }else {
        this.form.createReceiveUsers = usersList.map(item => ({
          town: item.town,
          userId: item.selected.map(v => v.id).join(',')
        }));
      }
    },
    onzxryFocus () {
      this.userVisible = true
    },
    onzxryRemove (val) {
      const index = this.selectedzxryList.findIndex(item => item.id === val)
      this.selectedzxryList.splice(index, 1)
    },
    async save() {
      const { tableId } = this;
      const { createReceiveUsers, handingTownReceiveUsers,commonAlarmTownReceiveUsers } = this.form;
      await this.$refs.alarmForm.validate();
      if([10057, 'ggcs'].includes(tableId)) {
        if(createReceiveUsers) this.form.createReceiveUsers.forEach(v => v.userInfos&&delete v.userInfos);
        if(handingTownReceiveUsers) this.form.handingTownReceiveUsers.forEach(v => v.userInfos&&delete v.userInfos);
        if(commonAlarmTownReceiveUsers) this.form.commonAlarmTownReceiveUsers.forEach(v => v.userInfos&&delete v.userInfos);
      } else {
        if(createReceiveUsers) this.form.createReceiveUsers.forEach(v => delete v.userInfos);
      }
      const data = JSON.parse(JSON.stringify(this.form))
      this.$emit('alarmSetSave', data);
    },
  },
};
</script>
<style scoped lang="scss">
.alarm-box {
  .rule-card{
    margin-top: 20px;
  }
  .el-form-item--small.el-form-item{
      margin-bottom: 0px;
  }
}
</style>
