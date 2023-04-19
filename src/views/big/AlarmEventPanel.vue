<template>
  <div class="alarm-event">

    <el-tabs v-model="currTab" >
      <el-tab-pane label="防疫酒店" name="hotel">
      <alarm-event-special-table data-type="hotel"></alarm-event-special-table>
      </el-tab-pane>

      <el-tab-pane v-for="(item) in tabList" :label="item.label" :name="item.name" :key="item.name" :lazy="true">
        <alarm-event-table :setting="item"></alarm-event-table>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
  import AlarmEventSpecialTable from "./AlarmEventSpecialTable"
  import AlarmEventTable from  "./AlarmEventTable"
  export default {
    name: "AlarmEventPanel",
    components: {
      AlarmEventSpecialTable,
      AlarmEventTable,
    },
    created(){
      const {alarmType} = this.$store.state.common
      if (alarmType) {
        this.currTab = alarmType
      }
    },
    data() {
      return {
        currTab: 'hotel',
        tabList: [
          {id: 5001, name: 'keyPlaces', label:'重点场所扫码告警'},
          {id: 5003, name: 'mjPeople', label:'密接次密接人员去向核查告警'},
          {id: 5005, name: 'buyMedicine', label:'购药记录逾期未核查告警'},
          {id: 5004, name: 'dangerWorker', label:'高风险岗位人员核酸检测告警'},
          {id: 5002, name: 'specialPeople', label:'特殊人群服务告警'},
          {id: 5007, name: 'yellowCode', label:'黄码人员过多告警'},
        ]
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss" type="text/scss">

</style>
