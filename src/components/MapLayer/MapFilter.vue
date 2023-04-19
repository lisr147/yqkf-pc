<template>
  <div class="map_filter">
    <div class="hotel_filter" @click="patchMapChange(0); showHotelFilter = !showHotelFilter">
      <p>隔离酒店<i v-if="!showHotelFilter" class="el-icon el-icon-arrow-up"/><i v-else class="el-icon el-icon-arrow-down"/></p>
      <div class="popover" v-show="showHotelFilter">
        <div class="popover_header"></div>
        <div class="popover_body">
          <el-checkbox-group v-model="hotelTypeCheckList" @change="hotelTypeChange">
            <el-checkbox :label="key" v-for="(item, key) in hotelType" :key="key">{{item}} <div class="hotel_count">{{legendData[key]}}</div></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="popover_footer"></div>
      </div>
    </div>
    <div class="hot_map_filter" @click="patchMapChange(0); showHeatMapFilter = !showHeatMapFilter">
      <p>重点人群热力图<i v-if="!showHeatMapFilter" class="el-icon el-icon-arrow-up"/><i v-else class="el-icon el-icon-arrow-down"/></p>
      <div class="popover" v-show="showHeatMapFilter">
        <div class="popover_header"></div>
        <div class="popover_body">
          <el-checkbox-group v-model="heatMapCheckList" @change="heatMapTypeChange">
            <el-checkbox label="密切接触者">密接者热力分布图</el-checkbox>
            <el-checkbox label="密接的密接">次密接者热力分布图</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="popover_footer"></div>
      </div>
    </div>
    <!--<div class="hot_map_filter" @click="patchMapChange(2)">-->
      <!--<p>重点管控区域-->
        <!--<i class="el-icon el-icon-check" v-if="currLayer == 2"/>-->
        <!--<i v-else class="el-icon el-icon-close"/>-->
      <!--</p>-->
    <!--</div>-->
    <div class="hot_map_filter" @click="handleCheckRedYellow">
      <p>
        红黄码分布图
        <i class="el-icon el-icon-check" v-if="showRedYellow"/>
        <i v-else class="el-icon el-icon-close"/>
      </p>
    </div>
    <div class="hot_map_filter" @click="patchMapChange(4)">
      <p>
        珠江街封控管理区
        <i class="el-icon el-icon-check" v-if="currLayer == 4"/>
        <i v-else class="el-icon el-icon-close"/>
      </p>
    </div>
<!--    <div class="hot_map_filter" @click="patchMapChange(5)">-->
<!--      <p>-->
<!--        门磁监控-->
<!--        <i class="el-icon el-icon-check" v-if="currLayer == 5"/>-->
<!--        <i v-else class="el-icon el-icon-close"/>-->
<!--      </p>-->
<!--    </div>-->

    <div class="hot_map_filter" @click="patchMapChange(3)">
      <p>嘉安花园
        <i class="el-icon el-icon-check" v-if="currLayer == 3"/>
        <i v-else class="el-icon el-icon-close"/>
      </p>
    </div>

  </div>
</template>

