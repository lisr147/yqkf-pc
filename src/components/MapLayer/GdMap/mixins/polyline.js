import NANSHA from './../config/nansha.json'

export default {
  data () {
    return {
      boundary: []
    }
  },
  methods: {
    /**
         * 渲染区域
         * @param {Object} data 区域数据
         */
    renderBoundary (data = {
      path: NANSHA,
      strokeColor: '#99ffff',
      strokeWeight: 1
    }) {
      let config = Object.assign(data, {
        map: this.config.AMap
      })
      /* eslint-disable no-new */
      this.boundary.push(new window.AMap.Polyline(config))
    },

    /**
         * 设置图层
         */
    setBoundary (config = {
      strokeColor: 'red',
      strokeWeight: 1
    }) {
      // this.boundary.setOptions(config)
      this.boundary.forEach(v => {
        v.setOptions(config)
      })
    },

    /**
         * 删除图层
         */
    deletePolyBoundary () {
      // this.config.AMap.remove(this.boundary)
      // this.boundary = null
      this.boundary.forEach(v => {
        this.config.AMap.remove(v)
      })
      this.boundary = []
    }
  }
}
