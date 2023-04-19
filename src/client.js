import '@babel/polyfill'
import Vue from 'vue'
import App from './Client.vue'
import router from './router/client'

// 表单渲染使用eleform即可
import EleForm from 'vue-ele-form'
// import FRender from '@/components/f-render-core/f-render.vue'
import * as ElementUI from './plugins/element'

import './assets/css/client.scss'

//图片上传组件
// import EleFormImageUploader from 'vue-ele-form-image-uploader'
import EleFormImageUploader from '@/components/f-render/ImageUploader/Index.vue'
Vue.component(EleFormImageUploader.name, EleFormImageUploader)

//文件上传组件
// import EleFormUploadFile from 'vue-ele-form-upload-file'
import EleFormUploadFile from '@/components/f-render/UploaderFile/Index.vue'
Vue.component('UploadFile', EleFormUploadFile)

//手机号码验证
import MobileValidator from '@/components/f-render/MobileValidator/Index.vue'
Vue.component(MobileValidator.name, MobileValidator)

//住址
import AddressInput from '@/components/f-render/AddressInput/Default.vue'
Vue.component(AddressInput.name, AddressInput)

// 所在位置
import LocationPicker from '@/components/f-render/LocationPicker/Index.vue'
Vue.component(LocationPicker.name, LocationPicker)

// 手机和身份证输入
import input from 'vue-ele-form/lib/components/EleFormInput.vue'
Vue.component('IdCardNo', input)
Vue.component('MobileInput', input)

// 带输入框的单选/多选
import RadioInput from '@/components/f-render/radioInput/Index.vue'
Vue.component('RadioInput', RadioInput)
import CheckboxInput from '@/components/f-render/CheckboxInput/Index.vue'
Vue.component('CheckboxInput', CheckboxInput)

// 日期和时间范围（代替原组件）
import DateTimeRange2 from '@/components/f-render/DateTimeRange2/Index.vue'
Vue.component('DateTimeRange2', DateTimeRange2)

Vue.use(ElementUI, { size: 'small' })
Vue.use(EleForm)
// Vue.component('f-render', FRender)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
