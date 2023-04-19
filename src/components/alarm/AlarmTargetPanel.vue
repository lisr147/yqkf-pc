<template>
  <el-dialog
      title="选择人员"
      width="600px"
      :visible="true"
      @close="close"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="true">

    <div class="alarm-target-panel">
      <div class="main">
        <el-tag
            closable
            size="small"
            v-for="(tag,index) in targetList"
            @close="removeItem(index)"
            :key="index">
          {{tag.fullName}}
        </el-tag>
        <el-button size="mini"  @click="addItem">+ 添加</el-button>
      </div>
    </div>

    <template v-slot:footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>

    <select-user
        v-model="selectorVisible"
        @chooseUser="chooseUser"
        :selectedUsers="targetList"
    />

  </el-dialog>
</template>

<script>
import SelectUser from "../common/SelectUser"
import {setFrontLineAlarmSetting, getFrontLineAlarmSetting} from "@/api/frontLineStaff"
export default {
  name: "AlarmTargetPanel",
  components: {SelectUser},
  props: {
    showme: { type: Boolean },
  },
  model: {
    prop: 'showme',
    event: 'toggle'
  },
  data() {
    return {
      selectorVisible: false,
      targetList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      const res = await getFrontLineAlarmSetting()
      const users = res?.createReceiveUsers[0]?.userInfos || []
      this.targetList = users.map(v => {
        return {
          id: v.userId,
          fullName: v.name,
        }
      })
    },

    chooseUser(items) {
      this.targetList = items
    },

    close() {
      this.$emit('close')
    },

    addItem() {
      this.selectorVisible = true
    },

    removeItem(index){
      this.targetList.splice(index, 1)
    },

    async save(){
      const ids = this.targetList.map(v => v.id)
      await setFrontLineAlarmSetting({
        createReceiveUsers: [{
          town: null,
          userId: ids.join(',')
        }]
      })
      this.$message.success("设置成功")
      this.close()
    }
  }
}
</script>

<style lang="scss" type="text/scss">
.alarm-target-panel{
  .main {
    max-height: 300px;
    overflow: auto;
  }
  .el-tag{
    margin: .3em;
  }
}
</style>
