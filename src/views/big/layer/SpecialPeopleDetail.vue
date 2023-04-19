<template>
  <div class="special-people-detail">

    <data-empty-box v-if="baseInfo.length == 0"></data-empty-box>

    <template v-else>

      <div class="title">
        基本信息
      </div>
      <div class="base-info">
        <div class="info-item" v-for="(item, key) in baseInfo" :key="key">
          <div class="box-label">{{item.label}}</div>
          <div class="box-value" @click="showList(item)"><span :class="{clickable: item.clickable}">{{item.value}}</span></div>
        </div>
        <div class="info-item" v-if="baseInfo.length%2==1">
          <div class="box-label"> </div>
          <div class="box-value"> </div>
        </div>
      </div>

    </template>

  </div>
</template>

<script>
  import { getSpecialPeopleCount} from '@/api/mapData.js'
  import Moment from 'moment'
  import DataEmptyBox from "./DataEmptyBox";

  export default {
    name: "SpecialPeopleDetail",
    components: {DataEmptyBox},
    props: {
      cond: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    watch: {
      cond(val) {
        this.getData()
      }
    },
    data() {
      return {
        baseInfo: [],
        isPeopleListVisible: false
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {

        const {street, grid} = this.cond

        if(street){
          var towns = await getSpecialPeopleCount({belongTown: street})
          const data  = towns.find(v=>v.belongTown == street)
          this.baseInfo = [
            {label: '所属镇街', value:data['belongTown'], clickable: false},
            {label: '孕产妇', value:data['pregnant'], clickable: true},
            {label: '透析、化疗、慢性病人等特殊就医用药人员', value:data['seriously'], clickable: true},
            {label: '独居老人', value:data['lonelyOld'], clickable: true},
            {label: '行动不便人员', value:data['disabled'], clickable: true},
            {label: '精神障碍患者', value:data['mental'], clickable: true},
            {label: '无自救能力人员', value:data['noSelfRescueAbilityPersonnel']||0, clickable: true},
            {label: '其他', value:data['other'], clickable: true},
            {label: '更新时间', value: Moment(data['updateTime']).format('YYYY-MM-DD HH:mm:ss'), clickable: false}
          ]
        } else {
          //todo:等接口
        }
      },
      showList(item) {
        const {street, grid} = this.cond
        this.$emit('showSpecialPeopleList', {peopleCategory: item.label, street, grid} )
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
.special-people-detail{

  min-height: 200px;
  max-height:  550px;
  overflow: auto;
  color: #fff;
  font-size: 14px;


  .title{
    position: relative;
    padding: 15px 10px;

    &:after{
      position: absolute;
      top: 16px;
      left: 0;
      content: '';
      height: 16px;
      width: 3px;
      font-size: 0;
      background-color: #345EF0;
    }
  }

  .base-info {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 96%;
    padding-bottom: 4px;

    .info-item {
      width: calc(50% - 1px);
      display: flex;
      border: 1px solid #465da3;
      margin-right: -1px;
      margin-bottom: -1px;
      position: relative;

      .box-label{
        width: 120px;
        min-height: 20px;
        padding: 8px 16px;
        flex-shrink: 0;
        background-color: rgba(45, 85, 208, 0.3);
      }
      .box-value{
        box-sizing: border-box;
        padding: 8px 16px;
        border-left: 1px solid #465DA3;
        width: 100%;

        .clickable{
          text-decoration: underline;
          cursor: pointer;
          color: #ffff00;
        }
      }
    }
  }
}
</style>
