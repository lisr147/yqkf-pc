<template>
  <el-dialog
      :visible="true"
      top="10vh"
      title="查看疫苗接种记录"
      :close-on-click-modal="false"
      @close="$emit('close')"
      width="500px"
  >
    <div class="vacc-wrap">
      <ul class="item-list">
        <li class="item" v-for="(item,index) in list" :key="index">
          <p>针次：{{item.injectTimes}}</p>
          <p>接种时间：{{item.injectDate}}</p>
          <p>厂家名称：{{item.comName}}</p>
        </li>
      </ul>
      <Empty v-if="list.length===0" description="暂无数据"></Empty>
    </div>
  </el-dialog>

</template>

<script>

import Empty from '@/components/common/Empty'
export default {
  name: 'Vaccination',
  components: { Empty },
  props: {
    showme: {type: Boolean},
    list: {type: Array}
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

  },
  methods: {

  }
}
</script>

<style lang="scss"  scoped>
.vacc-wrap{
  .item-list{
    .item{
      margin:5px 0 25px;
      line-height: 1.5;
    }
  }
}
</style>
