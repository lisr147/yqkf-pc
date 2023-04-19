<template>
  <div class="wrap">
    <div class="total">
      总数
      <span>{{total}}</span> 人
    </div>
    <div class="card">
      <div class="item" :class="[riskLevel===item.riskLevel?'active':'',index===riskLevel-2?'before_active':'']" v-for="(item,index) in showList" :key="index" @click="handle(item.riskLevel)">
        <p class="item_title">{{item.text}}</p>
        <p class="item_num">
          <span>{{item.value}}</span> 人
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { epidemicAreaCount } from '@/api/EpidemicAreaVisiter'

export default {
  props: {
    msg: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      total: null,
      riskLevel: null,
      list: [
        { text: '高风险地区流入', value: 0, riskLevel: 2, key: 'high' },
        { text: '中风险地区流入', value: 0, riskLevel: 1, key: 'middle' },
        { text: '低风险地区流入', value: 0, riskLevel: 0, key: 'low' },
        { text: '市内各区流入', value: 0, riskLevel: 3, key: 'residentPopulation' }
      ],
    }
  },
  watch: {
    msg: {
      handler() {
        this.riskLevel = this.msg.riskLevel
      },
      deep: true,
    },
  },
  computed:{
    showList(){
      return this.list
      // return this.list.filter(v=>v.value>0)
    }
  },
  mounted() {
    this.riskLevel = this.msg.riskLevel
    this.getData()
  },
  methods: {
    handle(riskLevel) {
      this.riskLevel = riskLevel
      this.$emit('updateRiskLevel', riskLevel)
    },
    getData() {
      let params = JSON.parse(JSON.stringify(this.msg))
      delete params.riskLevel
      epidemicAreaCount(params).then((res) => {
        this.list.forEach((v) => {
          v.value = res[v.key] || 0
        })
        this.total = res.total
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
$height: 66px;
.wrap {
  display: flex;
  color: #fff;
  margin-top: 20px;
  .total {
    height: $height;
    line-height: $height;
    span {
      font-size: 24px;
      color: #00ea99;
    }
  }
  .card {
    margin-left: 42px;
    display: flex;

    .item {
      width: 170px;
      height: $height;
      text-align: center;
      border: 1px solid $btn_border_color;
      border-left: 0;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      cursor: pointer;
      &:first-child {
        border-radius: 4px 0px 0px 4px;
        border-left: 1px solid $btn_border_color;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
      }
      &.active {
        background: $btn_background_color;
        border: 1px solid $btn_background_color;
        border-left: 0;
        &:first-child {
          border-left: 1px solid $btn_background_color;
        }
        .item_num span {
          color: #fff;
        }
        &:hover {
          background: $btn_background_color_hover;
        }
      }
      &.before_active {
        border-right: 1px solid transparent;
      }
      &:hover {
        background: $btn_background_color_hover2;
      }
      p {
        color: #fff;
        font-size: 14px;
      }
      .item_title {
        line-height: 30px;
      }
      .item_num span {
        font-size: 24px;
        color: #f4974e;
      }
    }
  }
}
</style>