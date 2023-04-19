<template>
  <el-dialog
    title="时间轴"
    :visible="true"
    append-to-body
    @close="$emit('close')"
    width="400px"
    top="30px"
  >
    <template v-if="!timeline.length">
      暂无数据
    </template>
    <el-timeline :reverse="reverse">
      <template v-for="(activity, index) in timeline">
        <el-timeline-item
          :key="index"
          :timestamp="activity.timestamp"
          v-if="activity && activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </template>
    </el-timeline>
  </el-dialog>
</template>
<script>
import moment from 'moment'
export default {
  name: "timeline",
  props: ["data"],
  data() {
    return {
      reverse: false,
    };
  },
  computed: {
    timeline() {
      let tl = [
        {
          content: "结束时间",
          timestamp: this.data.jssj,
        },
        {
          content: "应解除观察日期",
          timestamp: this.data.yjcgcrq,
        },
        {
          content: "开始观察日期",
          timestamp: this.data.ksgcrq,
        },
        {
          content: "开始隔离时间",
          timestamp: this.data.ksglsj,
        },
        this.data.mjlx === "密切接触者"
          ? {
              content: "转为密接日期",
              timestamp: this.data.zwmjrq,
            }
          : null,
        this.data.sffb === "是"
          ? {
              content: "发病日期",
              timestamp: this.data.fbrq,
            }
          : null,
        {
          content: "最后接触日期",
          timestamp: this.data.zhjcrq,
        },
      ];
      tl= tl.filter((v)=>{return v&&v.timestamp})
      tl.forEach(v=>{
        if(v && v.timestamp){
          v.timestamp = moment(v.timestamp).format('YYYY-MM-DD')
        }
      })
      tl.sort((a,b)=>{
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })

      return tl;
    },
  },
};
</script>
