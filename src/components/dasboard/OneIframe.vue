<template>
  <div :class="className">
    <iframe :src="iframeUrl" style="width:100%; height:100%; border:0 none;"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'OneIframe',
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      apiUrl: { type: String }
    },
    data () {
      return {
        iframeUrl: ''
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      getData () {
        this.iframeUrl = this.apiUrl
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
