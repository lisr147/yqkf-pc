<template>
  <div class="arcgis-layer" v-show="visible">
    <div class="viewDiv"  id="viewDiv2"></div>

    <div class="layer-list">
      <div class="rbtn" :class="{active: item.active, 'arrow': item.arrowList}" v-for="(item,index) in layerList" @click="toggleLayer(index)" :key="item.id">
        <div class="rbtn-label">{{item.label}}</div>
        <i @click="showGoodsTable" v-if="item.id == 'goods'" class="el-icon-document ico"></i>
        <div class="rbtn-right-wrapper" v-if="item.id === 'door' && item.showArrow">
          <div class="rbtn-right-item" :class="{'active':doorType === arrow.id}" @click.stop="handleClickArrowItem(arrow, index)" v-for="arrow in item.arrowList" :key="arrow.id">
            <span>{{arrow.label}} ({{arrow.total}})</span>
          </div>
        </div>
      </div>
      <div class="rbtn arrow" :class="{active: viewVideoList.active}" @click="viewList">
        <div class="rbtn-label">{{viewVideoList.label}}</div>
      </div>
    </div>

    <!-- 摄像头列表 -->
    <div class='camera-list' v-if="cameraListVisible">
      <div class="item" v-for="(item,index) in videoList" @click="viewCamera(item)" :key="index"><span>{{index+1}}. {{item.deviceName}}</span></div>
    </div>

    <!--病例详情-->
    <patient-detail v-model="patientDetailVisible" :id="patientDetailId"></patient-detail>

    <!--设备详情-->
    <device-detail v-model="deviceVisible" :attributes="deviceInfo" ></device-detail>

    <!--物资供应详情-->
    <goods-detail v-model="goodsDetailVisible"></goods-detail>

    <door-list v-model="doorListVisible" :data="currentDoor"></door-list>

    <!--浮层面板-->
    <floating-panel-layer></floating-panel-layer>
    <!--数据面板-->
    <arcgis-gald ref="gald"/>
    <!--点标记名称-->
    <div class="map-point-tip" :style="currTipStyle" v-show="currTip">{{currTip}}</div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Map from '@arcgis/core/Map';
  import Graphic  from '@arcgis/core/Graphic';
  import MapView from '@arcgis/core/views/MapView';
  import TileLayer from '@arcgis/core/layers/TileLayer';
  import SpatialReference from '@arcgis/core/geometry/SpatialReference'
  import Point from '@arcgis/core/geometry/Point'
  import LayerList from '@arcgis/core/widgets/LayerList'
  import GraphicsLayer  from '@arcgis/core/layers/GraphicsLayer';
  import {BASE_URL} from "@/config/setting"
  import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
  import LabelClass from '@arcgis/core/layers/support/LabelClass'
  import Sketch from '@arcgis/core/widgets/Sketch'
  import DoorList from "@/components/door/DoorList";
  import PatientDetail from '@/components/Seal/PatientDetail.vue'
  import ArcgisGald from '@/components/Seal/ArcgisGald.vue'
  import DeviceDetail from '@/components/Seal/DeviceDetail.vue';
  import GoodsDetail from '@/components/Seal/GoodsDetail'

  import  {getUniqueValueInfos} from '@/config/setting'
  import {getVideoLayerList, getHDVideoLayerList, getDoorList, getDoorListByAlarm, getDoorAlarmCount} from '@/api/mapData'
  import FloatingPanelLayer from '@/components/Seal/FloatingPanelLayer.vue';


  const SP = new SpatialReference({
    //影像, wkt的值不能擅自换行
    wkt: `PROJCS["GUANGZHOU2000",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["false_easting",0.0],PARAMETER["false_northing",0.0],PARAMETER["central_meridian",113.28],PARAMETER["scale_factor",1.0],PARAMETER["latitude_of_origin",0.0],UNIT["Meter",1.0]]`
  })

  export default {
    name: 'ArcgisLayer',
    components: {
      GoodsDetail,
      PatientDetail,
      ArcgisGald,
      DeviceDetail,
      DoorList,
      FloatingPanelLayer
    },
    props: {
      visible: {
        type: Boolean,
        default: true
      }
    },
    watch:{
      visible:{
        handler:function(val){
          if(val && !this.view){
            this.$nextTick(()=>{
              this.initMap()
            })
          }
          if(!val){
            this.deviceVisible = false
            this.$store.commit('CLEAR_FLOARING')
          }
        },
        immediate: true
      },
      deviceVisible(val) {
        //监测到窗口关闭，则清空deviceInfo
        if (val == false) {
          this.deviceInfo = {}
        }
      }
    },
    data() {
      return {
        view: null,
        map: null,
        patientDetailVisible: false,
        patientDetailId: null,
        cameraListVisible: false,
        deviceVisible: false,
        goodsDetailVisible: false,
        deviceInfo: {},
        videoList:[],
        layerList: [
          {label:'物资供应点',id:'goods',active: true},
          {label:'确诊病例位置',id:'patient',active: true},
          {label:'卡口分布',id:'police',active: true},
          {label:'风险场所',id:'hotspot',active: true},
          // {label:'网格图层',id:'grid',active: true},
          {label:'管控区域',id:'base',active: true},
          {label:'实时监控',id:'camera',active: true},
          {label:'门磁监控',id:'door',active: true , showArrow:false, arrowList:[
              {
                id: 2, label: '今日告警门磁',total: '',
              },
              {
                id: 1, label: '所有门磁',total: '',
              },
            ]},
          {label:'基层党组织',id:'party',active: true},
        ],
        viewVideoList:{label:'摄像头列表',id:'cameraList',active: false},
        dictMap: {
          name: '名称',
          status: '状态',
          range: '范围',
          startCloseDate: '开始封闭日期',
        },
        doorList: {},
        doorListVisible: false,
        currentDoor: {}, //当前点击的门磁
        //当前浮动贴士内容
        currTip: '',
        currTipStyle: {},
        doorType: 2 // 1.所有门磁 2.当日告警门磁
      }
    },
    async mounted() {
      // this.videoList = await getVideoLayerList()
    },
    destroyed(){
      console.log('destroyed')
    },
    methods: {
      toggleLayer(index) {
        console.log('index',index,this.layerList[index].id)
        if (this.layerList[index].id === 'door') {
          console.log('1111')
          // this.doorType = 2
          // this.initDoorLayer()
          this.layerList[index].showArrow = !this.layerList[index].showArrow
          return false
        }

        const tobe = !this.layerList[index].active
        this.layerList[index].active = tobe
        var layer = this.map.findLayerById(this.layerList[index].id)
        if(layer){
          layer.visible = tobe
        }
      },
      initMap(){

        //南沙区卫星地图
        let layerNSWX = new TileLayer({
          url: `${process.env.VUE_APP_MAP_API}/arcgis/rest/services/yxt/yxt2020/MapServer`,
          title: '珠江街影像地图',
          id: 'gz-nswx',
          opacity: 1,
        })
        //平面地图
        const _map = new Map({
          layers: [layerNSWX]
          // basemap: "topo-vector"
        })
        //视图
        const _view = new MapView({
          map: _map,
          container: 'viewDiv2',
          //初始范围，会覆盖 center scale zoom
          center:  new Point({
            x: 67180.74530712888,
            y: 182730.69591480214,
            spatialReference: SP
          }),
          zoom: 4,

          background: {
            color: "#021144"
          }
        })
        this.view = _view
        this.map = _map

        _view.on('click',(event)=> {
          const {x, y} = event.mapPoint
          console.log({x,y})
        })


        //图层列表
        // var layerList = new LayerList({
        //   view: _view
        // })
        // _view.ui.add(layerList, {
        //   position: 'bottom-left'
        // })

        _view.on('click',(event)=>{

          _view.hitTest(event).then(res => {

            const results = res.results
            if (results.length && results[0].graphic) {

              const {sourceLayer, attributes} = results[0].graphic
              if (sourceLayer && sourceLayer.id == 'patient') {
                this.patientDetailId = attributes.id
                this.patientDetailVisible = true
              }

              if (sourceLayer && sourceLayer.id == 'camera') {
                this.deviceVisible = true
                this.deviceInfo = attributes
              }
              console.log('sourceLayer',sourceLayer)
              console.log('results[0].graphic',results[0].graphic)
              if (sourceLayer && (sourceLayer.id == 'door1' || sourceLayer.id == 'door2')) {
                this.currentDoor = {
                  data: this.doorList[results[0].graphic.attributes.name],
                  name: results[0].graphic.attributes.name
                }
                this.doorListVisible = true
              }

            }
          })
        })

        _view.on("pointer-move", (event) => {

          const {x, y} = event

          _view.hitTest(event).then((res) => {

            const results = res.results
            if (results.length && results[0].graphic) {
              const {sourceLayer, attributes} = results[0].graphic
              if (!sourceLayer || !attributes) {
                return
              }
              const {name, count, deviceName} = attributes

              if (sourceLayer && ['door','hotspot','camera','police','party'].includes(sourceLayer.id)) {

                var tip= ''
                switch(sourceLayer.id){
                  case 'door':
                    tip = `${name} ${count}户`
                    break;
                  case 'camera':
                    tip = `${deviceName}`
                    break;
                  default:
                    tip = `${name}`
                    break;
                }

                if (tip && tip !== this.currTip) {
                  this.currTip = tip
                  this.currTipStyle = {top: y + 15 + 'px', left: x + 15 + 'px'}
                }
              }

            }
            //无事件时取消tip弹窗
            else{
              this.currTip = ''
            }
          })
        })

        //管控区域
        this.initBaseLayer()

        //网格图层
        // this.initGirdLayer()
        //风险场所
        this.initHotSpotLayer()
        //卡口
        this.initPoliceLayer()
        //病例
        this.initPatientLayer()
        //摄像头图层
        this.initCameraLayer()

        //物资供应点
        this.initGoodsLayer()
        //基层党组织
        this.initPartyLayer()
        // 门磁
        this.initDoorLayer()
        // 获取门磁总数
        this.getDoorTotalCount()

        // this.initDraw()
      },

      initBaseLayer(){

        const graphicsLayer = new GraphicsLayer({
          id: 'base',
          title: '管控区域'
        })
        this.map.add(graphicsLayer);

        this.drawPoylgon({
          name: '健康管理区',
          style: {
            borderColor: '#3bd0fd',
            borderStyle: 'dash',
            borderWidth: 2,
            fillStyle: 'none'
          },
          paths: [[[58255.008705655746,185181.53623314935],[58843.44321585821,184874.61895264813],[59529.244587460955,184832.28553464796],[60325.11284586414,185069.35267544893],[60875.44727986634,185450.35343745045],[61798.315792270034,186085.354707453],[63237.65200427578,186525.62225465468],[64685.454899881566,186940.48975105633],[65642.19014668539,186974.35648545646],[67047.65962429102,186678.02255945528],[67873.16127529433,185960.4711243524],[68719.82963529772,185367.80327235002],[69422.56437410053,184495.73486154652],[69972.89880810273,183809.9334899438],[70447.03308970462,182353.66391073796],[71158.23451210746,181422.32871473423],[71733.96899690977,180761.9273939316],[72123.43644251133,180711.1272923314],[72648.37082571343,180541.79362033072],[73257.97204491586,179847.52556512796],[75848.7772265262,176816.45283631588],[77237.31333693175,174970.71581150847],[77829.98118893412,172244.4436922976],[78710.5162833376,170737.3740114915],[77948.51475933453,169789.1054482877],[78676.64954893745,168468.30280668242],[76322.91150812803,166165.36486747322],[75425.44304652445,166470.16547707442],[73393.43898251632,169687.50524508735],[71903.30266891039,170364.8399330901],[71073.56767610706,170500.30687069063],[70277.69941770389,170771.2407458917],[69786.63176890189,171279.24176189382],[69718.89830010162,171245.37502749366],[69464.8977921006,171448.5754338945],[69177.03054969944,171076.04135549298],[68669.02953369741,171414.70869949434],[68550.49596329694,171245.37502749366],[68431.96239289647,171160.70819149332],[66992.62618089071,173616.04643550314],[65519.42323448481,175834.31753871203],[65028.355585682846,177205.9202819175],[65553.28996888494,177476.8541571186],[65485.55650008468,177798.58813391987],[65739.5570080857,178188.05557952143],[65350.089562484136,178526.7229235228],[62928.61805287445,180575.660354731],[60049.94562886293,182539.93094993877],[57865.54126005419,184233.26766994555],[58255.008705655746,185181.53623314935]]]
        })
        this.drawLabel({
          text: '健康管理区',
          style: { color: '#3bd0fd', yoffset: 20},
          coodinate: {
            x: 62130.36853970862, y: 185893.0022394147
          }
        })

        this.drawPoylgon({
          name: '防控区',
          style: {
            borderColor: '#3266ff',
            borderWidth: 2,
          },
          color: [66, 125, 239, 0.2],
          paths: [[[64289.372857717324,182235.3949242002],[64564.540074718425,182527.49550840136],[64649.20691071876,182519.02882480132],[65169.90795212084,183145.56341120382],[65182.60797752089,183209.0635382041],[65305.374889721366,183331.83045040446],[65347.708307721536,183327.59710860444],[66342.54363072551,184394.39924220872],[65953.076185124,184690.73316821002],[67464.37920773005,186413.7032808169],[68751.31511493519,185262.2343112122],[69356.68299233762,184606.0663322096],[69978.98423694012,183708.59787060594],[70402.31841694178,182451.29535600092],[69263.54947273718,181320.99309539632],[69216.982712937,181359.09317159647],[68315.2809095334,180415.05795019268],[69157.71592773673,179521.8228303891],[68103.61381953252,178438.08732958479],[67341.61229552947,179356.72250018845],[67494.01260033008,179551.45622298925],[66185.90998412485,181486.0934255971],[65826.07593112341,180982.325751395],[64289.372857717324,182235.3949242002]]]
        })
        this.drawLabel({
          text: '防控区',
          style: { color: '#3266ff', xoffset: 0, yoffset: 0},
          coodinate: {x: 65525.50866332222, y: 183856.76483360666}
        })

        this.drawPoylgon({
          name: '封控管理区',
          color: [255, 152, 0, 0.2],
          style: {
            borderColor: '#ff9800',
            borderWidth: 2
          },
          // color: '#fff',
          paths: [[[65720.24238612306,182815.36275080254],[66037.74302112438,183192.13017100384],[66816.67791232748,184051.49855640734],[67316.21224472945,184584.89962320955],[67993.54693273215,185567.0349208135],[68264.48080793323,185681.33514941394],[68734.3817477351,185334.20112181266],[69373.61635953769,184567.96625600956],[68607.38149373462,183755.1646304063],[67625.24619613068,182709.5292058021],[67468.61254953005,182929.662979403],[66621.94418952666,181943.29433999906],[65720.24238612306,182815.36275080254]]]
        })
        this.drawPoylgon({
          name: '封闭区域',
          type: 'polygon',
          attributes: {
            range: '珠江街道嘉安花园',
            startCloseDate: '2021-06-07'
          },
          color: [255, 46, 33, 0.2],
          paths: [[[65304.31655427148,182297.83671575057],[65549.85037867246,182602.6373253518],[65841.95096287366,182306.83256707562],[65603.8254866227,182052.8320590746],[65304.31655427148,182297.83671575057]]]
        })
        this.drawLabel({
          text: '嘉安花园',
          style: { color: '#ff0000', yoffset: 20, fontSize: 18},
          coodinate: {
            x: 65541.38369507232,
            y: 182315.8284184005
          }
        })
        this.drawPoylgon({
          name: '封闭区域',
          type: 'polygon',
          attributes: {
            range: '珠江街道发展路、发展横路、灵新大道、珠江二路所包围区域',
            startCloseDate: '2021-06-11'
          },
          color: [255, 46, 33, 0.2],
          paths:[[[66427.21046672598,182139.08639824964],[66520.34398632636,182250.21162050008],[66592.31079692664,182192.00317074984],[66491.76892917624,182077.7029421494],[66427.21046672598,182139.08639824964]]]
        })

        this.drawPoylgon({
          name: '封闭区域',
          type: 'polygon',
          attributes: {
            range: '范围：珠江街道珠江西一路（142、144、146、148、150号）',
            startCloseDate: '2021-06-13'
          },
          color: [255, 46, 33, 0.2],
          paths: [[[65508.04612839725,181342.15980439656],[65640.86722737279,181488.21009649715],[65629.22553742274,181498.7934509972],[65680.02563902293,181555.41439757243],[65745.6424369232,181505.14346369723],[65562.02123634747,181300.3555541214],[65508.04612839725,181342.15980439656]]]
        })

        this.drawLabel({
          text: '封闭管理区',
          style: { color: '#ff0000', xoffset: -120, yoffset: 10 },
          coodinate: {x: 65787.97585492334, y: 181989.8610997992}
        })

        this.drawLabel({
          text: '封控管理区',
          style: { color: '#ff9800', xoffset: 30, yoffset: 20},
          coodinate: {x: 69487.9165881381, y: 184847.36681481058}
        })
        this.drawMaker({
          name: '珠江街道办',
          style:{
            icon: 'svg/quan.svg',
            size: 13
          },
          coodinate: {
            x: 66079.01810367446,
            y: 182256.56163320033
          }
        })
        this.drawLabel({
          text: '珠江街道办',
          style: { color: '#ff702a', fontSize: 18, yoffset: 20},
          coodinate: {
            x: 66079.01810367446,
            y: 182256.56163320033
          }
        })
        this.drawMaker({
          name: '前线指挥部',
          style:{
            icon: 'svg/star.svg',
          },
          coodinate: {
            x: 66162.62660422479, y: 182021.61116329927
          }
        })
        this.drawLabel({
          text: '前线指挥部',
          style: { color: '#ff0000',  fontSize: 18},
          coodinate: {
            x: 66162.62660422479, y: 182021.61116329927
          }
        })

        this.drawMaker({
          name: '北出入口',
          style:{icon: 'svg/inout.svg',},
          coodinate: {x: 65961.54286872395, y: 184724.59990261015}
        })
        this.drawLabel({
          text: '北出入口',
          style: { color: '#3266ff',fontSize: 16, yoffset: 12},
          coodinate: {x:65961.54286872395, y: 184724.59990261015}
        })
        this.drawMaker({
          name: '南出入口',
          style:{icon: 'svg/inout.svg',},
          coodinate: {x: 67407.22909342978, y: 181267.0179874463}
        })
        this.drawLabel({
          text: '南出入口',
          style: { color: '#3266ff',fontSize: 16, yoffset: 12},
          coodinate: {x: 67407.22909342978, y: 181267.0179874463}
        })

      },

      //绘制多边形
      drawPoylgon({
                    paths,
                    style = {},
                    name = '',
                    attributes = {},
                    color = [60, 136, 255, 0.2],
                    layerId = 'base',
                    type = 'polyline'
                  }) {
        var geometry
        if (type == 'polyline') {
          geometry = {
            type: "polyline",
            paths,
            spatialReference: SP
          }
        } else if (type == 'polygon') {
          geometry = {
            type: "polygon",
            rings: paths,
            spatialReference: SP
          }
        }
        const lineSymbol = {
          type: "simple-fill",
          color,
          style: style.fillStyle || "solid",
          outline: {
            color: style.borderColor || '#FF2E21',
            width: style.borderWidth || 4,
            style: style.borderStyle || 'solid'
          },
        }

        var fieldInfos = Object.keys(attributes).map(key => {
          return {
            fieldName: key,
            label: this.dictMap[key]
          }
        })

        const boundary = new Graphic({
          geometry,
          symbol: lineSymbol,
          attributes,
          popupTemplate:{
            title: name,
            content: [{
              type: "fields",
              fieldInfos
            }]
          },
        });
        this.map.findLayerById(layerId).add(boundary);
      },

      //绘制文字
      drawLabel({text = '文字内容', style = {}, coodinate = {}, layerId='base'} = {}) {

        const label = new Graphic({
          geometry: {
            type: "point",
            x: coodinate.x,
            y: coodinate.y,
            spatialReference: SP
          },
          symbol: {
            type: "text",
            color: style.color|| '#ff0f43',
            haloColor: style.haloColor|| "#fff",
            haloSize: style.haloSize|| "2px",
            yoffset: style.yoffset !== void 0 ? style.yoffset : -2 * (style.fontSize || 16),
            xoffset: style.xoffset !== void 0 ? style.xoffset : 0,
            font:{
              size: style.fontSize|| 24
            },
            text
          },
        })

        this.map.findLayerById(layerId).add(label);
      },

      //绘制图形
      drawMaker({style = {}, name, coodinate = {}, attributes={}, layerId='base'} = {}){
        let symbol

        if (style.icon) {
          symbol = {
            type: "picture-marker",
            url: `${BASE_URL}/static/images/${style.icon || 'svg/star.svg' }`,
            width: style.size || "20",
            height: style.size || "20"
          }
        }else{
          symbol = {
            type: "simple-marker",
            style: style.shape || "circle",
            color: style.color || "#3c88ff",
            size: "12",
            outline: {
              color: '#fff',
              width: 2
            }
          }
        }

        var popupTemplate = null
        if (Object.keys(attributes).length) {
          const arr = Object.keys(attributes).map(key => {
            return {
              fieldName: key,
              label: this.dictMap[key]
            }
          })
          popupTemplate = {
            title:  name,
            content:  [{
              type: "fields",
              fieldInfos: arr
            }]
          }
        }

        const marker = new Graphic({
          geometry: {
            type: "point",
            x: coodinate.x,
            y: coodinate.y,
            spatialReference: SP
          },
          attributes,
          popupTemplate,
          symbol,
        })
        this.map.findLayerById(layerId).add(marker);
      },

      initDraw(){

        //绘图工具
        const drawlayer = new GraphicsLayer({
          id: 'canvas',
          title: '绘制面板'
        })
        this.map.add(drawlayer)
        const sketch = new Sketch({
          layer:drawlayer,
          view: this.view,
          creationMode: 'update'
        })
        this.view.ui.add(sketch, 'top-right')
        sketch.on('update', (event) => {
          if(event.graphics[0].geometry){
            console.log(JSON.stringify(event.graphics[0].geometry.rings))
          }
        })
        this.sketch = sketch

      },
      //网格图层
      initGirdLayer(){

        const labelClass = new LabelClass({
          symbol: {
            type: 'text',
            color: '#fff',
            haloColor: "#3d83d1",
            haloSize: 1,
            font: { size: 12, weight: "bold"}
          },
          labelPlacement: 'above-center',
          labelExpressionInfo: {
            // expression: `return $feature.name + ' 关注人数' + $feature.count`
            // 输出结果如何换行？
            expression: `
              Console('hello world');
              $feature.name+ ':' + $feature.count + IIF($feature.count > 10,  '非常高', '高')
             `
          }
        })

        const layer = new FeatureLayer({
          id: 'grid',
          title: "网格图层",
          opacity: 1,
          fields:[{
            name: "ObjectID",
            type: "string"
          },{
            name: "name",
            type: "string"
          }],
          outFields: ["*"],
          objectIdField: "ObjectID",
          geometryType: "polygon",
          source: [],
          labelingInfo: [labelClass],
          popupTemplate:{
            title: '{name}'
          },
          renderer : {
            type: "simple",
            symbol: {
              type: "simple-fill",
              size: 12,
              // color: [57,100,240,0.5],
              outline: {
                width: 1,
                color: "white"
              }
            },
            visualVariables: [
              {
                type: "color",
                field: "count",
                legendOptions: {
                  title: "% population in poverty by county"
                },
                stops: [{
                  value: 10,
                  color: [220,255,155,0.5],
                  label: "低于10人"
                }, {
                  value: 50,
                  color: [60,130,210,0.5],
                  label: "高于50人"
                }]
              }
            ]
          }
        })
        this.map.add(layer)

      },

      //风险场所
      async initHotSpotLayer(){

        const source = await this.getData({url: `${BASE_URL}/static/mock/hot-spots.json`})

        const labelClass = new LabelClass({
          symbol: {
            type: 'text',
            color: '#fff',
            haloColor: "#ff0f43",
            haloSize: 1,
            font: { size: 12, weight: "normal"}
          },
          // deconflictionStrategy: 'none',
          labelPlacement: 'above-center',
          labelExpressionInfo: {
            expression: `return $feature.name`
          }
        })

        const layer = new FeatureLayer({
          id: 'hotspot',
          title: "风险场所",
          opacity: 1,
          fields:[{
            name: "ObjectID",
            type: "string"
          },{
            name: "name",
            type: "string"
          },{
            name: "address",
            type: "string"
          }],
          outFields: ["*"],
          objectIdField: "ObjectID",
          geometryType: "point",
          source: [],
          popupTemplate: {
            title: "{name}",
            content: "{address}"
          },
          // labelingInfo: [labelClass],
          renderer : {
            type: "simple",
            symbol: {
              type: "simple-marker",
              size: 12,
              color: "#ff702a",
              outline: {
                width: 2,
                color: "white"
              }
            },
            visualVariables: [
              {
                //根据缩放程度调整尺寸
                type: "size",
                valueExpression: "$view.scale",
                stops: [
                  { value: 500000, size: 3 },
                  { value: 250000, size: 6 },
                  { value: 125000, size: 8 },
                  { value: 32000, size: 12 },
                ]
              }
            ]
          }
        })
        this.map.add(layer)

        layer.applyEdits({addFeatures: source}).then(results => {

          console.log(`deleteFeatures:${results.deleteFeatureResults.length}`)
          console.log(`addFeatures:${results.addFeatureResults.length}`)
        })

      },

      //卡口情况
      async initPoliceLayer(){

        const source = await this.getData({url: `${BASE_URL}/static/mock/police-spots.json`})

        const labelClass = new LabelClass({
          symbol: {
            type: 'text',
            color: '#fff',
            haloColor: "#3c88ff",
            haloSize: 1,
            font: { size: 12, weight: "normal"}
          },
          // deconflictionStrategy: 'none',
          labelPlacement: 'above-center',
          labelExpressionInfo: {
            expression: `return $feature.name + '警力'+ $feature.count +'人'`
          }
        })

        const layer = new FeatureLayer({
          id: 'police',
          title: "卡口分布",
          opacity: 1,
          fields:[{
            name: "ObjectID",
            type: "string"
          },{
            name: "count",
            type: "string"
          },{
            name: "count2",
            type: "string"
          },{
            name: "name",
            type: "string"
          }],
          outFields: ["*"],
          objectIdField: "ObjectID",
          spatialReference: SP,
          geometryType: "point",
          source: [],
          popupTemplate: {
            title: "{name}",
            content: function({graphic}){
              const {name, count, count2} = graphic.attributes
              return `警力:${count}人  ${count2 > 0 ? '保安:'+ count2+'人' :  '' }`
            }
          },
          // labelingInfo: [labelClass],
          renderer : {
            type: "simple",
            symbol: {
              type: "simple-marker",
              size: 12,
              color: "#5d71ff",
              outline: {
                width: 1,
                color: "white"
              }
            },
            visualVariables: [
              {
                //根据缩放程度调整尺寸
                type: "size",
                valueExpression: "$view.scale",
                stops: [
                  { value: 500000, size: 1 },
                  { value: 250000, size: 3 },
                  { value: 125000, size: 6 },
                  { value: 32000, size: 12 },
                ]
              }
            ]
          }
        })
        this.map.add(layer)

        layer.applyEdits({addFeatures: source}).then(results => {

          console.log(`deleteFeatures:${results.deleteFeatureResults.length}`)
          console.log(`addFeatures:${results.addFeatureResults.length}`)
        })
      },

      //确诊病例位置
      async initPatientLayer(){

        const source = await this.getData({url: `${BASE_URL}/static/mock/patient-spots.json`})

        const labelClass = new LabelClass({
          symbol: {
            type: 'text',
            color: '#fff',
            // haloColor: "#f00",
            // haloSize: 1,
            font: { size: 12, weight: "bold"}
          },
          deconflictionStrategy: 'none',
          labelPlacement: 'center-center',
          labelExpressionInfo: {
            expression: `return $feature.num+'人' `
          }
        })
        const labelClass2 = new LabelClass({
          symbol: {
            type: 'text',
            color: '#fff',
            haloColor: "#f00",
            haloSize: 1,
            font: { size: 12, weight: "normal"}
          },
          deconflictionStrategy: 'none',
          labelPlacement: 'above-center',
          labelExpressionInfo: {
            expression: `return $feature.address `
          }
        })

        const layer = new FeatureLayer({
          id: 'patient',
          title: "确诊病例位置",
          opacity: 1,
          fields:[{
            name: "ObjectID",
            type: "string"
          },{
            name: "id",
            type: "string"
          },{
            name: "address",
            type: "string"
          },{
            name: "num",
            type: "string"
          }],
          outFields: ["*"],
          objectIdField: "ObjectID",
          spatialReference: SP,
          geometryType: "point",
          source: [],
          labelingInfo: [labelClass],
          renderer : {
            type: "simple",
            symbol: {
              type: "simple-marker",
              size: 20,
              color: "#f00",
              outline: {
                width: 2,
                color: "white"
              }
            }
          }
        })
        this.map.add(layer)

        layer.applyEdits({addFeatures: source}).then(results => {

          console.log(`deleteFeatures:${results.deleteFeatureResults.length}`)
          console.log(`addFeatures:${results.addFeatureResults.length}`)
        })
      },

      //物资供应点
      initGoodsLayer(){
        const graphicsLayer = new GraphicsLayer({
          id: 'goods',
          title: '物资供应点'
        })
        this.map.add(graphicsLayer);

        this.drawPoylgon({
          type: 'polygon',
          layerId: 'goods',
          style:{borderWidth: 2, borderColor: '#FFFF00'},
          name: '珠江市场',
          attributes:{ status: '已关停'},
          color: [255, 255, 0, 0.2],
          paths: [[[66480.12723922638,182438.33074673818],[66505.52729002647,182427.21822451314],[66348.36447570084,182256.82621706245],[66326.13943125076,182276.40542288753],[66480.12723922638,182438.33074673818]]]
        })

        this.drawPoylgon({
          type: 'polygon',
          layerId: 'goods',
          style:{borderWidth: 2, borderColor: '#FFFF00'},
          name: '万顷沙市场',
          attributes:{ status: '已关停'},
          color: [255, 255, 0, 0.2],
          paths: [[[67093.43263250323,183283.6761874291],[67144.76190182845,183332.8887858543],[67201.91201612867,183272.03449747906],[67152.69941770346,183222.29273132887],[67093.43263250323,183283.6761874291]]]
        })


        this.drawPoylgon({
          type: 'polygon',
          layerId: 'goods',
          style:{borderWidth: 2, borderColor: '#FFFF00'},
          name: '金誉综合市场',
          attributes:{  status: '已关停'},
          color: [255, 255, 0, 0.2],
          paths: [[[66301.79771590033,182362.92434592568],[66382.23121010067,182446.532846476],[66401.81041592573,182430.12864700094],[66319.2602508254,182346.5201464506],[66301.79771590033,182362.92434592568]]]
        })

        this.drawMaker({
          layerId: 'goods',
          attributes:{status:'正在运行'},
          name: '珠江街封控管理物资保障中心', //金誉综合市场门口
          style:{ color:'#29bc2c', shape: 'square'},
          coodinate: {x: 66361.06450110064, y: 182386.7368935508}
        })


        this.drawMaker({
          layerId: 'goods',
          attributes:{status:'正在运行'},
          name: '物资保障瑞光分中心', //珠江中学附近
          style:{ color:'#29bc2c', shape: 'square'},
          coodinate: {x: 66602.10039983911, y: 182472.46206500125}
        })


        this.drawMaker({
          layerId: 'goods',
          attributes:{status:'正在运行'},
          name: '珠江街生活物资供应站', //万顷沙市场门口
          style:{ color:'#29bc2c', shape: 'square'},
          coodinate: { x: 67174.9244621539, y: 183304.84289642944 }
        })


      },

      //摄像头图层
      async initCameraLayer(){

        const uniqueValueInfos = getUniqueValueInfos('DeviceMap')

        //普通摄像头
        this.videoList = await this.getVideoListData()

        const source = this.videoList.map(item=>{
          return new Graphic({
            geometry: {
              type: 'point',
              longitude: item.gz2000coordinate[0],
              latitude: item.gz2000coordinate[1],
              spatialReference: SP //必要
            },
            attributes: item
          })
        })


        const layer = new FeatureLayer({
          id: 'camera',
          title: "摄像头图层",
          opacity: 1,
          fields: [
            {
              name: "ObjectID",
              type: "string"
            },{
              name: "deviceUid",
              type: "string"
            }, {
              name: "id",
              type: "string"
            }, {
              name: "deviceType",
              type: "string"
            }, {
              name: "deviceName",
              type: "string"
            },{
              name: "livePlayUrl",
              type: "string"
            }
          ],
          outFields: ["*"],
          objectIdField: "ObjectID",
          geometryType: "point",
          source: [],
          // popupTemplate: {
          //   title: "{deviceName}",
          //   content: "{address}"
          // },
          renderer : {
            type: "unique-value",
            valueExpression: `return $feature.deviceType`,
            uniqueValueInfos,
            visualVariables: [
              {
                //根据缩放程度调整尺寸
                type: "size",
                valueExpression: "$view.scale",
                stops: [
                  { value: 500000, size: 6 },
                  { value: 250000, size: 10 },
                  { value: 125000, size: 15 },
                  { value: 32000, size: 20 },
                ]
              }
            ]
          }

        })

        this.map.add(layer)

        layer.applyEdits({addFeatures: source}).then(results => {

          console.log(`deleteFeatures:${results.deleteFeatureResults.length}`)
          console.log(`addFeatures:${results.addFeatureResults.length}`)
        })
      },

      //基层党组织
      async initPartyLayer(){

        const source = await this.getData({url: `${BASE_URL}/static/mock/party-spots.json`})

        const labelClass = new LabelClass({
          symbol: {
            type: 'text',
            color: '#fff',
            haloColor: "#ff0f43",
            haloSize: 1,
            font: { size: 12, weight: "normal"}
          },
          // deconflictionStrategy: 'none',
          labelPlacement: 'above-center',
          labelExpressionInfo: {
            expression: `return $feature.name`
          }
        })

        const layer = new FeatureLayer({
          id: 'party',
          title: "风险场所",
          opacity: 1,
          fields:[{
            name: "ObjectID",
            type: "string"
          },{
            name: "name",
            type: "string"
          },{
            name: "address",
            type: "string"
          },{
            name: "manager",
            type: "string"
          },
            {
            name: "num",
            type: "string"
          },{
            name: "telephone",
            type: "string"
          },
          {
            name: "type",
            type: "string"
          }
          ],
          outFields: ["*"],
          objectIdField: "ObjectID",
          geometryType: "point",
          source: source,
          popupTemplate: {
            title: "{name}",
            content: "地址：{address}"+"<br/>"
                    +"党组织类型：{type}"+"<br/>"
                    +"党组织书记：{manager}"+"<br/>"
                    +"联系电话：{telephone}"+"<br/>"
                    +"党员数：{num}"+"<br/>"

          },
          renderer : {
            type: "unique-value",
            valueExpression: `return "party"`,
            uniqueValueInfos: [
                {
                  symbol: {type: "picture-marker", url: `${BASE_URL}/static/images/svg/party.svg`},
                  value: "party"
                }
              ],
            visualVariables: [
              {
                //根据缩放程度调整尺寸
                type: "size",
                valueExpression: "$view.scale",
                stops: [
                  { value: 500000, size: 6 },
                  { value: 250000, size: 10 },
                  { value: 125000, size: 15 },
                  { value: 32000, size: 20 },
                ]
              }
            ]
          }
        })
        this.map.add(layer)

      },

      async getData({url}){
        const res = await axios.get(url)
        const data = res.data.data
        const arr = []
        data.forEach(item => {
          //过滤没有坐标的数据
          if (!item.gz2000coordinate || item.gz2000coordinate.length < 2) {
            return
          }
          arr.push(new Graphic({
            geometry: {
              type: 'point',
              latitude: item.gz2000coordinate[1],
              longitude: item.gz2000coordinate[0],
              spatialReference: SP //必要
            },
            attributes: item
          }))
        })

        return arr
      },

      async getVideoListData(){
        //普通摄像头
        var res = await getVideoLayerList()
        let data = res.map(item=>{
          const {deviceUid, deviceName, gz2000Location,id} = item
          return {
            gz2000coordinate: [ gz2000Location.latitude, gz2000Location.longitude],//接口返回数据lng和lat反了，前端修正
            deviceType: 'camera',
            deviceUid,
            deviceName,
            id
          }
        })

        //高点摄像头
        var res2 = await getHDVideoLayerList()

        let hdData = res2.map(item=>{
          const {deviceUid, deviceName, gz2000Location, id} = item

          const props = {}
          Object.values(item.propertyValueMap).forEach(item => {
            props[item.propCode] = item.propValue
          })

          return Object.assign({
            gz2000coordinate: [gz2000Location.latitude, gz2000Location.longitude], //接口返回数据lng和lat反了，前端修正
            deviceType: 'hcamera',
            deviceUid,
            deviceName: '高点摄像头',
            id
          }, props)
        })

        return [...data, ...hdData]

      },

      //门磁监控图层
      async initDoorLayer(){

        const source = await this.getDoorData()

        const labelClass = new LabelClass({
          symbol: {
            type: 'text',
            color: '#fff',
            haloColor: "#ff0f43",
            haloSize: 1,
            font: { size: 12, weight: "normal"}
          },
          // deconflictionStrategy: 'none',
          labelPlacement: 'above-center',
          labelExpressionInfo: {
            expression: `return $feature.count`
          }
        })
        const layer = new FeatureLayer({
          id: 'door' + this.doorType,
          title: "门磁监控",
          opacity: 1,
          fields:[{
            name: "ObjectID",
            type: "string"
          },{
            name: "count",
            type: "string"
          },{
            name: "name",
            type: "string"
          }],
          outFields: ["*"],
          objectIdField: "ObjectID",
          geometryType: "point",
          source,
          // popupTemplate: {
          //   title: "{name}",
          //   content: "{address}"
          // },
          // labelingInfo: [labelClass],
          renderer : {
            type: "simple",
            // valueExpression: `return "door"`,
            // uniqueValueInfos: [
            //   {
            //     symbol: {type: "picture-marker", url: `${BASE_URL}/static/images/svg/door.svg`},
            //     value: "door"
            //   }
            // ],
            symbol: {
              type: "picture-marker",
              url: `${BASE_URL}/static/images/svg/door.svg`
            },
            visualVariables: [
              {
                //根据缩放程度调整尺寸
                type: "size",
                valueExpression: "$view.scale",
                stops: [
                  { value: 500000, size: 6 },
                  { value: 250000, size: 10 },
                  { value: 125000, size: 15 },
                  { value: 32000, size: 20 },
                ]
              }
            ]
          }
        })
        this.map.add(layer)
      },
      // 获取门磁数据
      async getDoorData(){
        const res = await (this.doorType === 2 ? getDoorListByAlarm({}) : getDoorList({}))
        console.log('获取门磁数据', res)
        this.doorList = res
        const arr =  Object.keys(res).map(key=>{
          let item = res[key]
          let itemFormat = {}
          itemFormat.name =  key
          itemFormat.count = item.length
          return new Graphic({
            geometry: {
              type: 'point',
              latitude: item[0].gz2000 && item[0].gz2000.length ? item[0].gz2000[1] : '',
              // latitude: 182288.16384018213,
              longitude: item[0].gz2000 && item[0].gz2000.length ? item[0].gz2000[0] : '',
              // longitude: 66493.30226077186,
              spatialReference: SP //必要
            },
            attributes: itemFormat
          })
        })
        //
        return arr
      },
      getDoorTotalCount () {
        getDoorAlarmCount ({}).then(res => {
          console.log('门磁统计数',res)
          let current = this.layerList.find(v => v.id === 'door')
          current.arrowList[1].total = res.total
          current.arrowList[0].total = res.alarm
        })
      },

      //摄像头列表显示隐藏
      viewList(){
        this.viewVideoList.active = !this.viewVideoList.active
        this.cameraListVisible = !this.cameraListVisible
      },

      viewCamera(item){
        console.log(item)
        this.deviceInfo = item
        this.deviceVisible = true
      },

      showGoodsTable(event) {

        event.stopPropagation()
        event.preventDefault()

        this.goodsDetailVisible = true
      },
      handleClickArrowItem (item, index) {
        var layer = this.map.findLayerById(this.layerList[index].id + item.id)
        var otherLayer = this.map.findLayerById(this.layerList[index].id + ((item.id === 1) ? 2 : 1))
        if (this.doorType === item.id) {
          this.doorType = ''
          this.layerList[index].active = false
          if(layer){
            layer.visible = false
          }
        }else {
          this.layerList[index].active = true
          this.doorType = item.id
          if (otherLayer) {
            otherLayer.visible = false
          }
          if(layer){
            layer.visible = true
          }else {
            this.initDoorLayer()
          }
        }
      }

    }
  }
