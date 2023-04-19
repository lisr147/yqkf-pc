import '@babel/polyfill'
import Vue from 'vue'
import App from './driver.vue'
import router from './router/driver'
import 'vant/lib/index.css';
import * as ElementUI from './plugins/element'
import EleForm from 'vue-ele-form'

Vue.use(EleForm)
Vue.use(ElementUI, { size: 'small' })

//住址
import AddressInput from '@/components/f-render/AddressInput/Default.vue'
Vue.component(AddressInput.name, AddressInput)

//图片上传组件
// import EleFormImageUploader from 'vue-ele-form-image-uploader'
import EleFormImageUploader from '@/components/f-render/ImageUploader/Index.vue'
Vue.component(EleFormImageUploader.name, EleFormImageUploader)

import { 
  Button,
  Search,
  Icon,
  List,
  Cell,
  Notify,
  Dialog
} from 'vant';

Vue.use(Button)
Vue.use(Search)
Vue.use(Icon)
Vue.use(List)
Vue.use(Cell)
Vue.use(Notify)
Vue.use(Dialog)

import Api from '@/api/api'
Vue.prototype.$Api = Api
Vue.config.productionTip = false
Vue.config.ignoredElements = ['wx-open-launch-weapp']

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
