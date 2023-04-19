import Moment from 'moment'
import {Loading} from 'element-ui'

/**
 *@Description: 判断对象是否为数组
 */
export function isArray (data) {
  if (!Array.isArray) {
    Array.isArray = function (data) {
      return Object.prototype.toString.call(data) === '[object Array]'
    }
  } else {
    return Array.isArray(data) ? data : [data]
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 获取随机id
 * @returns {number}
 */
export function getRandomId() {
  return parseInt(Math.random() * 100000)
}

/**
 * 格式化时间
 * @param val
 * @returns {string}
 */
export function formatTime(val){
  return Moment(val).format('YYYY-MM-DD HH:mm:ss')
}


/**
 * 显示加载中遮罩层
 */
var loadingMask

export function showLoading({text = '数据加载中'} = {}) {
  loadingMask = Loading.service({
    lock: true,
    text,
    // spinner: 'el-icon-loading',
    // background: 'rgba(0, 0, 0, 0.7)',
    customClass:"loading-mask"
  })
}

/**
 * 关闭加载中遮罩层
 */
export function hideLoading () {
  if (loadingMask && loadingMask.close) {
    loadingMask.close()
    loadingMask = null
  }
}

/**
 * 获取视频播放地址
 * @param deviceUid
 * @param modelCode
 * @param propertyValueMap
 * @returns {string}
 */
export function getVideoPlayerUrl({deviceUid, modelCode, propertyValueMap, suffix=''}) {
  let res = ''
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : ''

  // 城管云摄像头使用特定播放器
  if (modelCode === 'CGYCamera') {
    res = `${location.origin}${baseUrl}/player/qufu/mplayer.html?id=${deviceUid}&width=380&height=228`
  } else {
    const playUrl = Object.values(propertyValueMap).find(e => e.propName == '直播地址')['propValue']
    res = `${location.origin}${baseUrl}/player/liveplayer/player.html?deviceUid=${deviceUid}&width=380&height=228&videoUrl=${playUrl}`
  }
  return res + suffix
}
//格式化日期
export function formatDate(val){
  return Moment(val).format('YYYY-MM-DD')
}


//设置全屏
export function setFullScreen(ele) {
  if(!ele){
    ele = document.body
  }

  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  }
}
//设置全屏
export function exitFullScreen() {
  if (document.exitFullScreen) {
    document.exitFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
