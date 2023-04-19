<template>
  <div class="map_filter">
    <div class="map_filter_item" v-for="(item,index) in data" :key="index">
      <p @click="togglePopup(item)">{{item.label}} <i class="el-icon el-icon-arrow-up"></i></p>
      <div class="popover" v-show="item.expand" :style="{width:item.width?`${item.width}px`: '188px'}">
        <div class="popover_body">
          <el-checkbox  v-model="subItem.checked" @change="handleCheckChange(subItem)" v-for="subItem in item.children"  :key="subItem.id" v-if="subItem.mapFilterVisible!==false">
            {{subItem.label}} <b v-show="dataCountMap[subItem.id]!==undefined">({{dataCountMap[subItem.id]||0}})</b>
          </el-checkbox>
        </div>
      </div>
    </div>

    <div class="map_filter_item" v-if="hasSealLink">
      <p  @click="isTopicPopVisible = !isTopicPopVisible">封控管理区 <i class="el-icon el-icon-arrow-up"></i></p>
      <div class="popover" v-show="isTopicPopVisible" style="width:188px">
        <div class="popover_body">
          <div class="el-checkbox" @click="gotoSealArea('gaode')">
            <span>高德地图</span>
          </div>
          <div class="el-checkbox" @click="gotoSealArea('gz2000')">
            <span>GZ2000地图</span>
          </div>
        </div>
      </div>
    </div>
    <slot/>
  </div>
</template>

<script>
  export default {
    name: "MapLayerFilter",
    components: {},
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      curLayer: {
        type: Number
      },
      hasSealLink: {
        //是否显示封控区入口
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        //封控管理区是否显示
        isKFVisible: false,
        isTopicPopVisible: false
      }
    },
    computed: {
      jiaanVisible(){
        return this.curLayer ==  3
      },
      zhujiangVisible(){
        return this.curLayer ==  4
      },
      dataCountMap(){
        return this.$store.state.map.dataCountMap
      }
    },
    mounted() {
      document.body.addEventListener('click', this.hideFilterBox)
    },
    methods: {

      //显示浮层菜单
      togglePopup(item) {
        item.expand = !item.expand
        this.$emit('switchTopic', {layerId: 0})
        this.compareLayrState(0)
      },

      //切换专题
      switchTopic(val){
        //比较专题id变了没，有则派发事件
        this.compareLayrState(val)

        //隐藏所有浮层
        if (val !== 0) {
          this.data.forEach(item => {
            item.expand = false
          })
        }
      },

      compareLayrState(val) {
        if (this.curLayer !== val) {
          this.$emit('switchTopic', {layerId: val})
        }
      },

      hideFilterBox(event) {
        //如果点击位置不在当前组件内，则折叠所有菜单
        if (this.$el.contains(event.target)) {
          return
        }
        this.data.forEach(item => {
          item.expand = false
        })
        this.isTopicPopVisible = false
      },

      handleCheckChange(item){
        let chkArr = []
        this.data.forEach(item => {
          let arr = item.children.filter(v => v.checked).map(v => v.id)
          chkArr = chkArr.concat(arr)
        })
        if(item.id==='hotel-video'){
          //选择隔离酒店视频时跳转
          item.checked =false
          return window.open("https://gljd.gzonline.gov.cn:12342/hotel-city-web/#/login")
        }
        this.$emit('selectChanged', {ids: chkArr, target: Object.assign({}, item)})
      },

      gotoSealArea(id){

        switch (id) {
          case 'gaode':
            window.open(`./sealarea.html#/sealareaIndex`)
            break;
          case 'gz2000':
            window.open(`./sealarea.html#/gz2000`)
            break;
          default:
            break
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .map_filter {
    position: absolute;
    left: 0;
    right: 0;
    height: 60px;
    bottom: 14px;
    z-index: 20;
    display: flex;
    justify-content: center;

    &_item {
      position: relative;
      margin: 0 12px;
      padding: 8px 0 0;
      width: 150px;
      height: 48px;
      background: center center url("~@/assets/image/btn-sl.png") no-repeat;
      background-size: 100%;
      cursor: pointer;
      user-select:none;
      p {
        width: 100%;
        text-align: center;
        color: #fff;
        line-height: 44px;
      }
      .el-icon{
        position: absolute;
        top: 22px;
        right: 16px;
      }
    }
    .hotel_filter,
    .hot_map_filter {
      position: relative;
    }
    .popover {
      width: 210px;
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      box-sizing: border-box;
      border: 12px solid transparent;
      border-image: url("~@/assets/image/dialog-bg.png") 12;
      background-color:rgba(32,50,111,0.95);
      border-radius:20px ;
      .popover_body {
        background-color:rgba(32,50,111,0.95);
        min-height: 50px;
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        .el-checkbox__label{
          padding-left: 5px;
        }
      }
    }
    .el-checkbox {
      display: flex;
      margin-bottom: 4px;
      padding: 6px 6px;
      box-sizing: border-box;
      width: 100%;
      background-color: #284083;
      font-size: 14px;
      color: #fff;

      &__inner{
        vertical-align: middle;
      }

      &:last-child {
        margin-bottom: 0;
      }

      &:hover{
        background-color: #3250a3;
      }

      b{
        font-size: 12px;
      }

      ::v-deep .el-checkbox__inner {
        border-radius: 50%;
        vertical-align: middle;
      }
      ::v-deep .el-checkbox__label {
        padding-left: 4px;
        width: calc(100% - 20px);
        white-space: pre-wrap;
        vertical-align: top;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
</style>
