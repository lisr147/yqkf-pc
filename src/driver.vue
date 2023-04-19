<template>
  <div id="app" class="driver">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
<style>
.driver {
  width: 100%;
  height: 100%;
  background-color: #F7F7F7;
}
.van-button--primary {
  color: #fff;
  background-color: #2A44A5 !important;
  border: 1px solid #2A44A5 !important;
}
</style>
