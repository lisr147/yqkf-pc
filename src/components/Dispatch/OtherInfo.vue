<template>
  <div class="other-info">
    <section>
      <div class="section-h">
        <h4>现场照片</h4>
      </div>
      <div class="section-b">
        <div class="item" v-for="(item,index) in imgList" :key="index" >
          <img :alt="item.name" :src="item.src" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "OtherInfo",
  components: {},
  data() {
    return {
       imgList: [
        {name: '1', src: 'https://howlerjs.com/assets/images/demos/player.jpg'},
        {name: '2', src: ''},
        {name: '3', src: ''},
        {name: '3', src: 'https://howlerjs.com/assets/images/demos/player.jpg'},
        {name: '3', src: ''},
        {name: '3', src: ''},
      ]
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
