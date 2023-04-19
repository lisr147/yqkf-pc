import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";

const GDtoGZ2000 = (lng, lat) => {
    let [x, y] = webMercatorUtils.lngLatToXY(lng, lat)
    let gzx0 = 40941.508496999675
    let gzy0 = 204908.65221174312
    let gdx0 = 12612285.425992
    let gdy0 = 2620771.3024563165

    let gzx1 = 81845.64651324705
    let gzy1 = 171534.68538652745
    let gdx1 = 12656550.079104338
    let gdy1 = 2584295.313620045

    console.log((x - gdx0) / (gdx1 - gdx0), ((gdx1 - gzx1) - (gdx0 - gzx0)), (gdx0 - gzx0))
    let rx = ((x - gdx0) / (gdx1 - gdx0)) * ((gdx1 - gzx1) - (gdx0 - gzx0)) + (gdx0 - gzx0)

    let ry = ((y - gdy0) / (gdy1 - gdy0)) * ((gdy1 - gzy1) - (gdy0 - gzy0)) + (gdy0 - gzy0)

    return { x: x - rx, y: y - ry }
}
export default GDtoGZ2000