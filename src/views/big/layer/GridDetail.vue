<template>
  <div class="grid-detail">
    <div class="column-tabs">
      <el-tabs v-model="activeColTab" tab-position="left">
        <el-tab-pane :label="item.label" :name="item.id"  v-for="item in colTabs" :key="item.id"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="grid-detail-content">
      <el-tabs v-model="activeTab"  >
        <el-tab-pane :label="item.label" :name="item.id"  v-for="item in layerList[activeColTab].children" :key="item.id" v-if="!item.label.includes('热力图')"></el-tab-pane>
      </el-tabs>

      <!--红黄码-->
      <ry-list v-if="['redYellow'].includes(activeTab)" :cond="componentCond" @showRyDetail="popUp($event, {eventType: 'showRyDetail'})"></ry-list>

      <!--密接次密接-->
      <close-contact-list v-if="['mjPeople','cmjPeople'].includes(activeTab)" :cond="componentCond"  @showCloseContactDetail="popUp($event, {eventType: 'showCloseContactDetail'})"></close-contact-list>

      <!--三人小组-->
      <three-group-detail v-if="activeTab=='threeGroup'" :cond="componentCond"></three-group-detail>

      <!--特殊人群-->
      <special-people-detail-list v-else-if="activeTab=='specialMen'" :cond="componentCond"></special-people-detail-list>

      <!--快递人员-->
      <staff-detail-list  v-else-if="activeTab=='delivery'" :cond="componentCond"></staff-detail-list>

      <!--视频图层-->
      <video-list v-else-if="activeTab.includes('-video')" :cond="componentCond"></video-list>

      <!--其他图层-->
      <template v-else>
        <div class="grid-detail-main">
          <div class="detail-tip" v-if="dataList.length">
            <span>共{{dataList.length}}个数据</span>
          </div>
          <div class="detail-item" v-for="(item,index) in dataList" :key="index">
            <!--单个数据 根据模板展示-->
            <info-box :template="itemTemplate" :datum="item" :attrs="componentCond" :key="index" @popUp="popUp"></info-box>
          </div>
          <data-empty-box title="当前网格暂无数据" sub-title="按网格维度过滤数据"  v-if="dataList.length == 0"></data-empty-box >
        </div>
      </template>

    </div>

  </div>
</template>

