<template>
  <div class='camera-list'>
      <div class="item" v-for="(item,index) in videoList"
           @click="viewCamera(item)"
           :key="index"><span>{{index+1}}. {{item.deviceName}}</span></div>

      <device-detail v-model="deviceVisible" :attributes="deviceInfo" showme="true"></device-detail>
  </div>

  
</template>

<script>
import DeviceDetail from '@/components/Seal/DeviceDetail.vue';
export default {
    name: "CameraList",
    data() {
      return {
          cameraList:[],
          deviceInfo: null,
          deviceVisible: false
      };
    },
    components: {
      DeviceDetail
    },
    props:['videoList'],
    mounted() {
      console.log(this.videoList)
      this.cameraList = [
        {
          name: "camera1",
          id: "1",
        },
        {
          name: "camera2",
          id: "2",
        },
        {
          name: "camera3",
          id: "3",
        },
      ];
    },
    methods: {
        viewCamera(item){
          console.log(item)
          this.deviceInfo = item
          this.deviceVisible = true
        }
    },
  };
</script>

<style lang="scss" type="text/scss" scoped>
.camera-list{
    position: absolute;
    z-index:3;
    left: 21em;
    bottom: 6em;
    overflow-y: scroll;
    max-height: 36em;
    box-sizing: border-box;
    border: 10px solid;
    background-color: #0f286a;
    opacity: 0.9;
    border-image: url('~@/assets/image/community/rect-btn.png') 10;
    .item{
        padding: .5em 0;
        position: relative;
        color: #fff;
        background-color: #0f286a;
        min-width: 170px;
        cursor: pointer;
        opacity: 0.7;

        span{
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 0 2em;
          
          border:1px solid #0f286a;
          z-index: -1;
        }

        &:hover{
          opacity: 1;
        }

        &.active::after{
          content:'';
          position: absolute;
          top:4px;
          left: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #fff;
          z-index: 99;
        }

      }
}
</style>