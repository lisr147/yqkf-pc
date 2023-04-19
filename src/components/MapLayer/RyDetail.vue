<template>
<div class="ry-detail-container">
  <div class="ry-box">
    <div class="ty-t1">个人情况</div>
    <div class="ty-conent-box box1">
      <p v-if="detail.PHONE">联系电话：{{detail.PHONE}}</p>
      <p v-if="detail.BIRTHDAY">出生日期：{{detail.BIRTHDAY}}</p>
      <p v-if="detail.jz">所属镇街：{{detail.jz}}</p>
      <p v-if="detail.IDENTITY_TYPE">证件类型：{{identityTypeMapping[detail.IDENTITY_TYPE]}}</p>
      <p v-if="detail.idNumber">证件号码：{{detail.idNumber}}</p>
      <p v-if="detail.CHECK_TIME">核查时间：{{detail.CHECK_TIME}}</p>
      <p v-if="detail.CHECK_HANDLE_SUGG">疫情状态：{{suggMapping[detail.CHECK_HANDLE_SUGG]}}</p>
      <p v-if="detail.ARRIVAL_FROM">抵穗来源地：{{detail.ARRIVAL_FROM}}</p>
      <p v-if="detail.CONF_TIME">确诊时间：{{detail.CONF_TIME}}</p>
      <p v-if="detail.ADDR">详情地址：{{detail.ADDR}}</p>
      <p v-if="detail.UNIT_TYPE">隔离点与医院类型：{{unitTypeMapping[detail.UNIT_TYPE]}}</p>
      <p v-if="detail.SEPERATE_BEGIN">隔离开始时间：{{detail.SEPERATE_BEGIN}}</p>
      <p v-if="detail.SEPERATE_END">隔离结束时间：{{detail.SEPERATE_END}}</p>
      <p v-if="detail.SEPERATE_ADDR">隔离地点：{{detail.SEPERATE_ADDR}}</p>
    </div>
  </div>
  <div class="ry-box">
    <div class="ty-t1">最近7天核酸检测情况</div>
    <div class="ty-conent-box box2" v-if="hsList && hsList.length">
      <div class="hs-item" v-for="(item, index) in hsList" :key="index">
        <span style="flex: 2">检测时间：{{item.JCSJ}}</span>
        <span style="flex: 2">采样时间：{{item.CYRQ}}</span>
        <span style="flex: 1">检测结果：{{item.JCJIEGUO}}</span>
      </div>
    </div>
    <div class="ty-conent-box box2" v-else>
      <p>无数据</p>
    </div>
  </div>
  <div class="ry-box">
    <div class="ty-t1">疫苗接种情况</div>
    <div class="ty-conent-box ">
      <div class="ym-item">
        <p>针次：2</p>
        <p>接种时间：{{detail.second_inject_time || '无数据'}}</p>
      </div>
      <div class="ym-item">
        <p>针次：1</p>
        <p>接种时间：{{detail.first_inject_time || '无数据'}}</p>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {getHealthCodeDetail ,getHSById } from '@/api/mapData'
import moment from 'moment'
export default {
  props: ['data'],
  data () {
    return {
      detail: {},
      hsList:[],
      unitTypeMapping : {
        '1': '发热门诊',
        '2': '收治医院',
        '3': '集中隔离医学观察',
        '4': '集中隔离健康观察',
        '5': '社区',
      },
      identityTypeMapping : {
        '1':  '身份证',
        '3':  '护照',
        '4':  '军官证',
        '6':  '港澳居民居住证',
        '7':  '台湾居民居住证',
        '8':  '港澳居民来往内地通行证',
        '9':  '台湾居民来往内地通行证',
        '11': '出入境通行证',
        '12': '一次有效台湾居民来往大陆通行证',
        '13': '多次有效台湾居民来往大陆通行证',
        '14': '解除隔离（发热患者核酸检测阴性）',
      },
      suggMapping : {
        '1': '待核酸检测风险人员',
        '2': '居家隔离健康管理',
        '3': '集中隔离健康管理',
        '4': '集中隔离医学观察（密切接触者）',
        '5': '留院观察（新观待排）',
        '6': '疑似病例',
        '7': '阳性检测（无症、状感染者）',
        '8': '确诊病例（细分为轻型、普通型、重型、危重型）',
        '9': '确诊或阳性检测病例出院后隔离观察',
        '10': '解除隔离（满规定观察期核酸检测阴性且无症状）',
        '11': '确诊其他疾病排除新冠感染',
        '12': '其它',
        '13': '居家隔离等待核酸结果',
      }
    }
  },
  mounted() {
    this.getData()
    // console.log('获取详情',this.data)
  },
  methods : {
    async getData () {
      await getHealthCodeDetail({idNumber:this.data.idNumber}).then(res => {
        // console.log('接口获取健康码详情', res)
        this.detail = res
      })
      // await getHSById({idcard: }).then(res => {
      let last7 = moment().subtract('days', 7).format('YYYY-MM-DD HH:mm:ss')
      await getHSById({idcard: this.data.idNumber,starTime:last7}).then(res => {
        // console.log('获取核酸结果', res)
        this.hsList = res || []
      })
    }
  },
  watch: {

  }
}
</script>
<style lang="scss" type="text/scss" scoped>
.ry-detail-container {
  padding: 20px 20px 0;
  height: calc(70vh);
  overflow-y: auto;
  .ty-t1 {
    color: #4E7CFC;
    font-size: 14px;
    margin-bottom: 10px;
  }
  p {
    color: #fff;
    font-size: 14px;
    margin-bottom: 6px;
  }
  .ty-conent-box {
    margin-bottom: 25px;
  }
  .box1 {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    p {
      width: 50%;
      text-align: left;
      padding-right: 12px;
      box-sizing: border-box;
    }
  }
  .box2 {

  }
  .hs-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    color: #fff;
    span{
      display: inline-block;
      padding: 0.5em;
    }
  }
  .ym-item {
    display: flex;
    align-items: flex-start;
    p {
      margin-right: 50px;
    }
  }
}
</style>