<script>
  import {getTemplateConfig, getHotelData, getKeyPlaceLayerData, getMapLayerData} from '@/api/mapData.js'
  import ThreeGroupDetail from "./ThreeGroupDetail";

  import SETTING from '@/config/MapSetting.js'
  import DataEmptyBox from "./DataEmptyBox";
  import InfoBox from "./InfoBox";
  import SpecialPeopleDetailList from "./SpecialPeopleDetailList";
  import StaffDetailList from "./StaffDetailList";
  import VideoList from "./VideoList";
  import CloseContactList from "@/components/screen/CloseContactList";
  import RyList from "@/components/MapLayer/RyList";

  export default {
    name: "GridDetail",
    components: {
      RyList,
      CloseContactList,
      VideoList,
      StaffDetailList,
      SpecialPeopleDetailList,
      InfoBox,
      DataEmptyBox,
      ThreeGroupDetail
    },
    props: {
      data: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        activeColTab: '0', // 第一级当前tab
        activeTab: 'dangerPeople', //第二级当前tab

        //数据列表
        dataList: [],
        //单个数据模板
        itemTemplate: [],

        //组件的数据查询条件
        componentCond: {},

        //一级导航菜单
        colTabs: [
          {label: '重点人群', id: '0'},
          {label: '重点场所', id: '1'},
          {label: '物资保障', id: '2'},
          {label: '人力保障', id: '3'},
          {label: '视频', id: '4'}
        ],

        //二级导航菜单
        layerList: [],
      }
    },
    watch: {
      activeTab(newVal) {
        console.log(newVal)
        this.updateData()
      },
      activeColTab(newVal) {
        this.activeTab = this.layerList[newVal].children[0].id
      }
    },
    created(){
      this.layerList = SETTING.getLayerMenu()
    },
    mounted() {
      this.updateData()
    },
    methods: {
      popUp(event, opt = {}) {
        if (opt.eventType) {
          this.$emit('popUp', {eventType: opt.eventType, attributes: event})
        } else {
          this.$emit('popUp', event)
        }
      },
      async updateData() {

        const allLayers = SETTING.getDict()
        var {templateId, label, id, ssdwId} = allLayers.find(v=>v.id == this.activeTab)


        const gridName = this.data.name

        switch(this.activeTab){
          case 'redYellow':
            //红黄码
            this.componentCond = {grid: gridName, layerId: id}
            break;
          case 'threeGroup':
            //三人小组
            this.componentCond = {grid: gridName, layerId: id}
            break;
          case 'specialMen':
            //特殊人群
            this.componentCond = {grid: gridName, layerId: id}
            break;
            // 户籍人员
          case 'householdRegisterPersonnel':
            console.log('householdRegisterPersonnel');
            break;
            // 来穗人员
          case 'toGuangzhouPersonnel':
            console.log('toGuangzhouPersonnel');
            break;
          case 'hotel':
            //隔离酒店
            this.componentCond = {...this.data, layerId: id}
            this.dataList = await getHotelData({sswg: gridName})
            this.itemTemplate = [
              {fieldName: '酒店名称',storeFiled: 'jkgcjd', fieldType: 'string'},
              {fieldName: '所属镇街',storeFiled: 'ssjz', fieldType: 'string'},
              {fieldName: '所属网格',storeFiled: 'sswg', fieldType: 'string'},
              {fieldName: '在入住人数',storeFiled: 'zrzfjs', fieldType: 'string'},
              {fieldName: '房间数',storeFiled: 'fjs', fieldType: 'string'},
              {fieldName: '可用房间数',storeFiled: 'kyfjs', fieldType: 'string'},
              {fieldName: '剩余房间数',storeFiled: 'syfjs', fieldType: 'string'},
              {fieldName: '接待人员分类',storeFiled: 'jdfl', fieldType: 'string'},
              {fieldName: '地址',storeFiled: 'jddz', fieldType: 'string'},
            ]
            break;
          case 'keyPlaces':
            //公共场所
            this.dataList = await getKeyPlaceLayerData({sswg: gridName})
            this.itemTemplate =[
              // {fieldName: '',storeFiled: '', fieldType: ''},
              {fieldName: '名称',storeFiled: 'stationName', fieldType: 'string'},
              {fieldName: '地址',storeFiled: 'address', fieldType: 'string'},
              {fieldName: '经度',storeFiled: 'longitude', fieldType: 'string'},
              {fieldName: '纬度',storeFiled: 'latitude', fieldType: 'string'},
              {fieldName: '绿码数',storeFiled: 'green_count', fieldType: 'string'},
              {fieldName: '黄码数',storeFiled: 'yellow_count', fieldType: 'string'},
              {fieldName: '红码数',storeFiled: 'red_count', fieldType: 'string'},
            ]
            break;
          case 'delivery':
            //快递配送人员
            this.componentCond = {grid: gridName, layerId: id}
            break;
          case 'dangerPeople':
            //获取当前图层的模板
            var res2 = await getTemplateConfig({id: templateId})
            this.itemTemplate = res2.columns
            //中高风险地区来粤返粤人员核查
            var res1 = await getMapLayerData({templateId, condition: {sswg: gridName}})
            this.dataList = res1.data
            break;
          case "hotel-video":
          case "coldWarehouse-video":
          case "driverWorkPoint-video":
          case "keyPlaces-video":
          case "foodMarket-video":
          case "market-video":
          case "detectionPoint-video":
          case "bigDetectionPoint-video":
          case "nurseHouse-video":
          case "detectPointAround-video":
          case " gcyKeyplace-video":
          case "pharmacy-video":
            this.componentCond = {...this.data, layerId: id, grid: gridName}
            break;
          case "mjPeople":
          case "cmjPeople":
            this.componentCond = {...this.data, layerId: id, grid: gridName}
            break;
          default:
            if (!templateId) {
              console.log(`griddetail: 图层${id} 没有对应的templateId`)
              return
            }

            this.componentCond = {...this.data, layerId: id, grid: gridName}
            var layerSetting = SETTING.mapLayers.find(v=>v.id == id)
            //获取当前图层的模板
            var res2 = await getTemplateConfig({id: templateId})
            this.itemTemplate = res2.columns
            //获取详情数据
            this.dataList  = await layerSetting.getData({condition: {sswg: gridName}})
            break;
        }

      }

    },

  }
</script>

<style lang="scss" type="text/scss">
.grid-detail{
  color: #fff;
  display: flex;
  overflow: hidden;
  min-height: 400px;

  .column-tabs {
    width: 105px;
    display: flex;
    flex-direction: column;

    .el-tabs {
      position: relative;
      left: 8px;

      .el-tabs__nav {
        border-right: 1px solid #CED1DB;
        height: 300px;
        background-color: #20326f;
      }
      .el-tabs__item {
        background-color: rgba(32, 50, 111, 1);
      }
    }
  }
  .grid-detail-content {
    width: calc(100% - 110px);
    max-height: 75vh;
    box-sizing: border-box;
    padding: 0 0 0 10px;
  }

  .column-tabs, .content {
    flex-shrink: 0;
  }

  .el-tabs {
    width: 96%;
  }


  &-main{
    position: relative;
    min-height: 200px;
    max-height:500px;
    overflow: auto;
    width: 100%;

    .detail-tip{
      padding: 0 0 1em;
      /*position: absolute;*/
      /*top:1em;*/
      /*right: 2em;*/
    }

    .detail-item{
      margin-bottom: 1em;

      .title{
        position: relative;
        padding: 15px 10px;
        min-height: 12px;

        &:after{
          position: absolute;
          top: 16px;
          left: 0;
          content: '';
          height: 16px;
          width: 3px;
          font-size: 0;
          background-color: #345EF0;
        }
      }

      .base-info {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        width: 96%;
        padding-bottom: 4px;

        .info-item {
          width: calc(50% - 1px);
          display: flex;
          border: 1px solid #465da3;
          margin-right: -1px;
          margin-bottom: -1px;
          position: relative;

          .box-label{
            width: 120px;
            min-height: 20px;
            padding: 8px 16px;
            flex-shrink: 0;
            background-color: rgba(45, 85, 208, 0.3);
          }
          .box-value{
            box-sizing: border-box;
            padding: 8px 16px;
            border-left: 1px solid #465DA3;
            width: 100%;
          }
        }
      }
    }
  }

}
</style>
