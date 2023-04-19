import ReconnectingWebSocket from "@/plugins/reconnecting-websocket.min";
import Store from "@/store/index";

// 接收来自其他页面的消息
// 改变自己的localstorage并不会触发事件
// 当前多个页面共用一个ws，后面新开的页面会抢占旧页面的ws资源
// window.addEventListener('storage', function (event) {
//   // 仅接受alarmMsg类型的storage事件
//   if (event.key === 'alarmMsg' && event.newValue !== null) {
//     try {
//       var newData = JSON.parse(event.newValue)
//       store.dispatch('message/addAlarm', newData)
//     } catch (e) {
//       console.log(e)
//     }
//   }
// })

/**
 * 初始化websocket
 */
export function initWebsocket({ url }) {
  const ws = new ReconnectingWebSocket(url, null, { reconnectInterval: 3000 });
  // 接收错误信号
  ws.onerror = function (e) {
    console.error("ws error", e);
  };
  return ws;
}

/**
 * 初始化postMessage消息接收
 */
export function initAlarmWatcher() {
  if (!window._alarm_watcher) {
    const { host, protocol } = location;
    const { userId } = Store.getters;
    const url = `${protocol.includes("https") ? "wss" : "ws"}://${
      process.env.NODE_ENV === "production"
        ? `${host}`
        : `dn.product.iot-cas.com:8081`
    }/yqfk/websocket/alarm/${userId}`;
    window._alarm_watcher = initWebsocket({ url });
  }
  return window._alarm_watcher;
}

/**
 * 初始化封控区管理的websocket消息接收
 * @returns {*}
 */
export function initDispatchWatcher() {
  if (!window._sealarea_watcher) {
    const { host, protocol } = location;
    const { userId } = Store.getters;
    const url = `${protocol.includes("https") ? "wss" : "ws"}://${
      process.env.NODE_ENV === "production"
        ? `${host}`
        : `dn.product.iot-cas.com:8081`
    }/yqfk/websocket/voiceToText/${userId}`;
    window._sealarea_watcher = initWebsocket({ url });
  }
  return window._sealarea_watcher;
}

/**
 * 初始化websocket消息接收
 * @param {string} name 全局socket名称
 * @returns socket
 */
export function initWatcher(name) {
  if (!window[name]) {
    const { host, protocol } = location;
    const { userId } = Store.getters;
    const url = `${protocol.includes("https") ? "wss" : "ws"}://${
      process.env.NODE_ENV === "production"
        ? `${host}`
        : `dn.product.iot-cas.com:8081`
    }/yqfk/websocket/voiceToText/${userId}`;
    window[name] = initWebsocket({ url });
  }
  return window[name];
}
