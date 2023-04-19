<template>

  <div class="el-dialog" v-dialogDrag style="width:900px; z-index: 99999; " v-if="visible">
    <div class="el-dialog__header">
      <div>回放视频</div>
      <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="close()">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </button>
    </div>
    <div class="el-dialog__body">

      <div class="video-record">

        <div  class="vbox">
          <video-player
            v-if="detail.url"
            :title="`${detail.ssdw}-${detail.uid}`"
            :isLive="false"
            :videoUrl="detail.url"
            :videoInfo="detail.videoInfo"></video-player>
        </div>

        <div class="staff_table">
          <el-date-picker v-model="timeRange" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                          range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          <el-select v-model="tValue" placeholder="请选择播放时段" style="margin-left: 0.5em;width:320px;">
            <el-option v-for="(item,index) in tList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>

          <el-button style="margin-left: 0.5em;" size="small" type="primary" @click="getData" :disabled="!playEnable">确定</el-button>
        </div>

        <div class="tip">
           建议时间区间大于10秒且小于24小时
        </div>

      </div>

    </div>
  </div>


</template>

<script>
  import {getVideoFromUid, getRecordTimeRangeList} from '@/api/mapData'
  import {formatTime} from '@/utils/common'

  export default {
    name: "VideoRecordBoard",
    components: {
      VideoPlayer: () => import("@/components/EasyPlayer/VideoPlayer.vue")
    },
    data() {
      return {
        visible: false,
        //时间范围
        timeRange: [],

        //指定时间范围内可以选的时段列表
        tList: [],
        tValue: '',

        detail: {}
      }
    },
    created(){
    },
    watch:{
      visible(val) {
        if (val == false) {
          this.reset()
        }
      },
      timeRange(val){
        if (val && val.length==2) {
          this.getTimeList()
        }
      }
    },
    computed:{
      playEnable(){
        const {uid, templateId} = this.detail
        return uid && templateId && this.tValue.split(' ~ ').length == 2
      }
    },
    mounted() {
    },
    methods: {

      async show(data) {
        this.visible = true

        if (data) {
          this.detail = Object.assign({}, data)

          //获取最近一天内的时间段列表
          var date = new Date()
          this.timeRange = [formatTime(date.setHours(date.getHours() - 1)) , formatTime(new Date())]
          await this.getTimeList()

          this.getData()

        }
      },

      close() {
        this.visible = false
      },

      reset(){
        this.detail = {}
      },

      //获取时段列表
      async getTimeList(){

        const {uid, templateId} = this.detail
        if (!uid || !templateId) {
          return
        }

        const params = {
          templateId,
          deviceUid: uid,
          startDate: this.timeRange[0],
          endDate: this.timeRange[1]
        }

        let res = await getRecordTimeRangeList(params)

        this.tList = res.map(({beginTime, endTime})=>{
          return {
            label: `${beginTime} ~ ${endTime}`,
            value: `${beginTime} ~ ${endTime}`
          }
        })

        if (this.tList.length > 0) {
          this.tValue = this.tList[0].value
        } else {
          this.tValue = ''
        }

      },

      //获取视频地址
      async getData(){

        if (this.tValue.split(' ~ ').length !=2) {
          return
        }
        const {uid, templateId} = this.detail

        const [startDate, endDate] = this.tValue.split(' ~ ')

        const params = {
          isRecord: true,
          templateId,
          deviceUid: uid,
          startDate,
          endDate
        }

        let videoInfo = await getVideoFromUid(params)
        this.detail.url  = videoInfo.url
        this.detail.videoInfo  = videoInfo

      }

    }
  }
</script>

<style lang="scss" type="text/scss">
  .video-record {
    .tip{
      padding: 4px;
      color: #fff;
    }
    .vbox {
      position: relative;
      margin-bottom: 1em;
      height: 480px;
      background-color: #000;
    }
  }
</style>
