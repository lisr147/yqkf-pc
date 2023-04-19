<template>
  <div class="map-legend">

    <!--图层切换-->
    <div class="map-legend-item cursor" @click="toggleMapList"  v-if="mapList[curMapIndex]">
      {{mapList[curMapIndex].label}} <i class="el-icon el-icon-arrow-down"></i>
    </div>
    <div class="map-list-box" v-show="isMapListVisible">
      <ul >
        <li v-for="(item,index) in mapList" :key="index" :class="{'active':index == curMapIndex}" @click="switchMap(index)">{{item.label}}</li>
      </ul>
    </div>

    <div class="map-legend-item" v-if="hasGrid">
      网格
      <el-switch v-model="isGridVisible" active-color="#13ce66" ></el-switch>
      <i class="el-icon el-icon-arrow-down" @click="gridFilterVisible = !gridFilterVisible"></i>
    </div>
    <div class="map-legend-item search-box" v-show="gridFilterVisible" >
      <p>
        <el-input placeholder="请输入网格名称关键词" v-model="gridKeyword" size="mini" :disabled="!isGridVisible" style="width: 150px;" @change="gridFilter" @clear="gridFilter" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 6px;" @click="gridFilter" :disabled="!isGridVisible"></el-button>
      </p>
      <p>
        <span>匹配到{{gridCount}}个网格</span>
      </p>
    </div>

    <div class="map-legend-item cursor" @click="toggleLocation">
      搜索地址 <i class="el-icon el-icon-arrow-down"></i>
    </div>
    <div class="map-legend-item search-box" v-show="locaSearchVisible">
      <el-input placeholder="请输入地址" v-model="locaKeyword" size="mini" clearable style="width: 150px;"></el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 6px;" @click="searchLocation"></el-button>
      <div class="match-list">
        <div class="match-list-item" v-for="(item,index) in locaAutoList" :key="index" @click="gotoLocation(item)">{{item.label}}</div>
      </div>
    </div>

    <!--图例-->
    <div class="map-legend-item cursor" @click="toggleLegend" v-if="hasLegend">
      图例 <i class="el-icon el-icon-arrow-down"></i>
    </div>
    <div class="map-legend-box" v-show="isLegendVisible">
      <ul>
        <li v-for="item in legendData" :key="item.title">
          <img :src="`./static/mapIcon/${item.icon}.svg`"/> <span>{{item.label}}</span>
        </li>
      </ul>
    </div>

    <div class="map-legend-item cursor" @click="toggleAreaType">
      管理区类型 <i class="el-icon el-icon-arrow-down"></i>
    </div>
    <div class="map-legend-box" v-show="isAreaTypeVisible">
      <ul>
        <li @click="checkAreaType(index)" class="cursor" v-for="(item, index) in areaTypes" :key="index"><b :class="{'el-icon-check': item.active}" /> <span>{{item.label}}</span></li>
      </ul>
    </div>

  </div>
</template>

