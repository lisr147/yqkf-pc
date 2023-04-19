<template>
  <div class="counter-box" :class="{qmjBox:this.code==='qmjtj'}">

    <div
        class="chart-total-wrapper"
        v-if="countList.length > 0"
    >
      <div
          class="chart-total-box"
          v-for="(item, index) in countList"
          :key="index"
          :class="{pointer: ['qmjtj'].includes(code),
           bgRed:['累计密接人员','当前密接人员'].includes(item.key),
           }"
          @click="openDetail(item)"
      >
        <p class="t1">{{ item.key }}</p>
        <p class="t2">{{ item.value }}
          <span class="s2" v-if="item.unit">{{item.unit}}</span>
        </p>
        <i class="icon el-icon-right" v-if="['qmjtj'].includes(code)"></i>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "CounterBoardV1",
  components: {

  },
  inject:['handleItemChoosed'],
  props: {
    info: {type: Object},
    data: {type: Object, required: true},
    icon: {type: String, default: 'devices'},
    from:{type:String},
    sswg:{type:String}
  },
  data() {
    return {
      // 可保存多个计数值
      countList: [],
      code:''
    }
  },
  mounted() {
    this.code = this.data.code
    this.getCountData()
  },
  methods: {
    getCountData() {
      const newData = this.data['panelItemData']['data']
    //   console.log(newData);
      for(let i in newData){
        this.countList.push({value:newData[i],key:i})
      }
      if(this.data.code==='qmjtj'){
        this.countList.reverse()
      }
    },
    openDetail(item){
    //   console.log(64,item,this.from,this.sswg);
      item.from = this.from
      item.sswg = this.sswg
      switch (item.key) {
        case '累计密接人员':
        case '累计次密接人员':
          item.fromKey='CounterBoard'
          this.handleItemChoosed(item)
          break
        default:
          this.handleItemChoosed(item)
          break
      }
    },
  },

}
</script>

<style lang="scss" scoped>
  .counter-box {
    position: relative;
    width: 100%;
    height: 90px!important;
  }
  .qmjBox{
    height: 170px!important;
  }
</style>
