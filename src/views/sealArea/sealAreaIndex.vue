<template>
  <div class="seal-area screen-wrap">
    <screen-header :navItemVisible="false" />
    <seal-map-layer
      ref="baseMapLayer"
      @layerClicked="handelLayerClicked"
      :layer-ids="layerIds"/>

    <!--标题-->
    <div class="caption">{{currSealArea.name || '封控管理区'}}</div>

    <div class="area-opt" v-show="sealOptVisible">
      <div class="btn"  @click="backToWhole">返回</div>
      <div class="btn"  @click="popTownDataPanel">查看统计</div>
      <div class="btn"  @click="editSealArea">编辑</div>
    </div>

    <div class="side-opt">
      <div class="btn primary" @click="createSealArea">创建区域</div>
    </div>

    <!--图例-->
    <map-legend style="right:20px;"
      @gridLayerSwitch="handleGridSwitch"
      @gridLayerFilter="handleGridFilter"
      @bgMapChange="handleByMapChange"
      @partyLayerSwitch="handlePartyToggle"
      @gotoLocation="handleGotoLocation"
    >
    </map-legend>

    <!--图层选择器-->
    <map-layer-filter
      :hasSealLink ='false'
      :curLayer="0"
      :data="layerList"
      @switchTopic="handelTopicChange"
      @selectChanged="handelLayerChange"
    >
      <div class="map_filter_item" v-show="!sealOptVisible">
        <p @click="toggleSealFilter()">封控管理区
          <i class="el-icon el-icon-arrow-up"></i>
        </p>
        <div class="popover" v-show="sealFilterVisible">
          <div class="popover_body">
            <el-checkbox v-model="item.checked" v-for="(item,index) in sealList" :key="index">{{item.name}}</el-checkbox>
          </div>
        </div>
      </div>

    </map-layer-filter>

    <!--自定义报表层 -->
    <report-layer
        v-bind="$attrs"
        dashboard-code="city"
        :showRight="false"
        slots="left-0"
        from="sealArea"
    >
      <template v-slot:left-0>
        <div v-for="(item,index) in countList" :key="index">
          <block-statistics from="sealArea"  :code="item.code" className="seal-area-block"></block-statistics>
        </div>
      </template>
    </report-layer>

    <!--放大echart图表-->
    <BigChart v-if="showBig"  @showBigClose="showBigClose" :data="chartData"  height="680px" style="z-index: 99999;" />

    <!--详情面板-->
    <div class="detail_list">
      <!--镇街统计-->

      <el-dialog
        v-dialogDrag
        v-for="(item, key) in detailList"
        v-if="detailList[key]"
        :width="dialogWidth[item.detailType] || '900px'"
        :key="key"
        :visible="true"
        :modal="false"
        :close-on-click-modal="false"
        @close="
          () => {
            detailList[key] = false;
          }
        "
      >
        <template slot="title" @click="zIndex++">
          <div>
            <!-- 根据详情类型切换 -->
            <div v-if="item.detailType === 'hotel'">
              {{ item.jkgcjd }}
              <!-- <div class="title_type">{{hotelType[item.type]}}</div> -->
            </div>
            <div v-if="item.detailType === 'person'">
              <p>{{ item.xm }}</p>
              <p>{{ item.xb }}</p>
              <p v-if="item.nl">{{ item.nl + "岁" }}</p>
              <div class="title_type">{{ item.mjlx }}</div>
            </div>
            <div v-if="item.detailType === 'stream'">
              手机直播
            </div>
            <div v-if="item.detailType === 'redYellow'">
              人员列表
            </div>
            <div v-if="item.detailType === 'ryDetail'">
              <p>{{ item.USERNAME }}</p>
              <p style="margin-right: 10px;margin-left: 4px">
                {{ item.gender }}
              </p>
              <div class="title_type" :style="{background:item.hh_type==='红码'?'#e52b2b':''}">{{ item.hh_type }}</div>
            </div>
            <!--重点场所-->
            <div class="risk-title" v-if="item.detailType === 'riskPlace'">
              {{ item.stationName }}
              <span class="addr"
              >地址：{{ item.address ? item.address : "-" }}</span
              >
            </div>
            <!--轨迹-->
            <div v-if="item.detailType === 'riskPlaceDetail'">
              {{ item.fullName }}的轨迹
            </div>
            <div v-if="item.detailType === 'spotDetail'">
              {{ item.popUpTitle }}
            </div>
            <div v-if="item.detailType === 'gridDetail'">
              {{ item.name }} ({{item.street}})
              <div class="grid-tip">
                <span>户籍人口：{{gridFlowPeople.hjrk}} 人</span>
                <span>流动人口：{{gridFlowPeople.lsrk}} 人</span>
                <span>总计人口：{{gridFlowPeople.zjrk}} 人</span>
              </div>
            </div>
            <div class="risk-title" v-if="item.detailType === 'mhRiskDetail'">
              中高风险地区来粤返粤人员核查情况
            </div>
            <!--三人小组-->
            <div
              class="risk-title"
              v-if="item.detailType === 'threeGroupDetail'"
            >
              三人小组人员明细
            </div>
            <!--特殊人群-->
            <div
              class="risk-title"
              v-if="
                ['specialPeopleDetail', 'specialPeopleDetailList'].includes(
                  item.detailType
                )
              "
            >
              特殊人群
            </div>
            <!--&lt;!&ndash;密接、次密接&ndash;&gt;-->
            <!--<div class="risk-title" v-if="item.detailType === 'closeContact'">-->
            <!--{{ item.key }}-->
            <!--</div>-->
            <!--核酸采样点列表-->
            <div
              class="risk-title"
              v-if="item.detailType === 'samplingPointList'"
            >
              {{ item.fwrq }}<span class="addr"> {{ item.sszj }}</span>
            </div>
            <!--单位挂点支援镇街-->
            <div
              class="risk-title"
              v-if="item.detailType === 'unitSupportStreet'"
            >
              单位挂点支援镇街
            </div>
            <div v-else>
              {{ item.dialogTitle }}
            </div>
          </div>
        </template>
        <!-- 动态组件 -->
        <HotelDetail
          :data="item"
          @showContactDetail="showContactDetail"
          v-if="item.detailType === 'hotel'"
          @popUp="handlePopUpEvent"
        />
        <ry-list
          :cond="item"
          v-if="item.detailType === 'redYellow'"
          @showRyDetail="showRyDetail"
        ></ry-list>
        <ry-detail
          :data="item"
          v-if="item.detailType === 'ryDetail'"
        ></ry-detail>
        <person-detail :data="item" v-if="item.detailType === 'person'" />
        <videoPlayer
          v-if="item.detailType === 'stream'"
          :videoUrl="item.playUrl"
          :endStream="endStream"
          :userName="item.userName"
        />

        <!--重点场所列表、详情 -->
        <risk-place-detail
          :data="item"
          v-if="item.detailType === 'riskPlaceDetail'"
        ></risk-place-detail>
        <risk-place-list
          :data="item"
          v-if="item.detailType === 'riskPlace'"
          @showRiskPlaceDetail="showRiskPlaceDetail"
        ></risk-place-list>

        <!--密接、次密接列表-->
        <close-contact-list
          :cond="item"
          v-if="item.detailType === 'closeContact'"
          @showCloseContactDetail="showCloseContactDetail"
        ></close-contact-list>

        <!--默认的地图数据弹窗-->
        <spot-detail
          :data="item"
          v-if="item.detailType === 'spotDetail'"
          @popUp="handlePopUpEvent"
        ></spot-detail>

        <!--网格详情-->
        <grid-detail
          :data="item"
          v-if="item.detailType === 'gridDetail'"
          @popUp="handlePopUpEvent"
        ></grid-detail>

        <!--中高风险来粤详情-->
        <mh-risk-detail
          :data="item"
          v-if="item.detailType === 'mhRiskDetail'"
        ></mh-risk-detail>

        <!--三人小组详情-->
        <three-group-detail
          :cond="item"
          v-if="item.detailType === 'threeGroupDetail'"
        ></three-group-detail>

        <!--特殊人群-->
        <special-people-detail
          :cond="item"
          @showSpecialPeopleList="handleShowSpecialPeopleList"
          v-if="item.detailType === 'specialPeopleDetail'"
        ></special-people-detail>

        <!--特殊人群列表-->
        <special-people-detail-list
          :cond="item"
          v-if="item.detailType === 'specialPeopleDetailList'"
        ></special-people-detail-list>

        <!--采样点列表-->
        <sampling-point-list
          :data="item"
          v-if="item.detailType === 'samplingPointList'"
          @showSamplingPointDetail="showSamplingPointDetail"
        ></sampling-point-list>

        <!--实时视频列表-->
        <video-list
          :cond="item"
          @popUp="handlePopUpEvent"
          v-if="item.detailType === 'videoList'"
        ></video-list>

        <!--工作人员明细-->
        <staff-detail-list
          :cond="item"
          v-if="item.detailType === 'staffList'"
        ></staff-detail-list>

        <!--购药记录明细-->
        <log-detail-list
          :cond="item"
          v-if="item.detailType === 'logList'"
        ></log-detail-list>

        <!--转运车辆明细-->
        <transit-vehicles-list
          :cond="item"
          v-if="item.detailType === 'transitVehiclesList'"
        ></transit-vehicles-list>

        <!--会诊排班明细-->
        <consultation-scheduling-list
          :cond="item"
          v-if="item.detailType === 'consultationSchedulingList'"
        ></consultation-scheduling-list>

        <!--配置医护人员明细-->
        <allocation-health-care-list
          :cond="item"
          v-if="item.detailType === 'allocationHealthCareList'"
        ></allocation-health-care-list>

        <!--单位挂点支援-->
        <unit-support-street
          :cond="item"
          v-if="item.detailType === 'unitSupportStreet'"
        ></unit-support-street>

        <!--历史数据-->
        <history-list
          :cond="item"
          v-if="item.detailType  === 'historyList'"
        ></history-list>

      </el-dialog>
    </div>

    <!--视频浮层面板-->
    <video-detail-board ref="videoDetailBoard" />

    <!--视频回放面板-->
    <video-record-board ref="videoRecordBoard" />

    <!--中高风险地区来粤返粤人员核查情况统计-->
    <risk-count ref="riskCount" @showMhRiskDetail="showMhRiskDetail" style="display: none;"></risk-count>

    <!--外呼面板-->
    <phone-call-panel />

    <!--封控区统计-->
    <TownCount v-if="townDataPanelVisible" from="sealArea" @closeTownCount="townDataPanelVisible =false"></TownCount>

  </div>
