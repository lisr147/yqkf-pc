<template>
  <div class="counter-box">

    <div class="card-wrap" v-if="countArr.length > 0">

      <div class="card-panel-num" v-for="(item, i) in countArr" :key="i">
        <span class="title">{{item.title}}</span>
        <count-to :start-val="0" :end-val="item.value" :decimals="item.decimalsNum" :duration="1600"/>

        <div class="diff-wrap">
          <span class="diff-title">{{item.diffTitle}}</span>
          <span class="diff" v-show="item.diffValue !== 0" :class="item.diffValue < 0 ?'color-red':''">
            <img class="ico" :src="getIconUrl(item.diffValue)"/>{{item.diffValue}}
          </span>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  name: "CounterBoard",
  components: {
    CountTo
  },
  props: {
    info: {type: Object},
    data: {type: Object, required: true},
    icon: {type: String, default: 'devices'},
  },
  data() {
    return {
      // 可保存多个计数值
      countArr: []
    }
  },
  computed:{
    decimalsNum(){
      return this.data.value % 1 > 0 ? 2 : 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(val){

      const newData = this.data['panelItemData']['data']

      if (Object.prototype.toString.call(newData.data.data) === '[object Array]') {
        this.countArr = newData.data.data
        this.countArr.forEach((v, i) => {
          this.countArr[i].decimalsNum = v.value % 1 > 0 ? 2 : 0
        })

      } else {
        // 兼容旧版本
        this.countArr = [{
          title: newData.title,
          value: newData.data.value,
          decimalsNum: 0,
          diffTitle: null,
          diffValue: 0
        }]
      }
    },
    getIconUrl(val){
      return `${process.env.BASE_URL}/svg/${val > 0 ? 'up' : 'down'}.svg`
    }
  }
}
</script>

<style lang="scss" type="text/scss">
  .counter-box {
    position: relative;
    width: 100%;
    height: 100%;

    .card-wrap {
      display: flex;
      justify-content: space-around;
      align-items: center;

      .card-panel-num {
        padding: 2% 5%;
        font: 2vw bold arial;
        letter-spacing: .05em;
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: center;
      }
      .title {
        padding:0 0 .5em;
        font-size: 16px;
      }
      .diff-wrap {
        line-height:66%;
      }
      .diff-title {
        font-size: .6vw;
      }
      .diff {
        font-size: 1vw;
        display: flex;
        justify-content: center;
        align-items: center;
        .ico {
          width: 1.2em;
        }
      }
    }

  }
</style>
