import '@babel/polyfill'
import Vue from 'vue'
import App from './Supervision.vue'
import router from './router/supervision'
import * as ElementUI from './plugins/element'
Vue.use(ElementUI, { size: 'small' })

import Api from '@/api/api'
Vue.prototype.$Api = Api
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