<script>
  import {throttle} from '@/utils/common'
  import AMapLoader from '@amap/amap-jsapi-loader';
  import {WMTS_Layers} from "@/config/WMTS"


  export default {
    name: "MapLegend",
    components: {},
    props: {
      hasLegend: {
        type: Boolean,
        default: true,
      },
      hasGrid: {
        type: Boolean,
        default: true,
      }
    },
    data() {
      return {
        //是否显示图例
        isLegendVisible: false,
        //底图列表
        mapList: [],
        curMapIndex: 2,
        isMapListVisible: false,
        //图例源数据
        legendData:[
          {label:'阳性人员',icon:'diagnose-1'},
          {label:'家',icon:'home-1'},
          {label:'场所',icon:'place-1'},
        ],
        //管理区类型
        areaTypes: [
          {label: '高风险区', value: 'seal', active: true},
        //   {label: '中风险区', value: 'manage', active: true},
          {label: '低风险区', value: 'prevention', active: true},
          {label: '管控网格', value: 'managewga', active: true},
        ],

        isAreaTypeVisible: false,

        isGridVisible: false,
        isPartyVisible: false,

        //过滤网格的关键词
        gridKeyword: '',
        gridFilterVisible: false,

        //地址搜索
        locaKeyword: '',
        locaSearchVisible: false,
        locaAutoComplete: null,
        locaAutoList: []
      }
    },
    computed:{
      gridCount(){
        return this.$store.state.map.matchGridCount
      }
    },
    watch:{
      isGridVisible(val) {
        this.$emit('gridLayerSwitch', {visible: val, gridKeyword: this.gridKeyword})
      },
      locaKeyword(val){
        if (val == '') {
          this.locaAutoList = []
          this.$emit('clearLocation')
        } else {
          this.searchLocation()
        }

      },

    },
    mounted() {
      document.body.addEventListener('click', this.hideOtherLayer)
      this.initLocationSearch()

      this.mapList = WMTS_Layers.map(v=>{
        return {
          id: v.id,
          label: v.title
        }
      })

    },
    methods: {

      //初始化高德地址编码
      async initLocationSearch() {
        var t = this
        var AMap = await AMapLoader.load({
          key: "96c44e4b9d6a4bb04b520127932bdf0e",
          plugins: ['AMap.AutoComplete','AMap.HeatMap'],
          version: "2.0"
        })

        AMap.plugin('AMap.AutoComplete', function() {
          t.locaAutoComplete = new AMap.AutoComplete({city: '广州'})
        })

      },

      //根据关键词返回最多5个匹配地址
      searchLocation: throttle(function(){

        this.locaAutoComplete.search(this.locaKeyword, (status, result) =>{

          if(status == 'complete'){

            let arr = result.tips.splice(0,5).map(v=>{
              const {lng, lat} = v.location
              return {
                label: v.name,
                lngLat: [lng,lat]
              }
            })

            this.locaAutoList = arr

          } else {

            this.locaAutoList = []
          }

        })
      }, 1000),

      gotoLocation(item) {
        this.$emit('gotoLocation', item)
      },

      gridFilter: throttle(function(){
        this.$emit('gridLayerFilter', {gridKeyword: this.gridKeyword})
      }, 1000),
      toggleLegend() {
        this.isLegendVisible = !this.isLegendVisible
      },
      toggleMapList(){
        this.isMapListVisible = !this.isMapListVisible
      },
      toggleAreaType(){
        this.isAreaTypeVisible = !this.isAreaTypeVisible
      },
      checkAreaType(index) {
        this.areaTypes[index].active = !this.areaTypes[index].active
        this.$emit('changeAreaType', {
          data: this.areaTypes.filter(v => {
            return v.active
          })
        })
      },
      switchMap(index){
        this.curMapIndex = index
        this.isMapListVisible = false
        this.$emit('bgMapChange', this.mapList[index])
      },
      hideOtherLayer(){
        //如果点击位置不在当前组件内，则折叠所有菜单
        if (this.$el.contains(event.target)) {
          return
        }
        this.isMapListVisible = false
        this.isLegendVisible = false
      },
      toggleLocation(){
        this.locaSearchVisible = !this.locaSearchVisible
      }

    }
  }
</script>

<style lang="scss" type="text/scss">
.map-legend {
  position: absolute;
  top: 80px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;


  &-box{
    position: relative;
    width: 160px;
    max-height: 400px;
    margin-bottom: .5em;
    overflow: auto;
    box-sizing: border-box;
    border: 16px solid transparent;
    border-image: url("~@/assets/image/dialog-bg.png") 16;

    ul {
      background-color:rgba(32,50,111,0.95);
      min-height: 50px;
      color: #fff;
      li{
        position: relative;
        padding: 4px 0;
        border-bottom: 1px solid #3462F0;
      }
      img{
        vertical-align: middle;
      }
      b{
        display: inline-block;
        width: 14px;
        height: 14px;
      }
      .cursor {
        cursor: pointer;
      }
    }

  }

  &-item {
    position: relative;
    width: 116px;
    height: 34px;
    margin-bottom: 10px;
    padding: 6px 6px;
    box-sizing: border-box;
    text-align: left;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(180deg, #0F2560 0%, #1C49B8 100%);
    box-shadow: 0px 0px 5px 0px #11245E, inset 0px 0px 5px 0px #2B5FF6;
    border: 1px solid #2B5FF6;

    img{
      vertical-align: middle;
    }
    p{
      color: #fff;
    }

    .el-icon{
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }

    &.cursor{
      cursor: pointer;
    }

    &.search-box{
      width: 220px;
      min-height: 50px;
      height: auto;
      text-align: left;
      cursor: default;

      input{
        outline: none;
        border:0 none;
      }
      p{
        padding: .5em 0;
      }
    }
    .match-list{
      &-item{
        position: relative;
        padding: .5em;
        border-bottom: 1px dashed #b3caff;
        cursor: pointer;

        &:hover{
          background-color: rgba(64,158,255,0.3);
        }

        &:last-child{
          border-bottom:0 none;
        }
      }
    }
  }

  .map-list-box{
    margin: 0 0 1em;
    min-width:116px;
    background: linear-gradient(180deg, #0F2560 0%, #1C49B8 100%);

    li {
      padding: 10px;
      color: #fff;
      cursor: pointer;

      &.active,
      &:hover {
        background-color:#2B5FF6;
      }
    }
  }
}
</style>
