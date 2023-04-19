<template>
  <div class="ns">
    <div class="container" ref="dom"></div>

    <div class="mode-list">
      <div class="item" :class="{active: index == mode}" v-for="(item,index) in modeList"  :key="index" @click="toggle(index)">{{item.name}}</div>
    </div>

  </div>
</template>

<script>
  import SpatialReference from '@arcgis/core/geometry/SpatialReference'
  import TileLayer from '@arcgis/core/layers/TileLayer'
  import MapImageLayer from '@arcgis/core/layers/MapImageLayer'

  import Map from '@arcgis/core/Map'
  import MapView from '@arcgis/core/views/MapView'
  import LayerList from '@arcgis/core/widgets/LayerList'
  import Point from '@arcgis/core/geometry/Point'

  let layerNSWX = new TileLayer({
    url: `${process.env.VUE_APP_MAP_API}/arcgis/rest/services/yxt/yxt2020/MapServer`,
    title: '卫星影像["Transverse_Mercator"]',
    id: 'gz-nswx',
    opacity: 1,
  })

  let layerNSZW = new TileLayer({
    url: `${process.env.VUE_APP_MAP_API}/arcgis/rest/services/dzdt/dzdt2000/MapServer`,
    title: '电子政务["Gauss_Kruger"]',
    id: 'gz-ns',
    opacity: 1,
    // effect: 'sepia(90%) invert(90%)'
  })

  let layerKG = new MapImageLayer({
    url: `${process.env.VUE_APP_MAP_API}/arcgis/rest/services/konggui/%E6%8E%A7%E8%A7%84%E5%9C%B0%E5%9D%97%E5%AF%BC%E5%88%99202103%E8%B0%83%E6%95%B4%E7%89%B9%E5%AE%9A%E7%89%88/MapServer`,
    title: '控规地块导则202103调整特定版',
    id: 'gz-kg',
    opacity: 0.8,
    visible: true
  })


  const SP_WX =  new SpatialReference({
    //影像, wkt的值不能擅自换行
    wkt: `PROJCS["GUANGZHOU2000",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["false_easting",0.0],PARAMETER["false_northing",0.0],PARAMETER["central_meridian",113.28],PARAMETER["scale_factor",1.0],PARAMETER["latitude_of_origin",0.0],UNIT["Meter",1.0]]`
  })

  const SP_ZW =  new SpatialReference({
    //政务, wkt的值不能擅自换行
    wkt: `PROJCS["GUANGZHOU2000",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.28],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]`
  })


  export default {
    name: 'NS',
    components: {},
    data () {
      return {
        map: null,
        view: null,
        modeList: [
          {
            name: '影像+控规',
            sp: SP_WX,
            layers: [layerNSWX, layerKG]
          },{
            name: '政务+控规',
            sp: SP_ZW,
            layers: [layerNSZW, layerKG]
          }
        ]
      }
    },
    computed:{
      mode(){
        return this.$route.query.mode == 1 ? 1 : 0
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {

        const {sp, layers } = this.modeList[this.mode]

        //平面地图
        this.map = new Map({
          layers: layers
        })

        //视图
        this.view = new MapView({
          map: this.map,
          container: this.$refs['dom'],
          center:  new Point({
            x: 54810.07389911926,
            y: 192729.84924644174,
            spatialReference: sp
          }),
          zoom: 2,
          background: {
            color: "#0d293e"
          }
        })

        //图层列表
        var layerList = new LayerList({
          view: this.view
        })
        this.view.ui.add(layerList, {
          position: 'bottom-left'
        })

      },
      toggle () {
        const mode = this.mode == 1? 0: 1;
        this.$router.push({ path: '/ns', query: { mode} })
        location.reload()
      }

    }
  }
</script>

<style lang="scss" type="text/scss">
  .esri-ui-top-left{
    display: none;
  }
  .ns {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;

    .container{
      position: relative;
      height: 100%;
    }

    .mode-list{
      position: absolute;
      top:2em;
      left: 1em;

      .item{
        padding: .5em 1em;
        background-color: #fff;
        cursor: pointer;

        &.active,
        &:hover{
          background-color: #2f89ef;
          color: #fff;
        }
      }
    }
  }
</style>
