export default {
  data () {
    return {
      time_statmp: null
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    resizeHandler() {
      if (this.time_statmp) {
        if (new Date() - this.time_statmp >= 1000 && this.chart) {
          // console.log(this.info.title + ' chart resize')
          this.chart.resize()
          this.time_statmp = null
        }
      } else {
        this.time_statmp = new Date()
      }

    }
  }
}
