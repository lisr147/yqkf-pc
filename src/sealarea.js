import '@babel/polyfill'
import Vue from 'vue'
import store from './store'
import App from './App.vue'
import router from './router/sealarea'
import * as ElementUI from './plugins/element'
import '@/directives/drag';
import './assets/icons/index';

import './assets/css/common.scss'
import './assets/css/screen.scss'
import "./permission-sealarea"

Vue.use(ElementUI, { size: 'small' })

// #禁止右键
document.oncontextmenu = function(){
    return false;
  }

// #禁止选中文字
document.onselectstart = function(){
    return false;
  }

document.body.oncopy = function () {
    // alert('禁止复制')
    return false;
}

Vue.config.productionTip = false
import Api from "@/api/api";
Vue.prototype.$Api = Api;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
