<template>
  <div class="card-panel" >
    <van-empty image="error"  v-if="loadFail">
      <template slot="description">
        <p>{{title}}</p>
        <p> 图表加载失败，请检查图表配置</p>
      </template>
    </van-empty>
    <div class="card-panel-description" v-else>
      <div class="card-panel-text">
        <h4>{{chartData.title}}</h4>
        <p class="sub" v-show="chartData.time">更新时间：{{chartData.time}}</p>
      </div>
      <div :style="{color: color}" class="card-panel-num">{{chartData.value}}</div>
    </div>
  </div>
</template>

<script>
import { getPanelData } from '@/api/chart'
import {chartColors} from '@/config/setting'


export default {
  name: 'SingleNum',
  components: {
  },
  props: {
    icon: {
      type: String,
      default: 'devices'
    },
    data: {
      type: Object,
      default: function () {
        return {
          title: 'title',
          value: 100
        }
      }
    },
    id: { type: Number, String },
    title: { type: String }
  },
  data () {
    return {
      chartData: {
        title: '',
        time: '',
        value: 0,
      },
      loadFail: false
    }
  },
  watch: {
    id (newValue) {
      this.getData()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getData()
    })
  },
  computed: {
    color () {
      return chartColors[0].data[0]
    }
  },
  methods: {
    getData () {
      if (!this.id) {
        return
      }

      getPanelData({
        id: this.id
      }).then((res) => {

        this.setData(res.panelItemData.data)
      }).catch(res => {
        this.loadFail = true
        console.log('图表加载失败：' + this.id)
      })

    },
    setData (newData) {
      this.chartData = {
        title: newData.title,
        time:  newData.updateTime || newData.update,
        value: newData.data.value,
        pValue:  newData.data.value
      }

    }
  }
}
</script>

<style lang="scss" scoped>
  .card-panel {
    position: relative;
    margin:0 0 4vw;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    font-size: 12px;
    overflow: hidden;
    color: #444;
    background: #fff;

    .card-panel-description {
      /*float: left;*/
      font-weight: bold;
      margin: 20px ;

      .card-panel-text {
        font-weight: normal;
        margin-bottom: 10px;

        h4 {
          min-height: 30px;
          font-weight: bold;
          font-size: 20px;
          color: #333;
        }

        .sub {
          font-size: 16px;
          color: #999;
        }

      }

      .card-panel-num {
        font-family: arial;
        font-weight: bold;
        font-size: 60px;
        letter-spacing: .05em;
      }
    }


  }
</style>
