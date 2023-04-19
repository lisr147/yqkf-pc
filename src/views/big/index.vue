<template>
<div class="big-container screen-wrap">
  <screen-header
   @layer="switchLayer"
   :layer="layer"
   @showDataTotal="showDataTotal = !showDataTotal"
   @showAllDataTotal="showAllDataTotal = !showAllDataTotal"
   />

  <!--0高德地图-->
  <MapLayer ref="MapLayer" :mapData="mapData" @layerClickEvent="showHotelDetal" :mapModel="layer"/>

  <!--1公安流调-->
  <!--<Gald v-if="layer===1" @mapData="mapData.markers = $event" ref="gald"/>-->

  <!--2重点管控区域-->
  <!--<div class="hot-places-map" v-if="layer===2" :style="`background-image:url(${require('@/assets/image/hot-places-map6-9.jpg')});`" />-->

  <!--3封闭管理-->
  <community v-if="layer===3"></community>

  <!--4珠江街封控管理区-->
  <arcgis-layer :visible="layer===4"></arcgis-layer>

  <!--5门磁监控-->
<!--  <arcgis-device-layer :visible="layer===5"></arcgis-device-layer>-->

  <!--数据总览-->
  <DataTotal v-if="showDataTotal" @close="showDataTotal= false" />
  <!--一图总览-->
  <AllDataTotal v-if="showAllDataTotal" @close="showAllDataTotal= false" />

<!--  红黄码总数按钮-->
  <div class="ry-total-btn-container"  v-if="layer===0 && redYellowData && redYellowData.length">
    <div class="ry-total-btn-wrapper" @click="showRyTotal('red')">
      <span class="t1">红码人员列表</span>
      <span class="t2" style="color: #E8473F">{{redTotal}}</span>
    </div>
    <div class="ry-total-btn-wrapper" @click="showRyTotal('yellow')">
      <span class="t1">黄码人员列表</span>
      <span class="t2">{{yellowTotal}}</span>
    </div>
  </div>

  <!--图层选择器-->
  <MapFilter ref="MapFilter" :hotelType="hotelType" @setHotelData="setHotelData" @setRedYellowData="setRedYellowData" @setHeatMapData="setHeatMapData" @MapChange="switchLayer" @layerClickEvent="showHotelDetal" @getRyTotal="getRyTotal" :currLayer="layer"/>

  <!--自定义报表层 -->
  <report-layer v-if="[0,2].includes(layer)" v-bind="$attrs" :updatetime="chartUpdateTime" dashboard-code="city" title-left="城市物联网建设情况" title-right="物联网设备领域统计"  slots="left-0,right-1" :hotelType="hotelType" :hotelData="this.mapData.markers">
    <template v-slot:left-0>
      <risk-count></risk-count>
    </template>
    <template v-slot:right-1>
      <key-place></key-place>
    </template>
  </report-layer>

  <!--详情面板-->
  <div class="detail_list">
    <el-dialog
      v-dialogDrag
      v-for="(item, key) in detailList"
      v-if="detailList[key] && layer===0"
      :width="dialogWidth[item.detailType] || (item.detailType === 'stream' ? '400px' : '722px')"
      :key="key"
      :visible="true"
      :modal="false"
      :close-on-click-modal="false"
      @close="() => {
        detailList[key] = false
      }"
    >
      <template slot="title" @click="zIndex++">
        <div >
          <!-- 根据详情类型切换 -->
          <div v-if="item.detailType === 'hotel'">
            {{item.jkgcjd}} <div class="title_type">{{hotelType[item.type]}}</div>
          </div>
          <div v-if="item.detailType === 'person'">
            <p>{{item.xm }}</p><p>{{item.xb}}</p><p v-if="item.nl">{{item.nl + '岁'}}</p> <div class="title_type">{{item.mjlx}}</div>
          </div>
          <div v-if="item.detailType === 'stream'">
            手机直播
          </div>
          <div v-if="item.detailType === 'redYellow'">
            人员列表
          </div>
          <div v-if="item.detailType === 'ryDetail'">
            <p>{{item.USERNAME}}</p> <p style="margin-right: 10px;margin-left: 4px">{{item.gender}}</p> <div class="title_type">{{item.hh_type}}</div>
          </div>
        </div>
      </template>
      <!-- 动态组件 -->
      <HotelDetail :data="item" @showContactDetail="showContactDetail" v-if="item.detailType === 'hotel'"/>
      <ry-list :cond="item" v-if="item.detailType === 'redYellow'" @showRyDetail="showRyDetail"></ry-list>
      <ry-detail :data="item" v-if="item.detailType === 'ryDetail'"></ry-detail>
      <person-detail :data="item" v-if="item.detailType === 'person'"/>
      <videoPlayer v-if="item.detailType === 'stream'" :videoUrl="item.playUrl" :endStream="endStream" :userName="item.userName"/>
    </el-dialog>
  </div>

