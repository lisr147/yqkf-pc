import ReconnectingWebSocket from '@/plugins/reconnecting-websocket.min'
import Store from '@/store/index'

const WEBSOCKET_MAP = {
  voice: {url: `websocket/voiceToText/`},
  alarm: {url: `websocket/alarm/`}
}

/**
 * Webscoket消息观察者
 * @type {Watcher}
 * @private
 */
const _watcher = class Watcher {

  constructor(conf) {
    this.name = conf.name
    this.url = this.getUrl(conf.type)
    this.scope = conf.scope

    this.fnList = []
    this.init()
  }

  getUrl(type){
    const {host, protocol} = location
    const {userId} = Store.getters
    const url = `${protocol.includes('https') ? 'wss' : 'ws'}://${process.env.NODE_ENV === 'production' ? `${host}` : `dn.product.iot-cas.com:8081`}/yqfk/${WEBSOCKET_MAP[type].url}${userId}`
    return url
  }

  init(){
    const ws =  new ReconnectingWebSocket(this.url, null, { reconnectInterval: 3000 })
    ws.onopen = (e) => {
      console.log('ws open')
    }
    ws.onclose = (e) => {
      console.log('ws close')
    }
    ws.onmessage = (e) => {
      if (e.data == 'WebSocket连接成功') {
        return
      }
      try {
        const data = JSON.parse(e.data)
        //存入缓存供其他页面接收
        localStorage.setItem(`_websocket`, JSON.stringify({watcherName: this.name, data}))
        //执行监听函数
        this.queue(data)
      } catch (err) {
        console.error(err)
      }

    }
    ws.onerror = (e) => {
      console.log('ws error', e)
    }
    window[`_watcher_${this.name}`] = ws
  }

  destroy(){
    const ws = window[`_watcher_${this.name}`]
    if(ws){
      ws.close()
    }
    delete window[`_watcher_${this.name}`]
  }

  /**
   * 增加监听函数
   * @param watcherName
   * @param fn
   */
  addListener(fn){
    if (typeof fn == "function") {
      this.fnList.push(fn)
    }else{
      console.error(`添加监听对象必须为函数`)
    }
  }

  /**
   * 删除指定监听器下所有监听函数
   * @param watcherName
   */
  removeListener(){
    this.fnList = []
  }

  // 按顺序执行函数
  queue(msg) {
    for (let i = 0; i < this.fnList.length; i++) {
      this.fnList[i].apply(this.scope, [msg])
    }
  }

}

export default _watcher

// 接收来自其他页面的消息
// 改变自己的localstorage并不会触发事件
// 当前多个页面共用一个ws，后面新开的页面会抢占旧页面的ws资源
// window.addEventListener('storage', function (event) {
//
//   if (event.key === '_websocket' && event.newValue !== null) {
//     try {
//       const {watcherName, msg} = JSON.parse(event.newValue)
//       window[`_watcher_${watcherName}`].queue(msg)
//     } catch (e) {
//       console.log(e)
//     }
//   }
// })


