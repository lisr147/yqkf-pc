<template>
  <div id="china_map_box">
    <div id="china_map"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import 'echarts/map/js/china.js'
import './guangzhou.js'

export default {
  props: {
    ranking: {type: Array},
    msg: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  watch: {
    ranking: {
      handler(val) {
        this.ranking = val
        this.$nextTick(() => {
          this.initEchartMap();
        })
      },
      deep: true,
    },
    msg: {
      handler(val) {
        if(val.riskLevel===3){
          this.currentMap = 'GZ'
        }else {
          this.currentMap = 'china'
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      currentMap:'china',
      currentZoom:1.2
    };
  },
  methods: {
    //初始化中国地图
    initEchartMap() {
      let mapDiv = document.getElementById('china_map');
      let myChart = echarts.init(mapDiv);
      let series = [];
      let mapData = this.ranking.map((v) => {
        return {
          name: (v.sourceName.includes('市辖区') ? v.sourceName.split('/')[0] : v.sourceName.split('/')[1]) || v.sourceName,
          lngLat: [v.longitude, v.latitude],
          value: v.totalNum
        }
      })
      mapData.push({
        name: '南沙区',
        lngLat: [113.53087166137296, 22.786225017542733],
        value: mapData[0] ? mapData[0].value : 0
      })
      let obj = {}
      for (let i = 0; i < mapData.length; i++) {
        obj[mapData[i].name] = mapData[i].lngLat
      }
      let NSData = mapData
      let geoCoordMap = obj
      let convertData = (data) => {
        let res = [];
        for (let i = 0; i < data.length; i++) {
          let dataItem = data[i];
          let fromCoord = geoCoordMap[dataItem.name];
          let toCoord = [113.53087166137296, 22.786225017542733]; //南沙
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem.name,
              toName: '南沙区',
              coords: [fromCoord, toCoord]
            });
          }
        }
        return res;
      };
      let color = ['#aade23', '#ffa022', '#e57d21'];
      [
        ['南沙区', NSData]
      ].forEach((item, i) => {
        series.push(
            {
              type: 'lines',
              zlevel: 1,
              effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
              },
              lineStyle: {
                normal: {
                  color: color[i],
                  width: 0,
                  curveness: 0.2
                }
              },
              data: convertData(item[1])
            },
            {
              type: 'lines',
              zlevel: 2,
              symbol: ['none', 'arrow'],
              symbolSize: 10,
              effect: {
                show: true,
                period: 6,
                trailLength: 0,
                // symbol: 'circle',
                symbolSize: 5
              },
              lineStyle: {
                color: color[i],
                width: 1,
                opacity: 0.5,
                curveness: 0.2
              },
              data: convertData(item[1])
            },
            {  // 目的地信息
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke'
              },
              label: {
                show: true,
                position: 'right',
                formatter: '{b}'
              },
              symbolSize: (val) => {
                if (val[2] > 10000) {
                  return 12
                } else if (val[2] < 100) {
                  return 4
                } else {
                  return 8;
                }
              },
              itemStyle: {
                color: '#e81c1c',
              },
              data: item[1].map(function (dataItem) {
                return {
                  name: dataItem.name,
                  value: geoCoordMap[dataItem.name].concat([dataItem.value])
                };
              })
            }
        );
      });
      let options = {
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#121B55' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#25569C' // 100% 处的颜色
          }]
        },
        visualMap: { //图例值控制
          min: 0,
          max: 10000,
          calculable: true,
          show: false,
          color: ['#e23019', '#f38506', '#fc9700','#d2ba1b', '#ffde00'],
          textStyle: {
            color: '#1e84d9'
          },
        },
        geo: {
          map: this.currentMap,
          zoom: this.currentZoom,
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true, //是否允许缩放
          itemStyle: {
            normal: {
              borderColor: '#2581D1',
              borderWidth: 1,
              color: '#0F2662', //地图背景色
            },
            emphasis: {
              color: 'rgba(37, 43, 61, .5)' //悬浮背景
            }
          }
        },
        series: series
      };
      myChart.setOption(options);
    },

  },
  mounted() {
    this.$nextTick(() => {
      this.initEchartMap();
    })
  }
};
</script>

<style scoped>
#china_map_box {
  height: 100%;
  position: relative;
}

#china_map_box #china_map {
  height: 100%;
}

#china_map_box .china_map_logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 45px;
}
</style>
<style>
#china_map .tooltip_style {
  line-height: 1.7;
  overflow: hidden;
}

#china_map .tooltip_left {
  float: left;
}

#china_map .tooltip_right {
  float: right;
}

</style>
