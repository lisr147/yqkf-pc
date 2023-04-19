<template>
  <div>
    <div class="map_filter" v-show="showMapFilter">
      <div style="overflow-y: auto">
        <div class="map_filter_item" v-for="(item,index) in data" :key="index">
          <p class="type_title" @click="togglePopup(item)">{{item.label}}
            <i v-if="item.expand" class="el-icon el-icon-arrow-up"></i>
            <i v-else class="el-icon el-icon-arrow-down"></i>
          </p>
          <div class="popover" v-show="item.expand" v-if="item.expand && item.children">
            <div class="popover_body">
              <el-checkbox  v-model="subItem.checked" @change="handleCheckChange(subItem)" v-for="subItem in item.children"  :key="subItem.id" v-if="subItem.mapFilterVisible!==false">
                {{subItem.label}} <b v-show="dataCountMap[subItem.id]!==undefined">({{dataCountMap[subItem.id]||0}})</b>
              </el-checkbox>
            </div>
          </div>
        </div>
        <div class="map_filter_item" v-if="hasSealLink">
          <p  class="type_title" @click="isTopicPopVisible = !isTopicPopVisible">封控管理区
            <i v-if="isTopicPopVisible" class="el-icon el-icon-arrow-up"></i>
            <i v-else class="el-icon el-icon-arrow-down"></i>
          </p>
          <div class="popover" v-show="isTopicPopVisible">
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
      </div>
      <div class="popper_arrow"></div>
      <slot/>
    </div>
    <div class="filter-btn" :class="{active:showMapFilter}" @click="handleClick">
      <!--v-if 闪烁-->
      <img v-show="!showMapFilter" src="@/assets/image/filter-map.svg"/>
      <img v-show="showMapFilter" src="@/assets/image/filter-map-active.svg"/>
      图层选择
    </div>
  </div>

</template>

<script>
  export default {
    inject: ["handleItemChoosed"],
    name: "baseMapLayerFilter",
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
        default: false
      }
    },
    data() {
      return {
        //封控管理区是否显示
        isKFVisible: false,
        isTopicPopVisible: false,
        showMapFilter: false,
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
      handleClick() {
        this.showMapFilter = !this.showMapFilter
        if (this.showMapFilter) {
          this.handleItemChoosed(null,'showMapFilter')
        }
      },
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
          return window.open(" http://10.194.212.88:12340/hotel-city-web/#/videoDashboard")
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

<style lang="scss" scoped>
@keyframes menu-show {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}
.map_filter {
  position: absolute;
  left: 520px;
  bottom: 62px;
  z-index: 20;
  min-width: 237px;
  max-height: 542px;
  //overflow-y: auto;
  padding: 5px 0 8px;
  background: rgba(41,75,116,0.9);
  display: flex;
  flex-direction: column;
  animation: menu-show 0.3s;
  transform-origin: left;
  &_item {
    position: relative;
    margin: 0 5px;
    padding: 4px 0 0;
    background-size: 100%;
    cursor: pointer;
    user-select:none;
    p {
      width: 100%;
      text-align: center;
      color: #fff;
      line-height: 40px;
    }
    .el-icon{
      position: absolute;
      top: 16px;
      right: 10px;
    }
  }
  .hotel_filter,
  .hot_map_filter {
    position: relative;
  }
  .type_title{
    height: 40px;
    line-height: 40px;
    //background: rgba(5,24,48,0.38);
    text-align: left;
    padding-left: 10px;
    box-sizing: border-box;
    background: linear-gradient(90deg, rgba(5,24,48,0.58), rgba(5,24,48,0.08));
  }
  .popover {
    box-sizing: border-box;
    border-radius:20px ;
    animation: menu-show 0.3s;
    transform-origin: left;
    .popover_body {
      padding: 10px 0 8px;
      min-height: 50px;
      overflow-y: auto;
      overflow-x: hidden;
      .el-checkbox__label{
        padding-left: 5px;
      }
    }
  }
  .el-checkbox {
    display: flex;
    margin-bottom: 5px;
    padding: 6px 6px;
    box-sizing: border-box;
    width: 100%;
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
      vertical-align: middle;
      margin-top: 2px;
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
  .popper_arrow{
    content: "";
    position: absolute;
    bottom: 32px;
    left: -14px;
    margin-left: -5px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent  rgba(41,75,116,0.9) transparent  transparent;
  }
}
.filter-btn{
  width: 84px;
  height: 83px;
  position: absolute;
  left: 426px;
  bottom: 62px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(12,33,59,0.9);
  font-size: 16px;
  color: #82b2ef;
  font-family: Source Han Sans CN;
  &.active{
    background: linear-gradient(-90deg, #08274F, #0D5198, #04344E);
    color: #ffffff;
  }
  &:hover{
    background: linear-gradient(-90deg, #08274F, #0D5198, #04344E);
    color: #ffffff;
    img{
      content: url("~@/assets/image/filter-map-active.svg");
    }
  }
  img{
    width: 37px;
    margin-bottom: 10px;
  }
}
</style>
