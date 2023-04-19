<template>
  <div>
    <el-dialog title="列表" custom-class="city-detail" top="5vh" :visible="true" :width="activeName==='楼栋人员信息'?'500px':'70vw'" @close="$emit('close')">
      <el-tabs v-model="activeName" @tab-click="handleTabs">
        <el-tab-pane v-for="(item,index) in tabsArr" :key="index" :label="item" :name="item">
          <people-chart :peopleData="tabsAllData.peopleData" v-if="activeName==='楼栋人员信息'" @showDetail="showPeopDetail"></people-chart>
          <table-page
            v-else
            :data="tableListData"
            ref="table"
            :filter="filter"
            :hideSearch="true"
            :hideKeyFilter="true"
            customClass="staff_table"
          >
          </table-page>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <peopleDialog :props="tabsAllData.peopleData" v-if="showPeopleDialog" @close="showPeopleDialog = false"/>
    <infoDetail v-if="showDetail" :dataList="dataList"  @close="showDetail=false"></infoDetail>
    <!--视频浮层面板-->
    <video-detail-board ref="videoDetailBoard" />
  </div>
</template>
<script>
import TablePage from "zkzc-table-page";
import peopleChart from "./peopleChart";
import peopleDialog from "./peopleDialog";
import infoDetail from "./infoDetail";
import VideoDetailBoard from '../big/layer/VideoDetailBoard'
import  {getVideoFromUid} from '@/api/mapData.js'
export default {
  name: "UrbanVillagesDetail",
  components: { TablePage, peopleChart, peopleDialog, infoDetail,VideoDetailBoard },
  props: ["tabsAllData", 'tabsArr'],
  data () {
    return {
      showPeopleDialog:false,
      showDetail:false,
      activeName: null,
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        pageSizes: [10, 20, 50, 100, 500, 1000],
      },
      tableListData: {
        tableFunctions: [
          {
            label: "详情",
            method: this.view,
          },
        ]
      },
      dataList:[],
    };
  },
  mounted () {
    this.activeName = this.tabsArr[0]
    this.initData()
  },

  methods: {
    initData () {
      // console.log(this.activeName)
      switch (this.activeName) {
        case '城中村市政公用设施':
          Object.assign(this.tableListData,this.tabsAllData.publicFaciData)
          break
        case '城中村公共服务设施':
          Object.assign(this.tableListData,this.tabsAllData.serveFaciData)
          break
        case '城中村重点场所':
          Object.assign(this.tableListData,this.tabsAllData.KeyPlaceData)
          break
        case '楼栋人员信息':
          Object.assign(this.tableListData,this.tabsAllData.peopleData)
          break
        case '监控电子眼':
          Object.assign(this.tableListData,this.tabsAllData.cityPartsData)
          this.tableListData.columnFunctionsWidth = 200,
          this.tableListData.tableFunctions = [
            { label: "详情", method: this.view},
            { label: "实时视频", method: this.showVideo},
          ]
          break
        default:
          Object.assign(this.tableListData,this.tabsAllData.cityPartsData)
          break
      }
    },
    async showVideo({row}){
      let deviceUid = row['转换编']
      let videoInfo = await getVideoFromUid(
        { templateId: 10119, deviceUid }
      )
      videoInfo.deviceUid = deviceUid
      this.$store.commit('map/ADD_VIDEO', {name: `${row['镇名']}${row['名称']} - ${deviceUid}`, url:videoInfo.url, videoInfo, templateId:10119, deviceUid})
      this.$refs["videoDetailBoard"].show();
    },
    view(scope){
      let data = scope.row
      this.dataList = this.tableListData.tableKeys.map(v=>{
        return {
          label:v.label,
          value:data[v.id]
        }
      })
      this.showDetail = true
    },
    handleTabs (tab) {
      this.activeName = tab.label
      this.initData()
    },
    showPeopDetail () {
      this.showPeopleDialog = true;
    },

  },
};
</script>
<style lang="scss" scoped>
.city-detail{
  .tab-btn{
    position: absolute;
    left: 70px;
    top: -3px;
  }
}
::v-deep.content{
  margin: 2px;
}
::v-deep .el-tabs__content{
  max-height: 600px;
  overflow-y: auto;
}
::v-deep .el-tabs{
  &__item{
    color: #fff;
    width: 150px;
    padding: 0;
    box-sizing: content-box;
    text-align: center;
  }
  &__active-bar{
    width: 150px!important;
  }
}
</style>
