/**
 * 异步加载js文件
 * @param {String} url js地址
 * @param {Function} callback 加载回调函数
 */
export function loadScript(url, callback = () => {}) {
  return new Promise((resolve, reject) => {
    if (!isString(url) && !isFunction(callback)) return
    let script = document.createElement('script')
    script.charset = 'utf-8'
    script.src = url
    if (script.addEventListener) {
      script.addEventListener('load', function () {
        callback()
        resolve()
      }, false)
    } else if (script.attachEvent) {
      script.attachEvent('onreadystatechange', function () {
        var target = window.event.srcElement
        if (target.readyState === 'loaded') {
          callback()
          resolve()
        }
      })
    }
    document.head.appendChild(script)
  })

}

/**
 * 验证是否为字符串
 * @param {String} str 字符串
 */
export function isString(str) {
  if (typeof (str) === 'string') return true
  return false
}

/**
 * 验证是否为函数
 * @param {Function} fn 函数
 */
export function isFunction(fn) {
  if (typeof (fn) === 'function') return true
  return false
}