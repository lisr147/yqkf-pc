var mainMaps = {}
// import {
//   Dialog,
// } from 'vant'
/**
 * 获取地图
 */
export function getMap(id = 'map1') {
  return mainMaps[id]
}

export function setMap(id, map){
  if (mainMaps[id]) {
    console.error(`地图id ${id} 已存在，请使用其他id`)
  }else{
    mainMaps[id] = map
  }
}

/**
 * 初始化地图
 * @param dom 地图容器
 * @param id 地图id，页面存在多个地图时需指定
 * @param zoom 当前缩放成都
 * @param viewMode 3D 2D模式
 * @param rotation 旋转角度
 * @param pitch 俯视角度
 * @returns {Promise<any>}
 */
export function initMap({dom, id = 'map1', zoom = 11, viewMode = '2D', rotation = 0, pitch = 30}) {
  return new Promise((resolve, reject) => {

    loadFile().then(() => {
      // console.log('loadFile')
      let container = dom || 'container'
      let map = new AMap.Map(container, {
        center: [113.533339, 22.794258],
        resizeEnable: true,
        zooms: [3, 20],
        viewMode,
        defaultCursor: 'default',
        pitch: pitch,
        mapStyle: 'amap://styles/whitesmoke',
        expandZoomRange: true,
        rotation: rotation,
        zoom: zoom
      })
      setMap(id, map)
      resolve(map)

    }).catch(err => {
      reject(err)
    })

  })

}

/**
 * 销毁地图
*/
export function destroyMap(id = 'map1') {
  console.log('destroy Map ' + id)
  let map = getMap(id)
  if (map) {
    map.destroy()
    delete(mainMaps[id])
  }
}

/**
 * 加载地图文件
 */
export function loadFile () {

  return new Promise((resolve, reject) => {

    if (window.AMap) {
      resolve()
    } else {
      // 加载maps.js
      var url = 'https://webapi.amap.com/maps?v=1.4.15&key=96c44e4b9d6a4bb04b520127932bdf0e&callback=_mapLoaded'
      var jsapi = document.createElement('script')
      jsapi.charset = 'utf-8'
      jsapi.src = url
      document.head.appendChild(jsapi)
    //   jsapi.onerror = function () {
    //     Dialog({
    //   message: '网络连接错误',
    // }).then(() => {
    //   // location.reload()
    //   queue = []
    //   loadingInstance.clear()
    // }).catch(() => {
    //   // on cancel
    // })
    //     reject(new Error('地图API文件加载失败'))
        
    //   }
      jsapi.onload = function(){
        // resolve()
      }
    }

    // 加载ui.js
    window._mapLoaded = function () {

      const url = `https://webapi.amap.com/ui/1.1/main.js`
      var jsapi = document.createElement('script')
      jsapi.charset = 'utf-8'
      jsapi.src = url
      document.head.appendChild(jsapi)
      jsapi.onload = function () {
        resolve()
      }
      jsapi.onerror = function () {
        Dialog({
      message: '网络连接错误',
    }).then(() => {
      // location.reload()
      queue = []
      loadingInstance.clear()
    }).catch(() => {
      // on cancel
    })
        reject(new Error('AMapUI 组件文件加载失败'))
      }
    }

  })

}

/**
 * 创建一个地图位置获取器
 */
export function getGeoLoation(onCompleteFn, onErrorFn){

  return new Promise((resolve, reject) => {

    loadFile().then(()=>{

      AMap.plugin('AMap.Geolocation', () => {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        })

        resolve(geolocation)

      })

    })

  })

}

export default getMap()