</script>

<style lang="scss" type="text/scss">
  .esri-popup__header-title{
    color:#fff;
    font-size: 16px;
  }
  .esri-widget__table tr td,
  .esri-widget__table tr th{
    font-size: 16px !important;
  }
  .arcgis-layer{
    position: fixed;
    top:60px;
    left:0;
    right:0;
    bottom:0;
    z-index: 1;
    background-color: #021144;

    .viewDiv{
      position: absolute;
      top:0;
      left:0;
      height: 100%;
      width: 100%;
    }

    .layer-list{

      position: absolute;
      left: 60px;
      bottom: 6em;
      .rbtn{
        margin: .5em 0;
        position: relative;
        box-sizing: border-box;
        border: 10px solid;
        border-image: url('~@/assets/image/community/rect-btn.png') 10;
        color: #fff;
        background: transparent;
        min-width: 170px;
        cursor: pointer;
        opacity: 0.7;
        &:before{
          @include adaptBox(#0f286a);
        }
        .rbtn-right-wrapper {
          position: absolute;
          left: 180px;
          top: 0;
          width: 200px;
          &::after {
            content: '';
          }
          ::after {
            content: '';
          }
        }
        .rbtn-right-item {
          padding: 12px 20px;
          border-radius: 6px;
          margin-bottom: 10px;
          background-color: #0f286a;
          position: relative;
          >span {
            padding-left: 6px;
          }
          &.active {
            &::after {
              content: '';
              position: absolute;
              top: 18px;
              left: 10px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: #fff;
              z-index: 99;
            }
          }
        }
        .rbtn-right-item:first-child {
          padding-bottom: 10px;
        }
        .rbtn-label{
          position: relative;
          width: 100%;
          box-sizing: border-box;
          padding: 0 2em;
          z-index: 1;
          color: #fff;
        }

        &:hover{
          opacity: 1;
        }

        &.active::after{
          content:'';
          position: absolute;
          top:4px;
          left: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #fff;
          z-index: 99;
        }

        .ico{
          position: absolute;
          top:4px;
          right:6px;
          cursor: pointer;
          z-index: 5;
        }

      }

      .arrow{

        ::after{
          content: '>>';
          right: 2px;
          bottom: 0px;
          font-size: 16px;
          position:absolute
        }

      }
    }

    .camera-list{
      position: absolute;
      left: 18em;
      bottom: 6.5em;
      z-index: 3;
      overflow-y: scroll;
      max-height: 36em;
      box-sizing: border-box;
      border: 10px solid;
      background-color: #0f286a;
      opacity: 0.9;
      border-image: url('~@/assets/image/community/rect-btn.png') 10;
      .item{
        padding: .5em 0;
        position: relative;
        color: #fff;
        background-color: #0f286a;
        min-width: 170px;
        cursor: pointer;
        opacity: 0.7;

        span{
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 0 2em;

          border:1px solid #0f286a;
          z-index: -1;
        }

        &:hover{
          opacity: 1;
        }

        &.active::after{
          content:'';
          position: absolute;
          top:4px;
          left: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #fff;
          z-index: 99;
        }

      }
    }
    .map-point-tip{
      position: absolute;
      top:-9999px;
      left: -9999px;
      padding: .4em ;
      border-radius: 4px;
      background-color: #0f286a;
      transition: all .3s;
      color: #fff;
      font-size: 14px;
      max-width: 220px;
    }

  }
</style>
