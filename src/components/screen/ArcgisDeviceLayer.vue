<template>
  <div class="arcgis-device-layer" v-show="visible">
    <div class="viewDiv"  ref="viewDiv"></div>

    <door-list v-model="doorListVisible" :data="currentDoor"></door-list>
  </div>
</template>

<script>
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
  import {getDoorList} from '@/api/mapData'
  import DoorList from "@/components/door/DoorList";
  const SP = new SpatialReference({
    //影像, wkt的值不能擅自换行
    wkt: `PROJCS["GUANGZHOU2000",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["false_easting",0.0],PARAMETER["false_northing",0.0],PARAMETER["central_meridian",113.28],PARAMETER["scale_factor",1.0],PARAMETER["latitude_of_origin",0.0],UNIT["Meter",1.0]]`
  })

  export default {
    name: 'ArcgisDeviceLayer',
    components: {
      DoorList
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
        },
        immediate: true
      }
    },
    data() {
      return {
        view: null,
        map: null,
        doorList: {},
        doorListVisible: false,
        currentDoor: {} //当前点击的门磁
      }
    },
    mounted() {
    },
    methods: {
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
        })
        //视图
        const _view = new MapView({
          map: _map,
          container: this.$refs['viewDiv'],
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

        _view.on('click',(event)=>{

          _view.hitTest(event).then(res => {

            const results = res.results
            if (results.length && results[0].graphic) {
              // debugger
              //从这里可以取到设备id
              console.log('接口中的设备信息',results[0].graphic.attributes.name,this.doorList[results[0].graphic.attributes.name])
              this.currentDoor = {
                data: this.doorList[results[0].graphic.attributes.name],
                name: results[0].graphic.attributes.name
              }
              this.doorListVisible = true
            }
          })
        })

        //图层列表用于调试
        var layerList = new LayerList({
          view: _view
        })
        _view.ui.add(layerList, {
          position: 'bottom-left'
        })

        //管控区域
        this.initBaseLayer()
        this.initDoorLayer()
        // yqfk项目 本地环境执行以下内容会报未知错误，
        // 只能在其他工程下调试
        if (process.env.NODE_ENV === 'production') {
          this.initDoorLayer()
        }

      },

      initBaseLayer(){

        const graphicsLayer = new GraphicsLayer({
          id: 'base',
          title: '管控区域'
        })
        this.map.add(graphicsLayer);

        this.drawPoylgon({
          name: '珠江街区域',
          color: [60, 136, 255, 0.2],
          paths: [[[64289.372857717324,182235.3949242002],[64564.540074718425,182527.49550840136],[64649.20691071876,182519.02882480132],[65169.90795212084,183145.56341120382],[65182.60797752089,183209.0635382041],[65305.374889721366,183331.83045040446],[65347.708307721536,183327.59710860444],[66342.54363072551,184394.39924220872],[65953.076185124,184690.73316821002],[67464.37920773005,186413.7032808169],[68751.31511493519,185262.2343112122],[69356.68299233762,184606.0663322096],[69978.98423694012,183708.59787060594],[70402.31841694178,182451.29535600092],[69263.54947273718,181320.99309539632],[69216.982712937,181359.09317159647],[68315.2809095334,180415.05795019268],[69157.71592773673,179521.8228303891],[68103.61381953252,178438.08732958479],[67341.61229552947,179356.72250018845],[67494.01260033008,179551.45622298925],[66185.90998412485,181486.0934255971],[65826.07593112341,180982.325751395],[64289.372857717324,182235.3949242002]]]
        })
        this.drawPoylgon({
          name: '嘉安花园',
          color: [255, 46, 33, 0.2],
          paths: [[[64280.906174117285,182239.62826600016],[64564.540074718425,182527.4955084013],[64653.440252518776,182531.72885020133],[65174.14129392086,183158.26343660383],[65178.37463572088,183204.83019640401],[65250.34144632117,183272.5636652043],[66113.94317352462,182404.72859620082],[65542.44203052233,181718.92722459807],[65737.17575332311,181511.49347639724],[65500.10861252216,181249.0262847962],[64280.906174117285,182239.62826600016]]]
        })
        this.drawLabel({
          text: '嘉安花园1',
          style: { color: '#3266ff'},
          coodinate: {
            x: 65131.80787592074,
            y: 182377.2118745007
          }
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
          style: { color: '#ff702a', fontSize: 12},
          coodinate: {
            x: 66079.01810367446,
            y: 182256.56163320033}
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
          style: { color: '#ff0000'},
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
          style: { color: '#3266ff',fontSize: 12, yoffset: 12},
          coodinate: {x:65961.54286872395, y: 184724.59990261015}
        })
        this.drawMaker({
          name: '南出入口',
          style:{icon: 'svg/inout.svg',},
          coodinate: {x: 67407.22909342978, y: 181267.0179874463}
        })
        this.drawLabel({
          text: '南出入口',
          style: { color: '#3266ff',fontSize: 12, yoffset: 12},
          coodinate: {x: 67407.22909342978, y: 181267.0179874463}
        })

      },

      //绘制多边形
      drawPoylgon({paths, style={}, color = [60, 136, 255, 0.2], layerId = 'base'}) {

        const polyline = {
          type: "polyline",
          paths,
          spatialReference: SP
        }
        const lineSymbol = {
          type: "simple-fill",
          color,
          style: "solid",
          outline: {
            color: style.borderColor || '#FF2E21',
            width: style.borderWidth || 4,
          },
        }
        const boundary = new Graphic({
          geometry: polyline,
          symbol: lineSymbol,
          attributes: {}
        });
        this.map.findLayerById(layerId).add(boundary);
      },

      //绘制文字
      drawLabel({text = '文字内容', style = {}, coodinate = {}} = {}) {

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
            font:{
              size: style.fontSize||16
            },
            text
          },
        })

        this.map.findLayerById('base').add(label);
      },

      //绘制图形
      drawMaker({style = {}, name, coodinate = {}, attributes={}} = {}){

        attributes.name = name

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

        const marker = new Graphic({
          geometry: {
            type: "point",
            x: coodinate.x,
            y: coodinate.y,
            spatialReference: SP
          },
          attributes,
          popupTemplate:{
            title:'物资供应点',
            content: [{
              type: "fields",
              fieldInfos: [{
                fieldName: "name",
                label: "名称"
              }, {
                fieldName: "status",
                label: "状态"
              }]
            }]
          },
          symbol,
        })
        this.map.findLayerById('base').add(marker);
      },

      //门磁监控图层
      async initDoorLayer(){

        const source = await this.getData()

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
            expression: `return $feature.name + ' ' + $feature.count + '户'`
          }
        })
        const layer = new FeatureLayer({
          id: 'door',
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
          labelingInfo: [labelClass],
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
      },

      async getData(){
        const res = await  getDoorList({})
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
      }



    }
  }
</script>

<style lang="scss" type="text/scss">
  .arcgis-device-layer {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: #021144;

    .viewDiv {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }
</style>
