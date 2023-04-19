export default class {
  constructor (map, config, data) {
    this.map = map
    let gonObjs = []
    data.forEach(v => {
      let gConfig = Object.assign({}, {
        map,
        path: v.coordinates
      }, config)
      gonObjs.push(new window.AMap.Polygon(gConfig))
    })
    this.layer = gonObjs
  }
  delLayer () {
    this.map.remove(this.layer)
  }
}
