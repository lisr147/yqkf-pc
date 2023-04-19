export default class {
  constructor (map, config= {}, data) {
    this.map = map
    this.heatMap = {}
    let _this = this
    this.map.plugin(["AMap.Heatmap"], function() {
      _this.heatMap = new window.AMap.Heatmap(map, {
        radius: 35, //给定半径
        opacity: [0, 0.6],
        gradient:{
            0.5: 'blue',
            0.65: 'rgb(117,211,248)',
            0.7: 'rgb(0, 255, 0)',
            0.9: '#ffea00',
            1.0: 'red'
        },
        ...config
      })
      _this.heatMap.setDataSet({
        data,
        max: 20
      })
    })
  }
  delLayer () {
    this.map.remove(this.heatMap)
  }
}
