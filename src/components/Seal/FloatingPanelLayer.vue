<template>
  <div class="floating-panel-layer">
    <stick-panel v-for="item in floatingList"  :key="item.id" :data="item.data" :id="item.id" :myStyle="item.style"></stick-panel>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import StickPanel from '@/components/Seal/StickPanel'

  export default {
    name: "FloatingPanelLayer",
    components: {
      StickPanel
    },
    data() {
      return {
      }
    },
    computed:{
      ...mapState(['floatingList'])
    },
    mounted() {
    },
    methods: {

    }
  }
</script>

<style lang="scss" type="text/scss">
.floating-panel-layer{
  position: fixed;
  top:0;
  left:0;
  width:0;
  height:0;
  overflow: visible;
}
</style>
