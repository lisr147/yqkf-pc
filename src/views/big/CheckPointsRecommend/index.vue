<template>
  <div class="check-points-recommend">
    <div class="radar">
      <check-points-map ref="checkPointsMap" @layersReady="perform"></check-points-map>
      <canvas width="300" height="300" ref="canvas" class="canvas"></canvas>
      <div class="tip">{{tip}}</div>
    </div>
    <div class="list">
      <div class="list-toolbar">
        <span class="time">{{currDate}}</span>
        <el-button size="mini" type="primary" @click="exportData">导出</el-button>
      </div>

      <div class="staff_table">
        <el-table
          v-loading="loading"
          :element-loading-text="tip"
          element-loading-background="rgba(0, 0, 0, 0.2)"
          height="480"
          empty-text=" "
          :data="dataList"
          class="staff_table"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="核酸采样点名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="sszj"
            label="所属镇街"
            width="80">
          </el-table-column>
          <el-table-column
            prop="people"
            align="center"
            label="附近2公里的风险人员数量(人)">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="采样规模(人)"
            align="center"
            width="100">
          </el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>

<script>
  import CheckPointsMap from "./CheckPointsMap"
  import {exportCheckPoints, getCheckPoints} from '@/api/mapData'
  import {formatDate} from '@/utils/common'

  export default {
    name: "CheckPointsRecommend",
    components: {CheckPointsMap},
    data() {
      return {
        //雷达画布
        canvas: null,
        //旋转角度
        angle: 0,

        //推荐核酸点列表
        dataList: [],
        //数据加载中
        loading: true,
        //扫描进度
        tip: '正在准备中...',

        currDate: formatDate(new Date()),

        isScanning: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {

      async getData(){

        const params = {
          condition: {
            date: this.currDate,
            nucleicAcidExportShowDTO: {
              contact: "1",
              hm: "1",
              person: "1"
            }
          },
          page: 1,
          pageSize: 99
        }

        const {data} = await getCheckPoints(params)
        const arr = data.map(item => {
          const {totalNum, cygm, hsjcdmc, latitude, longitude, sszj} = item
          return {
            sszj,
            name: hsjcdmc,
            amount: cygm,
            people: totalNum,
            latitude,
            longitude
          }
        })

        return arr
      },

      async perform(){

        this.loading = true
        let data = await this.getData()
        this.loading = false
        //   console.log('perform', data)

        const itemLen = Math.floor(data.length / 5)||1
        let count = 0
          let clock = setInterval(() => {
          if (data.length > 0) {
            let arr = data.splice(0, itemLen)
            arr.forEach(v => {
              v.lngLat = [v.longitude, v.latitude]
            })
            if (this.$refs['checkPointsMap']) {
              this.$refs['checkPointsMap'].addToLayer(arr)
            }
            setTimeout(() => {
              this.tip = `正在扫描数据${new Array(count).fill(' .').join('')}`
                this.dataList = [...this.dataList, ...arr]
                // console.log('this.dataList', this.dataList, arr, data)
              count++
            }, 500)
            this.isScanning = true
          } else {
            clearInterval(clock)
            this.tip = '已完成扫描'
            this.isScanning = false
          }
        }, 1000)
      },


      init(){
        this.canvas = this.$refs['canvas']
        const {width} = getComputedStyle(this.canvas.parentElement)
        this.canvas.setAttribute('width', width)
        this.canvas.setAttribute('height', width)
        this.updateRadar()
      },

      updateRadar(){
        this.drawRadar()
        this.angle += 0.03
        window.requestAnimationFrame(this.updateRadar)
      },

      //绘制雷达
      drawRadar(){
        const ctx = this.canvas.getContext('2d')
        const {width, height} = this.canvas
        const x0 = width / 2
        const y0 = height / 2
        const radius = parseInt(height * 0.4)

        ctx.clearRect(0, 0, width, height)

        const rangeArr = [{
          radius: 5,
          width: 0.6,
        },{
          radius: parseInt(radius * 0.5),
          width: 1,
        },{
          radius: radius,
          width: 3,
        }]

        //圆环
        for (let i = 0; i < rangeArr.length; i++) {
          ctx.beginPath()
          ctx.strokeStyle = '#42f30f'
          ctx.linWidth = rangeArr[i].width
          ctx.arc(x0, y0, rangeArr[i].radius, 0, 2 * Math.PI)
          ctx.stroke()
          ctx.closePath()
        }

        //十字线
        ctx.moveTo(x0 - radius, y0)
        ctx.lineTo(x0 + radius, y0)
        ctx.stroke()
        ctx.moveTo(x0, y0 - radius)
        ctx.lineTo(x0, y0 + radius)
        ctx.stroke()

        if (this.isScanning) {

          //雷达扫描
          const angle = this.angle
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.arc(x0, y0, radius, angle - 0.25 * Math.PI, angle + 0.25 * Math.PI)
          //线性渐变填充
          var lg = ctx.createLinearGradient(
            x0 - radius * Math.sin(angle),
            y0 + radius * Math.cos(angle),
            x0 + radius * Math.sin(angle),
            y0 - radius * Math.cos(angle)
          )
          lg.addColorStop(0, 'rgba(0, 255, 0, 1)')
          lg.addColorStop(0.5, 'rgba(0, 255, 0, 0.0)')
          lg.addColorStop(1, 'rgba(0, 255, 0, 0)')
          ctx.fillStyle = lg
          ctx.fill()
          ctx.closePath()

        }

      },

      //导出数据
      async exportData() {
        await exportCheckPoints({date: this.currDate})
      },

    }
  }
</script>

<style lang="scss" type="text/scss">
.check-points-recommend{
  display: flex;
  flex-direction: row;
  min-height: 550px;

  /*test*/
  /*padding: 2em;*/
  /*width: 1040px;*/
  background-color: #1b3175;


  .radar {
    position: relative;
    flex: 1;
    width:50%;

    .canvas {
      position: absolute;
      top: 0;
      left: 0;
    }
    .tip{
      position: absolute;
      bottom: 3em;
      left:0;
      width: 100%;
      color: #fff;
      text-align: center;
    }
  }
  .list {
    flex: 1;
    width:50%;

    &-toolbar{
      position: relative;
      padding:  .5em 0;
      color: #fff;
      text-align: right;

      .time{
        position: absolute;
        top: 10px;
        left: 0px;
      }
    }

    .staff_table .el-table__row td {
      border-bottom: 1px solid #132a65 ;
    }
  }
}
</style>
