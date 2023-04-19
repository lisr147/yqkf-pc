<template>
  <div style="padding:10px;">
    <el-table
      :data="listData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="alarmBigType" label="告警类型" width="180px">
      </el-table-column>
      <el-table-column prop="alarmTypeName" label="告警名称" width="260px"> </el-table-column>
      <el-table-column prop="isSendGroup" label="推送到群" width="120px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isSendGroup"
            active-text="开"
            inactive-text="关"
            active-value="1"
            inactive-value="0"
            @change="updateData(scope)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="isSendPerson" label="推送到个人" width="120px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isSendPerson"
            active-text="开"
            inactive-text="关"
            active-value="1"
            inactive-value="0"
            @change="updateData(scope)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="sendTimeLine" label="推送时间段">
        <template slot-scope="scope">
          <el-time-picker
            v-model="scope.row.timeRangeStart"
            :clearable="false"
            placeholder="选择开始时间"
            value-format="HH:mm:ss"
            @change="updateData(scope)"
          />
           至
          <el-time-picker
            v-model="scope.row.timeRangeEnd"
            :clearable="false"
            placeholder="选择结束时间"
            value-format="HH:mm:ss"
            @change="updateData(scope)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "alarmConfig",
  data() {
    return {
      listData: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$Api().AlarmConfigController.post_pageList.request({
        data: {
          condition: {},
          page: 1,
          pageSize: 200,
        },
      });
      this.listData = [];
      // 告警类型分组
      let alarmBigTypeGroup = {};
      res.data.forEach((v) => {
        if (!alarmBigTypeGroup[v.alarmBigType]) {
          alarmBigTypeGroup[v.alarmBigType] = [];
        }
        alarmBigTypeGroup[v.alarmBigType].push(v);
      });
      for (let i in alarmBigTypeGroup) {
        alarmBigTypeGroup[i].forEach((v, groupDataIndex) => {
          if (groupDataIndex === 0) {
            v.groupDataCount = alarmBigTypeGroup[i].length;
          } else {
            v.groupDataCount = 0;
          }

          v.timeRangeStart = ""
          v.timeRangeEnd = ""
          if(v.sendTimeLine){
            // 跨天情况
            if(v.sendTimeLine.includes(',')){
              let sendTimeLine = v.sendTimeLine.split(',')
              v.timeRangeStart = sendTimeLine[0].split('-')[0]
              v.timeRangeEnd = sendTimeLine[1].split('-')[1]
            }
            else{
              let sendTimeLine = v.sendTimeLine.split('-')
              v.timeRangeStart = sendTimeLine[0]
              v.timeRangeEnd = sendTimeLine[1]
            }
          }else {
            v.timeRangeStart = '00:00:00'
            v.timeRangeEnd = '23:59:59'
          }
          this.listData.push(v);
        });
      }
      // console.log(alarmBigTypeGroup, this.listData);
    },
    objectSpanMethod({ row, column }) {
      // console.log('objectSpanMethod',row, column.property, rowIndex, columnIndex)
      if (column.property === "alarmBigType") {
        return {
          rowspan: row.groupDataCount,
          colspan: row.groupDataCount ? 1 : 0,
        };
      }
    },
    async updateData(scope){
      // console.log(scope)
      let data = scope.row

      if(!data.timeRangeStart){
        this.$message({
            message: '请选择推送开始时间',
            type: 'error'
          })
          return
      }
      if(!data.timeRangeEnd){
        this.$message({
            message: '请选择推送结束时间',
            type: 'error'
          })
          return
      }


      data.sendTimeLine = ''
      // 跨天情况
      if(data.timeRangeStart.split(':')[0]>data.timeRangeEnd.split(':')[0]){
        data.sendTimeLine = `${data.timeRangeStart}-23:59:59,00:00:00-${data.timeRangeEnd}`
      }
      else{
        data.sendTimeLine = `${data.timeRangeStart}-${data.timeRangeEnd}`
      }

      await this.$Api().AlarmConfigController.post_save.request({
        data
      })

      this.getData()
    }
  },
};
</script>
