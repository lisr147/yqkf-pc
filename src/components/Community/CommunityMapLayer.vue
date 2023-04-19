<template>
  <div class="community-map-layer">
    <div id="viewDiv" ref="dom" class="container"></div>

    <!--<div style="position: fixed;bottom:2em;left: 5em; z-index: 999;display: none;">-->
      <!--<button @click="save">存入(s)</button>-->
      <!--<button @click="undo">撤回(b)</button>-->
      <!--<button @click="clearMap">清空(c)</button>-->
      <!--<button @click="exportData">导出数据(e)</button>-->
      <!--<button @click="importData">请求数据(i)</button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import 'leaflet/dist/leaflet.css'
  import * as L from 'leaflet'
  import {antPath} from 'leaflet-ant-path'
  import axios from 'axios'

  export default {
    name: "CommunityMapLayer",
    components: {},
    props: {
      layerVisible: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        map: null,
        //地图地址
        src: `${process.env.NODE_ENV === 'production' ? '/yqfk' : process.env.BASE_URL}/static/map/jiaan.jpg`,

        polygons: [],

        polygonData: [], //[{coordinate:[],name:'嘉顺九街1',id:'j0901'}]
        currPath:[],
      }
    },
    watch:{
      layerVisible(val) {
        if (val) {
          this.importData()
        } else {
          this.clearMap()
        }
      }
    },
    mounted() {
      this.initMap()
      this.importData()
      // this.initBind()
    },
    methods: {

      initMap(){
        this.map = L.map(this.$refs['dom'], {
          crs: L.CRS.Simple,
          zoom: 2,
          minZoom: 1,
          maxZoom: 4,
          center: [190, 308],
          attributionControl: false,
          zoomControl: false
        })

        //规定地图区域大小xy轴[左上,右下]
        var bounds = [[0,0], [360, 640]];
        L.imageOverlay(this.src, bounds).addTo(this.map)

        // this.map.on('zoomend', (e) => {
        //   console.log(`zoomend: ${this.map.getZoom()}`)
        // })

        // this.map.on('click',(e)=>{
        //   console.log(`click: ${e.latlng}`)
        //   const {lng, lat} = e.latlng
        //   this.currPath.push([lat, lng])
        //   this.drawCurrPath()
        //
        // })

      },

      //渲染建筑
      renderBuildings() {

        this.polygonData.forEach(item => {

          const {coordinate, id, name} = item

          var polygon = L.polygon(coordinate, {
            opacity: 0.8,
            fillColor: '#33e732',
            fillOpacity: 0.4,
            color:'#fff'
          }).bindTooltip(name)

          polygon.on('click',(e)=>{
            this.choosePolygon({name, id})
          })

          polygon.addTo(this.map)
          this.polygons.push(polygon)

        })

      },

      choosePolygon(event) {
        this.$emit('choosed', event)
      },

      //清空地图覆盖物
      clearMap() {
        this.polygons.forEach(item => {
          item.remove()
        })
        if (this.currLine) {
          this.currLine.remove()
          this.currPath = []
        }
      },

      //请求数据
      async importData(){

        if (this.polygonData.length <= 0) {
          const res = await axios.get(`${process.env.NODE_ENV === 'production' ? '/yqfk' : process.env.BASE_URL}/static/mock/jiaan.json`)
          this.polygonData = res.data.data
        }

        this.clearMap()
        this.renderBuildings()
      },

      //-------------------------------------------debug-------------------------------------------------

      initBind(){
        document.addEventListener('keyup',(e)=>{
          console.log(e.which)

          switch(e.which){
            case 83:
              //存入
              this.save()
              break;
            case 66:
              this.undo()
              //撤回
              break;
            case 101:
              this.exportData()
              //导出数据
              break;
          }
        })
      },

      exportData(){
        console.log(JSON.stringify(this.polygonData))
      },

      save(){

        this.$prompt('请输入楼栋名称,比如A街B栋为A_B', '提示',{inputValue:'嘉顺*街*栋'}).then(({value})=>{

          let coordinate = [...this.currPath]
          var newPolygon = {id: parseInt(Math.random()*100000), name: value, coordinate}
          console.log(newPolygon)

          this.polygonData.push(newPolygon)
          this.currPath = []
          this.clearMap()
          this.renderBuildings()

          if (this.currLine) {
            this.currLine.remove()
            this.currLine = null
          }


          //本地缓存数据
          localStorage.setItem('polygonData', JSON.stringify(this.polygonData))

        }).catch(()=>{
          //点击了取消
        })

      },

      undo(){
        this.currPath.pop()
        this.drawCurrPath()
      },

      drawCurrPath(){
        if (this.currLine) {
          this.currLine.remove()
          this.currLine = null
        }
        this.currLine = antPath(this.currPath, {
          "delay": 100,
          "dashArray": [5, 10],
          "weight": 3,
          "color": '#f00',
          "pulseColor": "#fff",
        })
        this.currLine.addTo(this.map)
      }

    }
  }
</script>

<style lang="scss" type="text/scss">
  path{
    stroke-opacity: 1;
  }
</style>

<style lang="scss" type="text/scss">
.community-map-layer{
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  height:100%;


  .container{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #001244;
  }
}
</style>