<script>
import { getHotelData, getHeatMapData, getStreetHealthCode } from '@/api/mapData.js'
import DISTRICTS from './districts.json'
export default {
  name: 'MapFilter',
  props: ['hotelType', 'currLayer'],
  data () {
    return {
      showHotelFilter: false,
      showHeatMapFilter: false,
      showRedYellow: false,
      hotelTypeCheckList: ['1','2','3'],
      heatMapCheckList: ['密切接触者', '密接的密接'],
      hotalData: [],
      redYellowData: [],
      heatMapData: [],
      legendData: {}
    }
  },
  methods: {
    /**
     * 筛选酒店
     */
    async hotelTypeChange () {
      let filteHotalData = this.hotalData.filter(item => {
        return this.hotelTypeCheckList.includes(item.type)
      })
      this.$emit('setHotelData', filteHotalData)
    },
    /**
     * 渲染红黄码图标
     */
    /**
     * 渲染红黄码图标
     */
    async handleCheckRedYellow () {
      this.patchMapChange(0)
      this.showRedYellow = !this.showRedYellow
      let data = this.redYellowData
      const markers = []
      if(this.showRedYellow){
        data.forEach((item,index) => {
          let current = DISTRICTS.find(v => v.name.includes(item.street))
          if(current){
            markers.push({
              name : item.street,
              id: index,
              position: current.center,
              content: `<div class="red-yellow-marker-box">
                       <div onclick="redYellowItemClick(this)" data-key="${item.street}_red" class="red-yellow-marker-item red-marker-item"><div class="icon"></div><div class="street-name">${item.street}</div><span class="ry-count">${item.redNum}</span></div>
                       <div onclick="redYellowItemClick(this)" data-key="${item.street}_yellow"  class="red-yellow-marker-item yellow-marker-item"><div class="icon"></div><span class="ry-count">${item.yellowNum}</span></div>
                    </div>`
            })
          }
        })
      }
      if (this.showRedYellow) {
        this.hotelTypeCheckList = []
        this.heatMapCheckList = []
      }
      this.$emit('setRedYellowData', markers)
    },
    /**
     * 筛选热力
     */
    async heatMapTypeChange () {
      let filteHeatMapData = this.heatMapData.filter(item => {
        return this.heatMapCheckList.includes(item.mjlx)
      })
      this.$emit('setHeatMapData', filteHeatMapData)
    },
    /**
     * 获取地图酒店数据
     */
    async getHotelData () {
      let res = await getHotelData()
      this.hotalData = res.map(item => {
        const handlerData = JSON.stringify(item).split(' ')
        let config = {
          type: item.type,
          id: item.id,
          position: [item.jd, item.wd],
          content: `
          <div class="map_hotel" onclick="mapItemClick(event)" extData=${JSON.stringify(handlerData)}>
            <div class="map_hotel_icon" style="background-image:url(./static/mapIcon/Hotel_m_${item.type}.png);">
              <div class="map_hotel_dot">${item.glrs}</div>
            </div>
            <div class="map_hotel_label">${item.jkgcjd}</div>
          </div>
          `
        }
        return config
      })
    },
    /**
     * 获取镇街红黄码统计分布
     */
    async getRedYellowData () {
      let res = await getStreetHealthCode()
      // console.log('获取镇街红黄码统计分布', res)
      this.redYellowData = res.data
      this.$emit('getRyTotal',{redTotal:res.redTotal,yellowTotal:res.yellowTotal})
    },
    /**
     * 获取地图酒店数据
     */
    async getHeatMapData () {
      let res = await getHeatMapData()
      let heatMapData = {}
      res.forEach(item => {
        if (item.longitude && item.latitude) {
          if (!heatMapData[item.longitude + item.latitude]) {
            heatMapData[item.longitude + item.latitude] = {}
            heatMapData[item.longitude + item.latitude]['count'] = 1
            heatMapData[item.longitude + item.latitude]['lng'] = item.longitude
            heatMapData[item.longitude + item.latitude]['lat'] = item.latitude
            heatMapData[item.longitude + item.latitude]['mjlx'] = item.mjlx
          } else {
            heatMapData[item.longitude + item.latitude].count += 1
          }
        }
      })
      this.heatMapData = Object.values(heatMapData)
    },

    /**
     * 派发事件，切换地图
     * @param val
     */
    patchMapChange(val){
      //切换地图是取消显示筛选栏
      if (val!=0){
        this.showHotelFilter = false
        this.showHeatMapFilter = false
        this.showRedYellow = false
      }
      this.$emit('MapChange', val)
    }

  },
  async mounted () {
    await this.getHeatMapData()
    await this.getHotelData()
    await this.getRedYellowData()
    this.hotelTypeChange()
    this.heatMapTypeChange()
  },
  watch: {
    hotalData: {
      handler (newVal) {
        if (newVal && newVal.length) {
          let hotelMap = {}
          newVal.forEach(item => {
            if (hotelMap[item.type]) {
              hotelMap[item.type]++
            } else {
              hotelMap[item.type] = 1
            }
          })
          this.legendData = hotelMap
          this.$forceUpdate()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map_filter {
  position: absolute;
  left: 0;
  right: 0;
  height: 40px;
  bottom: 30px;
  z-index: 20;
  display: flex;
  justify-content: center;

  & > div {
    width: 188px;
    height: 44px;
    margin: 0 10px;
    background-image: url("../../assets/image/btn-sl.png");
    background-size: 100%;
    cursor: pointer;
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
    p {
      width: 100%;
      text-align: center;
      color: #fff;
      line-height: 44px;
    }
    i {
      display: inline-block;
      margin-left: 6px;
    }
  }
  .hotel_filter, .hot_map_filter {
    position: relative;
  }
  .popover {
    width: 220px;
    position: absolute;
    bottom: 46px;
    left: -15px;
    div {
      width: 100%;
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .popover_header {
      background-image: url("../../assets/image/box1_top.png");
      height: 10px;
    }
    .popover_body {
      background-image: url("../../assets/image/box1_mid.png");
      background-repeat: repeat-y;
      padding: 8px;
      width: calc(100% - 16px);
    }
    .popover_footer {
      background-image: url("../../assets/image/box1_bottom.png");
      height: 22px;
    }
  }
  .el-checkbox {
    color: #fff;
    width: calc(100% - 16px);
    background: #223367;
    margin: 2px;
    padding: 6px;
    display: flex;

    .hotel_count {
      color: #FFFF00;
      font-weight: 800;
      width: 20px;
      text-align: right;
    }
    ::v-deep .el-checkbox__inner {
      border-radius: 50%;
      vertical-align: middle;
    }
    ::v-deep .el-checkbox__label {
      width: calc(100% - 20px);
      white-space: pre-wrap;
      vertical-align: top;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
