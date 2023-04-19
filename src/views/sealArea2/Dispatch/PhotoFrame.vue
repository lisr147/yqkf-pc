<template>
  <div class="photo-frame">
    <h4 class="title" v-if="withTitle">照片</h4>
    <div class="item" v-for="(src,index) in imgList" :key="index" >
      <el-image :src="src" :preview-src-list="imgList" fit="cover" style="width: 100%;height: 100%;" />
    </div>
    <data-empty-box v-if="imgList.length==0" title="暂无图片" />
  </div>
</template>

<script>
import DataEmptyBox from "@/views/big/layer/DataEmptyBox";
export default {
  name: "PhotoFrame",
  components: {DataEmptyBox},
  props: {
    ids: {
      type: String
    },
    withTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      imgList: []
    }
  },
  watch: {
    ids: {
      handler(val = '') {
        if (!val) {
          return
        }
        const arr = val.split(',')
        this.imgList = arr.map(id => {
          return `${process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : 'http://dn.product.iot-cas.com:8081/yqfk'}/api/mediaInfo/preview/${id}`
        })
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    zoomIn(){
      const viewer = this.$refs['alarmGallery'].$viewer
      viewer.show()
    }
  }
}
</script>

<style lang="scss" type="text/scss">
.photo-frame{
  .title{
    padding: .5em 0;
    color: #fff;
  }
  .item{
    display: inline-block;
    margin: .5em 1%;
    width: 31%;
    height: 150px;
    vertical-align: text-top;
    background-color: #052461;
    text-align: center;
    cursor: pointer;

    img{
      max-width: 100%;
      max-height: 100%;
    }
  }
  .data-empty{
    border: 1px dotted #3D60AC;
  }
}
</style>
