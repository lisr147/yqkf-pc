<template>

  <el-dialog
    v-dialogDrag
    title="无人机巡航图片"
    top="12vh"
    @close="handleClose"
    :visible="showme"
    :modal="false"
    width="100vh">
      <el-carousel indicator-position="outside" height="80vh">
        <el-carousel-item v-for="(item,index) in list" :key="index">
          <div class="box">
            <a :href="item.src" target="_blank"><img alt="正在加载图片" :src="item.src"/></a>
          </div>
        </el-carousel-item>
      </el-carousel>
  </el-dialog>


</template>

<script>
  import {mediaHost} from '@/config/setting'
  export default {
    name: "ImageViewer",
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
        list: []
      }
    },
    watch:{
      showme(val) {
        if (val == true && this.list.length == 0) {
          this.getData()
        }
      }
    },
    mounted() {
    },
    methods: {
      getData() {
        const arr = [
          'DJI_20210609171921_0001_W.JPG',
          'DJI_20210609171932_0002_W.JPG',
          'DJI_20210609171955_0003_W.JPG',
          'DJI_20210609171959_0004_W.JPG',
          'DJI_20210609172034_0005_W.JPG',
          'DJI_20210609172044_0006_W.JPG',
          'DJI_20210609172506_0009_W.JPG',
          'DJI_20210609172812_0010_W.JPG',
          'DJI_20210609173213_0012_Z.JPG',
        ]

        this.list = arr.map(item=>{
          return {src: `https://${mediaHost}/${item}`}
        })

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
  height: 100%;
  text-align: center;

  img{
    height: 100%;
    background-color: #174c90;
  }
}
</style>
