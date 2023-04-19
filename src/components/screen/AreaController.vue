<template>
    <div class="area-controller">
        <div class="area-controller-item cursor" @click="toggleAreaList">
            {{currTown}} <i class="el-icon el-icon-arrow-down"></i>
        </div>

        <div class="area-controller-box" v-show="isLayerVisible">
            <ul v-for="(item,index) in areaList" :key="index">
                <li :class="{'active':item.value == currTown}" @click="switchArea(item)">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
  import DISTRICTS from '@/components/MapLayer/districts.json'

  export default {
    name: "AreaController",
    data() {
      return {
        isLayerVisible: false,
        areaList: []
      }
    },
    props: {
      initialValue: String
    },
    computed:{
      currTown(){
        const val =  this.$store.state.common.town
        const match = this.areaList.find(v=>v.value == val)
        return match? match.name : ''
      },

    },
    created(){

      const arr = DISTRICTS.map(({name})=>{
        return {
          name,
          value: name
        }
      })

      this.areaList = [...[{name: '南沙区', value: null}], ...arr]
    },
    methods: {
      toggleAreaList() {
        this.isLayerVisible = !this.isLayerVisible
      },
      switchArea(item) {
        this.isLayerVisible = false
        this.$store.commit('common/SET_TOWN', item.value)
      },
      hideOtherLayer() {
        //如果点击位置不在当前组件内，则折叠所有菜单
        if (this.$el.contains(event.target)) {
          return
        }
        this.isLayerVisible = false
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
  .area-controller {
    &-item {
        position: relative;
        width: 116px;
        height: 34px;
        margin-bottom: 10px;
        padding: 6px 6px;
        box-sizing: border-box;
        text-align: left;
        color: #fff;
        font-size: 14px;
        background: linear-gradient(180deg, #0F2560 0%, #1C49B8 100%);
        box-shadow: 0px 0px 5px 0px #11245E, inset 0px 0px 5px 0px #2B5FF6;
        border: 1px solid #2B5FF6;

        img{
        vertical-align: middle;
        }
        p{
        color: #fff;
        }

        .el-icon{
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        }

        &.cursor{
        cursor: pointer;
        }

        &.search-box{
        width: 220px;
        min-height: 80px;
        text-align: left;
        cursor: default;

        input{
            outline: none;
            border:0 none;
        }
        p{
            padding: .5em 0;
        }
        }
    }
    &-box{
        position: absolute;
        top: 34px;
        right: 0;
        width: 116px;
        background: linear-gradient(180deg, #0F2560 0%, #1C49B8 100%);

        li {
        padding: 10px;
        color: #fff;
        cursor: pointer;

        &.active,
        &:hover {
            background-color:#2B5FF6;
        }
        }
    }
  }
</style>
