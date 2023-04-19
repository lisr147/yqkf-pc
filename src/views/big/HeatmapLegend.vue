<template>
  <div class="heatmap-legend">
    <ul>
      <li><i class="col" style="background-color: #f90e0f"></i> <span>>=100</span></li>
      <li><i class="col" style="background-color: #F93D26"></i> <span>70-100</span></li>
      <li><i class="col" style="background-color: #FB8039"></i> <span>30-70</span></li>
      <li><i class="col" style="background-color: #e8ff38"></i> <span>0-30</span></li>
      <!--e8ff38-->
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'HeatmapLegend',
    components: {},
    data() {
      return {}
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .heatmap-legend{
    position: absolute;
    bottom: 80px;
    right: 440px;
    z-index: 999;
    color: #fff;
    font-size: 14px;

    ul{}
    li{
      margin-bottom: 6px;

      .col{
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 3px;
        vertical-align: middle;
      }
    }
  }
</style>