</div>
</template>

<script>

import ScreenHeader from "@/components/screen/ScreenHeader"
import ReportLayer from "@/components/report/ReportLayer"
import MapLayer from '@/components/MapLayer/MapLayer.vue'
import ArcgisLayer from "@/components/screen/ArcgisLayer"
import RyList from "@/components/MapLayer/RyList";
import RyDetail from "@/components/MapLayer/RyDetail";

// import ArcgisDeviceLayer from "@/components/screen/ArcgisDeviceLayer"
import PersonDetail from "@/components/screen/PersonDetail"
import HotelDetail from '@/components/MapLayer/HotelDetail.vue'
import MapFilter from '@/components/MapLayer/MapFilter.vue'
import { getHotalDetail, getPersonDetail } from '@/api/mapData.js'
// import Gald from './gald.vue'
import Community from "@/views/big/Community.vue"
import RiskCount from "@/views/big/RiskCount"
import keyPlace from "@/views/big/keyPlace"
import DataTotal from './dataTotal.vue'
// 一图总览
import AllDataTotal from "./allDataTotal.vue"
import { initWebsocket } from '@/utils/watcher.js'
import {getYMUpdateTime, getHSUpdateTime} from '@/api/bigCharts'
import videoPlayer from '@/components/EasyPlayer/VideoPlayer.vue'

