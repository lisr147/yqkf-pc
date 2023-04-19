import axios from "axios";
import { getToken } from "@/utils/auth";
import { Message, Loading } from "@/plugins/element";
const service = axios.create({
  timeout: 50 * 1000,
  withCredentials: true,
});
import Store from '@/store/index'

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["ajaxCall"] = true; // 添加该参数可避免url重定向到login
    let token = getToken();
    if (token && !config.withoutToken) {
      config.headers["Authorization"] = "Bearer " + getToken();
    }

    // 日志记录功能 @黄广聪 2022-5-30
    try{
    let app = document.getElementById('app')
    if (app && app.__vue__) {
      let vue = app.__vue__
      let path = vue.$route.path
      config.headers['Page-Url'] = location.href
        let pageName = vue.$route.meta.title || document.title
        const mobileUrl = [
            'supervision.html',//督察督办
            'mjcmryqx.html',//密接次密人员核查
            'yddgyjl.html',//药店的购药记录
            'hmryhc.html',//黄码人员核查
            'gfxgwry.html',//高风险岗位人员
            'driver.html',//司机预约
        ]
        // 移动端页面特殊处理
        mobileUrl.forEach(v => {
            if (location.href.includes(v)) {
                pageName = '移动端'
            }
        })

      config.headers['Page-Name'] = encodeURI(pageName)
      let lv1 = document.title
      try{
        let menuData = vue.$store?.state.authority.menuData||[]
        menuData.forEach(v => {
          if (path.includes(v.path)) {
            lv1 = v.name
          }
        })
      }
      catch (e) {
        console.error(e)
      }
    //   console.log('当前系统',lv1,pageName)
      config.headers['Page-MasterMoudle'] = encodeURI(lv1) //一级模块
      }
    }
    catch (e) {
      console.error(e)
    }
    // 日志记录功能END

    // 镇街权限控制，是否来自PC管理后台，加参数bm=true
    let isPCAdmin = !location.href.includes("big")
    if (isPCAdmin) {
      if (config.data && config.data.condition) {
        if (!config.url.includes('10091') && !config.url.includes('6006')) {
          // 一线工作人员不要bm权限过滤
          if (config.data.condition.templateId !== 6006) {
            config.data.condition = Object.assign({ 'bm': true }, config.data.condition)
          }
        }
      } else if (config.method === 'get' && config.params && config.params.templateId) {
        //哨点人员的核酸检测、疫苗接种统计、导出 镇街权限过滤
        if (!config.url.includes('10091') && !config.url.includes('6006')) {
          // 一线工作人员不要bm权限过滤
          config.params = Object.assign({ 'bm': true }, config.params)
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 接收拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

        //  GZ2000坐标统一处理
        if (Store.state.map.mapType==='gz2000'){
            // console.log('REQUEST RESPONSE', res)
            try{
                // 返回直接是数组
                if (Array.isArray(res.data) && res.data.length) {
                    if (res.data[0].hasOwnProperty('gzLongitude')) {
                        res.data = res.data.map(v => {
                            v.longitude = v.gzLongitude
                            v.latitude = v.gzLatitude
                            return v
                        })
                    }
                }
                // 返回是分页
                if (Array.isArray(res.data.data) && res.data.data.length){
                    if (res.data.data[0].hasOwnProperty('gzLongitude')){
                        res.data.data = res.data.data.map(v=>{
                            v.longitude = v.gzLongitude
                            v.latitude = v.gzLatitude
                            return v
                        })
                    }
                }
            }
            catch(e){
                // console.info(e)
            }
        }

    fitQueue(response.config);
    // 下载文件，返回的content-type不是json
    if (!response.headers["content-type"].includes("application/json")) {
    //   console.log(response);
      let data = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    //   console.log(data);
      var downloadUrl = window.URL.createObjectURL(data);
      var anchor = document.createElement("a");
      anchor.href = downloadUrl;
      let filename = response.headers["content-disposition"].split("=")[1];
      anchor.download = decodeURIComponent(filename);
      anchor.target = "_blank";
      anchor.click();
      window.URL.revokeObjectURL(data);
      return response;
    }

    if (parseInt(res.code) !== 1) {
      let { msg } = res;

      Message({
        message: msg || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(msg || "Error"));
    } else {
      return res.data;
    }
  },
  (error) => {
    console.error(error)
    let status = error.response.status;

    // 手机端不跳转到登录页面
    if (location.href.includes("yddgyjl.html")) {
      return;
    }
    if (location.href.includes("mjcmryqx.html")) {
      return;
    }
    if (location.href.includes("supervision.html")) {
      return;
    }
    if (location.href.includes("hmryhc.html")) {
      return;
    }
    if (location.href.includes("generateReport.html")) {
      return;
    }
    if (status === 401) {
      Message({
        message: "401: 会话过期，无操作权限，请重新登录" || "Error: " + status,
        type: "error",
        duration: 5 * 1000,
        onClose: function () {
          if (window.top !== window) {
            window.top.postMessage(
              "logout",
              process.env.VUE_APP_PARENT_ORIGIN || "*"
            );
          }
        },
      });
    } else if ([1000, 10004, 403].indexOf(status) > -1) {
      // 跳转到登录页面,如果在debug模式,则不跳转
      if (/debug=/.test(location.search) === false) {
        // document.location.href =
        //   document.location.origin +
        //   "/yqfk/cas_login?targetUrl=" +
        //   location.href;
          document.location.href = document.location.origin + '/yqfk/tenant_logout#url=' + encodeURIComponent(document.location.href)
        return;
      }
    } else {
      Message({
        message:
          error.response?.data?.msg || error.message || "Error: " + status,
        type: "error",
        duration: 5 * 1000,
      });
    }
    // 只要有返回config即认为请求已完成，从队列去除
    fitQueue(error.response.config);

    return Promise.reject(error);
  }
);

var loadingInstance;
var queue = [];

function wrapFn() {
  // 交互配置
  let ueConfig = arguments[0] || {};
  const { showLoading = true } = ueConfig;
  // 每个请求默认开启遮罩
  let showModal = true;
  if (
    ueConfig.method === "get" &&
    ueConfig.params &&
    ueConfig.params.showModal !== undefined
  ) {
    showModal = ueConfig.params.showModal;
  }
  if (
    ueConfig.method === "post" &&
    ueConfig.data &&
    ueConfig.data.showModal !== undefined
  ) {
    showModal = ueConfig.data.showModal;
  }

  if (showModal) {
    let _time = new Date().getTime();
    queue.push(_time);
    if (arguments[0].params) {
      arguments[0].params["_time"] = _time;
    } else {
      arguments[0].params = { _time };
    }
  }

  if (queue.length > 0 && showLoading) {
    loadingInstance = Loading.service({
      background: "rgba(0, 0, 0, 0.5)",
    });
  }

  return service.call(this, arguments[0]);
}

// 将完成的请求从队列中去除
function fitQueue(conf) {
  if (!conf.params) {
    return;
  }
  let matchIndex = queue.indexOf(conf.params["_time"]);
  if (matchIndex > -1) {
    queue.splice(matchIndex, 1);
  }
  if (loadingInstance && queue.length === 0) {
    loadingInstance.close();
  }
}

export default wrapFn;
