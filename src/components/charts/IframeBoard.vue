<template>
    <div class="box">
        <iframe class="full" ref="frame"></iframe>
    </div>
</template>

<script>
  import {getChartData} from '@/api/topic'

  export default {
    name: "IframeBoard",
    props:{
      info: {type: Object},
      data: {type: Object, required: true},
    },
    data(){
      return {

      }
    },
    mounted(){
      let data = this.getData()
      this.initVideo(data)
    },
    methods: {
      getData() {
        return this.data['optionData']
      },

      initVideo(optionData) {
        if (optionData) {
          this.$refs['frame'].src = optionData
        }
      }

    }
  }
</script>

<style lang="scss"  type="text/scss" scoped>
.box {
    position: relative;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    height: 220px;

    .full {
        border: 0 none;
        width: 100%;
        height: 100%;
    }
}
</style>
