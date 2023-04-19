export default class {
  constructor (map, config, data) {
    this.map = map
    this.markerObjs = []
    data.forEach(v => {
      const config = Object.assign({}, v, { map: map })
      this.markerObjs.push(new window.AMap.Marker(config))
    })
  }
  delLayer () {
    this.markerObjs.forEach(v => {
      this.map.remove(v)
    })
  }
}
