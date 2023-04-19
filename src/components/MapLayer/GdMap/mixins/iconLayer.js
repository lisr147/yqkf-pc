export default class {
  constructor (map, config, data, clickEvent) {
    let layer = new window.Loca.IconLayer({
      map: map,
      eventSupport: true
    })
    layer.setOptions(config)
    layer.setData(data, {
      lnglat: function (obj) {
        let info = obj.value
        return [info.longitude, info.latitude]
      }
    })
    layer.render()
    if (config.isSetView) {
      layer.setFitView()
    }
    this.layer = layer
    this.layer.on('click', clickEvent)
  }
  delLayer () {
    this.layer.setMap(null)
  }
}
