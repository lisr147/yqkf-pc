<template>

  <el-dialog
    v-dialogDrag
    title="无人机巡航视频"
    top="12vh"
    @close="handleClose"
    :visible="showme"
    :modal="false"
    width="128vh">

      <div class="box">
        <iframe ref="frame" v-if="list.length>0" :src="list[currIndex].src"></iframe>
      </div>
      <div class="tabs">
        <div class="item" v-for="index in list.length" :key="index" :class="{active: index == currIndex+1}" @click="switchItem(index-1)">视频{{index}}</div>
      </div>

  </el-dialog>

</template>

<script>
  import {mediaHost, BASE_URL} from '@/config/setting'
  export default {
    name: "VideoViewer.vue",
    components: {},
    props: {
      showme: {type: Boolean}
    },
    model:{
      prop: 'showme',
      event: 'toggle'
    },
    data() {
      return {
        list: [],
        currIndex: 0
      }
    },
    watch:{
      showme: {
        handler: function (val) {
          if (val == true && this.list.length == 0) {
            this.getData()
          }
        },
        immediate: false
      }
    },
    mounted() {
    },
    methods: {
      getData() {
        const arr = [
          'DJI_20210609154248_0008_S.mp4',
          'DJI_20210609172055_0007_W.mp4',
          'DJI_20210609172817_0011_W.mp4',
          'DJI_20210609154707_0012_S.mp4',
          'DJI_20210609172304_0008_W.mp4',
          'DJI_20210609172817_0011_Z.mp4',
        ]

        this.list = arr.map(item=>{
          return {src: `${BASE_URL}/player/liveplayer/player.html?videoUrl=https://${mediaHost}/record/${item}`}
        })

      },

      switchItem(val) {
        if (this.currIndex == val) {
          return
        }
        this.currIndex = val
        this.$refs['frame'].src = this.list[val].src + `&time=${new Date().getTime()}`
      },

      handleClose(){
        this.$emit('toggle', false)
      },
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .box{
    position: relative;
    height: 70vh;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0 none;
    }
  }
  .tabs{
    padding: .5em;
    text-align: center;
    .item{
      display: inline-block;
      margin: 0 2px ;
      padding: .5em;
      background-color: #142a65;
      color: #fff;
      cursor: pointer;
      border-radius: 2px;

      &.active{
        background-color: #2f89ef;
      }
    }
  }
</style>
