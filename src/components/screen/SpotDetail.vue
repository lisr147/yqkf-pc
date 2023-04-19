<template>
  <div class="spot-detail">

    <div class="title">
      基本信息
    </div>

    <!--基本属性表格-->
    <info-box :template="itemTemplate" :datum="baseInfo" :attrs="this.data" @popUp="handlePopUp"></info-box>

    <!--图片-->
    <div class="album" v-if="album.length>0">
      <img :src="album[0].src" :title="album[0].title"/>
    </div>


  </div>
</template>

<script>
  import {getTemplateConfig, getMapLayerData} from '@/api/mapData.js'
  import InfoBox from "@/views/big/layer/InfoBox"

  export default {
    name: "SpotDetail",
    components: {InfoBox},
    props: {
      data: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        //基本信息
        baseInfo: {},
        //数据模板
        itemTemplate: [],
        //图片信息
        album: []
      }
    },

    mounted() {
      this.getData()
    },
    methods: {
      async getData() {

        if (!this.data.templateId) {
          console.error('缺少图层templateId', this.data)
        }
        const templateId = this.data.templateId

        //获取当前图层的模板
        var {columns} = await getTemplateConfig({id: templateId})
        this.itemTemplate = columns

        //获取详情数据
        var {data} = await getMapLayerData({templateId, condition:{ id: this.data.id }})
        this.baseInfo = data[0]
        // 对核酸检测点数据的公共场所字段特殊处理
        if(data[0].hasOwnProperty('ggcs')) {
         let  {ggcs} = this.data
         this.baseInfo.ggcs = ggcs
        }

        this.fixAlbum()
      },

      fixAlbum() {
        if (this.data.yljg == '广州市第一人民医院南沙医院') {
          this.album = [{title: '南沙中心医院', src: `./static/album/nansha_hospital.jpg`}]
          return
        }
      },

      handlePopUp(event) {
        //事件往外派发
        this.$emit('popUp', event)
      }

    }
  }
</script>

<style lang="scss" type="text/scss">
  .spot-detail {
    position: relative;
    min-height: 200px;
    max-height:  550px;
    overflow: auto;
    color: #fff;
    font-size: 14px;

    .title{
      position: relative;
      padding: 15px 10px;

      &:after{
        position: absolute;
        top: 16px;
        left: 0;
        content: '';
        height: 16px;
        width: 3px;
        font-size: 0;
        background-color: #345EF0;
      }
    }

    .album{
      text-align: center;
      img {
        margin-top: 10px;
        max-width: 100%;
      }
    }

  }
</style>