export default {
  components: {
    Community,
    ScreenHeader,
    ReportLayer,
    MapLayer,
    PersonDetail,
    HotelDetail,
    MapFilter,
    // Gald,
    ArcgisLayer,
    // ArcgisDeviceLayer,
    DataTotal,
    videoPlayer,
    RyList,
    RyDetail,
    keyPlace,
    RiskCount,
    AllDataTotal
  },
  name: "index",
  data () {
    return {
      mapData: {
        heatMapData: [],
        markers: [],
      },
      hotalData: [],
      redYellowData: [],
      detailList: {},
      hotelType: {
        1: '入境者酒店',
        3: '本土（广州市）密切接触者酒店',
        2: '入境者密切接触者酒店'
      },
      zIndex: 1,
      showPlaceMap:false,
      layer: 0,//当前图层: 0 高德地图， 1公安流调  2重点管控区域， 4管理区概况 5门磁监控
      showDataTotal:false, //数据总览
      showAllDataTotal: false, //一图统览
      websocket: null,
      endStream: false,
      dialogWidth: {
        redYellow: '1040px'
      },
      chartUpdateTime: {
        ym: '', //疫苗更新时间
        hs: '' //核酸更新时间
      },
      redTotal: '',
      yellowTotal: '',
    }
  },
  methods: {
    /**
     * 获取图表更新时间
     */
    async getChartUpdateTime () {
      let ymTime = await getYMUpdateTime()
      let hsTime = await getHSUpdateTime()
      this.chartUpdateTime = {
        ym: ymTime, //疫苗更新时间
        hs: hsTime //核酸更新时间
      }
      // console.log('更新时间888',this.chartUpdateTime)
    },
    /**
     * 设置地图酒店数据
     */
    setHotelData (hotalData) {
      this.hotalData = hotalData
      this.setMarkers()
    },
    /**
     * 设置地图红黄码分布图
     */
    setRedYellowData (redYellowData) {
      this.redYellowData = redYellowData
      if (this.redYellowData && this.redYellowData.length) {
        this.hotalData = []
        this.$set(this.mapData, 'markers', this.redYellowData)
        this.$set(this.mapData, 'heatMapData', [])
      }else {
        this.$set(this.mapData, 'markers', this.hotalData)
      }
    },
    setMarkers () {
      this.$set(this.mapData, 'markers', [...this.hotalData, ...this.redYellowData])
    },
    /**
     * 设置地图热力数据
     */

    setHeatMapData (heatMapData) {
      this.$set(this.mapData, 'heatMapData', heatMapData)
    },
    /**
     * 显示酒店详情
     */
    async showHotelDetal (data) {
      if(this.layer===1){
        // this.$refs.gald.showInfo(data)
        return
      }
      let res = await getHotalDetail(data.id)
      this.$set(this.detailList, data.id, {...data, ...res, detailType: 'hotel'})
      this.$forceUpdate()
    },
    /**
     * 显示密接详情
     */
    async showContactDetail (data) {
      let res = await getPersonDetail(data.sfzhzhm)
      this.$set(this.detailList, data.sfzhzhm, {...data, ...res, detailType: 'person'})
      this.$forceUpdate()
    },
    switchLayer(val){
      this.layer = val
    },
    // 显示健康码人员详情
    showRyDetail (item) {
      // console.log('显示健康码人员详情',item)
      this.$set(this.detailList, item.idNumber, {...item, detailType: 'ryDetail'})
    },
    showRyTotal (type) {
      this.$set(this.detailList, 'ry_total', {detailType: 'redYellow',type})
    },
    getRyTotal (res) {
      this.redTotal = res.redTotal
      this.yellowTotal = res.yellowTotal
    }
  },
  watch:{
    layer(val) {
      if (val !== 0) {
        this.setHotelData([])
        this.setHeatMapData([])
      }
      if (val === 0) {
        this.$refs['MapFilter'].hotelTypeChange()
        this.$refs['MapFilter'].heatMapTypeChange()
      }
    }
  },
  mounted () {
    sessionStorage.screenType = ''
    if(!this.$store.state.authority.accessPaths.includes('big')){
      this.$router.push({ path: '/401', replace: true })
    }
    this.getChartUpdateTime()

    // 设置地图图标点击事件
    window.mapItemClick = (evt) => {
      for (let i = 0; i < evt.path.length; i++) {
        if (evt.path[i].className === 'map_hotel') {
          let dom = evt.path[i]
          let data = JSON.parse(dom.getAttribute('extData'))
          data = data.join(' ')
          this.showHotelDetal(JSON.parse(data))
        } else if(evt.path[i].className === 'alarm-marker animated zoomIn'){  // 处理地图事件
          let dom = evt.path[i]
          let data = JSON.parse(dom.getAttribute('extData'))
          if (data.playUrl.indexOf('meet') <= -1) {
            this.$set(this.detailList, data.name, {userName: data.name, playUrl: data.playUrl, detailType: 'stream'})
          } else {
            window.open(`https://${window.location.host.indexOf('develop') < -1 ? 'dnvideopre.iot-cas.com' : 'dnvideodev.iot-cas.com'}/video/index.html#/?name=${this.$store.state.user.username}&romm=999`)
          }
          _this.endStream = false
        }
      }
    }
    window.redYellowItemClick = (t) => {
      console.log('event',t)
      let key = t.getAttribute('data-key')
      let name = key.split('_')[0]
      let type = key.split('_')[1]
      let item = this.redYellowData.find(v => v.name === name)
      // console.log('key',key,this.redYellowData)
      // console.log('item',item)
      this.$set(this.detailList, key, {...item,type, detailType: 'redYellow'})
    }
    // 初始化 websocket
    this.websocket = initWebsocket()
    // 接收websocket信号
    const _this = this
    this.websocket.onmessage = function (msg) {
      try {
        let data = JSON.parse(msg.data)
        console.log(data);
        if (data.eventCode === 'app-spzb-02') {
          _this.endStream = true
          _this.$refs.MapLayer.deleteEventMarker()
          return
        }
        let pos = [113.532608,22.808156]
        if (data.location.longitude) {
          pos = [data.location.longitude, data.location.latitude]
        }
        _this.$refs.MapLayer.addEventMarker(pos, data)
      } catch (e) {
        // console.error(msg.data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.big-container {
  background-color: #20326F;
  width: 100%;
  height: 96%;
  position: relative;
}

.hot-places-map{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgb(6,18,68);
}
</style>
<style lang="scss">
// 地图图标样式
.map {
  &_hotel {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    &_dot {
      min-width: 20px;
      height: 20px;
      background-color: #ff3233;
      color: #fff;
      border-radius: 50%;
      font-weight: 800;
      font-size: 12px;
      text-align: center;
      line-height: 20px;
      position: absolute;
      right: -12px;
      top: -5px;
    }
    &_icon {
      width: 32px;
      height: 36px;
      background-size: 100% auto;
      display: inline-block;
      margin-bottom: 10px;
      position: relative;
      &:hover + div {
        display: inline-block;
        opacity: 1;
      }
    }
    &_label {
      color: #fff;
      width: 100%;
      text-align: center;
      opacity: 0;
    }
  }
}
@mixin marker-animate {
  animation-name: Grow;
  animation-duration: 2s;
  animation-delay: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
/*事件点标注*/
.alarm-marker {
  position: relative;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  overflow: visible;
  img {
    width: 32px;
    height: 32px;
  }
}
.alarm-marker:before {
  content: "";
  display: block;
  position: absolute;
  width: 32px;
  height: 32px;
  left: 0px;
  top: 0px;
  border-radius: 32px;
  box-shadow: 0px 0px 32px 16px #ad2bc4;
  @include marker-animate;
  animation: wave 2s infinite linear;
}
@keyframes wave {
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.red-yellow-marker-box {
  position: relative;
  .red-yellow-marker-item {
    position: absolute;
  }
  .red-marker-item {
    left: 0;
    top: 0;
    .icon {
      background: url(../../assets/image/icon-red.svg) no-repeat;
      background-size: 100%;
    }
    .ry-count {
      background-color: #E8473F;
    }
  }
  .street-name {
    position: absolute;
    bottom: -14px;
    right: 32px;
    color: #fff;
    font-size: 14px;
    width: 150px;
    text-align: right;
  }
  .yellow-marker-item {
    left: -50px;
    top: -15px;
    .icon {
      background: url(../../assets/image/icon-yellow.svg) no-repeat;
      background-size: 100%;
    }
    .ry-count {
      background-color: #DD9B29;
    }
  }
  .icon {
    width: 37px;
    height: 42px;
  }
  .ry-count {
    position: absolute;
    left: 22px;
    top: -6px;
    padding: 0 6px;
    height: 14px;
    line-height: 14px;
    border-radius: 6px;
    text-align: center;
    color: #fff;
    font-size: 12px;
  }
}
.ry-total-btn-container {
  position: absolute;
  right: 440px;
  top: 80px;
}
.ry-total-btn-wrapper {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  background: url(../../assets/image/ry-all-btn.png) no-repeat;
  width: 194px;
  height: 40px;
  line-height: 40px;
  background-size: 100%;
  .t1 {
    font-size: 18px;
    color: #fff;
    margin-right: 4px;
    margin-left: 20px;
  }
  .t2 {
    color: #FFFF00;
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
