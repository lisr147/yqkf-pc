<template>
  <el-dialog
      :visible="true"
      top="10vh"
      title="近7日内核酸检测记录"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="500px"
  >
    <div class="nuclein-record-wrap">
      <div class="info">
         <p>被检测人姓名：{{infoData.xm || infoData.name}}</p>
         <p>被检测人身份证号码：{{infoData.sfzhm}}</p>
      </div>
      <ul class="item-list">
        <li class="item" v-for="(item,index) in list" :key="index">
          <p>核酸检测结果：{{item.JCJIEGUO}}
            <i class="el-icon-success" v-if="item.JCJIEGUO==='阴性'" style="color:#2dd20a;"></i>
            <i class="el-icon-warning" v-else-if="item.JCJIEGUO==='阳性'" style="color:#e52c0b;"></i>
          </p>
          <p>核酸检测机构：{{item.JCJG}}</p>
          <p>核酸检测时间：{{item.JCSJ}}</p>
          <p>核酸采样时间：{{item.CYRQ}}</p>
        </li>
      </ul>
      <Empty v-if="list.length===0" description="暂无数据"></Empty>
    </div>
  </el-dialog>

</template>

<script>

import Empty from '@/components/common/Empty'
export default {
  name: 'NucleinRecord',
  components: { Empty },
  props: {
    showme: {type: Boolean},
    list: {type: Array},
    infoData:{type:Object}
  },
  model: {
    prop: 'showme',
    event: 'toggle'
  },
  data() {
    return {

    }
  },
  watch: {

  },

  mounted() {
    console.log(this.infoData);
  },
  methods: {

  }
}
</script>

<style lang="scss"  scoped>
.nuclein-record-wrap{
  line-height: 1.8;
  .info{
    padding:0 20px 10px;
    border-bottom: solid 1px #e6e6e6;
    line-height: 2;
    font-weight: 500;
  }
  .item-list{
    .item{
      padding: 20px;
      border-top: solid 1px #e6e6e6;
    }
  }
}
</style>
