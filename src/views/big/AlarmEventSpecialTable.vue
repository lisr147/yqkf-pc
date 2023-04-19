<template>
  <div class="alarm-event-table">

    <table-page
      :data="tableListData"
      :filter="filter"
      :hideKeyFilter="true"
      :height="400"
      @search="search"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
      @resetSearch="resetSearch"
      customClass="staff_table"
    >
      <template slot="searchFilter">
        <div class="search-box">
          <el-form :inline="true" :model="filter" label-width="80px">
            <el-form-item label="所属镇街">
              <el-select v-model="filter.sszj" style="width:180px;">
                <el-option v-for="(item,key) in townList" :key="key" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="告警场所" v-if="dataType=='public'">
              <el-input v-model="filter.areaName" placeholder="请输入告警场所名称"></el-input>
            </el-form-item>
            <el-form-item label="告警类型" v-if="dataType=='hotel'">
              <el-select v-model="filter.alarmType" style="width:180px;">
                <el-option v-for="(item,key) in alarmTypeMap" :key="key" :label="item.label" :value="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="告警时间" >
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="filter.timeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="处理情况"  v-if="dataType=='hotel'">
              <el-select v-model="filter.processState">
                <el-option v-for="(item,key) in processStateMap" :key="key" :label="item.label" :value="key"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>

      <!--告警处理-->
      <template v-slot:column_processState="row">
        <span :style="{color: processStateMap[row.value.processState].color}">
          {{processStateMap[row.value.processState].label}}
        </span>
      </template>

      <!--告警图片-->
      <template v-slot:column_capturePicture="row">
        <a href="javascript:void(0)" @click="showGallery(row.value)" >点击查看</a>
        <!--:href="row.value.capturePicture"-->
      </template>

      <!--告警类型-->
      <template v-slot:column_type="row">
        <span>
          {{alarmTypeMap[row.value.type].label}}
        </span>
      </template>

      <!--健康码-->
      <template v-slot:column_skmStatus="row">
        <span :style="{color: skmStatusMap[row.value.skmStatus].color}">
          {{skmStatusMap[row.value.skmStatus].label}}
        </span>
      </template>

    </table-page>

    <!--图片浏览-->
    <viewer :images="imgList"  class="gallery" ref="alarmGallery" style="display: none;">
      <img v-for="(item,index) in imgList" :src="item.thumbnail" :data-src="item.url" :key="index">
    </viewer>

  </div>
</template>

<script>
  import TablePage from "zkzc-table-page";
  import TablePageFunc from "@/utils/tablepage";
  import {getAlarmEventFormHotel} from  "@/api/mapData"
  import {formatDate, formatTime} from '@/utils/common'
  import SETTING from '@/config/MapSetting'

  export default {
    name: "AlarmEventSpecialTable",
    components: {
      TablePage,
    },
    mixins: [TablePageFunc],
    props: ['dataType','visible'],
    data() {
      return {
        filter:{
          sszj: null,
          areaName: null,
          alarmType: null,
          timeRange: [],
          processState: null,
          pageNum: 1,
          pageSize: 15,
          rowTotal: 1,
          pageSizes: [15, 50, 100, 200],
        },

        tableListData: {
          selection: false,
          tableData: [],
          tableKeys: (function(dataType){
            var res
            switch(dataType){
              case 'hotel':
                res = [
                  {id: 'alarmTime', label: '告警时间',width: 200},
                  {id: 'type', label: '告警类型',width: 150},
                  {id: 'areaName', label: '告警场所',width:300},
                  {id: 'capturePicture', label: '告警图片',minWidth: 150}, //panoramaPicture 全景图片路径  //capturePicture 抓拍图片路径
                  {id: 'processState', label: '告警处理 ',minWidth: 150}, // 0未处理 1已处理
                ]
                break;
              case 'other':
                res = [
                  {id: 'alarmTime', label: '告警时间',width: 200},
                  {id: 'stationName', label: '告警场所',width: 300 },
                  {id: 'personName', label: '人员姓名',minWidth: 150},
                ]
                break;
              default:
                break;
            }
            return res

          })(this.dataType),
        },
        alarmTypeMap: {
          1: {label: '防护不当告警',},
          2: {label: '擅自外出告警',},
          5: {label: '高危行为告警',},
          8: {label: '体温异常告警',},
        },
        processStateMap: {
          0: {label: '未处理', color: '#F42A34'},
          1: {label: '已处理', color: '#32C416'},
        },
        skmStatusMap:{
          1: {label: '绿码', color: '#32C416'},
          2: {label: '红码', color: '#F42A34'},
          3: {label: '黄码', color: '#FFFF00'},
        },
        townList: [],
        imgList: []
      }
    },
    computed: {
      town() {
        return this.$store.state.common.alarmTown
      }
    },
    watch: {
      town: {
        handler(val) {
          this.$set(this.filter, 'sszj', val)
        },
        immediate: true
      }
    },
    created() {
      //初始化告警时间
      var date = new Date()

      if (this.town) {
        //获取今日的告警
        this.filter.timeRange = [`${formatDate(date)} 00:00:00`, `${formatDate(date)} 23:59:59`]
      } else {
        //获取昨天到现在的告警
        this.filter.timeRange = [formatTime(date.setDate(date.getDate() - 1)), formatTime(new Date())]
      }

      //初始化所属镇街
      this.townList = SETTING.getTownList()
    },
    async mounted(){
      await this.getData()
    },
    methods: {
      async getData(){

        var startTime = null
        var endTime = null
        var rangeArr = this.filter.timeRange

        if (rangeArr && rangeArr.length > 0) {
          startTime = rangeArr[0]
          endTime = rangeArr[1]
        }

        switch (this.dataType){
          case 'hotel':

            var res = await getAlarmEventFormHotel({
              condition: {
                alarm: parseInt(this.filter.alarmType), //告警类型
                processState:  parseInt(this.filter.processState),//0未处理 1已处理
                town: this.filter.sszj,
                startTime,
                endTime,
              },
              page: this.filter.pageNum,
              pageSize: this.filter.pageSize
            })


            this.tableListData.tableData = res.data
            this.filter.rowTotal = res.total
            break;

          case 'other':
            this.tableListData.tableData = []
            this.filter.rowTotal = 0
            break;

          default:
            break;
        }

      },
      resetSearch() {
        this.filter.sszj = null
        this.filter.areaName = null
        this.filter.alarmType = null
        this.filter.timeRange = []
        this.filter.processState = null
        this.filter.pageNum = 1
        this.filter.pageSize = 15
        this.filter.rowTotal = 1
        this.getData()
      },
      search(){
        this.filter.pageNum = 1;
        this.getData()
      },

      showGallery(item){

        this.imgList = [
          {url: item.capturePicture, thumbnail: item.capturePicture},
          {url: item.panoramaPicture, thumbnail: item.panoramaPicture}
        ]

        const viewer = this.$refs['alarmGallery'].$viewer
        viewer.show()
      }

    }
  }
</script>

<style lang="scss" type="text/scss">
  .alarm-event-table {
    a {
      color: #4E7CFC;
    }
    .searchControl{
      .el-button--text{
        display: none;
      }
    }
  }
</style>