</template>

<script>
  import SealMapLayer from "./layer/SealMapLayer"

  import SamplingPointList from "@/components/screen/SamplingPointList";
  import riskPlaceList from "@/components/screen/riskPlaceList";
  import riskPlaceDetail from "@/components/screen/riskPlaceDetail";
  import CloseContactList from "@/components/screen/CloseContactList";
  import SpotDetail from "@/components/screen/SpotDetail";
  import RiskCount from "@/views/big/RiskCount";

  import ScreenHeader from "@/components/screen/ScreenHeader"
  import MapLegend from "@/views/big/MapLegend"
  import MapLayerFilter from "@/views/big/layer/MapLayerFilter"
  import SETTING from "@/config/MapSetting.js"
  import mhRiskDetail from "@/components/screen/mhRiskDetail";
  import ThreeGroupDetail from "@/views/big/layer/ThreeGroupDetail";
  import SpecialPeopleDetail from "@/views/big/layer/SpecialPeopleDetail";
  import SpecialPeopleDetailList from "@/views/big/layer/SpecialPeopleDetailList";
  import VideoList from "@/views/big/layer/VideoList";
  import VideoDetailBoard from "@/views/big/layer/VideoDetailBoard";
  import VideoRecordBoard from "@/views/big//layer/VideoRecordBoard"
  import StaffDetailList from "@/views/big/layer/StaffDetailList";
  import LogDetailList from "@/views/big/layer/LogDetailList";

  import transitVehiclesList from "@/views/big/layer/TransitVehiclesList";
  import AllocationHealthCareList from "@/views/big/layer/AllocationHealthCareList";
  import consultationSchedulingList from "@/views/big/layer/ConsultationSchedulingList";

  import PhoneCallPanel from "@/components/common/PhoneCallPanel";
  import HistoryList from "@/views/big/layer/HistoryList";
  import BigChart from "@/components/charts/BigChart"
  import ReportLayer from "@/components/report/ReportLayer";
  import BlockStatistics from '@/components/charts/BlockStatistics'
  import TownCount from "@/views/big//layer/TownCount";

  import BigScreenMethods from "@/mixins/BigScreenMethods.js"

  export default {
    name: "sealAreaIndex",
    components: {
      VideoRecordBoard,
      SamplingPointList,
      riskPlaceList,
      riskPlaceDetail,
      CloseContactList,
      SpotDetail,
      RiskCount,
      MapLayerFilter,
      MapLegend,
      SealMapLayer,
      ScreenHeader,
      mhRiskDetail,
      ThreeGroupDetail,
      SpecialPeopleDetail,
      SpecialPeopleDetailList,
      VideoList,
      VideoDetailBoard,
      StaffDetailList,
      LogDetailList,
      transitVehiclesList,
      AllocationHealthCareList,
      consultationSchedulingList,

      PhoneCallPanel,
      HistoryList,
      BigChart,
      ReportLayer,
      BlockStatistics,
      TownCount
    },
    mixins: [BigScreenMethods],
    provide() {
      return {
        handleItemChoosed: this.handleItemChoosed,
      };
    },
    data() {
      return {
        //显示echart大图
        showBig:false,
        hotalData: [],
        redYellowData: [],
        detailList: {},
        hotelType: {
          1: "入境者酒店",
          3: "本土（广州市）密切接触者酒店",
          2: "入境者密切接触者酒店",
        },

        zIndex: 1,
        showPlaceMap: false,

        endStream: false,

        dialogWidth: {
          redYellow: "1040px",
          riskPlace: "980px",
          mhRiskDetail: "1010px",
          closeContact: "900px",
          gridDetail: "1180px",
          samplingPointList: "1100px",
        },

        layerList: [],

        //声明所有图层id
        layerIds: [],

        //当前显示的图层id
        visibleIds: [],

        // 网格流动人口
        gridFlowPeople: [],

        //封控区列表
        sealList: [],
        sealFilterVisible: false,

        //左侧报表
        countList:[
          {code:'controlArea'},
          {code:'controlPeople'},
        ],

        //封控区统计
        townDataPanelVisible:false,
      }
    },
    watch: {
      sealList: {
        handler(val, oldValue) {

          if (oldValue.length == 0) {
            return
          }

          const unCheckedArr = val.filter(v=>v.checked == false)

          let filterCode = null

          if (unCheckedArr.length == 0) {
            // 全选
          } else {
            filterCode = unCheckedArr.map(v => {
              return `id <> '${v.id}'`
            }).join(' AND ')
          }
          this.$refs['baseMapLayer'].filterDataInLayer({id: 'seal-area', filterCode})
        },
        deep: true
      }
    },
    created(){

      this.resetCurrSealArea()

      let arr = [
        {
          id: "boundary",
          visible: true,
        },
        {
          id: "grid",
          visible: false,
        },{
          id: "seal-area",
          visible: true
        }
      ];
      this.layerList = SETTING.getLayerMenu();

      //上次图层选中的缓存状态
      // let cookieIds = JSON.parse(Cookies.get('_selected_seallayer_ids') || '[]')
      let cookieIds = JSON.parse(localStorage._selected_seallayer_ids||'[]')

      //图层列表
      this.layerList.forEach((item) => {

        if (item.children) {
          let ids = item.children.map((subItem) => {

            if (cookieIds.length > 0) {
              subItem.checked = cookieIds.includes(subItem.id) ? true : false
            }

            const {id, checked, order,mapFilterVisible} = subItem
            if (checked) {
              this.visibleIds.push(id);
            }
            return {
              id,
              visible: checked,
              order,
              mapFilterVisible
            };
          });
          arr = arr.concat(ids);
        }
      })

      //图层渲染排序
      arr.sort((a, b) => {
        return a.order - b.orders
      })
      this.layerIds = arr

    },
    mounted() {
      this.getSealList()
    },
    computed: {
      currSealArea() {
        return this.$store.state.common.sealarea || {}
      },
      sealOptVisible() {
        return this.currSealArea.id !== undefined
      }
    },
    methods: {

      resetCurrSealArea() {
        this.$store.commit('common/SET_CUR_SEALAREA', null)
      },

      //获取所有封控区域列表
      async getSealList(){

        let setting = SETTING.getLayerSetting('seal-area')
        const res = await setting.getListData()

        res.forEach(v => {
          v.checked = true
        })

        this.sealList = res
      },

      toggleSealFilter() {
        this.sealFilterVisible = !this.sealFilterVisible
      },

      showSealItemOnly({id}){
        let arr = this.sealList.map(item => {
          item.checked = id == item.id
          return item
        })
        this.sealList = arr
      },

      showSealItemAll(){
        let arr = this.sealList.map(item => {
          item.checked = true
          return item
        })
        this.sealList = arr
      },

      setCurrSealarea(attributes, target) {

        const {name} = attributes

        if (this.currSealArea.name == name) {
          return
        }

        //设定当前封控区
        this.showSealItemOnly(attributes)
        this.$store.commit('common/SET_CUR_SEALAREA', attributes)

        //定位到当前封控管理区
        this.$refs['baseMapLayer'].gotoLocation({target: target.graphic})
      },

      async backToWhole(){
        await this.$refs['baseMapLayer'].backToWhole()
        this.resetCurrSealArea()
        this.showSealItemAll()
      },

      popTownDataPanel(){
        this.townDataPanelVisible =true
      },

      editSealArea(){
        // console.log(this.currSealArea)
        this.$router.push({name: `sealAreaInstance`, params: {mode: 'edit', data: this.currSealArea}})
      },

      createSealArea(){
        this.resetCurrSealArea()
        this.$router.push({name: `sealAreaInstance`, params: {mode: 'create'}})
      },

      //地图元素点击
      handelLayerClicked({ layerId, attributes, target}){

        switch (layerId) {
          case "boundary":
            break;
          case "grid":
            break;
          case "seal-area":
            this.setCurrSealarea(attributes, target)
            break;
          case "hotel":
            //隔离酒店
            this.showHotelDetal(attributes);
            break;
          case "redYellow":
            //红黄码
            var { name, type } = attributes;
            this.$set(this.detailList, `${name}_${type}`, {
              ...attributes,
              detailType: "redYellow",
            });
            break;
          case "hotel-video":
          case "coldWarehouse-video":
          case "driverWorkPoint-video":
          case "detectionPoint-video":
          case "keyPlaces-video":
          case "foodMarket-video":
          case "market-video":
            this.$set(this.detailList, "videoList", {
              ...attributes,
              layerId,
              detailType: "videoList",
              dialogTitle: "视频列表",
            });
            break;
          case 'dangerPeople'://中高风险地区来南沙人员
            //todo:待调整优化
            this.$refs['riskCount'].openDetail(0, {street:attributes.street, onlyTable:true})
            break;
          case "delivery"://快递配送人员
            this.$set(this.detailList, "staffList", {
              ...attributes,
              layerId,
              detailType: "staffList",
              dialogTitle: "工作人员明细",
            });
            break;
          case "mjPeople":
          case "cmjPeople": //密接次密接人员待改为特殊面板
            this.$set(this.detailList, `closeContact`, {
              ...attributes,
              layerId,
              detailType: "closeContact",
              dialogTitle: layerId == 'mjPeople' ? '密接人员' : '次密接人员',
            })
            break;
          case "driver":
          case "detectionPoint":
          case "coldWarehouse":
          case "inout":
          case "hospital":
          case "pharmacy":
          case "foodMarket":
          case "seafoodEmp":
          case "productEmp":
          case "farmEmp":
          case "buildingEmp":
          case "party":
          case "volunteer":
          case "detectionGroup":
          case "market":
          case "roadgate":
          case "driverWorkPoint":
          case "busEmp":
          case "security":
          case "transitWarehouse":
          case "school":
          case "email":
          case "importedMaterial":
            //普通点图层
            var { templateId, label } = SETTING.getLayerInfo(layerId);
            this.$set(this.detailList, `spotDetail`, {
              layerId,
              templateId,
              popUpTitle: label,
              detailType: "spotDetail",
              ...attributes,
            });
            break;
          case "threeGroup":
            //三人小组
            this.$set(this.detailList, `threeGroupDetail`, {
              ...{ street: attributes.street },
              detailType: "threeGroupDetail",
            });
            break;
          case "specialMen":
            //特殊人群
            this.$set(this.detailList, `specialPeopleDetail`, {
              ...attributes,
              detailType: "specialPeopleDetail",
            });
            break;
          case "keyPlaces":
            //重点场所
            this.$set(this.detailList, "riskPlace", {
              ...attributes,
              detailType: "riskPlace",
            });
            break;
          default:
            break;
        }

      },

      //处理网格图层显示状态
      handleGridSwitch({visible}) {
        this.$refs["baseMapLayer"].toggleOneLayer("grid", visible);
      },

      //触发图层选择事件，更新图层显示隐藏状态
      handelLayerChange({ids}) {

        this.visibleIds = ids;
        this.$refs["baseMapLayer"].toggleLayers(ids);

        // 保存到选择状态到cookie
        // Cookies.set('_selected_seallayer_ids', JSON.stringify(ids))
        localStorage._selected_seallayer_ids = JSON.stringify(ids)

      },


      //触发弹窗事件（报表大图or密接次密接人数统计）
      handleItemChoosed(event,type) {
        if(type==='chart') {
          this.showBig =true
          this.chartData = Object.assign({}, event)
        }
        switch (event.key) {
          case "累计密接人员":
          case "累计次密接人员":
          case "当前密接人员":
          case "当前次密接人员":
            this.showCloseContactList(event);
            break;
          default:
            break;
        }
      },
    }
  }
</script>

<style lang="scss" type="text/scss">
.seal-area{
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #20326f;

  .caption{
    position: absolute;
    left: 50%;
    top: 90px;
    z-index: 1000;
    padding: .2em 0;
    min-width: 350px;
    max-width: 600px;
    transform: translateX(-50%);
    color: #fff;
    font-size: 30px;
    text-align: center;
    background: linear-gradient(90deg, rgba(0, 231, 255, 0) 0%, #00BACE 30%, #00B8C9 76%, rgba(0, 231, 255, 0) 100%);
  }

  .area-opt{
    position: absolute;
    bottom: 7em;
    left: 50%;
    transform: translateX(-50%);
  }
  .side-opt{
    position: absolute;
    top: 5.7em;
    right: 10em;
  }
}
</style>
