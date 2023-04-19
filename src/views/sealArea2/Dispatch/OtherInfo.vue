<template>
  <div class="other-info">
    <section>
      <div class="section-h">
        <h4>现场照片</h4>
      </div>
      <div class="section-b">
        <photo-frame :ids="photoIds" :with-title="false"/>
      </div>
    </section>
  </div>
</template>

<script>
import PhotoFrame from "./PhotoFrame";
export default {
  name: "OtherInfo",
  components: {PhotoFrame},
  data() {
    return {
      photoIds: ''
    }
  },
  computed:{
    otherInfo(){
      return this.$store.state.dispatch.otherInfo
    }
  },
  watch:{
    otherInfo:{
      handler(obj){
        const { qtzp} = obj
        this.photoIds = qtzp
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<style lang="scss" type="text/scss" scoped>
.other-info{
  max-height: 500px;
  overflow: auto;
  color: #fff;
  .section-h{
    h4{
      padding: .5em 0;
      color: #fff;
    }
  }
  .section-b{

    .item{
      display: inline-block;
      margin: .5em;
      width: 31%;
      height: 150px;
      vertical-align: text-top;
      background-color: #052461;
      text-align: center;

      img{
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
